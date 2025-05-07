
import { useState } from "react";
import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface GoogleTranslateButtonProps {
  text: string;
}

const GoogleTranslateButton = ({ text }: GoogleTranslateButtonProps) => {
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = () => {
    setIsTranslating(true);
    
    // Encode the text to be translated
    const encodedText = encodeURIComponent(text);
    
    // Open Google Translate in a new tab
    const translateUrl = `https://translate.google.com/?sl=auto&tl=auto&text=${encodedText}&op=translate`;
    window.open(translateUrl, '_blank');
    
    // Reset button state after a short delay
    setTimeout(() => setIsTranslating(false), 500);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-7 w-7 p-0 rounded-full"
          onClick={handleTranslate}
          disabled={isTranslating}
        >
          <Languages className="h-4 w-4" />
          <span className="sr-only">Translate</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Translate with Google</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default GoogleTranslateButton;
