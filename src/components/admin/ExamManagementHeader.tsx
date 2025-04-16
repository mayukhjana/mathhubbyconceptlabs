
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ExamManagementHeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

const ExamManagementHeader = ({ onRefresh, isRefreshing }: ExamManagementHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">Exam Management</h1>
      <div className="space-x-2">
        <Button 
          variant="outline" 
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </Button>
        <Button onClick={() => navigate("/admin/exam-upload/new")}>
          Add New Exam
        </Button>
      </div>
    </div>
  );
};

export default ExamManagementHeader;
