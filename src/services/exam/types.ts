
export interface Exam {
  id: string;
  title: string;
  board: string;
  year: string;
  class: string;
  chapter: string | null;
  duration: number;
  is_premium: boolean;
  created_at?: string;
}

export interface Question {
  id: string;
  exam_id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  order_number: number;
}

export interface ExamResult {
  id: string;
  user_id: string;
  exam_id: string;
  score: number;
  total_questions: number;
  time_taken: number;
  completed_at: string;
}

export interface ExamType {
  id: string;
  name: string;
}

export const EXAM_TYPES = {
  BOARD: 'board',
  ENTRANCE: 'entrance'
};

export const BOARD_OPTIONS = ["ICSE", "CBSE", "West Bengal Board"];
export const ENTRANCE_OPTIONS = ["WBJEE", "JEE MAINS", "JEE ADVANCED"];
