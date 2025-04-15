
import { Database, BookOpen, Trophy, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const DashboardPreview = () => {
  return (
    <>
      {/* Main dashboard card */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
        <div className="bg-gray-100 dark:bg-gray-900 rounded-t-2xl p-3 flex items-center gap-2 border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="text-xs bg-white/20 dark:bg-black/20 text-gray-500 dark:text-gray-400 rounded-md px-2 py-0.5 flex-grow text-center">mathhub.io/dashboard</div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-mathdark dark:text-white">Your Progress</h3>
              <span className="text-sm text-mathprimary dark:text-blue-400">75% Complete</span>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-mathprimary dark:bg-blue-500 rounded-full" style={{
              width: "75%"
            }}></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 flex flex-col items-center text-center">
              <Database className="h-8 w-8 text-mathprimary dark:text-blue-400 mb-2" />
              <span className="font-bold text-lg text-mathdark dark:text-white">5000+</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Practice Papers</span>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 flex flex-col items-center text-center">
              <BookOpen className="h-8 w-8 text-mathprimary dark:text-blue-400 mb-2" />
              <span className="font-bold text-lg text-mathdark dark:text-white">150+</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Math Chapters</span>
            </div>
          </div>
          
          <SubjectProgress />
          
          <Button className="w-full bg-mathprimary hover:bg-mathprimary/90 dark:bg-blue-600 dark:hover:bg-blue-700" asChild>
            <Link to="/premium">Upgrade to Premium</Link>
          </Button>
        </div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute -top-6 -right-4 md:-right-12 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg rotate-6 hidden sm:block border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2 text-mathdark dark:text-white">
          <Trophy size={16} className="text-yellow-500" />
          <span>Top 5% student!</span>
        </div>
      </div>
      
      <div className="absolute -bottom-4 -left-4 md:-left-12 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg -rotate-3 hidden sm:block border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2 text-mathdark dark:text-white">
          <Zap size={16} className="text-mathprimary dark:text-blue-400" />
          <span>Next quiz: Tomorrow</span>
        </div>
      </div>
    </>
  );
};

export default DashboardPreview;
