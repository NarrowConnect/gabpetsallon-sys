
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Users, Heart, DollarSign } from 'lucide-react';
import { useTutors } from '@/hooks/useTutors';
import { usePets } from '@/hooks/usePets';
import { useAgendamentos } from '@/hooks/useAgendamentos';

const Dashboard = () => {
  const { tutors, loading: tutorsLoading } = useTutors();
  const { pets, loading: petsLoading } = usePets();
  const { agendamentos, loading: agendamentosLoading } = useAgendamentos();

  const totalTutors = tutors?.length || 0;
  const totalPets = pets?.length || 0;
  const totalAgendamentos = agendamentos?.length || 0;
  const agendamentosHoje = agendamentos?.filter(a => {
    const hoje = new Date().toDateString();
    const dataAgendamento = new Date(a.data_servico).toDateString();
    return dataAgendamento === hoje;
  }).length || 0;

  // Dados mensais baseados nos agendamentos reais
  const monthlyData = React.useMemo(() => {
    if (!agendamentos || agendamentos.length === 0) return [];
    
    const monthCounts: { [key: string]: number } = {};
    
    agendamentos.forEach(agendamento => {
      const date = new Date(agendamento.data_servico);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;
    });

    return Object.entries(monthCounts)
      .map(([monthKey, count]) => {
        const [year, month] = monthKey.split('-');
        const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('pt-BR', { month: 'short' });
        return {
          name: monthName,
          agendamentos: count,
          receita: count * 50 // Estimativa de R$ 50 por serviço
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(-6); // Últimos 6 meses
  }, [agendamentos]);

  // Dados de serviços baseados nos agendamentos reais
  const serviceData = React.useMemo(() => {
    if (!agendamentos || agendamentos.length === 0) return [];
    
    const serviceCounts: { [key: string]: number } = {};
    
    agendamentos.forEach(agendamento => {
      serviceCounts[agendamento.servico] = (serviceCounts[agendamento.servico] || 0) + 1;
    });

    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];
    
    return Object.entries(serviceCounts)
      .map(([servico, count], index) => ({
        name: servico,
        value: count,
        color: colors[index % colors.length]
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5 serviços
  }, [agendamentos]);

  if (tutorsLoading || petsLoading || agendamentosLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg font-poppins">Carregando dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-poppins">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-poppins">Total Tutores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-poppins">{totalTutors}</div>
            <p className="text-xs text-muted-foreground font-poppins">Tutores cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-poppins">Total Pets</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-poppins">{totalPets}</div>
            <p className="text-xs text-muted-foreground font-poppins">Pets cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-poppins">Agendamentos Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-poppins">{agendamentosHoje}</div>
            <p className="text-xs text-muted-foreground font-poppins">Para hoje</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-poppins">Total Agendamentos</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-poppins">{totalAgendamentos}</div>
            <p className="text-xs text-muted-foreground font-poppins">Total geral</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-poppins">Agendamentos por Mês</CardTitle>
            <CardDescription className="font-poppins">Evolução mensal dos agendamentos</CardDescription>
          </CardHeader>
          <CardContent>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [value, name === 'agendamentos' ? 'Agendamentos' : 'Receita (R$)']} />
                  <Legend />
                  <Bar dataKey="agendamentos" fill="#8884d8" name="Agendamentos" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500 font-poppins">
                Nenhum agendamento encontrado
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-poppins">Serviços Mais Populares</CardTitle>
            <CardDescription className="font-poppins">Distribuição dos tipos de serviço</CardDescription>
          </CardHeader>
          <CardContent>
            {serviceData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={serviceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {serviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500 font-poppins">
                Nenhum serviço encontrado
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
