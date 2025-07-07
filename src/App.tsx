
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer } from "@/components/ui/responsive-container";
import Dashboard from '@/components/Dashboard';
import TutorsManager from '@/components/TutorsManager';
import PetsManager from '@/components/PetsManager';
import ScheduleManager from '@/components/ScheduleManager';
import TutorAppointments from '@/components/TutorAppointments';
import FinanceManager from '@/components/FinanceManager';
import FinancialReports from '@/components/FinancialReports';
import CalendarView from '@/components/CalendarView';
import TutorScheduling from '@/components/TutorScheduling';
import LoginPage from '@/components/LoginPage';
import WebhookManager from '@/components/WebhookManager';
import ApiTester from '@/components/ApiTester';
import { Toaster } from 'sonner';
import { BarChart3, Users, Heart, Calendar, Clock, DollarSign, FileText, CalendarDays, Webhook, Code, UserPlus, LogOut } from 'lucide-react';
import { useTutors, useAgendamentos } from '@/hooks/useSupabase';

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [user, setUser] = useState<{ type: 'admin' | 'tutor' | null; data?: any }>({ type: 'admin' }); // Start as admin for now
  const { tutors } = useTutors();
  const { agendamentos } = useAgendamentos();

  // Transform agendamentos data for CalendarView component
  const transformedAppointments = agendamentos?.map(apt => ({
    id: apt.id,
    nomeTutor: apt.tutor_nome,
    nomePet: apt.pet_nome,
    dataServico: apt.data_servico,
    horaServico: apt.hora_servico,
    servicoRealizar: apt.servico,
    status: apt.status as "Agendado" | "Confirmado" | "Em andamento" | "Concluído" | "Cancelado",
    valor: apt.valor || 0
  })) || [];

  // Get first tutor for components that need tutorData
  const firstTutor = tutors && tutors.length > 0 ? {
    id: tutors[0].id,
    nome: tutors[0].nome,
    celular: tutors[0].celular
  } : { id: '', nome: '', celular: '' };

  const handleLogin = (userType: 'admin' | 'tutor', userData?: any) => {
    setUser({ type: userType, data: userData });
  };

  const handleLogout = () => {
    setUser({ type: null });
    setActiveTab("dashboard");
  };

  if (!user.type) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (user.type === 'tutor') {
    return <TutorScheduling tutorData={user.data} onLogout={handleLogout} />;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'tutors':
        return <TutorsManager />;
      case 'pets':
        return <PetsManager />;
      case 'schedule':
        return <ScheduleManager />;
      case 'appointments':
        return <TutorAppointments tutorData={firstTutor} />;
      case 'finance':
        return <FinanceManager />;
      case 'reports':
        return <FinancialReports reportData={[]} onGenerateReport={() => {}} />;
      case 'calendar':
        return <CalendarView appointments={transformedAppointments} />;
      case 'webhooks':
        return <WebhookManager />;
      case 'api-tester':
        return <ApiTester />;
      case 'tutor-scheduling':
        return <TutorScheduling tutorData={firstTutor} onLogout={() => setActiveTab('dashboard')} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background font-poppins">
      <ResponsiveContainer className="py-4 sm:py-6">
        <div className="mb-6 sm:mb-8 flex justify-between items-center">
          <div className="text-center flex-1">
            <div className="flex items-center justify-center gap-3 mb-2">
              <img 
                src="/lovable-uploads/becdcf34-2926-47cf-86b4-0d3e413832f7.png" 
                alt="GabPetSallon" 
                className="h-12 sm:h-16"
              />
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-pacify bg-gradient-to-r from-brand-cyan to-brand-orange bg-clip-text text-transparent">
                GabPetSallon
              </h1>
            </div>
            <p className="text-sm sm:text-base text-gray-600">Sistema para controle da empresa</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2 border-brand-cyan hover:bg-brand-cyan hover:text-white transition-colors">
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="mb-6 sm:mb-8 overflow-x-auto">
            <TabsList className="grid w-full min-w-max grid-cols-11 bg-white/80 backdrop-blur-sm border border-gray-200">
              <TabsTrigger value="dashboard" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 data-[state=active]:bg-brand-cyan data-[state=active]:text-white">
                <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Dashboard</span>
                <span className="sm:hidden">Dash</span>
              </TabsTrigger>
              <TabsTrigger value="tutors" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 data-[state=active]:bg-brand-orange data-[state=active]:text-white">
                <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Tutores</span>
              </TabsTrigger>
              <TabsTrigger value="pets" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 data-[state=active]:bg-brand-yellow data-[state=active]:text-gray-800">
                <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Pets</span>
              </TabsTrigger>
              <TabsTrigger value="schedule" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 data-[state=active]:bg-brand-cyan data-[state=active]:text-white">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Agendamentos</span>
                <span className="sm:hidden">Agenda</span>
              </TabsTrigger>
              <TabsTrigger value="appointments" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 data-[state=active]:bg-brand-orange data-[state=active]:text-white">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Solicitações</span>
                <span className="sm:hidden">Sol.</span>
              </TabsTrigger>
              <TabsTrigger value="finance" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 data-[state=active]:bg-brand-yellow data-[state=active]:text-gray-800">
                <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Financeiro</span>
                <span className="sm:hidden">$</span>
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 data-[state=active]:bg-brand-cyan data-[state=active]:text-white">
                <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Relatórios</span>
                <span className="sm:hidden">Rel.</span>
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 data-[state=active]:bg-brand-orange data-[state=active]:text-white">
                <CalendarDays className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Calendário</span>
                <span className="sm:hidden">Cal.</span>
              </TabsTrigger>
              <TabsTrigger value="webhooks" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 data-[state=active]:bg-brand-yellow data-[state=active]:text-gray-800">
                <Webhook className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Webhooks</span>
                <span className="sm:hidden">Web</span>
              </TabsTrigger>
              <TabsTrigger value="api-tester" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 data-[state=active]:bg-brand-cyan data-[state=active]:text-white">
                <Code className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">API Tester</span>
                <span className="sm:hidden">API</span>
              </TabsTrigger>
              <TabsTrigger value="tutor-scheduling" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 data-[state=active]:bg-brand-orange data-[state=active]:text-white">
                <UserPlus className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Agendamento Público</span>
                <span className="sm:hidden">Pub.</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="dashboard">
            {renderTabContent()}
          </TabsContent>

          <TabsContent value="tutors">
            {renderTabContent()}
          </TabsContent>

          <TabsContent value="pets">
            {renderTabContent()}
          </TabsContent>

          <TabsContent value="schedule">
            {renderTabContent()}
          </TabsContent>

          <TabsContent value="appointments">
            {renderTabContent()}
          </TabsContent>

          <TabsContent value="finance">
            {renderTabContent()}
          </TabsContent>

          <TabsContent value="reports">
            {renderTabContent()}
          </TabsContent>

          <TabsContent value="calendar">
            {renderTabContent()}
          </TabsContent>

          <TabsContent value="webhooks">
            {renderTabContent()}
          </TabsContent>

          <TabsContent value="api-tester">
            {renderTabContent()}
          </TabsContent>

          <TabsContent value="tutor-scheduling">
            {renderTabContent()}
          </TabsContent>
        </Tabs>
      </ResponsiveContainer>
      
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;
