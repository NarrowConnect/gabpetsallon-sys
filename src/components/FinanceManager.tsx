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
    banhos_porte_grande: 0,
    banhos_medicamentosos: 0,
    tosas: 0,
    hospedagens: 0,
    taxi_dog: 0,
    roupas: 0
  });

  const [expenses, setExpenses] = useState({
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
  });

  const [customIncomes, setCustomIncomes] = useState<CustomIncome[]>([]);
  const [customExpenses, setCustomExpenses] = useState<CustomExpense[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const serviceValues = {
    banhos_porte_pequeno: 35,
    banhos_porte_grande: 50,
    banhos_medicamentosos: 60,
    tosas: 40,
    hospedagens: 80,
    taxi_dog: 25,
    roupas: 15
  };

  // Carregar receitas e despesas personalizadas
  const loadCustomData = async () => {
    try {
      // Carregar receitas personalizadas
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

      // Carregar despesas personalizadas
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
          banhos_porte_grande: currentMonthData.banhos_porte_grande || 0,
          banhos_medicamentosos: currentMonthData.banhos_medicamentosos || 0,
          tosas: currentMonthData.tosas || 0,
          hospedagens: currentMonthData.hospedagens || 0,
          taxi_dog: currentMonthData.taxi_dog || 0,
          roupas: currentMonthData.roupas || 0
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
          lavanderia: currentMonthData.lavanderia || 0,
          gasolina: currentMonthData.gasolina || 0,
          tarifa_bancaria: currentMonthData.tarifa_bancaria || 0,
          cartao_santander: currentMonthData.cartao_santander || 0,
          cartao_bb: currentMonthData.cartao_bb || 0,
          cartao_nu: currentMonthData.cartao_nu || 0,
          cartao_gab: currentMonthData.cartao_gab || 0,
          boleto_biocom: currentMonthData.boleto_biocom || 0,
          boleto_euroshop: currentMonthData.boleto_euroshop || 0
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
      // Salvar receitas
      const totalEntradas = Object.entries(income).reduce((sum: number, [key, quantity]) => {
        const value = serviceValues[key as keyof typeof serviceValues];
        return sum + (Number(quantity) * Number(value));
      }, 0);
      
      await updateReceitas(currentMonth, { ...income, total_entradas: totalEntradas });

      // Salvar despesas
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

  // Funções para gerenciar receitas personalizadas
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

  // Funções para gerenciar despesas personalizadas
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
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
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

  const totalExpenses = Object.values(expenses).reduce((sum: number, value: string | number) => {
    return sum + (Number(value) || 0);
  }, 0);
  
  const totalServiceIncome = Object.entries(income).reduce((sum: number, [key, quantity]) => {
    const value = serviceValues[key as keyof typeof serviceValues];
    return sum + (Number(quantity) * Number(value));
  }, 0);
  
  const totalCustomIncome = customIncomes.reduce((sum: number, income) => {
    return sum + (Number(income.value) || 0);
  }, 0);
  
  const totalCustomExpenses = customExpenses.reduce((sum: number, expense) => {
    return sum + (Number(expense.value) || 0);
  }, 0);
  
  const totalIncome = totalServiceIncome + totalCustomIncome;
  const totalAllExpenses = totalExpenses + totalCustomExpenses;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Gestão Financeira</h2>
        <p className="text-muted-foreground">Acompanhe as finanças do seu negócio</p>
      </div>

      {/* Botão de Salvar Alterações */}
      <div className="flex justify-center">
        <Button 
          onClick={saveAllChanges} 
          disabled={isSaving}
          size="lg"
          className="bg-green-600 hover:bg-green-700"
        >
          {isSaving ? "Salvando..." : "Salvar Todas as Alterações"}
        </Button>
      </div>

      <Card className="bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Receitas de Serviços - {currentMonth}</CardTitle>
          <CardDescription>
            Informe a quantidade de serviços realizados no mês.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="banhos_porte_pequeno">Banhos Peq. (R$35)</Label>
              <Input
                type="number"
                id="banhos_porte_pequeno"
                value={income.banhos_porte_pequeno.toString()}
                onChange={(e) => handleIncomeChange('banhos_porte_pequeno', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="banhos_porte_grande">Banhos Gde. (R$50)</Label>
              <Input
                type="number"
                id="banhos_porte_grande"
                value={income.banhos_porte_grande.toString()}
                onChange={(e) => handleIncomeChange('banhos_porte_grande', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="banhos_medicamentosos">Banhos Med. (R$60)</Label>
              <Input
                type="number"
                id="banhos_medicamentosos"
                value={income.banhos_medicamentosos.toString()}
                onChange={(e) => handleIncomeChange('banhos_medicamentosos', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="tosas">Tosas (R$40)</Label>
              <Input
                type="number"
                id="tosas"
                value={income.tosas.toString()}
                onChange={(e) => handleIncomeChange('tosas', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="hospedagens">Hospedagens (R$80)</Label>
              <Input
                type="number"
                id="hospedagens"
                value={income.hospedagens.toString()}
                onChange={(e) => handleIncomeChange('hospedagens', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="taxi_dog">Taxi Dog (R$25)</Label>
              <Input
                type="number"
                id="taxi_dog"
                value={income.taxi_dog.toString()}
                onChange={(e) => handleIncomeChange('taxi_dog', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="roupas">Roupas (R$15)</Label>
              <Input
                type="number"
                id="roupas"
                value={income.roupas.toString()}
                onChange={(e) => handleIncomeChange('roupas', e.target.value)}
              />
            </div>
          </div>
          <div className="font-bold text-green-600">
            Total de Receitas de Serviços: R$ {totalServiceIncome.toFixed(2)}
          </div>
        </CardContent>
      </Card>

      <CustomIncomeManager 
        customIncomes={customIncomes} 
        onAddIncome={handleAddIncome}
        onUpdateIncome={handleUpdateIncome}
        onDeleteIncome={handleDeleteIncome}
      />

      <Card className="bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Despesas Mensais Fixas - {currentMonth}</CardTitle>
          <CardDescription>
            Informe os valores das despesas fixas do mês.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="aluguel">Aluguel</Label>
              <Input
                type="number"
                id="aluguel"
                value={expenses.aluguel.toString()}
                onChange={(e) => handleExpenseChange('aluguel', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="copel">Copel</Label>
              <Input
                type="number"
                id="copel"
                value={expenses.copel.toString()}
                onChange={(e) => handleExpenseChange('copel', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="sanepar">Sanepar</Label>
              <Input
                type="number"
                id="sanepar"
                value={expenses.sanepar.toString()}
                onChange={(e) => handleExpenseChange('sanepar', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="internet">Internet</Label>
              <Input
                type="number"
                id="internet"
                value={expenses.internet.toString()}
                onChange={(e) => handleExpenseChange('internet', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="seguranca_mensalidade">Segurança</Label>
              <Input
                type="number"
                id="seguranca_mensalidade"
                value={expenses.seguranca_mensalidade.toString()}
                onChange={(e) => handleExpenseChange('seguranca_mensalidade', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="mei">MEI</Label>
              <Input
                type="number"
                id="mei"
                value={expenses.mei.toString()}
                onChange={(e) => handleExpenseChange('mei', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="celular_mes">Celular</Label>
              <Input
                type="number"
                id="celular_mes"
                value={expenses.celular_mes.toString()}
                onChange={(e) => handleExpenseChange('celular_mes', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="lavanderia">Lavanderia</Label>
              <Input
                type="number"
                id="lavanderia"
                value={expenses.lavanderia.toString()}
                onChange={(e) => handleExpenseChange('lavanderia', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="gasolina">Gasolina</Label>
              <Input
                type="number"
                id="gasolina"
                value={expenses.gasolina.toString()}
                onChange={(e) => handleExpenseChange('gasolina', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="tarifa_bancaria">Tarifa Bancária</Label>
              <Input
                type="number"
                id="tarifa_bancaria"
                value={expenses.tarifa_bancaria.toString()}
                onChange={(e) => handleExpenseChange('tarifa_bancaria', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="cartao_santander">Cartão Santander</Label>
              <Input
                type="number"
                id="cartao_santander"
                value={expenses.cartao_santander.toString()}
                onChange={(e) => handleExpenseChange('cartao_santander', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="cartao_bb">Cartão BB</Label>
              <Input
                type="number"
                id="cartao_bb"
                value={expenses.cartao_bb.toString()}
                onChange={(e) => handleExpenseChange('cartao_bb', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="cartao_nu">Cartão Nu</Label>
              <Input
                type="number"
                id="cartao_nu"
                value={expenses.cartao_nu.toString()}
                onChange={(e) => handleExpenseChange('cartao_nu', e.target.value)}
              />
            </div>
             <div>
              <Label htmlFor="cartao_gab">Cartão Gab</Label>
              <Input
                type="number"
                id="cartao_gab"
                value={expenses.cartao_gab.toString()}
                onChange={(e) => handleExpenseChange('cartao_gab', e.target.value)}
              />
            </div>
             <div>
              <Label htmlFor="boleto_biocom">Boleto Biocom</Label>
              <Input
                type="number"
                id="boleto_biocom"
                value={expenses.boleto_biocom.toString()}
                onChange={(e) => handleExpenseChange('boleto_biocom', e.target.value)}
              />
            </div>
             <div>
              <Label htmlFor="boleto_euroshop">Boleto Euroshop</Label>
              <Input
                type="number"
                id="boleto_euroshop"
                value={expenses.boleto_euroshop.toString()}
                onChange={(e) => handleExpenseChange('boleto_euroshop', e.target.value)}
              />
            </div>
          </div>
          <div className="font-bold text-red-600">
            Total de Despesas Fixas: R$ {totalExpenses.toFixed(2)}
          </div>
        </CardContent>
      </Card>

      <CustomExpenseManager 
        customExpenses={customExpenses} 
        onAddExpense={handleAddExpense}
        onUpdateExpense={handleUpdateExpense}
        onDeleteExpense={handleDeleteExpense}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Total de Receitas</CardTitle>
            <CardDescription>
              Soma das receitas de serviços e receitas adicionais.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">
              R$ {totalIncome.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Total de Despesas</CardTitle>
            <CardDescription>
              Soma das despesas fixas e despesas adicionais.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">
              R$ {totalAllExpenses.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Resultado Financeiro</CardTitle>
          <CardDescription>
            Receitas totais menos despesas totais.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`text-3xl font-extrabold ${totalIncome - totalAllExpenses >= 0 ? 'text-green-800' : 'text-red-800'}`}>
            R$ {(totalIncome - totalAllExpenses).toFixed(2)}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {totalIncome - totalAllExpenses >= 0 ? 'Lucro' : 'Prejuízo'} no mês de {currentMonth}.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceManager;
