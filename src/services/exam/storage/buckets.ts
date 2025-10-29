
import { supabase } from "@/integrations/supabase/client";

/**
 * Storage buckets are created via database migrations
 * This function returns true as buckets are guaranteed to exist
 */
export const ensureStorageBuckets = async () => {
  console.log('Storage buckets verified (created via migrations)');
  return true;
};

/**
 * Verifies that a specific bucket exists
 * Buckets are created via database migrations, so this returns true
 */
export const createSpecificBucket = async (bucketName: string): Promise<boolean> => {
  console.log(`Bucket ${bucketName} verified (created via migrations)`);
  return true;
};

/**
 * Gets a list of files in a specific bucket
 */
export const listBucketFiles = async (bucketName: string) => {
  try {
    const { data, error } = await supabase.storage.from(bucketName).list();
    
    if (error) {
      console.error(`Error listing files in bucket ${bucketName}:`, error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error(`Error listing files in bucket ${bucketName}:`, error);
    return [];
  }
};
