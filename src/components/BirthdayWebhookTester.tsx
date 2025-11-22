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
  const [loading, setLoading] = useState(false);
  const [webhookResults, setWebhookResults] = useState<WebhookResult[]>([]);

  useEffect(() => {
    checkBirthdays();
  }, []);

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

      const aniversariantes = pets?.filter((pet: Pet) => {
        if (!pet.data_aniversario) return false;
        
        const dataNascimento = new Date(pet.data_aniversario);
        const mesNascimento = String(dataNascimento.getMonth() + 1).padStart(2, '0');
        const diaNascimento = String(dataNascimento.getDate()).padStart(2, '0');
        
        return mesNascimento === mesHoje && diaNascimento === diaHoje;
      }) || [];

      setBirthdayPets(aniversariantes);
      
      if (aniversariantes.length === 0) {
        toast.info('Nenhum pet faz aniversário hoje');
      } else {
        toast.success(`${aniversariantes.length} pet(s) fazem aniversário hoje!`);
      }
    } catch (error) {
      console.error('Erro ao verificar aniversários:', error);
      toast.error('Erro ao verificar aniversários');
    } finally {
      setLoading(false);
    }
  };

  const sendWebhook = async (pet: Pet) => {
    const webhookUrl = 'https://hook.us1.make.com/w23dbn0tkpfl16wfrp5kzilt1052uwjj';
    
    try {
      const hoje = new Date();
      const dataNascimento = new Date(pet.data_aniversario);
      const idadeAtual = hoje.getFullYear() - dataNascimento.getFullYear();

      const webhookData = {
        pet_id: pet.id,
        nome_pet: pet.nome_pet,
        nome_tutor: pet.nome_tutor,
        data_aniversario: pet.data_aniversario,
        idade_atual: idadeAtual,
        especie: pet.especie,
        raca: pet.raca,
        data_envio: hoje.toISOString(),
        mensagem: `Hoje é aniversário de ${pet.nome_pet}! 🎉 Ele(a) está completando ${idadeAtual} anos.`
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData),
      });

      const result: WebhookResult = {
        pet_nome: pet.nome_pet,
        success: response.ok,
        status: response.status,
        timestamp: new Date().toISOString()
      };

      setWebhookResults(prev => [result, ...prev]);

      if (response.ok) {
        toast.success(`Webhook enviado para ${pet.nome_pet}`);
      } else {
        toast.error(`Erro ao enviar webhook para ${pet.nome_pet}`);
      }
    } catch (error) {
      console.error('Erro ao enviar webhook:', error);
      const result: WebhookResult = {
        pet_nome: pet.nome_pet,
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        timestamp: new Date().toISOString()
      };
      setWebhookResults(prev => [result, ...prev]);
      toast.error(`Erro ao enviar webhook para ${pet.nome_pet}`);
    }
  };

  const sendAllWebhooks = async () => {
    if (birthdayPets.length === 0) {
      toast.info('Nenhum pet faz aniversário hoje');
      return;
    }

    setLoading(true);
    for (const pet of birthdayPets) {
      await sendWebhook(pet);
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
      toast.success(`Verificação concluída: ${data.total_aniversariantes} aniversariantes encontrados`);
      
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

      {/* Pets de Aniversário */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cake className="h-5 w-5" />
            Aniversariantes de Hoje
          </CardTitle>
          <CardDescription>
            Pets que fazem aniversário hoje e precisam receber notificação
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
                    onClick={() => sendWebhook(pet)}
                    disabled={loading}
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Webhook
                  </Button>
                </div>
              ))}
              
              {birthdayPets.length > 1 && (
                <Button 
                  onClick={sendAllWebhooks}
                  disabled={loading}
                  className="w-full"
                  variant="default"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Todos os Webhooks ({birthdayPets.length})
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

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
