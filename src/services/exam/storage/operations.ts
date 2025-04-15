
import { supabase } from "@/integrations/supabase/client";
import { getBucketName, generateFileName } from "./paths";
import { getContentTypeFromFile } from "@/utils/fileUtils";
import { toast } from "sonner";

/**
 * Retrieves a signed URL for downloading an exam file
 */
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

/**
 * Uploads an exam file to the appropriate storage bucket
 */
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
    
    // Verify file is a PDF
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension !== 'pdf') {
      const error = new Error(`Only PDF files are accepted for ${fileType}s`);
      toast.error(`Upload failed: ${error.message}`);
      throw error;
    }
    
    // Get the correct content type using our utility
    const contentType = getContentTypeFromFile(file);
    console.log(`Setting content type: ${contentType} for file: ${file.name}`);
    
    // Convert file to properly typed blob
    const fileArrayBuffer = await file.arrayBuffer();
    const blob = new Blob([fileArrayBuffer], { type: contentType });
    
    // Set the correct content type in upload options
    const options = {
      cacheControl: '3600',
      upsert: true,
      contentType: contentType
    };
    
    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .upload(fileName, blob, options);
    
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
