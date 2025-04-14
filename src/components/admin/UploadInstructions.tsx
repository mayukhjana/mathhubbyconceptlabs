
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UploadInstructionsProps {
  type: "pdf" | "mcq";
}

const UploadInstructions = ({ type }: UploadInstructionsProps) => {
  const instructions = type === "pdf" ? [
    "Upload files in PDF format only",
    "Maximum file size: 10MB",
    "Files will be stored in board-specific buckets (wbjee_papers, wbjee_solutions, etc.)",
    "File naming is handled automatically according to pattern: board_paper_examId.pdf",
    "For board exams, select a chapter or leave empty for full mock test",
    "For entrance exams, select the appropriate entrance exam board",
    "Upload solutions to help students learn from their mistakes",
    "For premium papers, students will need a subscription to access",
    "Files are stored securely and will be available immediately after upload"
  ] : [
    "Keep questions clear and concise",
    "Make sure there is only one correct answer",
    "Avoid using \"All of the above\" or \"None of the above\"",
    "Make distractors plausible",
    "Use consistent grammar across all options",
    "Aim for 20-25 questions per exam for an hour",
    "For WBJEE papers, focus on mathematics concepts and problem-solving"
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {type === "pdf" ? "Upload Instructions" : "Creating Good MCQs"}
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
