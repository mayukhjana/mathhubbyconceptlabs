-- Add instructions_pdf_url to exams table
ALTER TABLE public.exams 
ADD COLUMN IF NOT EXISTS instructions_pdf_url TEXT;

-- Create exam_leaderboards table to store leaderboard data
CREATE TABLE IF NOT EXISTS public.exam_leaderboards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  score NUMERIC NOT NULL,
  obtained_marks NUMERIC,
  total_marks NUMERIC,
  rank INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(exam_id, user_id)
);

-- Enable RLS on exam_leaderboards
ALTER TABLE public.exam_leaderboards ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view leaderboard
CREATE POLICY "Anyone can view leaderboard"
ON public.exam_leaderboards
FOR SELECT
USING (true);

-- Users can insert their own scores
CREATE POLICY "Users can insert their own scores"
ON public.exam_leaderboards
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admins can manage leaderboards
CREATE POLICY "Admins can manage leaderboards"
ON public.exam_leaderboards
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create function to update leaderboard ranks
CREATE OR REPLACE FUNCTION update_exam_leaderboard_ranks()
RETURNS TRIGGER AS $$
BEGIN
  -- Update ranks for the exam
  WITH ranked_scores AS (
    SELECT 
      id,
      ROW_NUMBER() OVER (PARTITION BY exam_id ORDER BY obtained_marks DESC, created_at ASC) as new_rank
    FROM public.exam_leaderboards
    WHERE exam_id = NEW.exam_id
  )
  UPDATE public.exam_leaderboards
  SET rank = ranked_scores.new_rank
  FROM ranked_scores
  WHERE exam_leaderboards.id = ranked_scores.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically update ranks
CREATE TRIGGER update_leaderboard_ranks_trigger
AFTER INSERT OR UPDATE ON public.exam_leaderboards
FOR EACH ROW
EXECUTE FUNCTION update_exam_leaderboard_ranks();