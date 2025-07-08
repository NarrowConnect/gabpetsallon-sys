import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAgendamentos } from '@/hooks/useAgendamentos';
import { useTutors } from '@/hooks/useTutors';
import { usePets } from '@/hooks/usePets';
import type { AgendamentoDB, AgendamentoInsert } from '@/hooks/useAgendamentos';
import TutorForm from '@/components/forms/TutorForm';
import PetForm from '@/components/forms/PetForm';

const ScheduleManager = () => {
  const { agendamentos, loading, addAgendamento, updateAgendamento, deleteAgendamento } = useAgendamentos();
  const { tutors, addTutor } = useTutors();
  const { pets, addPet } = usePets();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAgendamento, setEditingAgendamento] = useState<AgendamentoDB | null>(null);
  const [showTutorForm, setShowTutorForm] = useState(false);
  const [showPetForm, setShowPetForm] = useState(false);
  const [selectedTutorId, setSelectedTutorId] = useState<string>('');
  
  const [formData, setFormData] = useState<AgendamentoInsert>({
    tutor_nome: '',
    tutor_telefone: '',
    pet_nome: '',
    pet_raca: '',
    pet_porte: '',
    data_servico: '',
    hora_servico: '',
    servico: '',
    status: 'Agendado',
    valor: 0,
    observacoes: ''
  });

  const filteredAgendamentos = agendamentos?.filter(agendamento => {
    const matchesSearch = agendamento.tutor_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agendamento.pet_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agendamento.servico.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || agendamento.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAgendamento) {
        await updateAgendamento(editingAgendamento.id, formData);
        toast.success('Agendamento atualizado com sucesso!');
      } else {
        await addAgendamento(formData);
        toast.success('Agendamento criado com sucesso!');
      }
      setIsFormOpen(false);
      setEditingAgendamento(null);
      resetForm();
    } catch (error) {
      toast.error('Erro ao salvar agendamento');
      console.error('Erro:', error);
    }
  };

  const handleEdit = (agendamento: AgendamentoDB) => {
    setEditingAgendamento(agendamento);
    setFormData({
      tutor_nome: agendamento.tutor_nome,
      tutor_telefone: agendamento.tutor_telefone || '',
      pet_nome: agendamento.pet_nome,
      pet_raca: agendamento.pet_raca || '',
      pet_porte: agendamento.pet_porte || '',
      data_servico: agendamento.data_servico,
      hora_servico: agendamento.hora_servico,
      servico: agendamento.servico,
      status: agendamento.status || 'Agendado',
      valor: agendamento.valor || 0,
      observacoes: agendamento.observacoes || ''
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este agendamento?')) {
      try {
        await deleteAgendamento(id);
        toast.success('Agendamento excluído com sucesso!');
      } catch (error) {
        toast.error('Erro ao excluir agendamento');
        console.error('Erro:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      tutor_nome: '',
      tutor_telefone: '',
      pet_nome: '',
      pet_raca: '',
      pet_porte: '',
      data_servico: '',
      hora_servico: '',
      servico: '',
      status: 'Agendado',
      valor: 0,
      observacoes: ''
    });
  };

  const handleTutorSelect = (tutorId: string) => {
    const tutor = tutors?.find(t => t.id === tutorId);
    if (tutor) {
      setFormData(prev => ({
        ...prev,
        tutor_id: tutorId,
        tutor_nome: tutor.nome,
        tutor_telefone: tutor.celular
      }));
    }
  };

  const handlePetSelect = (petId: string) => {
    const pet = pets?.find(p => p.id === petId);
    if (pet) {
      setFormData(prev => ({
        ...prev,
        pet_id: petId,
        pet_nome: pet.nome_pet,
        pet_raca: pet.raca || '',
        pet_porte: pet.porte || ''
      }));
    }
  };

  const handleCreateTutor = async (tutorData: any) => {
    try {
      const newTutor = await addTutor(tutorData);
      setFormData(prev => ({
        ...prev,
        tutor_id: newTutor.id,
        tutor_nome: newTutor.nome,
        tutor_telefone: newTutor.celular
      }));
      toast.success('Tutor criado com sucesso!');
    } catch (error) {
      toast.error('Erro ao criar tutor');
      console.error('Erro:', error);
    }
  };

  const handleCreatePet = async (petData: any) => {
    try {
      const newPet = await addPet(petData);
      setFormData(prev => ({
        ...prev,
        pet_id: newPet.id,
        pet_nome: newPet.nome_pet,
        pet_raca: newPet.raca || '',
        pet_porte: newPet.porte || ''
      }));
      toast.success('Pet criado com sucesso!');
    } catch (error) {
      toast.error('Erro ao criar pet');
      console.error('Erro:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Agendado': return 'bg-blue-100 text-blue-800';
      case 'Confirmado': return 'bg-green-100 text-green-800';
      case 'Em andamento': return 'bg-yellow-100 text-yellow-800';
      case 'Concluído': return 'bg-gray-100 text-gray-800';
      case 'Cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg font-poppins">Carregando agendamentos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-poppins">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-poppins">Gerenciar Agendamentos</h2>
          <p className="text-gray-600 font-poppins">Controle todos os agendamentos do salão</p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingAgendamento(null); }} className="font-poppins">
              <Plus className="h-4 w-4 mr-2" />
              Novo Agendamento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-poppins">
                {editingAgendamento ? 'Editar Agendamento' : 'Novo Agendamento'}
              </DialogTitle>
              <DialogDescription className="font-poppins">
                Preencha os dados do agendamento.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tutor_select" className="font-poppins">Selecionar Tutor Existente</Label>
                  <Select onValueChange={handleTutorSelect}>
                    <SelectTrigger className="font-poppins">
                      <SelectValue placeholder="Selecione um tutor" />
                    </SelectTrigger>
                    <SelectContent>
                      {tutors?.map(tutor => (
                        <SelectItem key={tutor.id} value={tutor.id} className="font-poppins">
                          {tutor.nome} - {tutor.celular}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="mt-2 font-poppins"
                    onClick={() => setShowTutorForm(true)}
                  >
                    Criar Novo Tutor
                  </Button>
                </div>

                <div>
                  <Label htmlFor="pet_select" className="font-poppins">Selecionar Pet Existente</Label>
                  <Select onValueChange={handlePetSelect}>
                    <SelectTrigger className="font-poppins">
                      <SelectValue placeholder="Selecione um pet" />
                    </SelectTrigger>
                    <SelectContent>
                      {pets?.map(pet => (
                        <SelectItem key={pet.id} value={pet.id} className="font-poppins">
                          {pet.nome_pet} - {pet.raca} ({pet.porte})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="mt-2 font-poppins"
                    onClick={() => setShowPetForm(true)}
                  >
                    Criar Novo Pet
                  </Button>
                </div>

                <div>
                  <Label htmlFor="tutor_nome" className="font-poppins">Nome do Tutor *</Label>
                  <Input
                    id="tutor_nome"
                    value={formData.tutor_nome}
                    onChange={(e) => setFormData(prev => ({ ...prev, tutor_nome: e.target.value }))}
                    required
                    className="font-poppins"
                  />
                </div>

                <div>
                  <Label htmlFor="tutor_telefone" className="font-poppins">Telefone do Tutor</Label>
                  <Input
                    id="tutor_telefone"
                    value={formData.tutor_telefone || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, tutor_telefone: e.target.value }))}
                    className="font-poppins"
                  />
                </div>

                <div>
                  <Label htmlFor="pet_nome" className="font-poppins">Nome do Pet *</Label>
                  <Input
                    id="pet_nome"
                    value={formData.pet_nome}
                    onChange={(e) => setFormData(prev => ({ ...prev, pet_nome: e.target.value }))}
                    required
                    className="font-poppins"
                  />
                </div>

                <div>
                  <Label htmlFor="pet_raca" className="font-poppins">Raça do Pet</Label>
                  <Input
                    id="pet_raca"
                    value={formData.pet_raca || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, pet_raca: e.target.value }))}
                    className="font-poppins"
                  />
                </div>

                <div>
                  <Label htmlFor="pet_porte" className="font-poppins">Porte do Pet</Label>
                  <Select value={formData.pet_porte || ''} onValueChange={(value) => setFormData(prev => ({ ...prev, pet_porte: value }))}>
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

                <div>
                  <Label htmlFor="data_servico" className="font-poppins">Data do Serviço *</Label>
                  <Input
                    id="data_servico"
                    type="date"
                    value={formData.data_servico}
                    onChange={(e) => setFormData(prev => ({ ...prev, data_servico: e.target.value }))}
                    required
                    className="font-poppins"
                  />
                </div>

                <div>
                  <Label htmlFor="hora_servico" className="font-poppins">Hora do Serviço *</Label>
                  <Input
                    id="hora_servico"
                    type="time"
                    value={formData.hora_servico}
                    onChange={(e) => setFormData(prev => ({ ...prev, hora_servico: e.target.value }))}
                    required
                    className="font-poppins"
                  />
                </div>

                <div>
                  <Label htmlFor="servico" className="font-poppins">Tipo de Serviço *</Label>
                  <Select value={formData.servico} onValueChange={(value) => setFormData(prev => ({ ...prev, servico: value }))}>
                    <SelectTrigger className="font-poppins">
                      <SelectValue placeholder="Selecione o serviço" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Banho e Tosa" className="font-poppins">Banho e Tosa</SelectItem>
                      <SelectItem value="Banho Simples" className="font-poppins">Banho Simples</SelectItem>
                      <SelectItem value="Tosa" className="font-poppins">Tosa</SelectItem>
                      <SelectItem value="Banho Medicamentoso" className="font-poppins">Banho Medicamentoso</SelectItem>
                      <SelectItem value="Hospedagem" className="font-poppins">Hospedagem</SelectItem>
                      <SelectItem value="Taxi Dog" className="font-poppins">Taxi Dog</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status" className="font-poppins">Status</Label>
                  <Select value={formData.status || 'Agendado'} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger className="font-poppins">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Agendado" className="font-poppins">Agendado</SelectItem>
                      <SelectItem value="Confirmado" className="font-poppins">Confirmado</SelectItem>
                      <SelectItem value="Em andamento" className="font-poppins">Em andamento</SelectItem>
                      <SelectItem value="Concluído" className="font-poppins">Concluído</SelectItem>
                      <SelectItem value="Cancelado" className="font-poppins">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="valor" className="font-poppins">Valor (R$)</Label>
                  <Input
                    id="valor"
                    type="number"
                    step="0.01"
                    value={formData.valor || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, valor: parseFloat(e.target.value) || 0 }))}
                    className="font-poppins"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="observacoes" className="font-poppins">Observações</Label>
                <Input
                  id="observacoes"
                  value={formData.observacoes || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                  className="font-poppins"
                />
              </div>

              <Button type="submit" className="w-full font-poppins">
                {editingAgendamento ? 'Atualizar Agendamento' : 'Criar Agendamento'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
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
            <SelectItem value="Agendado" className="font-poppins">Agendado</SelectItem>
            <SelectItem value="Confirmado" className="font-poppins">Confirmado</SelectItem>
            <SelectItem value="Em andamento" className="font-poppins">Em andamento</SelectItem>
            <SelectItem value="Concluído" className="font-poppins">Concluído</SelectItem>
            <SelectItem value="Cancelado" className="font-poppins">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredAgendamentos.map((agendamento) => (
          <Card key={agendamento.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold font-poppins">{agendamento.tutor_nome}</h3>
                    <Badge className={`${getStatusColor(agendamento.status || 'Agendado')} font-poppins`}>
                      {agendamento.status || 'Agendado'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-600">
                    <div className="font-poppins">
                      <strong>Pet:</strong> {agendamento.pet_nome}
                    </div>
                    <div className="font-poppins">
                      <strong>Data:</strong> {format(new Date(agendamento.data_servico), 'dd/MM/yyyy', { locale: ptBR })}
                    </div>
                    <div className="font-poppins">
                      <strong>Hora:</strong> {agendamento.hora_servico}
                    </div>
                    <div className="font-poppins">
                      <strong>Serviço:</strong> {agendamento.servico}
                    </div>
                    {agendamento.valor && (
                      <div className="font-poppins">
                        <strong>Valor:</strong> R$ {agendamento.valor.toFixed(2)}
                      </div>
                    )}
                    {agendamento.tutor_telefone && (
                      <div className="font-poppins">
                        <strong>Telefone:</strong> {agendamento.tutor_telefone}
                      </div>
                    )}
                  </div>
                  {agendamento.observacoes && (
                    <div className="text-sm text-gray-600 font-poppins">
                      <strong>Observações:</strong> {agendamento.observacoes}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(agendamento)}
                    className="font-poppins"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(agendamento.id)}
                    className="font-poppins"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAgendamentos.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 font-poppins">Nenhum agendamento encontrado</h3>
            <p className="text-gray-500 font-poppins">Tente ajustar os filtros ou criar um novo agendamento.</p>
          </CardContent>
        </Card>
      )}

      <TutorForm
        isOpen={showTutorForm}
        onClose={() => setShowTutorForm(false)}
        onSubmit={handleCreateTutor}
        title="Criar Novo Tutor"
        description="Preencha os dados básicos do tutor."
        submitLabel="Criar Tutor"
      />

      <PetForm
        isOpen={showPetForm}
        onClose={() => setShowPetForm(false)}
        onSubmit={handleCreatePet}
        title="Criar Novo Pet"
        description="Preencha os dados básicos do pet."
        submitLabel="Criar Pet"
      />
    </div>
  );
};

export default ScheduleManager;
