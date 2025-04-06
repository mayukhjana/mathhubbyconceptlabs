
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import BoardsPage from "./pages/BoardsPage";
import BoardDetail from "./pages/BoardDetail";
import ExamsList from "./pages/ExamsList";
import ExamPage from "./pages/ExamPage";
import ExamPapersPage from "./pages/ExamPapersPage";
import PremiumPage from "./pages/PremiumPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/boards" element={<BoardsPage />} />
          <Route path="/boards/:boardId" element={<BoardDetail />} />
          <Route path="/exams" element={<ExamsList />} />
          <Route path="/exams/:examId" element={<ExamPage />} />
          <Route path="/exam-papers" element={<ExamPapersPage />} />
          <Route path="/premium" element={<PremiumPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
