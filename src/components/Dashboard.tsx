
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, DollarSign, Users, Heart, TrendingUp, Clock, Scissors, Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalTutors: 0,
    totalPets: 0,
    todayAppointments: 0,
    monthlyRevenue: 0,
    pendingPayments: 0,
    thisWeekServices: 0
  });
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch tutors count
      const { count: tutorsCount } = await supabase
        .from('tutores')
        .select('*', { count: 'exact', head: true });

      // Fetch pets count
      const { count: petsCount } = await supabase
        .from('pets')
        .select('*', { count: 'exact', head: true });

      // Fetch today's appointments
      const today = new Date().toISOString().split('T')[0];
      const { count: todayAppointmentsCount } = await supabase
        .from('agendamentos')
        .select('*', { count: 'exact', head: true })
        .eq('data_servico', today);

      // Fetch recent appointments for display
      const { data: appointments } = await supabase
        .from('agendamentos')
        .select('*')
        .order('data_servico', { ascending: true })
        .limit(5);

      // Fetch this month's financial data
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
      const { data: monthlyIncome } = await supabase
        .from('valores_recebidos')
        .select('total_entradas')
        .eq('mes_referencia', currentMonth)
        .single();

      const { data: monthlyExpenses } = await supabase
        .from('contas_a_pagar')
        .select('total_saidas')
        .eq('mes_referencia', currentMonth)
        .single();

      // Count this week's services
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekAgoString = weekAgo.toISOString().split('T')[0];
      
      const { count: weekServicesCount } = await supabase
        .from('agendamentos')
        .select('*', { count: 'exact', head: true })
        .gte('data_servico', weekAgoString)
        .eq('status', 'Realizado');

      setStats({
        totalTutors: tutorsCount || 0,
        totalPets: petsCount || 0,
        todayAppointments: todayAppointmentsCount || 0,
        monthlyRevenue: monthlyIncome?.total_entradas || 0,
        pendingPayments: monthlyExpenses?.total_saidas || 0,
        thisWeekServices: weekServicesCount || 0
      });

      setRecentAppointments(appointments?.map(apt => ({
        tutor: apt.tutor_nome,
        pet: apt.pet_nome,
        service: apt.servico,
        time: apt.hora_servico,
        status: apt.status
      })) || []);

    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-cyan mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Total de Tutores</CardTitle>
            <Users className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTutors}</div>
            <p className="text-xs opacity-75">Tutores cadastrados</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Total de Pets</CardTitle>
            <Heart className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPets}</div>
            <p className="text-xs opacity-75">Pets cadastrados</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Receita Mensal</CardTitle>
            <DollarSign className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {stats.monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <p className="text-xs opacity-75">Mês atual</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Agendamentos Hoje</CardTitle>
            <Calendar className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayAppointments}</div>
            <p className="text-xs opacity-75">Serviços programados</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Despesas Mensais</CardTitle>
            <TrendingUp className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {stats.pendingPayments.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <p className="text-xs opacity-75">Mês atual</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Serviços da Semana</CardTitle>
            <Scissors className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.thisWeekServices}</div>
            <p className="text-xs opacity-75">Serviços realizados</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Appointments */}
      <Card className="bg-white/70 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-600" />
            Próximos Agendamentos
          </CardTitle>
          <CardDescription>Serviços programados</CardDescription>
        </CardHeader>
        <CardContent>
          {recentAppointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Nenhum agendamento encontrado.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentAppointments.map((appointment, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-white/50 hover:bg-white/80 transition-colors">
                  <div className="flex flex-col">
                    <p className="font-medium">{appointment.tutor} - {appointment.pet}</p>
                    <p className="text-sm text-muted-foreground">{appointment.service}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium">{appointment.time}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      appointment.status === 'Confirmado' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'Em andamento' ? 'bg-blue-100 text-blue-800' :
                      appointment.status === 'Realizado' ? 'bg-purple-100 text-purple-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
