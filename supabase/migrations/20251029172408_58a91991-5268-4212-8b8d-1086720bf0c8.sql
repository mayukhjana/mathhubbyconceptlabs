-- Drop the trigger first, then recreate the function with proper search_path
DROP TRIGGER IF EXISTS update_leaderboard_ranks_trigger ON public.exam_leaderboards;
DROP FUNCTION IF EXISTS public.update_exam_leaderboard_ranks();

CREATE OR REPLACE FUNCTION public.update_exam_leaderboard_ranks()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
$$;

-- Recreate the trigger
CREATE TRIGGER update_leaderboard_ranks_trigger
AFTER INSERT OR UPDATE ON public.exam_leaderboards
FOR EACH ROW
EXECUTE FUNCTION public.update_exam_leaderboard_ranks();