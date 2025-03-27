
-- Update the handle_new_user function to set a default 'user' role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url, role)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'username', 
    new.raw_user_meta_data->>'avatar_url',
    'user' -- Set default role to 'user'
  );
  RETURN new;
END;
$$;

-- Update existing users that have NULL role
UPDATE public.profiles
SET role = 'user'
WHERE role IS NULL;
