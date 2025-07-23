-- =============================================================================
-- MIGRAÇÃO COMPLETA PARA CORREÇÃO DO SUPABASE
-- =============================================================================

-- 1. CORRIGIR SEARCH_PATH DAS FUNÇÕES EXISTENTES
-- =============================================================================

-- Função para atualizar timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Função para verificar se usuário é admin
CREATE OR REPLACE FUNCTION public.check_if_user_is_admin(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_id = $1 
    AND role = 'admin'
  );
END;
$$;

-- Função para bootstrap de admin
CREATE OR REPLACE FUNCTION public.bootstrap_admin_role(admin_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  admin_count integer;
BEGIN
  SELECT COUNT(*) INTO admin_count FROM public.user_roles WHERE role = 'admin';
  
  IF admin_count = 0 THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_user_id, 'admin');
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;

-- Função para verificar role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  admin_check BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  ) INTO admin_check;

  RETURN admin_check;
END;
$$;

-- 2. FUNÇÃO PRINCIPAL PARA CRIAÇÃO AUTOMÁTICA DE USUÁRIOS
-- =============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  asaas_record RECORD;
BEGIN
  -- Inserir o perfil básico com role padrão 'user'
  INSERT INTO public.profiles (
    id, 
    email,
    username,
    full_name,
    avatar_url,
    updated_at,
    role
  ) VALUES (
    new.id, 
    new.email,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    COALESCE(new.raw_user_meta_data->>'avatar_url', ''),
    now(),
    'user'
  );
  
  -- Inserir role padrão na tabela user_roles
  INSERT INTO public.user_roles (user_id, role, email, name)
  VALUES (
    new.id, 
    'user', 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', '')
  )
  ON CONFLICT (user_id, role) DO NOTHING;
  
  -- Tentar vincular com cliente Asaas existente (se houver) pelo email
  IF new.email IS NOT NULL THEN
    SELECT * INTO asaas_record FROM public.asaas_customers 
    WHERE email = new.email 
    LIMIT 1;
    
    IF FOUND THEN
      UPDATE public.asaas_customers 
      SET user_id = new.id
      WHERE email = new.email AND (user_id IS NULL OR user_id = '');
      
      UPDATE public.profiles 
      SET has_asaas_customer = true
      WHERE id = new.id;
    END IF;
  END IF;
  
  RETURN new;
END;
$$;

-- 3. CRIAR TRIGGER PARA NOVOS USUÁRIOS
-- =============================================================================

-- Remover trigger existente se houver
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Criar novo trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. FUNÇÃO PARA PROCESSAMENTO DE QUIZ COMPLETO (CORRIGIDA)
-- =============================================================================

