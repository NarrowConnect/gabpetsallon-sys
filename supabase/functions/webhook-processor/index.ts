import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch pending webhooks to process
    const { data: pendingWebhooks, error } = await supabase
      .from('webhook_logs')
      .select('*')
      .is('http_status', null)
      .order('sent_at', { ascending: true })
      .limit(50);

    if (error) {
      console.error('Error fetching pending webhooks:', error);
      return new Response(JSON.stringify({ error: 'Internal error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const results = [];

    for (const webhook of pendingWebhooks || []) {
      try {
        console.log(`Processing webhook ${webhook.id} to ${webhook.webhook_url}`);
        
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
        console.log(`Webhook ${webhook.id} response: ${response.status}`);

        // Update the webhook log with the result
        await supabase
          .from('webhook_logs')
          .update({
            http_status: response.status,
            response_body: responseBody.substring(0, 1000), // Limit size
          })
          .eq('id', webhook.id);

        results.push({
          id: webhook.id,
          status: response.status,
          success: response.ok,
        });

      } catch (err) {
        console.error(`Error processing webhook ${webhook.id}:`, err);
        
        // Update with error
        await supabase
          .from('webhook_logs')
          .update({
            http_status: 0,
            error_message: err instanceof Error ? err.message : 'Unknown error',
          })
          .eq('id', webhook.id);

        results.push({
          id: webhook.id,
          status: 0,
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error',
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
    console.error('General error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
