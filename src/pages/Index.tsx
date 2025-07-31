
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle, Calendar, DollarSign, Users, Heart, Scissors, Home, Car, LogOut, BarChart3, Webhook, Code } from "lucide-react";
import { ResponsiveContainer } from "@/components/ui/responsive-container";
import Dashboard from "@/components/Dashboard";
import TutorsManager from "@/components/TutorsManager";
import PetsManager from "@/components/PetsManager";
import ScheduleManager from "@/components/ScheduleManager";
import FinanceManager from "@/components/FinanceManager";
import LoginPage from "@/components/LoginPage";
import TutorScheduling from "@/components/TutorScheduling";
import TutorAppointments from "@/components/TutorAppointments";
import ReportsManager from "@/components/ReportsManager";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [user, setUser] = useState<{ type: 'admin' | 'tutor' | null; data?: any }>({ type: null });

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

  return (
    <div className="min-h-screen bg-background font-poppins">
      <ResponsiveContainer className="py-4 sm:py-6">
        <div className="mb-6 sm:mb-8 flex justify-between items-center">
          <div className="text-center flex-1">
            <div className="flex items-center justify-center gap-3 mb-2">
              <img 
                src="lovable-uploads/Marca_Vertical.png" 
                alt="GabPetSallon" 
                className="h-14 sm:h-15"
              />

            </div>
            <p className="text-xs sm:text-sm text-gray-600">Sistema para controle da empresa</p>
          </div>
          <Button
            onClick={handleLogout}
            style={{
              backgroundColor: "#1abc9c", // Cor padrão
              color: "#fff"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#16a085"; // hover
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#1abc9c"; // reset hover
            }}
            className="flex items-center gap-2 border transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="mb-6 sm:mb-8 overflow-x-auto">
            <TabsList className="grid w-90% snap-center min-w-max grid-cols-7 h-12 bg-white/80 backdrop-blur-sm border border-gray-200">
              <TabsTrigger value="dashboard" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 data-[state=active]:bg-brand-cyan data-[state=active]:text-white">
                <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
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
              <TabsTrigger value="requests" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 data-[state=active]:bg-brand-orange data-[state=active]:text-white">
                <PlusCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Solicitações</span>
                <span className="sm:hidden">Req</span>
              </TabsTrigger>
              <TabsTrigger value="finance" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 data-[state=active]:bg-brand-orange data-[state=active]:text-white">
                <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Financeiro</span>
                <span className="sm:hidden">$</span>
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 data-[state=active]:bg-brand-cyan data-[state=active]:text-white">
                <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Relatórios</span>
                <span className="sm:hidden">Rel</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>

          <TabsContent value="tutors">
            <TutorsManager />
          </TabsContent>

          <TabsContent value="pets">
            <PetsManager />
          </TabsContent>

          <TabsContent value="schedule">
            <ScheduleManager />
          </TabsContent>

          <TabsContent value="requests">
            <TutorAppointments />
          </TabsContent>

          <TabsContent value="finance">
            <FinanceManager />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsManager />
          </TabsContent>

        </Tabs>
      </ResponsiveContainer>
    </div>
  );
};

export default Index;
