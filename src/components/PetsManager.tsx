import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Search, Heart, Calendar, Weight, Stethoscope, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePets } from "@/hooks/useSupabase";

const racasComuns = [
  "Cane Corso", "Shiba-Inu", "Akita-Inu", "Husky Siberiano", "Dogo Alemão",
  "Golden Retriever", "Alabay", "American Bully", "Border Collie", "Bull Terrier",
  "Bulldog Francês", "Bulldog Inglês", "Chihuahua", "Chow Chow", "Dogo Argentino",
  "Fila Brasileiro", "Kangal", "Pastor Alemão", "Pastor Belga", "Pastor de Malinoa",
  "Pastor Malemano", "Pincher", "Pit Bull", "Pit Monster", "Presa Canário",
  "Rottweiler Americano", "Rottweiler Inglês", "Sabugio da Bósnia", "Samoieda",
  "São Bernardo", "Schnauzer", "Scottish Terrier"
];

const PetsManager = () => {
  const { toast } = useToast();
  const { pets, loading, error, addPet, updatePet, deletePet } = usePets();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<any>(null);
  const [formData, setFormData] = useState({
    nome_tutor: "",
    nome_pet: "",
    idade: "",
    especie: "",
    raca: "",
    sexo: "",
    porte: "",
    castrado: false,
    peso: "",
    temperamento: "",
    necessidades_especiais: "",
    rotina: "",
    saude: "",
    toma_medicamentos: false,
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

  const filteredPets = pets.filter(pet =>
    pet.nome_pet.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.nome_tutor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (pet.raca && pet.raca.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const resetForm = () => {
    setFormData({
      nome_tutor: "",
      nome_pet: "",
      idade: "",
      especie: "",
      raca: "",
      sexo: "",
      porte: "",
      castrado: false,
      peso: "",
      temperamento: "",
      necessidades_especiais: "",
      rotina: "",
      saude: "",
      toma_medicamentos: false,
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

  const handleEdit = (pet: any) => {
    setEditingPet(pet);
    setFormData({
      nome_tutor: pet.nome_tutor || "",
      nome_pet: pet.nome_pet || "",
      idade: pet.idade?.toString() || "",
      especie: pet.especie || "",
      raca: pet.raca || "",
      sexo: pet.sexo || "",
      porte: pet.porte || "",
      castrado: pet.castrado || false,
      peso: pet.peso?.toString() || "",
      temperamento: pet.temperamento || "",
      necessidades_especiais: pet.necessidades_especiais || "",
      rotina: pet.rotina || "",
      saude: pet.saude || "",
      toma_medicamentos: pet.toma_medicamentos || false,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const petData = {
        nome_tutor: formData.nome_tutor,
        nome_pet: formData.nome_pet,
        idade: parseInt(formData.idade) || null,
        especie: formData.especie,
        raca: formData.raca,
        sexo: formData.sexo,
        porte: formData.porte,
        castrado: formData.castrado,
        peso: parseFloat(formData.peso) || null,
        temperamento: formData.temperamento,
        necessidades_especiais: formData.necessidades_especiais,
        rotina: formData.rotina,
        saude: formData.saude,
        toma_medicamentos: formData.toma_medicamentos,
        medicamentos: formData.medicamentos,
        vacinas_vermifugos: formData.vacinas_vermifugos,
        controle_parasitario: formData.controle_parasitario,
        nome_veterinario: formData.nome_veterinario,
        telefone_veterinario: formData.telefone_veterinario,
        celular_veterinario: formData.celular_veterinario,
        endereco_veterinario: formData.endereco_veterinario,
        cidade_veterinario: formData.cidade_veterinario,
        estado_veterinario: formData.estado_veterinario
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Erro ao carregar pets: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gestão de Pets</h2>
          <p className="text-muted-foreground">Gerencie os dados dos pets cadastrados</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700">
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Pet
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPet ? "Editar Pet" : "Cadastrar Novo Pet"}</DialogTitle>
              <DialogDescription>
                {editingPet ? "Edite os dados do pet." : "Preencha os dados do pet para cadastrá-lo no sistema."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Dados Básicos</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome_tutor">Nome do Tutor</Label>
                    <Input
                      id="nome_tutor"
                      value={formData.nome_tutor}
                      onChange={(e) => setFormData({ ...formData, nome_tutor: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="nome_pet">Nome do Pet</Label>
                    <Input
                      id="nome_pet"
                      value={formData.nome_pet}
                      onChange={(e) => setFormData({ ...formData, nome_pet: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="idade">Idade (anos)</Label>
                    <Input
                      id="idade"
                      type="number"
                      value={formData.idade}
                      onChange={(e) => setFormData({ ...formData, idade: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="especie">Espécie</Label>
                    <Select value={formData.especie} onValueChange={(value) => setFormData({ ...formData, especie: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a espécie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cão">Cão</SelectItem>
                        <SelectItem value="Gato">Gato</SelectItem>
                        <SelectItem value="Pássaro">Pássaro</SelectItem>
                        <SelectItem value="Outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="raca">Raça</Label>
                    <Select value={formData.raca} onValueChange={(value) => setFormData({ ...formData, raca: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a raça" />
                      </SelectTrigger>
                      <SelectContent>
                        {racasComuns.map((raca) => (
                          <SelectItem key={raca} value={raca}>{raca}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="sexo">Sexo</Label>
                    <Select value={formData.sexo} onValueChange={(value) => setFormData({ ...formData, sexo: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o sexo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Macho">Macho</SelectItem>
                        <SelectItem value="Fêmea">Fêmea</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="porte">Porte</Label>
                    <Select value={formData.porte} onValueChange={(value) => setFormData({ ...formData, porte: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o porte" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pequeno">Pequeno</SelectItem>
                        <SelectItem value="Médio">Médio</SelectItem>
                        <SelectItem value="Grande">Grande</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="peso">Peso (kg)</Label>
                    <Input
                      id="peso"
                      type="number"
                      step="0.1"
                      value={formData.peso}
                      onChange={(e) => setFormData({ ...formData, peso: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Label htmlFor="temperamento">Temperamento</Label>
                    <Textarea
                      id="temperamento"
                      value={formData.temperamento}
                      onChange={(e) => setFormData({ ...formData, temperamento: e.target.value })}
                      rows={2}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="necessidades_especiais">Necessidades Especiais</Label>
                    <Textarea
                      id="necessidades_especiais"
                      value={formData.necessidades_especiais}
                      onChange={(e) => setFormData({ ...formData, necessidades_especiais: e.target.value })}
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Dados do Veterinário</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome_veterinario">Nome do Veterinário</Label>
                    <Input
                      id="nome_veterinario"
                      value={formData.nome_veterinario}
                      onChange={(e) => setFormData({ ...formData, nome_veterinario: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefone_veterinario">Telefone do Veterinário</Label>
                    <Input
                      id="telefone_veterinario"
                      value={formData.telefone_veterinario}
                      onChange={(e) => setFormData({ ...formData, telefone_veterinario: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="celular_veterinario">Celular do Veterinário</Label>
                    <Input
                      id="celular_veterinario"
                      value={formData.celular_veterinario}
                      onChange={(e) => setFormData({ ...formData, celular_veterinario: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cidade_veterinario">Cidade do Veterinário</Label>
                    <Input
                      id="cidade_veterinario"
                      value={formData.cidade_veterinario}
                      onChange={(e) => setFormData({ ...formData, cidade_veterinario: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="endereco_veterinario">Endereço do Veterinário</Label>
                    <Input
                      id="endereco_veterinario"
                      value={formData.endereco_veterinario}
                      onChange={(e) => setFormData({ ...formData, endereco_veterinario: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full">
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
              <CardTitle>Pets Cadastrados</CardTitle>
              <CardDescription>{pets.length} pets no sistema</CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar pet..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredPets.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhum pet encontrado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPets.map((pet) => (
                <Card key={pet.id} className="hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Heart className="h-5 w-5 text-pink-500" />
                        {pet.nome_pet}
                      </CardTitle>
                      {pet.porte && (
                        <Badge variant={pet.porte === "Grande" ? "default" : pet.porte === "Médio" ? "secondary" : "outline"}>
                          {pet.porte}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">Tutor: {pet.nome_tutor}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {pet.idade && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-blue-500" />
                          {pet.idade} anos
                        </div>
                      )}
                      {pet.peso && (
                        <div className="flex items-center gap-1">
                          <Weight className="h-4 w-4 text-green-500" />
                          {pet.peso}kg
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{pet.especie} - {pet.raca}</p>
                      <p className="text-xs text-muted-foreground">{pet.sexo} • {pet.castrado ? "Castrado" : "Não castrado"}</p>
                    </div>
                    {pet.toma_medicamentos && (
                      <Badge variant="outline" className="text-xs">
                        <Stethoscope className="h-3 w-3 mr-1" />
                        Medicamentos
                      </Badge>
                    )}
                    {pet.temperamento && (
                      <p className="text-xs text-muted-foreground line-clamp-2">{pet.temperamento}</p>
                    )}
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(pet)}>
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
