-- Grant execute permissions on the has_role function to ensure it works correctly
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO service_role;

-- Verify that the questions table RLS policies are correctly set up
-- Let's make sure the admin INSERT policy is working
DROP POLICY IF EXISTS "Admins can create questions" ON questions;

CREATE POLICY "Admins can create questions"
ON questions
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'::app_role
  )
);