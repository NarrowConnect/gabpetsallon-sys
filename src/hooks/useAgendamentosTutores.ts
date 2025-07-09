
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
      
      console.log('Buscando agendamentos de tutores...');
      
      const { data, error } = await supabase
        .from('agendamentos_tutores')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Erro na consulta Supabase:', error);
        throw error;
      }
      
      console.log('Agendamentos de tutores carregados:', data?.length || 0);
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
      console.log('Atualizando agendamento de tutor:', id, updates);
      
      const { data, error } = await supabase
        .from('agendamentos_tutores')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Erro na atualização:', error);
        throw error;
      }
      
      console.log('Agendamento atualizado:', data);
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
      console.log('Deletando agendamento de tutor:', id);
      
      const { error } = await supabase
        .from('agendamentos_tutores')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Erro ao deletar:', error);
        throw error;
      }
      
      console.log('Agendamento deletado com sucesso');
      setAgendamentosTutores(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error('Erro ao deletar agendamento de tutor:', err);
      setError(err instanceof Error ? err.message : 'Erro ao deletar agendamento');
      throw err;
    }
  };

  const createFromTutorRequest = async (agendamentoTutor: AgendamentoTutorDB) => {
    try {
      console.log('Criando agendamento a partir de solicitação de tutor:', agendamentoTutor);
      
      // Criar agendamento na tabela principal
      const agendamentoData = {
        tutor_nome: agendamentoTutor.tutor_nome,
        tutor_telefone: agendamentoTutor.tutor_telefone,
        pet_nome: agendamentoTutor.pet_nome,
        pet_raca: agendamentoTutor.pet_raca,
        pet_porte: agendamentoTutor.pet_porte,
        data_servico: agendamentoTutor.data_servico,
        hora_servico: agendamentoTutor.hora_servico,
        servico: agendamentoTutor.servico,
        observacoes: agendamentoTutor.observacoes,
        status: "Confirmado",
        origem: "tutor"
      };

      const { data: novoAgendamento, error: agendamentoError } = await supabase
        .from('agendamentos')
        .insert([agendamentoData])
        .select()
        .single();

      if (agendamentoError) {
        console.error('Erro ao criar agendamento:', agendamentoError);
        throw agendamentoError;
      }

      console.log('Agendamento criado na tabela principal:', novoAgendamento);
      
      // Atualizar status da solicitação para "Confirmado"
      await updateAgendamentoTutor(agendamentoTutor.id, { 
        status: 'Confirmado',
        data_resposta: new Date().toISOString()
      });

      return novoAgendamento;
    } catch (err) {
      console.error('Erro ao criar agendamento a partir de solicitação:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchAgendamentosTutores();

    // Configurar realtime subscription para agendamentos_tutores
    console.log('Configurando subscription realtime para agendamentos_tutores');
    
    const channel = supabase
      .channel('agendamentos-tutores-realtime')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'agendamentos_tutores'
        }, 
        (payload) => {
          console.log('Mudança realtime nos agendamentos de tutores:', payload);
          
          if (payload.eventType === 'INSERT') {
            setAgendamentosTutores(prev => [payload.new as AgendamentoTutorDB, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setAgendamentosTutores(prev => prev.map(a => a.id === payload.new.id ? payload.new as AgendamentoTutorDB : a));
          } else if (payload.eventType === 'DELETE') {
            setAgendamentosTutores(prev => prev.filter(a => a.id !== payload.old.id));
          }
        }
      )
      .subscribe((status) => {
        console.log('Status subscription agendamentos_tutores:', status);
      });

    return () => {
      console.log('Removendo subscription agendamentos_tutores');
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    agendamentosTutores,
    loading,
    error,
    updateAgendamentoTutor,
    deleteAgendamentoTutor,
    createFromTutorRequest,
    refetch: fetchAgendamentosTutores
  };
};
