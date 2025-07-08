
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import type { PetDB, PetInsert } from '@/hooks/usePets';

interface PetFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PetInsert) => Promise<void>;
  initialData?: PetDB | null;
  tutorId?: string;
  tutorName?: string;
  title?: string;
  description?: string;
  submitLabel?: string;
}

const PetForm: React.FC<PetFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  tutorId,
  tutorName,
  title = "Cadastrar Novo Pet",
  description = "Preencha os dados do pet.",
  submitLabel = "Salvar Pet"
}) => {
  const [formData, setFormData] = useState<PetInsert>({
    tutor_id: tutorId || initialData?.tutor_id || null,
    nome_tutor: tutorName || initialData?.nome_tutor || "",
    nome_pet: initialData?.nome_pet || "",
    especie: initialData?.especie || "Cão",
    raca: initialData?.raca || null,
    sexo: initialData?.sexo || null,
    porte: initialData?.porte || null,
    idade: initialData?.idade || null,
    peso: initialData?.peso || null,
    castrado: initialData?.castrado || false,
    toma_medicamentos: initialData?.toma_medicamentos || false,
    temperamento: initialData?.temperamento || null,
    necessidades_especiais: initialData?.necessidades_especiais || null,
    rotina: initialData?.rotina || null,
    saude: initialData?.saude || null,
    medicamentos: initialData?.medicamentos || null,
    vacinas_vermifugos: initialData?.vacinas_vermifugos || null,
    controle_parasitario: initialData?.controle_parasitario || null,
    nome_veterinario: initialData?.nome_veterinario || null,
    telefone_veterinario: initialData?.telefone_veterinario || null,
    celular_veterinario: initialData?.celular_veterinario || null,
    endereco_veterinario: initialData?.endereco_veterinario || null,
    cidade_veterinario: initialData?.cidade_veterinario || null,
    estado_veterinario: initialData?.estado_veterinario || null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    onClose();
  };

  const handleChange = (field: keyof PetInsert, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-poppins">{title}</DialogTitle>
          <DialogDescription className="font-poppins">{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome_pet" className="font-poppins">Nome do Pet *</Label>
              <Input
                id="nome_pet"
                value={formData.nome_pet}
                onChange={(e) => handleChange('nome_pet', e.target.value)}
                required
                className="font-poppins"
              />
            </div>
            <div>
              <Label htmlFor="especie" className="font-poppins">Espécie</Label>
              <Select value={formData.especie || 'Cão'} onValueChange={(value) => handleChange('especie', value)}>
                <SelectTrigger className="font-poppins">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cão" className="font-poppins">Cão</SelectItem>
                  <SelectItem value="Gato" className="font-poppins">Gato</SelectItem>
                  <SelectItem value="Outros" className="font-poppins">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="raca" className="font-poppins">Raça</Label>
              <Input
                id="raca"
                value={formData.raca || ''}
                onChange={(e) => handleChange('raca', e.target.value)}
                className="font-poppins"
              />
            </div>
            <div>
              <Label htmlFor="sexo" className="font-poppins">Sexo</Label>
              <Select value={formData.sexo || ''} onValueChange={(value) => handleChange('sexo', value)}>
                <SelectTrigger className="font-poppins">
                  <SelectValue placeholder="Selecione o sexo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Macho" className="font-poppins">Macho</SelectItem>
                  <SelectItem value="Fêmea" className="font-poppins">Fêmea</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="porte" className="font-poppins">Porte</Label>
              <Select value={formData.porte || ''} onValueChange={(value) => handleChange('porte', value)}>
                <SelectTrigger className="font-poppins">
                  <SelectValue placeholder="Selecione o porte" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pequeno" className="font-poppins">Pequeno</SelectItem>
                  <SelectItem value="Médio" className="font-poppins">Médio</SelectItem>
                  <SelectItem value="Grande" className="font-poppins">Grande</SelectItem>
                  <SelectItem value="Gigante" className="font-poppins">Gigante</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="idade" className="font-poppins">Idade (anos)</Label>
              <Input
                id="idade"
                type="number"
                value={formData.idade || ''}
                onChange={(e) => handleChange('idade', e.target.value ? parseInt(e.target.value) : null)}
                className="font-poppins"
              />
            </div>
            <div>
              <Label htmlFor="peso" className="font-poppins">Peso (kg)</Label>
              <Input
                id="peso"
                type="number"
                step="0.1"
                value={formData.peso || ''}
                onChange={(e) => handleChange('peso', e.target.value ? parseFloat(e.target.value) : null)}
                className="font-poppins"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="castrado"
                checked={formData.castrado}
                onCheckedChange={(checked) => handleChange('castrado', checked)}
              />
              <Label htmlFor="castrado" className="font-poppins">Castrado</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="toma_medicamentos"
                checked={formData.toma_medicamentos}
                onCheckedChange={(checked) => handleChange('toma_medicamentos', checked)}
              />
              <Label htmlFor="toma_medicamentos" className="font-poppins">Toma Medicamentos</Label>
            </div>
          </div>
          
          <Button type="submit" className="w-full font-poppins">
            {submitLabel}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PetForm;
