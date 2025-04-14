
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UploadInstructionsProps {
  type: "pdf" | "mcq" | "unified";
}

const UploadInstructions = ({ type }: UploadInstructionsProps) => {
  let instructions = [];
  
  if (type === "pdf") {
    instructions = [
      "Upload files in PDF format only",
      "Maximum file size: 10MB",
      "Files will be stored in board-specific buckets (wbjee_papers, wbjee_solutions, etc.)",
      "File naming is handled automatically according to pattern: board_paper_examId.pdf",
      "For board exams, select a chapter or leave empty for full mock test",
      "For entrance exams, select the appropriate entrance exam board",
      "Upload solutions to help students learn from their mistakes",
      "For premium papers, students will need a subscription to access",
      "Files are stored securely and will be available immediately after upload"
    ];
  } else if (type === "mcq") {
    instructions = [
      "Keep questions clear and concise",
      "Make sure there is only one correct answer",
      "Avoid using \"All of the above\" or \"None of the above\"",
      "Make distractors plausible",
      "Use consistent grammar across all options",
      "Aim for 20-25 questions per exam for an hour",
      "For WBJEE papers, focus on mathematics concepts and problem-solving"
    ];
  } else if (type === "unified") {
    instructions = [
      "This unified uploader creates a single exam with both PDF and MCQ components",
      "First upload the question paper PDF and solutions PDF (optional)",
      "Then add MCQ questions that will be associated with the same exam",
      "Students will be able to download PDFs or practice with MCQs from one place",
      "All components are linked to a single exam record in the database",
      "Upload files in PDF format only (max 10MB)",
      "Keep MCQs clear with exactly one correct answer per question",
      "For WBJEE papers, include both calculations and concept-based questions"
    ];
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {type === "pdf" ? "Upload Instructions" : 
           type === "mcq" ? "Creating Good MCQs" : 
           "Unified Exam Upload"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc pl-5 space-y-2 text-sm">
          {instructions.map((instruction, index) => (
            <li key={index}>{instruction}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default UploadInstructions;
