
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PlusCircle, Search, Edit, Trash2, Phone, MapPin, UserPlus, Eye, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTutors } from "@/hooks/useTutors";
import { usePets } from "@/hooks/usePets";
import TutorForm from "@/components/forms/TutorForm";

const TutorsManager = () => {
  const { toast } = useToast();
  const { tutors, loading, error, addTutor, updateTutor, deleteTutor } = useTutors();
  const { pets, getPetsByTutor } = usePets();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPetsDialogOpen, setIsPetsDialogOpen] = useState(false);
  const [selectedTutorPets, setSelectedTutorPets] = useState<any[]>([]);
  const [selectedTutorName, setSelectedTutorName] = useState("");
  const [editingTutor, setEditingTutor] = useState<any>(null);

  const filteredTutors = tutors.filter(tutor =>
    tutor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tutor.celular.includes(searchTerm)
  );

  const viewTutorPets = (tutor: any) => {
    const tutorPets = getPetsByTutor(tutor.id);
    setSelectedTutorPets(tutorPets);
    setSelectedTutorName(tutor.nome);
    setIsPetsDialogOpen(true);
  };

  const handleEdit = (tutor: any) => {
    setEditingTutor(tutor);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (formData: any) => {
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
      
      setEditingTutor(null);
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
        <p className="text-red-600 font-poppins">Erro ao carregar tutores: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-poppins">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 font-poppins">Gestão de Tutores</h2>
          <p className="text-muted-foreground font-poppins">Gerencie os dados dos tutores dos pets</p>
        </div>
        
        <Button 
          onClick={() => setIsDialogOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 font-poppins"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Tutor
        </Button>
      </div>

      <TutorForm
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingTutor(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingTutor}
        title={editingTutor ? "Editar Tutor" : "Cadastrar Novo Tutor"}
        description={editingTutor ? "Edite os dados do tutor." : "Preencha os dados do tutor para cadastrá-lo no sistema."}
        submitLabel={editingTutor ? "Atualizar Tutor" : "Cadastrar Tutor"}
      />

      <Dialog open={isPetsDialogOpen} onOpenChange={setIsPetsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="font-poppins">Pets de {selectedTutorName}</DialogTitle>
            <DialogDescription className="font-poppins">
              {selectedTutorPets.length} pet(s) vinculado(s) a este tutor
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {selectedTutorPets.length === 0 ? (
              <p className="text-center text-muted-foreground font-poppins py-4">
                Nenhum pet encontrado para este tutor.
              </p>
            ) : (
              selectedTutorPets.map((pet) => (
                <Card key={pet.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold font-poppins">{pet.nome_pet}</h4>
                      <p className="text-sm text-muted-foreground font-poppins">{pet.raca} - {pet.porte}</p>
                      {pet.idade && <p className="text-xs text-muted-foreground font-poppins">{pet.idade} anos</p>}
                    </div>
                    <Heart className="h-5 w-5 text-pink-500" />
                  </div>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Card className="bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="font-poppins">Tutores Cadastrados</CardTitle>
              <CardDescription className="font-poppins">{tutors.length} tutores no sistema</CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar tutor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64 font-poppins"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredTutors.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground font-poppins">Nenhum tutor encontrado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTutors.map((tutor) => (
                <Card key={tutor.id} className="hover:shadow-lg transition-all duration-300 bg-white/80">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-poppins">{tutor.nome}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span className="font-poppins">{tutor.celular}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {tutor.endereco && (
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <div>
                          <p className="font-poppins">{tutor.endereco}</p>
                          {tutor.cidade && tutor.estado && (
                            <p className="text-muted-foreground font-poppins">{tutor.cidade}, {tutor.estado} - {tutor.cep}</p>
                          )}
                        </div>
                      </div>
                    )}
                    {tutor.nome_veterinario && (
                      <div className="text-sm">
                        <p className="font-medium font-poppins">Veterinário: {tutor.nome_veterinario}</p>
                        {tutor.celular_veterinario && (
                          <p className="text-muted-foreground text-xs font-poppins">{tutor.celular_veterinario}</p>
                        )}
                      </div>
                    )}
                    {(tutor.contato_adicional_1_nome || tutor.contato_adicional_2_nome) && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <UserPlus className="h-3 w-3" />
                        <span className="font-poppins">Contatos adicionais cadastrados</span>
                      </div>
                    )}
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1 font-poppins" onClick={() => viewTutorPets(tutor)}>
                        <Eye className="h-4 w-4 mr-1" />
                        Ver Pets
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 font-poppins" onClick={() => handleEdit(tutor)}>
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
