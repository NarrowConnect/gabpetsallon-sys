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

    // Obter data de hoje no formato YYYY-MM-DD
    const hoje = new Date();
    const mesHoje = String(hoje.getMonth() + 1).padStart(2, '0');
    const diaHoje = String(hoje.getDate()).padStart(2, '0');

    console.log(`Verificando aniversários para ${diaHoje}/${mesHoje}`);

    // Buscar todos os pets que fazem aniversário hoje
    const { data: pets, error: petsError } = await supabase
      .from('pets')
      .select('*')
      .not('data_aniversario', 'is', null);

    if (petsError) {
      console.error('Erro ao buscar pets:', petsError);
      throw petsError;
    }

    // Filtrar pets que fazem aniversário hoje
    const petsAniversariantes = pets?.filter((pet: Pet) => {
      if (!pet.data_aniversario) return false;
      
      const dataNascimento = new Date(pet.data_aniversario);
      const mesNascimento = String(dataNascimento.getMonth() + 1).padStart(2, '0');
      const diaNascimento = String(dataNascimento.getDate()).padStart(2, '0');
      
      return mesNascimento === mesHoje && diaNascimento === diaHoje;
    }) || [];

    console.log(`Encontrados ${petsAniversariantes.length} aniversariantes`);

    // Enviar webhook para cada pet aniversariante
    const webhookUrl = 'https://hook.us1.make.com/w23dbn0tkpfl16wfrp5kzilt1052uwjj';
    const results = [];

    for (const pet of petsAniversariantes) {
      try {
        // Calcular idade atual
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

        console.log('Enviando webhook para:', pet.nome_pet);

        const webhookResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookData),
        });

        const webhookStatus = webhookResponse.status;
        const webhookBody = await webhookResponse.text();

        console.log(`Webhook enviado para ${pet.nome_pet}: Status ${webhookStatus}`);

        results.push({
          pet_nome: pet.nome_pet,
          success: webhookResponse.ok,
          status: webhookStatus,
          response: webhookBody
        });

      } catch (error) {
        console.error(`Erro ao enviar webhook para ${pet.nome_pet}:`, error);
        results.push({
          pet_nome: pet.nome_pet,
          success: false,
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        data_verificacao: `${diaHoje}/${mesHoje}/${hoje.getFullYear()}`,
        total_aniversariantes: petsAniversariantes.length,
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
