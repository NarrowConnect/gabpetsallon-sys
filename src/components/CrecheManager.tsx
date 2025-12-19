import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Calendar, 
  Dog, 
  Plus, 
  FileText, 
  Upload, 
  Trash2, 
  Eye, 
  Download, 
  Link, 
  Copy,
  CheckCircle,
  X,
  Users,
  Edit,
  Search,
  Phone,
  ChevronLeft,
  ChevronRight,
  Clock,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { useCreche, CrecheAgendamentoInsert, CrecheAgendamento } from '@/hooks/useCreche';
import { usePets } from '@/hooks/usePets';
import { useTutors } from '@/hooks/useTutors';
import { format, parseISO, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isToday, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function CrecheManager() {
  const { 
    agendamentos, 
    documentos, 
    loading, 
    addAgendamento, 
    updateAgendamento, 
    deleteAgendamento,
    uploadDocumento,
    deleteDocumento,
    getAgendamentosAtivos 
  } = useCreche();
  
  const { pets } = usePets();
  const { tutors } = useTutors();
  
  const [activeTab, setActiveTab] = useState('calendario');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDocDialog, setShowDocDialog] = useState(false);
  const [showDayDialog, setShowDayDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedAgendamento, setSelectedAgendamento] = useState<CrecheAgendamento | null>(null);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [agendamentoToDelete, setAgendamentoToDelete] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'ativo' | 'finalizado'>('todos');
  
  const [formData, setFormData] = useState<CrecheAgendamentoInsert>({
    pet_nome: '',
    tutor_nome: '',
    tutor_telefone: '',
    data_entrada: format(new Date(), 'yyyy-MM-dd'),
    data_saida: '',
    observacoes: ''
  });

  const [editFormData, setEditFormData] = useState<Partial<CrecheAgendamento>>({});

  const resetForm = () => {
    setFormData({
      pet_nome: '',
      tutor_nome: '',
      tutor_telefone: '',
      data_entrada: format(new Date(), 'yyyy-MM-dd'),
      data_saida: '',
      observacoes: ''
    });
    setSelectedAgendamento(null);
  };

  const handlePetSelect = (petId: string) => {
    const pet = pets.find(p => p.id === petId);
    if (pet) {
      const tutor = tutors.find(t => t.nome === pet.nome_tutor);
      setFormData(prev => ({
        ...prev,
        pet_id: petId,
        pet_nome: pet.nome_pet,
        tutor_nome: pet.nome_tutor,
        tutor_telefone: tutor?.celular || ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.pet_nome || !formData.tutor_nome || !formData.data_entrada) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    const result = await addAgendamento({
      ...formData,
      status: 'ativo'
    });

    if (result) {
      setShowAddDialog(false);
      resetForm();
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgendamento) return;

    const result = await updateAgendamento(selectedAgendamento.id, editFormData);
    if (result) {
      setShowEditDialog(false);
      setSelectedAgendamento(null);
      setEditFormData({});
    }
  };

  const handleOpenEdit = (ag: CrecheAgendamento) => {
    setSelectedAgendamento(ag);
    setEditFormData({
      pet_nome: ag.pet_nome,
      tutor_nome: ag.tutor_nome,
      tutor_telefone: ag.tutor_telefone,
      data_entrada: ag.data_entrada,
      data_saida: ag.data_saida,
      observacoes: ag.observacoes,
      status: ag.status
    });
    setShowEditDialog(true);
  };

  const handleFinalizarCreche = async (id: string) => {
    await updateAgendamento(id, {
      status: 'finalizado',
      data_saida: format(new Date(), 'yyyy-MM-dd')
    });
    toast.success('Pet finalizado da creche!');
  };

  const handleReativarCreche = async (id: string) => {
    await updateAgendamento(id, {
      status: 'ativo',
      data_saida: null
    });
    toast.success('Pet reativado na creche!');
  };

  const handleConfirmDelete = async () => {
    if (agendamentoToDelete) {
      await deleteAgendamento(agendamentoToDelete);
      setShowDeleteConfirm(false);
      setAgendamentoToDelete(null);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedAgendamento || !e.target.files?.length) return;
    
    const file = e.target.files[0];
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!allowedTypes.includes(file.type)) {
      toast.error('Apenas arquivos PDF e Word são permitidos');
      return;
    }

    await uploadDocumento(file, selectedAgendamento.id, selectedAgendamento.pet_id);
    e.target.value = '';
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('Link copiado!');
  };

  const openWhatsApp = (phone: string | null) => {
    if (!phone) {
      toast.error('Telefone não cadastrado');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/55${cleanPhone}`, '_blank');
  };

  // Calendar logic
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getAgendamentosForDay = (day: Date) => {
    return agendamentos.filter(a => {
      const entrada = parseISO(a.data_entrada);
      const saida = a.data_saida ? parseISO(a.data_saida) : new Date();
      return day >= entrada && day <= saida && a.status === 'ativo';
    });
  };

  const handleDayClick = (day: Date) => {
    setSelectedDay(day);
    setShowDayDialog(true);
  };

  const agendamentosDocsForPet = (agendamentoId: string) => {
    return documentos.filter(d => d.creche_agendamento_id === agendamentoId);
  };

  const agendamentosAtivos = getAgendamentosAtivos();

  // Filtered agendamentos for table
  const filteredAgendamentos = useMemo(() => {
    return agendamentos.filter(ag => {
      const matchesSearch = 
        ag.pet_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ag.tutor_nome.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = 
        statusFilter === 'todos' || ag.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [agendamentos, searchTerm, statusFilter]);

  const getDaysInCreche = (ag: CrecheAgendamento) => {
    const entrada = parseISO(ag.data_entrada);
    const saida = ag.data_saida ? parseISO(ag.data_saida) : new Date();
    return differenceInDays(saida, entrada) + 1;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Dog className="h-7 w-7 text-brand-cyan" />
            Gestão de Creche
          </h1>
          <p className="text-muted-foreground">
            {agendamentosAtivos.length} pet(s) na creche hoje
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Adicionar Pet
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calendario" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Calendário
          </TabsTrigger>
          <TabsTrigger value="hospedados" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Fichas e Documentos
          </TabsTrigger>
        </TabsList>

        {/* Calendário */}
        <TabsContent value="calendario" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="capitalize">
                  {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
                </CardTitle>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setCurrentMonth(prev => subMonths(prev, 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCurrentMonth(new Date())}
                  >
                    Hoje
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setCurrentMonth(prev => addMonths(prev, 1))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Cabeçalho dos dias */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Dias do mês */}
              <div className="grid grid-cols-7 gap-1">
                {/* Dias vazios antes do início do mês */}
                {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                  <div key={`empty-${i}`} className="min-h-[100px] p-1 bg-muted/30 rounded" />
                ))}

                {/* Dias do mês */}
                {calendarDays.map(day => {
                  const dayAgendamentos = getAgendamentosForDay(day);
                  const isCurrentDay = isToday(day);
                  const hasPets = dayAgendamentos.length > 0;

                  return (
                    <div 
                      key={day.toISOString()} 
                      className={`min-h-[100px] p-1 border rounded cursor-pointer transition-all hover:shadow-md hover:border-brand-cyan/50 ${
                        isCurrentDay ? 'bg-brand-cyan/10 border-brand-cyan' : 'bg-card'
                      } ${hasPets ? 'border-brand-yellow/50' : ''}`}
                      onClick={() => handleDayClick(day)}
                    >
                      <div className={`text-sm font-medium mb-1 ${isCurrentDay ? 'text-brand-cyan' : ''}`}>
                        {format(day, 'd')}
                      </div>
                      <div className="space-y-1">
                        {dayAgendamentos.slice(0, 2).map(ag => (
                          <div 
                            key={ag.id}
                            className="text-xs bg-brand-yellow/20 text-foreground px-1 py-0.5 rounded truncate flex items-center gap-1"
                            title={`${ag.pet_nome} - ${ag.tutor_nome}`}
                          >
                            🐕 {ag.pet_nome}
                          </div>
                        ))}
                        {dayAgendamentos.length > 2 && (
                          <div className="text-xs text-brand-cyan font-medium">
                            +{dayAgendamentos.length - 2} mais
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Lista de pets ativos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Pets na Creche Agora ({agendamentosAtivos.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {agendamentosAtivos.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Dog className="h-16 w-16 mx-auto mb-4 opacity-20" />
                  <p>Nenhum pet na creche no momento</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setShowAddDialog(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Pet
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {agendamentosAtivos.map(ag => (
                    <Card key={ag.id} className="bg-card hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold flex items-center gap-2">
                              🐕 {ag.pet_nome}
                              <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                Ativo
                              </Badge>
                            </h3>
                            <p className="text-sm text-muted-foreground">{ag.tutor_nome}</p>
                            {ag.tutor_telefone && (
                              <button 
                                onClick={() => openWhatsApp(ag.tutor_telefone)}
                                className="text-xs text-brand-cyan hover:underline flex items-center gap-1 mt-1"
                              >
                                <Phone className="h-3 w-3" />
                                {ag.tutor_telefone}
                              </button>
                            )}
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                              <Clock className="h-3 w-3" />
                              {getDaysInCreche(ag)} dia(s) na creche
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Desde: {format(parseISO(ag.data_entrada), 'dd/MM/yyyy')}
                            </p>
                            {ag.observacoes && (
                              <p className="text-xs text-muted-foreground mt-1 italic line-clamp-2">
                                📝 {ag.observacoes}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col gap-1">
                            <Button 
                              size="icon" 
                              variant="ghost"
                              onClick={() => handleOpenEdit(ag)}
                              title="Editar"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost"
                              onClick={() => {
                                setSelectedAgendamento(ag);
                                setShowDocDialog(true);
                              }}
                              title="Documentos"
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost"
                              className="text-green-600 hover:text-green-700 hover:bg-green-100"
                              onClick={() => handleFinalizarCreche(ag.id)}
                              title="Finalizar"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => {
                                setAgendamentoToDelete(ag.id);
                                setShowDeleteConfirm(true);
                              }}
                              title="Excluir"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fichas e Documentos */}
        <TabsContent value="hospedados" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Hospedagens</CardTitle>
              <CardDescription>
                Visualize todos os pets que passaram pela creche e seus documentos
              </CardDescription>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por pet ou tutor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={(v: 'todos' | 'ativo' | 'finalizado') => setStatusFilter(v)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="ativo">Ativos</SelectItem>
                    <SelectItem value="finalizado">Finalizados</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {filteredAgendamentos.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-16 w-16 mx-auto mb-4 opacity-20" />
                  <p>Nenhum registro encontrado</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Pet</TableHead>
                        <TableHead>Tutor</TableHead>
                        <TableHead>Entrada</TableHead>
                        <TableHead>Saída</TableHead>
                        <TableHead>Dias</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Docs</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAgendamentos.map(ag => {
                        const docs = agendamentosDocsForPet(ag.id);
                        return (
                          <TableRow key={ag.id} className="hover:bg-muted/50">
                            <TableCell className="font-medium">
                              🐕 {ag.pet_nome}
                            </TableCell>
                            <TableCell>
                              <div>
                                <p>{ag.tutor_nome}</p>
                                {ag.tutor_telefone && (
                                  <button 
                                    onClick={() => openWhatsApp(ag.tutor_telefone)}
                                    className="text-xs text-brand-cyan hover:underline flex items-center gap-1"
                                  >
                                    <Phone className="h-3 w-3" />
                                    {ag.tutor_telefone}
                                  </button>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{format(parseISO(ag.data_entrada), 'dd/MM/yyyy')}</TableCell>
                            <TableCell>
                              {ag.data_saida ? format(parseISO(ag.data_saida), 'dd/MM/yyyy') : '-'}
                            </TableCell>
                            <TableCell>{getDaysInCreche(ag)}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={ag.status === 'ativo' ? 'default' : 'secondary'}
                                className={ag.status === 'ativo' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : ''}
                              >
                                {ag.status === 'ativo' ? 'Na Creche' : 'Finalizado'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{docs.length}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleOpenEdit(ag)}
                                  title="Editar"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => {
                                    setSelectedAgendamento(ag);
                                    setShowDocDialog(true);
                                  }}
                                  title="Ver ficha"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {ag.status === 'ativo' ? (
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="text-green-600"
                                    onClick={() => handleFinalizarCreche(ag.id)}
                                    title="Finalizar"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                ) : (
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="text-brand-cyan"
                                    onClick={() => handleReativarCreche(ag.id)}
                                    title="Reativar"
                                  >
                                    <Dog className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="text-destructive"
                                  onClick={() => {
                                    setAgendamentoToDelete(ag.id);
                                    setShowDeleteConfirm(true);
                                  }}
                                  title="Excluir"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog para adicionar pet */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adicionar Pet à Creche</DialogTitle>
            <DialogDescription>
              Registre um novo pet na creche
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Selecionar Pet Cadastrado</Label>
              <Select onValueChange={handlePetSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um pet..." />
                </SelectTrigger>
                <SelectContent>
                  {pets.map(pet => (
                    <SelectItem key={pet.id} value={pet.id}>
                      {pet.nome_pet} - {pet.nome_tutor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pet_nome">Nome do Pet *</Label>
                <Input
                  id="pet_nome"
                  value={formData.pet_nome}
                  onChange={e => setFormData(prev => ({ ...prev, pet_nome: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="tutor_nome">Nome do Tutor *</Label>
                <Input
                  id="tutor_nome"
                  value={formData.tutor_nome}
                  onChange={e => setFormData(prev => ({ ...prev, tutor_nome: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tutor_telefone">Telefone</Label>
                <Input
                  id="tutor_telefone"
                  value={formData.tutor_telefone || ''}
                  onChange={e => setFormData(prev => ({ ...prev, tutor_telefone: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="data_entrada">Data de Entrada *</Label>
                <Input
                  id="data_entrada"
                  type="date"
                  value={formData.data_entrada}
                  onChange={e => setFormData(prev => ({ ...prev, data_entrada: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes || ''}
                onChange={e => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                placeholder="Informações importantes sobre o pet..."
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => {
                setShowAddDialog(false);
                resetForm();
              }}>
                Cancelar
              </Button>
              <Button type="submit">Adicionar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog para editar pet */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Agendamento</DialogTitle>
            <DialogDescription>
              Altere as informações do pet na creche
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit_pet_nome">Nome do Pet</Label>
                <Input
                  id="edit_pet_nome"
                  value={editFormData.pet_nome || ''}
                  onChange={e => setEditFormData(prev => ({ ...prev, pet_nome: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="edit_tutor_nome">Nome do Tutor</Label>
                <Input
                  id="edit_tutor_nome"
                  value={editFormData.tutor_nome || ''}
                  onChange={e => setEditFormData(prev => ({ ...prev, tutor_nome: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit_tutor_telefone">Telefone</Label>
                <Input
                  id="edit_tutor_telefone"
                  value={editFormData.tutor_telefone || ''}
                  onChange={e => setEditFormData(prev => ({ ...prev, tutor_telefone: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="edit_status">Status</Label>
                <Select 
                  value={editFormData.status || ''} 
                  onValueChange={v => setEditFormData(prev => ({ ...prev, status: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="finalizado">Finalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit_data_entrada">Data de Entrada</Label>
                <Input
                  id="edit_data_entrada"
                  type="date"
                  value={editFormData.data_entrada || ''}
                  onChange={e => setEditFormData(prev => ({ ...prev, data_entrada: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="edit_data_saida">Data de Saída</Label>
                <Input
                  id="edit_data_saida"
                  type="date"
                  value={editFormData.data_saida || ''}
                  onChange={e => setEditFormData(prev => ({ ...prev, data_saida: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit_observacoes">Observações</Label>
              <Textarea
                id="edit_observacoes"
                value={editFormData.observacoes || ''}
                onChange={e => setEditFormData(prev => ({ ...prev, observacoes: e.target.value }))}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog para ver pets do dia */}
      <Dialog open={showDayDialog} onOpenChange={setShowDayDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedDay && format(selectedDay, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </DialogTitle>
            <DialogDescription>
              Pets na creche neste dia
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[400px]">
            {selectedDay && getAgendamentosForDay(selectedDay).length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Dog className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>Nenhum pet na creche neste dia</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDay && getAgendamentosForDay(selectedDay).map(ag => (
                  <Card key={ag.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold flex items-center gap-2">
                            🐕 {ag.pet_nome}
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              Ativo
                            </Badge>
                          </h4>
                          <p className="text-sm text-muted-foreground">{ag.tutor_nome}</p>
                          {ag.tutor_telefone && (
                            <button 
                              onClick={() => openWhatsApp(ag.tutor_telefone)}
                              className="text-xs text-brand-cyan hover:underline flex items-center gap-1"
                            >
                              <Phone className="h-3 w-3" />
                              {ag.tutor_telefone}
                            </button>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            Entrada: {format(parseISO(ag.data_entrada), 'dd/MM/yyyy')}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            size="icon" 
                            variant="ghost"
                            onClick={() => {
                              setShowDayDialog(false);
                              handleOpenEdit(ag);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost"
                            onClick={() => {
                              setShowDayDialog(false);
                              setSelectedAgendamento(ag);
                              setShowDocDialog(true);
                            }}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
          <DialogFooter>
            <Button 
              onClick={() => {
                setShowDayDialog(false);
                if (selectedDay) {
                  setFormData(prev => ({
                    ...prev,
                    data_entrada: format(selectedDay, 'yyyy-MM-dd')
                  }));
                }
                setShowAddDialog(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar neste dia
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para documentos */}
      <Dialog open={showDocDialog} onOpenChange={setShowDocDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Ficha de {selectedAgendamento?.pet_nome}
            </DialogTitle>
            <DialogDescription>
              Visualize informações e gerencie documentos
            </DialogDescription>
          </DialogHeader>

          {selectedAgendamento && (
            <div className="space-y-6">
              {/* Informações do Pet */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Informações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Pet</Label>
                      <p className="font-medium">🐕 {selectedAgendamento.pet_nome}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Tutor</Label>
                      <p className="font-medium">{selectedAgendamento.tutor_nome}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Telefone</Label>
                      {selectedAgendamento.tutor_telefone ? (
                        <button 
                          onClick={() => openWhatsApp(selectedAgendamento.tutor_telefone)}
                          className="text-brand-cyan hover:underline flex items-center gap-1"
                        >
                          <Phone className="h-3 w-3" />
                          {selectedAgendamento.tutor_telefone}
                        </button>
                      ) : (
                        <p>-</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Status</Label>
                      <Badge 
                        variant={selectedAgendamento.status === 'ativo' ? 'default' : 'secondary'}
                        className={selectedAgendamento.status === 'ativo' ? 'bg-green-100 text-green-700' : ''}
                      >
                        {selectedAgendamento.status === 'ativo' ? 'Na Creche' : 'Finalizado'}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Entrada</Label>
                      <p>{format(parseISO(selectedAgendamento.data_entrada), 'dd/MM/yyyy')}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Saída</Label>
                      <p>{selectedAgendamento.data_saida ? format(parseISO(selectedAgendamento.data_saida), 'dd/MM/yyyy') : '-'}</p>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-xs text-muted-foreground">Dias na Creche</Label>
                      <p className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {getDaysInCreche(selectedAgendamento)} dia(s)
                      </p>
                    </div>
                  </div>
                  {selectedAgendamento.observacoes && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Observações</Label>
                      <p className="text-sm bg-muted/50 p-2 rounded">{selectedAgendamento.observacoes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Upload de Documentos */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Documentos
                  </CardTitle>
                  <CardDescription>
                    Envie PDFs ou documentos Word relacionados ao pet
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="flex-1"
                    />
                  </div>

                  {/* Lista de documentos */}
                  <div className="space-y-2">
                    {agendamentosDocsForPet(selectedAgendamento.id).length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Nenhum documento anexado
                      </p>
                    ) : (
                      agendamentosDocsForPet(selectedAgendamento.id).map(doc => (
                        <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-brand-cyan" />
                            <div>
                              <p className="font-medium text-sm">{doc.nome_arquivo}</p>
                              <p className="text-xs text-muted-foreground">
                                {doc.created_at && format(parseISO(doc.created_at), 'dd/MM/yyyy HH:mm')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => copyToClipboard(doc.url_arquivo)}
                              title="Copiar link"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => window.open(doc.url_arquivo, '_blank')}
                              title="Visualizar"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = doc.url_arquivo;
                                link.download = doc.nome_arquivo;
                                link.click();
                              }}
                              title="Download"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => deleteDocumento(doc.id, doc.url_arquivo)}
                              title="Excluir"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Link público */}
                  {agendamentosDocsForPet(selectedAgendamento.id).length > 0 && (
                    <div className="pt-4 border-t">
                      <Label className="text-xs text-muted-foreground">Link público para compartilhar</Label>
                      <div className="flex gap-2 mt-1">
                        <Input 
                          value={agendamentosDocsForPet(selectedAgendamento.id)[0]?.url_arquivo || ''} 
                          readOnly 
                          className="text-xs"
                        />
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => copyToClipboard(agendamentosDocsForPet(selectedAgendamento.id)[0]?.url_arquivo || '')}
                        >
                          <Link className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Este link pode ser acessado por qualquer pessoa, mesmo sem login
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmação de exclusão */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Confirmar Exclusão
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
