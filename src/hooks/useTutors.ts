
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

export type TutorDB = Database['public']['Tables']['tutores']['Row'];
export type TutorInsert = Database['public']['Tables']['tutores']['Insert'];

export const useTutors = () => {
  const [tutors, setTutors] = useState<TutorDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTutors = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('tutores')
        .select('*')
        .order('nome');
      
      if (error) throw error;
      setTutors(data || []);
    } catch (err) {
      console.error('Erro ao buscar tutores:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const addTutor = async (tutor: TutorInsert) => {
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
      console.error('Erro ao adicionar tutor:', err);
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
      console.error('Erro ao atualizar tutor:', err);
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
      console.error('Erro ao deletar tutor:', err);
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
