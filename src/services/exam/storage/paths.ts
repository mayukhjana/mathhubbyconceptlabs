
/**
 * Utility functions for determining storage paths and bucket names
 */

/**
 * Gets the correct bucket name based on exam board and file type
 */
export const getBucketName = (board: string, fileType: 'paper' | 'solution'): string => {
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

/**
 * Generates a standardized file name for exam files
 */
export const generateFileName = (
  examId: string, 
  fileType: 'paper' | 'solution', 
  board: string
): string => {
  const boardLower = board.toLowerCase().replace(/\s+/g, '_');
  return `${boardLower}_${fileType}_${examId}.pdf`;
};
