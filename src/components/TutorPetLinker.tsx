import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, Heart, User, Plus, Unlink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTutors } from "@/hooks/useTutors";
import { usePets } from "@/hooks/usePets";
import PetBreedImage from "./PetBreedImage";

interface TutorPetLinkerProps {
  tutorId?: string;
  petId?: string;
  type: 'tutor-to-pet' | 'pet-to-tutor';
  onSuccess?: () => void;
}

const TutorPetLinker = ({ tutorId, petId, type, onSuccess }: TutorPetLinkerProps) => {
  const { toast } = useToast();
  const { tutors, updateTutor } = useTutors();
  const { pets, updatePet, getPetsByTutor } = usePets();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState('');

  const handleLink = async () => {
    try {
      if (type === 'tutor-to-pet' && tutorId && selectedId) {
        // Vincular pet existente ao tutor
        const selectedPet = pets.find(p => p.id === selectedId);
        const tutor = tutors.find(t => t.id === tutorId);
        
        if (selectedPet && tutor) {
          await updatePet(selectedId, {
            tutor_id: tutorId,
            nome_tutor: tutor.nome
          });
          
          toast({
            title: "Vinculação realizada!",
            description: `Pet ${selectedPet.nome_pet} foi vinculado ao tutor ${tutor.nome}`,
          });
        }
      } else if (type === 'pet-to-tutor' && petId && selectedId) {
        // Vincular tutor existente ao pet
        const selectedTutor = tutors.find(t => t.id === selectedId);
        const pet = pets.find(p => p.id === petId);
        
        if (selectedTutor && pet) {
          await updatePet(petId, {
            tutor_id: selectedId,
            nome_tutor: selectedTutor.nome
          });
          
          toast({
            title: "Vinculação realizada!",
            description: `Pet ${pet.nome_pet} foi vinculado ao tutor ${selectedTutor.nome}`,
          });
        }
      }
      
      setIsOpen(false);
      setSelectedId('');
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Erro ao vincular",
        description: "Não foi possível realizar a vinculação. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const getAvailableOptions = () => {
    if (type === 'tutor-to-pet') {
      // Pets disponíveis (sem tutor ou com tutor diferente)
      return pets.filter(pet => !pet.tutor_id || pet.tutor_id !== tutorId);
    } else {
      // Tutores disponíveis
      return tutors;
    }
  };

  const getLinkedItems = () => {
    if (type === 'tutor-to-pet' && tutorId) {
      return getPetsByTutor(tutorId);
    } else if (type === 'pet-to-tutor' && petId) {
      const pet = pets.find(p => p.id === petId);
      if (pet?.tutor_id) {
        const tutor = tutors.find(t => t.id === pet.tutor_id);
        return tutor ? [tutor] : [];
      }
    }
    return [];
  };

  const handleUnlink = async (itemId: string) => {
    try {
      if (type === 'tutor-to-pet') {
        // Desvincular pet do tutor
        await updatePet(itemId, {
          tutor_id: null,
          nome_tutor: ''
        });
        
        const pet = pets.find(p => p.id === itemId);
        toast({
          title: "Desvinculação realizada!",
          description: `Pet ${pet?.nome_pet} foi desvinculado do tutor`,
        });
      } else if (type === 'pet-to-tutor' && petId) {
        // Desvincular tutor do pet
        await updatePet(petId, {
          tutor_id: null,
          nome_tutor: ''
        });
        
        const pet = pets.find(p => p.id === petId);
        toast({
          title: "Desvinculação realizada!",
          description: `Pet ${pet?.nome_pet} foi desvinculado do tutor`,
        });
      }
      
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Erro ao desvincular",
        description: "Não foi possível realizar a desvinculação. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const linkedItems = getLinkedItems();
  const availableOptions = getAvailableOptions();

  return (
    <div className="space-y-4">
      {/* Itens já vinculados */}
      {linkedItems.length > 0 && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-green-800 flex items-center gap-2">
              <Link className="h-4 w-4" />
              {type === 'tutor-to-pet' ? 'Pets Vinculados' : 'Tutor Vinculado'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {linkedItems.map((item: any) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  {type === 'tutor-to-pet' ? (
                    <>
                      <PetBreedImage breed={item.raca} className="w-10 h-10" />
                      <div>
                        <p className="font-medium text-green-800">{item.nome_pet}</p>
                        <p className="text-sm text-green-600">{item.raca} - {item.porte}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-green-800">{item.nome}</p>
                        <p className="text-sm text-green-600">{item.celular}</p>
                      </div>
                    </>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUnlink(item.id)}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Unlink className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Botão para vincular novos itens */}
      {availableOptions.length > 0 && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50">
              <Plus className="h-4 w-4 mr-2" />
              {type === 'tutor-to-pet' ? 'Vincular Pet Existente' : 'Vincular Tutor Existente'}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Link className="h-5 w-5 text-blue-600" />
                {type === 'tutor-to-pet' ? 'Vincular Pet' : 'Vincular Tutor'}
              </DialogTitle>
              <DialogDescription>
                Selecione {type === 'tutor-to-pet' ? 'um pet' : 'um tutor'} para fazer a vinculação.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <Select value={selectedId} onValueChange={setSelectedId}>
                <SelectTrigger>
                  <SelectValue placeholder={`Selecione ${type === 'tutor-to-pet' ? 'um pet' : 'um tutor'}...`} />
                </SelectTrigger>
                <SelectContent>
                  {availableOptions.map((option: any) => (
                    <SelectItem key={option.id} value={option.id}>
                      <div className="flex items-center gap-2">
                        {type === 'tutor-to-pet' ? (
                          <>
                            <Heart className="h-4 w-4 text-pink-500" />
                            <span>{option.nome_pet}</span>
                            {option.nome_tutor && (
                              <Badge variant="secondary" className="text-xs">
                                {option.nome_tutor}
                              </Badge>
                            )}
                          </>
                        ) : (
                          <>
                            <User className="h-4 w-4 text-blue-500" />
                            <span>{option.nome}</span>
                            <span className="text-gray-500">({option.celular})</span>
                          </>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleLink}
                  disabled={!selectedId}
                  className="flex-1"
                >
                  <Link className="h-4 w-4 mr-2" />
                  Vincular
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsOpen(false);
                    setSelectedId('');
                  }}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default TutorPetLinker;