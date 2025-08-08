-- Adicionar campos banhista e publicidade na tabela contas_a_pagar
ALTER TABLE public.contas_a_pagar 
ADD COLUMN IF NOT EXISTS banhista numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS publicidade numeric DEFAULT 0;

-- Verificar se a coluna toalhas existe e está configurada corretamente
UPDATE public.contas_a_pagar SET toalhas = 0 WHERE toalhas IS NULL;