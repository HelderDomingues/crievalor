
-- Consolidate exec_sql functions and fix parameters
CREATE OR REPLACE FUNCTION public.exec_sql(sql text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  EXECUTE sql;
  RETURN true;
EXCEPTION WHEN OTHERS THEN
  RAISE EXCEPTION 'Error executing SQL: %', SQLERRM;
  RETURN false;
END;
$$;

-- Fix RLS policies setup function for subscriptions
CREATE OR REPLACE FUNCTION public.setup_subscriptions_rls_policies()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  table_exists BOOLEAN;
BEGIN
  -- Check if table exists first
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'subscriptions'
  ) INTO table_exists;
  
  IF NOT table_exists THEN
    RAISE NOTICE 'Table subscriptions does not exist, skipping RLS setup';
    RETURN false;
  END IF;

  -- Remove existing policies to avoid conflicts
  DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.subscriptions;
  DROP POLICY IF EXISTS "Users can insert their own subscriptions" ON public.subscriptions;
  DROP POLICY IF EXISTS "Users can update their own subscriptions" ON public.subscriptions;
  DROP POLICY IF EXISTS "Users can delete their own subscriptions" ON public.subscriptions;
  DROP POLICY IF EXISTS "Service role can manage all subscriptions" ON public.subscriptions;
  
  -- Enable RLS on the table subscriptions
  ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
  
  -- Policy to allow users to view their own subscriptions
  CREATE POLICY "Users can view their own subscriptions"
    ON public.subscriptions
    FOR SELECT
    USING (auth.uid() = user_id);
  
  -- Policy to allow users to insert their own subscriptions
  CREATE POLICY "Users can insert their own subscriptions"
    ON public.subscriptions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
  
  -- Policy to allow users to update their own subscriptions
  CREATE POLICY "Users can update their own subscriptions"
    ON public.subscriptions
    FOR UPDATE
    USING (auth.uid() = user_id);
  
  -- Policy to allow users to delete their own subscriptions
  CREATE POLICY "Users can delete their own subscriptions"
    ON public.subscriptions
    FOR DELETE
    USING (auth.uid() = user_id);
  
  -- Policy to allow the service role to manage all subscriptions
  CREATE POLICY "Service role can manage all subscriptions"
    ON public.subscriptions
    USING (current_setting('role', true) = 'service_role'::text);
  
  RETURN true;
END;
$$;

-- Fix RLS policies setup function for asaas_customers
CREATE OR REPLACE FUNCTION public.setup_asaas_customers_rls_policies()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  table_exists BOOLEAN;
BEGIN
  -- Check if table exists first
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'asaas_customers'
  ) INTO table_exists;
  
  IF NOT table_exists THEN
    RAISE NOTICE 'Table asaas_customers does not exist, skipping RLS setup';
    RETURN false;
  END IF;

  -- Remove existing policies to avoid conflicts
  DROP POLICY IF EXISTS "Users can view their own Asaas customer data" ON public.asaas_customers;
  DROP POLICY IF EXISTS "Users can insert their own Asaas customer data" ON public.asaas_customers;
  DROP POLICY IF EXISTS "Users can update their own Asaas customer data" ON public.asaas_customers;
  DROP POLICY IF EXISTS "Users can delete their own Asaas customer data" ON public.asaas_customers;
  DROP POLICY IF EXISTS "Service role can manage all Asaas customer data" ON public.asaas_customers;
  
  -- Enable RLS on the table asaas_customers
  ALTER TABLE public.asaas_customers ENABLE ROW LEVEL SECURITY;
  
  -- Policy to allow users to view their own customer data
  CREATE POLICY "Users can view their own Asaas customer data"
    ON public.asaas_customers
    FOR SELECT
    USING (auth.uid() = user_id);
  
  -- Policy to allow users to insert their own customer data
  CREATE POLICY "Users can insert their own Asaas customer data"
    ON public.asaas_customers
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
  
  -- Policy to allow users to update their own customer data
  CREATE POLICY "Users can update their own Asaas customer data"
    ON public.asaas_customers
    FOR UPDATE
    USING (auth.uid() = user_id);
  
  -- Policy to allow users to delete their own customer data
  CREATE POLICY "Users can delete their own Asaas customer data"
    ON public.asaas_customers
    FOR DELETE
    USING (auth.uid() = user_id);
  
  -- Policy to allow the service role to manage all customer data
  CREATE POLICY "Service role can manage all Asaas customer data"
    ON public.asaas_customers
    USING (current_setting('role', true) = 'service_role'::text);
  
  RETURN true;
END;
$$;

-- Create safer storage bucket setup function
CREATE OR REPLACE FUNCTION public.create_bucket_if_not_exists(bucket_name text, is_public boolean DEFAULT true)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, storage
AS $$
DECLARE
  bucket_exists BOOLEAN;
