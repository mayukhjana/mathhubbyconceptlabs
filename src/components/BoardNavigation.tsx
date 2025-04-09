
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { FileText, BookOpen } from "lucide-react";

interface BoardNavigationProps {
  boardId: string;
  boardName: string;
}

const BoardNavigation = ({ boardId, boardName }: BoardNavigationProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold">Full Mock Test Papers</h3>
          <CardDescription>Practice with complete exam papers from previous years</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <FileText className="text-mathprimary" />
            <p>Complete timed papers from 2020 - 2025</p>
          </div>
          <Button asChild className="w-full">
            <Link to={`/boards/${boardId}/papers`}>View Papers</Link>
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold">Practice by Chapters</h3>
          <CardDescription>Focus on specific chapters and topics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="text-mathprimary" />
            <p>Chapter-wise questions and practice tests</p>
          </div>
          <Button asChild className="w-full">
            <Link to={`/boards/${boardId}/chapters`}>View Chapters</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BoardNavigation;
