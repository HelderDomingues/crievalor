
// supabase/functions/setup-storage-policies/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

// Importante: este tipo de função deve ser executada com a chave de serviço
// para ter permissões para configurar o banco de dados
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || ""
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""

console.log("Setup storage policies function loaded")

interface PolicySetupResult {
  success: boolean;
  message?: string;
  warning?: string;
}

interface Response {
  success: boolean;
  message: string;
  results: Record<string, PolicySetupResult>;
}

serve(async (req) => {
  // Responder somente a POST requests
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { headers: { "Content-Type": "application/json" }, status: 405 }
    )
  }

  try {
    // Inicializar o cliente Supabase com a chave de serviço
    // para ter permissões administrativas
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    const response: Response = {
      success: true,
      message: "Storage buckets configured successfully",
      results: {}
    }

    // Verificar e criar os buckets necessários
    await setupBucket("clientlogos", supabase, response)
    await setupBucket("materials", supabase, response)

    // Configurar permissões diretamente via SQL
    try {
      // Aplicar políticas de acesso público para leitura e acesso autenticado para modificações
      const storageResult = await supabase.rpc('exec_sql', {
        sql: `
          -- Criar função de verificação de proprietário para files
          CREATE OR REPLACE FUNCTION storage.is_owner(
            bucket_id text,
            name text,
            owner_id uuid
          )
          RETURNS BOOLEAN AS $$
          BEGIN
            RETURN EXISTS (
              SELECT 1 FROM storage.objects
              WHERE
                storage.objects.bucket_id = is_owner.bucket_id AND
                storage.objects.name = is_owner.name AND
                storage.objects.owner = is_owner.owner_id
            );
          END
          $$ LANGUAGE plpgsql;

          -- Configurar policies para clientlogos
          DROP POLICY IF EXISTS "Público pode visualizar logos de clientes" ON storage.objects;
          CREATE POLICY "Público pode visualizar logos de clientes"
            ON storage.objects
            FOR SELECT
            USING (bucket_id = 'clientlogos');

          DROP POLICY IF EXISTS "Usuários autenticados podem fazer upload de logos" ON storage.objects;
          CREATE POLICY "Usuários autenticados podem fazer upload de logos"
            ON storage.objects
            FOR INSERT
            TO authenticated
            WITH CHECK (bucket_id = 'clientlogos');

          DROP POLICY IF EXISTS "Proprietários e admins podem atualizar logos" ON storage.objects;
          CREATE POLICY "Proprietários e admins podem atualizar logos"
            ON storage.objects
            FOR UPDATE
            TO authenticated
            USING (bucket_id = 'clientlogos' AND (storage.is_owner(bucket_id, name, auth.uid()) OR auth.jwt() ->> 'role' = 'admin'));

          DROP POLICY IF EXISTS "Proprietários e admins podem excluir logos" ON storage.objects;
          CREATE POLICY "Proprietários e admins podem excluir logos"
            ON storage.objects
            FOR DELETE
            TO authenticated
            USING (bucket_id = 'clientlogos' AND (storage.is_owner(bucket_id, name, auth.uid()) OR auth.jwt() ->> 'role' = 'admin'));

          -- Configurar policies para materials
          DROP POLICY IF EXISTS "Usuários autenticados podem visualizar materiais" ON storage.objects;
          CREATE POLICY "Usuários autenticados podem visualizar materiais"
            ON storage.objects
            FOR SELECT
            TO authenticated
            USING (bucket_id = 'materials');

          DROP POLICY IF EXISTS "Admins podem fazer upload de materiais" ON storage.objects;
          CREATE POLICY "Admins podem fazer upload de materiais"
            ON storage.objects
            FOR INSERT
            TO authenticated
            WITH CHECK (bucket_id = 'materials' AND auth.jwt() ->> 'role' = 'admin');

          DROP POLICY IF EXISTS "Admins podem atualizar materiais" ON storage.objects;
          CREATE POLICY "Admins podem atualizar materiais"
            ON storage.objects
            FOR UPDATE
            TO authenticated
            USING (bucket_id = 'materials' AND auth.jwt() ->> 'role' = 'admin');

          DROP POLICY IF EXISTS "Admins podem excluir materiais" ON storage.objects;
          CREATE POLICY "Admins podem excluir materiais"
            ON storage.objects
            FOR DELETE
            TO authenticated
            USING (bucket_id = 'materials' AND auth.jwt() ->> 'role' = 'admin');
        `
      });

      if (storageResult.error) {
        console.error('Erro ao configurar políticas:', storageResult.error);
        throw new Error(`Erro ao configurar políticas SQL: ${storageResult.error.message}`);
      }

      console.log('Políticas de storage configuradas com sucesso via SQL');
    } catch (sqlError) {
      console.error('Erro ao executar SQL para configurar políticas:', sqlError);
      // Adicionar aviso, mas continuar com os outros métodos
      for (const bucket of ['clientlogos', 'materials']) {
        if (response.results[bucket]) {
          response.results[bucket].warning = `Policies setup failed, manual setup may be required: ${sqlError.message}`;
        }
      }
    }

    return new Response(
      JSON.stringify(response),
      { headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error("Error in setup-storage-policies function:", error)

    return new Response(
      JSON.stringify({
        success: false,
        message: `Error setting up storage policies: ${error.message}`,
        error: error.message
      }),
      { headers: { "Content-Type": "application/json" }, status: 500 }
    )
  }
})

async function setupBucket(
  bucketName: string,
  supabase: any,
  response: Response
): Promise<void> {
  try {
    console.log(`Setting up ${bucketName} bucket...`)
    
    // Verificar se o bucket existe
    const { data: existingBuckets, error: listError } = await supabase
      .storage
      .listBuckets()
    
    if (listError) {
      throw new Error(`Error listing buckets: ${listError.message}`)
    }
    
    const bucketExists = existingBuckets.some(
      (bucket: any) => bucket.name === bucketName
    )
    
    if (!bucketExists) {
      // Criar o bucket se não existir
      const { error: createError } = await supabase
        .storage
        .createBucket(bucketName, {
          public: true,
          fileSizeLimit: 10 * 1024 * 1024, // 10MB
          allowedMimeTypes: ['image/*', 'application/pdf']
        })
      
      if (createError) {
        throw new Error(`Error creating bucket ${bucketName}: ${createError.message}`)
      }
      
      console.log(`Bucket ${bucketName} created successfully`)
    } else {
      console.log(`Bucket ${bucketName} already exists`)
    }
    
    // Atualizar as configurações do bucket para torná-lo público
    const { error: updateError } = await supabase
      .storage
      .updateBucket(bucketName, {
        public: true
      })
    
    if (updateError) {
      throw new Error(`Error updating bucket ${bucketName}: ${updateError.message}`)
    }
    
    response.results[bucketName] = {
      success: true
    }
  } catch (error) {
    console.error(`Error setting up bucket ${bucketName}:`, error)
    response.results[bucketName] = {
      success: false,
      message: error.message
    }
  }
}
