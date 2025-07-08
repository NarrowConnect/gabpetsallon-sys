
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

export type PetDB = Database['public']['Tables']['pets']['Row'];
export type PetInsert = Database['public']['Tables']['pets']['Insert'];

export const usePets = () => {
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
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
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
      return data;
    } catch (err) {
      console.error('Erro ao adicionar pet:', err);
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
      console.error('Erro ao atualizar pet:', err);
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
      console.error('Erro ao deletar pet:', err);
      setError(err instanceof Error ? err.message : 'Erro ao deletar pet');
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
