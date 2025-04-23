
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { STORAGE_BUCKETS } from "./paths";

/**
 * Creates a specific storage bucket with proper configuration
 */
export const createSpecificBucket = async (bucketName: string, retryCount = 0): Promise<boolean> => {
  try {
    console.log(`Creating or verifying storage bucket: ${bucketName}`);
    
    // Check if bucket exists first
    const { data: bucketList, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error("Error listing buckets:", listError);
      return false;
    }
    
    const bucketExists = bucketList?.find(bucket => bucket.name === bucketName);
    
    if (bucketExists) {
      console.log(`Bucket ${bucketName} already exists`);
      return true;
    }
    
    // Try direct bucket creation first
    const { data: directData, error: directError } = await supabase.storage.createBucket(bucketName, {
      public: true, // Make buckets public by default for this app
      fileSizeLimit: 5 * 1024 * 1024, // 5MB limit
    });
    
    if (!directError) {
      console.log(`Successfully created ${bucketName} bucket directly:`, directData);
      return true;
    }
    
    console.log(`Direct bucket creation failed, trying edge function: ${directError.message}`);
    
    // Fall back to edge function if direct creation fails
    const { data, error: functionError } = await supabase.functions.invoke('create-avatars-bucket', {
      body: { bucketName }
    });
    
    if (functionError) {
      console.error(`Error creating ${bucketName} bucket via edge function:`, functionError);
      
      // Retry logic (max 2 retries)
      if (retryCount < 2) {
        console.log(`Retrying bucket creation for ${bucketName} (attempt ${retryCount + 1})`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
        return createSpecificBucket(bucketName, retryCount + 1);
      }
      
      return false;
    }
    
    if (data && data.success) {
      console.log(`Successfully created ${bucketName} bucket via edge function`);
      return true;
    } else {
      console.error(`Failed to create ${bucketName} bucket:`, data?.error || 'Unknown error');
      return false;
    }
  } catch (error) {
    console.error(`Error setting up ${bucketName} bucket:`, error);
    return false;
  }
};

/**
 * Ensures that all required storage buckets exist
 */
export const ensureStorageBuckets = async (): Promise<boolean> => {
  try {
    console.log("Ensuring all storage buckets exist...");
    
    // Initialize paper and solution buckets
    const paperBucketsPromise = [
      STORAGE_BUCKETS.PAPERS.JEE,
      STORAGE_BUCKETS.PAPERS.WBJEE,
      STORAGE_BUCKETS.PAPERS.SSC_CGL,
      STORAGE_BUCKETS.PAPERS.BITSAT,
      STORAGE_BUCKETS.PAPERS.OTHER,
      STORAGE_BUCKETS.PAPERS.MAHARASHTRA,
      STORAGE_BUCKETS.PAPERS.KARNATAKA,
      STORAGE_BUCKETS.PAPERS.TAMILNADU,
    ].map(bucketName => createSpecificBucket(bucketName));
    
    const solutionBucketsPromise = [
      STORAGE_BUCKETS.SOLUTIONS.JEE,
      STORAGE_BUCKETS.SOLUTIONS.WBJEE,
      STORAGE_BUCKETS.SOLUTIONS.SSC_CGL,
      STORAGE_BUCKETS.SOLUTIONS.BITSAT,
      STORAGE_BUCKETS.SOLUTIONS.OTHER,
      STORAGE_BUCKETS.SOLUTIONS.MAHARASHTRA,
      STORAGE_BUCKETS.SOLUTIONS.KARNATAKA,
      STORAGE_BUCKETS.SOLUTIONS.TAMILNADU,
    ].map(bucketName => createSpecificBucket(bucketName));
    
    // Create avatars and questions buckets
    const avatarsBucketPromise = createSpecificBucket(STORAGE_BUCKETS.AVATARS);
    const questionsBucketPromise = createSpecificBucket(STORAGE_BUCKETS.QUESTIONS);
    
    // Wait for all buckets to be created
    const results = await Promise.all([
      ...paperBucketsPromise,
      ...solutionBucketsPromise,
      avatarsBucketPromise,
      questionsBucketPromise
    ]);
    
    // Check if all buckets were created successfully
    const allBucketsCreated = results.every(result => result === true);
    
    if (!allBucketsCreated) {
      toast.error('Some storage buckets could not be initialized');
      console.error('Not all buckets were initialized successfully');
    } else {
      toast.success('Storage buckets initialized successfully');
      console.log('All buckets initialized successfully');
    }
    
    return allBucketsCreated;
  } catch (error) {
    console.error('Error ensuring storage buckets:', error);
    toast.error('Failed to initialize storage buckets');
    return false;
  }
};
