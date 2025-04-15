
import { Database, BookOpen, Trophy, Zap, BarChart, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SubjectProgress from "@/components/SubjectProgress";

const DashboardPreview = () => {
  return (
    <>
      {/* Main dashboard card */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 transform perspective-1000 rotate-y-1 rotate-x-1">
        <div className="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-850 rounded-t-2xl p-3 flex items-center gap-2 border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="text-xs bg-white/90 dark:bg-black/30 text-gray-500 dark:text-gray-400 rounded-md px-2 py-0.5 flex-grow text-center font-mono">mathhub.io/dashboard</div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg text-mathdark dark:text-white">Your Learning Dashboard</h3>
            <div className="flex items-center gap-1 text-xs bg-mathprimary/10 dark:bg-blue-900/30 text-mathprimary dark:text-blue-400 px-2 py-1 rounded-full">
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
              <span className="text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">75% Complete</span>
            </div>
            <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-mathprimary to-mathsecondary dark:from-blue-500 dark:to-purple-500 rounded-full" style={{
                width: "75%"
              }}></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 flex flex-col items-center text-center border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
              <Database className="h-8 w-8 text-mathprimary dark:text-blue-400 mb-2" />
              <span className="font-bold text-lg text-mathdark dark:text-white">5,000+</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Practice Papers</span>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 flex flex-col items-center text-center border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
              <BookOpen className="h-8 w-8 text-mathprimary dark:text-blue-400 mb-2" />
              <span className="font-bold text-lg text-mathdark dark:text-white">150+</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Math Chapters</span>
            </div>
          </div>
          
          <SubjectProgress />
          
          <Button className="w-full bg-gradient-to-r from-mathprimary to-mathsecondary hover:from-mathprimary/90 hover:to-mathsecondary/90 dark:from-blue-600 dark:to-purple-600 dark:hover:from-blue-700 dark:hover:to-purple-700 shadow-sm" asChild>
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
