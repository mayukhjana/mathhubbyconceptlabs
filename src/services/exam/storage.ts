
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Function to ensure all required buckets exist (now redundant, but kept for consistency)
export const ensureStorageBuckets = async () => {
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error("Error listing buckets:", error);
      return false;
    }
    
    const requiredBuckets = [
      'exam_papers', 
      'solutions', 
      'wbjee_papers', 
      'wbjee_solutions', 
      'jee_mains_papers', 
      'jee_mains_solutions', 
      'jee_advanced_papers', 
      'jee_advanced_solutions',
      'avatars'
    ];
    
    const existingBuckets = new Set(buckets?.map(b => b.name) || []);
    const missingBuckets = requiredBuckets.filter(bucket => !existingBuckets.has(bucket));
    
    if (missingBuckets.length > 0) {
      console.warn(`Missing buckets: ${missingBuckets.join(', ')}`);
    }
    
    return true;
  } catch (error) {
    console.error("Error ensuring storage buckets:", error);
    return false;
  }
};

// Improved function to get the correct bucket name
const getBucketName = (board: string, fileType: 'paper' | 'solution'): string => {
  const boardLower = board.toLowerCase().replace(/\s+/g, '_');
  
  const bucketMap: Record<string, { paper: string; solution: string }> = {
    'wbjee': { paper: 'wbjee_papers', solution: 'wbjee_solutions' },
    'jee_mains': { paper: 'jee_mains_papers', solution: 'jee_mains_solutions' },
    'jee_advanced': { paper: 'jee_advanced_papers', solution: 'jee_advanced_solutions' }
  };
  
  const mappedBucket = bucketMap[boardLower];
  return mappedBucket 
    ? mappedBucket[fileType] 
    : (fileType === 'paper' ? 'exam_papers' : 'solutions');
};

// Improved file name generation
const generateFileName = (
  examId: string, 
  fileType: 'paper' | 'solution', 
  board: string
): string => {
  const boardLower = board.toLowerCase().replace(/\s+/g, '_');
  return `${boardLower}_${fileType}_${examId}.pdf`;
};

export const getFileDownloadUrl = async (
  examId: string, 
  fileType: 'paper' | 'solution', 
  board: string
) => {
  try {
    const bucketName = getBucketName(board, fileType);
    const fileName = generateFileName(examId, fileType, board);
    
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

// Enhanced function to determine the correct content type based on file extension
const getContentType = (file: File): string => {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  // Enhanced map of extensions to content types
  const contentTypeMap: Record<string, string> = {
    'pdf': 'application/pdf',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    'bmp': 'image/bmp',
    'txt': 'text/plain',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  };
  
  const contentType = contentTypeMap[extension || ''] || file.type || 'application/octet-stream';
  console.log(`Determined content type for ${file.name}: ${contentType}`);
  return contentType;
};

export const uploadExamFile = async (
  file: File, 
  examId: string, 
  fileType: 'paper' | 'solution',
  board: string
) => {
  try {
    const bucketName = getBucketName(board, fileType);
    const fileName = generateFileName(examId, fileType, board);
    
    console.log(`Uploading ${fileType} to bucket: ${bucketName}, file: ${fileName}`);
    
    // Verify file is a PDF for exam papers and solutions
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension !== 'pdf') {
      const error = new Error(`Only PDF files are accepted for ${fileType}s`);
      toast.error(`Upload failed: ${error.message}`);
      throw error;
    }
    
    // Get the correct content type for the file
    const contentType = getContentType(file);
    console.log(`Setting content type: ${contentType} for file: ${file.name}`);
    
    // Set the correct content type in upload options
    const options = {
      cacheControl: '3600',
      upsert: true,
      contentType: contentType  // Explicitly set content type
    };
    
    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .upload(fileName, file, options);
    
    if (error) {
      console.error(`Error uploading ${fileType}:`, error);
      toast.error(`Failed to upload ${fileType}: ${error.message}`);
      throw error;
    }
    
    console.log(`Successfully uploaded ${fileType}:`, data);
    toast.success(`Successfully uploaded ${fileType}`);
    return fileName;
  } catch (error: any) {
    console.error(`Error uploading ${fileType}:`, error);
    toast.error(`Failed to upload ${fileType}: ${error.message}`);
    throw error;
  }
};

export const createSpecificBucket = async (bucketName: string): Promise<boolean> => {
  try {
    console.log(`Creating bucket: ${bucketName}`);
    
    const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error("Error checking existing buckets:", listError);
      return false;
    }
    
    const bucketExists = existingBuckets?.some(b => b.name === bucketName);
    if (bucketExists) {
      console.log(`Bucket ${bucketName} already exists, skipping creation`);
      return true;
    }
    
    // Create the bucket
    const { error } = await supabase
      .storage
      .createBucket(bucketName, {
        public: true,
        fileSizeLimit: 1024 * 1024 * 10 // 10MB
      });
    
    if (error) {
      console.error(`Error creating bucket ${bucketName}:`, error);
      return false;
    }
    
    console.log(`Successfully created bucket: ${bucketName}`);
    return true;
  } catch (error) {
    console.error(`Error creating bucket ${bucketName}:`, error);
    return false;
  }
};
