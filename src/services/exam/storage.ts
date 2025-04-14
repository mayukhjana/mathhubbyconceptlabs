
import { supabase } from "@/integrations/supabase/client";

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
    
    const bucketsList = {
      exam_papers: false,
      solutions: false,
      wbjee_papers: false,
      wbjee_solutions: false,
      jee_mains_papers: false,
      jee_mains_solutions: false,
      jee_advanced_papers: false,
      jee_advanced_solutions: false
    };
    
    // Check which buckets already exist
    buckets?.forEach(b => {
      if (bucketsList.hasOwnProperty(b.name)) {
        bucketsList[b.name as keyof typeof bucketsList] = true;
        console.log(`Bucket exists: ${b.name}`);
      }
    });
    
    // Create buckets that don't exist
    const createPromises = [];
    
    for (const [name, exists] of Object.entries(bucketsList)) {
      if (!exists) {
        console.log(`Creating bucket: ${name}`);
        createPromises.push(
          supabase.storage.createBucket(name, {
            public: true, // Make bucket publicly accessible
            fileSizeLimit: 1024 * 1024 * 10 // 10MB
          })
        );
      }
    }
    
    if (createPromises.length > 0) {
      const results = await Promise.allSettled(createPromises);
      
      // Log results for each bucket creation attempt
      results.forEach((result, index) => {
        const bucketName = Object.keys(bucketsList).filter(name => !bucketsList[name as keyof typeof bucketsList])[index];
        if (result.status === 'fulfilled') {
          console.log(`Successfully created bucket: ${bucketName}`);
        } else {
          console.error(`Failed to create bucket ${bucketName}:`, result.reason);
        }
      });
      
      // Verify buckets after creation attempts
      const { data: verifyBuckets, error: verifyError } = await supabase.storage.listBuckets();
      if (verifyError) {
        console.error("Error verifying buckets:", verifyError);
      } else {
        console.log("Buckets after creation:", verifyBuckets.map(b => b.name));
      }
    } else {
      console.log("All required buckets already exist");
    }
    
    return true;
  } catch (error) {
    console.error("Error ensuring storage buckets:", error);
    return false; // Return false if we fail to ensure buckets
  }
};

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
    // First ensure all required buckets exist
    await ensureStorageBuckets();
    
    const boardLower = board.toLowerCase().replace(/\s+/g, '_');
    const bucketName = getBucketName(board, fileType);
    const fileName = `${boardLower}_${fileType}_${examId}.pdf`;
    
    console.log(`Uploading ${fileType} to bucket: ${bucketName}, file: ${fileName}`);
    
    // Check if file exists first and try to delete it (to handle permission errors)
    const { data: existingFile } = await supabase
      .storage
      .from(bucketName)
      .list('', {
        limit: 1,
        search: fileName
      });
    
    if (existingFile && existingFile.length > 0) {
      console.log(`File ${fileName} already exists, attempting to delete first`);
      await supabase.storage.from(bucketName).remove([fileName]);
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
      if (error.message.includes('bucket') && error.message.includes('not found')) {
        // Try creating the bucket specifically and attempt upload again
        console.log(`Attempting to explicitly create bucket ${bucketName}...`);
        const { error: bucketError } = await supabase.storage.createBucket(bucketName, {
          public: true,
          fileSizeLimit: 1024 * 1024 * 10 // 10MB
        });
        
        if (bucketError) {
          console.error(`Failed to create bucket ${bucketName}:`, bucketError);
          throw new Error(`Failed to create bucket ${bucketName}: ${bucketError.message}`);
        }
        
        // Try upload again after bucket creation
        const { data: retryData, error: retryError } = await supabase
          .storage
          .from(bucketName)
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: true
          });
          
        if (retryError) {
          console.error(`Error on retry uploading ${fileType}:`, retryError);
          throw retryError;
        }
        
        console.log(`Successfully uploaded ${fileType} on retry:`, retryData);
        return fileName;
      } else {
        throw error;
      }
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
