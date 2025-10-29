
import { useState, useEffect } from "react";
import { SearchIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BoardCard from "@/components/BoardCard";
import { Input } from "@/components/ui/input";
import LoadingAnimation from "@/components/LoadingAnimation";
import { supabase } from "@/integrations/supabase/client";

const BoardsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [boards, setBoards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const { data, error } = await supabase
          .from('exams')
          .select('board')
          .eq('category', 'board');

        if (error) throw error;

        // Get unique boards and count papers for each
        const boardCounts = data.reduce((acc: any, exam: any) => {
          if (!acc[exam.board]) {
            acc[exam.board] = { count: 0, board: exam.board };
          }
          acc[exam.board].count++;
          return acc;
        }, {});

        const boardsData = Object.values(boardCounts).map((item: any) => ({
          id: item.board.toLowerCase().replace(/\s+/g, '-'),
          title: item.board,
          description: `Access previous year math papers for ${item.board}.`,
          image: "https://images.unsplash.com/photo-1613909207039-6b173b755cc1?q=80&w=2676&auto=format&fit=crop",
          paperCount: item.count
        }));

        setBoards(boardsData);
      } catch (error) {
        console.error('Error fetching boards:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoards();
  }, []);
  
  const filteredBoards = boards.filter(board => 
    board.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="min-h-screen flex flex-col">
      <LoadingAnimation />
      <Navbar />
      
      <main className="flex-grow">
        <div className="bg-gradient-to-b from-mathlight to-white dark:from-gray-800 dark:to-gray-900 py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-center mb-4 text-mathdark dark:text-white">Select Your Board</h1>
            <p className="text-center text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
              Choose your educational board to access previous year mathematics papers organized by chapters.
            </p>
            
            <div className="max-w-md mx-auto mb-12">
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
            
            {loading ? (
              <div className="text-center py-8">Loading boards...</div>
            ) : (
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
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BoardsPage;
