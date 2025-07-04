
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, Search, Edit, Trash2, Phone, MapPin } from "lucide-react";
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
      estado: "PR"
    },
    {
      id: "2",
      nome: "João Santos",
      telefoneResidencial: "(41) 3333-5555",
      celular: "(41) 99999-7777",
      endereco: "Av. Brasil, 456",
      cep: "80000-001",
      cidade: "Curitiba",
      estado: "PR"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    telefoneResidencial: "",
    celular: "",
    endereco: "",
    cep: "",
    cidade: "",
    estado: ""
  });

  const filteredTutors = tutors.filter(tutor =>
    tutor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tutor.celular.includes(searchTerm)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTutor: Tutor = {
      id: Date.now().toString(),
      ...formData
    };
    setTutors([...tutors, newTutor]);
    setFormData({
      nome: "",
      telefoneResidencial: "",
      celular: "",
      endereco: "",
      cep: "",
      cidade: "",
      estado: ""
    });
    setIsDialogOpen(false);
    toast({
      title: "Tutor cadastrado com sucesso!",
      description: `${formData.nome} foi adicionado ao sistema.`,
    });
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Tutor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Tutor</DialogTitle>
              <DialogDescription>
                Preencha os dados do tutor para cadastrá-lo no sistema.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
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
              <Button type="submit" className="w-full">
                Cadastrar Tutor
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
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
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
