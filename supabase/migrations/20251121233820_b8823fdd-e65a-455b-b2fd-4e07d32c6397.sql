-- Adicionar campo de data de aniversário na tabela pets
ALTER TABLE public.pets 
ADD COLUMN data_aniversario date;

-- Criar índice para melhorar performance nas consultas de aniversário
CREATE INDEX idx_pets_data_aniversario ON public.pets(data_aniversario);

-- Adicionar comentário explicativo
COMMENT ON COLUMN public.pets.data_aniversario IS 'Data de aniversário do pet para envio de notificações';
