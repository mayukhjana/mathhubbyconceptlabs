
import { Link } from "react-router-dom";
import { Book, Target, Video } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const ResourcesPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Learning Resources</h1>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Link to="/resources/study-materials" className="no-underline">
            <Card className="h-full transform transition-all hover:scale-105 hover:shadow-xl">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Book className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Study Materials</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Access our comprehensive collection of study materials and guides.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/resources/practice-sets" className="no-underline">
            <Card className="h-full transform transition-all hover:scale-105 hover:shadow-xl">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Practice Sets</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Enhance your preparation with our curated practice sets.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/resources/video-tutorials" className="no-underline">
            <Card className="h-full transform transition-all hover:scale-105 hover:shadow-xl">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Video className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Video Tutorials</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Watch detailed video explanations of complex topics.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResourcesPage;
