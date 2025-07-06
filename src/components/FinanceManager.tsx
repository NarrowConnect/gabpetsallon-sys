import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, TrendingUp, TrendingDown, Receipt, CreditCard, FileText } from "lucide-react";
import { useFinancas } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";
import CustomIncomeManager from "./CustomIncomeManager";
import CustomExpenseManager from "./CustomExpenseManager";
import FinancialReports from "./FinancialReports";
import { supabase } from "@/integrations/supabase/client";

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
  
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
  
  // Find current month data or use defaults
  const currentExpenses = contasPagar.find(item => item.mes_referencia === currentMonth) || {
    aluguel: 0,
    copel: 0,
    sanepar: 0,
    internet: 0,
    seguranca_mensalidade: 0,
    mei: 0,
    celular_mes: 0,
    lavanderia: 0,
    gasolina: 0,
    tarifa_bancaria: 0,
    cartao_santander: 0,
    cartao_bb: 0,
    cartao_nu: 0,
    cartao_gab: 0,
    boleto_biocom: 0,
    boleto_euroshop: 0
  };

  const currentIncome = valoresRecebidos.find(item => item.mes_referencia === currentMonth) || {
    banhos_porte_pequeno: 0,
    banhos_porte_grande: 0,
    tosas: 0,
    hospedagens: 0,
    roupas: 0,
    taxi_dog: 0
  };

  const [expenses, setExpenses] = useState(currentExpenses);
  const [income, setIncome] = useState({
    banhosPortePequeno: Number(currentIncome.banhos_porte_pequeno) || 0,
    banhosPorteGrande: Number(currentIncome.banhos_porte_grande) || 0,
    tosas: Number(currentIncome.tosas) || 0,
    hospedagens: Number(currentIncome.hospedagens) || 0,
    roupas: Number(currentIncome.roupas) || 0,
    taxiDog: Number(currentIncome.taxi_dog) || 0
  });

  const [serviceValues] = useState({
    banhosPortePequeno: 35.00,
    banhosPorteGrande: 50.00,
    tosas: 80.00,
    hospedagens: 45.00,
    roupas: 25.00,
    taxiDog: 30.00
  });

  const [customIncomes, setCustomIncomes] = useState<CustomIncome[]>([]);
  const [customExpenses, setCustomExpenses] = useState<CustomExpense[]>([]);
  const [reportData, setReportData] = useState<any[]>([]);

  // Load custom incomes and expenses from Supabase
  useEffect(() => {
    loadCustomData();
  }, []);

  const loadCustomData = async () => {
    try {
      // Load custom incomes
      const { data: receitas } = await supabase
        .from('receitas_personalizadas')
        .select('*')
        .eq('mes_referencia', currentMonth);

      if (receitas) {
        const mappedIncomes: CustomIncome[] = receitas.map(item => ({
          id: item.id,
          description: item.descricao,
          value: Number(item.valor),
          date: item.data_receita,
          category: 'Personalizada'
        }));
        setCustomIncomes(mappedIncomes);
      }

      // Load custom expenses
      const { data: despesas } = await supabase
        .from('despesas_personalizadas')
        .select('*')
        .eq('mes_referencia', currentMonth);

      if (despesas) {
        const mappedExpenses: CustomExpense[] = despesas.map(item => ({
          id: item.id,
          description: item.descricao,
          value: Number(item.valor),
          date: item.data_despesa,
          category: 'Personalizada'
        }));
        setCustomExpenses(mappedExpenses);
      }
    } catch (error) {
      console.error('Erro ao carregar dados personalizados:', error);
    }
  };

  // Update expenses in Supabase when they change
  const handleExpenseChange = async (key: string, value: number) => {
    const newExpenses = { ...expenses, [key]: value };
    setExpenses(newExpenses);

    try {
      const totalSaidas = Object.values(newExpenses).reduce((sum: number, val: string | number) => {
        return sum + Number(val || 0);
      }, 0);
      await updateDespesas(currentMonth, { ...newExpenses, total_saidas: totalSaidas });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar despesa.",
        variant: "destructive"
      });
    }
  };

  // Update income in Supabase when it changes
  const handleIncomeChange = async (key: string, value: number) => {
    const newIncome = { ...income, [key]: value };
    setIncome(newIncome);

    try {
      const supabaseData = {
        banhos_porte_pequeno: newIncome.banhosPortePequeno,
        banhos_porte_grande: newIncome.banhosPorteGrande,
        tosas: newIncome.tosas,
        hospedagens: newIncome.hospedagens,
        roupas: newIncome.roupas,
        taxi_dog: newIncome.taxiDog
      };

      const totalEntradas = Object.entries(newIncome).reduce((sum: number, [key, quantity]) => {
        const value = serviceValues[key as keyof typeof serviceValues];
        return sum + (Number(quantity) * Number(value));
      }, 0);

      await updateReceitas(currentMonth, { ...supabaseData, total_entradas: totalEntradas });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar receita.",
        variant: "destructive"
      });
    }
  };

  const totalExpenses = Object.values(expenses).reduce((sum: number, value: string | number) => {
    return sum + Number(value || 0);
  }, 0);
  
  const totalServiceIncome = Object.entries(income).reduce((sum: number, [key, quantity]) => {
    const value = serviceValues[key as keyof typeof serviceValues];
    return sum + (Number(quantity) * Number(value));
  }, 0);
  
  const totalCustomIncome = customIncomes.reduce((sum: number, income) => {
    return sum + Number(income.value);
  }, 0);
  
  const totalCustomExpenses = customExpenses.reduce((sum: number, expense) => {
    return sum + Number(expense.value);
  }, 0);
  
  const totalIncome = totalServiceIncome + totalCustomIncome;
  const totalAllExpenses = totalExpenses + totalCustomExpenses;
  const netBalance = totalIncome - totalAllExpenses;

  const handleAddCustomIncome = async (income: Omit<CustomIncome, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('receitas_personalizadas')
        .insert([{
          descricao: income.description,
          valor: income.value,
          data_receita: income.date,
          mes_referencia: currentMonth
        }])
        .select()
        .single();

      if (error) throw error;

      const newIncome: CustomIncome = {
        id: data.id,
        description: data.descricao,
        value: data.valor,
        date: data.data_receita,
        category: 'Personalizada'
      };
      setCustomIncomes([...customIncomes, newIncome]);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar receita personalizada.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateCustomIncome = async (id: string, updates: Partial<CustomIncome>) => {
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

      setCustomIncomes(customIncomes.map(income => 
        income.id === id ? { ...income, ...updates } : income
      ));
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar receita personalizada.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteCustomIncome = async (id: string) => {
    try {
      const { error } = await supabase
        .from('receitas_personalizadas')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCustomIncomes(customIncomes.filter(income => income.id !== id));
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao remover receita personalizada.",
        variant: "destructive"
      });
    }
  };

  const handleAddCustomExpense = async (expense: Omit<CustomExpense, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('despesas_personalizadas')
        .insert([{
          descricao: expense.description,
          valor: expense.value,
          data_despesa: expense.date,
          mes_referencia: currentMonth
        }])
        .select()
        .single();

      if (error) throw error;

      const newExpense: CustomExpense = {
        id: data.id,
        description: data.descricao,
        value: data.valor,
        date: data.data_despesa,
        category: 'Personalizada'
      };
      setCustomExpenses([...customExpenses, newExpense]);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar despesa personalizada.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateCustomExpense = async (id: string, updates: Partial<CustomExpense>) => {
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

      setCustomExpenses(customExpenses.map(expense => 
        expense.id === id ? { ...expense, ...updates } : expense
      ));
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar despesa personalizada.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteCustomExpense = async (id: string) => {
    try {
      const { error } = await supabase
        .from('despesas_personalizadas')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCustomExpenses(customExpenses.filter(expense => expense.id !== id));
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao remover despesa personalizada.",
        variant: "destructive"
      });
    }
  };

  const handleGenerateReport = (month: string, year: string) => {
    const newReport = {
      month,
      year,
      totalIncome,
      totalExpenses: totalAllExpenses,
      netBalance
    };
    setReportData([...reportData, newReport]);
  };

  const serviceNames = {
    banhosPortePequeno: 'Banhos Porte Pequeno',
    banhosPorteGrande: 'Banhos Porte Grande',
    tosas: 'Tosas',
    hospedagens: 'Hospedagens',
    roupas: 'Roupas',
    taxiDog: 'Taxi Dog'
  };

  const expenseNames = {
    aluguel: 'Aluguel',
    copel: 'COPEL (Energia)',
    sanepar: 'SANEPAR (Água)',
    internet: 'Internet',
    seguranca_mensalidade: 'Segurança',
    mei: 'MEI',
    celular_mes: 'Celular',
    lavanderia: 'Lavanderia',
    gasolina: 'Gasolina',
    tarifa_bancaria: 'Tarifa Bancária',
    cartao_santander: 'Cartão Santander',
    cartao_bb: 'Cartão Banco do Brasil',
    cartao_nu: 'Cartão Nubank',
    cartao_gab: 'Cartão Gab',
    boleto_biocom: 'Boleto Biocom',
    boleto_euroshop: 'Boleto Euroshop'
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Erro ao carregar dados financeiros: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Controle Financeiro</h2>
          <p className="text-muted-foreground">Gerencie receitas e despesas do petshop</p>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Receitas do Mês</CardTitle>
            <TrendingUp className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <p className="text-xs opacity-75">Serviços + Receitas personalizadas</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Despesas do Mês</CardTitle>
            <TrendingDown className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalAllExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <p className="text-xs opacity-75">Fixas + Adicionais</p>
          </CardContent>
        </Card>

        <Card className={`${netBalance >= 0 ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-orange-500 to-orange-600'} text-white border-0 shadow-lg`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Saldo Atual</CardTitle>
            <DollarSign className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {netBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <p className="text-xs opacity-75">{netBalance >= 0 ? 'Lucro do mês' : 'Déficit do mês'}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="income" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-white/50 backdrop-blur-sm">
          <TabsTrigger value="income" className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            Receitas
          </TabsTrigger>
          <TabsTrigger value="expenses" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Despesas
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Relatórios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="income" className="space-y-6">
          <Card className="bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Receitas por Serviço</CardTitle>
              <CardDescription>Quantidade de serviços realizados no mês</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(income).map(([key, quantity]) => {
                  const serviceName = serviceNames[key as keyof typeof serviceNames];
                  const unitValue = serviceValues[key as keyof typeof serviceValues];
                  const totalValue = Number(quantity) * Number(unitValue);

                  return (
                    <div key={key} className="flex items-center justify-between p-4 border rounded-lg bg-white/50 hover:bg-white/80 transition-colors">
                      <div className="flex flex-col">
                        <span className="font-medium">{serviceName}</span>
                        <span className="text-sm text-muted-foreground">R$ {unitValue.toFixed(2)} cada</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <Input
                          type="number"
                          value={quantity}
                          onChange={(e) => handleIncomeChange(key, parseInt(e.target.value) || 0)}
                          className="w-20 text-center"
                        />
                        <span className="font-medium text-green-600 w-24 text-right">
                          R$ {totalValue.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <span className="font-bold text-lg">Total de Serviços</span>
                    <span className="font-bold text-lg text-green-600">
                      R$ {totalServiceIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <CustomIncomeManager
            customIncomes={customIncomes}
            onAddIncome={handleAddCustomIncome}
            onUpdateIncome={handleUpdateCustomIncome}
            onDeleteIncome={handleDeleteCustomIncome}
          />
        </TabsContent>

        <TabsContent value="expenses" className="space-y-6">
          <Card className="bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Contas a Pagar</CardTitle>
              <CardDescription>Despesas fixas mensais</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(expenses).map(([key, value]) => {
                  const expenseName = expenseNames[key as keyof typeof expenseNames];
                  if (!expenseName) return null;

                  return (
                    <div key={key} className="flex items-center justify-between p-4 border rounded-lg bg-white/50 hover:bg-white/80 transition-colors">
                      <span className="font-medium">{expenseName}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">R$</span>
                        <Input
                          type="number"
                          step="0.01"
                          value={Number(value) || 0}
                          onChange={(e) => handleExpenseChange(key, parseFloat(e.target.value) || 0)}
                          className="w-24 text-right"
                        />
                      </div>
                    </div>
                  );
                })}
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                    <span className="font-bold text-lg">Total de Despesas Fixas</span>
                    <span className="font-bold text-lg text-red-600">
                      R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <CustomExpenseManager
            customExpenses={customExpenses}
            onAddExpense={handleAddCustomExpense}
            onUpdateExpense={handleUpdateCustomExpense}
            onDeleteExpense={handleDeleteCustomExpense}
          />
        </TabsContent>

        <TabsContent value="reports">
          <FinancialReports
            reportData={reportData}
            onGenerateReport={handleGenerateReport}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinanceManager;
