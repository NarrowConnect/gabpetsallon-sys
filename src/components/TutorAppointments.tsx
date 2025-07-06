
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, PawPrint, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TutorAppointmentsProps {
  tutorData: { id: string; nome: string; celular: string };
}

interface Agendamento {
  id: string;
  pet_nome: string;
  pet_raca: string | null;
  pet_porte: string | null;
  servico: string;
  data_servico: string;
  hora_servico: string;
  status: string | null;
  observacoes: string | null;
  observacoes_admin: string | null;
  created_at: string | null;
  data_resposta: string | null;
}

const TutorAppointments = ({ tutorData }: TutorAppointmentsProps) => {
  const { toast } = useToast();
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAgendamentos = async () => {
    try {
      setLoading(true);
      console.log('Buscando agendamentos para tutor:', tutorData.celular);
      
      const { data, error } = await supabase
        .from('agendamentos_tutores')
        .select('*')
        .eq('tutor_telefone', tutorData.celular)
        .order('data_servico', { ascending: true });

      if (error) {
        console.error('Erro ao buscar agendamentos:', error);
        throw error;
      }

      console.log('Agendamentos encontrados:', data);
      setAgendamentos(data || []);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
      toast({
        title: "Erro ao carregar agendamentos",
        description: "Não foi possível carregar seus agendamentos.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgendamentos();

    // Configurar realtime subscription
    const subscription = supabase
      .channel('agendamentos-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'agendamentos_tutores',
          filter: `tutor_telefone=eq.${tutorData.celular}`
        }, 
        (payload) => {
          console.log('Mudança detectada nos agendamentos:', payload);
          fetchAgendamentos();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [tutorData.celular]);

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case 'Confirmado':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Cancelado':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'Solicitado':
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'Confirmado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Cancelado':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Solicitado':
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-cyan"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="h-5 w-5 text-brand-cyan" />
        <h2 className="text-xl font-semibold">Meus Agendamentos</h2>
      </div>

      {agendamentos.length === 0 ? (
        <Card className="text-center py-8 bg-white/90 backdrop-blur-sm">
          <CardContent>
            <PawPrint className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Você ainda não possui agendamentos.</p>
            <p className="text-sm text-gray-500 mt-2">
              Use a aba "Novo Agendamento" para solicitar um serviço.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {agendamentos.map((agendamento) => (
            <Card key={agendamento.id} className="bg-white/90 backdrop-blur-sm border-l-4 border-l-brand-cyan">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <PawPrint className="h-5 w-5 text-brand-cyan" />
                    {agendamento.pet_nome}
                  </CardTitle>
                  <Badge className={`${getStatusColor(agendamento.status)} flex items-center gap-1`}>
                    {getStatusIcon(agendamento.status)}
                    {agendamento.status || 'Solicitado'}
                  </Badge>
                </div>
                <CardDescription>
                  {agendamento.pet_raca} • {agendamento.pet_porte}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{formatDate(agendamento.data_servico)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{agendamento.hora_servico}</span>
                  </div>
                </div>
                
                <div>
                  <p className="font-medium text-brand-orange">{agendamento.servico}</p>
                </div>

                {agendamento.observacoes && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Suas observações:</p>
                    <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{agendamento.observacoes}</p>
                  </div>
                )}

                {agendamento.observacoes_admin && (
                  <div>
                    <p className="text-sm font-medium text-brand-cyan">Resposta do Pet Saloon:</p>
                    <p className="text-sm text-gray-600 bg-brand-cyan/10 p-2 rounded">{agendamento.observacoes_admin}</p>
                  </div>
                )}

                <div className="text-xs text-gray-500 pt-2 border-t">
                  Solicitado em: {agendamento.created_at ? new Date(agendamento.created_at).toLocaleString('pt-BR') : 'N/A'}
                  {agendamento.data_resposta && (
                    <span className="ml-4">
                      Respondido em: {new Date(agendamento.data_resposta).toLocaleString('pt-BR')}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TutorAppointments;
