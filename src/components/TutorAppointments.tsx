
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, PawPrint, User, Phone, MessageSquare } from "lucide-react";
import { useAgendamentosTutores } from '@/hooks/useAgendamentosTutores';

interface TutorAppointmentsProps {
  tutorData?: { 
    id: string; 
    nome: string; 
    celular: string; 
  };
}

const TutorAppointments = ({ tutorData }: TutorAppointmentsProps) => {
  const { agendamentosTutores, loading, error, updateAgendamentoTutor } = useAgendamentosTutores();

  // Filter appointments for specific tutor if tutorData is provided
  const filteredAgendamentos = tutorData 
    ? agendamentosTutores.filter(agendamento => 
        agendamento.tutor_nome === tutorData.nome || 
        agendamento.tutor_telefone === tutorData.celular
      )
    : agendamentosTutores;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Solicitado':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Confirmado':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Em andamento':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Concluído':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Cancelado':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await updateAgendamentoTutor(id, { 
        status: newStatus,
        data_resposta: new Date().toISOString()
      });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg font-poppins">Carregando agendamentos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg font-poppins text-red-600">Erro: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-poppins">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-brand-cyan">
          {tutorData ? `Agendamentos de ${tutorData.nome}` : 'Solicitações de Agendamento'}
        </h2>
        <Badge variant="outline" className="text-lg px-3 py-1">
          {filteredAgendamentos.length} agendamentos
        </Badge>
      </div>

      {filteredAgendamentos.length === 0 ? (
        <Card className="text-center py-8">
          <CardContent>
            <PawPrint className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-poppins">
              {tutorData ? 'Nenhum agendamento encontrado para este tutor.' : 'Nenhuma solicitação de agendamento encontrada.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredAgendamentos.map((agendamento) => (
            <Card key={agendamento.id} className="border-l-4 border-l-brand-cyan">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2 text-lg font-poppins">
                      <User className="h-4 w-4 text-brand-cyan" />
                      {agendamento.tutor_nome}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 font-poppins">
                      <Phone className="h-3 w-3" />
                      {agendamento.tutor_telefone}
                    </CardDescription>
                  </div>
                  <Badge className={`${getStatusColor(agendamento.status || 'Solicitado')} font-poppins`}>
                    {agendamento.status || 'Solicitado'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <PawPrint className="h-4 w-4 text-brand-orange" />
                      <span className="font-medium font-poppins">Pet:</span>
                      <span className="font-poppins">{agendamento.pet_nome}</span>
                    </div>
                    {agendamento.pet_raca && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium font-poppins">Raça:</span>
                        <span className="font-poppins">{agendamento.pet_raca}</span>
                      </div>
                    )}
                    {agendamento.pet_porte && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium font-poppins">Porte:</span>
                        <span className="font-poppins">{agendamento.pet_porte}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-brand-cyan" />
                      <span className="font-medium font-poppins">Data:</span>
                      <span className="font-poppins">{new Date(agendamento.data_servico).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-brand-cyan" />
                      <span className="font-medium font-poppins">Horário:</span>
                      <span className="font-poppins">{agendamento.hora_servico}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium font-poppins">Serviço:</span>
                      <span className="font-poppins">{agendamento.servico}</span>
                    </div>
                  </div>
                </div>

                {agendamento.observacoes && (
                  <div className="flex items-start gap-2 text-sm bg-gray-50 p-3 rounded-lg">
                    <MessageSquare className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div>
                      <span className="font-medium font-poppins">Observações:</span>
                      <p className="font-poppins text-gray-700 mt-1">{agendamento.observacoes}</p>
                    </div>
                  </div>
                )}

                {!tutorData && agendamento.status === 'Solicitado' && (
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      onClick={() => handleStatusUpdate(agendamento.id, 'Confirmado')}
                      className="bg-green-600 hover:bg-green-700 font-poppins"
                    >
                      Confirmar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusUpdate(agendamento.id, 'Cancelado')}
                      className="border-red-300 text-red-600 hover:bg-red-50 font-poppins"
                    >
                      Cancelar
                    </Button>
                  </div>
                )}

                <div className="text-xs text-gray-500 font-poppins">
                  Solicitado em: {new Date(agendamento.created_at || '').toLocaleString('pt-BR')}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TutorAppointments;
