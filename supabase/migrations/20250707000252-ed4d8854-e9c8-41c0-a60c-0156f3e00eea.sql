
-- Criar tabela para configurações de webhooks
CREATE TABLE public.webhook_configurations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type VARCHAR(100) NOT NULL,
  webhook_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  secret_key VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela para logs de webhooks
CREATE TABLE public.webhook_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  webhook_config_id UUID REFERENCES webhook_configurations(id),
  event_type VARCHAR(100) NOT NULL,
  event_data JSONB,
  webhook_url TEXT NOT NULL,
  http_status INTEGER,
  response_body TEXT,
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS nas tabelas
ALTER TABLE public.webhook_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso público para webhooks (apenas admin deve acessar)
CREATE POLICY "Acesso público total webhooks" 
  ON public.webhook_configurations 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Acesso público total logs" 
  ON public.webhook_logs 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Função para disparar webhooks
CREATE OR REPLACE FUNCTION public.trigger_webhook(
  p_event_type TEXT,
  p_event_data JSONB
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Inserir na tabela de logs para processamento posterior
  INSERT INTO public.webhook_logs (
    event_type,
    event_data,
    webhook_url,
    sent_at
  )
  SELECT 
    p_event_type,
    p_event_data,
    webhook_url,
    now()
  FROM public.webhook_configurations
  WHERE event_type = p_event_type AND is_active = true;
END;
$$;

-- Triggers para tutores
CREATE OR REPLACE FUNCTION public.tutor_webhook_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.trigger_webhook('tutor.created', to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM public.trigger_webhook('tutor.updated', jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW)));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM public.trigger_webhook('tutor.deleted', to_jsonb(OLD));
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Triggers para pets
CREATE OR REPLACE FUNCTION public.pet_webhook_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.trigger_webhook('pet.created', to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM public.trigger_webhook('pet.updated', jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW)));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM public.trigger_webhook('pet.deleted', to_jsonb(OLD));
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Triggers para agendamentos
CREATE OR REPLACE FUNCTION public.agendamento_webhook_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.trigger_webhook('agendamento.created', to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM public.trigger_webhook('agendamento.updated', jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW)));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM public.trigger_webhook('agendamento.deleted', to_jsonb(OLD));
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Aplicar triggers nas tabelas
DROP TRIGGER IF EXISTS tutor_webhook_trigger ON public.tutores;
CREATE TRIGGER tutor_webhook_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.tutores
  FOR EACH ROW EXECUTE FUNCTION public.tutor_webhook_trigger();

DROP TRIGGER IF EXISTS pet_webhook_trigger ON public.pets;
CREATE TRIGGER pet_webhook_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.pets
  FOR EACH ROW EXECUTE FUNCTION public.pet_webhook_trigger();

DROP TRIGGER IF EXISTS agendamento_webhook_trigger ON public.agendamentos;
CREATE TRIGGER agendamento_webhook_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.agendamentos
  FOR EACH ROW EXECUTE FUNCTION public.agendamento_webhook_trigger();

DROP TRIGGER IF EXISTS agendamento_tutor_webhook_trigger ON public.agendamentos_tutores;
CREATE TRIGGER agendamento_tutor_webhook_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.agendamentos_tutores
  FOR EACH ROW EXECUTE FUNCTION public.agendamento_webhook_trigger();
