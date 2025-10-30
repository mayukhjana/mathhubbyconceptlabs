-- Drop the existing function
DROP FUNCTION IF EXISTS public.get_exam_questions(uuid);

-- Recreate the function with proper security checks
CREATE OR REPLACE FUNCTION public.get_exam_questions(exam_uuid uuid)
RETURNS TABLE(
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
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  -- Require authentication
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Check if exam exists
  IF NOT EXISTS (SELECT 1 FROM public.exams WHERE exams.id = exam_uuid) THEN
    RAISE EXCEPTION 'Exam not found';
  END IF;
  
  -- Check if exam is premium and user has access
  IF EXISTS (
    SELECT 1 FROM public.exams 
    WHERE exams.id = exam_uuid AND exams.is_premium = true
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.premium_subscriptions
      WHERE user_id = auth.uid()
      AND status = 'active'
      AND expires_at > now()
    ) THEN
      RAISE EXCEPTION 'Premium subscription required';
    END IF;
  END IF;
  
  -- Return questions without correct answers
  RETURN QUERY
  SELECT 
    q.id, 
    q.exam_id, 
    q.question_text, 
    q.option_a, 
    q.option_b, 
    q.option_c, 
    q.option_d, 
    q.order_number, 
    q.marks, 
    q.negative_marks,
    q.is_multi_correct, 
    q.is_image_question, 
    q.image_url
  FROM public.questions q
  WHERE q.exam_id = exam_uuid
  ORDER BY q.order_number;
END;
$$;