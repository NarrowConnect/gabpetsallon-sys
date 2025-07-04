
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, Edit, Trash2, Receipt } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CustomIncome {
  id: string;
  description: string;
  value: number;
  date: string;
  category: string;
}

interface CustomIncomeManagerProps {
  customIncomes: CustomIncome[];
  onAddIncome: (income: Omit<CustomIncome, 'id'>) => void;
  onUpdateIncome: (id: string, income: Partial<CustomIncome>) => void;
  onDeleteIncome: (id: string) => void;
}

const CustomIncomeManager = ({ customIncomes, onAddIncome, onUpdateIncome, onDeleteIncome }: CustomIncomeManagerProps) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<CustomIncome | null>(null);
  const [formData, setFormData] = useState({
    description: "",
    value: "",
    date: "",
    category: ""
  });

  const resetForm = () => {
    setFormData({
      description: "",
      value: "",
      date: "",
      category: ""
    });
    setEditingIncome(null);
  };

  const handleEdit = (income: CustomIncome) => {
    setEditingIncome(income);
    setFormData({
      description: income.description,
      value: income.value.toString(),
      date: income.date,
      category: income.category
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const incomeData = {
      description: formData.description,
      value: parseFloat(formData.value),
      date: formData.date,
      category: formData.category
    };

    if (editingIncome) {
      onUpdateIncome(editingIncome.id, incomeData);
      toast({
        title: "Receita atualizada!",
        description: `${formData.description} foi atualizada.`,
      });
    } else {
      onAddIncome(incomeData);
      toast({
        title: "Receita adicionada!",
        description: `${formData.description} foi adicionada às receitas.`,
      });
    }
    
    resetForm();
    setIsDialogOpen(false);
  };

  const totalCustomIncome = customIncomes.reduce((sum, income) => sum + income.value, 0);

  return (
    <Card className="bg-white/70 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Receitas Personalizadas
            </CardTitle>
            <CardDescription>
              Total: R$ {totalCustomIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                <PlusCircle className="h-4 w-4 mr-2" />
                Adicionar Receita
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingIncome ? "Editar Receita" : "Nova Receita"}</DialogTitle>
                <DialogDescription>
                  {editingIncome ? "Edite os dados da receita." : "Adicione uma receita personalizada."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Ex: Banho + Hidratação"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Ex: Banho Especial"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="value">Valor (R$)</Label>
                    <Input
                      id="value"
                      type="number"
                      step="0.01"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="date">Data</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  {editingIncome ? "Atualizar" : "Adicionar"} Receita
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {customIncomes.map((income) => (
            <div key={income.id} className="flex items-center justify-between p-3 border rounded-lg bg-white/50">
              <div>
                <p className="font-medium">{income.description}</p>
                <p className="text-sm text-muted-foreground">{income.category}</p>
                <p className="text-xs text-muted-foreground">{new Date(income.date).toLocaleDateString('pt-BR')}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-green-600">
                  R$ {income.value.toFixed(2)}
                </span>
                <Button variant="outline" size="sm" onClick={() => handleEdit(income)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => onDeleteIncome(income.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {customIncomes.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              Nenhuma receita personalizada cadastrada
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomIncomeManager;
