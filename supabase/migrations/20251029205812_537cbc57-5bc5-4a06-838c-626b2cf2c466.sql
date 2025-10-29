-- Add verification status and documents to teachers table
ALTER TABLE public.teachers
ADD COLUMN IF NOT EXISTS verification_status text DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
ADD COLUMN IF NOT EXISTS qualification text,
ADD COLUMN IF NOT EXISTS school_past text,
ADD COLUMN IF NOT EXISTS documents_url text,
ADD COLUMN IF NOT EXISTS submitted_at timestamp with time zone DEFAULT now();

-- Create index for verification status
CREATE INDEX IF NOT EXISTS idx_teachers_verification ON public.teachers(verification_status);

-- Update RLS policies for teachers table
CREATE POLICY "Authenticated users can insert their teacher application"
ON public.teachers
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id AND verification_status = 'pending');

-- Policy for viewing own application status
CREATE POLICY "Users can view their own teacher application"
ON public.teachers
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR verification_status = 'approved');

-- Admin can update verification status
CREATE POLICY "Admins can update teacher verification"
ON public.teachers
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create storage bucket for mentor documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('mentor-documents', 'mentor-documents', false)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for mentor documents storage
CREATE POLICY "Users can upload their mentor documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'mentor-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own mentor documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'mentor-documents' 
  AND (auth.uid()::text = (storage.foldername(name))[1] OR has_role(auth.uid(), 'admin'::app_role))
);

CREATE POLICY "Admins can view all mentor documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'mentor-documents' AND has_role(auth.uid(), 'admin'::app_role));