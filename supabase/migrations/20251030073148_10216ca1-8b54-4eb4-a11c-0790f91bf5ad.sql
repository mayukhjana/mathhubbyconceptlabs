-- Add new columns to teachers table for enhanced mentor profiles
ALTER TABLE public.teachers 
ADD COLUMN IF NOT EXISTS current_company TEXT,
ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
ADD COLUMN IF NOT EXISTS achievements TEXT;