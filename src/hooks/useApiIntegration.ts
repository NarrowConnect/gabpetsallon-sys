
import { useState } from 'react';
import { useToast } from './use-toast';

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export const useApiIntegration = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const makeApiRequest = async (
    url: string, 
    method: 'GET' | 'POST' | 'PUT' | 'DELETE', 
    data?: any
  ): Promise<ApiResponse> => {
    setLoading(true);
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Erro na requisição');
      }

      toast({
        title: "Sucesso!",
        description: "Operação realizada com sucesso.",
      });

      return { success: true, data: result };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      toast({
        title: "Erro na integração",
        description: errorMessage,
        variant: "destructive",
      });

      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const createTutor = async (tutorData: any, apiUrl?: string) => {
    if (!apiUrl) {
      toast({
        title: "URL da API não configurada",
        description: "Configure a URL da API para integrações.",
        variant: "destructive",
      });
      return { success: false, error: "URL não configurada" };
    }

    return await makeApiRequest(`${apiUrl}/tutors`, 'POST', tutorData);
  };

  const createPet = async (petData: any, apiUrl?: string) => {
    if (!apiUrl) {
      toast({
        title: "URL da API não configurada",
        description: "Configure a URL da API para integrações.",
        variant: "destructive",
      });
      return { success: false, error: "URL não configurada" };
    }

    return await makeApiRequest(`${apiUrl}/pets`, 'POST', petData);
  };

  const createExpense = async (expenseData: any, apiUrl?: string) => {
    if (!apiUrl) {
      toast({
        title: "URL da API não configurada",
        description: "Configure a URL da API para integrações.",
        variant: "destructive",
      });
      return { success: false, error: "URL não configurada" };
    }

    return await makeApiRequest(`${apiUrl}/expenses`, 'POST', expenseData);
  };

  return {
    loading,
    makeApiRequest,
    createTutor,
    createPet,
    createExpense
  };
};
