-- Add image_url column to exams table for board images
ALTER TABLE public.exams ADD COLUMN IF NOT EXISTS image_url text;

-- Add comment to explain the field
COMMENT ON COLUMN public.exams.image_url IS 'URL for the board/exam card image displayed in the UI';