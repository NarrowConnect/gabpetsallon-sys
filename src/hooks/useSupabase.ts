
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

// Type definitions based on the Database schema
export type TutorDB = Database['public']['Tables']['tutores']['Row'];
export type PetDB = Database['public']['Tables']['pets']['Row'];
export type AgendamentoDB = Database['public']['Tables']['agendamentos']['Row'];
export type ContasAPagarDB = Database['public']['Tables']['contas_a_pagar']['Row'];
export type ValoresRecebidosDB = Database['public']['Tables']['valores_recebidos']['Row'];
export type ControleFinanceiroDB = Database['public']['Tables']['controle_financeiro']['Row'];

// Hook para gerenciar tutores
export const useTutors = () => {
  const [tutors, setTutors] = useState<TutorDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTutors = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tutores')
        .select('*')
        .order('nome');
      
      if (error) throw error;
      setTutors(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const addTutor = async (tutor: Omit<TutorDB, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('tutores')
        .insert([tutor])
        .select()
        .single();
      
      if (error) throw error;
      setTutors(prev => [...prev, data]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar tutor');
      throw err;
    }
  };

  const updateTutor = async (id: string, updates: Partial<TutorDB>) => {
    try {
      const { data, error } = await supabase
        .from('tutores')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      setTutors(prev => prev.map(t => t.id === id ? data : t));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar tutor');
      throw err;
    }
  };

  const deleteTutor = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tutores')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setTutors(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar tutor');
      throw err;
    }
  };

  useEffect(() => {
    fetchTutors();
  }, []);

  return {
    tutors,
    loading,
    error,
    addTutor,
    updateTutor,
    deleteTutor,
    refetch: fetchTutors
  };
};

// Hook para gerenciar pets
export const usePets = () => {
  const [pets, setPets] = useState<PetDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .order('nome_pet');
      
      if (error) throw error;
      setPets(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const addPet = async (pet: Omit<PetDB, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('pets')
        .insert([pet])
        .select()
        .single();
      
      if (error) throw error;
      setPets(prev => [...prev, data]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar pet');
      throw err;
    }
  };

  const updatePet = async (id: string, updates: Partial<PetDB>) => {
    try {
      const { data, error } = await supabase
        .from('pets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      setPets(prev => prev.map(p => p.id === id ? data : p));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar pet');
      throw err;
    }
  };

  const deletePet = async (id: string) => {
    try {
      const { error } = await supabase
        .from('pets')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setPets(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar pet');
      throw err;
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  return {
    pets,
    loading,
    error,
    addPet,
    updatePet,
    deletePet,
    refetch: fetchPets
  };
};

// Hook para gerenciar agendamentos
export const useAgendamentos = () => {
  const [agendamentos, setAgendamentos] = useState<AgendamentoDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgendamentos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('agendamentos')
        .select('*')
        .order('data_servico');
      
      if (error) throw error;
      setAgendamentos(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const addAgendamento = async (agendamento: Omit<AgendamentoDB, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('agendamentos')
        .insert([agendamento])
        .select()
        .single();
      
      if (error) throw error;
      setAgendamentos(prev => [...prev, data]);
      return data;
    } catch (err) {
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
      setError(err instanceof Error ? err.message : 'Erro ao deletar agendamento');
      throw err;
    }
  };

  useEffect(() => {
    fetchAgendamentos();
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

// Hook para gerenciar finanças
export const useFinancas = () => {
  const [contasPagar, setContasPagar] = useState<ContasAPagarDB[]>([]);
  const [valoresRecebidos, setValoresRecebidos] = useState<ValoresRecebidosDB[]>([]);
  const [controleFinanceiro, setControleFinanceiro] = useState<ControleFinanceiroDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFinancas = async () => {
    try {
      setLoading(true);
      
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
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados financeiros');
    } finally {
      setLoading(false);
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
    refetch: fetchFinancas
  };
};
