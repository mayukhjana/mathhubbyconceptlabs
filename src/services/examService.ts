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
    .in('board', ENTRANCE_OPTIONS)
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

export const fetchBoardExams = async (boardFilter?: string, chapterFilter?: string) => {
  let query = supabase
    .from('exams')
    .select()
    .in('board', BOARD_OPTIONS)
    .order('year', { ascending: false });
    
  if (boardFilter && boardFilter !== "all") {
    query = query.eq('board', boardFilter);
  }
  
  if (chapterFilter && chapterFilter !== "all") {
    query = query.eq('chapter', chapterFilter);
  }
    
  const { data, error } = await query;
    
  if (error) {
    console.error("Error fetching board exams:", error);
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

export const fetchExamResults = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_results')
    .select('*, exams(title, board, year, chapter)')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false });
    
  if (error) {
    console.error("Error fetching exam results:", error);
    return [];
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
    const bucketName = fileType === 'paper' ? 
      `${boardFormatted}_papers` : 
      `${boardFormatted}_solutions`;
    
    const fileName = `${boardFormatted}_${fileType}_${examId}.pdf`;
    
    console.log(`Attempting to get ${fileType} from bucket: ${bucketName}, file: ${fileName}`);
    
    // Check if file exists in the specified bucket
    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .createSignedUrl(fileName, 60 * 60); // URL valid for 1 hour
    
    if (error) {
      console.error(`Error getting ${fileType} download URL:`, error);
      return null;
    }
    
    console.log(`Successfully got signed URL for ${fileType}:`, data.signedUrl);
    return data.signedUrl;
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
    const boardFormatted = board.replace(/\s/g, '_').toLowerCase();
    const bucketName = fileType === 'paper' ? 
      `${boardFormatted}_papers` : 
      `${boardFormatted}_solutions`;
    
    const fileName = `${boardFormatted}_${fileType}_${examId}.pdf`;
    
    console.log(`Uploading ${fileType} to bucket: ${bucketName}, file: ${fileName}`);
    
    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) {
      console.error(`Error uploading ${fileType}:`, error);
      throw error;
    }
    
    console.log(`Successfully uploaded ${fileType}:`, data);
    return fileName;
  } catch (error) {
    console.error(`Error uploading ${fileType}:`, error);
    throw error;
  }
};

export const createExam = async (examData: Omit<Exam, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('exams')
    .insert(examData)
    .select()
    .single();
    
  if (error) {
    console.error("Error creating exam:", error);
    throw error;
  }
  
  return data as Exam;
};

export const createQuestions = async (questions: Omit<Question, 'id'>[]) => {
  const { data, error } = await supabase
    .from('questions')
    .insert(questions)
    .select();
    
  if (error) {
    console.error("Error creating questions:", error);
    throw error;
  }
  
  return data as Question[];
};
