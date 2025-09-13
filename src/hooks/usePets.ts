
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

export type PetDB = Database['public']['Tables']['pets']['Row'];
export type PetInsert = Database['public']['Tables']['pets']['Insert'];

export const usePets = () => {
  const { toast } = useToast();
  const [pets, setPets] = useState<PetDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPets = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .order('nome_pet');
      
      if (error) throw error;
      setPets(data || []);
    } catch (err) {
      console.error('Erro ao buscar pets:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      toast({
        title: "Erro ao carregar pets",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addPet = async (pet: PetInsert) => {
    try {
      const { data, error } = await supabase
        .from('pets')
        .insert([pet])
        .select()
        .single();
      
      if (error) throw error;
      setPets(prev => [...prev, data]);
      toast({
        title: "Sucesso!",
        description: "Pet adicionado com sucesso.",
      });
      return data;
    } catch (err) {
      console.error('Erro ao adicionar pet:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar pet';
      setError(errorMessage);
      toast({
        title: "Erro ao adicionar pet",
        description: errorMessage,
        variant: "destructive"
      });
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
      toast({
        title: "Sucesso!",
        description: "Pet atualizado com sucesso.",
      });
      return data;
    } catch (err) {
      console.error('Erro ao atualizar pet:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar pet';
      setError(errorMessage);
      toast({
        title: "Erro ao atualizar pet",
        description: errorMessage,
        variant: "destructive"
      });
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
      toast({
        title: "Sucesso!",
        description: "Pet removido com sucesso.",
      });
    } catch (err) {
      console.error('Erro ao deletar pet:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar pet';
      setError(errorMessage);
      toast({
        title: "Erro ao deletar pet",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    }
  };

  const getPetsByTutor = (tutorId: string) => {
    return pets.filter(pet => pet.tutor_id === tutorId);
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
    getPetsByTutor,
    refetch: fetchPets
  };
};
