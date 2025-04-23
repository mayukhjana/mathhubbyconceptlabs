
declare interface Question {
  id?: string;
  order_number: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string | string[];
  is_multi_correct?: boolean;
  marks?: number;
  negative_marks?: number;
  explanation?: string;
  exam_id?: string;
  image_url?: string;
}
