
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock, User, PawPrint } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LoginPageProps {
  onLogin: (userType: 'admin' | 'tutor', userData?: any) => void;
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const { toast } = useToast();
  const [adminForm, setAdminForm] = useState({ email: "", password: "" });
  const [tutorForm, setTutorForm] = useState({ nome: "", telefone: "" });

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você integraria com Supabase Auth
    if (adminForm.email && adminForm.password) {
      onLogin('admin');
      toast({
        title: "Login realizado!",
        description: "Bem-vindo ao painel administrativo.",
      });
    }
  };

  const handleTutorLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você buscaria o tutor no Supabase
    if (tutorForm.nome && tutorForm.telefone) {
      onLogin('tutor', { nome: tutorForm.nome, telefone: tutorForm.telefone });
      toast({
        title: "Acesso liberado!",
        description: `Olá ${tutorForm.nome}, você pode agendar serviços para seus pets.`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img 
            src="/lovable-uploads/becdcf34-2926-47cf-86b4-0d3e413832f7.png" 
            alt="GabPetSallon" 
            className="h-16 mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold font-pacify bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
            GabPetSallon
          </h1>
          <p className="text-gray-600 font-poppins">Sistema para controle da empresa</p>
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
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Entrar como Admin
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
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Acessar Agendamentos
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
