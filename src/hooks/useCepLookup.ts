import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

export interface CepAddress {
  street: string;
  neighborhood?: string;
  city: string;
  state: string;
}

const normalizeCep = (value: string) => value.replace(/\D/g, "").slice(0, 8);

export const formatCep = (value: string) => {
  const digits = normalizeCep(value);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5, 8)}`;
};

export const useCepLookup = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const lookup = useCallback(async (rawCep: string): Promise<CepAddress | null> => {
    const cep = normalizeCep(rawCep);
    if (cep.length !== 8) return null;
    setLoading(true);
    try {
      // 1) ViaCEP
      const via = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (via.ok) {
        const data = await via.json();
        if (!data.erro) {
          return {
            street: data.logradouro || "",
            neighborhood: data.bairro || undefined,
            city: data.localidade || "",
            state: data.uf || "",
          };
        }
      }

      // 2) Fallback: BrasilAPI
      const br = await fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`);
      if (br.ok) {
        const data = await br.json();
        return {
          street: data.street || "",
          neighborhood: data.neighborhood || undefined,
          city: data.city || "",
          state: data.state || "",
        };
      }

      toast({
        title: "CEP não encontrado",
        description: "Não foi possível localizar o endereço para este CEP. Verifique se o CEP está correto.",
        variant: "destructive",
      });
      return null;
    } catch (e) {
      console.error('Erro ao buscar CEP:', e);
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao serviço de CEP. Verifique sua conexão com a internet.",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return { lookup, loading };
};
