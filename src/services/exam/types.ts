export interface Exam {
  id: string;
  title: string;
  board: string;
  class: string;
  chapter: string | null;
  year: string;
  duration: number;
  is_premium: boolean;
  allow_paper_download: boolean;
  allow_solution_download: boolean;
  created_at?: string;
  updated_at?: string;
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
  is_multi_correct: boolean;
}
