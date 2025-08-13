
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Search, Edit, Trash2, Heart, User, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePets } from "@/hooks/usePets";
import { useTutors } from "@/hooks/useTutors";
import PetForm from "@/components/forms/PetForm";
import TutorForm from "@/components/forms/TutorForm";
import TutorPetLinker from "@/components/TutorPetLinker";
import PetBreedImage from "@/components/PetBreedImage";

const PetsManager = () => {
  const { toast } = useToast();
  const { pets, loading, error, addPet, updatePet, deletePet } = usePets();
  const { tutors, addTutor } = useTutors();
  
  useEffect(() => {
    if (error) {
      toast({
        title: "Erro ao carregar pets",
        description: String(error),
        variant: "destructive",
      });
    }
  }, [error, toast]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isPetDialogOpen, setIsPetDialogOpen] = useState(false);
  const [isTutorDialogOpen, setIsTutorDialogOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<any>(null);
  const [selectedTutorId, setSelectedTutorId] = useState<string>("");
  const [selectedTutorName, setSelectedTutorName] = useState<string>("");

  const filteredPets = pets.filter(pet =>
    pet.nome_pet.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.nome_tutor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (pet.raca && pet.raca.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEdit = (pet: any) => {
    setEditingPet(pet);
    setIsPetDialogOpen(true);
  };

  const handlePetSubmit = async (formData: any) => {
    try {
      if (editingPet) {
        await updatePet(editingPet.id, formData);
        toast({
          title: "Pet atualizado com sucesso!",
          description: `${formData.nome_pet} foi atualizado no sistema.`,
        });
      } else {
        await addPet(formData);
        toast({
          title: "Pet cadastrado com sucesso!",
          description: `${formData.nome_pet} foi adicionado ao sistema.`,
        });
      }
      
      setEditingPet(null);
      setIsPetDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o pet.",
        variant: "destructive"
      });
    }
  };

  const handleTutorSubmit = async (formData: any) => {
    try {
      const newTutor = await addTutor(formData);
      setSelectedTutorId(newTutor.id);
      setSelectedTutorName(newTutor.nome);
      setIsTutorDialogOpen(false);
      
      toast({
        title: "Tutor criado com sucesso!",
        description: `${formData.nome} foi adicionado. Você pode completar os dados na aba Tutores.`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar o tutor.",
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
      setSelectedTutorId(tutorId);
      setSelectedTutorName(selectedTutor.nome);
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
        
        <div className="flex gap-2">
          <Button 
            onClick={() => setIsTutorDialogOpen(true)}
            variant="outline"
            className="font-poppins"
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Tutor
          </Button>
          <Button 
            onClick={() => setIsPetDialogOpen(true)}
            className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 font-poppins"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Pet
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium font-poppins mb-2">Selecionar Tutor</label>
            <Select value={selectedTutorId} onValueChange={handleTutorSelect}>
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
        </div>
      </div>

      <PetForm
        isOpen={isPetDialogOpen}
        onClose={() => {
          setIsPetDialogOpen(false);
          setEditingPet(null);
        }}
        onSubmit={handlePetSubmit}
        initialData={editingPet}
        tutorId={selectedTutorId}
        tutorName={selectedTutorName}
        title={editingPet ? "Editar Pet" : "Cadastrar Novo Pet"}
        description={editingPet ? "Edite os dados do pet." : "Preencha os dados do pet para cadastrá-lo no sistema."}
        submitLabel={editingPet ? "Atualizar Pet" : "Cadastrar Pet"}
      />

      <TutorForm
        isOpen={isTutorDialogOpen}
        onClose={() => setIsTutorDialogOpen(false)}
        onSubmit={handleTutorSubmit}
        title="Criar Novo Tutor"
        description="Dados básicos do tutor. Você pode completar as informações na aba Tutores."
        submitLabel="Criar Tutor"
      />

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
                    <div className="flex items-center gap-3 mb-3">
                      <PetBreedImage breed={pet.raca} className="w-12 h-12" />
                      <div className="text-sm space-y-1 flex-1">
                        <p className="font-poppins"><span className="font-medium">Espécie:</span> {pet.especie}</p>
                        {pet.raca && <p className="font-poppins"><span className="font-medium">Raça:</span> {pet.raca}</p>}
                        {pet.porte && <p className="font-poppins"><span className="font-medium">Porte:</span> {pet.porte}</p>}
                        {pet.idade && <p className="font-poppins"><span className="font-medium">Idade:</span> {pet.idade} anos</p>}
                        {pet.peso && <p className="font-poppins"><span className="font-medium">Peso:</span> {pet.peso}kg</p>}
                      </div>
                    </div>
                    
                    {/* Componente de vinculação de tutor */}
                    <TutorPetLinker 
                      petId={pet.id} 
                      type="pet-to-tutor" 
                      onSuccess={() => {
                        // Atualizar a lista se necessário
                      }} 
                    />
                    
                    {(pet.castrado || pet.toma_medicamentos) && (
                      <div className="flex gap-2 text-xs mt-2">
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
