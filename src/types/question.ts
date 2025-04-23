
export type Question = {
  order_number: number;
  question_text: string;
  options: string[];
  correct_answer: string | string[];
  is_multi_correct?: boolean;
  marks?: number;
  explanation?: string;
  exam_id?: string;
  image_url?: string;
};
