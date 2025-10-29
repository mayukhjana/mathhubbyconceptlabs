
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { InstructionsPdfUpload } from "./InstructionsPdfUpload";

interface ExamDetailsFormProps {
  examTitle: string;
  selectedClass: string;
  selectedChapter: string;
  selectedYear: string;
  examDuration: number;
  isPremium: boolean;
  onExamTitleChange: (value: string) => void;
  onClassChange: (value: string) => void;
  onChapterChange: (value: string) => void;
  onYearChange: (value: string) => void;
  onDurationChange: (value: number) => void;
  onPremiumChange: (value: boolean) => void;
}

const ExamDetailsForm = ({
  examTitle,
  selectedClass,
  selectedChapter,
  selectedYear,
  examDuration,
  isPremium,
  onExamTitleChange,
  onClassChange,
  onChapterChange,
  onYearChange,
  onDurationChange,
  onPremiumChange,
}: ExamDetailsFormProps) => {
  const [newChapter, setNewChapter] = useState("");
  const [isAddingChapter, setIsAddingChapter] = useState(false);
  
  // Define base chapters for each class
  const baseChapters: Record<string, string[]> = {
    "10": ["algebra", "geometry", "statistics", "trigonometry", "calculus"],
    "12": ["algebra", "calculus", "statistics", "vectors", "matrices", "probability"]
  };
  
  // Get chapters from localStorage if available, otherwise use base chapters
  const getChapters = (classLevel: string): string[] => {
    const savedChapters = localStorage.getItem(`chapters_${classLevel}`);
    if (savedChapters) {
      return JSON.parse(savedChapters);
    }
    return baseChapters[classLevel] || [];
  };
  
  // State to hold the current chapters list
  const [chapters, setChapters] = useState<Record<string, string[]>>({
    "10": getChapters("10"),
    "12": getChapters("12")
  });
  
  const handleAddChapter = () => {
    if (!newChapter.trim() || !selectedClass) return;
    
    // Format chapter name - lowercase first letter capitalized
    const formattedChapter = newChapter.trim().toLowerCase();
    
    // Check if chapter already exists
    if (chapters[selectedClass].includes(formattedChapter)) {
      setNewChapter("");
      setIsAddingChapter(false);
      return;
    }
    
    // Update chapters
    const updatedChapters = {
      ...chapters,
      [selectedClass]: [...chapters[selectedClass], formattedChapter]
    };
    
    setChapters(updatedChapters);
    
    // Save to localStorage
    localStorage.setItem(`chapters_${selectedClass}`, JSON.stringify(updatedChapters[selectedClass]));
    
    // Select the new chapter
    onChapterChange(formattedChapter);
    
    // Reset form
    setNewChapter("");
    setIsAddingChapter(false);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="exam-title">Exam Title</Label>
        <Input
          id="exam-title"
          value={examTitle}
          onChange={(e) => onExamTitleChange(e.target.value)}
          placeholder="E.g., WBJEE Mathematics 2024"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="mcq-class">Class</Label>
          <Select value={selectedClass} onValueChange={(value) => {
            onClassChange(value);
            onChapterChange("none"); // Reset chapter when class changes
          }}>
            <SelectTrigger id="mcq-class">
              <SelectValue placeholder="Select Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">Class 10</SelectItem>
              <SelectItem value="12">Class 12</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="mcq-chapter">Chapter</Label>
          <div className="flex gap-2">
            <Select 
              value={selectedChapter} 
              onValueChange={onChapterChange} 
              disabled={!selectedClass}
            >
              <SelectTrigger id="mcq-chapter" className="flex-1">
                <SelectValue placeholder="Select Chapter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Full Mock Test</SelectItem>
                <SelectGroup>
                  {selectedClass && chapters[selectedClass] ? (
                    chapters[selectedClass].map(chapter => (
                      <SelectItem key={chapter} value={chapter}>
                        {chapter.charAt(0).toUpperCase() + chapter.slice(1)}
                      </SelectItem>
                    ))
                  ) : null}
                </SelectGroup>
              </SelectContent>
            </Select>
            
            <Popover open={isAddingChapter} onOpenChange={setIsAddingChapter}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="shrink-0" 
                  disabled={!selectedClass}
                  onClick={() => setIsAddingChapter(true)}
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4" align="end">
                <div className="space-y-2">
                  <h4 className="font-medium">Add New Chapter</h4>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Enter chapter name" 
                      value={newChapter}
                      onChange={(e) => setNewChapter(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddChapter();
                        }
                      }}
                      className="flex-1"
                    />
                    <Button onClick={handleAddChapter}>Add</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {selectedChapter === "none" ? "Leave as 'Full Mock Test' for full mock test papers" : ""}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="mcq-year">Year</Label>
          <Input
            id="mcq-year"
            value={selectedYear}
            onChange={(e) => onYearChange(e.target.value)}
            placeholder="e.g., 2025"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="mcq-duration">Duration (minutes)</Label>
        <Input
          id="mcq-duration"
          type="number"
          min="5"
          value={examDuration}
          onChange={(e) => onDurationChange(Number(e.target.value))}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="premium"
          checked={isPremium}
          onCheckedChange={onPremiumChange}
        />
        <Label htmlFor="premium">Mark as Premium Content</Label>
      </div>

      <div className="space-y-2">
        <Label>Instructions PDF (Optional)</Label>
        <p className="text-sm text-muted-foreground">
          Instructions PDF can be uploaded after creating the exam
        </p>
      </div>
    </div>
  );
};

export default ExamDetailsForm;
