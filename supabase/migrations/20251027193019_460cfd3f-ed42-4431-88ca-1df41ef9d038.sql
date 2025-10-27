-- Create profiles table for user information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  username TEXT UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create exams table
CREATE TABLE IF NOT EXISTS public.exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  board TEXT NOT NULL,
  year TEXT NOT NULL,
  class TEXT NOT NULL,
  chapter TEXT,
  duration INTEGER NOT NULL, -- in minutes
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on exams (public read access)
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view exams"
  ON public.exams FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create exams"
  ON public.exams FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Create questions table
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  order_number INTEGER NOT NULL,
  marks NUMERIC DEFAULT 1,
  negative_marks NUMERIC DEFAULT 0,
  is_multi_correct BOOLEAN DEFAULT false,
  is_image_question BOOLEAN DEFAULT false,
  image_url TEXT,
  explanation TEXT,
  answer_explanation TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on questions (public read access)
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view questions"
  ON public.questions FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create questions"
  ON public.questions FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Create user_results table
CREATE TABLE IF NOT EXISTS public.user_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
  score NUMERIC NOT NULL,
  total_marks NUMERIC,
  obtained_marks NUMERIC,
  total_questions INTEGER NOT NULL,
  time_taken INTEGER, -- in seconds
  completed_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on user_results
ALTER TABLE public.user_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own results"
  ON public.user_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own results"
  ON public.user_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create premium_subscriptions table
CREATE TABLE IF NOT EXISTS public.premium_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_type TEXT NOT NULL, -- 'monthly' or 'annual'
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'expired', 'cancelled'
  stripe_subscription_id TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on premium_subscriptions
ALTER TABLE public.premium_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscription"
  ON public.premium_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_exams_updated_at
  BEFORE UPDATE ON public.exams
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_premium_subscriptions_updated_at
  BEFORE UPDATE ON public.premium_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, username)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'username'
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_questions_exam_id ON public.questions(exam_id);
CREATE INDEX IF NOT EXISTS idx_user_results_user_id ON public.user_results(user_id);
CREATE INDEX IF NOT EXISTS idx_user_results_exam_id ON public.user_results(exam_id);
CREATE INDEX IF NOT EXISTS idx_exams_board ON public.exams(board);
CREATE INDEX IF NOT EXISTS idx_exams_year ON public.exams(year);
CREATE INDEX IF NOT EXISTS idx_exams_class ON public.exams(class);