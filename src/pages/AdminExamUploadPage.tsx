
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoadingAnimation from "@/components/LoadingAnimation";
import ExamManagementHeader from "@/components/admin/ExamManagementHeader";
import ExamTabs from "@/components/admin/ExamTabs";
import { useExamManagement } from "@/hooks/useExamManagement";

const AdminExamUploadPage = () => {
  const {
    entranceExams,
    boardExamsList,
    loading,
    isRefreshing,
    lastRefreshTime,
    loadExams,
    handleDeleteBoard,
    handleDeleteExam
  } = useExamManagement();

  useEffect(() => {
    loadExams();
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadExams(false);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [loadExams]);

  const handleRefresh = () => {
    loadExams(true);
  };

  const handleDeleteComplete = () => {
    console.log("Delete operation completed, refreshing exam data...");
    loadExams(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <LoadingAnimation />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <ExamManagementHeader 
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
          />
          <ExamTabs
            entranceExams={entranceExams}
            boardExamsList={boardExamsList}
            lastRefreshTime={lastRefreshTime}
            onDeleteExam={handleDeleteExam}
            onDeleteComplete={handleDeleteComplete}
            onDeleteBoard={handleDeleteBoard}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminExamUploadPage;
