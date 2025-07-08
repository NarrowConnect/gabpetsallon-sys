
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import Dashboard from '@/components/Dashboard';
import TutorsManager from '@/components/TutorsManager';
import PetsManager from '@/components/PetsManager';
import ScheduleManager from '@/components/ScheduleManager';
import FinanceManager from '@/components/FinanceManager';
import TutorScheduling from '@/components/TutorScheduling';
import TutorAppointments from '@/components/TutorAppointments';
import WebhookManager from '@/components/WebhookManager';
import ApiTester from '@/components/ApiTester';
import ReportsManager from '@/components/ReportsManager';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
        <div className="container mx-auto p-4">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-brand-cyan mb-2 font-poppins">
              Sistema de Gestão Pet Shop
            </h1>
            <p className="text-gray-600 font-poppins">
              Gerencie tutores, pets, agendamentos e finanças de forma integrada
            </p>
          </div>

          <Routes>
            <Route path="/agendamento" element={<TutorScheduling />} />
            <Route path="/" element={
              <Tabs defaultValue="dashboard" className="w-full">
                <TabsList className="grid w-full grid-cols-9 font-poppins">
                  <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                  <TabsTrigger value="tutors">Tutores</TabsTrigger>
                  <TabsTrigger value="pets">Pets</TabsTrigger>
                  <TabsTrigger value="schedule">Agendamentos</TabsTrigger>
                  <TabsTrigger value="requests">Solicitações</TabsTrigger>
                  <TabsTrigger value="finance">Financeiro</TabsTrigger>
                  <TabsTrigger value="reports">Relatórios</TabsTrigger>
                  <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
                  <TabsTrigger value="api">API</TabsTrigger>
                </TabsList>

                <TabsContent value="dashboard" className="space-y-4">
                  <Dashboard />
                </TabsContent>

                <TabsContent value="tutors" className="space-y-4">
                  <TutorsManager />
                </TabsContent>

                <TabsContent value="pets" className="space-y-4">
                  <PetsManager />
                </TabsContent>

                <TabsContent value="schedule" className="space-y-4">
                  <ScheduleManager />
                </TabsContent>

                <TabsContent value="requests" className="space-y-4">
                  <TutorAppointments />
                </TabsContent>

                <TabsContent value="finance" className="space-y-4">
                  <FinanceManager />
                </TabsContent>

                <TabsContent value="reports" className="space-y-4">
                  <ReportsManager />
                </TabsContent>

                <TabsContent value="webhooks" className="space-y-4">
                  <WebhookManager />
                </TabsContent>

                <TabsContent value="api" className="space-y-4">
                  <ApiTester />
                </TabsContent>
              </Tabs>
            } />
          </Routes>
        </div>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
