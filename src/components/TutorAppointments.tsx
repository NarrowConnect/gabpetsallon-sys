
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Clock, Edit, Trash2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TutorAppointmentsProps {
  tutorData: { id: string; nome: string; celular: string };
}

interface Appointment {
  id: string;
  pet_nome: string;
  pet_raca: string;
  pet_porte: string;
  data_servico: string;
  hora_servico: string;
  servico: string;
  observacoes: string;
  status: string;
  created_at: string;
}

const TutorAppointments = ({ tutorData }: TutorAppointmentsProps) => {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('agendamentos_tutores')
        .select('*')
        .eq('tutor_nome', tutorData.nome)
        .eq('tutor_telefone', tutorData.celular)
        .order('data_servico', { ascending: true });

      if (error) {
        console.error('Erro ao buscar agendamentos:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar seus agendamentos.",
          variant: "destructive"
        });
        return;
      }

      setAppointments(data || []);
    } catch (error) {
      console.error('Erro:', error);
      toast({
        title: "Erro",
        description: "Erro interno do servidor.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [tutorData]);

  const canEditAppointment = (appointment: Appointment) => {
    const appointmentDateTime = new Date(`${appointment.data_servico}T${appointment.hora_servico}`);
    const now = new Date();
    const hoursDifference = (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursDifference > 12 && appointment.status !== 'Cancelado';
  };

  const handleEditAppointment = async (updatedData: Partial<Appointment>) => {
    if (!editingAppointment) return;

    try {
      const { error } = await supabase
        .from('agendamentos_tutores')
        .update(updatedData)
        .eq('id', editingAppointment.id);

      if (error) {
        console.error('Erro ao atualizar agendamento:', error);
        toast({
          title: "Erro",
          description: "Não foi possível atualizar o agendamento.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Agendamento atualizado!",
        description: "Suas alterações foram salvas com sucesso.",
      });

      setIsDialogOpen(false);
      setEditingAppointment(null);
      fetchAppointments();
    } catch (error) {
      console.error('Erro:', error);
      toast({
        title: "Erro",
        description: "Erro interno do servidor.",
        variant: "destructive"
      });
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      const { error } = await supabase
        .from('agendamentos_tutores')
        .update({ status: 'Cancelado' })
        .eq('id', appointmentId);

      if (error) {
        console.error('Erro ao cancelar agendamento:', error);
        toast({
          title: "Erro",
          description: "Não foi possível cancelar o agendamento.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Agendamento cancelado",
        description: "O agendamento foi cancelado com sucesso.",
      });

      fetchAppointments();
    } catch (error) {
      console.error('Erro:', error);
      toast({
        title: "Erro",
        description: "Erro interno do servidor.",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmado':
        return 'bg-green-100 text-green-800';
      case 'Solicitado':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelado':
        return 'bg-red-100 text-red-800';
      case 'Realizado':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="text-center">Carregando agendamentos...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="bg-white/90 backdrop-blur-sm border-brand-orange/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-brand-orange">
            <Calendar className="h-5 w-5" />
            Meus Agendamentos
          </CardTitle>
          <CardDescription>
            Visualize e gerencie seus agendamentos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Você ainda não possui agendamentos.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="border rounded-lg p-4 bg-white/50 hover:bg-white/80 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{appointment.pet_nome}</h3>
                      <p className="text-sm text-gray-600">{appointment.pet_raca} - {appointment.pet_porte}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-brand-cyan" />
                      <span className="text-sm">{new Date(appointment.data_servico).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-brand-cyan" />
                      <span className="text-sm">{appointment.hora_servico}</span>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <p className="font-medium text-brand-orange">{appointment.servico}</p>
                    {appointment.observacoes && (
                      <p className="text-sm text-gray-600 mt-1">{appointment.observacoes}</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {canEditAppointment(appointment) ? (
                      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setEditingAppointment(appointment);
                              setIsDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Editar Agendamento</DialogTitle>
                            <DialogDescription>
                              Faça as alterações necessárias no seu agendamento.
                            </DialogDescription>
                          </DialogHeader>
                          {editingAppointment && (
                            <EditAppointmentForm
                              appointment={editingAppointment}
                              onSave={handleEditAppointment}
                              onCancel={() => {
                                setIsDialogOpen(false);
                                setEditingAppointment(null);
                              }}
                            />
                          )}
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <AlertCircle className="h-3 w-3" />
                        {appointment.status === 'Cancelado' ? 'Cancelado' : 'Não é possível editar (menos de 12h)'}
                      </div>
                    )}
                    
                    {canEditAppointment(appointment) && (
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleCancelAppointment(appointment.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Cancelar
                      </Button>
                    )}
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

// Component for editing appointments
const EditAppointmentForm = ({ 
  appointment, 
  onSave, 
  onCancel 
}: { 
  appointment: Appointment; 
  onSave: (data: Partial<Appointment>) => void; 
  onCancel: () => void; 
}) => {
  const [formData, setFormData] = useState({
    data_servico: appointment.data_servico,
    hora_servico: appointment.hora_servico,
    servico: appointment.servico,
    observacoes: appointment.observacoes || ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="edit-data">Data do Serviço</Label>
        <Input
          id="edit-data"
          type="date"
          value={formData.data_servico}
          onChange={(e) => setFormData({ ...formData, data_servico: e.target.value })}
          min={new Date().toISOString().split('T')[0]}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="edit-hora">Horário</Label>
        <Select value={formData.hora_servico} onValueChange={(value) => setFormData({ ...formData, hora_servico: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"].map((hora) => (
              <SelectItem key={hora} value={hora}>{hora}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="edit-servico">Serviço</Label>
        <Select value={formData.servico} onValueChange={(value) => setFormData({ ...formData, servico: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["Banho", "Tosa", "Banho e Tosa", "Banho Medicamentoso", "Hospedagem", "Pet Sitter", "Taxi Dog"].map((servico) => (
              <SelectItem key={servico} value={servico}>{servico}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="edit-observacoes">Observações</Label>
        <Textarea
          id="edit-observacoes"
          value={formData.observacoes}
          onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
          rows={3}
        />
      </div>
      
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Salvar Alterações
        </Button>
      </div>
    </form>
  );
};

export default TutorAppointments;
