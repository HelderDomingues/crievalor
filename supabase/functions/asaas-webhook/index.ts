
// supabase/functions/asaas-webhook/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"
import { handleWebhookEvent } from "./handlers.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

console.log("ASAAS webhook function started - JWT VERIFICATION DISABLED")

serve(async (req) => {
  try {
    // Configurando CORS para permitir requisições de qualquer origem
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders })
    }

    // Verificar se o método é POST
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 405 
        }
      )
    }

    // Extrair o corpo da requisição
    const body = await req.json()
    console.log("Webhook received:", JSON.stringify(body))

    // Esta é uma função de webhook do Asaas - JWT VERIFICATION DISABLED
    // Os webhooks do Asaas não enviam tokens JWT
    
    // Criar cliente do Supabase sem verificação JWT
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        global: {
          headers: { Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}` },
        },
      }
    )

    // Processar o evento do webhook
    const result = await handleWebhookEvent(body, supabaseClient)
    
    // Retornar resposta adequada
    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    )
  } catch (error) {
    console.error("Error processing webhook:", error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    )
  }
})
