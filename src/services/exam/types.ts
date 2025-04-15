
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
