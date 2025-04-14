
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Function to ensure all required buckets exist
export const ensureStorageBuckets = async () => {
  try {
    console.log("Starting bucket creation check...");
    // Check if buckets exist
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error("Error listing buckets:", error);
      throw error;
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
    
    // Create a map of which buckets already exist
    const existingBuckets = new Map();
    buckets?.forEach(b => {
      existingBuckets.set(b.name, true);
      console.log(`Bucket exists: ${b.name}`);
    });
    
    // Create buckets that don't exist
    for (const bucketName of requiredBuckets) {
      if (!existingBuckets.has(bucketName)) {
        console.log(`Creating bucket: ${bucketName}`);
        try {
          const { error: createError } = await supabase.storage.createBucket(bucketName, {
            public: true, // Make bucket publicly accessible
            fileSizeLimit: 1024 * 1024 * 10 // 10MB
          });
          
          if (createError) {
            console.error(`Error creating bucket ${bucketName}:`, createError);
            // Continue trying to create other buckets even if one fails
          } else {
            console.log(`Successfully created bucket: ${bucketName}`);
          }
        } catch (err) {
          console.error(`Exception creating bucket ${bucketName}:`, err);
          // Continue with other buckets
        }
      }
    }
    
    // Verify buckets after creation attempts
    const { data: verifyBuckets, error: verifyError } = await supabase.storage.listBuckets();
    if (verifyError) {
      console.error("Error verifying buckets:", verifyError);
    } else {
      console.log("Buckets after creation:", verifyBuckets?.map(b => b.name));
    }
    
    return true;
  } catch (error) {
    console.error("Error ensuring storage buckets:", error);
    return false; // Return false if we fail to ensure buckets
  }
};

// Create a specific bucket directly without checking others
export const createSpecificBucket = async (bucketName: string): Promise<boolean> => {
  try {
    console.log(`Directly creating bucket: ${bucketName}`);
    const { error } = await supabase.storage.createBucket(bucketName, {
      public: true,
      fileSizeLimit: 1024 * 1024 * 10 // 10MB
    });
    
    if (error) {
      // If error is about bucket already existing, consider it a success
      if (error.message.includes('already exists')) {
        console.log(`Bucket ${bucketName} already exists, continuing...`);
        return true;
      }
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

export const getFileDownloadUrl = async (examId: string, fileType: 'paper' | 'solution', board: string) => {
  try {
    const boardLower = board.toLowerCase().replace(/\s+/g, '_');
    const bucketName = getBucketName(board, fileType);
    const fileName = `${boardLower}_${fileType}_${examId}.pdf`;
    
    console.log(`Attempting to get ${fileType} from bucket: ${bucketName}, file: ${fileName}`);
    
    // Try to create the bucket if it doesn't exist
    await createSpecificBucket(bucketName);
    
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
    
    // First, ensure the specific bucket exists before uploading
    const bucketCreated = await createSpecificBucket(bucketName);
    if (!bucketCreated) {
      throw new Error(`Failed to create or verify bucket: ${bucketName}`);
    }
    
    // Now attempt the upload
    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) {
      console.error(`Error uploading ${fileType}:`, error);
      toast.error(`Failed to upload ${fileType}: ${error.message}`);
      throw error;
    }
    
    console.log(`Successfully uploaded ${fileType}:`, data);
    return fileName;
  } catch (error: any) {
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
