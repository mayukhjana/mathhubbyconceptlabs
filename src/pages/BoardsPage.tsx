
import { useState } from "react";
import { SearchIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BoardCard from "@/components/BoardCard";
import { Input } from "@/components/ui/input";
import LoadingAnimation from "@/components/LoadingAnimation";

const boardsData = [
  {
    id: "icse",
    title: "ICSE Board",
    description: "Access previous year math papers for Indian Certificate of Secondary Education board.",
    image: "https://images.unsplash.com/photo-1613909207039-6b173b755cc1?q=80&w=2676&auto=format&fit=crop",
    paperCount: 120
  },
  {
    id: "cbse",
    title: "CBSE Board",
    description: "Access previous year math papers for Central Board of Secondary Education.",
    image: "https://images.unsplash.com/photo-1635372722656-389f87a941b7?q=80&w=2670&auto=format&fit=crop",
    paperCount: 150
  },
  {
    id: "west-bengal",
    title: "West Bengal Board",
    description: "Access previous year math papers for West Bengal Board of Secondary Education.",
    image: "https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=2672&auto=format&fit=crop",
    paperCount: 95
  }
];

const BoardsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredBoards = boardsData.filter(board => 
    board.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="min-h-screen flex flex-col">
      <LoadingAnimation />
      <Navbar />
      
      <main className="flex-grow">
        <div className="bg-gradient-to-b from-mathlight to-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-center mb-4">Select Your Board</h1>
            <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
              Choose your educational board to access previous year mathematics papers organized by chapters.
            </p>
            
            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="text"
                  placeholder="Search for a board..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBoards.map((board) => (
                <BoardCard
                  key={board.id}
                  id={board.id}
                  title={board.title}
                  description={board.description}
                  image={board.image}
                  paperCount={board.paperCount}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BoardsPage;
