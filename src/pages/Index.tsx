
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle, Calendar, DollarSign, Users, Heart, Scissors, Home, Car } from "lucide-react";
import { ResponsiveContainer } from "@/components/ui/responsive-container";
import Dashboard from "@/components/Dashboard";
import TutorsManager from "@/components/TutorsManager";
import PetsManager from "@/components/PetsManager";
import ScheduleManager from "@/components/ScheduleManager";
import FinanceManager from "@/components/FinanceManager";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <ResponsiveContainer className="py-4 sm:py-6">
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            🐾 GabPetSallon
          </h1>
          <p className="text-sm sm:text-base text-gray-600">Sistema para controle da empresa</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="mb-6 sm:mb-8 overflow-x-auto">
            <TabsList className="grid w-full min-w-max grid-cols-5 bg-white/50 backdrop-blur-sm">
              <TabsTrigger value="dashboard" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4">
                <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Dashboard</span>
                <span className="sm:hidden">Dash</span>
              </TabsTrigger>
              <TabsTrigger value="tutors" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4">
                <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Tutores</span>
              </TabsTrigger>
              <TabsTrigger value="pets" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4">
                <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Pets</span>
              </TabsTrigger>
              <TabsTrigger value="schedule" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Agendamentos</span>
                <span className="sm:hidden">Agenda</span>
              </TabsTrigger>
              <TabsTrigger value="finance" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4">
                <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Financeiro</span>
                <span className="sm:hidden">$</span>
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

          <TabsContent value="finance">
            <FinanceManager />
          </TabsContent>
        </Tabs>
      </ResponsiveContainer>
    </div>
  );
};

export default Index;
