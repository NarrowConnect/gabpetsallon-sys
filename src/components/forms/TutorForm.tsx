
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { TutorDB, TutorInsert } from '@/hooks/useTutors';

interface TutorFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TutorInsert) => Promise<void>;
  initialData?: TutorDB | null;
  title?: string;
  description?: string;
  submitLabel?: string;
}

const TutorForm: React.FC<TutorFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title = "Cadastrar Novo Tutor",
  description = "Preencha os dados do tutor.",
  submitLabel = "Salvar Tutor"
}) => {
  const [formData, setFormData] = useState<TutorInsert>({
    nome: initialData?.nome || "",
    celular: initialData?.celular || "",
    telefone_residencial: initialData?.telefone_residencial || null,
    endereco: initialData?.endereco || null,
    cep: initialData?.cep || null,
    cidade: initialData?.cidade || null,
    estado: initialData?.estado || null,
    nome_veterinario: initialData?.nome_veterinario || null,
    telefone_veterinario: initialData?.telefone_veterinario || null,
    celular_veterinario: initialData?.celular_veterinario || null,
    endereco_veterinario: initialData?.endereco_veterinario || null,
    cidade_veterinario: initialData?.cidade_veterinario || null,
    estado_veterinario: initialData?.estado_veterinario || null,
    contato_adicional_1_nome: initialData?.contato_adicional_1_nome || null,
    contato_adicional_1_telefone: initialData?.contato_adicional_1_telefone || null,
    contato_adicional_2_nome: initialData?.contato_adicional_2_nome || null,
    contato_adicional_2_telefone: initialData?.contato_adicional_2_telefone || null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    onClose();
  };

  const handleChange = (field: keyof TutorInsert, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value || null
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
              <Label htmlFor="nome" className="font-poppins">Nome Completo *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => handleChange('nome', e.target.value)}
                required
                className="font-poppins"
              />
            </div>
            <div>
              <Label htmlFor="celular" className="font-poppins">Celular *</Label>
              <Input
                id="celular"
                value={formData.celular}
                onChange={(e) => handleChange('celular', e.target.value)}
                placeholder="(41) 99999-9999"
                required
                className="font-poppins"
              />
            </div>
            <div>
              <Label htmlFor="telefone_residencial" className="font-poppins">Telefone Residencial</Label>
              <Input
                id="telefone_residencial"
                value={formData.telefone_residencial || ''}
                onChange={(e) => handleChange('telefone_residencial', e.target.value)}
                placeholder="(41) 3333-4444"
                className="font-poppins"
              />
            </div>
            <div>
              <Label htmlFor="cep" className="font-poppins">CEP</Label>
              <Input
                id="cep"
                value={formData.cep || ''}
                onChange={(e) => handleChange('cep', e.target.value)}
                placeholder="80000-000"
                className="font-poppins"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="endereco" className="font-poppins">Endereço</Label>
              <Input
                id="endereco"
                value={formData.endereco || ''}
                onChange={(e) => handleChange('endereco', e.target.value)}
                className="font-poppins"
              />
            </div>
            <div>
              <Label htmlFor="cidade" className="font-poppins">Cidade</Label>
              <Input
                id="cidade"
                value={formData.cidade || ''}
                onChange={(e) => handleChange('cidade', e.target.value)}
                className="font-poppins"
              />
            </div>
            <div>
              <Label htmlFor="estado" className="font-poppins">Estado</Label>
              <Input
                id="estado"
                value={formData.estado || ''}
                onChange={(e) => handleChange('estado', e.target.value)}
                placeholder="PR"
                className="font-poppins"
              />
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

export default TutorForm;
