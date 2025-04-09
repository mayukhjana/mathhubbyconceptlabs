
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthGuard } from "@/components/AuthGuard";
import Index from "./pages/Index";
import BoardsPage from "./pages/BoardsPage";
import BoardDetail from "./pages/BoardDetail";
import ExamsList from "./pages/ExamsList";
import ExamPage from "./pages/ExamPage";
import ExamPapersPage from "./pages/ExamPapersPage";
import PremiumPage from "./pages/PremiumPage";
import PremiumSuccessPage from "./pages/PremiumSuccessPage";
import ProfilePage from "./pages/ProfilePage";
import UserResultsPage from "./pages/UserResultsPage";
import AdminUploadPage from "./pages/AdminUploadPage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/boards" element={<BoardsPage />} />
            <Route path="/boards/:boardId/*" element={<BoardDetail />} />
            <Route path="/exams" element={<ExamsList />} />
            <Route path="/exams/:examId" element={<ExamPage />} />
            <Route path="/exam-papers" element={<ExamPapersPage />} />
            <Route path="/premium" element={
              <AuthGuard>
                <PremiumPage />
              </AuthGuard>
            } />
            <Route path="/premium-success" element={
              <AuthGuard>
                <PremiumSuccessPage />
              </AuthGuard>
            } />
            <Route path="/profile" element={
              <AuthGuard>
                <ProfilePage />
              </AuthGuard>
            } />
            <Route path="/results" element={
              <AuthGuard>
                <UserResultsPage />
              </AuthGuard>
            } />
            <Route path="/admin/upload" element={
              <AuthGuard>
                <AdminUploadPage />
              </AuthGuard>
            } />
            <Route path="/auth" element={<AuthPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
