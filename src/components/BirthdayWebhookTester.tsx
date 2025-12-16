import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { Send, RefreshCw, Cake, CheckCircle, AlertCircle } from "lucide-react";

interface Pet {
  id: string;
  nome_pet: string;
  nome_tutor: string;
  data_aniversario: string;
  especie: string;
  raca: string;
  idade: number;
  tutor_id: string | null;
}

interface Tutor {
  id: string;
  nome: string;
  celular: string;
  email: string | null;
}

interface WebhookResult {
  pet_nome: string;
  success: boolean;
  status?: number;
  error?: string;
  timestamp: string;
}

export default function BirthdayWebhookTester() {
  const [birthdayPets, setBirthdayPets] = useState<Pet[]>([]);
  const [reminderPets, setReminderPets] = useState<Pet[]>([]);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(false);
  const [webhookResults, setWebhookResults] = useState<WebhookResult[]>([]);

  useEffect(() => {
    fetchTutors();
    checkBirthdays();
  }, []);

  const fetchTutors = async () => {
    const { data } = await supabase.from('tutores').select('id, nome, celular, email');
    setTutors((data as Tutor[]) || []);
  };

  const getTutorInfo = (pet: Pet) => {
    const tutor = tutors.find(t => t.nome === pet.nome_tutor || t.id === pet.tutor_id);
    return {
      email: tutor?.email || null,
      whatsapp: tutor?.celular || null
    };
  };

  const checkBirthdays = async () => {
    setLoading(true);
    try {
      const { data: pets, error } = await supabase
        .from('pets')
        .select('*')
        .not('data_aniversario', 'is', null);

      if (error) throw error;

      // Filtrar pets que fazem aniversário hoje
      const hoje = new Date();
      const mesHoje = String(hoje.getMonth() + 1).padStart(2, '0');
      const diaHoje = String(hoje.getDate()).padStart(2, '0');

      // Data daqui a 3 dias
      const tresAntes = new Date(hoje);
      tresAntes.setDate(tresAntes.getDate() + 3);
      const mesTresAntes = String(tresAntes.getMonth() + 1).padStart(2, '0');
      const diaTresAntes = String(tresAntes.getDate()).padStart(2, '0');

      const aniversariantes = pets?.filter((pet: Pet) => {
        if (!pet.data_aniversario) return false;
        
        const dataNascimento = new Date(pet.data_aniversario);
        const mesNascimento = String(dataNascimento.getMonth() + 1).padStart(2, '0');
        const diaNascimento = String(dataNascimento.getDate()).padStart(2, '0');
        
        return mesNascimento === mesHoje && diaNascimento === diaHoje;
      }) || [];

      const lembretes = pets?.filter((pet: Pet) => {
        if (!pet.data_aniversario) return false;
        
        const dataNascimento = new Date(pet.data_aniversario);
        const mesNascimento = String(dataNascimento.getMonth() + 1).padStart(2, '0');
        const diaNascimento = String(dataNascimento.getDate()).padStart(2, '0');
        
        return mesNascimento === mesTresAntes && diaNascimento === diaTresAntes;
      }) || [];

      setBirthdayPets(aniversariantes);
      setReminderPets(lembretes);
      
      const totalPets = aniversariantes.length + lembretes.length;
      if (totalPets === 0) {
        toast.info('Nenhum pet faz aniversário hoje ou nos próximos 3 dias');
      } else {
        toast.success(`${aniversariantes.length} hoje, ${lembretes.length} em 3 dias`);
      }
    } catch (error) {
      console.error('Erro ao verificar aniversários:', error);
      toast.error('Erro ao verificar aniversários');
    } finally {
      setLoading(false);
    }
  };

  const sendWebhook = async (pet: Pet, tipo: 'hoje' | '3_dias_antes') => {
    const webhookUrl = 'https://hook.us1.make.com/w23dbn0tkpfl16wfrp5kzilt1052uwjj';
    
    try {
      const hoje = new Date();
      const dataNascimento = new Date(pet.data_aniversario);
      const idadeAtual = hoje.getFullYear() - dataNascimento.getFullYear();
      const tutorInfo = getTutorInfo(pet);

      let webhookData;
      if (tipo === 'hoje') {
        webhookData = {
          tipo_notificacao: 'aniversario_hoje',
          pet_id: pet.id,
          nome_pet: pet.nome_pet,
          nome_tutor: pet.nome_tutor,
          tutor_email: tutorInfo.email,
          tutor_whatsapp: tutorInfo.whatsapp,
          data_aniversario: pet.data_aniversario,
          idade_atual: idadeAtual,
          especie: pet.especie,
          raca: pet.raca,
          data_envio: hoje.toISOString(),
          mensagem: `🎉 Hoje é aniversário de ${pet.nome_pet}! Ele(a) está completando ${idadeAtual} anos.`
        };
      } else {
        const tresAntes = new Date(hoje);
        tresAntes.setDate(tresAntes.getDate() + 3);
        const idadeFutura = tresAntes.getFullYear() - dataNascimento.getFullYear();
        
        webhookData = {
          tipo_notificacao: 'lembrete_3_dias',
          pet_id: pet.id,
          nome_pet: pet.nome_pet,
          nome_tutor: pet.nome_tutor,
          tutor_email: tutorInfo.email,
          tutor_whatsapp: tutorInfo.whatsapp,
          data_aniversario: pet.data_aniversario,
          idade_futura: idadeFutura,
          especie: pet.especie,
          raca: pet.raca,
          data_envio: hoje.toISOString(),
          data_aniversario_real: tresAntes.toISOString().split('T')[0],
          mensagem: `🎂 Em 3 dias ${pet.nome_pet} fará aniversário! Ele(a) completará ${idadeFutura} anos.`
        };
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData),
      });

      const result: WebhookResult = {
        pet_nome: `${pet.nome_pet} (${tipo === 'hoje' ? 'Hoje' : '3 dias antes'})`,
        success: response.ok,
        status: response.status,
        timestamp: new Date().toISOString()
      };

      setWebhookResults(prev => [result, ...prev]);

      if (response.ok) {
        toast.success(`Webhook ${tipo === 'hoje' ? 'de hoje' : 'de lembrete'} enviado para ${pet.nome_pet}`);
      } else {
        toast.error(`Erro ao enviar webhook para ${pet.nome_pet}`);
      }
    } catch (error) {
      console.error('Erro ao enviar webhook:', error);
      const result: WebhookResult = {
        pet_nome: `${pet.nome_pet} (${tipo === 'hoje' ? 'Hoje' : '3 dias antes'})`,
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        timestamp: new Date().toISOString()
      };
      setWebhookResults(prev => [result, ...prev]);
      toast.error(`Erro ao enviar webhook para ${pet.nome_pet}`);
    }
  };

  const sendAllWebhooks = async () => {
    const totalPets = birthdayPets.length + reminderPets.length;
    if (totalPets === 0) {
      toast.info('Nenhum pet para enviar webhook');
      return;
    }

    setLoading(true);
    for (const pet of birthdayPets) {
      await sendWebhook(pet, 'hoje');
    }
    for (const pet of reminderPets) {
      await sendWebhook(pet, '3_dias_antes');
    }
    setLoading(false);
    toast.success('Todos os webhooks foram processados');
  };

  const testBirthdayChecker = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('birthday-checker');
      
      if (error) throw error;
      
      console.log('Resposta do birthday-checker:', data);
      toast.success(`Verificação: ${data.total_aniversariantes_hoje} hoje, ${data.total_lembretes_3_dias} em 3 dias`);
      
      // Atualizar a lista após verificar
      checkBirthdays();
    } catch (error) {
      console.error('Erro ao executar birthday-checker:', error);
      toast.error('Erro ao executar verificação automática');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Cake className="h-7 w-7 text-brand-yellow" />
            Webhook de Aniversários
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Teste e monitore envios de notificações de aniversário
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button 
            onClick={checkBirthdays} 
            disabled={loading}
            className="w-full sm:w-auto"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button 
            onClick={testBirthdayChecker}
            disabled={loading}
            className="w-full sm:w-auto"
            variant="outline"
          >
            <Send className="h-4 w-4 mr-2" />
            Testar Edge Function
          </Button>
        </div>
      </div>

      {/* Pets de Aniversário Hoje */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cake className="h-5 w-5 text-brand-cyan" />
            Aniversariantes de Hoje
          </CardTitle>
          <CardDescription>
            Pets que fazem aniversário hoje - webhook enviado no dia
          </CardDescription>
        </CardHeader>
        <CardContent>
          {birthdayPets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Cake className="h-16 w-16 mx-auto mb-4 opacity-20" />
              <p>Nenhum pet faz aniversário hoje</p>
            </div>
          ) : (
            <div className="space-y-4">
              {birthdayPets.map((pet) => (
                <div 
                  key={pet.id} 
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border rounded-lg bg-card"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      🎂 {pet.nome_pet}
                      <Badge variant="secondary">
                        {pet.idade ? `${pet.idade} anos` : 'N/A'}
                      </Badge>
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Tutor: {pet.nome_tutor}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {pet.especie} • {pet.raca}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Data de Nascimento: {new Date(pet.data_aniversario).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <Button 
                    onClick={() => sendWebhook(pet, 'hoje')}
                    disabled={loading}
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Webhook
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pets com Lembrete 3 Dias Antes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cake className="h-5 w-5 text-brand-yellow" />
            Aniversariantes em 3 Dias
          </CardTitle>
          <CardDescription>
            Pets que farão aniversário em 3 dias - webhook de lembrete
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reminderPets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Cake className="h-16 w-16 mx-auto mb-4 opacity-20" />
              <p>Nenhum pet fará aniversário em 3 dias</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reminderPets.map((pet) => (
                <div 
                  key={pet.id} 
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border rounded-lg bg-card"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      🎂 {pet.nome_pet}
                      <Badge variant="outline" className="bg-yellow-50">
                        Em 3 dias
                      </Badge>
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Tutor: {pet.nome_tutor}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {pet.especie} • {pet.raca}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Data de Nascimento: {new Date(pet.data_aniversario).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <Button 
                    onClick={() => sendWebhook(pet, '3_dias_antes')}
                    disabled={loading}
                    size="sm"
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Lembrete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Botão para enviar todos */}
      {(birthdayPets.length > 0 || reminderPets.length > 0) && (
        <Button 
          onClick={sendAllWebhooks}
          disabled={loading}
          className="w-full"
          size="lg"
        >
          <Send className="h-4 w-4 mr-2" />
          Enviar Todos os Webhooks ({birthdayPets.length + reminderPets.length})
        </Button>
      )}

      {/* Logs de Envio */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Envios</CardTitle>
          <CardDescription>
            Últimos webhooks enviados nesta sessão
          </CardDescription>
        </CardHeader>
        <CardContent>
          {webhookResults.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nenhum webhook enviado ainda</p>
            </div>
          ) : (
            <div className="space-y-2">
              {webhookResults.map((result, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg bg-card"
                >
                  <div className="flex items-center gap-3">
                    {result.success ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                    <div>
                      <p className="font-medium">{result.pet_nome}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(result.timestamp).toLocaleString('pt-BR')}
                      </p>
                      {result.error && (
                        <p className="text-xs text-red-500">{result.error}</p>
                      )}
                    </div>
                  </div>
                  {result.status && (
                    <Badge variant={result.success ? "default" : "destructive"}>
                      {result.status}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
