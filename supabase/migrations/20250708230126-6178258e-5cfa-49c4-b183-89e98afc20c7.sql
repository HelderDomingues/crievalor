-- Criação das tabelas para WhatsApp Business e captação de leads

-- Tabela para conversas do WhatsApp
CREATE TABLE IF NOT EXISTS public.whatsapp_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  conversation_status TEXT DEFAULT 'active' CHECK (conversation_status IN ('active', 'closed', 'archived')),
  lead_qualification TEXT CHECK (lead_qualification IN ('hot', 'warm', 'cold', 'not_qualified')),
  source TEXT DEFAULT 'website',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Tabela para mensagens do WhatsApp
CREATE TABLE IF NOT EXISTS public.whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.whatsapp_conversations(id) ON DELETE CASCADE,
  message_id TEXT, -- ID da mensagem do WhatsApp
  phone_number TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('incoming', 'outgoing')),
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'audio', 'video', 'document')),
  content TEXT,
  media_url TEXT,
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Tabela para leads capturados
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT,
  phone TEXT NOT NULL,
  company_name TEXT,
  service_interest TEXT,
  lead_source TEXT NOT NULL DEFAULT 'whatsapp',
  qualification TEXT CHECK (qualification IN ('hot', 'warm', 'cold', 'not_qualified')),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  whatsapp_conversation_id UUID REFERENCES public.whatsapp_conversations(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Tabela para diagnósticos gratuitos solicitados
CREATE TABLE IF NOT EXISTS public.diagnostic_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company_name TEXT,
  company_size TEXT,
  main_challenge TEXT,
  current_revenue TEXT,
  desired_results TEXT,
  timeline TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'completed', 'cancelled')),
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  scheduled_date TIMESTAMP WITH TIME ZONE,
  completed_date TIMESTAMP WITH TIME ZONE,
  report_generated BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_whatsapp_conversations_phone ON public.whatsapp_conversations(phone_number);
CREATE INDEX IF NOT EXISTS idx_whatsapp_conversations_status ON public.whatsapp_conversations(conversation_status);
CREATE INDEX IF NOT EXISTS idx_whatsapp_conversations_updated ON public.whatsapp_conversations(updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_conversation ON public.whatsapp_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_phone ON public.whatsapp_messages(phone_number);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_created ON public.whatsapp_messages(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_leads_phone ON public.leads(phone);
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_source ON public.leads(lead_source);

CREATE INDEX IF NOT EXISTS idx_diagnostic_requests_email ON public.diagnostic_requests(email);
CREATE INDEX IF NOT EXISTS idx_diagnostic_requests_status ON public.diagnostic_requests(status);

-- RLS Policies
ALTER TABLE public.whatsapp_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnostic_requests ENABLE ROW LEVEL SECURITY;

-- Políticas para conversas WhatsApp
CREATE POLICY "Admins can manage all conversations" ON public.whatsapp_conversations
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can view their own conversations" ON public.whatsapp_conversations
  FOR SELECT USING (auth.uid() = user_id);

-- Políticas para mensagens WhatsApp  
CREATE POLICY "Admins can manage all messages" ON public.whatsapp_messages
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can view messages from their conversations" ON public.whatsapp_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.whatsapp_conversations 
      WHERE id = conversation_id AND user_id = auth.uid()
    )
  );

-- Políticas para leads
CREATE POLICY "Admins can manage all leads" ON public.leads
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can view their own leads" ON public.leads
  FOR SELECT USING (auth.uid() = user_id);

-- Políticas para diagnósticos
CREATE POLICY "Admins can manage all diagnostics" ON public.diagnostic_requests
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Public can insert diagnostic requests" ON public.diagnostic_requests
  FOR INSERT WITH CHECK (true);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_whatsapp_conversations_updated_at
  BEFORE UPDATE ON public.whatsapp_conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_whatsapp_messages_updated_at
  BEFORE UPDATE ON public.whatsapp_messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_diagnostic_requests_updated_at
  BEFORE UPDATE ON public.diagnostic_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();