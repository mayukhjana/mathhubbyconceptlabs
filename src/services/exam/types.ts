
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
