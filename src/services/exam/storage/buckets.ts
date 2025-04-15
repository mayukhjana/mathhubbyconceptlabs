
import { supabase } from "@/integrations/supabase/client";

/**
 * Ensures all required storage buckets exist in the Supabase project
 */
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
      // Don't try to create buckets automatically - it requires admin permissions
      // Just log the warning so developers are aware
    }
    
    return true;
  } catch (error) {
    console.error("Error ensuring storage buckets:", error);
    return false;
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
    
    // Note: Creating buckets requires admin privileges in Supabase
    // Regular users will get an error here
    try {
      const { error } = await supabase
        .storage
        .createBucket(bucketName, {
          public: true,
          fileSizeLimit: 1024 * 1024 * 10 // 10MB
        });
      
      if (error) {
        // Log but don't throw - this is expected for non-admin users
        console.error(`Error creating bucket ${bucketName}:`, error);
        return false;
      }
      
      console.log(`Successfully created bucket: ${bucketName}`);
      return true;
    } catch (createError) {
      console.error(`Error creating bucket ${bucketName}:`, createError);
      return false;
    }
  } catch (error) {
    console.error(`Error creating bucket ${bucketName}:`, error);
    return false;
  }
};
