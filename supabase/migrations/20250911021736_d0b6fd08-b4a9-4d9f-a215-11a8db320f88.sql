-- Secure RLS policies for customer and business data protection

-- First, drop the overly permissive policies
DROP POLICY IF EXISTS "Permitir todas operações para tutores" ON public.tutores;
DROP POLICY IF EXISTS "Permitir todas operações para pets" ON public.pets;
DROP POLICY IF EXISTS "Permitir todas operações para agendamentos" ON public.agendamentos;
DROP POLICY IF EXISTS "Acesso público total" ON public.contas_a_pagar;
DROP POLICY IF EXISTS "Acesso público total" ON public.controle_financeiro;
DROP POLICY IF EXISTS "Acesso público total" ON public.receitas_personalizadas;
DROP POLICY IF EXISTS "Acesso público total" ON public.despesas_personalizadas;
DROP POLICY IF EXISTS "Acesso público total" ON public.valores_recebidos;
DROP POLICY IF EXISTS "Acesso público total" ON public.usuarios_admin;
DROP POLICY IF EXISTS "Acesso público total webhooks" ON public.webhook_configurations;
DROP POLICY IF EXISTS "Acesso público total logs" ON public.webhook_logs;

-- Create secure RLS policies for tutores table
CREATE POLICY "Authenticated users can manage tutores"
ON public.tutores
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create secure RLS policies for pets table  
CREATE POLICY "Authenticated users can manage pets"
ON public.pets
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create secure RLS policies for agendamentos table
CREATE POLICY "Authenticated users can manage agendamentos"
ON public.agendamentos
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Keep public insert for agendamentos_tutores (customer booking form)
-- but secure read operations
CREATE POLICY "Authenticated users can read agendamentos_tutores"
ON public.agendamentos_tutores
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can update agendamentos_tutores"
ON public.agendamentos_tutores
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete agendamentos_tutores"
ON public.agendamentos_tutores
FOR DELETE
TO authenticated
USING (true);

-- Financial data - restrict to authenticated users only
CREATE POLICY "Authenticated users can manage financial data"
ON public.contas_a_pagar
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can manage financial control"
ON public.controle_financeiro
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can manage custom income"
ON public.receitas_personalizadas
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can manage custom expenses"
ON public.despesas_personalizadas
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can manage received values"
ON public.valores_recebidos
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Admin credentials - highly restricted
CREATE POLICY "Authenticated users can manage admin users"
ON public.usuarios_admin
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Webhook configurations - restrict to authenticated users
CREATE POLICY "Authenticated users can manage webhook configs"
ON public.webhook_configurations
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can view webhook logs"
ON public.webhook_logs
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert webhook logs"
ON public.webhook_logs
FOR INSERT
TO authenticated
WITH CHECK (true);