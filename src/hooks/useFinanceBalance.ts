import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface FinanceBalance {
  mesReferencia: string;
  saldoFinal: number;
  totalReceitas: number;
  totalDespesas: number;
}

export const useFinanceBalance = () => {
  const [balanceHistory, setBalanceHistory] = useState<FinanceBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getMonthBalance = async (mesReferencia: string): Promise<number> => {
    try {
      // Buscar receitas do mês
      const { data: receitas, error: receitasError } = await supabase
        .from('valores_recebidos')
        .select('total_entradas')
        .eq('mes_referencia', mesReferencia)
        .single();

      // Buscar receitas personalizadas
      const { data: receitasPersonalizadas, error: receitasPersonalizadasError } = await supabase
        .from('receitas_personalizadas')
        .select('valor')
        .eq('mes_referencia', mesReferencia);

      // Buscar despesas do mês
      const { data: despesas, error: despesasError } = await supabase
        .from('contas_a_pagar')
        .select('total_saidas')
        .eq('mes_referencia', mesReferencia)
        .single();

      // Buscar despesas personalizadas
      const { data: despesasPersonalizadas, error: despesasPersonalizadasError } = await supabase
        .from('despesas_personalizadas')
        .select('valor')
        .eq('mes_referencia', mesReferencia);

      const totalReceitas = (receitas?.total_entradas || 0) + 
        (receitasPersonalizadas?.reduce((sum, r) => sum + Number(r.valor), 0) || 0);

      const totalDespesas = (despesas?.total_saidas || 0) + 
        (despesasPersonalizadas?.reduce((sum, d) => sum + Number(d.valor), 0) || 0);

      return totalReceitas - totalDespesas;
    } catch (err) {
      console.error('Erro ao calcular saldo:', err);
      return 0;
    }
  };

  const updateMonthBalance = async (mesReferencia: string) => {
    const saldoFinal = await getMonthBalance(mesReferencia);
    
    // Atualizar ou inserir no controle financeiro
    const { data: existing } = await supabase
      .from('controle_financeiro')
      .select('*')
      .eq('mes_referencia', mesReferencia)
      .single();

    if (existing) {
      await supabase
        .from('controle_financeiro')
        .update({ 
          saldo_atual: saldoFinal,
          saldo_transportar: saldoFinal 
        })
        .eq('mes_referencia', mesReferencia);
    } else {
      await supabase
        .from('controle_financeiro')
        .insert([{
          mes_referencia: mesReferencia,
          saldo_atual: saldoFinal,
          saldo_transportar: saldoFinal,
          total_entradas: 0,
          total_saidas: 0,
          saldo_anterior: 0
        }]);
    }
  };

  const linkMonthlyBalances = async () => {
    try {
      setLoading(true);
      
      // Buscar todos os meses com dados
      const { data: allData, error } = await supabase
        .from('controle_financeiro')
        .select('*')
        .order('mes_referencia');

      if (error) throw error;

      let saldoAcumulado = 0;
      
      for (const item of allData || []) {
        const saldoMes = await getMonthBalance(item.mes_referencia);
        saldoAcumulado += saldoMes;
        
        await supabase
          .from('controle_financeiro')
          .update({
            saldo_atual: saldoMes,
            saldo_transportar: saldoAcumulado
          })
          .eq('mes_referencia', item.mes_referencia);
      }

      // Atualizar estado local
      const updatedBalance = allData?.map(item => ({
        mesReferencia: item.mes_referencia,
        saldoFinal: saldoAcumulado,
        totalReceitas: item.total_entradas || 0,
        totalDespesas: item.total_saidas || 0
      })) || [];

      setBalanceHistory(updatedBalance);
    } catch (err) {
      console.error('Erro ao linkar saldos mensais:', err);
      setError('Erro ao processar saldos mensais');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    linkMonthlyBalances();
  }, []);

  return {
    balanceHistory,
    loading,
    error,
    updateMonthBalance,
    linkMonthlyBalances
  };
};