import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CrecheAgendamento {
  id: string;
  pet_id: string | null;
  pet_nome: string;
  tutor_nome: string;
  tutor_telefone: string | null;
  data_entrada: string;
  data_saida: string | null;
  status: string | null;
  observacoes: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface CrecheDocumento {
  id: string;
  creche_agendamento_id: string | null;
  pet_id: string | null;
  nome_arquivo: string;
  tipo_arquivo: string;
  url_arquivo: string;
  public_token: string | null;
  created_at: string | null;
}

export interface CrecheAgendamentoInsert {
  pet_id?: string | null;
  pet_nome: string;
  tutor_nome: string;
  tutor_telefone?: string | null;
  data_entrada: string;
  data_saida?: string | null;
  status?: string | null;
  observacoes?: string | null;
}

export function useCreche() {
  const [agendamentos, setAgendamentos] = useState<CrecheAgendamento[]>([]);
  const [documentos, setDocumentos] = useState<CrecheDocumento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAgendamentos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('creche_agendamentos')
        .select('*')
        .order('data_entrada', { ascending: false });

      if (error) throw error;
      setAgendamentos((data as CrecheAgendamento[]) || []);
    } catch (err) {
      console.error('Erro ao buscar agendamentos de creche:', err);
      setError('Erro ao carregar agendamentos');
      toast.error('Erro ao carregar agendamentos de creche');
    } finally {
      setLoading(false);
    }
  };

  const fetchDocumentos = async () => {
    try {
      const { data, error } = await supabase
        .from('creche_documentos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocumentos((data as CrecheDocumento[]) || []);
    } catch (err) {
      console.error('Erro ao buscar documentos:', err);
    }
  };

  const addAgendamento = async (agendamento: CrecheAgendamentoInsert) => {
    try {
      const { data, error } = await supabase
        .from('creche_agendamentos')
        .insert([agendamento])
        .select()
        .single();

      if (error) throw error;
      setAgendamentos(prev => [(data as CrecheAgendamento), ...prev]);
      toast.success('Pet adicionado à creche');
      return data as CrecheAgendamento;
    } catch (err) {
      console.error('Erro ao adicionar agendamento:', err);
      toast.error('Erro ao adicionar pet à creche');
      return null;
    }
  };

  const updateAgendamento = async (id: string, updates: Partial<CrecheAgendamento>) => {
    try {
      const { data, error } = await supabase
        .from('creche_agendamentos')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setAgendamentos(prev => prev.map(a => a.id === id ? (data as CrecheAgendamento) : a));
      toast.success('Agendamento atualizado');
      return data as CrecheAgendamento;
    } catch (err) {
      console.error('Erro ao atualizar agendamento:', err);
      toast.error('Erro ao atualizar agendamento');
      return null;
    }
  };

  const deleteAgendamento = async (id: string) => {
    try {
      const { error } = await supabase
        .from('creche_agendamentos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setAgendamentos(prev => prev.filter(a => a.id !== id));
      toast.success('Agendamento removido');
    } catch (err) {
      console.error('Erro ao deletar agendamento:', err);
      toast.error('Erro ao remover agendamento');
    }
  };

  const uploadDocumento = async (
    file: File, 
    crecheAgendamentoId: string, 
    petId: string | null
  ) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('creche-documentos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('creche-documentos')
        .getPublicUrl(filePath);

      const { data, error } = await supabase
        .from('creche_documentos')
        .insert([{
          creche_agendamento_id: crecheAgendamentoId,
          pet_id: petId,
          nome_arquivo: file.name,
          tipo_arquivo: file.type,
          url_arquivo: urlData.publicUrl
        }])
        .select()
        .single();

      if (error) throw error;
      setDocumentos(prev => [(data as CrecheDocumento), ...prev]);
      toast.success('Documento enviado com sucesso');
      return data as CrecheDocumento;
    } catch (err) {
      console.error('Erro ao enviar documento:', err);
      toast.error('Erro ao enviar documento');
      return null;
    }
  };

  const deleteDocumento = async (id: string, urlArquivo: string) => {
    try {
      // Extract file path from URL
      const urlParts = urlArquivo.split('/');
      const fileName = urlParts[urlParts.length - 1];

      // Delete from storage
      await supabase.storage
        .from('creche-documentos')
        .remove([fileName]);

      // Delete from database
      const { error } = await supabase
        .from('creche_documentos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setDocumentos(prev => prev.filter(d => d.id !== id));
      toast.success('Documento removido');
    } catch (err) {
      console.error('Erro ao deletar documento:', err);
      toast.error('Erro ao remover documento');
    }
  };

  const getAgendamentosAtivos = () => {
    return agendamentos.filter(a => a.status === 'ativo');
  };

  useEffect(() => {
    fetchAgendamentos();
    fetchDocumentos();
  }, []);

  return {
    agendamentos,
    documentos,
    loading,
    error,
    addAgendamento,
    updateAgendamento,
    deleteAgendamento,
    uploadDocumento,
    deleteDocumento,
    getAgendamentosAtivos,
    refetch: () => {
      fetchAgendamentos();
      fetchDocumentos();
    }
  };
}
