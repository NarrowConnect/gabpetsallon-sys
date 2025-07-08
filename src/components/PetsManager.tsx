
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle, Search, Edit, Trash2, Heart, User, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePets, useTutors } from "@/hooks/useSupabase";

const PetsManager = () => {
  const { toast } = useToast();
  const { pets, loading, error, addPet, updatePet, deletePet } = usePets();
  const { tutors, addTutor } = useTutors();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNewTutorDialogOpen, setIsNewTutorDialogOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<any>(null);
  const [formData, setFormData] = useState({
    nome_tutor: "",
    tutor_id: "",
    nome_pet: "",
    especie: "Cão",
    raca: "",
    sexo: "",
    porte: "",
    idade: "",
    peso: "",
    castrado: false,
    toma_medicamentos: false,
    temperamento: "",
    necessidades_especiais: "",
    rotina: "",
    saude: "",
    medicamentos: "",
    vacinas_vermifugos: "",
    controle_parasitario: "",
    nome_veterinario: "",
    telefone_veterinario: "",
    celular_veterinario: "",
    endereco_veterinario: "",
    cidade_veterinario: "",
    estado_veterinario: ""
  });

  const [newTutorData, setNewTutorData] = useState({
    nome: "",
    celular: "",
    endereco: "",
    cidade: "",
    estado: ""
  });

  const filteredPets = pets.filter(pet =>
    pet.nome_pet.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.nome_tutor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (pet.raca && pet.raca.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const resetForm = () => {
    setFormData({
      nome_tutor: "",
      tutor_id: "",
      nome_pet: "",
      especie: "Cão",
      raca: "",
      sexo: "",
      porte: "",
      idade: "",
      peso: "",
      castrado: false,
      toma_medicamentos: false,
      temperamento: "",
      necessidades_especiais: "",
      rotina: "",
      saude: "",
      medicamentos: "",
      vacinas_vermifugos: "",
      controle_parasitario: "",
      nome_veterinario: "",
      telefone_veterinario: "",
      celular_veterinario: "",
      endereco_veterinario: "",
      cidade_veterinario: "",
      estado_veterinario: ""
    });
    setEditingPet(null);
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

  const handleCreateNewTutor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newTutor = await addTutor(newTutorData);
      
      // Atualizar o form de pet com o novo tutor
      setFormData({
        ...formData,
        tutor_id: newTutor.id,
        nome_tutor: newTutor.nome
      });
      
      resetNewTutorForm();
      setIsNewTutorDialogOpen(false);
      
      toast({
        title: "Tutor criado com sucesso!",
        description: `${newTutorData.nome} foi adicionado. Você pode completar os dados na aba Tutores.`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar o tutor.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (pet: any) => {
    setEditingPet(pet);
    setFormData({
      nome_tutor: pet.nome_tutor || "",
      tutor_id: pet.tutor_id || "",
      nome_pet: pet.nome_pet || "",
      especie: pet.especie || "Cão",
      raca: pet.raca || "",
      sexo: pet.sexo || "",
      porte: pet.porte || "",
      idade: pet.idade?.toString() || "",
      peso: pet.peso?.toString() || "",
      castrado: pet.castrado || false,
      toma_medicamentos: pet.toma_medicamentos || false,
      temperamento: pet.temperamento || "",
      necessidades_especiais: pet.necessidades_especiais || "",
      rotina: pet.rotina || "",
      saude: pet.saude || "",
      medicamentos: pet.medicamentos || "",
      vacinas_vermifugos: pet.vacinas_vermifugos || "",
      controle_parasitario: pet.controle_parasitario || "",
      nome_veterinario: pet.nome_veterinario || "",
      telefone_veterinario: pet.telefone_veterinario || "",
      celular_veterinario: pet.celular_veterinario || "",
      endereco_veterinario: pet.endereco_veterinario || "",
      cidade_veterinario: pet.cidade_veterinario || "",
      estado_veterinario: pet.estado_veterinario || ""
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const petData = {
        ...formData,
        idade: formData.idade ? parseInt(formData.idade) : null,
        peso: formData.peso ? parseFloat(formData.peso) : null,
      };

      if (editingPet) {
        await updatePet(editingPet.id, petData);
        toast({
          title: "Pet atualizado com sucesso!",
          description: `${formData.nome_pet} foi atualizado no sistema.`,
        });
      } else {
        await addPet(petData);
        toast({
          title: "Pet cadastrado com sucesso!",
          description: `${formData.nome_pet} foi adicionado ao sistema.`,
        });
      }
      
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o pet.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePet(id);
      toast({
        title: "Pet removido",
        description: "O pet foi removido do sistema.",
        variant: "destructive"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao remover o pet.",
        variant: "destructive"
      });
    }
  };

  const handleTutorSelect = (tutorId: string) => {
    const selectedTutor = tutors.find(t => t.id === tutorId);
    if (selectedTutor) {
      setFormData({
        ...formData,
        tutor_id: tutorId,
        nome_tutor: selectedTutor.nome
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 font-poppins">Erro ao carregar pets: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-poppins">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 font-poppins">Gestão de Pets</h2>
          <p className="text-muted-foreground font-poppins">Gerencie os dados dos pets cadastrados</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 font-poppins">
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Pet
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-poppins">{editingPet ? "Editar Pet" : "Cadastrar Novo Pet"}</DialogTitle>
              <DialogDescription className="font-poppins">
                {editingPet ? "Edite os dados do pet." : "Preencha os dados do pet para cadastrá-lo no sistema."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Seção Tutor */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold font-poppins">Dados do Tutor</h3>
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
                          Dados básicos do tutor. Você pode completar as informações na aba Tutores.
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
                        <div>
                          <Label htmlFor="new-tutor-endereco" className="font-poppins">Endereço</Label>
                          <Input
                            id="new-tutor-endereco"
                            value={newTutorData.endereco}
                            onChange={(e) => setNewTutorData({ ...newTutorData, endereco: e.target.value })}
                            className="font-poppins"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="new-tutor-cidade" className="font-poppins">Cidade</Label>
                            <Input
                              id="new-tutor-cidade"
                              value={newTutorData.cidade}
                              onChange={(e) => setNewTutorData({ ...newTutorData, cidade: e.target.value })}
                              className="font-poppins"
                            />
                          </div>
                          <div>
                            <Label htmlFor="new-tutor-estado" className="font-poppins">Estado</Label>
                            <Input
                              id="new-tutor-estado"
                              value={newTutorData.estado}
                              onChange={(e) => setNewTutorData({ ...newTutorData, estado: e.target.value })}
                              placeholder="PR"
                              className="font-poppins"
                            />
                          </div>
                        </div>
                        <Button type="submit" className="w-full font-poppins">
                          Criar Tutor
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
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
                  {formData.nome_tutor && (
                    <div>
                      <Label className="font-poppins">Tutor Selecionado</Label>
                      <div className="p-2 bg-muted rounded-md">
                        <p className="font-medium font-poppins">{formData.nome_tutor}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Seção Pet - Dados Básicos */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold font-poppins">Dados Básicos do Pet</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome_pet" className="font-poppins">Nome do Pet</Label>
                    <Input
                      id="nome_pet"
                      value={formData.nome_pet}
                      onChange={(e) => setFormData({ ...formData, nome_pet: e.target.value })}
                      required
                      className="font-poppins"
                    />
                  </div>
                  <div>
                    <Label htmlFor="especie" className="font-poppins">Espécie</Label>
                    <Select value={formData.especie} onValueChange={(value) => setFormData({ ...formData, especie: value })}>
                      <SelectTrigger className="font-poppins">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cão" className="font-poppins">Cão</SelectItem>
                        <SelectItem value="Gato" className="font-poppins">Gato</SelectItem>
                        <SelectItem value="Outros" className="font-poppins">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="raca" className="font-poppins">Raça</Label>
                    <Input
                      id="raca"
                      value={formData.raca}
                      onChange={(e) => setFormData({ ...formData, raca: e.target.value })}
                      className="font-poppins"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sexo" className="font-poppins">Sexo</Label>
                    <Select value={formData.sexo} onValueChange={(value) => setFormData({ ...formData, sexo: value })}>
                      <SelectTrigger className="font-poppins">
                        <SelectValue placeholder="Selecione o sexo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Macho" className="font-poppins">Macho</SelectItem>
                        <SelectItem value="Fêmea" className="font-poppins">Fêmea</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="porte" className="font-poppins">Porte</Label>
                    <Select value={formData.porte} onValueChange={(value) => setFormData({ ...formData, porte: value })}>
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
                    <Label htmlFor="idade" className="font-poppins">Idade (anos)</Label>
                    <Input
                      id="idade"
                      type="number"
                      value={formData.idade}
                      onChange={(e) => setFormData({ ...formData, idade: e.target.value })}
                      className="font-poppins"
                    />
                  </div>
                  <div>
                    <Label htmlFor="peso" className="font-poppins">Peso (kg)</Label>
                    <Input
                      id="peso"
                      type="number"
                      step="0.1"
                      value={formData.peso}
                      onChange={(e) => setFormData({ ...formData, peso: e.target.value })}
                      className="font-poppins"
                    />
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="castrado"
                      checked={formData.castrado}
                      onCheckedChange={(checked) => setFormData({ ...formData, castrado: checked as boolean })}
                    />
                    <Label htmlFor="castrado" className="font-poppins">Castrado</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="toma_medicamentos"
                      checked={formData.toma_medicamentos}
                      onCheckedChange={(checked) => setFormData({ ...formData, toma_medicamentos: checked as boolean })}
                    />
                    <Label htmlFor="toma_medicamentos" className="font-poppins">Toma Medicamentos</Label>
                  </div>
                </div>
              </div>

              {/* Seção Informações Adicionais */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold font-poppins">Informações Adicionais</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="temperamento" className="font-poppins">Temperamento</Label>
                    <Textarea
                      id="temperamento"
                      value={formData.temperamento}
                      onChange={(e) => setFormData({ ...formData, temperamento: e.target.value })}
                      rows={2}
                      className="font-poppins"
                    />
                  </div>
                  <div>
                    <Label htmlFor="necessidades_especiais" className="font-poppins">Necessidades Especiais</Label>
                    <Textarea
                      id="necessidades_especiais"
                      value={formData.necessidades_especiais}
                      onChange={(e) => setFormData({ ...formData, necessidades_especiais: e.target.value })}
                      rows={2}
                      className="font-poppins"
                    />
                  </div>
                  <div>
                    <Label htmlFor="rotina" className="font-poppins">Rotina</Label>
                    <Textarea
                      id="rotina"
                      value={formData.rotina}
                      onChange={(e) => setFormData({ ...formData, rotina: e.target.value })}
                      rows={2}
                      className="font-poppins"
                    />
                  </div>
                </div>
              </div>

              {/* Seção Saúde */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold font-poppins">Informações de Saúde</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="saude" className="font-poppins">Estado de Saúde</Label>
                    <Textarea
                      id="saude"
                      value={formData.saude}
                      onChange={(e) => setFormData({ ...formData, saude: e.target.value })}
                      rows={2}
                      className="font-poppins"
                    />
                  </div>
                  {formData.toma_medicamentos && (
                    <div>
                      <Label htmlFor="medicamentos" className="font-poppins">Medicamentos</Label>
                      <Textarea
                        id="medicamentos"
                        value={formData.medicamentos}
                        onChange={(e) => setFormData({ ...formData, medicamentos: e.target.value })}
                        rows={2}
                        className="font-poppins"
                      />
                    </div>
                  )}
                  <div>
                    <Label htmlFor="vacinas_vermifugos" className="font-poppins">Vacinas e Vermífugos</Label>
                    <Textarea
                      id="vacinas_vermifugos"
                      value={formData.vacinas_vermifugos}
                      onChange={(e) => setFormData({ ...formData, vacinas_vermifugos: e.target.value })}
                      rows={2}
                      className="font-poppins"
                    />
                  </div>
                  <div>
                    <Label htmlFor="controle_parasitario" className="font-poppins">Controle Parasitário</Label>
                    <Textarea
                      id="controle_parasitario"
                      value={formData.controle_parasitario}
                      onChange={(e) => setFormData({ ...formData, controle_parasitario: e.target.value })}
                      rows={2}
                      className="font-poppins"
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full font-poppins">
                {editingPet ? "Atualizar Pet" : "Cadastrar Pet"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="font-poppins">Pets Cadastrados</CardTitle>
              <CardDescription className="font-poppins">{pets.length} pets no sistema</CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar pet, tutor ou raça..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64 font-poppins"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredPets.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground font-poppins">Nenhum pet encontrado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPets.map((pet) => (
                <Card key={pet.id} className="hover:shadow-lg transition-all duration-300 bg-white/80">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-poppins flex items-center gap-2">
                      <Heart className="h-5 w-5 text-pink-500" />
                      {pet.nome_pet}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span className="font-poppins">{pet.nome_tutor}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm space-y-1">
                      <p className="font-poppins"><span className="font-medium">Espécie:</span> {pet.especie}</p>
                      {pet.raca && <p className="font-poppins"><span className="font-medium">Raça:</span> {pet.raca}</p>}
                      {pet.porte && <p className="font-poppins"><span className="font-medium">Porte:</span> {pet.porte}</p>}
                      {pet.idade && <p className="font-poppins"><span className="font-medium">Idade:</span> {pet.idade} anos</p>}
                      {pet.peso && <p className="font-poppins"><span className="font-medium">Peso:</span> {pet.peso}kg</p>}
                    </div>
                    
                    {(pet.castrado || pet.toma_medicamentos) && (
                      <div className="flex gap-2 text-xs">
                        {pet.castrado && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded font-poppins">Castrado</span>
                        )}
                        {pet.toma_medicamentos && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-poppins">Medicamento</span>
                        )}
                      </div>
                    )}
                    
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1 font-poppins" onClick={() => handleEdit(pet)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(pet.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PetsManager;
