
import { postCorsHeaders as corsHeaders } from "../_shared/cors.ts";
import { requireAdmin } from "../_shared/require-admin.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  if (req.method !== "POST") {
    return new Response(null, { status: 405, headers: corsHeaders });
  }

  const access = await requireAdmin(req);
  if (access instanceof Response) return access;

  try {
    const { client: supabase } = access;

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
        error: error instanceof Error ? error.message : String(error)
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
        error: error instanceof Error ? error.message : String(error)
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
        error: error instanceof Error ? error.message : String(error),
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
        error: error instanceof Error ? error.message : String(error)
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
    console.error("Erro ao diagnosticar o sistema:", error);
    return new Response(
      JSON.stringify({ error: "Falha ao diagnosticar o sistema" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
