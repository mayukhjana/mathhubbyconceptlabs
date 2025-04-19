
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MathHubAI from "@/components/MathHubAI";
import { Toaster } from "@/components/ui/toaster";

const MathHubAIPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto">
        <MathHubAI />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
};

export default MathHubAIPage;
