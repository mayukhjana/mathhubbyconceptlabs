
export interface ExamResult {
  id: string;
  user_id: string;
  exam_id: string;
  score: number;
  completed_at: string;
  time_taken: number;
  total_questions: number;
  total_marks: number;
  obtained_marks: number;
  exams: {
    title: string;
    board: string;
    chapter: string | null;
    year: string;
    class: string;
  };
}

export interface Exam {
  id: string;
  title: string;
  board: string;
  chapter: string | null;
  year: string;
  class: string;
  duration: number;
  is_premium: boolean;
  created_at?: string | null;
  created_by?: string | null;
  isAttempted?: boolean;
}

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
  created_at?: string | null;
  is_multi_correct?: boolean;
}

export const EXAM_TYPES = {
  BOARD: 'board',
  ENTRANCE: 'entrance'
};

export const BOARD_OPTIONS = ['ICSE', 'CBSE', 'West Bengal Board'];
export const ENTRANCE_OPTIONS = ['WBJEE', 'JEE MAINS', 'JEE ADVANCED'];
