
const SubjectProgress = () => {
  const subjects = [
    { name: "Algebra", progress: 86, color: "bg-green-500" },
    { name: "Calculus", progress: 72, color: "bg-mathprimary dark:bg-blue-500" },
    { name: "Geometry", progress: 54, color: "bg-yellow-500" }
  ];

  return (
    <div className="space-y-3 mb-6">
      {subjects.map((subject) => (
        <div key={subject.name}>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500 dark:text-gray-400">{subject.name}</span>
            <span className="font-medium text-mathdark dark:text-white">{subject.progress}%</span>
          </div>
          <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className={`h-full ${subject.color} rounded-full`} style={{
              width: `${subject.progress}%`
            }}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubjectProgress;
