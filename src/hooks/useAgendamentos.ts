
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

export type AgendamentoDB = Database['public']['Tables']['agendamentos']['Row'];
export type AgendamentoInsert = Database['public']['Tables']['agendamentos']['Insert'];

export const useAgendamentos = () => {
  const [agendamentos, setAgendamentos] = useState<AgendamentoDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgendamentos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('agendamentos')
        .select('*')
        .order('data_servico', { ascending: false });
      
      if (error) throw error;
      setAgendamentos(data || []);
    } catch (err) {
      console.error('Erro ao buscar agendamentos:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const addAgendamento = async (agendamento: AgendamentoInsert) => {
    try {
      const { data, error } = await supabase
        .from('agendamentos')
        .insert([agendamento])
        .select()
        .single();
      
      if (error) throw error;
      setAgendamentos(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Erro ao adicionar agendamento:', err);
      setError(err instanceof Error ? err.message : 'Erro ao adicionar agendamento');
      throw err;
    }
  };

  const updateAgendamento = async (id: string, updates: Partial<AgendamentoDB>) => {
    try {
      const { data, error } = await supabase
        .from('agendamentos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      setAgendamentos(prev => prev.map(a => a.id === id ? data : a));
      return data;
    } catch (err) {
      console.error('Erro ao atualizar agendamento:', err);
      setError(err instanceof Error ? err.message : 'Erro ao atualizar agendamento');
      throw err;
    }
  };

  const deleteAgendamento = async (id: string) => {
    try {
      const { error } = await supabase
        .from('agendamentos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setAgendamentos(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error('Erro ao deletar agendamento:', err);
      setError(err instanceof Error ? err.message : 'Erro ao deletar agendamento');
      throw err;
    }
  };

  useEffect(() => {
    fetchAgendamentos();

    // Configurar realtime subscription
    const channel = supabase
      .channel('agendamentos-realtime')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'agendamentos'
        }, 
        (payload) => {
          console.log('Mudança nos agendamentos:', payload);
          
          if (payload.eventType === 'INSERT') {
            setAgendamentos(prev => [payload.new as AgendamentoDB, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setAgendamentos(prev => prev.map(a => a.id === payload.new.id ? payload.new as AgendamentoDB : a));
          } else if (payload.eventType === 'DELETE') {
            setAgendamentos(prev => prev.filter(a => a.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    agendamentos,
    loading,
    error,
    addAgendamento,
    updateAgendamento,
    deleteAgendamento,
    refetch: fetchAgendamentos
  };
};
