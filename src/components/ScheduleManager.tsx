
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, PlusCircle, Clock, Scissors, Home, Car, Droplets } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Appointment {
  id: string;
  nomeTutor: string;
  nomePet: string;
  dataServico: string;
  horaServico: string;
  servicoRealizar: string;
  status: "Agendado" | "Confirmado" | "Em andamento" | "Concluído" | "Cancelado";
  valor: number;
}

const ScheduleManager = () => {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "1",
      nomeTutor: "Maria Silva",
      nomePet: "Rex",
      dataServico: "2024-07-04",
      horaServico: "09:00",
      servicoRealizar: "Banho e Tosa",
      status: "Confirmado",
      valor: 80.00
    },
    {
      id: "2",
      nomeTutor: "João Santos",
      nomePet: "Luna",
      dataServico: "2024-07-04",
      horaServico: "10:30",
      servicoRealizar: "Hospedagem",
      status: "Em andamento",
      valor: 50.00
    },
    {
      id: "3",
      nomeTutor: "Ana Costa",
      nomePet: "Bela",
      dataServico: "2024-07-04",
      horaServico: "14:00",
      servicoRealizar: "Banho",
      status: "Agendado",
      valor: 35.00
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    nomeTutor: "",
    nomePet: "",
    dataServico: "",
    horaServico: "",
    servicoRealizar: "",
    valor: ""
  });

  const serviceIcons = {
    "Banho": Droplets,
    "Tosa": Scissors,
    "Banho e Tosa": Droplets,
    "Hospedagem": Home,
    "Pet Sitter": Home,
    "Taxi Dog": Car
  };

  const statusColors = {
    "Agendado": "bg-yellow-100 text-yellow-800",
    "Confirmado": "bg-green-100 text-green-800",
    "Em andamento": "bg-blue-100 text-blue-800",
    "Concluído": "bg-gray-100 text-gray-800",
    "Cancelado": "bg-red-100 text-red-800"
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      nomeTutor: formData.nomeTutor,
      nomePet: formData.nomePet,
      dataServico: formData.dataServico,
      horaServico: formData.horaServico,
      servicoRealizar: formData.servicoRealizar,
      status: "Agendado",
      valor: parseFloat(formData.valor)
    };
    setAppointments([...appointments, newAppointment]);
    setFormData({
      nomeTutor: "",
      nomePet: "",
      dataServico: "",
      horaServico: "",
      servicoRealizar: "",
      valor: ""
    });
    setIsDialogOpen(false);
    toast({
      title: "Agendamento criado!",
      description: `Serviço de ${formData.servicoRealizar} agendado para ${formData.nomePet}.`,
    });
  };

  const updateStatus = (id: string, newStatus: Appointment['status']) => {
    setAppointments(appointments.map(apt => 
      apt.id === id ? { ...apt, status: newStatus } : apt
    ));
    toast({
      title: "Status atualizado",
      description: `Agendamento foi marcado como ${newStatus.toLowerCase()}.`,
    });
  };

  const todayAppointments = appointments.filter(apt => apt.dataServico === new Date().toISOString().split('T')[0]);
  const upcomingAppointments = appointments.filter(apt => apt.dataServico > new Date().toISOString().split('T')[0]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Agendamentos</h2>
          <p className="text-muted-foreground">Gerencie os agendamentos de serviços</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700">
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Agendamento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Novo Agendamento</DialogTitle>
              <DialogDescription>
                Agende um novo serviço para um pet.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nomeTutor">Tutor</Label>
                  <Input
                    id="nomeTutor"
                    value={formData.nomeTutor}
                    onChange={(e) => setFormData({ ...formData, nomeTutor: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="nomePet">Pet</Label>
                  <Input
                    id="nomePet"
                    value={formData.nomePet}
                    onChange={(e) => setFormData({ ...formData, nomePet: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="dataServico">Data</Label>
                  <Input
                    id="dataServico"
                    type="date"
                    value={formData.dataServico}
                    onChange={(e) => setFormData({ ...formData, dataServico: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="horaServico">Horário</Label>
                  <Input
                    id="horaServico"
                    type="time"
                    value={formData.horaServico}
                    onChange={(e) => setFormData({ ...formData, horaServico: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="servicoRealizar">Serviço</Label>
                  <Select value={formData.servicoRealizar} onValueChange={(value) => setFormData({ ...formData, servicoRealizar: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o serviço" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Banho">Banho</SelectItem>
                      <SelectItem value="Tosa">Tosa</SelectItem>
                      <SelectItem value="Banho e Tosa">Banho e Tosa</SelectItem>
                      <SelectItem value="Hospedagem">Hospedagem</SelectItem>
                      <SelectItem value="Pet Sitter">Pet Sitter</SelectItem>
                      <SelectItem value="Taxi Dog">Taxi Dog</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="valor">Valor (R$)</Label>
                  <Input
                    id="valor"
                    type="number"
                    step="0.01"
                    value={formData.valor}
                    onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Agendar Serviço
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Today's Appointments */}
      <Card className="bg-gradient-to-r from-blue-50 to-teal-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Agendamentos de Hoje
          </CardTitle>
          <CardDescription>{todayAppointments.length} serviços agendados para hoje</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {todayAppointments.map((appointment) => {
              const ServiceIcon = serviceIcons[appointment.servicoRealizar as keyof typeof serviceIcons] || Clock;
              return (
                <div key={appointment.id} className="flex items-center justify-between p-4 bg-white/70 rounded-lg border hover:bg-white/90 transition-colors">
                  <div className="flex items-center gap-3">
                    <ServiceIcon className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">{appointment.nomeTutor} - {appointment.nomePet}</p>
                      <p className="text-sm text-muted-foreground">{appointment.servicoRealizar}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{appointment.horaServico}</span>
                    <Badge className={statusColors[appointment.status]}>
                      {appointment.status}
                    </Badge>
                    <span className="font-medium text-green-600">R$ {appointment.valor.toFixed(2)}</span>
                    <div className="flex gap-1">
                      {appointment.status === "Agendado" && (
                        <Button size="sm" variant="outline" onClick={() => updateStatus(appointment.id, "Confirmado")}>
                          Confirmar
                        </Button>
                      )}
                      {appointment.status === "Confirmado" && (
                        <Button size="sm" variant="outline" onClick={() => updateStatus(appointment.id, "Em andamento")}>
                          Iniciar
                        </Button>
                      )}
                      {appointment.status === "Em andamento" && (
                        <Button size="sm" variant="outline" onClick={() => updateStatus(appointment.id, "Concluído")}>
                          Concluir
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Appointments */}
      <Card className="bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Próximos Agendamentos</CardTitle>
          <CardDescription>{upcomingAppointments.length} agendamentos futuros</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingAppointments.map((appointment) => {
              const ServiceIcon = serviceIcons[appointment.servicoRealizar as keyof typeof serviceIcons] || Clock;
              return (
                <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <ServiceIcon className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium">{appointment.nomeTutor} - {appointment.nomePet}</p>
                      <p className="text-sm text-muted-foreground">{appointment.servicoRealizar}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm">{new Date(appointment.dataServico).toLocaleDateString('pt-BR')} às {appointment.horaServico}</span>
                    <Badge className={statusColors[appointment.status]}>
                      {appointment.status}
                    </Badge>
                    <span className="font-medium text-green-600">R$ {appointment.valor.toFixed(2)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScheduleManager;
