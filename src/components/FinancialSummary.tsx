import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, PiggyBank, Calculator, Banknote, CreditCard, Wallet } from "lucide-react";
import { useFinancas } from "@/hooks/useSupabase";
import { supabase } from "@/integrations/supabase/client";

interface FinanceSummaryData {
  totalReceitas: number;
  totalDespesas: number;
  saldoFinal: number;
  mesesComDados: number;
  receitaMedia: number;
  despesaMedia: number;
}

const FinancialSummary = () => {
  const { contasPagar, valoresRecebidos, loading } = useFinancas();
  const [summaryData, setSummaryData] = useState<FinanceSummaryData>({
    totalReceitas: 0,
    totalDespesas: 0,
    saldoFinal: 0,
    mesesComDados: 0,
    receitaMedia: 0,
    despesaMedia: 0
  });
  const [customData, setCustomData] = useState({
    receitasPersonalizadas: 0,
    despesasPersonalizadas: 0
  });

  useEffect(() => {
    const loadCustomData = async () => {
      try {
        // Buscar receitas personalizadas
        const { data: receitasData } = await supabase
          .from('receitas_personalizadas')
          .select('valor');

        // Buscar despesas personalizadas
        const { data: despesasData } = await supabase
          .from('despesas_personalizadas')
          .select('valor');

        const totalReceitasPersonalizadas = receitasData?.reduce((sum, item) => sum + Number(item.valor || 0), 0) || 0;
        const totalDespesasPersonalizadas = despesasData?.reduce((sum, item) => sum + Number(item.valor || 0), 0) || 0;

        setCustomData({
          receitasPersonalizadas: totalReceitasPersonalizadas,
          despesasPersonalizadas: totalDespesasPersonalizadas
        });
      } catch (error) {
        console.error('Erro ao carregar dados personalizados:', error);
      }
    };

    loadCustomData();
  }, []);

  useEffect(() => {
    if (!contasPagar || !valoresRecebidos) return;

    // Calcular totais de receitas fixas
    const totalReceitasFixas = valoresRecebidos.reduce((sum, item) => {
      return sum + Number(item.total_entradas || 0);
    }, 0);

    // Calcular totais de despesas fixas
    const totalDespesasFixas = contasPagar.reduce((sum, item) => {
      return sum + Number(item.total_saidas || 0);
    }, 0);

    // Somar com receitas e despesas personalizadas
    const totalReceitas = totalReceitasFixas + customData.receitasPersonalizadas;
    const totalDespesas = totalDespesasFixas + customData.despesasPersonalizadas;
    const saldoFinal = totalReceitas - totalDespesas;

    // Calcular número de meses com dados
    const mesesUnicos = new Set([
      ...valoresRecebidos.map(item => item.mes_referencia),
      ...contasPagar.map(item => item.mes_referencia)
    ]);
    const mesesComDados = mesesUnicos.size;

    // Calcular médias
    const receitaMedia = mesesComDados > 0 ? totalReceitas / mesesComDados : 0;
    const despesaMedia = mesesComDados > 0 ? totalDespesas / mesesComDados : 0;

    setSummaryData({
      totalReceitas,
      totalDespesas,
      saldoFinal,
      mesesComDados,
      receitaMedia,
      despesaMedia
    });
  }, [contasPagar, valoresRecebidos, customData]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-white/50 animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumo Geral - Cards Principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total de Receitas */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-700 font-poppins font-medium text-sm">Total de Receitas (Todos os Meses)</p>
                <p className="text-3xl font-bold text-green-800 font-poppins">
                  R$ {summaryData.totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                {summaryData.mesesComDados > 0 && (
                  <p className="text-sm text-green-600 font-poppins mt-1">
                    Média: R$ {summaryData.receitaMedia.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês
                  </p>
                )}
              </div>
              <div className="bg-green-200 p-3 rounded-full">
                <TrendingUp className="h-8 w-8 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total de Despesas */}
        <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-700 font-poppins font-medium text-sm">Total de Despesas (Todos os Meses)</p>
                <p className="text-3xl font-bold text-red-800 font-poppins">
                  R$ {summaryData.totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                {summaryData.mesesComDados > 0 && (
                  <p className="text-sm text-red-600 font-poppins mt-1">
                    Média: R$ {summaryData.despesaMedia.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês
                  </p>
                )}
              </div>
              <div className="bg-red-200 p-3 rounded-full">
                <TrendingDown className="h-8 w-8 text-red-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Saldo Final Geral */}
        <Card className={`bg-gradient-to-br ${summaryData.saldoFinal >= 0 ? 'from-blue-50 to-cyan-50 border-blue-200' : 'from-orange-50 to-red-50 border-orange-200'} shadow-lg`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`${summaryData.saldoFinal >= 0 ? 'text-blue-700' : 'text-orange-700'} font-poppins font-medium text-sm`}>
                  Saldo Final Geral (Todos os Meses)
                </p>
                <p className={`text-3xl font-bold ${summaryData.saldoFinal >= 0 ? 'text-blue-800' : 'text-orange-800'} font-poppins`}>
                  R$ {summaryData.saldoFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                {summaryData.mesesComDados > 0 && (
                  <p className={`text-sm ${summaryData.saldoFinal >= 0 ? 'text-blue-600' : 'text-orange-600'} font-poppins mt-1`}>
                    {summaryData.mesesComDados} mês(es) de dados
                  </p>
                )}
              </div>
              <div className={`${summaryData.saldoFinal >= 0 ? 'bg-blue-200' : 'bg-orange-200'} p-3 rounded-full`}>
                <PiggyBank className={`h-8 w-8 ${summaryData.saldoFinal >= 0 ? 'text-blue-700' : 'text-orange-700'}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cards de Detalhamento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-700 font-poppins font-medium text-xs">Receitas Extras</p>
                <p className="text-lg font-bold text-teal-800 font-poppins">
                  R$ {customData.receitasPersonalizadas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <Banknote className="h-5 w-5 text-teal-600" />
            </div>
          </CardContent>
        </Card>

        {/* Despesas Fixas vs Personalizadas */}
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-700 font-poppins font-medium text-xs">Despesas Extras</p>
                <p className="text-lg font-bold text-amber-800 font-poppins">
                  R$ {customData.despesasPersonalizadas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <CreditCard className="h-5 w-5 text-amber-600" />
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default FinancialSummary;