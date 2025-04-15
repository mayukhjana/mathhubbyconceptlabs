import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { EXAM_TYPES, BOARD_OPTIONS, ENTRANCE_OPTIONS } from "@/services/exam/types";

interface ExamTypeSelectorProps {
  examType: string;
  selectedBoard: string;
  onExamTypeChange: (value: string) => void;
  onBoardChange: (value: string) => void;
}

const ExamTypeSelector = ({ 
  examType, 
  selectedBoard, 
  onExamTypeChange, 
  onBoardChange 
}: ExamTypeSelectorProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="exam-type">Exam Type</Label>
        <Select value={examType} onValueChange={onExamTypeChange}>
          <SelectTrigger id="exam-type">
            <SelectValue placeholder="Select Exam Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={EXAM_TYPES.BOARD}>Board Exam</SelectItem>
            <SelectItem value={EXAM_TYPES.ENTRANCE}>Entrance Exam</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="board">Board</Label>
        <Select value={selectedBoard} onValueChange={onBoardChange}>
          <SelectTrigger id="board">
            <SelectValue placeholder="Select Board" />
          </SelectTrigger>
          <SelectContent>
            {examType === EXAM_TYPES.ENTRANCE ? 
              ENTRANCE_OPTIONS.map(board => (
                <SelectItem key={board} value={board}>
                  {board}
                </SelectItem>
              )) :
              BOARD_OPTIONS.map(board => (
                <SelectItem key={board} value={board}>
                  {board}
                </SelectItem>
              ))
            }
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ExamTypeSelector;
