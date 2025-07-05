
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, PawPrint, LogOut, Plus, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import TutorAppointments from "./TutorAppointments";

interface TutorSchedulingProps {
  tutorData: { nome: string; telefone: string };
  onLogout: () => void;
}

const TutorScheduling = ({ tutorData, onLogout }: TutorSchedulingProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("novo");
  const [formData, setFormData] = useState({
    nomePet: "",
    racaPet: "",
    portePet: "",
    dataServico: "",
    horaServico: "",
    servicoRealizar: "",
    observacoes: ""
  });

  const racas = [
    "SRD", "Akita-Inu", "American Bully", "Border Collie", "Bull Terrier", 
    "Bulldog Francês", "Bulldog Inglês", "Cane Corso", "Chow Chow", 
    "Chihuahua", "Dogo Alemão", "Dogo Argentino", "Fila Brasileiro", 
    "Golden Retriever", "Husky Siberiano", "Kangal", "Pastor Alemão", 
    "Pastor Belga", "Pastor de Malinoa", "Pastor Malemano", "Pincher", 
    "Pit Bull", "Pit Monster", "Presa Canário", "Rottweiler Americano", 
    "Rottweiler Inglês", "Samoieda", "São Bernardo", "Schnauzer", 
    "Scottish Terrier", "Shiba-Inu"
  ].sort();

  const servicos = [
    "Banho", "Tosa", "Banho e Tosa", "Banho Medicamentoso", 
    "Hospedagem", "Pet Sitter", "Taxi Dog"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Aqui você integraria com Supabase para salvar o agendamento
    const agendamento = {
      tutor_nome: tutorData.nome,
      tutor_telefone: tutorData.telefone,
      pet_nome: formData.nomePet,
      pet_raca: formData.racaPet,
      pet_porte: formData.portePet,
      data_servico: formData.dataServico,
      hora_servico: formData.horaServico,
      servico: formData.servicoRealizar,
      observacoes: formData.observacoes,
      status: "Agendado"
    };

    console.log("Dados para enviar ao Supabase:", agendamento);

    // Reset form
    setFormData({
      nomePet: "",
      racaPet: "",
      portePet: "",
      dataServico: "",
      horaServico: "",
      servicoRealizar: "",
      observacoes: ""
    });

    toast({
      title: "Agendamento solicitado!",
      description: "Seu agendamento foi enviado e será confirmado em breve.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <img 
              src="/lovable-uploads/becdcf34-2926-47cf-86b4-0d3e413832f7.png" 
              alt="GabPetSallon" 
              className="h-12"
            />
            <div>
              <h1 className="text-2xl font-bold font-pacify bg-gradient-to-r from-brand-cyan to-brand-orange bg-clip-text text-transparent">
                Olá, {tutorData.nome}!
              </h1>
              <p className="text-gray-600 font-poppins">Gerencie os serviços para seus pets</p>
            </div>
          </div>
          <Button variant="outline" onClick={onLogout} className="flex items-center gap-2 border-brand-cyan hover:bg-brand-cyan hover:text-white">
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="novo" className="flex items-center gap-2 data-[state=active]:bg-brand-cyan data-[state=active]:text-white">
              <Plus className="h-4 w-4" />
              Novo Agendamento
            </TabsTrigger>
            <TabsTrigger value="meus" className="flex items-center gap-2 data-[state=active]:bg-brand-orange data-[state=active]:text-white">
              <Eye className="h-4 w-4" />
              Meus Agendamentos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="novo">
            <Card className="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm border-brand-cyan/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-brand-cyan">
                  <Calendar className="h-5 w-5" />
                  Novo Agendamento
                </CardTitle>
                <CardDescription>
                  Preencha os dados do seu pet e do serviço desejado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nomePet">Nome do Pet</Label>
                      <Input
                        id="nomePet"
                        value={formData.nomePet}
                        onChange={(e) => setFormData({ ...formData, nomePet: e.target.value })}
                        required
                        className="border-gray-300 focus:border-brand-cyan focus:ring-brand-cyan"
                      />
                    </div>
                    <div>
                      <Label htmlFor="racaPet">Raça</Label>
                      <Select value={formData.racaPet} onValueChange={(value) => setFormData({ ...formData, racaPet: value })}>
                        <SelectTrigger className="border-gray-300 focus:border-brand-cyan focus:ring-brand-cyan">
                          <SelectValue placeholder="Selecione a raça" />
                        </SelectTrigger>
                        <SelectContent>
                          {racas.map((raca) => (
                            <SelectItem key={raca} value={raca}>{raca}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="portePet">Porte</Label>
                      <Select value={formData.portePet} onValueChange={(value) => setFormData({ ...formData, portePet: value })}>
                        <SelectTrigger className="border-gray-300 focus:border-brand-cyan focus:ring-brand-cyan">
                          <SelectValue placeholder="Selecione o porte" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pequeno">Pequeno</SelectItem>
                          <SelectItem value="Médio">Médio</SelectItem>
                          <SelectItem value="Grande">Grande</SelectItem>
                          <SelectItem value="Gigante">Gigante</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="servicoRealizar">Serviço</Label>
                      <Select value={formData.servicoRealizar} onValueChange={(value) => setFormData({ ...formData, servicoRealizar: value })}>
                        <SelectTrigger className="border-gray-300 focus:border-brand-cyan focus:ring-brand-cyan">
                          <SelectValue placeholder="Selecione o serviço" />
                        </SelectTrigger>
                        <SelectContent>
                          {servicos.map((servico) => (
                            <SelectItem key={servico} value={servico}>{servico}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="dataServico">Data Preferida</Label>
                      <Input
                        id="dataServico"
                        type="date"
                        value={formData.dataServico}
                        onChange={(e) => setFormData({ ...formData, dataServico: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                        required
                        className="border-gray-300 focus:border-brand-cyan focus:ring-brand-cyan"
                      />
                    </div>
                    <div>
                      <Label htmlFor="horaServico">Horário Preferido</Label>
                      <Select value={formData.horaServico} onValueChange={(value) => setFormData({ ...formData, horaServico: value })}>
                        <SelectTrigger className="border-gray-300 focus:border-brand-cyan focus:ring-brand-cyan">
                          <SelectValue placeholder="Selecione o horário" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="08:00">08:00</SelectItem>
                          <SelectItem value="09:00">09:00</SelectItem>
                          <SelectItem value="10:00">10:00</SelectItem>
                          <SelectItem value="11:00">11:00</SelectItem>
                          <SelectItem value="13:00">13:00</SelectItem>
                          <SelectItem value="14:00">14:00</SelectItem>
                          <SelectItem value="15:00">15:00</SelectItem>
                          <SelectItem value="16:00">16:00</SelectItem>
                          <SelectItem value="17:00">17:00</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="observacoes">Observações</Label>
                    <Textarea
                      id="observacoes"
                      value={formData.observacoes}
                      onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                      placeholder="Alguma observação especial sobre seu pet ou preferência para o serviço?"
                      rows={3}
                      className="border-gray-300 focus:border-brand-cyan focus:ring-brand-cyan"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-brand-cyan to-brand-orange hover:from-brand-cyan/90 hover:to-brand-orange/90 text-white">
                    <PawPrint className="mr-2 h-4 w-4" />
                    Solicitar Agendamento
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="meus">
            <TutorAppointments tutorData={tutorData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TutorScheduling;
