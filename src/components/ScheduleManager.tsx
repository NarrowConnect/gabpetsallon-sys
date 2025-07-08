
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, PlusCircle, Clock, Scissors, Home, Car, Droplets, CalendarDays, Plus, User, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAgendamentos, useTutors, usePets } from "@/hooks/useSupabase";
import CalendarView from "./CalendarView";

const ScheduleManager = () => {
  const { toast } = useToast();
  const { agendamentos, loading, error, addAgendamento, updateAgendamento } = useAgendamentos();
  const { tutors, addTutor } = useTutors();
  const { pets, addPet } = usePets();
  
  const [activeView, setActiveView] = useState("lista");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNewTutorDialogOpen, setIsNewTutorDialogOpen] = useState(false);
  const [isNewPetDialogOpen, setIsNewPetDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    tutor_id: "",
    tutor_nome: "",
    tutor_telefone: "",
    pet_id: "",
    pet_nome: "",
    pet_raca: "",
    pet_porte: "",
    data_servico: "",
    hora_servico: "",
    servico: "",
    valor: "",
    observacoes: ""
  });

  const [newTutorData, setNewTutorData] = useState({
    nome: "",
    celular: "",
    endereco: "",
    cidade: "",
    estado: ""
  });

  const [newPetData, setNewPetData] = useState({
    nome_pet: "",
    especie: "Cão",
    raca: "",
    porte: "",
    tutor_id: "",
    nome_tutor: ""
  });

  // Transform agendamentos for display
  const transformedAppointments = agendamentos.map(apt => ({
    id: apt.id,
    nomeTutor: apt.tutor_nome,
    nomePet: apt.pet_nome,
    dataServico: apt.data_servico,
    horaServico: apt.hora_servico,
    servicoRealizar: apt.servico,
    status: apt.status as "Agendado" | "Confirmado" | "Em andamento" | "Concluído" | "Cancelado",
    valor: apt.valor || 0
  }));

  const serviceIcons = {
    "Banho": Droplets,
    "Tosa": Scissors,
    "Banho e Tosa": Droplets,
    "Banho Medicamentoso": Droplets,
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

  const resetForm = () => {
    setFormData({
      tutor_id: "",
      tutor_nome: "",
      tutor_telefone: "",
      pet_id: "",
      pet_nome: "",
      pet_raca: "",
      pet_porte: "",
      data_servico: "",
      hora_servico: "",
      servico: "",
      valor: "",
      observacoes: ""
    });
  };

  const resetNewTutorForm = () => {
    setNewTutorData({
      nome: "",
      celular: "",
      endereco: "",
      cidade: "",
      estado: ""
    });
  };

  const resetNewPetForm = () => {
    setNewPetData({
      nome_pet: "",
      especie: "Cão",
      raca: "",
      porte: "",
      tutor_id: "",
      nome_tutor: ""
    });
  };

  const handleTutorSelect = (tutorId: string) => {
    const selectedTutor = tutors.find(t => t.id === tutorId);
    if (selectedTutor) {
      setFormData({
        ...formData,
        tutor_id: tutorId,
        tutor_nome: selectedTutor.nome,
        tutor_telefone: selectedTutor.celular
      });
    }
  };

  const handlePetSelect = (petId: string) => {
    const selectedPet = pets.find(p => p.id === petId);
    if (selectedPet) {
      setFormData({
        ...formData,
        pet_id: petId,
        pet_nome: selectedPet.nome_pet,
        pet_raca: selectedPet.raca || "",
        pet_porte: selectedPet.porte || ""
      });
    }
  };

  const handleCreateNewTutor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newTutor = await addTutor(newTutorData);
      
      setFormData({
        ...formData,
        tutor_id: newTutor.id,
        tutor_nome: newTutor.nome,
        tutor_telefone: newTutor.celular
      });
      
      resetNewTutorForm();
      setIsNewTutorDialogOpen(false);
      
      toast({
        title: "Tutor criado com sucesso!",
        description: `${newTutorData.nome} foi adicionado ao sistema.`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar o tutor.",
        variant: "destructive"
      });
    }
  };

  const handleCreateNewPet = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.tutor_id) {
        toast({
          title: "Erro",
          description: "Selecione um tutor antes de criar o pet.",
          variant: "destructive"
        });
        return;
      }

      const petData = {
        ...newPetData,
        tutor_id: formData.tutor_id,
        nome_tutor: formData.tutor_nome
      };
      
      const newPet = await addPet(petData);
      
      setFormData({
        ...formData,
        pet_id: newPet.id,
        pet_nome: newPet.nome_pet,
        pet_raca: newPet.raca || "",
        pet_porte: newPet.porte || ""
      });
      
      resetNewPetForm();
      setIsNewPetDialogOpen(false);
      
      toast({
        title: "Pet criado com sucesso!",
        description: `${newPetData.nome_pet} foi adicionado ao sistema.`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar o pet.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const agendamentoData = {
        tutor_id: formData.tutor_id,
        tutor_nome: formData.tutor_nome,
        tutor_telefone: formData.tutor_telefone,
        pet_id: formData.pet_id,
        pet_nome: formData.pet_nome,
        pet_raca: formData.pet_raca,
        pet_porte: formData.pet_porte,
        data_servico: formData.data_servico,
        hora_servico: formData.hora_servico,
        servico: formData.servico,
        valor: formData.valor ? parseFloat(formData.valor) : null,
        observacoes: formData.observacoes,
        status: "Agendado",
        origem: "admin"
      };

      await addAgendamento(agendamentoData);
      
      toast({
        title: "Agendamento criado!",
        description: `Serviço de ${formData.servico} agendado para ${formData.pet_nome}.`,
      });
      
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar o agendamento.",
        variant: "destructive"
      });
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await updateAgendamento(id, { status: newStatus });
      toast({
        title: "Status atualizado",
        description: `Agendamento foi marcado como ${newStatus.toLowerCase()}.`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar status.",
        variant: "destructive"
      });
    }
  };

  const filteredAppointments = agendamentos.filter(apt => {
    const aptDate = new Date(apt.data_servico);
    return aptDate.getMonth() === selectedMonth && aptDate.getFullYear() === selectedYear;
  });

  const todayAppointments = filteredAppointments.filter(apt => 
    apt.data_servico === new Date().toISOString().split('T')[0]
  );

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 font-poppins">Erro ao carregar agendamentos: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-poppins">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 font-poppins">Agendamentos</h2>
          <p className="text-muted-foreground font-poppins">Gerencie os agendamentos de serviços</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="month-select" className="font-poppins">Mês:</Label>
            <select
              id="month-select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm font-poppins"
            >
              {monthNames.map((month, index) => (
                <option key={index} value={index}>{month}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="year-select" className="font-poppins">Ano:</Label>
            <Input
              id="year-select"
              type="number"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-24 font-poppins"
            />
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 font-poppins">
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Agendamento
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-poppins">Novo Agendamento</DialogTitle>
                <DialogDescription className="font-poppins">
                  Agende um novo serviço para um pet.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Seção Tutor */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold font-poppins">Tutor</h3>
                    <Dialog open={isNewTutorDialogOpen} onOpenChange={setIsNewTutorDialogOpen}>
                      <DialogTrigger asChild>
                        <Button type="button" variant="outline" size="sm" className="font-poppins">
                          <Plus className="h-4 w-4 mr-1" />
                          Novo Tutor
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="font-poppins">Criar Novo Tutor</DialogTitle>
                          <DialogDescription className="font-poppins">
                            Dados básicos do tutor.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateNewTutor} className="space-y-4">
                          <div>
                            <Label htmlFor="new-tutor-nome" className="font-poppins">Nome Completo</Label>
                            <Input
                              id="new-tutor-nome"
                              value={newTutorData.nome}
                              onChange={(e) => setNewTutorData({ ...newTutorData, nome: e.target.value })}
                              required
                              className="font-poppins"
                            />
                          </div>
                          <div>
                            <Label htmlFor="new-tutor-celular" className="font-poppins">Celular</Label>
                            <Input
                              id="new-tutor-celular"
                              value={newTutorData.celular}
                              onChange={(e) => setNewTutorData({ ...newTutorData, celular: e.target.value })}
                              placeholder="(41) 99999-9999"
                              required
                              className="font-poppins"
                            />
                          </div>
                          <Button type="submit" className="w-full font-poppins">
                            Criar Tutor
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  <div>
                    <Label htmlFor="tutor" className="font-poppins">Selecionar Tutor</Label>
                    <Select value={formData.tutor_id} onValueChange={handleTutorSelect}>
                      <SelectTrigger className="font-poppins">
                        <SelectValue placeholder="Selecione um tutor" />
                      </SelectTrigger>
                      <SelectContent>
                        {tutors.map((tutor) => (
                          <SelectItem key={tutor.id} value={tutor.id} className="font-poppins">
                            {tutor.nome} - {tutor.celular}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Seção Pet */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold font-poppins">Pet</h3>
                    <Dialog open={isNewPetDialogOpen} onOpenChange={setIsNewPetDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          disabled={!formData.tutor_id}
                          className="font-poppins"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Novo Pet
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="font-poppins">Criar Novo Pet</DialogTitle>
                          <DialogDescription className="font-poppins">
                            Dados básicos do pet para {formData.tutor_nome}.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateNewPet} className="space-y-4">
                          <div>
                            <Label htmlFor="new-pet-nome" className="font-poppins">Nome do Pet</Label>
                            <Input
                              id="new-pet-nome"
                              value={newPetData.nome_pet}
                              onChange={(e) => setNewPetData({ ...newPetData, nome_pet: e.target.value })}
                              required
                              className="font-poppins"
                            />
                          </div>
                          <div>
                            <Label htmlFor="new-pet-raca" className="font-poppins">Raça</Label>
                            <Input
                              id="new-pet-raca"
                              value={newPetData.raca}
                              onChange={(e) => setNewPetData({ ...newPetData, raca: e.target.value })}
                              className="font-poppins"
                            />
                          </div>
                          <div>
                            <Label htmlFor="new-pet-porte" className="font-poppins">Porte</Label>
                            <Select value={newPetData.porte} onValueChange={(value) => setNewPetData({ ...newPetData, porte: value })}>
                              <SelectTrigger className="font-poppins">
                                <SelectValue placeholder="Selecione o porte" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Pequeno" className="font-poppins">Pequeno</SelectItem>
                                <SelectItem value="Médio" className="font-poppins">Médio</SelectItem>
                                <SelectItem value="Grande" className="font-poppins">Grande</SelectItem>
                                <SelectItem value="Gigante" className="font-poppins">Gigante</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button type="submit" className="w-full font-poppins">
                            Criar Pet
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  <div>
                    <Label htmlFor="pet" className="font-poppins">Selecionar Pet</Label>
                    <Select value={formData.pet_id} onValueChange={handlePetSelect} disabled={!formData.tutor_id}>
                      <SelectTrigger className="font-poppins">
                        <SelectValue placeholder={formData.tutor_id ? "Selecione um pet" : "Selecione um tutor primeiro"} />
                      </SelectTrigger>
                      <SelectContent>
                        {pets
                          .filter(pet => pet.tutor_id === formData.tutor_id || pet.nome_tutor === formData.tutor_nome)
                          .map((pet) => (
                            <SelectItem key={pet.id} value={pet.id} className="font-poppins">
                              {pet.nome_pet} - {pet.raca} ({pet.porte})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Seção Agendamento */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold font-poppins">Detalhes do Serviço</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="data_servico" className="font-poppins">Data</Label>
                      <Input
                        id="data_servico"
                        type="date"
                        value={formData.data_servico}
                        onChange={(e) => setFormData({ ...formData, data_servico: e.target.value })}
                        required
                        className="font-poppins"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hora_servico" className="font-poppins">Horário</Label>
                      <Select value={formData.hora_servico} onValueChange={(value) => setFormData({ ...formData, hora_servico: value })}>
                        <SelectTrigger className="font-poppins">
                          <SelectValue placeholder="Selecione o horário" />
                        </SelectTrigger>
                        <SelectContent>
                          {["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"].map((hora) => (
                            <SelectItem key={hora} value={hora} className="font-poppins">{hora}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="servico" className="font-poppins">Serviço</Label>
                      <Select value={formData.servico} onValueChange={(value) => setFormData({ ...formData, servico: value })}>
                        <SelectTrigger className="font-poppins">
                          <SelectValue placeholder="Selecione o serviço" />
                        </SelectTrigger>
                        <SelectContent>
                          {["Banho", "Tosa", "Banho e Tosa", "Banho Medicamentoso", "Hospedagem", "Pet Sitter", "Taxi Dog"].map((servico) => (
                            <SelectItem key={servico} value={servico} className="font-poppins">{servico}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="valor" className="font-poppins">Valor (R$)</Label>
                      <Input
                        id="valor"
                        type="number"
                        step="0.01"
                        value={formData.valor}
                        onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                        className="font-poppins"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="observacoes" className="font-poppins">Observações</Label>
                    <Textarea
                      id="observacoes"
                      value={formData.observacoes}
                      onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                      rows={3}
                      className="font-poppins"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full font-poppins">
                  Agendar Serviço
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="lista" className="flex items-center gap-2 font-poppins">
            <Calendar className="h-4 w-4" />
            Lista de Agendamentos
          </TabsTrigger>
          <TabsTrigger value="calendario" className="flex items-center gap-2 font-poppins">
            <CalendarDays className="h-4 w-4" />
            Visualização Calendário
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="space-y-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold font-poppins">
              {monthNames[selectedMonth]} de {selectedYear}
            </h3>
            <p className="text-sm text-muted-foreground font-poppins">
              {filteredAppointments.length} agendamentos neste período
            </p>
          </div>

          {todayAppointments.length > 0 && (
            <Card className="bg-gradient-to-r from-blue-50 to-teal-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-poppins">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Agendamentos de Hoje
                </CardTitle>
                <CardDescription className="font-poppins">{todayAppointments.length} serviços agendados para hoje</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todayAppointments.map((appointment) => {
                    const ServiceIcon = serviceIcons[appointment.servico as keyof typeof serviceIcons] || Clock;
                    return (
                      <div key={appointment.id} className="flex items-center justify-between p-4 bg-white/70 rounded-lg border hover:bg-white/90 transition-colors">
                        <div className="flex items-center gap-3">
                          <ServiceIcon className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="font-medium font-poppins">{appointment.tutor_nome} - {appointment.pet_nome}</p>
                            <p className="text-sm text-muted-foreground font-poppins">{appointment.servico}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-medium font-poppins">{appointment.hora_servico}</span>
                          <Select value={appointment.status} onValueChange={(value) => updateStatus(appointment.id, value)}>
                            <SelectTrigger className="w-32">
                              <Badge className={statusColors[appointment.status]}>
                                {appointment.status}
                              </Badge>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Agendado" className="font-poppins">Agendado</SelectItem>
                              <SelectItem value="Confirmado" className="font-poppins">Confirmado</SelectItem>
                              <SelectItem value="Em andamento" className="font-poppins">Em andamento</SelectItem>
                              <SelectItem value="Concluído" className="font-poppins">Concluído</SelectItem>
                              <SelectItem value="Cancelado" className="font-poppins">Cancelado</SelectItem>
                            </SelectContent>
                          </Select>
                          {appointment.valor && (
                            <span className="font-medium text-green-600 font-poppins">R$ {appointment.valor.toFixed(2)}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-poppins">Agendamentos do Período</CardTitle>
              <CardDescription className="font-poppins">{filteredAppointments.length} agendamentos encontrados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredAppointments.map((appointment) => {
                  const ServiceIcon = serviceIcons[appointment.servico as keyof typeof serviceIcons] || Clock;
                  return (
                    <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <ServiceIcon className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="font-medium font-poppins">{appointment.tutor_nome} - {appointment.pet_nome}</p>
                          <p className="text-sm text-muted-foreground font-poppins">{appointment.servico}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-poppins">{new Date(appointment.data_servico).toLocaleDateString('pt-BR')} às {appointment.hora_servico}</span>
                        <Select value={appointment.status} onValueChange={(value) => updateStatus(appointment.id, value)}>
                          <SelectTrigger className="w-32">
                            <Badge className={statusColors[appointment.status]}>
                              {appointment.status}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Agendado" className="font-poppins">Agendado</SelectItem>
                            <SelectItem value="Confirmado" className="font-poppins">Confirmado</SelectItem>
                            <SelectItem value="Em andamento" className="font-poppins">Em andamento</SelectItem>
                            <SelectItem value="Concluído" className="font-poppins">Concluído</SelectItem>
                            <SelectItem value="Cancelado" className="font-poppins">Cancelado</SelectItem>
                          </SelectContent>
                        </Select>
                        {appointment.valor && (
                          <span className="font-medium text-green-600 font-poppins">R$ {appointment.valor.toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
                {filteredAppointments.length === 0 && (
                  <p className="text-center text-muted-foreground py-8 font-poppins">
                    Nenhum agendamento encontrado para este período
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendario">
          <div className="mb-4 text-center">
            <h3 className="text-xl font-semibold font-poppins">
              Calendário - {monthNames[selectedMonth]} de {selectedYear}
            </h3>
          </div>
          <CalendarView appointments={transformedAppointments.filter(apt => {
            const aptDate = new Date(apt.dataServico);
            return aptDate.getMonth() === selectedMonth && aptDate.getFullYear() === selectedYear;
          })} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScheduleManager;