CREATE OR REPLACE FUNCTION public.process_quiz_completion(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
DECLARE
  v_submission_id UUID;
  v_email TEXT;
  v_full_name TEXT;
  v_company_name TEXT;
  v_completed_at TIMESTAMP WITH TIME ZONE;
  v_answer_record RECORD;
  v_result_id UUID;
BEGIN
  -- Obter informações da submissão
  SELECT s.id, s.email, s.completed_at INTO v_submission_id, v_email, v_completed_at
  FROM public.quiz_submissions s
  WHERE s.user_id = p_user_id AND s.completed = true
  ORDER BY s.completed_at DESC
  LIMIT 1;
  
  -- Se não encontrou submissão completa, retornar
  IF v_submission_id IS NULL THEN
    RETURN;
  END IF;
  
  -- Obter nome completo e empresa do perfil
  SELECT p.full_name, p.company_name INTO v_full_name, v_company_name
  FROM public.profiles p
  WHERE p.id = p_user_id;
  
  -- Verificar se já existe um registro para esta submissão
  SELECT id INTO v_result_id
  FROM public.quiz_respostas_completas
  WHERE submission_id = v_submission_id;
  
  -- Se já existe, apenas atualizar campos gerais e retornar
  IF v_result_id IS NOT NULL THEN
    UPDATE public.quiz_respostas_completas
    SET 
      completed = true,
      completed_at = v_completed_at,
      updated_at = now()
    WHERE id = v_result_id;
    
    RETURN;
  END IF;
  
  -- Inicializar um novo registro com os campos de identificação
  INSERT INTO public.quiz_respostas_completas (
    user_id, 
    submission_id, 
    email, 
    full_name, 
    company_name, 
    completed, 
    completed_at
  ) VALUES (
    p_user_id,
    v_submission_id,
    v_email,
    v_full_name,
    v_company_name,
    true,
    v_completed_at
  ) RETURNING id INTO v_result_id;
  
  -- Processar cada resposta e mapear para o campo correto
  FOR v_answer_record IN (
    SELECT 
      q.text AS question_text, 
      a.answer,
      q.id AS question_id,
      m.order_number AS module_number
    FROM 
      public.quiz_answers a
      JOIN public.quiz_questions q ON a.question_id = q.id
      JOIN public.quiz_modules m ON q.module_id = m.id
    WHERE 
      a.user_id = p_user_id
    ORDER BY 
      m.order_number, q.order_number
  ) LOOP
    
    IF v_answer_record.module_number = 1 THEN
      -- Módulo 1: Identificação
      IF v_answer_record.question_text ILIKE '%nome%completo%' THEN
        UPDATE public.quiz_respostas_completas SET m1_nome = v_answer_record.answer WHERE id = v_result_id;
      ELSIF v_answer_record.question_text ILIKE '%email%' THEN
        UPDATE public.quiz_respostas_completas SET m1_email = v_answer_record.answer WHERE id = v_result_id;
      ELSIF v_answer_record.question_text ILIKE '%telefone%' OR v_answer_record.question_text ILIKE '%whatsapp%' THEN
        UPDATE public.quiz_respostas_completas SET m1_telefone = v_answer_record.answer WHERE id = v_result_id;
      ELSIF v_answer_record.question_text ILIKE '%cargo%' OR v_answer_record.question_text ILIKE '%função%' THEN
        UPDATE public.quiz_respostas_completas SET m1_cargo = v_answer_record.answer WHERE id = v_result_id;
      ELSIF v_answer_record.question_text ILIKE '%empresa%' OR v_answer_record.question_text ILIKE '%companhia%' THEN
        UPDATE public.quiz_respostas_completas SET m1_empresa = v_answer_record.answer WHERE id = v_result_id;
      END IF;
      
    ELSIF v_answer_record.module_number = 2 THEN
      -- Módulo 2: Sobre a Empresa
      IF v_answer_record.question_text ILIKE '%segmento%' OR v_answer_record.question_text ILIKE '%indústria%' THEN
        UPDATE public.quiz_respostas_completas SET m2_segmento = v_answer_record.answer WHERE id = v_result_id;
      ELSIF v_answer_record.question_text ILIKE '%funcionários%' OR v_answer_record.question_text ILIKE '%colaboradores%' THEN
        UPDATE public.quiz_respostas_completas SET m2_funcionarios = v_answer_record.answer WHERE id = v_result_id;
      ELSIF v_answer_record.question_text ILIKE '%localização%' OR v_answer_record.question_text ILIKE '%cidade%' THEN
        UPDATE public.quiz_respostas_completas SET m2_localizacao = v_answer_record.answer WHERE id = v_result_id;
      ELSIF v_answer_record.question_text ILIKE '%site%' OR v_answer_record.question_text ILIKE '%website%' THEN
        UPDATE public.quiz_respostas_completas SET m2_site = v_answer_record.answer WHERE id = v_result_id;
      ELSIF v_answer_record.question_text ILIKE '%tempo%atuação%' OR v_answer_record.question_text ILIKE '%fundada%' THEN
        UPDATE public.quiz_respostas_completas SET m2_tempo_atuacao = v_answer_record.answer WHERE id = v_result_id;
      ELSIF v_answer_record.question_text ILIKE '%faturamento%' OR v_answer_record.question_text ILIKE '%receita%' THEN
        UPDATE public.quiz_respostas_completas SET m2_faturamento = v_answer_record.answer WHERE id = v_result_id;
      END IF;
      
    ELSIF v_answer_record.module_number = 3 THEN
      -- Módulo 3: Presença Digital
      IF v_answer_record.question_text ILIKE '%instagram%empresa%' OR v_answer_record.question_text ILIKE '%@%empresa%' THEN
        UPDATE public.quiz_respostas_completas SET m3_instagram_empresa = v_answer_record.answer WHERE id = v_result_id;
      ELSIF v_answer_record.question_text ILIKE '%instagram%concorrente%a%' THEN
        UPDATE public.quiz_respostas_completas SET m3_instagram_concorrente_a = v_answer_record.answer WHERE id = v_result_id;
      ELSIF v_answer_record.question_text ILIKE '%instagram%concorrente%b%' THEN
        UPDATE public.quiz_respostas_completas SET m3_instagram_concorrente_b = v_answer_record.answer WHERE id = v_result_id;
      ELSIF v_answer_record.question_text ILIKE '%instagram%concorrente%c%' THEN
        UPDATE public.quiz_respostas_completas SET m3_instagram_concorrente_c = v_answer_record.answer WHERE id = v_result_id;
      ELSIF v_answer_record.question_text ILIKE '%presença%digital%' OR v_answer_record.question_text ILIKE '%redes sociais%' THEN
        UPDATE public.quiz_respostas_completas SET m3_presenca_digital = v_answer_record.answer WHERE id = v_result_id;
      ELSIF v_answer_record.question_text ILIKE '%principais%canais%' THEN
        UPDATE public.quiz_respostas_completas SET m3_principais_canais = v_answer_record.answer WHERE id = v_result_id;
      END IF;
      
    ELSIF v_answer_record.module_number = 4 THEN
      -- Módulo 4: Marketing Atual
      IF v_answer_record.question_text ILIKE '%desafios%atuais%' THEN
        UPDATE public.quiz_respostas_completas SET m4_desafios_atuais = v_answer_record.answer WHERE id = v_result_id;
      ELSIF v_answer_record.question_text ILIKE '%ações%marketing%' THEN
        UPDATE public.quiz_respostas_completas SET m4_acoes_marketing = v_answer_record.answer WHERE id = v_result_id;
      ELSIF v_answer_record.question_text ILIKE '%atuais%campanhas%' THEN
        UPDATE public.quiz_respostas_completas SET m4_atuais_campanhas = v_answer_record.answer WHERE id = v_result_id;
      ELSIF v_answer_record.question_text ILIKE '%investimento%marketing%' THEN
        UPDATE public.quiz_respostas_completas SET m4_investimento_marketing = v_answer_record.answer WHERE id = v_result_id;
      END IF;
      
    ELSIF v_answer_record.module_number = 5 THEN
      -- Módulo 5: Comercial
      IF v_answer_record.question_text ILIKE '%estratégia%comercial%' THEN
        UPDATE public.quiz_respostas_completas SET m5_estrategia_comercial = v_answer_record.answer WHERE id = v_result_id;
      ELSIF v_answer_record.question_text ILIKE '%canais%vendas%' THEN
        UPDATE public.quiz_respostas_completas SET m5_canais_vendas = v_answer_record.answer WHERE id = v_result_id;
      ELSIF v_answer_record.question_text ILIKE '%processo%vendas%' THEN
        UPDATE public.quiz_respostas_completas SET m5_processo_vendas = v_answer_record.answer WHERE id = v_result_id;
      ELSIF v_answer_record.question_text ILIKE '%equipe%comercial%' THEN
        UPDATE public.quiz_respostas_completas SET m5_equipe_comercial = v_answer_record.answer WHERE id = v_result_id;
      ELSIF v_answer_record.question_text ILIKE '%metas%vendas%' THEN
        UPDATE public.quiz_respostas_completas SET m5_metas_vendas = v_answer_record.answer WHERE id = v_result_id;
      ELSIF v_answer_record.question_text ILIKE '%sistema%crm%' THEN
        UPDATE public.quiz_respostas_completas SET m5_sistema_crm = v_answer_record.answer WHERE id = v_result_id;
      END IF;
      
    ELSIF v_answer_record.module_number = 6 THEN
      -- Módulo 6: Diagnóstico e Expectativas
      IF v_answer_record.question_text ILIKE '%principais%desafios%' THEN
        UPDATE public.quiz_respostas_completas SET m6_principais_desafios = v_answer_record.answer WHERE id = v_result_id;
      ELSIF v_answer_record.question_text ILIKE '%resultados%esperados%' THEN
        UPDATE public.quiz_respostas_completas SET m6_resultados_esperados = v_answer_record.answer WHERE id = v_result_id;
      ELSIF v_answer_record.question_text ILIKE '%prazo%resultados%' THEN
        UPDATE public.quiz_respostas_completas SET m6_prazo_resultados = v_answer_record.answer WHERE id = v_result_id;
      ELSIF v_answer_record.question_text ILIKE '%expectativas%' THEN
        UPDATE public.quiz_respostas_completas SET m6_expectativas = v_answer_record.answer WHERE id = v_result_id;
      END IF;
      
    ELSIF v_answer_record.module_number = 7 THEN
      -- Módulo 7: Informações Adicionais
      IF v_answer_record.question_text ILIKE '%detalhes%adicionais%' OR v_answer_record.question_text ILIKE '%informações%adicionais%' THEN
        UPDATE public.quiz_respostas_completas SET m7_detalhes_adicionais = v_answer_record.answer WHERE id = v_result_id;
      ELSIF v_answer_record.question_text ILIKE '%como%conheceu%' THEN
        UPDATE public.quiz_respostas_completas SET m7_como_conheceu = v_answer_record.answer WHERE id = v_result_id;
      ELSIF v_answer_record.question_text ILIKE '%preferência%contato%' THEN
        UPDATE public.quiz_respostas_completas SET m7_preferencia_contato = v_answer_record.answer WHERE id = v_result_id;
      END IF;
    END IF;
    
  END LOOP;
  
  RETURN;
END;
$$;

-- 5. TRIGGER PARA PROCESSAMENTO DE QUIZ COMPLETION
-- =============================================================================

CREATE OR REPLACE FUNCTION public.process_new_quiz_completion()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
BEGIN
  -- Quando um questionário for marcado como completo
  IF NEW.completed IS TRUE AND OLD.completed IS DISTINCT FROM NEW.completed THEN
    -- Processar respostas e criar/atualizar registro na tabela simplificada
    PERFORM public.process_quiz_completion(NEW.user_id);
  END IF;

  RETURN NEW;
END;
$$;

-- Remover trigger anterior se existir
DROP TRIGGER IF EXISTS on_quiz_completion ON public.quiz_submissions;

-- Criar novo trigger
CREATE TRIGGER on_quiz_completion
  AFTER UPDATE ON public.quiz_submissions
  FOR EACH ROW EXECUTE FUNCTION public.process_new_quiz_completion();

-- 6. TRIGGER PARA WEBHOOK DO MAKE
-- =============================================================================

CREATE OR REPLACE FUNCTION public.notify_make_respostas_completas()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
BEGIN
  -- Evitar processamento duplicado verificando a flag
  IF NEW.webhook_processed IS NOT TRUE AND NEW.completed IS TRUE THEN
    -- Enviar dados para o webhook do Make.com usando net.http_post
    PERFORM 
      net.http_post(
        url := 'https://hook.eu2.make.com/wpbbjokh8cexvd1hql9i7ae6uyf32bzh',
        body := row_to_json(NEW),
        headers := '{"Content-Type": "application/json"}'::jsonb
      );
      
    -- Marcar como processado após envio
    UPDATE public.quiz_respostas_completas 
    SET webhook_processed = true 
    WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$;

-- Remover trigger anterior se existir
DROP TRIGGER IF EXISTS trigger_notify_make_respostas_completas ON public.quiz_respostas_completas;

-- Criar novo trigger para webhook
CREATE TRIGGER trigger_notify_make_respostas_completas
  AFTER INSERT OR UPDATE ON public.quiz_respostas_completas
  FOR EACH ROW EXECUTE FUNCTION public.notify_make_respostas_completas();

-- 7. FUNÇÃO PARA ATUALIZAR EMAIL NOS QUIZ SUBMISSIONS
-- =============================================================================

CREATE OR REPLACE FUNCTION public.update_quiz_submission_email()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
DECLARE
  user_email TEXT;
BEGIN
  -- Obter o email do usuário
  SELECT email INTO user_email FROM auth.users WHERE id = NEW.user_id;
  
  -- Atualizar o campo de email
  NEW.email := user_email;
  
  RETURN NEW;
END;
$$;

-- Remover trigger anterior se existir
DROP TRIGGER IF EXISTS update_quiz_submission_email_trigger ON public.quiz_submissions;

-- Criar trigger para atualizar email
CREATE TRIGGER update_quiz_submission_email_trigger
  BEFORE INSERT OR UPDATE ON public.quiz_submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_quiz_submission_email();

-- 8. CORRIGIR OUTRAS FUNÇÕES COM SEARCH_PATH
-- =============================================================================

CREATE OR REPLACE FUNCTION public.increment_material_access_count(material_id uuid)
RETURNS void
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
BEGIN
  UPDATE public.materials
  SET access_count = access_count + 1
  WHERE id = material_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_system_setting(setting_key text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  setting_value TEXT;
BEGIN
  SELECT value INTO setting_value 
  FROM public.system_settings 
  WHERE key = setting_key;
  
  RETURN setting_value;
END;
$$;

-- 9. ATUALIZAR TRIGGERS DE TIMESTAMP
-- =============================================================================

-- Adicionar triggers de timestamp onde necessário
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_materials_updated_at ON public.materials;
CREATE TRIGGER update_materials_updated_at
  BEFORE UPDATE ON public.materials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_testimonials_updated_at ON public.testimonials;
CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_asaas_customers_updated_at ON public.asaas_customers;
CREATE TRIGGER update_asaas_customers_updated_at
  BEFORE UPDATE ON public.asaas_customers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================================================
-- FIM DA MIGRAÇÃO
-- =============================================================================