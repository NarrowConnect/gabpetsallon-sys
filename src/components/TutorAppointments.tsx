import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Check, X, Clock, Search } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAgendamentosTutores } from '@/hooks/useAgendamentosTutores';
import { useAgendamentos } from '@/hooks/useAgendamentos';
import type { AgendamentoTutorDB } from '@/hooks/useAgendamentosTutores';

const TutorAppointments = () => {
  const { agendamentosTutores, loading, updateAgendamentoTutor, deleteAgendamentoTutor } = useAgendamentosTutores();
  const { addAgendamento } = useAgendamentos();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAgendamento, setSelectedAgendamento] = useState<AgendamentoTutorDB | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [observacoesAdmin, setObservacoesAdmin] = useState('');

  const filteredAgendamentos = agendamentosTutores?.filter(agendamento => {
    const matchesSearch = agendamento.tutor_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agendamento.pet_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agendamento.servico.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || agendamento.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const handleAprovar = async (agendamento: AgendamentoTutorDB) => {
    try {
      // Atualizar status para Aprovado
      await updateAgendamentoTutor(agendamento.id, {
        status: 'Aprovado',
        data_resposta: new Date().toISOString(),
        observacoes_admin: observacoesAdmin
      });

      // Criar agendamento oficial na tabela agendamentos
      await addAgendamento({
        tutor_nome: agendamento.tutor_nome,
        tutor_telefone: agendamento.tutor_telefone,
        pet_nome: agendamento.pet_nome,
        pet_raca: agendamento.pet_raca || '',
        pet_porte: agendamento.pet_porte || '',
        data_servico: agendamento.data_servico,
        hora_servico: agendamento.hora_servico,
        servico: agendamento.servico,
        status: 'Confirmado',
        observacoes: `Solicitação aprovada. ${agendamento.observacoes || ''}`,
        origem: 'tutor'
      });

      toast.success('Agendamento aprovado e criado com sucesso!');
      setIsDialogOpen(false);
      setObservacoesAdmin('');
    } catch (error) {
      toast.error('Erro ao aprovar agendamento');
      console.error('Erro:', error);
    }
  };

  const handleRejeitar = async (agendamento: AgendamentoTutorDB) => {
    try {
      await updateAgendamentoTutor(agendamento.id, {
        status: 'Rejeitado',
        data_resposta: new Date().toISOString(),
        observacoes_admin: observacoesAdmin
      });

      toast.success('Agendamento rejeitado');
      setIsDialogOpen(false);
      setObservacoesAdmin('');
    } catch (error) {
      toast.error('Erro ao rejeitar agendamento');
      console.error('Erro:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Solicitado': return 'bg-blue-100 text-blue-800';
      case 'Aprovado': return 'bg-green-100 text-green-800';
      case 'Rejeitado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg font-poppins">Carregando solicitações...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-poppins">
      <div>
        <h2 className="text-2xl font-bold font-poppins">Solicitações de Agendamento</h2>
        <p className="text-gray-600 font-poppins">Gerencie as solicitações enviadas pelos tutores</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por tutor, pet ou serviço..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 font-poppins"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48 font-poppins">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="font-poppins">Todos os status</SelectItem>
            <SelectItem value="Solicitado" className="font-poppins">Solicitado</SelectItem>
            <SelectItem value="Aprovado" className="font-poppins">Aprovado</SelectItem>
            <SelectItem value="Rejeitado" className="font-poppins">Rejeitado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredAgendamentos.map((solicitacao) => (
          <Card key={solicitacao.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold font-poppins">{solicitacao.tutor_nome}</h3>
                    <Badge className={`${getStatusColor(solicitacao.status || 'Solicitado')} font-poppins`}>
                      {solicitacao.status || 'Solicitado'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-600">
                    <div className="font-poppins">
                      <strong>Pet:</strong> {solicitacao.pet_nome}
                    </div>
                    <div className="font-poppins">
                      <strong>Data:</strong> {format(new Date(solicitacao.data_servico), 'dd/MM/yyyy', { locale: ptBR })}
                    </div>
                    <div className="font-poppins">
                      <strong>Hora:</strong> {solicitacao.hora_servico}
                    </div>
                    <div className="font-poppins">
                      <strong>Serviço:</strong> {solicitacao.servico}
                    </div>
                    <div className="font-poppins">
                      <strong>Telefone:</strong> {solicitacao.tutor_telefone}
                    </div>
                    <div className="font-poppins">
                      <strong>Solicitado em:</strong> {format(new Date(solicitacao.created_at || ''), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </div>
                  </div>
                  {solicitacao.observacoes && (
                    <div className="text-sm text-gray-600 font-poppins">
                      <strong>Observações:</strong> {solicitacao.observacoes}
                    </div>
                  )}
                  {solicitacao.observacoes_admin && (
                    <div className="text-sm text-gray-600 font-poppins">
                      <strong>Resposta Admin:</strong> {solicitacao.observacoes_admin}
                    </div>
                  )}
                </div>
                {solicitacao.status === 'Solicitado' && (
                  <div className="flex gap-2 ml-4">
                    <Dialog open={isDialogOpen && selectedAgendamento?.id === solicitacao.id} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => setSelectedAgendamento(solicitacao)}
                          className="font-poppins"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Aprovar
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="font-poppins">Aprovar Agendamento</DialogTitle>
                          <DialogDescription className="font-poppins">
                            Confirme a aprovação deste agendamento
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="observacoes_admin" className="font-poppins">Observações (opcional)</Label>
                            <Textarea
                              id="observacoes_admin"
                              value={observacoesAdmin}
                              onChange={(e) => setObservacoesAdmin(e.target.value)}
                              placeholder="Adicione observações sobre a aprovação..."
                              className="font-poppins"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              onClick={() => handleAprovar(solicitacao)} 
                              className="flex-1 font-poppins"
                            >
                              Confirmar Aprovação
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => setIsDialogOpen(false)}
                              className="font-poppins"
                            >
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setSelectedAgendamento(solicitacao)}
                          className="font-poppins"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Rejeitar
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="font-poppins">Rejeitar Agendamento</DialogTitle>
                          <DialogDescription className="font-poppins">
                            Informe o motivo da rejeição
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="motivo_rejeicao" className="font-poppins">Motivo da Rejeição *</Label>
                            <Textarea
                              id="motivo_rejeicao"
                              value={observacoesAdmin}
                              onChange={(e) => setObservacoesAdmin(e.target.value)}
                              placeholder="Explique o motivo da rejeição..."
                              className="font-poppins"
                              required
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="destructive" 
                              onClick={() => handleRejeitar(solicitacao)} 
                              className="flex-1 font-poppins"
                              disabled={!observacoesAdmin.trim()}
                            >
                              Confirmar Rejeição
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => setObservacoesAdmin('')}
                              className="font-poppins"
                            >
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAgendamentos.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 font-poppins">Nenhuma solicitação encontrada</h3>
            <p className="text-gray-500 font-poppins">Não há solicitações de agendamento no momento.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TutorAppointments;
