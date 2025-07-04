
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, Edit, Trash2, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CustomExpense {
  id: string;
  description: string;
  value: number;
  date: string;
  category: string;
}

interface CustomExpenseManagerProps {
  customExpenses: CustomExpense[];
  onAddExpense: (expense: Omit<CustomExpense, 'id'>) => void;
  onUpdateExpense: (id: string, expense: Partial<CustomExpense>) => void;
  onDeleteExpense: (id: string) => void;
}

const CustomExpenseManager = ({ customExpenses, onAddExpense, onUpdateExpense, onDeleteExpense }: CustomExpenseManagerProps) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<CustomExpense | null>(null);
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
    setEditingExpense(null);
  };

  const handleEdit = (expense: CustomExpense) => {
    setEditingExpense(expense);
    setFormData({
      description: expense.description,
      value: expense.value.toString(),
      date: expense.date,
      category: expense.category
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const expenseData = {
      description: formData.description,
      value: parseFloat(formData.value),
      date: formData.date,
      category: formData.category
    };

    if (editingExpense) {
      onUpdateExpense(editingExpense.id, expenseData);
      toast({
        title: "Despesa atualizada!",
        description: `${formData.description} foi atualizada.`,
      });
    } else {
      onAddExpense(expenseData);
      toast({
        title: "Despesa adicionada!",
        description: `${formData.description} foi adicionada às despesas.`,
      });
    }
    
    resetForm();
    setIsDialogOpen(false);
  };

  const totalCustomExpense = customExpenses.reduce((sum, expense) => sum + expense.value, 0);

  return (
    <Card className="bg-white/70 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Despesas Adicionais
            </CardTitle>
            <CardDescription>
              Total: R$ {totalCustomExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-red-600 hover:bg-red-700">
                <PlusCircle className="h-4 w-4 mr-2" />
                Adicionar Despesa
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingExpense ? "Editar Despesa" : "Nova Despesa"}</DialogTitle>
                <DialogDescription>
                  {editingExpense ? "Edite os dados da despesa." : "Adicione uma despesa adicional."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Ex: Compra de produtos"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Ex: Material"
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
                  {editingExpense ? "Atualizar" : "Adicionar"} Despesa
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {customExpenses.map((expense) => (
            <div key={expense.id} className="flex items-center justify-between p-3 border rounded-lg bg-white/50">
              <div>
                <p className="font-medium">{expense.description}</p>
                <p className="text-sm text-muted-foreground">{expense.category}</p>
                <p className="text-xs text-muted-foreground">{new Date(expense.date).toLocaleDateString('pt-BR')}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-red-600">
                  R$ {expense.value.toFixed(2)}
                </span>
                <Button variant="outline" size="sm" onClick={() => handleEdit(expense)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => onDeleteExpense(expense.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {customExpenses.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              Nenhuma despesa adicional cadastrada
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomExpenseManager;
