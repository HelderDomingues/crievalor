
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// Configurações do Supabase
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS"
};

serve(async (req) => {
  console.log("System diagnosis function invoked");
  
  // Lidar com requisições OPTIONS (CORS)
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    // Inicializar cliente Supabase com chave de serviço para ter permissões de admin
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    let body = {};
    try {
      body = await req.json();
    } catch (e) {
      body = {};
    }
    
    const action = body.action || "diagnose_installation";
    
    // Verificar o estado atual do sistema
    const diagnosticResults = {
      timestamp: new Date().toISOString(),
      database: {},
      buckets: {},
      policies: {},
      config: {}
    };
    
    // Verificar estado das tabelas essenciais
    try {
      const { data: tablesList, error: tablesError } = await supabase
        .from('pg_tables')
        .select('schemaname, tablename')
        .eq('schemaname', 'public');
        
      if (!tablesError) {
        diagnosticResults.database = {
          tables_count: tablesList?.length || 0,
          tables: tablesList
        };
      } else {
        diagnosticResults.database = {
          error: tablesError.message
        };
      }
    } catch (error) {
      diagnosticResults.database = {
        error: error.message
      };
    }
    
    // Verificar buckets de armazenamento
    try {
      const { data: bucketsList, error: bucketsError } = await supabase
        .storage
        .listBuckets();
        
      if (!bucketsError) {
        diagnosticResults.buckets = {
          count: bucketsList?.length || 0,
          buckets: bucketsList
        };
      } else {
        diagnosticResults.buckets = {
          error: bucketsError.message
        };
      }
    } catch (error) {
      diagnosticResults.buckets = {
        error: error.message
      };
    }
    
    // Verificar políticas RLS
    try {
      const { data: policiesList, error: policiesError } = await supabase
        .rpc('get_rls_policies')
        .select('*');
        
      if (!policiesError) {
        diagnosticResults.policies = {
          count: policiesList?.length || 0, 
          policies: policiesList
        };
      } else {
        diagnosticResults.policies = {
          error: policiesError.message,
          fallback: "Could not retrieve RLS policies. Function may not exist."
        };
      }
    } catch (error) {
      diagnosticResults.policies = {
        error: error.message,
        fallback: "Could not retrieve RLS policies. Function may not exist."
      };
    }
    
    // Verificar configurações do sistema
    try {
      const { data: settingsList, error: settingsError } = await supabase
        .from('system_settings')
        .select('key, created_at, updated_at');
        
      if (!settingsError) {
        diagnosticResults.config = {
          settings_count: settingsList?.length || 0,
          settings: settingsList
        };
      } else {
        diagnosticResults.config = {
          error: settingsError.message
        };
      }
    } catch (error) {
      diagnosticResults.config = {
        error: error.message
      };
    }
    
    // Retornar resultados de diagnóstico
    return new Response(
      JSON.stringify({ 
        success: true,
        diagnostics: diagnosticResults
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error(`Erro: ${error.message}`);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
