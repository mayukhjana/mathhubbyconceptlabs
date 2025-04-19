
import { BookOpen, Calculator, Ruler } from "lucide-react";

const SubjectProgress = () => {
  const subjects = [
    { 
      name: "Algebra", 
      progress: 92, 
      color: "from-green-400 to-emerald-500",
      icon: Calculator
    },
    { 
      name: "Calculus", 
      progress: 78, 
      color: "from-mathprimary to-blue-500 dark:from-blue-500 dark:to-blue-400",
      icon: BookOpen
    },
    { 
      name: "Geometry", 
      progress: 85, 
      color: "from-yellow-400 to-amber-500",
      icon: Ruler
    }
  ];

  return (
    <div className="space-y-4 mb-6 bg-gradient-to-br from-gray-50/80 to-white/50 dark:from-gray-900/80 dark:to-gray-800/50 p-4 rounded-xl border border-gray-100/20 dark:border-gray-700/20 backdrop-blur-sm">
      <h4 className="font-medium bg-gradient-to-r from-mathdark to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent mb-3">Subject Progress</h4>
      
      {subjects.map((subject) => (
        <div key={subject.name} className="group">
          <div className="flex justify-between text-sm mb-1">
            <div className="flex items-center gap-2">
              <subject.icon className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-mathdark dark:group-hover:text-white transition-colors" />
              <span className="text-gray-600 dark:text-gray-400 group-hover:text-mathdark dark:group-hover:text-white transition-colors">
                {subject.name}
              </span>
            </div>
            <span className="font-medium bg-gradient-to-r from-mathdark to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">{subject.progress}%</span>
          </div>
          <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${subject.color} rounded-full transition-all duration-500 group-hover:shadow-lg`} 
              style={{
                width: `${subject.progress}%`
              }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubjectProgress;
