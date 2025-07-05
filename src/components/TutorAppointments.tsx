
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, PawPrint, Edit, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Appointment {
  id: string;
  nomeTutor: string;
  nomePet: string;
  racaPet: string;
  portePet: string;
  dataServico: string;
  horaServico: string;
  servicoRealizar: string;
  observacoes: string;
  status: "Agendado" | "Confirmado" | "Em andamento" | "Concluído" | "Cancelado";
  valor?: number;
}

interface TutorAppointmentsProps {
  tutorData: { nome: string; telefone: string };
}

const TutorAppointments = ({ tutorData }: TutorAppointmentsProps) => {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const [editFormData, setEditFormData] = useState({
    nomePet: "",
    racaPet: "",
    portePet: "",
    dataServico: "",
    horaServico: "",
    servicoRealizar: "",
    observacoes: ""
  });

  const racas = [
    "SRD", "Akita-Inu", "American Bully", "Border Collie", "Bull Terrier", 
    "Bulldog Francês", "Bulldog Inglês", "Cane Corso", "Chow Chow", 
    "Chihuahua", "Dogo Alemão", "Dogo Argentino", "Fila Brasileiro", 
    "Golden Retriever", "Husky Siberiano", "Kangal", "Pastor Alemão", 
    "Pastor Belga", "Pastor de Malinoa", "Pastor Malemano", "Pincher", 
    "Pit Bull", "Pit Monster", "Presa Canário", "Rottweiler Americano", 
    "Rottweiler Inglês", "Samoieda", "São Bernardo", "Schnauzer", 
    "Scottish Terrier", "Shiba-Inu"
  ].sort();

  const servicos = [
    "Banho", "Tosa", "Banho e Tosa", "Banho Medicamentoso", 
    "Hospedagem", "Pet Sitter", "Taxi Dog"
  ];

  const statusColors = {
    "Agendado": "bg-yellow-100 text-yellow-800",
    "Confirmado": "bg-green-100 text-green-800",
    "Em andamento": "bg-blue-100 text-blue-800",
    "Concluído": "bg-gray-100 text-gray-800",
    "Cancelado": "bg-red-100 text-red-800"
  };

  // Simulação de dados - aqui você conectaria com o Supabase
  useEffect(() => {
    // Buscar agendamentos do tutor no Supabase
    const mockAppointments: Appointment[] = [
      {
        id: "1",
        nomeTutor: tutorData.nome,
        nomePet: "Rex",
        racaPet: "Pastor Alemão",
        portePet: "Grande",
        dataServico: "2024-07-08",
        horaServico: "10:00",
        servicoRealizar: "Banho e Tosa",
        observacoes: "Cão muito dócil",
        status: "Confirmado"
      },
      {
        id: "2",
        nomeTutor: tutorData.nome,
        nomePet: "Luna",
        racaPet: "Golden Retriever",
        portePet: "Grande",
        dataServico: "2024-07-15",
        horaServico: "14:00",
        servicoRealizar: "Banho",
        observacoes: "",
        status: "Agendado"
      }
    ];
    setAppointments(mockAppointments);
  }, [tutorData.nome]);

  const canEditAppointment = (appointment: Appointment) => {
    const appointmentDateTime = new Date(`${appointment.dataServico}T${appointment.horaServico}`);
    const now = new Date();
    const timeDifference = appointmentDateTime.getTime() - now.getTime();
    const hoursDifference = timeDifference / (1000 * 3600);
    
    return hoursDifference > 12 && (appointment.status === "Agendado" || appointment.status === "Confirmado");
  };

  const handleEditClick = (appointment: Appointment) => {
    if (!canEditAppointment(appointment)) {
      toast({
        title: "Não é possível editar",
        description: "Agendamentos só podem ser editados com mais de 12 horas de antecedência.",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedAppointment(appointment);
    setEditFormData({
      nomePet: appointment.nomePet,
      racaPet: appointment.racaPet,
      portePet: appointment.portePet,
      dataServico: appointment.dataServico,
      horaServico: appointment.horaServico,
      servicoRealizar: appointment.servicoRealizar,
      observacoes: appointment.observacoes
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!selectedAppointment) return;

    const updatedAppointments = appointments.map(apt => 
      apt.id === selectedAppointment.id 
        ? { ...apt, ...editFormData }
        : apt
    );
    
    setAppointments(updatedAppointments);
    setIsEditDialogOpen(false);
    setSelectedAppointment(null);
    
    toast({
      title: "Agendamento atualizado!",
      description: "Suas alterações foram salvas com sucesso.",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/90 backdrop-blur-sm border-brand-cyan/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-brand-cyan">
            <Calendar className="h-5 w-5" />
            Meus Agendamentos
          </CardTitle>
          <CardDescription>
            Visualize e edite seus agendamentos (até 12h antes do horário)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                <div key={appointment.id} className="p-4 border rounded-lg bg-white shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <PawPrint className="h-4 w-4 text-brand-orange" />
                        <span className="font-medium">{appointment.nomePet}</span>
                        <Badge className={statusColors[appointment.status]}>
                          {appointment.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        <strong>Raça:</strong> {appointment.racaPet} • <strong>Porte:</strong> {appointment.portePet}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Serviço:</strong> {appointment.servicoRealizar}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Data/Hora:</strong> {formatDate(appointment.dataServico)} às {appointment.horaServico}
                      </p>
                      {appointment.observacoes && (
                        <p className="text-sm text-gray-600">
                          <strong>Observações:</strong> {appointment.observacoes}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        variant={canEditAppointment(appointment) ? "outline" : "secondary"}
                        onClick={() => handleEditClick(appointment)}
                        disabled={!canEditAppointment(appointment)}
                        className={canEditAppointment(appointment) 
                          ? "border-brand-cyan hover:bg-brand-cyan hover:text-white" 
                          : "opacity-50 cursor-not-allowed"
                        }
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      {!canEditAppointment(appointment) && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <AlertCircle className="h-3 w-3" />
                          <span>Não editável</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">
                Você ainda não possui agendamentos.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Agendamento</DialogTitle>
            <DialogDescription>
              Faça as alterações necessárias no seu agendamento.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-nomePet">Nome do Pet</Label>
                <Input
                  id="edit-nomePet"
                  value={editFormData.nomePet}
                  onChange={(e) => setEditFormData({ ...editFormData, nomePet: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-racaPet">Raça</Label>
                <Select value={editFormData.racaPet} onValueChange={(value) => setEditFormData({ ...editFormData, racaPet: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a raça" />
                  </SelectTrigger>
                  <SelectContent>
                    {racas.map((raca) => (
                      <SelectItem key={raca} value={raca}>{raca}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-portePet">Porte</Label>
                <Select value={editFormData.portePet} onValueChange={(value) => setEditFormData({ ...editFormData, portePet: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o porte" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pequeno">Pequeno</SelectItem>
                    <SelectItem value="Médio">Médio</SelectItem>
                    <SelectItem value="Grande">Grande</SelectItem>
                    <SelectItem value="Gigante">Gigante</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-servicoRealizar">Serviço</Label>
                <Select value={editFormData.servicoRealizar} onValueChange={(value) => setEditFormData({ ...editFormData, servicoRealizar: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o serviço" />
                  </SelectTrigger>
                  <SelectContent>
                    {servicos.map((servico) => (
                      <SelectItem key={servico} value={servico}>{servico}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-dataServico">Data Preferida</Label>
                <Input
                  id="edit-dataServico"
                  type="date"
                  value={editFormData.dataServico}
                  onChange={(e) => setEditFormData({ ...editFormData, dataServico: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <Label htmlFor="edit-horaServico">Horário Preferido</Label>
                <Select value={editFormData.horaServico} onValueChange={(value) => setEditFormData({ ...editFormData, horaServico: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o horário" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="08:00">08:00</SelectItem>
                    <SelectItem value="09:00">09:00</SelectItem>
                    <SelectItem value="10:00">10:00</SelectItem>
                    <SelectItem value="11:00">11:00</SelectItem>
                    <SelectItem value="13:00">13:00</SelectItem>
                    <SelectItem value="14:00">14:00</SelectItem>
                    <SelectItem value="15:00">15:00</SelectItem>
                    <SelectItem value="16:00">16:00</SelectItem>
                    <SelectItem value="17:00">17:00</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-observacoes">Observações</Label>
              <Textarea
                id="edit-observacoes"
                value={editFormData.observacoes}
                onChange={(e) => setEditFormData({ ...editFormData, observacoes: e.target.value })}
                placeholder="Alguma observação especial sobre seu pet ou preferência para o serviço?"
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveEdit} className="bg-brand-cyan hover:bg-brand-cyan/90">
                Salvar Alterações
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TutorAppointments;
