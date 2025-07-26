import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useFinancas } from "@/hooks/useSupabase";
import CustomIncomeManager from "./CustomIncomeManager";
import CustomExpenseManager from "./CustomExpenseManager";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, TrendingDown, DollarSign, PiggyBank, Receipt, CreditCard, Calculator, AlertTriangle } from "lucide-react";

interface CustomIncome {
  id: string;
  description: string;
  value: number;
  date: string;
  category: string;
}

interface CustomExpense {
  id: string;
  description: string;
  value: number;
  date: string;
  category: string;
}

const FinanceManager = () => {
  const { toast } = useToast();
  const { contasPagar, valoresRecebidos, loading, error, updateReceitas, updateDespesas } = useFinancas();
  
  const currentMonth = new Date().toISOString().slice(0, 7);
  
  const [income, setIncome] = useState({
    banhos_porte_pequeno: 0,
    banhos_porte_medio: 0,
    banhos_porte_grande: 0,
    banhos_medicamentosos: 0,
    tosas: 0,
    hospedagens: 0,
    creche: 0,
    taxi_dog: 0,
    boutique: 0
  });

  const [expenses, setExpenses] = useState({
    aluguel: 0,
    copel: 0,
    sanepar: 0,
    internet: 0,
    seguranca_mensalidade: 0,
    mei: 0,
    celular_mes: 0,
    toalhas: 0,
    gasolina: 0,
    cartao_nu: 0,
  });

  const [customIncomes, setCustomIncomes] = useState<CustomIncome[]>([]);
  const [customExpenses, setCustomExpenses] = useState<CustomExpense[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const serviceValues = {
    banhos_porte_pequeno: 0,
    banhos_porte_medio: 0,
    banhos_porte_grande: 0,
    banhos_medicamentosos: 0,
    tosas: 0,
    hospedagens: 0,
    creche: 0.,
    taxi_dog: 0,
    boutique: 0
  };

  const loadCustomData = async () => {
    try {
      const { data: receitasData, error: receitasError } = await supabase
        .from('receitas_personalizadas')
        .select('*')
        .eq('mes_referencia', currentMonth);

      if (receitasError) throw receitasError;

      const mappedReceitas: CustomIncome[] = (receitasData || []).map(item => ({
        id: item.id,
        description: item.descricao,
        value: Number(item.valor),
        date: item.data_receita || '',
        category: 'Receita Personalizada'
      }));
      setCustomIncomes(mappedReceitas);

      const { data: despesasData, error: despesasError } = await supabase
        .from('despesas_personalizadas')
        .select('*')
        .eq('mes_referencia', currentMonth);

      if (despesasError) throw despesasError;

      const mappedDespesas: CustomExpense[] = (despesasData || []).map(item => ({
        id: item.id,
        description: item.descricao,
        value: Number(item.valor),
        date: item.data_despesa || '',
        category: 'Despesa Personalizada'
      }));
      setCustomExpenses(mappedDespesas);

    } catch (error) {
      console.error('Erro ao carregar dados personalizados:', error);
    }
  };

  useEffect(() => {
    if (valoresRecebidos && valoresRecebidos.length > 0) {
      const currentMonthData = valoresRecebidos.find(item => item.mes_referencia === currentMonth);
      if (currentMonthData) {
        setIncome({
          banhos_porte_pequeno: currentMonthData.banhos_porte_pequeno || 0,
          banhos_porte_medio: currentMonthData.banhos_porte_medio || 0,
          banhos_porte_grande: currentMonthData.banhos_porte_grande || 0,
          banhos_medicamentosos: currentMonthData.banhos_medicamentosos || 0,
          tosas: currentMonthData.tosas || 0,
          hospedagens: currentMonthData.hospedagens || 0,
          creche: currentMonthData.creche || 0,
          taxi_dog: currentMonthData.taxi_dog || 0,
          boutique: currentMonthData.boutique || 0
        });
      }
    }

    if (contasPagar && contasPagar.length > 0) {
      const currentMonthData = contasPagar.find(item => item.mes_referencia === currentMonth);
      if (currentMonthData) {
        setExpenses({
          aluguel: currentMonthData.aluguel || 0,
          copel: currentMonthData.copel || 0,
          sanepar: currentMonthData.sanepar || 0,
          internet: currentMonthData.internet || 0,
          seguranca_mensalidade: currentMonthData.seguranca_mensalidade || 0,
          mei: currentMonthData.mei || 0,
          celular_mes: currentMonthData.celular_mes || 0,
          toalhas: currentMonthData.toalha || 0,
          gasolina: currentMonthData.gasolina || 0,
          cartao_nu: currentMonthData.cartao_nu || 0
        });
      }
    }

    loadCustomData();
  }, [valoresRecebidos, contasPagar, currentMonth]);

  const handleIncomeChange = (field: string, value: string) => {
    setIncome(prev => ({ ...prev, [field]: Number(value) || 0 }));
  };

  const handleExpenseChange = (field: string, value: string) => {
    setExpenses(prev => ({ ...prev, [field]: Number(value) || 0 }));
  };

  const saveAllChanges = async () => {
    setIsSaving(true);
    try {
      const totalEntradas = Object.entries(income).reduce((sum: number, [key, quantity]) => {
        const value = serviceValues[key as keyof typeof serviceValues];
        return sum + (Number(quantity) * Number(value));
      }, 0);
      
      await updateReceitas(currentMonth, { ...income, total_entradas: totalEntradas });

      const totalSaidas = Object.values(expenses).reduce((sum: number, val: string | number) => {
        return sum + (Number(val) || 0);
      }, 0);
      
      await updateDespesas(currentMonth, { ...expenses, total_saidas: totalSaidas });

      toast({
        title: "Alterações salvas!",
        description: "Todas as receitas e despesas foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao salvar alterações:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as alterações.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddIncome = async (incomeData: Omit<CustomIncome, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('receitas_personalizadas')
        .insert([{
          descricao: incomeData.description,
          valor: incomeData.value,
          data_receita: incomeData.date,
          mes_referencia: currentMonth
        }])
        .select()
        .single();

      if (error) throw error;

      const newIncome: CustomIncome = {
        id: data.id,
        description: data.descricao,
        value: Number(data.valor),
        date: data.data_receita || '',
        category: 'Receita Personalizada'
      };

      setCustomIncomes(prev => [...prev, newIncome]);
    } catch (error) {
      console.error('Erro ao adicionar receita:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a receita.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateIncome = async (id: string, updates: Partial<CustomIncome>) => {
    try {
      const { error } = await supabase
        .from('receitas_personalizadas')
        .update({
          descricao: updates.description,
          valor: updates.value,
          data_receita: updates.date
        })
        .eq('id', id);

      if (error) throw error;

      setCustomIncomes(prev => prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      ));
    } catch (error) {
      console.error('Erro ao atualizar receita:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a receita.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteIncome = async (id: string) => {
    try {
      const { error } = await supabase
        .from('receitas_personalizadas')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCustomIncomes(prev => prev.filter(item => item.id !== id));
      
      toast({
        title: "Receita removida",
        description: "A receita foi removida com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao deletar receita:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a receita.",
        variant: "destructive"
      });
    }
  };

  const handleAddExpense = async (expenseData: Omit<CustomExpense, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('despesas_personalizadas')
        .insert([{
          descricao: expenseData.description,
          valor: expenseData.value,
          data_despesa: expenseData.date,
          mes_referencia: currentMonth
        }])
        .select()
        .single();

      if (error) throw error;

      const newExpense: CustomExpense = {
        id: data.id,
        description: data.descricao,
        value: Number(data.valor),
        date: data.data_despesa || '',
        category: 'Despesa Personalizada'
      };

      setCustomExpenses(prev => [...prev, newExpense]);
    } catch (error) {
      console.error('Erro ao adicionar despesa:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a despesa.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateExpense = async (id: string, updates: Partial<CustomExpense>) => {
    try {
      const { error } = await supabase
        .from('despesas_personalizadas')
        .update({
          descricao: updates.description,
          valor: updates.value,
          data_despesa: updates.date
        })
        .eq('id', id);

      if (error) throw error;

      setCustomExpenses(prev => prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      ));
    } catch (error) {
      console.error('Erro ao atualizar despesa:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a despesa.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      const { error } = await supabase
        .from('despesas_personalizadas')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCustomExpenses(prev => prev.filter(item => item.id !== id));
      
      toast({
        title: "Despesa removida",
        description: "A despesa foi removida com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao deletar despesa:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a despesa.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-cyan"></div>
          <p className="text-gray-600 font-poppins">Carregando dados financeiros...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 font-poppins font-semibold mb-2">Erro ao carregar dados financeiros</p>
          <p className="text-red-500 font-poppins text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const totalExpenses = Object.values(expenses).reduce((sum: number, value: string | number) => {
    return sum + (Number(value) || 0);
  }, 0);
  
  const totalServiceIncome = Object.values(income).reduce((sum, value) => {
  return sum + Number(value || 0);
  }, 0);

  
  const totalCustomIncome = customIncomes.reduce((sum: number, income) => {
    return sum + (Number(income.value) || 0);
  }, 0);
  
  const totalCustomExpenses = customExpenses.reduce((sum: number, expense) => {
    return sum + (Number(expense.value) || 0);
  }, 0);
  
  const totalIncome = totalServiceIncome + totalCustomIncome;
  const totalAllExpenses = totalExpenses + totalCustomExpenses;
  const finalBalance = totalIncome - totalAllExpenses;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="bg-gradient-to-r from-brand-cyan to-brand-orange p-3 rounded-full">
            <Calculator className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 font-poppins">Gestão Financeira</h2>
        </div>
        <p className="text-gray-600 font-poppins text-lg">Controle completo das finanças do seu negócio</p>
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-blue-800 font-poppins font-medium">Mês de referência: {new Date(currentMonth + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-700 font-poppins font-medium text-sm">Total de Receitas</p>
                <p className="text-3xl font-bold text-green-800 font-poppins">
                  R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-green-200 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-700 font-poppins font-medium text-sm">Total de Despesas</p>
                <p className="text-3xl font-bold text-red-800 font-poppins">
                  R$ {totalAllExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-red-200 p-3 rounded-full">
                <TrendingDown className="h-6 w-6 text-red-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br ${finalBalance >= 0 ? 'from-blue-50 to-blue-100 border-blue-200' : 'from-orange-50 to-orange-100 border-orange-200'}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`${finalBalance >= 0 ? 'text-blue-700' : 'text-orange-700'} font-poppins font-medium text-sm`}>Saldo Final</p>
                <p className={`text-3xl font-bold ${finalBalance >= 0 ? 'text-blue-800' : 'text-orange-800'} font-poppins`}>
                  R$ {finalBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className={`${finalBalance >= 0 ? 'bg-blue-200' : 'bg-orange-200'} p-3 rounded-full`}>
                <PiggyBank className={`h-6 w-6 ${finalBalance >= 0 ? 'text-blue-700' : 'text-orange-700'}`} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-700 font-poppins font-medium text-sm">Margem</p>
                <p className="text-3xl font-bold text-purple-800 font-poppins">
                  {totalIncome > 0 ? ((finalBalance / totalIncome) * 100).toFixed(1) : '0.0'}%
                </p>
              </div>
              <div className="bg-purple-200 p-3 rounded-full">
                <Calculator className="h-6 w-6 text-purple-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button 
          onClick={saveAllChanges} 
          disabled={isSaving}
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 font-poppins font-semibold shadow-lg"
        >
          {isSaving ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Salvando...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Salvar Todas as Alterações
            </div>
          )}
        </Button>
      </div>

      <Card className="bg-gradient-to-br from-blue-50/50 to-cyan-50/50 border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2 font-poppins">
            <Receipt className="h-5 w-5" />
            Receitas de Serviços - {currentMonth}
          </CardTitle>
          <CardDescription className="text-blue-100 font-poppins">
            Informe a quantidade de serviços realizados no mês
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(serviceValues).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key} className="font-poppins font-medium text-gray-700">
                  {key === 'banhos_porte_pequeno' && 'Banhos Pequeno'}
                  {key === 'banhos_porte_medio' && 'Banhos Medio'}
                  {key === 'banhos_porte_grande' && 'Banhos Grande'}
                  {key === 'banhos_medicamentosos' && 'Banhos Medicamentosos'}
                  {key === 'tosas' && 'Tosas'}
                  {key === 'hospedagens' && 'Hospedagens'}
                  {key === 'creche' && 'Creche'}
                  {key === 'taxi_dog' && 'Taxi Dog'}
                  {key === 'boutique' && 'boutique'}
                </Label>
                <Input
                  type="number"
                  id={key}
                  value={income[key as keyof typeof income].toString()}
                  onChange={(e) => handleIncomeChange(key, e.target.value)}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  min="0"
                />
                
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-bold text-green-800 font-poppins text-lg">Total de Receitas de Serviços:</span>
              <span className="font-bold text-green-800 font-poppins text-2xl">
                R$ {totalServiceIncome.toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <CustomIncomeManager 
        customIncomes={customIncomes} 
        onAddIncome={handleAddIncome}
        onUpdateIncome={handleUpdateIncome}
        onDeleteIncome={handleDeleteIncome}
      />

      <Card className="bg-gradient-to-br from-red-50/50 to-orange-50/50 border-red-200">
        <CardHeader className="bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2 font-poppins">
            <CreditCard className="h-5 w-5" />
            Despesas Mensais Fixas - {currentMonth}
          </CardTitle>
          <CardDescription className="text-red-100 font-poppins">
            Informe os valores das despesas fixas do mês
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(expenses).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key} className="font-poppins font-medium text-gray-700 capitalize">
                  {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Label>
                <Input
                  type="number"
                  id={key}
                  value={value.toString()}
                  onChange={(e) => handleExpenseChange(key, e.target.value)}
                  className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                  min="0"
                  step="0.01"
                />
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-bold text-red-800 font-poppins text-lg">Total de Despesas Fixas:</span>
              <span className="font-bold text-red-800 font-poppins text-2xl">
                R$ {totalExpenses.toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <CustomExpenseManager 
        customExpenses={customExpenses} 
        onAddExpense={handleAddExpense}
        onUpdateExpense={handleUpdateExpense}
        onDeleteExpense={handleDeleteExpense}
      />

      <Card className={`bg-gradient-to-br ${finalBalance >= 0 ? 'from-green-50 to-emerald-50 border-green-300' : 'from-red-50 to-rose-50 border-red-300'} shadow-lg`}>
        <CardHeader className={`${finalBalance >= 0 ? 'bg-gradient-to-r from-green-600 to-emerald-600' : 'bg-gradient-to-r from-red-600 to-rose-600'} text-white rounded-t-lg`}>
          <CardTitle className="flex items-center gap-2 font-poppins text-xl">
            <PiggyBank className="h-6 w-6" />
            Resultado Financeiro Final
          </CardTitle>
          <CardDescription className={`${finalBalance >= 0 ? 'text-green-100' : 'text-red-100'} font-poppins`}>
            Balanço geral do mês de {new Date(currentMonth + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            <div className={`text-6xl font-extrabold ${finalBalance >= 0 ? 'text-green-700' : 'text-red-700'} font-poppins`}>
              R$ {finalBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center justify-center gap-4">
              <div className={`px-6 py-3 rounded-full ${finalBalance >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} font-poppins font-semibold`}>
                {finalBalance >= 0 ? '✓ LUCRO' : '⚠ PREJUÍZO'}
              </div>
              {totalIncome > 0 && (
                <div className="px-6 py-3 rounded-full bg-gray-100 text-gray-800 font-poppins font-semibold">
                  Margem: {((finalBalance / totalIncome) * 100).toFixed(1)}%
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="text-center p-4 bg-white/60 rounded-lg">
                <p className="text-gray-600 font-poppins font-medium">Receitas Totais</p>
                <p className="text-2xl font-bold text-green-700 font-poppins">
                  R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="text-center p-4 bg-white/60 rounded-lg">
                <p className="text-gray-600 font-poppins font-medium">Despesas Totais</p>
                <p className="text-2xl font-bold text-red-700 font-poppins">
                  R$ {totalAllExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceManager;
