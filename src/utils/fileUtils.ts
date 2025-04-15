/**
 * Utility functions for file handling and content type detection
 */

/**
 * Determines the correct MIME content type from a file object
 * based on its extension or type property
 */
export const getContentTypeFromFile = (file: File): string => {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  // Map of common file extensions to MIME types
  const contentTypeMap: Record<string, string> = {
    // Images
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    'bmp': 'image/bmp',
    
    // Documents
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'txt': 'text/plain',
    
    // Other types can be added as needed
  };
  
  // Return the mapped content type, fallback to file.type, or use octet-stream as last resort
  return contentTypeMap[extension || ''] || file.type || 'application/octet-stream';
};

/**
 * Checks if a file is an image based on its content type
 */
export const isImageFile = (file: File): boolean => {
  const contentType = getContentTypeFromFile(file);
  return contentType.startsWith('image/');
};

/**
 * Converts a File object to a Blob with the correct content type
 */
export const fileToTypedBlob = async (file: File): Promise<Blob> => {
  const contentType = getContentTypeFromFile(file);
  const arrayBuffer = await file.arrayBuffer();
  return new Blob([arrayBuffer], { type: contentType });
};
