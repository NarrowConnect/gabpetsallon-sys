
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Search, Heart, Calendar, Weight, Stethoscope } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Pet {
  id: string;
  nomeTutor: string;
  nomePet: string;
  idade: number;
  especie: string;
  raca: string;
  sexo: string;
  porte: string;
  castrado: boolean;
  peso: number;
  temperamento: string;
  necessidadesEspeciais: string;
  rotina: string;
  saude: string;
  tomaMedicamentos: boolean;
  medicamentos: string;
  vacinasVermifugos: string;
  controleParasitario: string;
}

const PetsManager = () => {
  const { toast } = useToast();
  const [pets, setPets] = useState<Pet[]>([
    {
      id: "1",
      nomeTutor: "Maria Silva",
      nomePet: "Rex",
      idade: 3,
      especie: "Cão",
      raca: "Golden Retriever",
      sexo: "Macho",
      porte: "Grande",
      castrado: true,
      peso: 32.5,
      temperamento: "Dócil e brincalhão",
      necessidadesEspeciais: "Nenhuma",
      rotina: "Passeio 2x ao dia",
      saude: "Boa",
      tomaMedicamentos: false,
      medicamentos: "",
      vacinasVermifugos: "2024-01-15",
      controleParasitario: "2024-02-10"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    nomeTutor: "",
    nomePet: "",
    idade: "",
    especie: "",
    raca: "",
    sexo: "",
    porte: "",
    castrado: false,
    peso: "",
    temperamento: "",
    necessidadesEspeciais: "",
    rotina: "",
    saude: "",
    tomaMedicamentos: false,
    medicamentos: "",
    vacinasVermifugos: "",
    controleParasitario: ""
  });

  const filteredPets = pets.filter(pet =>
    pet.nomePet.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.nomeTutor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.raca.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPet: Pet = {
      id: Date.now().toString(),
      nomeTutor: formData.nomeTutor,
      nomePet: formData.nomePet,
      idade: parseInt(formData.idade),
      especie: formData.especie,
      raca: formData.raca,
      sexo: formData.sexo,
      porte: formData.porte,
      castrado: formData.castrado,
      peso: parseFloat(formData.peso),
      temperamento: formData.temperamento,
      necessidadesEspeciais: formData.necessidadesEspeciais,
      rotina: formData.rotina,
      saude: formData.saude,
      tomaMedicamentos: formData.tomaMedicamentos,
      medicamentos: formData.medicamentos,
      vacinasVermifugos: formData.vacinasVermifugos,
      controleParasitario: formData.controleParasitario
    };
    setPets([...pets, newPet]);
    setFormData({
      nomeTutor: "",
      nomePet: "",
      idade: "",
      especie: "",
      raca: "",
      sexo: "",
      porte: "",
      castrado: false,
      peso: "",
      temperamento: "",
      necessidadesEspeciais: "",
      rotina: "",
      saude: "",
      tomaMedicamentos: false,
      medicamentos: "",
      vacinasVermifugos: "",
      controleParasitario: ""
    });
    setIsDialogOpen(false);
    toast({
      title: "Pet cadastrado com sucesso!",
      description: `${formData.nomePet} foi adicionado ao sistema.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gestão de Pets</h2>
          <p className="text-muted-foreground">Gerencie os dados dos pets cadastrados</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700">
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Pet
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Pet</DialogTitle>
              <DialogDescription>
                Preencha os dados do pet para cadastrá-lo no sistema.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nomeTutor">Nome do Tutor</Label>
                  <Input
                    id="nomeTutor"
                    value={formData.nomeTutor}
                    onChange={(e) => setFormData({ ...formData, nomeTutor: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="nomePet">Nome do Pet</Label>
                  <Input
                    id="nomePet"
                    value={formData.nomePet}
                    onChange={(e) => setFormData({ ...formData, nomePet: e.target.value })}
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
                    required
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
                  <Input
                    id="raca"
                    value={formData.raca}
                    onChange={(e) => setFormData({ ...formData, raca: e.target.value })}
                  />
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
                  <Label htmlFor="necessidadesEspeciais">Necessidades Especiais</Label>
                  <Textarea
                    id="necessidadesEspeciais"
                    value={formData.necessidadesEspeciais}
                    onChange={(e) => setFormData({ ...formData, necessidadesEspeciais: e.target.value })}
                    rows={2}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Cadastrar Pet
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPets.map((pet) => (
              <Card key={pet.id} className="hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Heart className="h-5 w-5 text-pink-500" />
                      {pet.nomePet}
                    </CardTitle>
                    <Badge variant={pet.porte === "Grande" ? "default" : pet.porte === "Médio" ? "secondary" : "outline"}>
                      {pet.porte}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Tutor: {pet.nomeTutor}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      {pet.idade} anos
                    </div>
                    <div className="flex items-center gap-1">
                      <Weight className="h-4 w-4 text-green-500" />
                      {pet.peso}kg
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{pet.especie} - {pet.raca}</p>
                    <p className="text-xs text-muted-foreground">{pet.sexo} • {pet.castrado ? "Castrado" : "Não castrado"}</p>
                  </div>
                  {pet.tomaMedicamentos && (
                    <Badge variant="outline" className="text-xs">
                      <Stethoscope className="h-3 w-3 mr-1" />
                      Medicamentos
                    </Badge>
                  )}
                  <p className="text-xs text-muted-foreground line-clamp-2">{pet.temperamento}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PetsManager;
