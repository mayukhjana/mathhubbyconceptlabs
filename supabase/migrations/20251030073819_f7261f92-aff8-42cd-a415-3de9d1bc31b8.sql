-- Create education history table for mentors
CREATE TABLE IF NOT EXISTS public.teacher_education (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
  institution_name TEXT NOT NULL,
  degree TEXT NOT NULL,
  field_of_study TEXT,
  start_year INTEGER,
  end_year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create work experience table for mentors
CREATE TABLE IF NOT EXISTS public.teacher_experience (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  position TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT,
  is_current BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add new columns to teachers table for additional mentor information
ALTER TABLE public.teachers 
ADD COLUMN IF NOT EXISTS topics TEXT[],
ADD COLUMN IF NOT EXISTS languages TEXT[],
ADD COLUMN IF NOT EXISTS about_mentor TEXT,
ADD COLUMN IF NOT EXISTS facebook_url TEXT,
ADD COLUMN IF NOT EXISTS instagram_url TEXT,
ADD COLUMN IF NOT EXISTS twitter_url TEXT;

-- Enable RLS on new tables
ALTER TABLE public.teacher_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_experience ENABLE ROW LEVEL SECURITY;

-- RLS policies for teacher_education
CREATE POLICY "Anyone can view education of approved teachers"
  ON public.teacher_education
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.teachers
      WHERE teachers.id = teacher_education.teacher_id
      AND teachers.verification_status = 'approved'
    )
  );

CREATE POLICY "Teachers can insert their own education"
  ON public.teacher_education
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.teachers
      WHERE teachers.id = teacher_education.teacher_id
      AND teachers.user_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can update their own education"
  ON public.teacher_education
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.teachers
      WHERE teachers.id = teacher_education.teacher_id
      AND teachers.user_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can delete their own education"
  ON public.teacher_education
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.teachers
      WHERE teachers.id = teacher_education.teacher_id
      AND teachers.user_id = auth.uid()
    )
  );

-- RLS policies for teacher_experience
CREATE POLICY "Anyone can view experience of approved teachers"
  ON public.teacher_experience
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.teachers
      WHERE teachers.id = teacher_experience.teacher_id
      AND teachers.verification_status = 'approved'
    )
  );

CREATE POLICY "Teachers can insert their own experience"
  ON public.teacher_experience
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.teachers
      WHERE teachers.id = teacher_experience.teacher_id
      AND teachers.user_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can update their own experience"
  ON public.teacher_experience
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.teachers
      WHERE teachers.id = teacher_experience.teacher_id
      AND teachers.user_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can delete their own experience"
  ON public.teacher_experience
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.teachers
      WHERE teachers.id = teacher_experience.teacher_id
      AND teachers.user_id = auth.uid()
    )
  );