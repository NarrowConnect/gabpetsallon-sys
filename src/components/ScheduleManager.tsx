
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, PawPrint, Plus, Edit, Trash2 } from "lucide-react";
import { useAgendamentos } from '@/hooks/useAgendamentos';
import { useTutors } from '@/hooks/useTutors';
import { usePets } from '@/hooks/usePets';
import { useToast } from "@/hooks/use-toast";

const ScheduleManager = () => {
  const { agendamentos, loading, addAgendamento, updateAgendamento, deleteAgendamento } = useAgendamentos();
  const { tutors } = useTutors();
  const { pets } = usePets();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    tutor_nome: '',
    tutor_telefone: '',
    pet_nome: '',
    pet_raca: '',
    pet_porte: '',
    data_servico: '',
    hora_servico: '',
    servico: '',
    valor: '',
    observacoes: '',
    status: 'Agendado'
  });

  const servicos = [
    'Banho',
    'Tosa',
    'Banho e Tosa',
    'Banho Medicamentoso',
    'Hospedagem',
    'Pet Sitter',
    'Taxi Dog'
  ];

  const statusOptions = [
    'Agendado',
    'Confirmado',
    'Em andamento',
    'Concluído',
    'Cancelado'
  ];

  const porteOptions = [
    'Pequeno',
    'Médio',
    'Grande'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTutorSelect = (tutorId: string) => {
    const tutor = tutors.find(t => t.id === tutorId);
    if (tutor) {
      setFormData(prev => ({
        ...prev,
        tutor_nome: tutor.nome,
        tutor_telefone: tutor.celular
      }));
    }
  };

  const handlePetSelect = (petId: string) => {
    const pet = pets.find(p => p.id === petId);
    if (pet) {
      setFormData(prev => ({
        ...prev,
        pet_nome: pet.nome_pet,
        pet_raca: pet.raca || '',
        pet_porte: pet.porte || ''
      }));
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
      valor: '',
      observacoes: '',
      status: 'Agendado'
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const agendamentoData = {
        ...formData,
        valor: formData.valor ? parseFloat(formData.valor) : null,
        origem: 'admin' as const
      };

      if (isEditing && editingId) {
        await updateAgendamento(editingId, agendamentoData);
        toast({
          title: "Agendamento atualizado",
          description: "O agendamento foi atualizado com sucesso.",
        });
      } else {
        await addAgendamento(agendamentoData);
        toast({
          title: "Agendamento criado",
          description: "O agendamento foi criado com sucesso.",
        });
      }
      
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar agendamento:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar o agendamento. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (agendamento: any) => {
    setFormData({
      tutor_nome: agendamento.tutor_nome,
      tutor_telefone: agendamento.tutor_telefone || '',
      pet_nome: agendamento.pet_nome,
      pet_raca: agendamento.pet_raca || '',
      pet_porte: agendamento.pet_porte || '',
      data_servico: agendamento.data_servico,
      hora_servico: agendamento.hora_servico,
      servico: agendamento.servico,
      valor: agendamento.valor ? agendamento.valor.toString() : '',
      observacoes: agendamento.observacoes || '',
      status: agendamento.status || 'Agendado'
    });
    setIsEditing(true);
    setEditingId(agendamento.id);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza de que deseja excluir este agendamento?')) {
      try {
        await deleteAgendamento(id);
        toast({
          title: "Agendamento excluído",
          description: "O agendamento foi excluído com sucesso.",
        });
      } catch (error) {
        console.error('Erro ao excluir agendamento:', error);
        toast({
          title: "Erro ao excluir",
          description: "Ocorreu um erro ao excluir o agendamento.",
          variant: "destructive",
        });
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Agendado':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Confirmado':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Em andamento':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Concluído':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Cancelado':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-poppins">
            <Calendar className="h-5 w-5" />
            {isEditing ? 'Editar Agendamento' : 'Novo Agendamento'}
          </CardTitle>
          <CardDescription className="font-poppins">
            {isEditing ? 'Edite os dados do agendamento' : 'Preencha os dados para criar um novo agendamento'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tutor-select" className="font-poppins">Selecionar Tutor</Label>
                <Select onValueChange={handleTutorSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um tutor" />
                  </SelectTrigger>
                  <SelectContent>
                    {tutors.map((tutor) => (
                      <SelectItem key={tutor.id} value={tutor.id}>
                        {tutor.nome} - {tutor.celular}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pet-select" className="font-poppins">Selecionar Pet</Label>
                <Select onValueChange={handlePetSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um pet" />
                  </SelectTrigger>
                  <SelectContent>
                    {pets.map((pet) => (
                      <SelectItem key={pet.id} value={pet.id}>
                        {pet.nome_pet} ({pet.nome_tutor})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tutor_nome" className="font-poppins">Nome do Tutor</Label>
                <Input
                  id="tutor_nome"
                  value={formData.tutor_nome}
                  onChange={(e) => handleInputChange('tutor_nome', e.target.value)}
                  placeholder="Nome do tutor"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tutor_telefone" className="font-poppins">Telefone do Tutor</Label>
                <Input
                  id="tutor_telefone"
                  value={formData.tutor_telefone}
                  onChange={(e) => handleInputChange('tutor_telefone', e.target.value)}
                  placeholder="Telefone do tutor"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pet_nome" className="font-poppins">Nome do Pet</Label>
                <Input
                  id="pet_nome"
                  value={formData.pet_nome}
                  onChange={(e) => handleInputChange('pet_nome', e.target.value)}
                  placeholder="Nome do pet"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pet_raca" className="font-poppins">Raça</Label>
                <Input
                  id="pet_raca"
                  value={formData.pet_raca}
                  onChange={(e) => handleInputChange('pet_raca', e.target.value)}
                  placeholder="Raça do pet"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pet_porte" className="font-poppins">Porte</Label>
                <Select value={formData.pet_porte} onValueChange={(value) => handleInputChange('pet_porte', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o porte" />
                  </SelectTrigger>
                  <SelectContent>
                    {porteOptions.map((porte) => (
                      <SelectItem key={porte} value={porte}>
                        {porte}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data_servico" className="font-poppins">Data do Serviço</Label>
                <Input
                  id="data_servico"
                  type="date"
                  value={formData.data_servico}
                  onChange={(e) => handleInputChange('data_servico', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hora_servico" className="font-poppins">Hora do Serviço</Label>
                <Input
                  id="hora_servico"
                  type="time"
                  value={formData.hora_servico}
                  onChange={(e) => handleInputChange('hora_servico', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="valor" className="font-poppins">Valor (R$)</Label>
                <Input
                  id="valor"
                  type="number"
                  step="0.01"
                  value={formData.valor}
                  onChange={(e) => handleInputChange('valor', e.target.value)}
                  placeholder="0,00"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="servico" className="font-poppins">Serviço</Label>
                <Select value={formData.servico} onValueChange={(value) => handleInputChange('servico', value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o serviço" />
                  </SelectTrigger>
                  <SelectContent>
                    {servicos.map((servico) => (
                      <SelectItem key={servico} value={servico}>
                        {servico}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="font-poppins">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes" className="font-poppins">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => handleInputChange('observacoes', e.target.value)}
                placeholder="Observações sobre o agendamento"
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="font-poppins">
                <Plus className="h-4 w-4 mr-2" />
                {isEditing ? 'Atualizar' : 'Criar'} Agendamento
              </Button>
              {isEditing && (
                <Button type="button" variant="outline" onClick={resetForm} className="font-poppins">
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-poppins">Agendamentos</CardTitle>
          <CardDescription className="font-poppins">
            Lista de todos os agendamentos cadastrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {agendamentos.length === 0 ? (
            <div className="text-center py-8 text-gray-500 font-poppins">
              Nenhum agendamento encontrado
            </div>
          ) : (
            <div className="space-y-4">
              {agendamentos.map((agendamento) => (
                <div key={agendamento.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-brand-cyan" />
                        <span className="font-medium font-poppins">{agendamento.tutor_nome}</span>
                        {agendamento.tutor_telefone && (
                          <span className="text-sm text-gray-600 font-poppins">• {agendamento.tutor_telefone}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <PawPrint className="h-4 w-4 text-brand-orange" />
                        <span className="font-poppins">{agendamento.pet_nome}</span>
                        {agendamento.pet_raca && (
                          <span className="text-sm text-gray-600 font-poppins">• {agendamento.pet_raca}</span>
                        )}
                        {agendamento.pet_porte && (
                          <span className="text-sm text-gray-600 font-poppins">• {agendamento.pet_porte}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getStatusColor(agendamento.status || 'Agendado')} font-poppins`}>
                        {agendamento.status || 'Agendado'}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(agendamento)}
                        className="font-poppins"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(agendamento.id)}
                        className="text-red-600 hover:text-red-700 font-poppins"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="font-poppins">{new Date(agendamento.data_servico).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="font-poppins">{agendamento.hora_servico}</span>
                    </div>
                    <div className="font-medium font-poppins">
                      {agendamento.servico}
                      {agendamento.valor && (
                        <span className="text-green-600 ml-2">
                          R$ {agendamento.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      )}
                    </div>
                  </div>

                  {agendamento.observacoes && (
                    <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded font-poppins">
                      <strong>Observações:</strong> {agendamento.observacoes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ScheduleManager;
