import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthGuard } from "@/components/AuthGuard";
import { ThemeProvider } from "@/components/ThemeProvider";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import BoardsPage from "./pages/BoardsPage";
import BoardDetail from "./pages/BoardDetail";
import ExamPage from "./pages/ExamPage";
import ExamPapersPage from "./pages/ExamPapersPage";
import ResultsPage from "./pages/ResultsPage";
import PremiumPage from "./pages/PremiumPage";
import PremiumSuccessPage from "./pages/PremiumSuccessPage";
import ProfilePage from "./pages/ProfilePage";
import SupportPage from "./pages/SupportPage";
import AdminUploadPage from "./pages/AdminUploadPage";
import AdminExamUploadPage from "./pages/AdminExamUploadPage";
import AdminQuestionUploadPage from "./pages/AdminQuestionUploadPage";
import AuthPage from "./pages/AuthPage";
import MathHubAIPage from "./pages/MathHubAIPage";
import ResourcesPage from "./pages/ResourcesPage";
import NotFound from "./pages/NotFound";
import RefundPolicy from "./pages/RefundPolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";

const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <HelmetProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/boards" element={<BoardsPage />} />
                  <Route path="/boards/:boardId/*" element={<BoardDetail />} />
                  <Route path="/exams/:examId" element={<ExamPage />} />
                  <Route path="/exam-papers" element={<ExamPapersPage />} />
                  <Route path="/resources" element={<ResourcesPage />} />
                  <Route path="/results" element={
                    <AuthGuard>
                      <ResultsPage />
                    </AuthGuard>
                  } />
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
                  <Route path="/support" element={
                    <AuthGuard>
                      <SupportPage />
                    </AuthGuard>
                  } />
                  <Route path="/mathhub-ai" element={
                    <AuthGuard>
                      <MathHubAIPage />
                    </AuthGuard>
                  } />
                  <Route path="/admin/upload" element={
                    <AuthGuard requireAdmin>
                      <AdminUploadPage />
                    </AuthGuard>
                  } />
                  <Route path="/admin/exam-upload" element={
                    <AuthGuard requireAdmin>
                      <AdminExamUploadPage />
                    </AuthGuard>
                  } />
                  <Route path="/admin/questions/:examId" element={
                    <AuthGuard requireAdmin>
                      <AdminQuestionUploadPage />
                    </AuthGuard>
                  } />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                  <Route path="/refund-policy" element={<RefundPolicy />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </AuthProvider>
        </HelmetProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
