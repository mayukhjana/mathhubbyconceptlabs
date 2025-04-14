import { supabase } from "@/integrations/supabase/client";
import type { Exam, Question } from "./types";
import { BOARD_OPTIONS, ENTRANCE_OPTIONS } from "./types";

export const fetchExam = async (examId: string) => {
  return fetchExamById(examId);
};

export const fetchExamByBoardAndYear = async (board: string, year: string) => {
  try {
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
  } catch (error) {
    console.error("Exception fetching exam by board and year:", error);
    return null;
  }
};

export const fetchExamById = async (examId: string) => {
  if (isMockExam(examId)) {
    return getMockExamData(examId);
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
    return getMockQuestions(examId);
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
  try {
    const { data, error } = await supabase
      .from('exams')
      .select()
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching exams:", error);
      return [];
    }
    
    return data as Exam[];
  } catch (error) {
    console.error("Exception fetching practice papers:", error);
    return [];
  }
};

export const fetchEntranceExams = async (boardFilter?: string) => {
  try {
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
  } catch (error) {
    console.error("Exception fetching entrance exams:", error);
    return [];
  }
};

export const fetchBoardExams = async (boardFilter?: string, chapterFilter?: string) => {
  try {
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
  } catch (error) {
    console.error("Exception fetching board exams:", error);
    return [];
  }
};

const isMockExam = (examId: string) => {
  return examId.includes('icse-') || examId.includes('cbse-') || examId.includes('wb-');
};

const getMockExamData = (examId: string): Exam => {
  return {
    id: examId,
    title: `Mock Exam ${examId}`,
    board: examId.includes('icse-') ? 'ICSE' : examId.includes('cbse-') ? 'CBSE' : 'West Bengal Board',
    year: "2022",
    class: "10",
    chapter: examId.includes('alg-') ? 'Algebra' : examId.includes('geo-') ? 'Geometry' : 'Trigonometry',
    duration: 60,
    is_premium: false
  };
};

const getMockQuestions = (examId: string): Question[] => {
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
};
