import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthGuard } from "@/components/AuthGuard";
import { ThemeProvider } from "@/components/ThemeProvider";
import { HelmetProvider } from "react-helmet-async";
import LoadingAnimation from "@/components/LoadingAnimation";

// Eager load only the landing page for fast initial render
import Index from "./pages/Index";

// Lazy load all other routes to reduce initial bundle size
const BoardsPage = lazy(() => import("./pages/BoardsPage"));
const BoardDetail = lazy(() => import("./pages/BoardDetail"));
const ExamPage = lazy(() => import("./pages/ExamPage"));
const ExamPapersPage = lazy(() => import("./pages/ExamPapersPage"));
const EntranceExamsPage = lazy(() => import("./pages/EntranceExamsPage"));
const ResultsPage = lazy(() => import("./pages/ResultsPage"));
const PremiumPage = lazy(() => import("./pages/PremiumPage"));
const PremiumSuccessPage = lazy(() => import("./pages/PremiumSuccessPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const SupportPage = lazy(() => import("./pages/SupportPage"));
const AdminUploadPage = lazy(() => import("./pages/AdminUploadPage"));
const AdminExamUploadPage = lazy(() => import("./pages/AdminExamUploadPage"));
const AdminQuestionUploadPage = lazy(() => import("./pages/AdminQuestionUploadPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const MathHubAIPage = lazy(() => import("./pages/MathHubAIPage"));
const ResourcesPage = lazy(() => import("./pages/ResourcesPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions"));
const StudyMaterialsPage = lazy(() => import("./pages/StudyMaterialsPage"));
const PracticeSetsPage = lazy(() => import("./pages/PracticeSetsPage"));
const VideoTutorialsPage = lazy(() => import("./pages/VideoTutorialsPage"));
const MentorshipsPage = lazy(() => import("./pages/MentorshipsPage"));
const MentorApplicationPage = lazy(() => import("./pages/MentorApplicationPage"));
const MentorProfilePage = lazy(() => import("./pages/MentorProfilePage"));
const MentorDashboardPage = lazy(() => import("./pages/MentorDashboardPage"));
const AdminMentorVerificationPage = lazy(() => import("./pages/AdminMentorVerificationPage"));

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
                <Suspense fallback={<LoadingAnimation />}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/boards" element={<BoardsPage />} />
                    <Route path="/boards/:boardId/*" element={<BoardDetail />} />
                    <Route path="/entrance-exams" element={<EntranceExamsPage />} />
                    <Route path="/exams/:examId" element={<ExamPage />} />
                    <Route path="/exam-papers" element={<ExamPapersPage />} />
                    <Route path="/resources" element={<ResourcesPage />} />
                    <Route path="/resources/study-materials" element={<StudyMaterialsPage />} />
                    <Route path="/resources/practice-sets" element={<PracticeSetsPage />} />
                    <Route path="/resources/video-tutorials" element={<VideoTutorialsPage />} />
                    <Route path="/mentorships" element={<MentorshipsPage />} />
                    <Route path="/mentor/:id" element={<MentorProfilePage />} />
                    <Route path="/mentor-application" element={
                      <AuthGuard>
                        <MentorApplicationPage />
                      </AuthGuard>
                    } />
                    <Route path="/mentor-dashboard" element={
                      <AuthGuard>
                        <MentorDashboardPage />
                      </AuthGuard>
                    } />
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
                    <Route path="/admin/mentor-verification" element={
                      <AuthGuard requireAdmin>
                        <AdminMentorVerificationPage />
                      </AuthGuard>
                    } />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                    <Route path="/refund-policy" element={<RefundPolicy />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </TooltipProvider>
          </AuthProvider>
        </HelmetProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
