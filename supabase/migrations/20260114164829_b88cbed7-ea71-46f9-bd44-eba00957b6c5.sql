-- Drop the legacy lungs_data1 table and its RLS policies
DROP POLICY IF EXISTS "Enable read access for all users" ON public.lungs_data1;
DROP TABLE public.lungs_data1;