
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Buscar webhooks pendentes para processar
    const { data: pendingWebhooks, error } = await supabaseClient
      .from('webhook_logs')
      .select('*')
      .is('http_status', null)
      .order('sent_at', { ascending: true })
      .limit(50);

    if (error) {
      console.error('Erro ao buscar webhooks pendentes:', error);
      return new Response(JSON.stringify({ error: 'Erro interno' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const results = [];

    for (const webhook of pendingWebhooks || []) {
      try {
        const response = await fetch(webhook.webhook_url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Event-Type': webhook.event_type,
          },
          body: JSON.stringify({
            event_type: webhook.event_type,
            event_data: webhook.event_data,
            timestamp: webhook.sent_at,
          }),
        });

        const responseBody = await response.text();

        // Atualizar o log do webhook com o resultado
        await supabaseClient
          .from('webhook_logs')
          .update({
            http_status: response.status,
            response_body: responseBody.substring(0, 1000), // Limitar tamanho
          })
          .eq('id', webhook.id);

        results.push({
          id: webhook.id,
          status: response.status,
          success: response.ok,
        });

      } catch (err) {
        console.error(`Erro ao processar webhook ${webhook.id}:`, err);
        
        // Atualizar com erro
        await supabaseClient
          .from('webhook_logs')
          .update({
            http_status: 0,
            error_message: err.message,
          })
          .eq('id', webhook.id);

        results.push({
          id: webhook.id,
          status: 0,
          success: false,
          error: err.message,
        });
      }
    }

    return new Response(JSON.stringify({
      processed: results.length,
      results,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erro geral:', error);
    return new Response(JSON.stringify({ error: 'Erro interno do servidor' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
