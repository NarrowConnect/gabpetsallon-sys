
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, DollarSign, Users, Heart, TrendingUp, Clock, Scissors, Home } from "lucide-react";

const Dashboard = () => {
  const stats = {
    totalTutors: 45,
    totalPets: 68,
    todayAppointments: 8,
    monthlyRevenue: 12450.00,
    pendingPayments: 2340.00,
    thisWeekServices: 32
  };

  const recentAppointments = [
    { tutor: "Maria Silva", pet: "Rex", service: "Banho e Tosa", time: "09:00", status: "Confirmado" },
    { tutor: "João Santos", pet: "Luna", service: "Hospedagem", time: "10:30", status: "Em andamento" },
    { tutor: "Ana Costa", pet: "Bela", service: "Banho", time: "14:00", status: "Agendado" },
  ];

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
            <p className="text-xs opacity-75">+12% em relação ao mês passado</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Total de Pets</CardTitle>
            <Heart className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPets}</div>
            <p className="text-xs opacity-75">+8% em relação ao mês passado</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Receita Mensal</CardTitle>
            <DollarSign className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {stats.monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <p className="text-xs opacity-75">+15% em relação ao mês passado</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Agendamentos Hoje</CardTitle>
            <Calendar className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayAppointments}</div>
            <p className="text-xs opacity-75">4 concluídos, 4 pendentes</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Contas Pendentes</CardTitle>
            <TrendingUp className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {stats.pendingPayments.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <p className="text-xs opacity-75">Vencimento próximo</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Serviços da Semana</CardTitle>
            <Scissors className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.thisWeekServices}</div>
            <p className="text-xs opacity-75">18 banhos, 14 tosas</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Appointments */}
      <Card className="bg-white/70 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-600" />
            Agendamentos de Hoje
          </CardTitle>
          <CardDescription>Próximos serviços agendados</CardDescription>
        </CardHeader>
        <CardContent>
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
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
