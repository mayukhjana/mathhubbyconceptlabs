-- Allow everyone to view approved teacher profiles
CREATE POLICY "Anyone can view teacher profiles"
ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.teachers
    WHERE teachers.user_id = profiles.id
    AND teachers.verification_status = 'approved'
  )
);