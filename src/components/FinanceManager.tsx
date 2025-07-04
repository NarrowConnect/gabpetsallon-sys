
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, TrendingUp, TrendingDown, Receipt, CreditCard, Settings } from "lucide-react";

const FinanceManager = () => {
  const [expenses, setExpenses] = useState({
    aluguel: 1200.00,
    copel: 150.00,
    sanepar: 80.00,
    internet: 99.90,
    segurancaMensalidade: 120.00,
    mei: 67.00,
    celularMes: 89.90,
    lavanderia: 200.00,
    gasolina: 300.00,
    tarifaBancaria: 25.00,
    cartaoSantander: 450.00,
    cartaoBB: 200.00,
    cartaoNU: 150.00,
    cartaoGab: 300.00,
    boletoBiocom: 180.00,
    boletoEuroshop: 95.00
  });

  const [income, setIncome] = useState({
    banhosPortePequeno: 15,
    banhosPorteGrande: 12,
    tosas: 8,
    hospedagens: 5,
    roupas: 3,
    taxiDog: 4
  });

  const [serviceValues, setServiceValues] = useState({
    banhosPortePequeno: 35.00,
    banhosPorteGrande: 50.00,
    tosas: 80.00,
    hospedagens: 45.00,
    roupas: 25.00,
    taxiDog: 30.00
  });

  const [showPriceConfig, setShowPriceConfig] = useState(false);

  const totalExpenses = Object.values(expenses).reduce((sum, value) => sum + value, 0);
  const totalIncome = Object.entries(income).reduce((sum, [key, quantity]) => {
    const value = serviceValues[key as keyof typeof serviceValues];
    return sum + (quantity * value);
  }, 0);

  const netBalance = totalIncome - totalExpenses;

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
    segurancaMensalidade: 'Segurança',
    mei: 'MEI',
    celularMes: 'Celular',
    lavanderia: 'Lavanderia',
    gasolina: 'Gasolina',
    tarifaBancaria: 'Tarifa Bancária',
    cartaoSantander: 'Cartão Santander',
    cartaoBB: 'Cartão Banco do Brasil',
    cartaoNU: 'Cartão Nubank',
    cartaoGab: 'Cartão Gab',
    boletoBiocom: 'Boleto Biocom',
    boletoEuroshop: 'Boleto Euroshop'
  };

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
            <p className="text-xs opacity-75">Total de serviços prestados</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Despesas do Mês</CardTitle>
            <TrendingDown className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <p className="text-xs opacity-75">Total de gastos fixos</p>
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
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/50 backdrop-blur-sm">
          <TabsTrigger value="income" className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            Receitas
          </TabsTrigger>
          <TabsTrigger value="expenses" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Despesas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="income">
          <Card className="bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Receitas por Serviço</CardTitle>
                  <CardDescription>Quantidade de serviços realizados no mês</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPriceConfig(!showPriceConfig)}
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  {showPriceConfig ? 'Ocultar Preços' : 'Configurar Preços'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {showPriceConfig && (
                <div className="mb-6 p-4 border rounded-lg bg-blue-50/50">
                  <h4 className="font-medium mb-3 text-blue-900">Configuração de Preços por Serviço</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(serviceValues).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2">
                        <Label className="text-sm min-w-0 flex-1">{serviceNames[key as keyof typeof serviceNames]}:</Label>
                        <div className="flex items-center gap-1">
                          <span className="text-sm text-muted-foreground">R$</span>
                          <Input
                            type="number"
                            step="0.01"
                            value={value}
                            onChange={(e) => setServiceValues({
                              ...serviceValues, 
                              [key]: parseFloat(e.target.value) || 0
                            })}
                            className="w-20 text-right"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    💡 Dica: Ajuste os preços conforme serviços adicionais (ex: banho + hidratação, tosa + unha, etc.)
                  </p>
                </div>
              )}
              
              <div className="space-y-4">
                {Object.entries(income).map(([key, quantity]) => {
                  const serviceName = serviceNames[key as keyof typeof serviceNames];
                  const unitValue = serviceValues[key as keyof typeof serviceValues];
                  const totalValue = quantity * unitValue;

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
                          onChange={(e) => setIncome({...income, [key]: parseInt(e.target.value) || 0})}
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
                    <span className="font-bold text-lg">Total de Receitas</span>
                    <span className="font-bold text-lg text-green-600">
                      R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses">
          <Card className="bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Contas a Pagar</CardTitle>
              <CardDescription>Despesas fixas mensais</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(expenses).map(([key, value]) => {
                  const expenseName = expenseNames[key as keyof typeof expenseNames];

                  return (
                    <div key={key} className="flex items-center justify-between p-4 border rounded-lg bg-white/50 hover:bg-white/80 transition-colors">
                      <span className="font-medium">{expenseName}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">R$</span>
                        <Input
                          type="number"
                          step="0.01"
                          value={value}
                          onChange={(e) => setExpenses({...expenses, [key]: parseFloat(e.target.value) || 0})}
                          className="w-24 text-right"
                        />
                      </div>
                    </div>
                  );
                })}
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                    <span className="font-bold text-lg">Total de Despesas</span>
                    <span className="font-bold text-lg text-red-600">
                      R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinanceManager;
