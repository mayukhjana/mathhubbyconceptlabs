-- Create storage buckets for exam papers, solutions, and question images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('exam-papers', 'exam-papers', true, 52428800, ARRAY['application/pdf']),
  ('exam-solutions', 'exam-solutions', true, 52428800, ARRAY['application/pdf']),
  ('questions', 'questions', true, 10485760, ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies for exam-papers bucket
CREATE POLICY "Anyone can view exam papers"
ON storage.objects
FOR SELECT
USING (bucket_id = 'exam-papers');

CREATE POLICY "Admins can upload exam papers"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'exam-papers' 
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can update exam papers"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'exam-papers' 
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can delete exam papers"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'exam-papers' 
  AND public.has_role(auth.uid(), 'admin')
);

-- Storage policies for exam-solutions bucket
CREATE POLICY "Anyone can view exam solutions"
ON storage.objects
FOR SELECT
USING (bucket_id = 'exam-solutions');

CREATE POLICY "Admins can upload exam solutions"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'exam-solutions' 
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can update exam solutions"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'exam-solutions' 
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can delete exam solutions"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'exam-solutions' 
  AND public.has_role(auth.uid(), 'admin')
);

-- Storage policies for questions bucket (for question images)
CREATE POLICY "Anyone can view question images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'questions');

CREATE POLICY "Admins can upload question images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'questions' 
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can update question images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'questions' 
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can delete question images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'questions' 
  AND public.has_role(auth.uid(), 'admin')
);