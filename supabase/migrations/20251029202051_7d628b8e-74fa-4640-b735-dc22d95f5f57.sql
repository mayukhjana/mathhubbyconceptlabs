-- Add category column to exams table to distinguish between boards and entrance exams
ALTER TABLE public.exams ADD COLUMN IF NOT EXISTS category text DEFAULT 'board';

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_exams_category ON public.exams(category);
CREATE INDEX IF NOT EXISTS idx_exams_board_category ON public.exams(board, category);

-- Insert board data (sample exams for each board)
INSERT INTO public.exams (title, board, class, year, duration, category, is_premium)
VALUES 
  -- CBSE Boards
  ('Mathematics Paper 1', 'CBSE', '10', '2024', 180, 'board', false),
  ('Mathematics Paper 1', 'CBSE', '12', '2024', 180, 'board', false),
  
  -- ICSE Boards
  ('Mathematics Paper 1', 'ICSE', '10', '2024', 180, 'board', false),
  ('Mathematics Paper 1', 'ICSE', '12', '2024', 180, 'board', false),
  
  -- Maharashtra State Board
  ('Mathematics Paper 1', 'Maharashtra State Board', '10', '2024', 180, 'board', false),
  ('Mathematics Paper 1', 'Maharashtra State Board', '12', '2024', 180, 'board', false),
  
  -- Tamil Nadu State Board
  ('Mathematics Paper 1', 'Tamil Nadu State Board', '10', '2024', 180, 'board', false),
  ('Mathematics Paper 1', 'Tamil Nadu State Board', '12', '2024', 180, 'board', false),
  
  -- Karnataka State Board
  ('Mathematics Paper 1', 'Karnataka State Board', '10', '2024', 180, 'board', false),
  ('Mathematics Paper 1', 'Karnataka State Board', '12', '2024', 180, 'board', false),
  
  -- Kerala State Board
  ('Mathematics Paper 1', 'Kerala State Board', '10', '2024', 180, 'board', false),
  ('Mathematics Paper 1', 'Kerala State Board', '12', '2024', 180, 'board', false),
  
  -- Uttar Pradesh Board
  ('Mathematics Paper 1', 'Uttar Pradesh Board', '10', '2024', 180, 'board', false),
  ('Mathematics Paper 1', 'Uttar Pradesh Board', '12', '2024', 180, 'board', false),
  
  -- Rajasthan Board
  ('Mathematics Paper 1', 'Rajasthan Board', '10', '2024', 180, 'board', false),
  ('Mathematics Paper 1', 'Rajasthan Board', '12', '2024', 180, 'board', false),
  
  -- Madhya Pradesh Board
  ('Mathematics Paper 1', 'Madhya Pradesh Board', '10', '2024', 180, 'board', false),
  ('Mathematics Paper 1', 'Madhya Pradesh Board', '12', '2024', 180, 'board', false),
  
  -- Gujarat State Board
  ('Mathematics Paper 1', 'Gujarat State Board', '10', '2024', 180, 'board', false),
  ('Mathematics Paper 1', 'Gujarat State Board', '12', '2024', 180, 'board', false),
  
  -- Bihar Board
  ('Mathematics Paper 1', 'Bihar Board', '10', '2024', 180, 'board', false),
  ('Mathematics Paper 1', 'Bihar Board', '12', '2024', 180, 'board', false),
  
  -- West Bengal Board
  ('Mathematics Paper 1', 'West Bengal Board', '10', '2024', 180, 'board', false),
  ('Mathematics Paper 1', 'West Bengal Board', '12', '2024', 180, 'board', false),
  
  -- Andhra Pradesh Board
  ('Mathematics Paper 1', 'Andhra Pradesh Board', '10', '2024', 180, 'board', false),
  ('Mathematics Paper 1', 'Andhra Pradesh Board', '12', '2024', 180, 'board', false),
  
  -- Telangana Board
  ('Mathematics Paper 1', 'Telangana Board', '10', '2024', 180, 'board', false),
  ('Mathematics Paper 1', 'Telangana Board', '12', '2024', 180, 'board', false),
  
  -- Entrance Exams
  ('JEE Main 2024 Mathematics', 'JEE Main', '12', '2024', 180, 'entrance', false),
  ('JEE Advanced 2024 Mathematics Paper 1', 'JEE Advanced', '12', '2024', 180, 'entrance', false),
  ('BITSAT 2024 Mathematics', 'BITSAT', '12', '2024', 180, 'entrance', false),
  ('VITEEE 2024 Mathematics', 'VITEEE', '12', '2024', 150, 'entrance', false),
  ('SRMJEEE 2024 Mathematics', 'SRMJEEE', '12', '2024', 150, 'entrance', false),
  ('KCET 2024 Mathematics', 'KCET', '12', '2024', 80, 'entrance', false),
  ('MHT CET 2024 Mathematics', 'MHT CET', '12', '2024', 90, 'entrance', false),
  ('COMEDK 2024 Mathematics', 'COMEDK', '12', '2024', 180, 'entrance', false),
  ('TS EAMCET 2024 Mathematics', 'TS EAMCET', '12', '2024', 180, 'entrance', false),
  ('AP EAMCET 2024 Mathematics', 'AP EAMCET', '12', '2024', 180, 'entrance', false),
  ('WBJEE 2024 Mathematics', 'WBJEE', '12', '2024', 120, 'entrance', false),
  ('KEAM 2024 Mathematics', 'KEAM', '12', '2024', 150, 'entrance', false),
  ('TNEA 2024 Mathematics', 'TNEA', '12', '2024', 180, 'entrance', false),
  ('CUET 2024 Mathematics', 'CUET', '12', '2024', 45, 'entrance', false),
  ('IPU CET 2024 Mathematics', 'IPU CET', '12', '2024', 150, 'entrance', false),
  ('UPSEE 2024 Mathematics', 'UPSEE', '12', '2024', 180, 'entrance', false)
ON CONFLICT DO NOTHING;