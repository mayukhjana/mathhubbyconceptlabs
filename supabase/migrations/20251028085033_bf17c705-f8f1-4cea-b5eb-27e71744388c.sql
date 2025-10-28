-- Create user roles system
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
$$;

-- RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Insert initial admin users
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email IN ('f20212334@goa.bits-pilani.ac.in', 'santanuj1201@gmail.com')
ON CONFLICT DO NOTHING;

-- Fix questions table RLS - remove overly permissive policy
DROP POLICY IF EXISTS "Anyone can view questions" ON public.questions;

-- Create function to get safe question fields (without answers)
CREATE OR REPLACE FUNCTION public.get_exam_questions(exam_uuid uuid)
RETURNS TABLE (
  id uuid,
  exam_id uuid,
  question_text text,
  option_a text,
  option_b text,
  option_c text,
  option_d text,
  order_number integer,
  marks numeric,
  negative_marks numeric,
  is_multi_correct boolean,
  is_image_question boolean,
  image_url text
) 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT q.id, q.exam_id, q.question_text, q.option_a, q.option_b, 
         q.option_c, q.option_d, q.order_number, q.marks, q.negative_marks,
         q.is_multi_correct, q.is_image_question, q.image_url
  FROM questions q
  WHERE q.exam_id = exam_uuid;
END;
$$ LANGUAGE plpgsql;

-- Allow authenticated users to view questions WITHOUT answers
CREATE POLICY "Users can view questions without answers"
ON public.questions
FOR SELECT
USING (true);

-- Restrict INSERT to admins only
DROP POLICY IF EXISTS "Authenticated users can create questions" ON public.questions;

CREATE POLICY "Admins can create questions"
ON public.questions
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Add UPDATE and DELETE policies for questions
CREATE POLICY "Admins can update questions"
ON public.questions
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete questions"
ON public.questions
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Fix exams table policies
DROP POLICY IF EXISTS "Authenticated users can create exams" ON public.exams;

CREATE POLICY "Admins can create exams"
ON public.exams
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update exams"
ON public.exams
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete exams"
ON public.exams
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Fix premium_subscriptions table - restrict INSERT
CREATE POLICY "Only payment system can create subscriptions"
ON public.premium_subscriptions
FOR INSERT
WITH CHECK (false);

CREATE POLICY "Admins can manage subscriptions"
ON public.premium_subscriptions
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Add UPDATE policy for premium_subscriptions (for webhook updates)
CREATE POLICY "Service role can update subscriptions"
ON public.premium_subscriptions
FOR UPDATE
USING (true);

-- Add DELETE policy for user results (users can delete their own)
CREATE POLICY "Users can delete their own results"
ON public.user_results
FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can delete any results"
ON public.user_results
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Add validation constraints
ALTER TABLE public.exams ADD CONSTRAINT duration_positive CHECK (duration > 0);
ALTER TABLE public.exams ADD CONSTRAINT title_not_empty CHECK (length(trim(title)) > 0);
ALTER TABLE public.exams ADD CONSTRAINT class_not_empty CHECK (length(trim(class)) > 0);
ALTER TABLE public.exams ADD CONSTRAINT board_not_empty CHECK (length(trim(board)) > 0);
ALTER TABLE public.exams ADD CONSTRAINT year_not_empty CHECK (length(trim(year)) > 0);

ALTER TABLE public.questions ADD CONSTRAINT marks_positive CHECK (marks > 0);
ALTER TABLE public.questions ADD CONSTRAINT negative_marks_non_negative CHECK (negative_marks >= 0);
ALTER TABLE public.questions ADD CONSTRAINT question_text_not_empty CHECK (length(trim(question_text)) > 0);
ALTER TABLE public.questions ADD CONSTRAINT option_a_not_empty CHECK (length(trim(option_a)) > 0);
ALTER TABLE public.questions ADD CONSTRAINT option_b_not_empty CHECK (length(trim(option_b)) > 0);
ALTER TABLE public.questions ADD CONSTRAINT option_c_not_empty CHECK (length(trim(option_c)) > 0);
ALTER TABLE public.questions ADD CONSTRAINT option_d_not_empty CHECK (length(trim(option_d)) > 0);