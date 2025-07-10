
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock, User, PawPrint, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import TutorRegistration from "./TutorRegistration";

interface LoginPageProps {
  onLogin: (userType: 'admin' | 'tutor', userData?: any) => void;
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const { toast } = useToast();
  const [adminForm, setAdminForm] = useState({ email: "", password: "" });
  const [tutorForm, setTutorForm] = useState({ nome: "", telefone: "" });
  const [showRegistration, setShowRegistration] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Buscar admin na tabela usuarios_admin
      const { data: adminData, error } = await supabase
        .from('usuarios_admin')
        .select('*')
        .eq('email', adminForm.email)
        .eq('ativo', true)
        .single();

      if (error || !adminData) {
        toast({
          title: "Erro de Login",
          description: "Email não encontrado ou usuário inativo.",
          variant: "destructive"
        });
        return;
      }

      // Aqui você poderia implementar verificação de senha hash
      // Por agora, vamos usar uma validação simples
      if (adminForm.password === adminData.senha_hash) { // Substitua por verificação real
        onLogin('admin', adminData);
        toast({
          title: "Login realizado!",
          description: "Bem-vindo ao painel administrativo.",
        });
      } else {
        toast({
          title: "Erro de Login",
          description: "Senha incorreta.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erro no login admin:', error);
      toast({
        title: "Erro",
        description: "Erro interno do servidor.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

const handleTutorLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    // Normalize the data to search correctly.
    const nomeNormalizado = tutorForm.nome.trim();
    const celularNormalizado = tutorForm.telefone.replace(/\D/g, '');

    // Adjust the query to match the new table structure.
    const { data: tutorData, error } = await supabase
      .from('tutores')
      .select('*')
      .eq('nome', nomeNormalizado)
      .eq('celular', celularNormalizado)
      .single();  // Fetch a single record only

    if (error || !tutorData) {
      toast({
        title: "Tutor não encontrado",
        description: "Dados não encontrados. Deseja criar um novo cadastro?",
        variant: "destructive"
      });
      setShowRegistration(true);
      return;
    }

    onLogin('tutor', tutorData);
    toast({
      title: "Acesso liberado!",
      description: `Olá ${tutorData.nome}, você pode agendar serviços para seus pets.`,
    });
  } catch (error) {
    console.error('Erro no login tutor:', error);
    toast({
      title: "Erro",
      description: "Erro interno do servidor.",
      variant: "destructive"
    });
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img 
            src="https://i.ibb.co/pB99tpqL/Marca-Vertical.png" 
            alt="GabPetSallon" 
            className="h-20 mx-auto mb-4"
          />
          <p className="text-gray-600 font-poppins">Acesso ao Sistema</p>
        </div>

        <Tabs defaultValue="admin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Admin
            </TabsTrigger>
            <TabsTrigger value="tutor" className="flex items-center gap-2">
              <PawPrint className="h-4 w-4" />
              Tutor
            </TabsTrigger>
          </TabsList>

          <TabsContent value="admin">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Login Administrativo
                </CardTitle>
                <CardDescription>
                  Acesse o painel completo de gestão
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="admin-email">Email</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      value={adminForm.email}
                      onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="admin-password">Senha</Label>
                    <Input
                      id="admin-password"
                      type="password"
                      value={adminForm.password}
                      onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                      required
                      disabled={loading}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Entrando..." : "Entrar como Admin"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tutor">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PawPrint className="h-5 w-5" />
                  Acesso do Tutor
                </CardTitle>
                <CardDescription>
                  Agende serviços para seus pets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTutorLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="tutor-nome">Seu Nome</Label>
                    <Input
                      id="tutor-nome"
                      value={tutorForm.nome}
                      onChange={(e) => setTutorForm({ ...tutorForm, nome: e.target.value })}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tutor-telefone">Telefone</Label>
                    <Input
                      id="tutor-telefone"
                      value={tutorForm.telefone}
                      onChange={(e) => setTutorForm({ ...tutorForm, telefone: e.target.value })}
                      placeholder="(41) 99999-9999"
                      required
                      disabled={loading}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Verificando..." : "Acessar Agendamentos"}
                  </Button>
                  <Button 
                    type="button" 
                    className="w-full border border-gray-300 bg-transparent text-gray-800 hover:bg-gray-100"
                    onClick={() => setShowRegistration(true)}
                    disabled={loading}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Novo Cadastro
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LoginPage;
