
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TutorRegistrationProps {
  onTutorCreated: (tutor: any) => void;
  onCancel: () => void;
}

const TutorRegistration = ({ onTutorCreated, onCancel }: TutorRegistrationProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    celular: "",
    telefone_residencial: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('tutores')
        .insert([formData])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar tutor:', error);
        toast({
          title: "Erro ao cadastrar",
          description: "Erro ao criar cadastro. Tente novamente.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Cadastro realizado!",
        description: "Tutor cadastrado com sucesso.",
      });

      onTutorCreated(data);
    } catch (error) {
      console.error('Erro:', error);
      toast({
        title: "Erro",
        description: "Erro interno do servidor.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <img 
            src="/lovable-uploads/Marca Vertical.png" 
            alt="GabPetSallon" 
            className="h-20 mx-auto mb-4"
          />
          <p className="text-gray-600 font-poppins">Cadastro de Novo Tutor</p>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={onCancel}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle>Criar Cadastro de Tutor</CardTitle>
                <CardDescription>
                  Preencha os dados para criar seu cadastro
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dados Pessoais */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-brand-cyan">Dados Pessoais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome Completo *</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => handleChange('nome', e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="celular">Celular *</Label>
                    <Input
                      id="celular"
                      value={formData.celular}
                      onChange={(e) => handleChange('celular', e.target.value)}
                      placeholder="(41) 99999-9999"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefone_residencial">Telefone Residencial</Label>
                    <Input
                      id="telefone_residencial"
                      value={formData.telefone_residencial}
                      onChange={(e) => handleChange('telefone_residencial', e.target.value)}
                      placeholder="(41) 3333-3333"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              {/* Endereço */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-brand-orange">Endereço</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="endereco">Endereço</Label>
                    <Input
                      id="endereco"
                      value={formData.endereco}
                      onChange={(e) => handleChange('endereco', e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cep">CEP</Label>
                    <Input
                      id="cep"
                      value={formData.cep}
                      onChange={(e) => handleChange('cep', e.target.value)}
                      placeholder="00000-000"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input
                      id="cidade"
                      value={formData.cidade}
                      onChange={(e) => handleChange('cidade', e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="estado">Estado</Label>
                    <Input
                      id="estado"
                      value={formData.estado}
                      onChange={(e) => handleChange('estado', e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              {/* Veterinário */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-brand-yellow text-gray-800">Dados do Veterinário</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome_veterinario">Nome do Veterinário</Label>
                    <Input
                      id="nome_veterinario"
                      value={formData.nome_veterinario}
                      onChange={(e) => handleChange('nome_veterinario', e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefone_veterinario">Telefone</Label>
                    <Input
                      id="telefone_veterinario"
                      value={formData.telefone_veterinario}
                      onChange={(e) => handleChange('telefone_veterinario', e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="celular_veterinario">Celular</Label>
                    <Input
                      id="celular_veterinario"
                      value={formData.celular_veterinario}
                      onChange={(e) => handleChange('celular_veterinario', e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              {/* Contatos Adicionais */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-brand-cyan">Contatos Adicionais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contato_adicional_1_nome">Nome do Contato 1</Label>
                    <Input
                      id="contato_adicional_1_nome"
                      value={formData.contato_adicional_1_nome}
                      onChange={(e) => handleChange('contato_adicional_1_nome', e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contato_adicional_1_telefone">Telefone do Contato 1</Label>
                    <Input
                      id="contato_adicional_1_telefone"
                      value={formData.contato_adicional_1_telefone}
                      onChange={(e) => handleChange('contato_adicional_1_telefone', e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Salvando..." : "Criar Cadastro"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TutorRegistration;