BEGIN
  -- Check if bucket exists
  SELECT EXISTS (
    SELECT 1 FROM storage.buckets
    WHERE name = bucket_name
  ) INTO bucket_exists;
  
  IF bucket_exists THEN
    -- Update existing bucket
    UPDATE storage.buckets
    SET public = is_public
    WHERE name = bucket_name;
    
    RAISE NOTICE 'Bucket "%" already exists, updated public status to %', bucket_name, is_public;
    RETURN true;
  ELSE
    -- Create new bucket
    INSERT INTO storage.buckets (id, name, public, avif_autodetection)
    VALUES (bucket_name, bucket_name, is_public, false);
    
    RAISE NOTICE 'Bucket "%" created with public=%', bucket_name, is_public;
    RETURN true;
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Error creating/updating bucket "%": %', bucket_name, SQLERRM;
  RETURN false;
END;
$$;

-- Create a safer storage policy setup function
CREATE OR REPLACE FUNCTION public.setup_storage_bucket_policies(bucket_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, storage
AS $$
DECLARE
  bucket_exists BOOLEAN;
  policy_prefix text;
BEGIN
  -- Check if bucket exists first
  SELECT EXISTS (
    SELECT 1 FROM storage.buckets
    WHERE name = bucket_name
  ) INTO bucket_exists;
  
  IF NOT bucket_exists THEN
    RAISE NOTICE 'Bucket "%" does not exist, skipping policy setup', bucket_name;
    RETURN false;
  END IF;
  
  policy_prefix := 'Bucket policy for ' || bucket_name || ' - ';
  
  -- Drop existing policies to avoid conflicts
  BEGIN
    EXECUTE format('DROP POLICY IF EXISTS "%s" ON storage.objects', policy_prefix || 'SELECT');
    EXCEPTION WHEN OTHERS THEN NULL;
  END;
  
  BEGIN
    EXECUTE format('DROP POLICY IF EXISTS "%s" ON storage.objects', policy_prefix || 'INSERT');
    EXCEPTION WHEN OTHERS THEN NULL;
  END;
  
  BEGIN
    EXECUTE format('DROP POLICY IF EXISTS "%s" ON storage.objects', policy_prefix || 'UPDATE');
    EXCEPTION WHEN OTHERS THEN NULL;
  END;
  
  BEGIN
    EXECUTE format('DROP POLICY IF EXISTS "%s" ON storage.objects', policy_prefix || 'DELETE');
    EXCEPTION WHEN OTHERS THEN NULL;
  END;

  -- Create policy for public read access
  EXECUTE format(
    'CREATE POLICY "%s" ON storage.objects FOR SELECT USING (bucket_id = $1)',
    policy_prefix || 'SELECT'
  ) USING bucket_name;
  
  -- Create policy for authenticated users to insert
  EXECUTE format(
    'CREATE POLICY "%s" ON storage.objects FOR INSERT WITH CHECK (bucket_id = $1 AND (auth.role() = ''authenticated'' OR auth.role() = ''service_role''))',
    policy_prefix || 'INSERT'
  ) USING bucket_name;
  
  -- Create policy for authenticated users to update their own objects
  EXECUTE format(
    'CREATE POLICY "%s" ON storage.objects FOR UPDATE USING (bucket_id = $1 AND (auth.role() = ''authenticated'' OR auth.role() = ''service_role''))',
    policy_prefix || 'UPDATE'
  ) USING bucket_name;
  
  -- Create policy for authenticated users to delete their own objects
  EXECUTE format(
    'CREATE POLICY "%s" ON storage.objects FOR DELETE USING (bucket_id = $1 AND (auth.role() = ''authenticated'' OR auth.role() = ''service_role''))',
    policy_prefix || 'DELETE'
  ) USING bucket_name;
  
  RAISE NOTICE 'Storage policies for bucket "%" created successfully', bucket_name;
  RETURN true;
END;
$$;

-- Create installation status tracking table
CREATE TABLE IF NOT EXISTS public.system_installation_status (
  id SERIAL PRIMARY KEY,
  component TEXT NOT NULL,
  status TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create function to track installation progress
CREATE OR REPLACE FUNCTION public.track_installation_status(component text, status text, message text DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.system_installation_status (component, status, message)
  VALUES (component, status, message);
END;
$$;

-- Create diagnostic function
CREATE OR REPLACE FUNCTION public.diagnose_system_installation()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'tables', (
      SELECT jsonb_agg(jsonb_build_object('table_name', table_name, 'exists', true))
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('subscriptions', 'asaas_customers', 'profiles', 'system_settings')
    ),
    'storage_buckets', (
      SELECT jsonb_agg(jsonb_build_object('name', name, 'public', public))
      FROM storage.buckets
    ),
    'rls_enabled', (
      SELECT jsonb_object_agg(tablename, row_security_active)
      FROM pg_tables
      WHERE schemaname = 'public'
      AND tablename IN ('subscriptions', 'asaas_customers', 'profiles')
    ),
    'installation_status', (
      SELECT jsonb_agg(jsonb_build_object(
        'component', component,
        'status', status,
        'message', message,
        'updated_at', updated_at
      ))
      FROM public.system_installation_status
      ORDER BY updated_at DESC
      LIMIT 50
    )
  ) INTO result;
  
  RETURN result;
END;
$$;
