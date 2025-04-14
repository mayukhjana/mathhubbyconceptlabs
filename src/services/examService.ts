import { supabase } from "@/integrations/supabase/client";

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

export const fetchExamByBoardAndYear = async (board: string, year: string) => {
  const { data, error } = await supabase
    .from('exams')
    .select()
    .eq('board', board)
    .eq('year', year)
    .single();
    
  if (error) {
    console.error("Error fetching exam:", error);
    return null;
  }
  
  return data as Exam;
};

export const fetchExamById = async (examId: string) => {
  const { data, error } = await supabase
    .from('exams')
    .select()
    .eq('id', examId)
    .single();
    
  if (error) {
    console.error("Error fetching exam:", error);
    return null;
  }
  
  return data as Exam;
};

export const fetchQuestionsForExam = async (examId: string) => {
  const { data, error } = await supabase
    .from('questions')
    .select()
    .eq('exam_id', examId)
    .order('order_number', { ascending: true });
    
  if (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
  
  return data as Question[];
};

export const fetchPracticePapers = async () => {
  const { data, error } = await supabase
    .from('exams')
    .select()
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error("Error fetching exams:", error);
    return [];
  }
  
  return data as Exam[];
};

export const fetchEntranceExams = async (boardFilter?: string) => {
  let query = supabase
    .from('exams')
    .select()
    .order('year', { ascending: false });
    
  if (boardFilter && boardFilter !== "all") {
    query = query.eq('board', boardFilter);
  }
    
  const { data, error } = await query;
    
  if (error) {
    console.error("Error fetching entrance exams:", error);
    return [];
  }
  
  return data as Exam[];
};

export const submitExamResult = async (
  userId: string,
  examId: string, 
  score: number, 
  totalQuestions: number,
  timeTaken: number
) => {
  const { data, error } = await supabase
    .from('user_results')
    .insert({
      user_id: userId,
      exam_id: examId,
      score,
      total_questions: totalQuestions,
      time_taken: timeTaken,
    })
    .select()
    .single();
    
  if (error) {
    console.error("Error submitting exam result:", error);
    return null;
  }
  
  return data;
};

export const fetchExam = async (examId: string) => {
  const { data, error } = await supabase
    .from('exams')
    .select()
    .eq('id', examId)
    .single();
    
  if (error) {
    console.error("Error fetching exam:", error);
    return null;
  }
  
  return data as Exam;
};

export const getFileDownloadUrl = async (examId: string, fileType: 'paper' | 'solution', board: string) => {
  try {
    const boardFormatted = board.replace(/\s/g, '_').toLowerCase();
    return `/exam_papers/${boardFormatted}_${fileType}_${examId}.pdf`;
  } catch (error) {
    console.error(`Error getting ${fileType} download URL:`, error);
    return null;
  }
};

export const uploadExamFile = async (
  file: File, 
  examId: string, 
  fileType: 'paper' | 'solution',
  board: string
) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${board.replace(/\s/g, '_')}_${fileType}_${examId}.${fileExt}`;
    const filePath = `exam_papers/${fileName}`;
    
    console.log(`Uploading ${fileType} for exam ${examId} to ${filePath}`);
    
    return filePath;
  } catch (error) {
    console.error(`Error uploading ${fileType}:`, error);
    throw error;
  }
};
