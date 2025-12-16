import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Obter data de hoje e data daqui a 3 dias
    const hoje = new Date();
    const tresAntes = new Date(hoje);
    tresAntes.setDate(tresAntes.getDate() + 3);

    const mesHoje = String(hoje.getMonth() + 1).padStart(2, '0');
    const diaHoje = String(hoje.getDate()).padStart(2, '0');
    
    const mesTresAntes = String(tresAntes.getMonth() + 1).padStart(2, '0');
    const diaTresAntes = String(tresAntes.getDate()).padStart(2, '0');

    console.log(`Verificando aniversários para hoje: ${diaHoje}/${mesHoje}`);
    console.log(`Verificando aniversários para daqui a 3 dias: ${diaTresAntes}/${mesTresAntes}`);

    // Buscar todos os pets que têm data de aniversário
    const { data: pets, error: petsError } = await supabase
      .from('pets')
      .select('*')
      .not('data_aniversario', 'is', null);

    if (petsError) {
      console.error('Erro ao buscar pets:', petsError);
      throw petsError;
    }

    // Buscar todos os tutores para obter email e whatsapp
    const { data: tutores, error: tutoresError } = await supabase
      .from('tutores')
      .select('id, nome, celular, email');

    if (tutoresError) {
      console.error('Erro ao buscar tutores:', tutoresError);
    }

    const tutoresList: Tutor[] = tutores || [];

    // Função para buscar informações do tutor
    const getTutorInfo = (pet: Pet) => {
      const tutor = tutoresList.find(t => t.nome === pet.nome_tutor || t.id === pet.tutor_id);
      return {
        email: tutor?.email || null,
        whatsapp: tutor?.celular || null
      };
    };

    // Filtrar pets que fazem aniversário hoje
    const petsHoje = pets?.filter((pet: Pet) => {
      const mesNascimento = String(dataNascimento.getMonth() + 1).padStart(2, '0');
      const diaNascimento = String(dataNascimento.getDate()).padStart(2, '0');
      
      return mesNascimento === mesHoje && diaNascimento === diaHoje;
    }) || [];

    // Filtrar pets que fazem aniversário daqui a 3 dias
    const petsTresAntes = pets?.filter((pet: Pet) => {
      if (!pet.data_aniversario) return false;
      
      const dataNascimento = new Date(pet.data_aniversario);
      const mesNascimento = String(dataNascimento.getMonth() + 1).padStart(2, '0');
      const diaNascimento = String(dataNascimento.getDate()).padStart(2, '0');
      
      return mesNascimento === mesTresAntes && diaNascimento === diaTresAntes;
    }) || [];

    console.log(`Encontrados ${petsHoje.length} aniversariantes hoje`);
    console.log(`Encontrados ${petsTresAntes.length} aniversariantes daqui a 3 dias`);

    // Enviar webhooks para ambas as datas
    const webhookUrl = 'https://hook.us1.make.com/w23dbn0tkpfl16wfrp5kzilt1052uwjj';
    const results = [];

    // Processar pets que fazem aniversário hoje
    for (const pet of petsHoje) {
      try {
        const dataNascimento = new Date(pet.data_aniversario);
        const idadeAtual = hoje.getFullYear() - dataNascimento.getFullYear();
        const tutorInfo = getTutorInfo(pet);

        const webhookData = {
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

        console.log('Enviando webhook HOJE para:', pet.nome_pet);

        const webhookResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookData),
        });

        const webhookStatus = webhookResponse.status;
        const webhookBody = await webhookResponse.text();

        console.log(`Webhook HOJE enviado para ${pet.nome_pet}: Status ${webhookStatus}`);

        results.push({
          pet_nome: pet.nome_pet,
          tipo: 'hoje',
          success: webhookResponse.ok,
          status: webhookStatus,
          response: webhookBody
        });

      } catch (error) {
        console.error(`Erro ao enviar webhook HOJE para ${pet.nome_pet}:`, error);
        results.push({
          pet_nome: pet.nome_pet,
          tipo: 'hoje',
          success: false,
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        });
      }
    }

    // Processar pets que farão aniversário daqui a 3 dias
    for (const pet of petsTresAntes) {
      try {
        const dataNascimento = new Date(pet.data_aniversario);
        const idadeFutura = tresAntes.getFullYear() - dataNascimento.getFullYear();
        const tutorInfo = getTutorInfo(pet);

        const webhookData = {
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
          mensagem: `🎂 Em 3 dias ${pet.nome_pet} fará aniversário! Ele(a) completará ${idadeFutura} anos no dia ${diaTresAntes}/${mesTresAntes}.`
        };

        console.log('Enviando webhook 3 DIAS ANTES para:', pet.nome_pet);

        const webhookResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookData),
        });

        const webhookStatus = webhookResponse.status;
        const webhookBody = await webhookResponse.text();

        console.log(`Webhook 3 DIAS ANTES enviado para ${pet.nome_pet}: Status ${webhookStatus}`);

        results.push({
          pet_nome: pet.nome_pet,
          tipo: '3_dias_antes',
          success: webhookResponse.ok,
          status: webhookStatus,
          response: webhookBody
        });

      } catch (error) {
        console.error(`Erro ao enviar webhook 3 DIAS ANTES para ${pet.nome_pet}:`, error);
        results.push({
          pet_nome: pet.nome_pet,
          tipo: '3_dias_antes',
          success: false,
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        data_verificacao: `${diaHoje}/${mesHoje}/${hoje.getFullYear()}`,
        data_lembrete: `${diaTresAntes}/${mesTresAntes}/${tresAntes.getFullYear()}`,
        total_aniversariantes_hoje: petsHoje.length,
        total_lembretes_3_dias: petsTresAntes.length,
        total_webhooks_enviados: results.length,
        resultados: results
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Erro na função birthday-checker:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
