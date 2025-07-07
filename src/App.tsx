
import React, { useState } from 'react';
import Dashboard from '@/components/Dashboard';
import TutorsManager from '@/components/TutorsManager';
import PetsManager from '@/components/PetsManager';
import ScheduleManager from '@/components/ScheduleManager';
import TutorAppointments from '@/components/TutorAppointments';
import FinanceManager from '@/components/FinanceManager';
import FinancialReports from '@/components/FinancialReports';
import CalendarView from '@/components/CalendarView';
import TutorScheduling from '@/components/TutorScheduling';
import { Toaster } from 'sonner';
import { BarChart3, Users, Heart, Calendar, Clock, DollarSign, FileText, CalendarDays, Webhook, Code, UserPlus, Menu, X } from 'lucide-react';
import WebhookManager from '@/components/WebhookManager';
import ApiTester from '@/components/ApiTester';
import { useSupabase } from '@/hooks/useSupabase';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { tutores, agendamentos } = useSupabase();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'tutors', label: 'Tutores', icon: Users },
    { id: 'pets', label: 'Pets', icon: Heart },
    { id: 'schedule', label: 'Agendamentos', icon: Calendar },
    { id: 'appointments', label: 'Solicitações', icon: Clock },
    { id: 'finance', label: 'Financeiro', icon: DollarSign },
    { id: 'reports', label: 'Relatórios', icon: FileText },
    { id: 'calendar', label: 'Calendário', icon: CalendarDays },
    { id: 'webhooks', label: 'Webhooks', icon: Webhook },
    { id: 'api-tester', label: 'API Tester', icon: Code },
    { id: 'tutor-scheduling', label: 'Agendamento Público', icon: UserPlus },
  ];

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'tutors':
        return <TutorsManager />;
      case 'pets':
        return <PetsManager />;
      case 'schedule':
        return <ScheduleManager />;
      case 'appointments':
        return <TutorAppointments tutorData={tutores} />;
      case 'finance':
        return <FinanceManager />;
      case 'reports':
        return <FinancialReports reportData={[]} onGenerateReport={() => {}} />;
      case 'calendar':
        return <CalendarView appointments={agendamentos} />;
      case 'webhooks':
        return <WebhookManager />;
      case 'api-tester':
        return <ApiTester />;
      case 'tutor-scheduling':
        return <TutorScheduling tutorData={tutores} onLogout={() => setCurrentView('dashboard')} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="ml-3 text-xl font-semibold text-gray-900">
              PetCare Admin
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">A</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none"
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <img
                  className="h-8 w-auto"
                  src="/lovable-uploads/Logo Negativa.png"
                  alt="PetCare"
                />
                <span className="ml-2 text-xl font-bold text-gray-900">PetCare</span>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`${
                      currentView === item.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } group flex items-center px-2 py-2 text-base font-medium rounded-md w-full transition-colors`}
                  >
                    <item.icon
                      className={`${
                        currentView === item.id
                          ? 'text-blue-500'
                          : 'text-gray-400 group-hover:text-gray-500'
                      } mr-4 flex-shrink-0 h-6 w-6`}
                    />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:flex-shrink-0">
          <div className="flex flex-col w-64">
            <div className="flex flex-col h-0 flex-1 bg-white border-r border-gray-200">
              <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                <div className="flex items-center flex-shrink-0 px-4">
                  <img
                    className="h-8 w-auto"
                    src="/lovable-uploads/Logo Negativa.png"
                    alt="PetCare"
                  />
                  <span className="ml-2 text-xl font-bold text-gray-900">PetCare</span>
                </div>
                <nav className="mt-8 flex-1 px-2 space-y-1">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setCurrentView(item.id)}
                      className={`${
                        currentView === item.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full transition-colors`}
                    >
                      <item.icon
                        className={`${
                          currentView === item.id
                            ? 'text-blue-500'
                            : 'text-gray-400 group-hover:text-gray-500'
                        } mr-3 flex-shrink-0 h-6 w-6`}
                      />
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>
              <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">A</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700">Admin</p>
                    <p className="text-xs text-gray-500">admin@petcare.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col w-0 flex-1 overflow-hidden">
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            {renderContent()}
          </main>
        </div>
      </div>
      
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;
