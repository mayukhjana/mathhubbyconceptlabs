
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ExamSection from "@/components/admin/ExamSection";
import { ENTRANCE_OPTIONS, BOARD_OPTIONS, Exam } from "@/services/exam/types";

interface ExamTabsProps {
  entranceExams: Exam[];
  boardExamsList: Exam[];
  lastRefreshTime: number;
  onDeleteExam: (examId: string, examTitle: string) => Promise<void>;
  onDeleteComplete: () => void;
  onDeleteBoard: (board: string) => Promise<any>;
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
              lastRefreshTime={lastRefreshTime}
              onDeleteExam={onDeleteExam}
              onDeleteComplete={onDeleteComplete}
              onDeleteAll={() => onDeleteBoard(board)}
              showDeleteAll={true}
            />
          );
        })}
      </TabsContent>

      <TabsContent value="board" className="space-y-6">
        {BOARD_OPTIONS.map(board => {
          const filteredBoardExams = boardExamsList.filter(exam => exam.board === board);

          // Group exams by chapter
          const examsByChapter: Record<string, Exam[]> = {};
          
          // Add "Full Mock Tests" category
          examsByChapter["Full Mock Tests"] = filteredBoardExams.filter(
            exam => !exam.chapter || exam.chapter === ""
          );
          
          // Group by chapters
          filteredBoardExams.forEach(exam => {
            if (exam.chapter) {
              if (!examsByChapter[exam.chapter]) {
                examsByChapter[exam.chapter] = [];
              }
              examsByChapter[exam.chapter].push(exam);
            }
          });
          
          return (
            <div key={`${board}-${lastRefreshTime}`} className="space-y-4">
              <h3 className="text-lg font-semibold">{board}</h3>
              
              {/* Full Mock Tests */}
              {examsByChapter["Full Mock Tests"].length > 0 && (
                <ExamSection
                  title="Full Mock Tests"
                  exams={examsByChapter["Full Mock Tests"]}
                  lastRefreshTime={lastRefreshTime}
                  onDeleteExam={onDeleteExam}
                  onDeleteComplete={onDeleteComplete}
                />
              )}
              
              {/* Chapter-wise exams */}
              {Object.entries(examsByChapter)
                .filter(([chapter]) => chapter !== "Full Mock Tests")
                .map(([chapter, exams]) => (
                  <ExamSection
                    key={`${board}-${chapter}-${lastRefreshTime}`}
                    title={`${chapter.charAt(0).toUpperCase() + chapter.slice(1)}`}
                    exams={exams}
                    lastRefreshTime={lastRefreshTime}
                    onDeleteExam={onDeleteExam}
                    onDeleteComplete={onDeleteComplete}
                  />
                ))}
            </div>
          );
        })}
      </TabsContent>
    </Tabs>
  );
};

export default ExamTabs;
