
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

interface ExamDetailsFormProps {
  examTitle: string;
  selectedClass: string;
  selectedChapter: string;
  selectedYear: string;
  examDuration: number;
  isPremium: boolean;
  allowPaperDownload: boolean;
  allowSolutionDownload: boolean;
  onExamTitleChange: (value: string) => void;
  onClassChange: (value: string) => void;
  onChapterChange: (value: string) => void;
  onYearChange: (value: string) => void;
  onDurationChange: (value: number) => void;
  onPremiumChange: (value: boolean) => void;
  onPaperDownloadChange: (value: boolean) => void;
  onSolutionDownloadChange: (value: boolean) => void;
}

const ExamDetailsForm = ({
  examTitle,
  selectedClass,
  selectedChapter,
  selectedYear,
  examDuration,
  isPremium,
  allowPaperDownload,
  allowSolutionDownload,
  onExamTitleChange,
  onClassChange,
  onChapterChange,
  onYearChange,
  onDurationChange,
  onPremiumChange,
  onPaperDownloadChange,
  onSolutionDownloadChange,
}: ExamDetailsFormProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="exam-title">Exam Title</Label>
        <Input
          id="exam-title"
          value={examTitle}
          onChange={(e) => onExamTitleChange(e.target.value)}
          placeholder="Enter exam title"
        />
      </div>

      <div>
        <Label htmlFor="class">Class</Label>
        <select
          id="class"
          value={selectedClass}
          onChange={(e) => onClassChange(e.target.value)}
          className="w-full border rounded-md p-2"
        >
          <option value="11-12">11-12</option>
          <option value="9-10">9-10</option>
          <option value="6-8">6-8</option>
        </select>
      </div>

      <div>
        <Label htmlFor="chapter">Chapter</Label>
        <select
          id="chapter"
          value={selectedChapter}
          onChange={(e) => onChapterChange(e.target.value)}
          className="w-full border rounded-md p-2"
        >
          <option value="none">Full Mock Test</option>
          <option value="algebra">Algebra</option>
          <option value="geometry">Geometry</option>
          <option value="calculus">Calculus</option>
        </select>
      </div>

      <div>
        <Label htmlFor="year">Year</Label>
        <Input
          id="year"
          type="number"
          value={selectedYear}
          onChange={(e) => onYearChange(e.target.value)}
          min="2000"
          max="2100"
        />
      </div>

      <div>
        <Label htmlFor="duration">Duration (minutes)</Label>
        <Input
          id="duration"
          type="number"
          value={examDuration}
          onChange={(e) => onDurationChange(Number(e.target.value))}
          min="1"
        />
      </div>

      <Separator className="my-4" />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="premium">Premium Content</Label>
            <div className="text-sm text-muted-foreground">
              Mark this exam as premium content
            </div>
          </div>
          <Switch
            id="premium"
            checked={isPremium}
            onCheckedChange={onPremiumChange}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="allow-paper">Allow Paper Download</Label>
            <div className="text-sm text-muted-foreground">
              Let users download the question paper
            </div>
          </div>
          <Switch
            id="allow-paper"
            checked={allowPaperDownload}
            onCheckedChange={onPaperDownloadChange}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="allow-solution">Allow Solution Download</Label>
            <div className="text-sm text-muted-foreground">
              Let users download the solution paper
            </div>
          </div>
          <Switch
            id="allow-solution"
            checked={allowSolutionDownload}
            onCheckedChange={onSolutionDownloadChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ExamDetailsForm;
