-- Fix unique constraint for exam_leaderboards to allow updates
-- Drop the existing primary key and create a composite unique constraint
ALTER TABLE public.exam_leaderboards DROP CONSTRAINT IF EXISTS exam_leaderboards_pkey;
ALTER TABLE public.exam_leaderboards ADD PRIMARY KEY (id);
ALTER TABLE public.exam_leaderboards DROP CONSTRAINT IF EXISTS exam_leaderboards_exam_id_user_id_key;
ALTER TABLE public.exam_leaderboards ADD CONSTRAINT exam_leaderboards_exam_id_user_id_unique UNIQUE (exam_id, user_id);