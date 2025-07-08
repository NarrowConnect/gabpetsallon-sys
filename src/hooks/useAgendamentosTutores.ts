
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

export type AgendamentoTutorDB = Database['public']['Tables']['agendamentos_tutores']['Row'];
export type AgendamentoTutorInsert = Database['public']['Tables']['agendamentos_tutores']['Insert'];

export const useAgendamentosTutores = () => {
  const [agendamentosTutores, setAgendamentosTutores] = useState<AgendamentoTutorDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgendamentosTutores = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('agendamentos_tutores')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setAgendamentosTutores(data || []);
    } catch (err) {
      console.error('Erro ao buscar agendamentos de tutores:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const updateAgendamentoTutor = async (id: string, updates: Partial<AgendamentoTutorDB>) => {
    try {
      const { data, error } = await supabase
        .from('agendamentos_tutores')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      setAgendamentosTutores(prev => prev.map(a => a.id === id ? data : a));
      return data;
    } catch (err) {
      console.error('Erro ao atualizar agendamento de tutor:', err);
      setError(err instanceof Error ? err.message : 'Erro ao atualizar agendamento');
      throw err;
    }
  };

  const deleteAgendamentoTutor = async (id: string) => {
    try {
      const { error } = await supabase
        .from('agendamentos_tutores')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setAgendamentosTutores(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error('Erro ao deletar agendamento de tutor:', err);
      setError(err instanceof Error ? err.message : 'Erro ao deletar agendamento');
      throw err;
    }
  };

  useEffect(() => {
    fetchAgendamentosTutores();

    // Configurar realtime subscription para agendamentos_tutores
    const channel = supabase
      .channel('agendamentos-tutores-realtime')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'agendamentos_tutores'
        }, 
        (payload) => {
          console.log('Mudança nos agendamentos de tutores:', payload);
          
          if (payload.eventType === 'INSERT') {
            setAgendamentosTutores(prev => [payload.new as AgendamentoTutorDB, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setAgendamentosTutores(prev => prev.map(a => a.id === payload.new.id ? payload.new as AgendamentoTutorDB : a));
          } else if (payload.eventType === 'DELETE') {
            setAgendamentosTutores(prev => prev.filter(a => a.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    agendamentosTutores,
    loading,
    error,
    updateAgendamentoTutor,
    deleteAgendamentoTutor,
    refetch: fetchAgendamentosTutores
  };
};
