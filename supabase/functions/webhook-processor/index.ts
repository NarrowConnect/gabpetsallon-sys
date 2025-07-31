import { createClient } from '@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client with your project URL and anon key
const supabaseUrl = 'https://your-project.supabase.co'; // Replace with your actual Supabase URL
const supabaseAnonKey = 'your-anon-key'; // Replace with your actual anon key
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export const webhookProcessor = async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Fetch pending webhooks to process
    const { data: pendingWebhooks, error } = await supabaseClient
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

        // Update the webhook log with the result
        await supabaseClient
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
    console.error('General error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};
