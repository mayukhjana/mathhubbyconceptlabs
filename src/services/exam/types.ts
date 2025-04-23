export interface Question {
  id: string;
  exam_id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string | string[];
  order_number: number;
  marks: number;
  negative_marks: number;
  is_multi_correct: boolean;
  image_url?: string;
  created_at?: string;
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
  isAttempted?: boolean; // Add this property for ExamPapersPage.tsx
}

export const BOARD_OPTIONS = [
  'CBSE',
  'ICSE',
  'West Bengal Board',
  'Maharashtra Board',
  'Karnataka Board',
  'Tamil Nadu Board'
];

export const ENTRANCE_OPTIONS = [
  'WBJEE', 
  'JEE Main', 
  'JEE Advanced', 
  'SSC CGL',
  'BITSAT',
  'Other Exams'
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
  exams?: {    // Add the exams property that's being referenced
    id: string;
    title: string;
    board: string;
    year: string;
    chapter?: string | null;
  };
}
