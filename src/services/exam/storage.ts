
import { supabase } from "@/integrations/supabase/client";

export const getFileDownloadUrl = async (examId: string, fileType: 'paper' | 'solution', board: string) => {
  try {
    const boardLower = board.toLowerCase().replace(/\s+/g, '_');
    const bucketName = getBucketName(board, fileType);
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
    const bucketName = getBucketName(board, fileType);
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

const getBucketName = (board: string, fileType: 'paper' | 'solution'): string => {
  if (board === 'WBJEE') {
    return fileType === 'paper' ? 'wbjee_papers' : 'wbjee_solutions';
  } else if (board === 'JEE MAINS') {
    return fileType === 'paper' ? 'jee_mains_papers' : 'jee_mains_solutions';
  } else if (board === 'JEE ADVANCED') {
    return fileType === 'paper' ? 'jee_advanced_papers' : 'jee_advanced_solutions';
  } else {
    return fileType === 'paper' ? 'exam_papers' : 'solutions';
  }
};
