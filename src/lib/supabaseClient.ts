
import { createClient } from '@supabase/supabase-js';

// ===== BLOCO DE CONFIGURAÇÃO DE API SUPABASE =====
// ⚠️  SUBSTITUA AS CHAVES ABAIXO PELAS SUAS QUANDO NECESSÁRIO:
// ⚠️  ATENÇÃO: Este arquivo usa variáveis de ambiente que não são suportadas no Lovable
// ✅ Configure diretamente as chaves ou use o arquivo src/integrations/supabase/client.ts
// 1. supabaseUrl: Substitua pela URL do seu projeto Supabase
// 2. supabaseAnonKey: Substitua pela chave anônima do seu projeto
// ✅ Encontre suas chaves em: https://supabase.com/dashboard/project/[SEU-PROJETO]/settings/api
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://zwykvxtufkcovqyifhfg.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3eWt2eHR1Zmtjb3ZxeWlmaGZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1OTkxODAsImV4cCI6MjA2NzE3NTE4MH0.jZos1WwH4o1HqkkAiZsmmYpARATVZDe01E0p4lPOxHE';
// ===== FIM DO BLOCO DE CONFIGURAÇÃO =====

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Interfaces TypeScript para as tabelas do banco
export interface TutorDB extends Record<string, any> {
  id: string;
  nome: string;
  telefone_residencial: string;
  celular: string;
  endereco: string;
  cep: string;
  cidade: string;
  estado: string;
  nome_veterinario: string;
  telefone_veterinario: string;
  celular_veterinario: string;
  endereco_veterinario: string;
  cidade_veterinario: string;
  estado_veterinario: string;
  contato_adicional_1_nome: string;
  contato_adicional_1_telefone: string;
  contato_adicional_2_nome: string;
  contato_adicional_2_telefone: string;
  created_at: string;
  updated_at: string;
}

export interface PetDB extends Record<string, any> {
  id: string;
  nome_tutor: string;
  nome_pet: string;
  idade: number;
  especie: string;
  raca: string;
  sexo: string;
  porte: string;
  castrado: boolean;
  peso: number;
  temperamento: string;
  necessidades_especiais: string;
  rotina: string;
  saude: string;
  toma_medicamentos: boolean;
  medicamentos: string;
  vacinas_vermifugos: string;
  controle_parasitario: string;
  nome_veterinario: string;
  telefone_veterinario: string;
  celular_veterinario: string;
  endereco_veterinario: string;
  cidade_veterinario: string;
  estado_veterinario: string;
  tutor_id: string;
  created_at: string;
  updated_at: string;
}

export interface AgendamentoDB extends Record<string, any> {
  id: string;
  tutor_id: string;
  pet_id: string;
  data_servico: string;
  hora_servico: string;
  servico: string;
  valor: number;
  status: string;
  observacoes: string;
  created_at: string;
  updated_at: string;
}

export interface ContasAPagarDB extends Record<string, any> {
  id: string;
  mes_referencia: string;
  aluguel: number;
  copel: number;
  sanepar: number;
  internet: number;
  seguranca_mensalidade: number;
  mei: number;
  celular_mes: number;
  lavanderia: number;
  gasolina: number;
  tarifa_bancaria: number;
  cartao_santander: number;
  cartao_bb: number;
  cartao_nu: number;
  cartao_gab: number;
  boleto_biocom: number;
  boleto_euroshop: number;
  total_saidas: number;
  created_at: string;
  updated_at: string;
}

export interface ValoresRecebidosDB extends Record<string, any> {
  id: string;
  mes_referencia: string;
  banhos_porte_pequeno: number;
  banhos_porte_grande: number;
  tosas: number;
  hospedagens: number;
  roupas: number;
  taxi_dog: number;
  total_entradas: number;
  created_at: string;
  updated_at: string;
}

export interface ControleFinanceiroDB extends Record<string, any> {
  id: string;
  mes_referencia: string;
  saldo_anterior: number;
  total_entradas: number;
  total_saidas: number;
  saldo_atual: number;
  saldo_transportar: number;
  created_at: string;
  updated_at: string;
}

export interface ReceitaPersonalizadaDB extends Record<string, any> {
  id: string;
  mes_referencia: string;
  descricao: string;
  valor: number;
  data_receita: string;
  created_at: string;
}

export interface DespesaPersonalizadaDB extends Record<string, any> {
  id: string;
  mes_referencia: string;
  descricao: string;
  valor: number;
  data_despesa: string;
  created_at: string;
}
