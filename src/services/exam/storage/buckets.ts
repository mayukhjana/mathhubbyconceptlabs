
import { supabase } from "@/integrations/supabase/client";

/**
 * Verifies that required storage buckets exist in the Supabase project
 * Buckets should be created via database migrations, not client-side
 */
export const ensureStorageBuckets = async () => {
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error("Error listing buckets:", error);
      return false;
    }
    
    // Check for the new unified bucket structure
    const requiredBuckets = ['exam-papers', 'exam-solutions', 'questions'];
    const existingBuckets = new Set(buckets?.map(b => b.name) || []);
    
    const hasAllBuckets = requiredBuckets.every(bucket => existingBuckets.has(bucket));
    
    if (!hasAllBuckets) {
      const missingBuckets = requiredBuckets.filter(bucket => !existingBuckets.has(bucket));
      console.error(`Missing required buckets: ${missingBuckets.join(', ')}`);
      console.log('Storage buckets should be created via database migrations');
      return false;
    }
    
    console.log('All required storage buckets exist');
    return true;
  } catch (error) {
    console.error("Error verifying storage buckets:", error);
    return false;
  }
};

/**
 * Verifies that a specific bucket exists
 * Buckets should be created via database migrations
 */
export const createSpecificBucket = async (bucketName: string): Promise<boolean> => {
  try {
    console.log(`Verifying bucket: ${bucketName}`);
    
    const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error("Error checking existing buckets:", listError);
      return false;
    }
    
    const bucketExists = existingBuckets?.some(b => b.name === bucketName);
    if (bucketExists) {
      console.log(`Bucket ${bucketName} exists`);
      return true;
    }
    
    console.error(`Bucket ${bucketName} does not exist. Create it via database migration.`);
    return false;
  } catch (error) {
    console.error(`Error verifying bucket ${bucketName}:`, error);
    return false;
  }
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
