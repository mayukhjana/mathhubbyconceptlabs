-- Ensure authenticated clients have table privileges; RLS will still enforce row-level checks
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.questions TO authenticated;
GRANT SELECT ON TABLE public.questions TO anon;