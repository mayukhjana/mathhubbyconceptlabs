import { Database, BookOpen, Trophy, Zap, BarChart, Clock, File, Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SubjectProgress from "@/components/SubjectProgress";

const DashboardPreview = () => {
  return (
    <>
      {/* Main dashboard card */}
      <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 transform perspective-1000 rotate-y-1 rotate-x-1">
        <div className="bg-gradient-to-r from-gray-100/80 to-gray-50/80 dark:from-gray-900/80 dark:to-gray-850/80 backdrop-blur-sm rounded-t-2xl p-3 flex items-center gap-2 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 bg-red-500/90 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500/90 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500/90 rounded-full"></div>
          </div>
          <div className="text-xs bg-white/60 dark:bg-black/30 text-gray-500 dark:text-gray-400 rounded-md px-2 py-0.5 flex-grow text-center font-mono backdrop-blur-sm">mathhub.io/dashboard</div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg text-mathdark dark:text-white">Your Learning Dashboard</h3>
            <div className="flex items-center gap-1 text-xs bg-gradient-to-r from-mathprimary/10 to-blue-500/10 dark:from-blue-900/30 dark:to-purple-900/30 text-mathprimary dark:text-blue-400 px-3 py-1.5 rounded-full backdrop-blur-sm">
              <Clock size={12} />
              <span>Last updated: Today</span>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-mathdark dark:text-white flex items-center gap-1">
                <BarChart size={16} className="text-mathprimary dark:text-blue-400" />
                <span>Progress Overview</span>
              </h3>
              <span className="text-sm bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full font-medium backdrop-blur-sm">75% Complete</span>
            </div>
            <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-mathprimary via-blue-500 to-mathsecondary dark:from-blue-500 dark:via-blue-400 dark:to-purple-500 rounded-full transition-all duration-1000" style={{
                width: "75%"
              }}></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-gray-50/80 to-white/50 dark:from-gray-900/80 dark:to-gray-800/50 rounded-lg p-4 flex flex-col items-center text-center border border-gray-100/20 dark:border-gray-700/20 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
              <File className="h-8 w-8 text-transparent bg-clip-text bg-gradient-to-r from-mathprimary to-blue-500 dark:from-blue-400 dark:to-blue-300 mb-2" />
              <span className="font-bold text-lg bg-gradient-to-r from-mathdark to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">5,000+</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Practice Papers</span>
            </div>
            <div className="bg-gradient-to-br from-gray-50/80 to-white/50 dark:from-gray-900/80 dark:to-gray-800/50 rounded-lg p-4 flex flex-col items-center text-center border border-gray-100/20 dark:border-gray-700/20 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
              <Book className="h-8 w-8 text-transparent bg-clip-text bg-gradient-to-r from-mathprimary to-blue-500 dark:from-blue-400 dark:to-blue-300 mb-2" />
              <span className="font-bold text-lg bg-gradient-to-r from-mathdark to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">150+</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Math Chapters</span>
            </div>
          </div>
          
          <SubjectProgress />
          
          <Button className="w-full bg-gradient-to-r from-mathprimary via-blue-500 to-mathsecondary hover:from-mathprimary/90 hover:via-blue-500/90 hover:to-mathsecondary/90 dark:from-blue-600 dark:via-blue-500 dark:to-purple-600 dark:hover:from-blue-700 dark:hover:to-purple-700 shadow-lg shadow-mathprimary/20 dark:shadow-blue-900/20 transition-all duration-300" asChild>
            <Link to="/premium">Upgrade to Premium</Link>
          </Button>
        </div>
      </div>
      
      <div className="absolute -top-6 -right-4 md:-right-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-3 rounded-lg shadow-xl rotate-6 hidden sm:block border border-gray-100/20 dark:border-gray-700/20 hover:rotate-0 transition-all duration-300">
        <div className="flex items-center gap-2 text-mathdark dark:text-white">
          <Trophy size={16} className="text-yellow-500" />
          <span>Top 5% student!</span>
        </div>
      </div>
      
      <div className="absolute -bottom-4 -left-4 md:-left-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-3 rounded-lg shadow-xl -rotate-3 hidden sm:block border border-gray-100/20 dark:border-gray-700/20 hover:rotate-0 transition-all duration-300">
        <div className="flex items-center gap-2 text-mathdark dark:text-white">
          <Zap size={16} className="text-mathprimary dark:text-blue-400" />
          <span>Next quiz: Tomorrow</span>
        </div>
      </div>
    </>
  );
};

export default DashboardPreview;
