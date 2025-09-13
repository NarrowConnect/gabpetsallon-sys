
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

export type TutorDB = Database['public']['Tables']['tutores']['Row'];
export type TutorInsert = Database['public']['Tables']['tutores']['Insert'];

export const useTutors = () => {
  const { toast } = useToast();
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
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      toast({
        title: "Erro ao carregar tutores",
        description: errorMessage,
        variant: "destructive"
      });
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
      toast({
        title: "Sucesso!",
        description: "Tutor adicionado com sucesso.",
      });
      return data;
    } catch (err) {
      console.error('Erro ao adicionar tutor:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar tutor';
      setError(errorMessage);
      toast({
        title: "Erro ao adicionar tutor",
        description: errorMessage,
        variant: "destructive"
      });
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
      toast({
        title: "Sucesso!",
        description: "Tutor atualizado com sucesso.",
      });
      return data;
    } catch (err) {
      console.error('Erro ao atualizar tutor:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar tutor';
      setError(errorMessage);
      toast({
        title: "Erro ao atualizar tutor",
        description: errorMessage,
        variant: "destructive"
      });
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
      toast({
        title: "Sucesso!",
        description: "Tutor removido com sucesso.",
      });
    } catch (err) {
      console.error('Erro ao deletar tutor:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar tutor';
      setError(errorMessage);
      toast({
        title: "Erro ao deletar tutor",
        description: errorMessage,
        variant: "destructive"
      });
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
