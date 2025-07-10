
-- Criar tabela para gerenciar palestras disponíveis
CREATE TABLE public.lectures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  speaker TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para leads de eventos/palestras
CREATE TABLE public.event_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lecture_id UUID REFERENCES public.lectures(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company_name TEXT,
  instagram TEXT,
  lecture_date DATE,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'novo',
  material_sent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS nas tabelas
ALTER TABLE public.lectures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_leads ENABLE ROW LEVEL SECURITY;

-- Políticas para lectures
CREATE POLICY "Todos podem visualizar palestras ativas" 
ON public.lectures 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins podem gerenciar palestras" 
ON public.lectures 
FOR ALL 
USING (is_admin());

-- Políticas para event_leads
CREATE POLICY "Qualquer pessoa pode inserir leads" 
ON public.event_leads 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins podem gerenciar todos os leads" 
ON public.event_leads 
FOR ALL 
USING (is_admin());

CREATE POLICY "Usuários podem ver seus próprios leads" 
ON public.event_leads 
FOR SELECT 
USING (auth.uid()::text = id::text OR is_admin());

-- Trigger para updated_at
CREATE TRIGGER update_lectures_updated_at
BEFORE UPDATE ON public.lectures
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_event_leads_updated_at
BEFORE UPDATE ON public.event_leads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir palestras fictícias iniciais
INSERT INTO public.lectures (title, description, speaker) VALUES
('Estratégias de Marketing - O que funciona em 2025', 'Descubra as estratégias de marketing mais eficazes para impulsionar seu negócio no cenário atual.', 'Helder Marques'),
('Liderança Feminina no Empreendedorismo', 'Como desenvolver habilidades de liderança e se destacar no mundo dos negócios.', 'Helder Marques'),
('Transformação Digital para Pequenas Empresas', 'Aprenda a digitalizar seus processos e aumentar a eficiência do seu negócio.', 'Helder Marques'),
('Vendas Consultivas: Como Vender Mais e Melhor', 'Técnicas avançadas de vendas para aumentar seu faturamento e fidelizar clientes.', 'Helder Marques'),
('Gestão Financeira para Empreendedores', 'Domine as finanças do seu negócio e tome decisões mais assertivas.', 'Helder Marques'),
('Presença Digital que Converte', 'Construa uma presença online forte que gera leads e vendas para seu negócio.', 'Helder Marques');
