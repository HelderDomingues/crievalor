-- Remove the dangerous public read policy from profiles table
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- Ensure we have the correct policy for users to view only their own profiles
-- (This policy should already exist, but we'll recreate it to be safe)
DROP POLICY IF EXISTS "Users can view their own profiles" ON public.profiles;

CREATE POLICY "Users can view their own profiles" 
ON public.profiles
FOR SELECT 
USING (auth.uid() = id);

-- Clean up any duplicate update policies
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Ensure we have the correct update policy
CREATE POLICY "Users can update their own profile" 
ON public.profiles
FOR UPDATE 
USING (auth.uid() = id);