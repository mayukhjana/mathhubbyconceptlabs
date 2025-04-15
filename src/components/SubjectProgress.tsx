
const SubjectProgress = () => {
  const subjects = [
    { name: "Algebra", progress: 86, color: "bg-gradient-to-r from-green-400 to-green-500" },
    { name: "Calculus", progress: 72, color: "bg-gradient-to-r from-mathprimary to-blue-500 dark:from-blue-500 dark:to-blue-400" },
    { name: "Geometry", progress: 54, color: "bg-gradient-to-r from-yellow-400 to-yellow-500" }
  ];

  return (
    <div className="space-y-4 mb-6 bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
      <h4 className="font-medium text-mathdark dark:text-white mb-3">Subject Progress</h4>
      
      {subjects.map((subject) => (
        <div key={subject.name} className="group">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-400 group-hover:text-mathdark dark:group-hover:text-white transition-colors">{subject.name}</span>
            <span className="font-medium text-mathdark dark:text-white">{subject.progress}%</span>
          </div>
          <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className={`h-full ${subject.color} rounded-full transition-all duration-500 group-hover:shadow-sm`} style={{
              width: `${subject.progress}%`
            }}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubjectProgress;
