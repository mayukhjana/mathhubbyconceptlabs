-- Allow admins to delete teacher applications
CREATE POLICY "Admins can delete teacher applications"
ON public.teachers
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));