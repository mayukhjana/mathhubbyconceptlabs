
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ResourcesPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Resources</h1>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Initial placeholder content */}
          <div className="p-6 rounded-lg border bg-card">
            <h2 className="text-2xl font-semibold mb-4">Study Materials</h2>
            <p className="text-muted-foreground">
              Access our comprehensive collection of study materials and guides.
            </p>
          </div>
          <div className="p-6 rounded-lg border bg-card">
            <h2 className="text-2xl font-semibold mb-4">Practice Sets</h2>
            <p className="text-muted-foreground">
              Enhance your preparation with our curated practice sets.
            </p>
          </div>
          <div className="p-6 rounded-lg border bg-card">
            <h2 className="text-2xl font-semibold mb-4">Video Tutorials</h2>
            <p className="text-muted-foreground">
              Watch detailed video explanations of complex topics.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResourcesPage;
