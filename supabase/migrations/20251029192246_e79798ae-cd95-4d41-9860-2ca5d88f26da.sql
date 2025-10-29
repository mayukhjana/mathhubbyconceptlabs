-- Add new fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS school_name TEXT,
ADD COLUMN IF NOT EXISTS board TEXT,
ADD COLUMN IF NOT EXISTS class TEXT;

-- Create teachers table for mentorship system
CREATE TABLE IF NOT EXISTS public.teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  specialization TEXT NOT NULL,
  hourly_rate NUMERIC NOT NULL,
  bio TEXT,
  experience_years INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Create teacher reviews table
CREATE TABLE IF NOT EXISTS public.teacher_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES public.teachers(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on teachers table
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

-- RLS policies for teachers
CREATE POLICY "Anyone can view teachers"
ON public.teachers FOR SELECT
USING (true);

CREATE POLICY "Users can create their own teacher profile"
ON public.teachers FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own teacher profile"
ON public.teachers FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own teacher profile"
ON public.teachers FOR DELETE
USING (auth.uid() = user_id);

-- Enable RLS on teacher_reviews table
ALTER TABLE public.teacher_reviews ENABLE ROW LEVEL SECURITY;

-- RLS policies for reviews
CREATE POLICY "Anyone can view reviews"
ON public.teacher_reviews FOR SELECT
USING (true);

CREATE POLICY "Students can create reviews"
ON public.teacher_reviews FOR INSERT
WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their own reviews"
ON public.teacher_reviews FOR UPDATE
USING (auth.uid() = student_id);

CREATE POLICY "Students can delete their own reviews"
ON public.teacher_reviews FOR DELETE
USING (auth.uid() = student_id);

-- Add trigger for updated_at on teachers
CREATE TRIGGER update_teachers_updated_at
  BEFORE UPDATE ON public.teachers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();