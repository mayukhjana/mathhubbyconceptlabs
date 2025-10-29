-- Fix critical security issue: Restrict questions table access to prevent answer leakage
-- Drop the overly permissive policy that allows users to see correct answers
DROP POLICY IF EXISTS "Users can view questions without answers" ON questions;

-- Create a new restrictive policy that only allows viewing safe columns
-- This policy explicitly excludes correct_answer, explanation, and answer_explanation
CREATE POLICY "Users can view questions without answers" 
ON questions 
FOR SELECT 
USING (true);

-- Revoke broad SELECT permissions
REVOKE SELECT ON questions FROM authenticated;

-- Grant column-level SELECT permissions for safe fields only
GRANT SELECT (
  id, 
  exam_id, 
  question_text, 
  option_a, 
  option_b, 
  option_c, 
  option_d, 
  order_number, 
  marks, 
  negative_marks, 
  is_multi_correct, 
  is_image_question, 
  image_url,
  created_at
) ON questions TO authenticated;

-- Add server-side validation for premium exams
-- This ensures users can only access premium exams if they have an active subscription
CREATE POLICY "Premium users can access premium exams"
ON exams 
FOR SELECT
USING (
  NOT is_premium OR 
  EXISTS (
    SELECT 1 
    FROM premium_subscriptions
    WHERE user_id = auth.uid()
    AND status = 'active'
    AND expires_at > now()
  )
);