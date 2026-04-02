-- Enable public read access for materials with product_types containing 'palestra'
-- This allows unauthenticated users to see the materials on the public page

BEGIN;

DROP POLICY IF EXISTS "Public read for palestra materials" ON public.materials;

CREATE POLICY "Public read for palestra materials"
  ON public.materials
  FOR SELECT
  TO anon
  USING ('palestra' = ANY(product_types));

COMMIT;
