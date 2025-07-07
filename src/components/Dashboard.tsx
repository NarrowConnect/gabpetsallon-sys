
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, PawPrint, Calendar, DollarSign, TrendingUp, Activity } from "lucide-react";
import { useTutors, usePets, useAgendamentos, useFinancas } from '@/hooks/useSupabase';

export default function Dashboard() {
  const { tutors, loading: tutorsLoading } = useTutors();
  const { pets, loading: petsLoading } = usePets();
  const { agendamentos, agendamentosTutores, loading: agendamentosLoading } = useAgendamentos();
  const { valoresRecebidos, contasPagar, loading: financasLoading } = useFinancas();

  // Calcular métricas
  const totalTutores = tutors.length;
  const totalPets = pets.length;
  const totalAgendamentos = agendamentos.length;
  const totalSolicitacoes = agendamentosTutores.filter(a => a.status === 'Solicitado').length;

  // Calcular receita do mês atual
  const mesAtual = new Date().toISOString().slice(0, 7);
  const receitaMesAtual = valoresRecebidos
    .find(r => r.mes_referencia === mesAtual)?.total_entradas || 0;

  const despesaMesAtual = contasPagar
    .find(d => d.mes_referencia === mesAtual)?.total_saidas || 0;

  const saldoMensal = receitaMesAtual - despesaMesAtual;

  const stats = [
    {
      title: "Total de Tutores",
      value: totalTutores,
      icon: Users,
      loading: tutorsLoading,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Total de Pets",
      value: totalPets,
      icon: PawPrint,
      loading: petsLoading,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Agendamentos",
      value: totalAgendamentos,
      icon: Calendar,
      loading: agendamentosLoading,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Solicitações Pendentes",
      value: totalSolicitacoes,
      icon: Activity,
      loading: agendamentosLoading,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Receita Mês Atual",
      value: `R$ ${receitaMesAtual.toFixed(2)}`,
      icon: TrendingUp,
      loading: financasLoading,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    },
    {
      title: "Saldo Mensal",
      value: `R$ ${saldoMensal.toFixed(2)}`,
      icon: DollarSign,
      loading: financasLoading,
      color: saldoMensal >= 0 ? "text-green-600" : "text-red-600",
      bgColor: saldoMensal >= 0 ? "bg-green-50" : "bg-red-50"
    }
  ];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600 text-sm sm:text-base">Visão geral do sistema de gestão pet</p>
      </div>

      {/* Stats Grid - Responsivo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                    {stat.title}
                  </p>
                  <div className="mt-1">
                    {stat.loading ? (
                      <div className="h-6 sm:h-8 bg-gray-200 animate-pulse rounded w-16"></div>
                    ) : (
                      <p className="text-xl sm:text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                    )}
                  </div>
                </div>
                <div className={`p-2 sm:p-3 rounded-full ${stat.bgColor} flex-shrink-0`}>
                  <stat.icon className={`h-4 w-4 sm:h-6 sm:w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions - Mobile Friendly */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Gestão de Tutores
            </CardTitle>
            <CardDescription className="text-sm">
              Cadastre e gerencie informações dos tutores
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {tutorsLoading ? '...' : totalTutores}
            </div>
            <p className="text-sm text-gray-600">tutores cadastrados</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <PawPrint className="h-5 w-5 text-green-600" />
              Gestão de Pets
            </CardTitle>
            <CardDescription className="text-sm">
              Cadastre pets e suas informações de saúde
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {petsLoading ? '...' : totalPets}
            </div>
            <p className="text-sm text-gray-600">pets cadastrados</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              Agendamentos
            </CardTitle>
            <CardDescription className="text-sm">
              Gerencie agendamentos e solicitações
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex justify-between items-end">
              <div>
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {agendamentosLoading ? '...' : totalAgendamentos}
                </div>
                <p className="text-sm text-gray-600">agendamentos</p>
              </div>
              {totalSolicitacoes > 0 && (
                <div className="text-right">
                  <div className="text-lg font-semibold text-orange-600">
                    {totalSolicitacoes}
                  </div>
                  <p className="text-xs text-gray-500">pendentes</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Summary - Mobile Optimized */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Resumo Financeiro - {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </CardTitle>
          <CardDescription>Situação financeira do mês atual</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-lg sm:text-2xl font-bold text-green-600">
                {financasLoading ? '...' : `R$ ${receitaMesAtual.toFixed(2)}`}
              </div>
              <p className="text-sm text-gray-600">Receitas</p>
            </div>
            
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-lg sm:text-2xl font-bold text-red-600">
                {financasLoading ? '...' : `R$ ${despesaMesAtual.toFixed(2)}`}
              </div>
              <p className="text-sm text-gray-600">Despesas</p>
            </div>
            
            <div className={`text-center p-4 rounded-lg ${saldoMensal >= 0 ? 'bg-emerald-50' : 'bg-red-50'}`}>
              <div className={`text-lg sm:text-2xl font-bold ${saldoMensal >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {financasLoading ? '...' : `R$ ${saldoMensal.toFixed(2)}`}
              </div>
              <p className="text-sm text-gray-600">Saldo</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity - Mobile Friendly */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Atividade Recente</CardTitle>
          <CardDescription>Últimas ações no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {agendamentosTutores.slice(0, 5).map((agendamento, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm sm:text-base truncate">
                    {agendamento.tutor_nome} - {agendamento.pet_nome}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {agendamento.servico} • {new Date(agendamento.data_servico).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    agendamento.status === 'Solicitado' ? 'bg-yellow-100 text-yellow-800' :
                    agendamento.status === 'Confirmado' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {agendamento.status}
                  </span>
                </div>
              </div>
            ))}
            
            {agendamentosTutores.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma atividade recente</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
