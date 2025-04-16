
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ExamSection from "@/components/admin/ExamSection";
import { ENTRANCE_OPTIONS, BOARD_OPTIONS, Exam } from "@/services/exam/types";

interface ExamTabsProps {
  entranceExams: Exam[];
  boardExamsList: Exam[];
  lastRefreshTime: number;
  onDeleteExam: (examId: string, examTitle: string) => Promise<void>;
  onDeleteComplete: () => void;
  onDeleteBoard: (board: string) => Promise<any>; // Updated to accept any promise return
}

const ExamTabs = ({
  entranceExams,
  boardExamsList,
  lastRefreshTime,
  onDeleteExam,
  onDeleteComplete,
  onDeleteBoard
}: ExamTabsProps) => {
  return (
    <Tabs defaultValue="entrance" className="space-y-4">
      <TabsList>
        <TabsTrigger value="entrance">Entrance Exams</TabsTrigger>
        <TabsTrigger value="board">Board Exams</TabsTrigger>
      </TabsList>

      <TabsContent value="entrance" className="space-y-6">
        {ENTRANCE_OPTIONS.map(board => {
          const boardExams = entranceExams.filter(exam => exam.board === board);
          return (
            <ExamSection
              key={`${board}-${lastRefreshTime}`}
              title={board}
              exams={boardExams}
              lastRefreshTime={lastRefreshTime} // Pass lastRefreshTime prop
              onDeleteExam={onDeleteExam}
              onDeleteComplete={onDeleteComplete}
              onDeleteAll={board === 'WBJEE' ? () => onDeleteBoard(board) : undefined}
              showDeleteAll={board === 'WBJEE'}
            />
          );
        })}
      </TabsContent>

      <TabsContent value="board" className="space-y-6">
        {BOARD_OPTIONS.map(board => {
          const filteredBoardExams = boardExamsList.filter(exam => exam.board === board);
          return (
            <ExamSection
              key={`${board}-${lastRefreshTime}`}
              title={board}
              exams={filteredBoardExams}
              lastRefreshTime={lastRefreshTime} // Pass lastRefreshTime prop
              onDeleteExam={onDeleteExam}
              onDeleteComplete={onDeleteComplete}
            />
          );
        })}
      </TabsContent>
    </Tabs>
  );
};

export default ExamTabs;
