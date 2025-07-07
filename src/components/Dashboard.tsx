
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

  // Calcular receita e despesa do mês atual
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
      color: "text-brand-cyan",
      bgColor: "bg-brand-cyan/10"
    },
    {
      title: "Total de Pets",
      value: totalPets,
      icon: PawPrint,
      loading: petsLoading,
      color: "text-brand-orange",
      bgColor: "bg-brand-orange/10"
    },
    {
      title: "Agendamentos",
      value: totalAgendamentos,
      icon: Calendar,
      loading: agendamentosLoading,
      color: "text-brand-yellow",
      bgColor: "bg-brand-yellow/10"
    },
    {
      title: "Solicitações Pendentes",
      value: totalSolicitacoes,
      icon: Activity,
      loading: agendamentosLoading,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      title: "Receita Mês Atual",
      value: `R$ ${receitaMesAtual.toFixed(2)}`,
      icon: TrendingUp,
      loading: financasLoading,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100"
    },
    {
      title: "Saldo Mensal",
      value: `R$ ${saldoMensal.toFixed(2)}`,
      icon: DollarSign,
      loading: financasLoading,
      color: saldoMensal >= 0 ? "text-green-600" : "text-red-600",
      bgColor: saldoMensal >= 0 ? "bg-green-100" : "bg-red-100"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto p-6 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold font-pacify bg-gradient-to-r from-brand-cyan to-brand-orange bg-clip-text text-transparent mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 text-lg">Visão geral do sistema de gestão pet</p>
        </div>

        {/* Stats Grid - 4 itens por linha em telas grandes, responsivo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      {stat.title}
                    </p>
                    <div>
                      {stat.loading ? (
                        <div className="h-8 bg-gray-200 animate-pulse rounded w-20"></div>
                      ) : (
                        <p className="text-3xl font-bold text-gray-900">
                          {stat.value}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className={`p-4 rounded-full ${stat.bgColor} flex-shrink-0`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Resumo Financeiro Sincronizado */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3 font-pacify">
              <DollarSign className="h-6 w-6 text-brand-cyan" />
              Resumo Financeiro - {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </CardTitle>
            <CardDescription className="text-base">Situação financeira sincronizada com a base de dados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl border border-green-200">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {financasLoading ? (
                    <div className="h-8 bg-green-200 animate-pulse rounded w-24 mx-auto"></div>
                  ) : (
                    `R$ ${receitaMesAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                  )}
                </div>
                <p className="text-green-700 font-medium">Receitas do Mês</p>
                <p className="text-xs text-green-600 mt-1">Valores recebidos</p>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200">
                <div className="text-3xl font-bold text-red-600 mb-2">
                  {financasLoading ? (
                    <div className="h-8 bg-red-200 animate-pulse rounded w-24 mx-auto"></div>
                  ) : (
                    `R$ ${despesaMesAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                  )}
                </div>
                <p className="text-red-700 font-medium">Despesas do Mês</p>
                <p className="text-xs text-red-600 mt-1">Contas a pagar</p>
              </div>
              
              <div className={`text-center p-6 rounded-xl border ${saldoMensal >= 0 ? 'bg-gradient-to-br from-blue-50 to-cyan-100 border-blue-200' : 'bg-gradient-to-br from-red-50 to-red-100 border-red-200'}`}>
                <div className={`text-3xl font-bold mb-2 ${saldoMensal >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {financasLoading ? (
                    <div className={`h-8 animate-pulse rounded w-24 mx-auto ${saldoMensal >= 0 ? 'bg-blue-200' : 'bg-red-200'}`}></div>
                  ) : (
                    `R$ ${saldoMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                  )}
                </div>
                <p className={`font-medium ${saldoMensal >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
                  {saldoMensal >= 0 ? 'Saldo Positivo' : 'Saldo Negativo'}
                </p>
                <p className={`text-xs mt-1 ${saldoMensal >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  Receitas - Despesas
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Atividade Recente */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 font-pacify">
              <Activity className="h-5 w-5 text-brand-orange" />
              Atividade Recente
            </CardTitle>
            <CardDescription>Últimas solicitações no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {agendamentosTutores.slice(0, 5).map((agendamento, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-base">
                      {agendamento.tutor_nome} - {agendamento.pet_nome}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {agendamento.servico} • {new Date(agendamento.data_servico).toLocaleDateString('pt-BR')} às {agendamento.hora_servico}
                    </p>
                  </div>
                  <div>
                    <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                      agendamento.status === 'Solicitado' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                      agendamento.status === 'Confirmado' ? 'bg-green-100 text-green-800 border border-green-200' :
                      'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                      {agendamento.status}
                    </span>
                  </div>
                </div>
              ))}
              
              {agendamentosTutores.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Activity className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg">Nenhuma atividade recente</p>
                  <p className="text-sm">As solicitações aparecerão aqui quando forem criadas</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
