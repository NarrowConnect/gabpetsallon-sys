
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

// Type definitions for remaining tables
export type AgendamentoTutorDB = Database['public']['Tables']['agendamentos_tutores']['Row'];
export type ContasAPagarDB = Database['public']['Tables']['contas_a_pagar']['Row'];
export type ValoresRecebidosDB = Database['public']['Tables']['valores_recebidos']['Row'];
export type ControleFinanceiroDB = Database['public']['Tables']['controle_financeiro']['Row'];
export type WebhookConfigurationDB = Database['public']['Tables']['webhook_configurations']['Row'];
export type WebhookLogDB = Database['public']['Tables']['webhook_logs']['Row'];

// Hook para gerenciar webhooks
export const useWebhooks = () => {
  const [webhookConfigs, setWebhookConfigs] = useState<WebhookConfigurationDB[]>([]);
  const [webhookLogs, setWebhookLogs] = useState<WebhookLogDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWebhookConfigs = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('webhook_configurations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setWebhookConfigs(data || []);
    } catch (err) {
      console.error('Erro ao buscar configurações de webhook:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const fetchWebhookLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('webhook_logs')
        .select('*')
        .order('sent_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      setWebhookLogs(data || []);
    } catch (err) {
      console.error('Erro ao buscar logs de webhook:', err);
      setError(err instanceof Error ? err.message : 'Erro ao buscar logs');
    }
  };

  const addWebhookConfig = async (config: Omit<WebhookConfigurationDB, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('webhook_configurations')
        .insert([config])
        .select()
        .single();
      
      if (error) throw error;
      setWebhookConfigs(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Erro ao adicionar configuração de webhook:', err);
      setError(err instanceof Error ? err.message : 'Erro ao adicionar webhook');
      throw err;
    }
  };

  const updateWebhookConfig = async (id: string, updates: Partial<WebhookConfigurationDB>) => {
    try {
      const { data, error } = await supabase
        .from('webhook_configurations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      setWebhookConfigs(prev => prev.map(w => w.id === id ? data : w));
      return data;
    } catch (err) {
      console.error('Erro ao atualizar configuração de webhook:', err);
      setError(err instanceof Error ? err.message : 'Erro ao atualizar webhook');
      throw err;
    }
  };

  const deleteWebhookConfig = async (id: string) => {
    try {
      const { error } = await supabase
        .from('webhook_configurations')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setWebhookConfigs(prev => prev.filter(w => w.id !== id));
    } catch (err) {
      console.error('Erro ao deletar configuração de webhook:', err);
      setError(err instanceof Error ? err.message : 'Erro ao deletar webhook');
      throw err;
    }
  };

  useEffect(() => {
    fetchWebhookConfigs();
    fetchWebhookLogs();
  }, []);

  return {
    webhookConfigs,
    webhookLogs,
    loading,
    error,
    addWebhookConfig,
    updateWebhookConfig,
    deleteWebhookConfig,
    refetchConfigs: fetchWebhookConfigs,
    refetchLogs: fetchWebhookLogs
  };
};

// Hook para gerenciar finanças otimizado
export const useFinancas = () => {
  const [contasPagar, setContasPagar] = useState<ContasAPagarDB[]>([]);
  const [valoresRecebidos, setValoresRecebidos] = useState<ValoresRecebidosDB[]>([]);
  const [controleFinanceiro, setControleFinanceiro] = useState<ControleFinanceiroDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFinancas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [contasRes, valoresRes, controleRes] = await Promise.all([
        supabase.from('contas_a_pagar').select('*').order('mes_referencia'),
        supabase.from('valores_recebidos').select('*').order('mes_referencia'),
        supabase.from('controle_financeiro').select('*').order('mes_referencia')
      ]);

      if (contasRes.error) throw contasRes.error;
      if (valoresRes.error) throw valoresRes.error;
      if (controleRes.error) throw controleRes.error;

      setContasPagar(contasRes.data || []);
      setValoresRecebidos(valoresRes.data || []);
      setControleFinanceiro(controleRes.data || []);
    } catch (err) {
      console.error('Erro ao carregar dados financeiros:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados financeiros');
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar receitas
  const updateReceitas = async (mesReferencia: string, updates: Partial<ValoresRecebidosDB>) => {
    try {
      // Primeiro, verificar se já existe um registro para este mês
      const { data: existingData, error: selectError } = await supabase
        .from('valores_recebidos')
        .select('*')
        .eq('mes_referencia', mesReferencia)
        .single();

      let data;
      
      if (selectError && selectError.code !== 'PGRST116') {
        // Erro diferente de "nenhum resultado encontrado"
        throw selectError;
      }

      if (existingData) {
        // Registro existe, fazer UPDATE
        const { data: updateData, error: updateError } = await supabase
          .from('valores_recebidos')
          .update(updates)
          .eq('mes_referencia', mesReferencia)
          .select()
          .single();
        
        if (updateError) throw updateError;
        data = updateData;
      } else {
        // Registro não existe, fazer INSERT
        const { data: insertData, error: insertError } = await supabase
          .from('valores_recebidos')
          .insert([{ mes_referencia: mesReferencia, ...updates }])
          .select()
          .single();
        
        if (insertError) throw insertError;
        data = insertData;
      }
      
      setValoresRecebidos(prev => {
        const index = prev.findIndex(item => item.mes_referencia === mesReferencia);
        if (index >= 0) {
          const newArray = [...prev];
          newArray[index] = data;
          return newArray;
        } else {
          return [...prev, data];
        }
      });
      
      return data;
    } catch (err) {
      console.error('Erro ao atualizar receitas:', err);
      throw err;
    }
  };

  // Função para atualizar despesas
  const updateDespesas = async (mesReferencia: string, updates: Partial<ContasAPagarDB>) => {
    try {
      // Primeiro, verificar se já existe um registro para este mês
      const { data: existingData, error: selectError } = await supabase
        .from('contas_a_pagar')
        .select('*')
        .eq('mes_referencia', mesReferencia)
        .single();

      let data;
      
      if (selectError && selectError.code !== 'PGRST116') {
        // Erro diferente de "nenhum resultado encontrado"
        throw selectError;
      }

      if (existingData) {
        // Registro existe, fazer UPDATE
        const { data: updateData, error: updateError } = await supabase
          .from('contas_a_pagar')
          .update(updates)
          .eq('mes_referencia', mesReferencia)
          .select()
          .single();
        
        if (updateError) throw updateError;
        data = updateData;
      } else {
        // Registro não existe, fazer INSERT
        const { data: insertData, error: insertError } = await supabase
          .from('contas_a_pagar')
          .insert([{ mes_referencia: mesReferencia, ...updates }])
          .select()
          .single();
        
        if (insertError) throw insertError;
        data = insertData;
      }
      
      setContasPagar(prev => {
        const index = prev.findIndex(item => item.mes_referencia === mesReferencia);
        if (index >= 0) {
          const newArray = [...prev];
          newArray[index] = data;
          return newArray;
        } else {
          return [...prev, data];
        }
      });
      
      return data;
    } catch (err) {
      console.error('Erro ao atualizar despesas:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchFinancas();
  }, []);

  return {
    contasPagar,
    valoresRecebidos,
    controleFinanceiro,
    loading,
    error,
    updateReceitas,
    updateDespesas,
    refetch: fetchFinancas
  };
};
