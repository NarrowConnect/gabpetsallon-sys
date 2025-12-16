-- Adicionar campo de email na tabela tutores
ALTER TABLE public.tutores ADD COLUMN IF NOT EXISTS email VARCHAR(255);

-- Tabela para agendamentos de creche
CREATE TABLE public.creche_agendamentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE,
  pet_nome VARCHAR NOT NULL,
  tutor_nome VARCHAR NOT NULL,
  tutor_telefone VARCHAR,
  data_entrada DATE NOT NULL,
  data_saida DATE,
  status VARCHAR DEFAULT 'ativo',
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela para documentos vinculados aos pets na creche
CREATE TABLE public.creche_documentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  creche_agendamento_id UUID REFERENCES public.creche_agendamentos(id) ON DELETE CASCADE,
  pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE,
  nome_arquivo VARCHAR NOT NULL,
  tipo_arquivo VARCHAR NOT NULL,
  url_arquivo TEXT NOT NULL,
  public_token VARCHAR UNIQUE DEFAULT gen_random_uuid()::text,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.creche_agendamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creche_documentos ENABLE ROW LEVEL SECURITY;

-- RLS policies for creche_agendamentos
CREATE POLICY "Enable read access for all users" ON public.creche_agendamentos FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage creche" ON public.creche_agendamentos FOR ALL USING (true) WITH CHECK (true);

-- RLS policies for creche_documentos
CREATE POLICY "Enable read access for all users" ON public.creche_documentos FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage documents" ON public.creche_documentos FOR ALL USING (true) WITH CHECK (true);

-- Storage bucket for creche documents
INSERT INTO storage.buckets (id, name, public) VALUES ('creche-documentos', 'creche-documentos', true);

-- Storage policies
CREATE POLICY "Anyone can view creche documents" ON storage.objects FOR SELECT USING (bucket_id = 'creche-documentos');
CREATE POLICY "Authenticated users can upload creche documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'creche-documentos');
CREATE POLICY "Authenticated users can update creche documents" ON storage.objects FOR UPDATE USING (bucket_id = 'creche-documentos');
CREATE POLICY "Authenticated users can delete creche documents" ON storage.objects FOR DELETE USING (bucket_id = 'creche-documentos');