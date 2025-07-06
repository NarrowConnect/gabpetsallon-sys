
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Tutor {
  id: string;
  nome: string;
  celular: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
}

interface TutorSearchProps {
  onTutorSelected: (tutor: Tutor) => void;
  onCreateNew: () => void;
  selectedTutor?: Tutor | null;
}

const TutorSearch = ({ onTutorSelected, onCreateNew, selectedTutor }: TutorSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const searchTutors = async (term: string) => {
    if (term.length < 2) {
      setTutors([]);
      setShowResults(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tutores')
        .select('id, nome, celular, endereco, cidade, estado')
        .or(`nome.ilike.%${term}%, celular.ilike.%${term}%`)
        .limit(5);

      if (error) throw error;
      setTutors(data || []);
      setShowResults(true);
    } catch (error) {
      console.error('Erro ao buscar tutores:', error);
      setTutors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchTerm) {
        searchTutors(searchTerm);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  const handleTutorSelect = (tutor: Tutor) => {
    onTutorSelected(tutor);
    setShowResults(false);
    setSearchTerm(tutor.nome);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar tutor por nome ou celular..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-cyan"></div>
            </div>
          )}
        </div>
        <Button type="button" variant="outline" onClick={onCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Tutor
        </Button>
      </div>

      {showResults && tutors.length > 0 && (
        <Card className="absolute z-10 w-full mt-1">
          <CardContent className="p-2">
            {tutors.map((tutor) => (
              <div
                key={tutor.id}
                className="p-2 hover:bg-gray-100 cursor-pointer rounded"
                onClick={() => handleTutorSelect(tutor)}
              >
                <div className="font-medium">{tutor.nome}</div>
                <div className="text-sm text-gray-600">{tutor.celular}</div>
                {tutor.cidade && (
                  <div className="text-xs text-gray-500">{tutor.cidade}, {tutor.estado}</div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {selectedTutor && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-3">
            <div className="text-sm">
              <strong>Tutor selecionado:</strong> {selectedTutor.nome}
            </div>
            <div className="text-xs text-gray-600">{selectedTutor.celular}</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TutorSearch;
