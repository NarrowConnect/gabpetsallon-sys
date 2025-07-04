
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, Search, Edit, Trash2, Phone, MapPin, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Tutor {
  id: string;
  nome: string;
  telefoneResidencial: string;
  celular: string;
  endereco: string;
  cep: string;
  cidade: string;
  estado: string;
  nomeVeterinario: string;
  telefoneVeterinario: string;
  celularVeterinario: string;
  enderecoVeterinario: string;
  cidadeVeterinario: string;
  estadoVeterinario: string;
  contatoAdicional1Nome: string;
  contatoAdicional1Telefone: string;
  contatoAdicional2Nome: string;
  contatoAdicional2Telefone: string;
}

const TutorsManager = () => {
  const { toast } = useToast();
  const [tutors, setTutors] = useState<Tutor[]>([
    {
      id: "1",
      nome: "Maria Silva",
      telefoneResidencial: "(41) 3333-4444",
      celular: "(41) 99999-8888",
      endereco: "Rua das Flores, 123",
      cep: "80000-000",
      cidade: "Curitiba",
      estado: "PR",
      nomeVeterinario: "Dr. João Santos",
      telefoneVeterinario: "(41) 3333-5555",
      celularVeterinario: "(41) 99999-7777",
      enderecoVeterinario: "Av. Veterinária, 123",
      cidadeVeterinario: "Curitiba",
      estadoVeterinario: "PR",
      contatoAdicional1Nome: "Pedro Silva",
      contatoAdicional1Telefone: "(41) 99999-1111",
      contatoAdicional2Nome: "",
      contatoAdicional2Telefone: ""
    },
    {
      id: "2",
      nome: "João Santos",
      telefoneResidencial: "(41) 3333-5555",
      celular: "(41) 99999-7777",
      endereco: "Av. Brasil, 456",
      cep: "80000-001",
      cidade: "Curitiba",
      estado: "PR",
      nomeVeterinario: "Dra. Ana Costa",
      telefoneVeterinario: "(41) 3333-6666",
      celularVeterinario: "(41) 99999-2222",
      enderecoVeterinario: "Rua dos Veterinários, 456",
      cidadeVeterinario: "Curitiba",
      estadoVeterinario: "PR",
      contatoAdicional1Nome: "",
      contatoAdicional1Telefone: "",
      contatoAdicional2Nome: "",
      contatoAdicional2Telefone: ""
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTutor, setEditingTutor] = useState<Tutor | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    telefoneResidencial: "",
    celular: "",
    endereco: "",
    cep: "",
    cidade: "",
    estado: "",
    nomeVeterinario: "",
    telefoneVeterinario: "",
    celularVeterinario: "",
    enderecoVeterinario: "",
    cidadeVeterinario: "",
    estadoVeterinario: "",
    contatoAdicional1Nome: "",
    contatoAdicional1Telefone: "",
    contatoAdicional2Nome: "",
    contatoAdicional2Telefone: ""
  });

  const filteredTutors = tutors.filter(tutor =>
    tutor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tutor.celular.includes(searchTerm)
  );

  const resetForm = () => {
    setFormData({
      nome: "",
      telefoneResidencial: "",
      celular: "",
      endereco: "",
      cep: "",
      cidade: "",
      estado: "",
      nomeVeterinario: "",
      telefoneVeterinario: "",
      celularVeterinario: "",
      enderecoVeterinario: "",
      cidadeVeterinario: "",
      estadoVeterinario: "",
      contatoAdicional1Nome: "",
      contatoAdicional1Telefone: "",
      contatoAdicional2Nome: "",
      contatoAdicional2Telefone: ""
    });
    setEditingTutor(null);
  };

  const handleEdit = (tutor: Tutor) => {
    setEditingTutor(tutor);
    setFormData({
      nome: tutor.nome,
      telefoneResidencial: tutor.telefoneResidencial,
      celular: tutor.celular,
      endereco: tutor.endereco,
      cep: tutor.cep,
      cidade: tutor.cidade,
      estado: tutor.estado,
      nomeVeterinario: tutor.nomeVeterinario,
      telefoneVeterinario: tutor.telefoneVeterinario,
      celularVeterinario: tutor.celularVeterinario,
      enderecoVeterinario: tutor.enderecoVeterinario,
      cidadeVeterinario: tutor.cidadeVeterinario,
      estadoVeterinario: tutor.estadoVeterinario,
      contatoAdicional1Nome: tutor.contatoAdicional1Nome,
      contatoAdicional1Telefone: tutor.contatoAdicional1Telefone,
      contatoAdicional2Nome: tutor.contatoAdicional2Nome,
      contatoAdicional2Telefone: tutor.contatoAdicional2Telefone
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTutor) {
      const updatedTutor: Tutor = {
        ...editingTutor,
        ...formData
      };
      setTutors(tutors.map(tutor => tutor.id === editingTutor.id ? updatedTutor : tutor));
      toast({
        title: "Tutor atualizado com sucesso!",
        description: `${formData.nome} foi atualizado no sistema.`,
      });
    } else {
      const newTutor: Tutor = {
        id: Date.now().toString(),
        ...formData
      };
      setTutors([...tutors, newTutor]);
      toast({
        title: "Tutor cadastrado com sucesso!",
        description: `${formData.nome} foi adicionado ao sistema.`,
      });
    }
    
    resetForm();
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setTutors(tutors.filter(tutor => tutor.id !== id));
    toast({
      title: "Tutor removido",
      description: "O tutor foi removido do sistema.",
      variant: "destructive"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gestão de Tutores</h2>
          <p className="text-muted-foreground">Gerencie os dados dos tutores dos pets</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Tutor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingTutor ? "Editar Tutor" : "Cadastrar Novo Tutor"}</DialogTitle>
              <DialogDescription>
                {editingTutor ? "Edite os dados do tutor." : "Preencha os dados do tutor para cadastrá-lo no sistema."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Dados Pessoais</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome Completo</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="celular">Celular</Label>
                    <Input
                      id="celular"
                      value={formData.celular}
                      onChange={(e) => setFormData({ ...formData, celular: e.target.value })}
                      placeholder="(41) 99999-9999"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefoneResidencial">Telefone Residencial</Label>
                    <Input
                      id="telefoneResidencial"
                      value={formData.telefoneResidencial}
                      onChange={(e) => setFormData({ ...formData, telefoneResidencial: e.target.value })}
                      placeholder="(41) 3333-4444"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cep">CEP</Label>
                    <Input
                      id="cep"
                      value={formData.cep}
                      onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                      placeholder="80000-000"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="endereco">Endereço</Label>
                    <Input
                      id="endereco"
                      value={formData.endereco}
                      onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input
                      id="cidade"
                      value={formData.cidade}
                      onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="estado">Estado</Label>
                    <Input
                      id="estado"
                      value={formData.estado}
                      onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                      placeholder="PR"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Dados do Veterinário</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nomeVeterinario">Nome do Veterinário</Label>
                    <Input
                      id="nomeVeterinario"
                      value={formData.nomeVeterinario}
                      onChange={(e) => setFormData({ ...formData, nomeVeterinario: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefoneVeterinario">Telefone do Veterinário</Label>
                    <Input
                      id="telefoneVeterinario"
                      value={formData.telefoneVeterinario}
                      onChange={(e) => setFormData({ ...formData, telefoneVeterinario: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="celularVeterinario">Celular do Veterinário</Label>
                    <Input
                      id="celularVeterinario"
                      value={formData.celularVeterinario}
                      onChange={(e) => setFormData({ ...formData, celularVeterinario: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cidadeVeterinario">Cidade do Veterinário</Label>
                    <Input
                      id="cidadeVeterinario"
                      value={formData.cidadeVeterinario}
                      onChange={(e) => setFormData({ ...formData, cidadeVeterinario: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="enderecoVeterinario">Endereço do Veterinário</Label>
                    <Input
                      id="enderecoVeterinario"
                      value={formData.enderecoVeterinario}
                      onChange={(e) => setFormData({ ...formData, enderecoVeterinario: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Contatos Adicionais</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contatoAdicional1Nome">Nome do 1º Contato</Label>
                    <Input
                      id="contatoAdicional1Nome"
                      value={formData.contatoAdicional1Nome}
                      onChange={(e) => setFormData({ ...formData, contatoAdicional1Nome: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contatoAdicional1Telefone">Telefone do 1º Contato</Label>
                    <Input
                      id="contatoAdicional1Telefone"
                      value={formData.contatoAdicional1Telefone}
                      onChange={(e) => setFormData({ ...formData, contatoAdicional1Telefone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contatoAdicional2Nome">Nome do 2º Contato</Label>
                    <Input
                      id="contatoAdicional2Nome"
                      value={formData.contatoAdicional2Nome}
                      onChange={(e) => setFormData({ ...formData, contatoAdicional2Nome: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contatoAdicional2Telefone">Telefone do 2º Contato</Label>
                    <Input
                      id="contatoAdicional2Telefone"
                      value={formData.contatoAdicional2Telefone}
                      onChange={(e) => setFormData({ ...formData, contatoAdicional2Telefone: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full">
                {editingTutor ? "Atualizar Tutor" : "Cadastrar Tutor"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Tutores Cadastrados</CardTitle>
              <CardDescription>{tutors.length} tutores no sistema</CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar tutor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTutors.map((tutor) => (
              <Card key={tutor.id} className="hover:shadow-lg transition-all duration-300 bg-white/80">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{tutor.nome}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    {tutor.celular}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p>{tutor.endereco}</p>
                      <p className="text-muted-foreground">{tutor.cidade}, {tutor.estado} - {tutor.cep}</p>
                    </div>
                  </div>
                  {tutor.nomeVeterinario && (
                    <div className="text-sm">
                      <p className="font-medium">Veterinário: {tutor.nomeVeterinario}</p>
                      <p className="text-muted-foreground text-xs">{tutor.celularVeterinario}</p>
                    </div>
                  )}
                  {(tutor.contatoAdicional1Nome || tutor.contatoAdicional2Nome) && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <UserPlus className="h-3 w-3" />
                      <span>Contatos adicionais cadastrados</span>
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(tutor)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(tutor.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TutorsManager;
