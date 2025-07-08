
-- Corrigir políticas RLS para permitir operações CRUD
-- Remover políticas restritivas e adicionar políticas que permitam operações completas

-- Para tabela tutores
DROP POLICY IF EXISTS "Enable read access for all users" ON public.tutores;

CREATE POLICY "Permitir todas operações para tutores" 
ON public.tutores 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Para tabela agendamentos (que não tinha políticas RLS)
ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir todas operações para agendamentos" 
ON public.agendamentos 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Para tabela pets (já tinha acesso público total, mas vamos garantir)
DROP POLICY IF EXISTS "Acesso público total" ON public.pets;

CREATE POLICY "Permitir todas operações para pets" 
ON public.pets 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Atualizar política para agendamentos_tutores para permitir UPDATE e DELETE
DROP POLICY IF EXISTS "Permitir leitura para autenticados" ON public.agendamentos_tutores;

CREATE POLICY "Permitir todas operações para agendamentos_tutores" 
ON public.agendamentos_tutores 
FOR ALL 
USING (true) 
WITH CHECK (true);
