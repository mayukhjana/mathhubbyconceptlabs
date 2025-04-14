
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
          const { data, error } = await supabase.storage.createBucket(bucketName, {
            public: true,
            fileSizeLimit: 1024 * 1024 * 10 // 10MB
          });
          
          if (error) {
            // If error is about bucket already existing, consider it a success
            if (error.message && error.message.includes('already exists')) {
              console.log(`Bucket ${bucketName} already exists, continuing...`);
            } else {
              console.error(`Error creating bucket ${bucketName}:`, error);
            }
          } else {
            console.log(`Successfully created bucket: ${bucketName}`);
            // Ensure bucket is public
            await supabase.storage.updateBucket(bucketName, {
              public: true,
              fileSizeLimit: 1024 * 1024 * 10 // 10MB
            });
          }
        } catch (err) {
          console.error(`Error creating bucket ${bucketName}:`, err);
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
    return false;
  }
};

// Create a specific bucket directly with better error handling
export const createSpecificBucket = async (bucketName: string): Promise<boolean> => {
  try {
    console.log(`Directly creating bucket: ${bucketName}`);
    
    // First check if the bucket already exists
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
    
    // Create the bucket with retry
    let retries = 3;
    while (retries > 0) {
      const { data, error } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 1024 * 1024 * 10 // 10MB
      });
      
      if (error) {
        // If error is about bucket already existing, consider it a success
        if (error.message && error.message.includes('already exists')) {
          console.log(`Bucket ${bucketName} already exists, continuing...`);
          return true;
        }
        console.error(`Error creating bucket ${bucketName} (attempts left: ${retries-1}):`, error);
        retries--;
        if (retries === 0) {
          return false;
        }
        // Wait a bit before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        console.log(`Successfully created bucket: ${bucketName}`);
        
        // Update the bucket to be publicly accessible
        const { error: updateError } = await supabase.storage.updateBucket(bucketName, {
          public: true,
          fileSizeLimit: 1024 * 1024 * 10 // 10MB
        });
        
        if (updateError) {
          console.error(`Error updating bucket ${bucketName}:`, updateError);
        }
        
        return true;
      }
    }
    
    return false;
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
    const bucketCreated = await createSpecificBucket(bucketName);
    if (!bucketCreated) {
      console.error(`Failed to create or verify bucket: ${bucketName}`);
      return null;
    }
    
    // Check if the file exists before creating a signed URL
    const { data: fileExists, error: fileCheckError } = await supabase
      .storage
      .from(bucketName)
      .list('', { 
        search: fileName 
      });
    
    if (fileCheckError) {
      console.error(`Error checking if file exists:`, fileCheckError);
      return null;
    }
    
    if (!fileExists || fileExists.length === 0) {
      console.log(`File ${fileName} does not exist in bucket ${bucketName}`);
      return null;
    }
    
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
    
    // First, ensure the specific bucket exists before uploading - multiple attempts
    let bucketReady = false;
    let attempts = 0;
    const maxAttempts = 3;
    
    while (!bucketReady && attempts < maxAttempts) {
      attempts++;
      console.log(`Attempt ${attempts}/${maxAttempts} to create or verify bucket: ${bucketName}`);
      
      bucketReady = await createSpecificBucket(bucketName);
      
      if (!bucketReady) {
        // Wait a bit before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    if (!bucketReady) {
      const errorMsg = `Failed to create or verify bucket: ${bucketName} after ${maxAttempts} attempts`;
      console.error(errorMsg);
      toast.error(`Failed to upload ${fileType}: ${errorMsg}`);
      throw new Error(errorMsg);
    }
    
    // Verify bucket exists again to be super sure
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(b => b.name === bucketName);
    
    if (!bucketExists) {
      const errorMsg = `Bucket ${bucketName} still doesn't exist after creation attempts`;
      console.error(errorMsg);
      toast.error(`Failed to upload ${fileType}: ${errorMsg}`);
      throw new Error(errorMsg);
    } else {
      console.log(`Confirmed bucket ${bucketName} exists, proceeding with upload`);
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
    toast.success(`Successfully uploaded ${fileType}`);
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
