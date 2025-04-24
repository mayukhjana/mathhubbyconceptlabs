
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from './pages/Index';
import BoardsPage from './pages/BoardsPage';
import BoardDetail from './pages/BoardDetail';
import ExamPage from './pages/ExamPage';
import ExamsList from './pages/ExamsList';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import NotFound from './pages/NotFound';
import ResourcesPage from './pages/ResourcesPage';
import PremiumPage from './pages/PremiumPage';
import PremiumSuccessPage from './pages/PremiumSuccessPage';
import ResultsPage from './pages/ResultsPage';
import StudyMaterialsPage from './pages/StudyMaterialsPage';
import VideoTutorialsPage from './pages/VideoTutorialsPage';
import AdminUploadPage from './pages/AdminUploadPage';
import AdminExamUploadPage from './pages/AdminExamUploadPage';
import AdminQuestionUploadPage from './pages/AdminQuestionUploadPage';
import ExamPapersPage from './pages/ExamPapersPage';
import PracticeSetsPage from './pages/PracticeSetsPage';
import MathHubAIPage from './pages/MathHubAIPage';
import SupportPage from './pages/SupportPage';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RefundPolicy from './pages/RefundPolicy';
import TutorHomePage from './pages/TutorHomePage';
import BecomeTutorPage from './pages/BecomeTutorPage';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './components/ThemeProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthGuard } from './components/AuthGuard';
import { Toaster } from './components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import './App.css';
import AuthWrapper from './components/AuthWrapper';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="mathhub-theme">
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/boards" element={<BoardsPage />} />
              <Route path="/boards/:board" element={<BoardDetail />} />
              <Route path="/exam/:examId" element={<ExamPage />} />
              <Route path="/exams" element={<ExamsList />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/premium" element={<PremiumPage />} />
              <Route path="/premium-success" element={<PremiumSuccessPage />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/study-materials" element={<StudyMaterialsPage />} />
              <Route path="/video-tutorials" element={<VideoTutorialsPage />} />
              <Route path="/exam-papers" element={<ExamPapersPage />} />
              <Route path="/practice-sets" element={<PracticeSetsPage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/terms" element={<TermsAndConditions />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/refund" element={<RefundPolicy />} />
              <Route path="*" element={<NotFound />} />

              {/* Protected routes */}
              <Route element={<AuthGuard />}>
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/results" element={<ResultsPage />} />
                <Route path="/mathhub-ai" element={<MathHubAIPage />} />
                <Route path="/become-tutor" element={<BecomeTutorPage />} />
                <Route path="/tutor" element={<TutorHomePage />} />
              </Route>

              {/* Admin routes */}
              <Route element={<AuthWrapper children={undefined} requireAuth={true} tooltipText="Admin access required" />}>
                <Route path="/admin" element={<AdminUploadPage />} />
                <Route path="/admin/exam" element={<AdminExamUploadPage />} />
                <Route path="/admin/question" element={<AdminQuestionUploadPage />} />
              </Route>
            </Routes>
            <SonnerToaster position="top-right" expand={true} richColors />
            <Toaster />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
