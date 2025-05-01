import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, Trophy, CheckCircle, XCircle, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import QuestionCard from "@/components/QuestionCard";
import type { Question } from "@/services/exam/types";
import { useState } from "react";
interface ExamResultsProps {
  score: number;
  timeTaken: number;
  totalObtainedMarks: number;
  totalPossibleMarks: number;
  questions: Question[];
  userAnswers: Record<string, string>;
  resultSaved: boolean;
  formatTime: (seconds: number) => string;
}
export const ExamResults = ({
  score,
  timeTaken,
  totalObtainedMarks,
  totalPossibleMarks,
  questions,
  userAnswers,
  resultSaved,
  formatTime
}: ExamResultsProps) => {
  const [showQuestionAnalysis, setShowQuestionAnalysis] = useState(false);
  const attemptedCount = Object.keys(userAnswers).length;
  const unattemptedCount = questions.length - attemptedCount;

  // Calculate answer statistics
  const correctAnswers = questions.filter(q => userAnswers[q.id] && (q.is_multi_correct ? Array.isArray(q.correct_answer) ? q.correct_answer.join(',') === userAnswers[q.id] : q.correct_answer === userAnswers[q.id] : userAnswers[q.id] === q.correct_answer)).length;
  const incorrectAnswers = attemptedCount - correctAnswers;

  // Group questions by topic - fixed error by not accessing chapter/category directly
  const getTopics = () => {
    const topicMap = new Map();
    questions.forEach(q => {
      // Using a default topic name since Question doesn't have chapter/category
      const topic = "General"; // Fixed to use a default value instead of undefined properties

      if (!topicMap.has(topic)) {
        topicMap.set(topic, {
          total: 0,
          correct: 0,
          incorrect: 0,
          skipped: 0,
          timeTaken: 0,
          maxScore: 0,
          obtainedScore: 0
        });
      }
      const stats = topicMap.get(topic);
      stats.total += 1;
      stats.maxScore += q.marks;
      const isAttempted = userAnswers[q.id];
      if (!isAttempted) {
        stats.skipped += 1;
      } else {
        const isCorrect = q.is_multi_correct ? Array.isArray(q.correct_answer) ? q.correct_answer.join(',') === userAnswers[q.id] : q.correct_answer === userAnswers[q.id] : userAnswers[q.id] === q.correct_answer;
        if (isCorrect) {
          stats.correct += 1;
          stats.obtainedScore += q.marks;
        } else {
          stats.incorrect += 1;
          stats.obtainedScore -= q.negative_marks;
        }

        // Fixed: Don't try to access time_taken property which doesn't exist
        stats.timeTaken += timeTaken / attemptedCount; // Using average time instead
      }
    });
    return Array.from(topicMap).map(([topic, stats]) => ({
      topic,
      ...stats
    }));
  };
  const topicStats = getTopics();

  // Generate personalized feedback based on score
  const getFeedbackMessage = () => {
    if (score >= 90) {
      return "Outstanding performance! You've demonstrated exceptional understanding of the material.";
    } else if (score >= 75) {
      return "Great work! You have a solid grasp of most concepts.";
    } else if (score >= 60) {
      return "Good effort! You're on the right track, but there's room for improvement.";
    } else if (score >= 40) {
      return "You've made a good start, but should review the key concepts again.";
    } else {
      return "This topic needs more attention. Consider revisiting the fundamentals and practicing more.";
    }
  };

  // Generate study recommendations
  const getStudyRecommendations = () => {
    // Find topics with lowest performance
    const weakTopics = topicStats.filter(topic => topic.total > 0).sort((a, b) => a.correct / a.total - b.correct / b.total).slice(0, 2).map(topic => topic.topic);
    if (weakTopics.length === 0) {
      return "Continue practicing to maintain your knowledge.";
    }
    return `Focus on improving your understanding of ${weakTopics.join(', ')}.`;
  };
  const handleDownloadSolutions = () => {
    // Create a text document with all questions and answers
    let solutionsText = "EXAM SOLUTIONS\n\n";
    questions.forEach((question, index) => {
      solutionsText += `Question ${index + 1}: ${question.question_text}\n`;
      if (question.is_image_question && question.image_url) {
        solutionsText += `[Image Question - Image URL: ${question.image_url}]\n`;
      }
      solutionsText += `Option A: ${question.option_a}\n`;
      solutionsText += `Option B: ${question.option_b}\n`;
      solutionsText += `Option C: ${question.option_c}\n`;
      solutionsText += `Option D: ${question.option_d}\n`;
      solutionsText += `Correct Answer: ${question.correct_answer}\n`;
      solutionsText += `Your Answer: ${userAnswers[question.id] || "Not answered"}\n\n`;
    });

    // Create a blob and trigger download
    const blob = new Blob([solutionsText], {
      type: 'text/plain'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'exam-solutions.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  return <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-8 text-center">
      <div className="max-w-md mx-auto">
        <div className="w-24 h-24 bg-mathprimary/10 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy className="w-12 h-12 text-mathprimary dark:text-blue-400" />
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Exam Completed!</h1>
        
        <div className="bg-mathlight dark:bg-gray-700 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium mb-4">Your Results</h2>
          
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-600 dark:text-gray-300">Total Marks:</span>
            <span className="font-medium">{totalObtainedMarks} / {totalPossibleMarks}</span>
          </div>
          
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-600 dark:text-gray-300">Correct Answers:</span>
            <span className="font-medium">
              {correctAnswers} / {attemptedCount} attempted
            </span>
          </div>
          
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-600 dark:text-gray-300">Questions Attempted:</span>
            <span className="font-medium">
              {attemptedCount} / {questions.length}
              {unattemptedCount > 0 && ` (${unattemptedCount} skipped)`}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">Time Taken:</span>
            <span className="font-medium">{formatTime(timeTaken)}</span>
          </div>

          {resultSaved !== undefined && <div className="mt-3 pt-3 border-t">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Results Saved:</span>
                <span className={`font-medium ${resultSaved ? "text-green-500" : "text-red-500"}`}>
                  {resultSaved ? "Yes" : "No"}
                </span>
              </div>
            </div>}
        </div>
        
        {/* Advanced Test Feedback Section */}
        <div className="bg-white dark:bg-gray-800 border rounded-lg p-6 mb-8">
          <h2 className="text-lg font-bold text-left border-b pb-2 mb-4">ADVANCED TEST FEEDBACK</h2>
          
          <div className="text-left mb-4">
            <div className="mb-2">Exam Summary</div>
            <div className={`bg-${score < 40 ? 'red' : score < 70 ? 'amber' : 'green'}-100 p-3 rounded-md flex justify-between items-center mb-4`}>
              <div className={`text-${score < 40 ? 'red' : score < 70 ? 'amber' : 'green'}-800 font-bold`}>
                Marks: {totalObtainedMarks}/{totalPossibleMarks}
              </div>
              <div className={`text-${score < 40 ? 'red' : score < 70 ? 'amber' : 'green'}-800`}>
                Percentage: {score.toFixed(1)}%
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-3">Solution and Conceptwise Analysis</h3>
              <div className="grid grid-cols-1 gap-4">
                <Button variant="outline" onClick={() => setShowQuestionAnalysis(!showQuestionAnalysis)} className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md flex items-center gap-3 h-auto">
                  <div className="bg-blue-100 dark:bg-blue-800/50 p-2 rounded">
                    <FileText className="h-5 w-5 text-blue-500 dark:text-blue-300" />
                  </div>
                  <div className="text-sm text-left">
                    {showQuestionAnalysis ? "Hide Questionwise Analysis" : "Click to get Questionwise Analysis"}
                  </div>
                </Button>
                
                <Button variant="outline" onClick={handleDownloadSolutions} className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md flex items-center gap-3 h-auto">
                  <div className="bg-green-100 dark:bg-green-800/50 p-2 rounded">
                    <Download className="h-5 w-5 text-green-500 dark:text-green-300" />
                  </div>
                  <div className="text-sm text-left">Download Solutions</div>
                </Button>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-3">Score and Time Analysis</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md flex items-center gap-3 cursor-pointer">
                  <div className="bg-red-100 dark:bg-red-800/50 p-2 rounded">
                    <BarChart3 className="h-5 w-5 text-red-500 dark:text-red-300" />
                  </div>
                  <div className="text-sm">Topic wise Time Spent</div>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-md flex items-center gap-3 cursor-pointer">
                  <div className="bg-amber-100 dark:bg-amber-800/50 p-2 rounded">
                    <BarChart3 className="h-5 w-5 text-amber-500 dark:text-amber-300" />
                  </div>
                  <div className="text-sm">Topic wise Score</div>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span>Total number of Questions: {questions.length}</span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-sm">
                <div className="bg-green-500 text-white p-2 rounded-md">
                  <div className="font-bold">{correctAnswers}</div>
                  <div>Correct Answers</div>
                </div>
                <div className="bg-red-500 text-white p-2 rounded-md">
                  <div className="font-bold">{incorrectAnswers}</div>
                  <div>Incorrect Answers</div>
                </div>
                <div className="bg-gray-200 text-gray-800 p-2 rounded-md">
                  <div className="font-bold">{unattemptedCount}</div>
                  <div>Not Visited</div>
                </div>
                <div className="bg-blue-500 text-white p-2 rounded-md">
                  <div className="font-bold">0</div>
                  <div>Review Later</div>
                </div>
              </div>
            </div>
            
            {/* Topic-wise analysis */}
            <div className="mt-6 border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    
                    
                    
                    
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {topicStats.map((topic, index) => <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700/50'}>
                      
                      
                      
                      
                    </tr>)}
                </tbody>
              </table>
            </div>
            
            {/* Personalized feedback */}
            
          </div>
        </div>
        
        {showQuestionAnalysis && <>
            <h3 className="text-lg font-medium mb-4">Question Analysis</h3>
            
            <div className="space-y-4 max-h-96 overflow-y-auto mb-8">
              {questions.map((question, index) => <div key={question.id} className="border rounded-lg p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`p-1 rounded-full ${userAnswers[question.id] ? userAnswers[question.id] === question.correct_answer ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"}`}>
                      {userAnswers[question.id] ? userAnswers[question.id] === question.correct_answer ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" /> : <span className="h-5 w-5 flex items-center justify-center font-medium">?</span>}
                    </div>
                    <div>
                      <span className="font-medium">Question {index + 1}</span>
                      <p className="text-sm text-gray-600">{question.marks} marks</p>
                    </div>
                  </div>
                  
                  <p className="text-left mb-3">{question.question_text}</p>
                  
                  {question.is_image_question && question.image_url && <img src={question.image_url} alt="Question" className="max-h-40 object-contain mx-auto mb-3" />}
                  
                  <div className="grid grid-cols-1 gap-2 mb-3">
                    {["a", "b", "c", "d"].map(opt => <div key={opt} className={`p-2 border rounded-md text-left ${userAnswers[question.id] === opt ? userAnswers[question.id] === question.correct_answer ? "bg-green-100 border-green-300" : "bg-red-100 border-red-300" : opt === question.correct_answer ? "bg-green-50 border-green-200" : ""}`}>
                        <span className="font-medium mr-2">{opt.toUpperCase()}:</span>
                        {question[`option_${opt}` as keyof typeof question] as string}
                      </div>)}
                  </div>
                  
                  {userAnswers[question.id] !== question.correct_answer && <div className="text-left bg-blue-50 p-2 rounded-md">
                      <span className="font-medium">Correct answer: </span>
                      {question.correct_answer}
                    </div>}
                </div>)}
            </div>
          </>}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" className="gap-2" asChild>
            <Link to="/results">
              <BarChart3 size={16} />
              View All Results
            </Link>
          </Button>
          
          <Button className="gap-2" asChild>
            <Link to="/exams">
              <ArrowRight size={16} />
              More Exams
            </Link>
          </Button>
        </div>
      </div>
    </div>;
};