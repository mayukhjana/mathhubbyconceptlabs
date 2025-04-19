export interface Question {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string | string[];
  marks: number;
  negative_marks: number;
  is_multi_correct: boolean;
  order_number: number;
  exam_id: string;
  image_url?: string;
}

export interface Exam {
  id: string;
  title: string;
  board: string;
  year: string;
  class: string;
  chapter?: string | null;
  duration: number;
  is_premium: boolean;
}

export const BOARD_OPTIONS = [
  'CBSE',
  'ICSE',
  'West Bengal Board',
  'Maharashtra Board',
  'Tamil Nadu Board',
  'Karnataka Board'
];

export const ENTRANCE_OPTIONS = [
  'WBJEE', 
  'JEE Main', 
  'JEE Advanced', 
  'NEET', 
  'CUET'
];

export const EXAM_TYPES = {
  BOARD: 'board',
  ENTRANCE: 'entrance'
};

export interface ExamResult {
  id: string;
  exam_id: string;
  user_id: string;
  score: number;
  total_marks: number | null;
  obtained_marks: number | null;
  total_questions: number;
  time_taken: number | null;
  completed_at: string | null;
}
