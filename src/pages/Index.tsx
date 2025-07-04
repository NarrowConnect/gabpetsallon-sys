
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle, Calendar, DollarSign, Users, Heart, Scissors, Home, Car } from "lucide-react";
import Dashboard from "@/components/Dashboard";
import TutorsManager from "@/components/TutorsManager";
import PetsManager from "@/components/PetsManager";
import ScheduleManager from "@/components/ScheduleManager";
import FinanceManager from "@/components/FinanceManager";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="container mx-auto p-6">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            🐾 GabPetSallon
          </h1>
          <p className="text-gray-600">Sistema para controle da empresa</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8 bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="tutors" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Tutores
            </TabsTrigger>
            <TabsTrigger value="pets" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Pets
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Agendamentos
            </TabsTrigger>
            <TabsTrigger value="finance" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Financeiro
            </TabsTrigger>
          </TabsList>

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
      </div>
    </div>
  );
};

export default Index;
