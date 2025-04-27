
import React, { useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ImagePlus, Send, Loader2, TrashIcon, Sparkles } from "lucide-react";

interface ChatInputFormProps {
  question: string;
  setQuestion: (question: string) => void;
  imagePreview: string | null;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  clearHistory: () => void;
  isLoading: boolean;
  hasMessages: boolean;
  isPremium: boolean;
  remainingQuestions: number;
}

const ChatInputForm: React.FC<ChatInputFormProps> = ({
  question,
  setQuestion,
  imagePreview,
  handleImageUpload,
  removeImage,
  handleSubmit,
  clearHistory,
  isLoading,
  hasMessages,
  isPremium,
  remainingQuestions,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {imagePreview && (
        <div className="relative border rounded-md p-2 inline-block">
          <img 
            src={imagePreview} 
            alt="Preview" 
            className="max-h-[150px] rounded-md"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
            onClick={removeImage}
          >
            <TrashIcon className="h-3 w-3" />
          </Button>
        </div>
      )}

      <div className="flex flex-col space-y-2">
        <Textarea 
          placeholder="Enter your math question here..." 
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="min-h-[100px]"
          disabled={isLoading}
        />

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              Upload Image
            </Button>

            {hasMessages && (
              <Button 
                type="button" 
                variant="ghost" 
                onClick={clearHistory}
                disabled={isLoading}
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Clear History
              </Button>
            )}
          </div>

          <Button 
            type="submit" 
            className="bg-mathprimary hover:bg-mathprimary/90" 
            disabled={(!question.trim() && !imagePreview) || isLoading || (!isPremium && remainingQuestions <= 0)}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Ask Question
              </>
            )}
          </Button>
        </div>
      </div>

      <Alert>
        <Sparkles className="h-4 w-4" />
        <AlertTitle>Tips for best results</AlertTitle>
        <AlertDescription>
          Be specific with your math questions. You can ask about algebra, calculus, geometry, or upload an image of a math problem.
        </AlertDescription>
      </Alert>
    </form>
  );
};

export default ChatInputForm;
