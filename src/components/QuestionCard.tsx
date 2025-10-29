import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Image } from "lucide-react";
import katex from "katex";
import "katex/dist/katex.min.css";
import LanguageSelector from "./LanguageSelector";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface QuestionCardProps {
  question: {
    id: string;
    text: string;
    options: { id: string; text: string }[];
    correctAnswer: string | string[];
    marks: number;
    negative_marks: number;
    is_multi_correct: boolean;
    image_url?: string;
    is_image_question: boolean;
  };
  onAnswer: (id: string, answer: string) => void;
  userAnswer?: string;
  showResult?: boolean;
  questionNumber: number;
  skipped?: boolean;
}

const QuestionCard = ({
  question,
  onAnswer,
  userAnswer,
  showResult = false,
  questionNumber,
  skipped = false
}: QuestionCardProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState(userAnswer || "");
  const [imageLoading, setImageLoading] = useState(!!question.image_url);
  const [imageError, setImageError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [cacheBustUrl, setCacheBustUrl] = useState<string | undefined>(question.image_url);
  const [examType, setExamType] = useState<string | null>(null);
  const { examId } = useParams<{ examId: string }>();
  const [translatedQuestion, setTranslatedQuestion] = useState<string>(question.text);
  const [translatedOptions, setTranslatedOptions] = useState<Record<string, string>>({});
  const [currentLanguage, setCurrentLanguage] = useState<string>('English');
  const [isTranslating, setIsTranslating] = useState(false);

  // Fetch exam details to determine if it's a WBJEE paper
  useEffect(() => {
    const fetchExamDetails = async () => {
      if (examId) {
        try {
          const { data, error } = await supabase
            .from('exams')
            .select('board')
            .eq('id', examId)
            .single();
          
          if (data && !error) {
            setExamType(data.board);
          }
        } catch (error) {
          console.error("Error fetching exam details:", error);
        }
      }
    };
    
    fetchExamDetails();
  }, [examId]);

  useEffect(() => {
    if (question.image_url) {
      const timestamp = new Date().getTime();
      const newUrl = `${question.image_url}${question.image_url.includes('?') ? '&' : '?'}t=${timestamp}`;
      setCacheBustUrl(newUrl);
      console.log("QuestionCard: Setting up image with cache bust URL:", newUrl);
      
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        console.log("QuestionCard: Image preloaded successfully:", newUrl);
        setImageLoading(false);
        setImageError(false);
      };
      img.onerror = () => {
        console.error("QuestionCard: Failed to preload image:", newUrl);
        setImageLoading(false);
        setImageError(true);
        
        if (retryCount < 3) {
          setRetryCount(prev => prev + 1);
          const newTimestamp = new Date().getTime();
          const retryUrl = `${question.image_url}${question.image_url.includes('?') ? '&' : '?'}t=${newTimestamp}_${retryCount}`;
          console.log("QuestionCard: Retrying image load, attempt:", retryCount + 1, "with URL:", retryUrl);
          setCacheBustUrl(retryUrl);
          setImageLoading(true);
        }
      };
      img.src = newUrl;
    }
  }, [question.image_url]);

  const handleAnswerChange = (answer: string) => {
    // If the user selects the same answer that's already selected, clear the selection
    const newAnswer = answer === selectedAnswer ? "" : answer;
    setSelectedAnswer(newAnswer);
    onAnswer(question.id, newAnswer);
  };

  const handleImageLoad = () => {
    console.log("QuestionCard: Image loaded successfully:", cacheBustUrl);
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
    console.error("QuestionCard: Failed to load question image:", cacheBustUrl);
    
    if (retryCount < 3 && question.image_url) {
      setRetryCount(prev => prev + 1);
      const timestamp = Date.now();
      const newUrl = `${question.image_url}${question.image_url.includes('?') ? '&' : '?'}t=${timestamp}_${retryCount}`;
      console.log("QuestionCard: Retrying image load, attempt:", retryCount + 1, "with URL:", newUrl);
      setCacheBustUrl(newUrl);
      setImageLoading(true);
    }
  };

  const isCorrectAnswer = (selected: string, correct: string | string[]): boolean => {
    if (Array.isArray(correct)) {
      return correct.includes(selected);
    }
    return selected === correct;
  };

  // Custom radio handler for double-click to unselect
  const handleRadioDoubleClick = (optionId: string) => {
    if (selectedAnswer === optionId) {
      setSelectedAnswer("");
      onAnswer(question.id, "");
    }
  };
  
  // Function to render text with LaTeX formulas
  const renderWithLatex = (text: string) => {
    try {
      return text.split(/(\$[^$]+\$)/).map((part, index) => {
        if (part.startsWith('$') && part.endsWith('$')) {
          const math = part.slice(1, -1);
          return (
            <span
              key={index}
              dangerouslySetInnerHTML={{
                __html: katex.renderToString(math, {
                  throwOnError: false,
                  displayMode: false
                })
              }}
            />
          );
        }
        return <span key={index}>{part}</span>;
      });
    } catch (error) {
      console.error('Error rendering LaTeX:', error);
      return text;
    }
  };

  // Collect all text for translation
  const getAllQuestionText = () => {
    return `${question.text}\n\nOptions:\nA: ${question.options[0].text}\nB: ${question.options[1].text}\nC: ${question.options[2].text}\nD: ${question.options[3].text}`;
  };

  const handleLanguageSelect = async (langCode: string, langName: string) => {
    if (langCode === 'en') {
      setTranslatedQuestion(question.text);
      setTranslatedOptions({});
      setCurrentLanguage('English');
      return;
    }

    setIsTranslating(true);
    toast.info(`Translating to ${langName}...`);

    try {
      // Translate question text
      const { data: questionData, error: questionError } = await supabase.functions.invoke('translate-question', {
        body: {
          text: question.text,
          targetLanguage: langCode,
          targetLanguageName: langName
        }
      });

      if (questionError) throw questionError;

      // Translate all options
      const optionTranslations: Record<string, string> = {};
      for (const option of question.options) {
        const { data: optionData, error: optionError } = await supabase.functions.invoke('translate-question', {
          body: {
            text: option.text,
            targetLanguage: langCode,
            targetLanguageName: langName
          }
        });

        if (optionError) throw optionError;
        optionTranslations[option.id] = optionData.translatedText;
      }

      setTranslatedQuestion(questionData.translatedText);
      setTranslatedOptions(optionTranslations);
      setCurrentLanguage(langName);
      toast.success(`Translated to ${langName}`);
    } catch (error) {
      console.error('Translation error:', error);
      toast.error('Translation failed. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  // Determine if this is a WBJEE paper to set Bengali as target language
  const isWBJEE = examType === 'WBJEE';
  const targetLanguage = isWBJEE ? 'bn' : undefined; // 'bn' is the language code for Bengali

  return (
    <Card className={cn(
      "transition-colors",
      showResult && userAnswer ? (
        isCorrectAnswer(userAnswer, question.correctAnswer) ? "border-green-500" : "border-red-500"
      ) : ""
    )}>
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <span className="text-sm text-muted-foreground font-normal">Question {questionNumber}</span>
          <div className="flex items-center gap-2">
            <LanguageSelector 
              onLanguageSelect={handleLanguageSelect}
              currentLanguage={currentLanguage}
            />
            <span className="text-xs text-muted-foreground">
              {question.marks} marks {question.negative_marks > 0 && `(-${question.negative_marks} negative)`}
            </span>
          </div>
        </CardTitle>
        <CardDescription className="space-y-4">
          {question.is_image_question ? (
            <div className="mt-4">
              {imageLoading && (
                <div className="flex justify-center items-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              )}
              
              {imageError ? (
                <div className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-lg p-4">
                  <Image className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Image could not be loaded</p>
                </div>
              ) : (
                <img 
                  src={question.image_url}
                  alt="Question" 
                  className={cn(
                    "max-w-full h-auto rounded-lg border border-border mx-auto",
                    imageLoading ? "hidden" : "block"
                  )}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              )}
            </div>
          ) : (
            <p className="font-bold text-foreground text-base">{renderWithLatex(translatedQuestion)}</p>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {question.is_multi_correct ? (
          <div className="space-y-2">
            {question.options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`question-${question.id}-option-${option.id}`}
                  checked={userAnswer ? userAnswer.split(',').includes(option.id) : false}
                  onCheckedChange={(checked) => {
                    let updatedAnswers: string[];
                    if (userAnswer) {
                      updatedAnswers = userAnswer.split(',');
                    } else {
                      updatedAnswers = [];
                    }
        
                    if (checked) {
                      updatedAnswers.push(option.id);
                    } else {
                      updatedAnswers = updatedAnswers.filter((ans) => ans !== option.id);
                    }
        
                    handleAnswerChange(updatedAnswers.sort().join(','));
                  }}
                />
                <Label
                  htmlFor={`question-${question.id}-option-${option.id}`}
                  className="cursor-pointer"
                >
                  {renderWithLatex(translatedOptions[option.id] || option.text)}
                </Label>
              </div>
            ))}
          </div>
        ) : (
          <RadioGroup value={selectedAnswer} onValueChange={handleAnswerChange}>
            <div className="grid gap-2">
              {question.options.map((option) => (
                <div 
                  key={option.id} 
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={() => handleAnswerChange(option.id)}
                >
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id} className="cursor-pointer">
                    {renderWithLatex(translatedOptions[option.id] || option.text)}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        )}
      </CardContent>
      {showResult && (
        <CardFooter className="justify-between">
          {skipped ? (
            <span className="text-sm text-orange-500">Skipped</span>
          ) : isCorrectAnswer(userAnswer || '', question.correctAnswer) ? (
            <span className="text-sm text-green-500">Correct Answer</span>
          ) : (
            <span className="text-sm text-red-500">Incorrect Answer</span>
          )}
          {showResult && (
            <span className="text-sm text-muted-foreground">
              Correct Answer: {Array.isArray(question.correctAnswer) ? question.correctAnswer.join(', ') : question.correctAnswer}
            </span>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default QuestionCard;
