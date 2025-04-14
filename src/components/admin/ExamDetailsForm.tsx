
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

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
  const classes = ["10", "12"];
  const chapters = {
    "10": ["algebra", "geometry", "statistics", "trigonometry", "calculus"],
    "12": ["algebra", "calculus", "statistics", "vectors", "matrices", "probability"]
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
          <Select value={selectedClass} onValueChange={onClassChange}>
            <SelectTrigger id="mcq-class">
              <SelectValue placeholder="Select Class" />
            </SelectTrigger>
            <SelectContent>
              {classes.map(cls => (
                <SelectItem key={cls} value={cls}>
                  Class {cls}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="mcq-chapter">Chapter (Optional)</Label>
          <Select value={selectedChapter} onValueChange={onChapterChange} disabled={!selectedClass}>
            <SelectTrigger id="mcq-chapter">
              <SelectValue placeholder="Select Chapter" />
            </SelectTrigger>
            <SelectContent>
              {selectedClass && (
                chapters[selectedClass as "10" | "12"].map(chapter => (
                  <SelectItem key={chapter} value={chapter}>
                    {chapter.charAt(0).toUpperCase() + chapter.slice(1)}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
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
    </div>
  );
};

export default ExamDetailsForm;
