import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Phone, User, Calendar, Heart, Dog, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import TutorSearch from "./TutorSearch";
import TutorRegistration from "./TutorRegistration";
import dogBreedsImage from "@/assets/dog-breeds-collection.jpg";

const TutorLogin = () => {
  const [currentView, setCurrentView] = useState<'login' | 'search' | 'register'>('login');
  const [tutorPhone, setTutorPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async () => {
    if (!tutorPhone.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, informe seu telefone.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simular verificação de tutor
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentView('search');
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível fazer o login. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (currentView === 'search') {
      return <TutorSearch onTutorSelected={() => {}} onCreateNew={() => setCurrentView('register')} />;
    }
    
    if (currentView === 'register') {
      return <TutorRegistration onTutorCreated={() => setCurrentView('login')} onCancel={() => setCurrentView('login')} />;
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-4 py-6 md:py-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6 md:mb-8">
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-3 md:p-4 rounded-full w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 flex items-center justify-center">
              <Heart className="h-8 w-8 md:h-10 md:w-10 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 font-poppins mb-2">Portal do Tutor</h1>
            <p className="text-sm md:text-base text-gray-600 font-poppins">Acesse seus agendamentos e serviços</p>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="flex items-center justify-center gap-2 font-poppins text-xl">
                <User className="h-5 w-5 text-blue-600" />
                Login do Tutor
              </CardTitle>
              <CardDescription className="font-poppins">
                Digite seu telefone para acessar sua conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="phone" className="font-poppins font-medium">Telefone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(41) 99999-9999"
                    value={tutorPhone}
                    onChange={(e) => setTutorPhone(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <Button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-poppins font-semibold py-3"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Acessando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Acessar Agendamentos
                  </div>
                )}
              </Button>

              <Separator className="my-6" />

              <div className="space-y-3">
                <Button
                  variant="outline"
                  onClick={() => setCurrentView('register')}
                  className="w-full border-green-300 text-green-700 hover:bg-green-50 font-poppins"
                >
                  <div className="flex items-center gap-2">
                    <Dog className="h-4 w-4" />
                    Cadastrar-se como Tutor
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Imagem decorativa dos pets */}
          <div className="mt-8 text-center">
            <img 
              src={dogBreedsImage} 
              alt="Diferentes raças de cães" 
              className="w-full max-w-sm mx-auto rounded-lg shadow-lg opacity-80"
            />
            <p className="text-sm text-gray-500 mt-2 font-poppins">
              Cuidamos do seu melhor amigo com carinho e dedicação
            </p>
          </div>
        </div>
      </div>
    );
  };

  return renderContent();
};

export default TutorLogin;