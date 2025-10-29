
/**
 * Utility functions for determining storage paths and bucket names
 */

/**
 * Gets the unified bucket name for exam files
 * All exam papers go to 'exam-papers', all solutions go to 'exam-solutions'
 */
export const getBucketName = (board: string, fileType: 'paper' | 'solution'): string => {
  return fileType === 'paper' ? 'exam-papers' : 'exam-solutions';
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
