import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, Search, Edit, Trash2, Phone, MapPin, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTutors } from "@/hooks/useSupabase";

const TutorsManager = () => {
  const { toast } = useToast();
  const { tutors, loading, error, addTutor, updateTutor, deleteTutor } = useTutors();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTutor, setEditingTutor] = useState<any>(null);
  const [formData, setFormData] = useState({
    nome: "",
    telefone_residencial: "",
    celular: "",
    endereco: "",
    cep: "",
    cidade: "",
    estado: "",
    nome_veterinario: "",
    telefone_veterinario: "",
    celular_veterinario: "",
    endereco_veterinario: "",
    cidade_veterinario: "",
    estado_veterinario: "",
    contato_adicional_1_nome: "",
    contato_adicional_1_telefone: "",
    contato_adicional_2_nome: "",
    contato_adicional_2_telefone: ""
  });

  const filteredTutors = tutors.filter(tutor =>
    tutor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tutor.celular.includes(searchTerm)
  );

  const resetForm = () => {
    setFormData({
      nome: "",
      telefone_residencial: "",
      celular: "",
      endereco: "",
      cep: "",
      cidade: "",
      estado: "",
      nome_veterinario: "",
      telefone_veterinario: "",
      celular_veterinario: "",
      endereco_veterinario: "",
      cidade_veterinario: "",
      estado_veterinario: "",
      contato_adicional_1_nome: "",
      contato_adicional_1_telefone: "",
      contato_adicional_2_nome: "",
      contato_adicional_2_telefone: ""
    });
    setEditingTutor(null);
  };

  const handleEdit = (tutor: any) => {
    setEditingTutor(tutor);
    setFormData({
      nome: tutor.nome || "",
      telefone_residencial: tutor.telefone_residencial || "",
      celular: tutor.celular || "",
      endereco: tutor.endereco || "",
      cep: tutor.cep || "",
      cidade: tutor.cidade || "",
      estado: tutor.estado || "",
      nome_veterinario: tutor.nome_veterinario || "",
      telefone_veterinario: tutor.telefone_veterinario || "",
      celular_veterinario: tutor.celular_veterinario || "",
      endereco_veterinario: tutor.endereco_veterinario || "",
      cidade_veterinario: tutor.cidade_veterinario || "",
      estado_veterinario: tutor.estado_veterinario || "",
      contato_adicional_1_nome: tutor.contato_adicional_1_nome || "",
      contato_adicional_1_telefone: tutor.contato_adicional_1_telefone || "",
      contato_adicional_2_nome: tutor.contato_adicional_2_nome || "",
      contato_adicional_2_telefone: tutor.contato_adicional_2_telefone || ""
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingTutor) {
        await updateTutor(editingTutor.id, formData);
        toast({
          title: "Tutor atualizado com sucesso!",
          description: `${formData.nome} foi atualizado no sistema.`,
        });
      } else {
        await addTutor(formData);
        toast({
          title: "Tutor cadastrado com sucesso!",
          description: `${formData.nome} foi adicionado ao sistema.`,
        });
      }
      
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o tutor.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTutor(id);
      toast({
        title: "Tutor removido",
        description: "O tutor foi removido do sistema.",
        variant: "destructive"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao remover o tutor.",
        variant: "destructive"
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
        <p className="text-red-600">Erro ao carregar tutores: {error}</p>
      </div>
    );
  }

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
                    <Label htmlFor="telefone_residencial">Telefone Residencial</Label>
                    <Input
                      id="telefone_residencial"
                      value={formData.telefone_residencial}
                      onChange={(e) => setFormData({ ...formData, telefone_residencial: e.target.value })}
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

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Contatos Adicionais</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contato_adicional_1_nome">Nome do 1º Contato</Label>
                    <Input
                      id="contato_adicional_1_nome"
                      value={formData.contato_adicional_1_nome}
                      onChange={(e) => setFormData({ ...formData, contato_adicional_1_nome: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contato_adicional_1_telefone">Telefone do 1º Contato</Label>
                    <Input
                      id="contato_adicional_1_telefone"
                      value={formData.contato_adicional_1_telefone}
                      onChange={(e) => setFormData({ ...formData, contato_adicional_1_telefone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contato_adicional_2_nome">Nome do 2º Contato</Label>
                    <Input
                      id="contato_adicional_2_nome"
                      value={formData.contato_adicional_2_nome}
                      onChange={(e) => setFormData({ ...formData, contato_adicional_2_nome: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contato_adicional_2_telefone">Telefone do 2º Contato</Label>
                    <Input
                      id="contato_adicional_2_telefone"
                      value={formData.contato_adicional_2_telefone}
                      onChange={(e) => setFormData({ ...formData, contato_adicional_2_telefone: e.target.value })}
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
          {filteredTutors.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhum tutor encontrado.</p>
            </div>
          ) : (
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
                    {tutor.endereco && (
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <div>
                          <p>{tutor.endereco}</p>
                          {tutor.cidade && tutor.estado && (
                            <p className="text-muted-foreground">{tutor.cidade}, {tutor.estado} - {tutor.cep}</p>
                          )}
                        </div>
                      </div>
                    )}
                    {tutor.nome_veterinario && (
                      <div className="text-sm">
                        <p className="font-medium">Veterinário: {tutor.nome_veterinario}</p>
                        {tutor.celular_veterinario && (
                          <p className="text-muted-foreground text-xs">{tutor.celular_veterinario}</p>
                        )}
                      </div>
                    )}
                    {(tutor.contato_adicional_1_nome || tutor.contato_adicional_2_nome) && (
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TutorsManager;
