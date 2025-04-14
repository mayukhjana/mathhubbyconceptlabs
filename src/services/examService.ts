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

const isMockExam = (examId: string) => {
  return examId.includes('icse-') || examId.includes('cbse-') || examId.includes('wb-');
};

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
  if (isMockExam(examId)) {
    const mockExamData = {
      id: examId,
      title: `Mock Exam ${examId}`,
      board: examId.includes('icse-') ? 'ICSE' : examId.includes('cbse-') ? 'CBSE' : 'West Bengal Board',
      year: "2022",
      class: "10",
      chapter: examId.includes('alg-') ? 'Algebra' : examId.includes('geo-') ? 'Geometry' : 'Trigonometry',
      duration: 60,
      is_premium: false
    };
    return mockExamData;
  }

  try {
    const { data, error } = await supabase
      .from('exams')
      .select()
      .eq('id', examId)
      .single();
      
    if (error) {
      console.error("Error fetching exam:", error);
      return null;
    }
    
    console.log("Fetched exam data:", data);
    return data as Exam;
  } catch (error) {
    console.error("Exception fetching exam:", error);
    return null;
  }
};

export const fetchQuestionsForExam = async (examId: string) => {
  if (isMockExam(examId)) {
    return [
      {
        id: "q1",
        exam_id: examId,
        question_text: "If a² + b² = 25 and ab = 12, find the value of (a + b)².",
        option_a: "25",
        option_b: "37",
        option_c: "49",
        option_d: "61",
        correct_answer: "c",
        order_number: 1
      },
      {
        id: "q2",
        exam_id: examId,
        question_text: "Solve for x: 3x² - 5x - 2 = 0",
        option_a: "x = 2, x = -1/3",
        option_b: "x = -2, x = 1/3",
        option_c: "x = 2, x = 1/3",
        option_d: "x = -2, x = -1/3",
        correct_answer: "a",
        order_number: 2
      },
      {
        id: "q3",
        exam_id: examId,
        question_text: "The sum of first n terms of an AP is 3n² + 4n. Find the nth term of the AP.",
        option_a: "6n + 4",
        option_b: "6n + 1",
        option_c: "6n - 2",
        option_d: "6n",
        correct_answer: "a",
        order_number: 3
      },
      {
        id: "q4",
        exam_id: examId,
        question_text: "If α and β are the roots of the equation x² - 5x + 6 = 0, find the value of α² + β².",
        option_a: "13",
        option_b: "25",
        option_c: "36",
        option_d: "49",
        correct_answer: "b",
        order_number: 4
      },
      {
        id: "q5",
        exam_id: examId,
        question_text: "The quadratic equation x² + px + 12 = 0 has equal roots. Find the value of p.",
        option_a: "±4",
        option_b: "±6",
        option_c: "±8",
        option_d: "±12",
        correct_answer: "c",
        order_number: 5
      }
    ];
  }

  try {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('exam_id', examId)
      .order('order_number', { ascending: true });
      
    if (error) {
      console.error("Error fetching questions:", error);
      return [];
    }
    
    console.log("Fetched questions:", data);
    return data as Question[];
  } catch (error) {
    console.error("Exception fetching questions:", error);
    return [];
  }
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
    const boardLower = board.toLowerCase().replace(/\s+/g, '_');
    
    const isEntranceBoard = ENTRANCE_OPTIONS.some(opt => opt.toLowerCase().replace(/\s+/g, '_') === boardLower);
    
    let bucketName;
    if (isEntranceBoard) {
      bucketName = fileType === 'paper' 
        ? `${boardLower}_papers` 
        : `${boardLower}_solutions`;
    } else {
      bucketName = fileType === 'paper' ? 'exam_papers' : 'solutions';
    }
    
    const fileName = `${boardLower}_${fileType}_${examId}.pdf`;
    
    console.log(`Attempting to get ${fileType} from bucket: ${bucketName}, file: ${fileName}`);
    
    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .createSignedUrl(fileName, 60 * 60);
    
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
    const boardLower = board.toLowerCase().replace(/\s+/g, '_');
    
    const isEntranceBoard = ENTRANCE_OPTIONS.some(opt => opt.toLowerCase().replace(/\s+/g, '_') === boardLower);
    
    let bucketName;
    if (isEntranceBoard) {
      bucketName = fileType === 'paper' 
        ? `${boardLower}_papers` 
        : `${boardLower}_solutions`;
    } else {
      bucketName = fileType === 'paper' ? 'exam_papers' : 'solutions';
    }
    
    const fileName = `${boardLower}_${fileType}_${examId}.pdf`;
    
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

export const examHasMCQs = async (examId: string): Promise<boolean> => {
  const { count, error } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true })
    .eq('exam_id', examId);
    
  if (error) {
    console.error("Error checking if exam has MCQs:", error);
    return false;
  }
  
  return count !== null && count > 0;
};

export const deleteWBJEEExams = async () => {
  try {
    const { data: wbjeeExams } = await supabase
      .from('exams')
      .select('id')
      .eq('board', 'WBJEE');
    
    if (wbjeeExams && wbjeeExams.length > 0) {
      const examIds = wbjeeExams.map(exam => exam.id);
      
      await supabase
        .from('questions')
        .delete()
        .in('exam_id', examIds);
      
      const { error } = await supabase
        .from('exams')
        .delete()
        .eq('board', 'WBJEE');
      
      if (error) throw error;
      
      return { success: true, message: `Deleted ${wbjeeExams.length} WBJEE exams` };
    }
    
    return { success: true, message: "No WBJEE exams to delete" };
  } catch (error) {
    console.error("Error deleting WBJEE exams:", error);
    throw error;
  }
};
