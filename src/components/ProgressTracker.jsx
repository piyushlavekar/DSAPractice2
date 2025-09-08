
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

const ProgressTracker = () => {
  const { topics, selectedTopic, solvedQuestions } = useSelector((state) => state.questions);

  const overallProgress = useMemo(() => {
    let totalQuestions = 0, totalSolved = 0;
    topics.forEach(t => t.patterns.forEach(p => Object.values(p.questions).forEach(qList => {
      totalQuestions += qList.length;
      qList.forEach(q => { if (solvedQuestions[q.name]) totalSolved++; });
    })));
    const percentage = totalQuestions > 0 ? Math.round((totalSolved / totalQuestions) * 100) : 0;
    return { totalQuestions, totalSolved, percentage };
  }, [topics, solvedQuestions]);

  const topicProgress = useMemo(() => {
    if (!selectedTopic) return null;
    const topic = topics.find(t => t.name === selectedTopic);
    if (!topic) return null;
    let totalQuestions = 0, solvedCount = 0;
    topic.patterns.forEach(p => Object.values(p.questions).forEach(qList => {
      totalQuestions += qList.length;
      qList.forEach(q => { if (solvedQuestions[q.name]) solvedCount++; });
    }));
    const percentage = totalQuestions > 0 ? Math.round((solvedCount / totalQuestions) * 100) : 0;
    return { totalQuestions, solvedCount, percentage, name: topic.name };
  }, [selectedTopic, topics, solvedQuestions]);

  return (
   <div className="p-4 md:p-8 flex flex-col gap-6">
      <div className="p-4 md:p-6 rounded-xl shadow-2xl bg-gradient-to-br from-gray-900 via-black to-black text-white border border-gray-700">
        <div className="flex justify-between items-center mb-2">
          {/* --- RESPONSIVE CHANGE: Text is smaller on mobile, larger on desktop --- */}
          <h3 className="text-base md:text-xl font-bold tracking-wide text-gray-200">OVERALL PROGRESS</h3>
          <span className="text-sm md:text-lg font-semibold bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full">
            {overallProgress.percentage}%
          </span>
        </div>
        <p className="text-xs md:text-sm text-gray-400 mb-4">{overallProgress.totalSolved} of {overallProgress.totalQuestions} questions solved</p>
        <div className="w-full bg-gray-700 rounded-full h-2 md:h-3 overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 md:h-3 rounded-full" style={{ width: `${overallProgress.percentage}%` }}></div>
        </div>
      </div>

      {topicProgress && (
        <div className="p-4 md:p-6 rounded-xl shadow-lg bg-gray-800 border border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-base md:text-xl font-bold text-gray-200">{topicProgress.name.toUpperCase()} PROGRESS</h3>
            <span className="text-sm md:text-lg font-semibold text-cyan-400">
              {topicProgress.percentage}%
            </span>
          </div>
          <p className="text-xs md:text-sm text-gray-400 mb-4">{topicProgress.solvedCount} of {topicProgress.totalQuestions} questions solved</p>
          <div className="w-full bg-gray-700 rounded-full h-2 md:h-3 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-400 to-cyan-500 h-2 md:h-3 rounded-full" style={{ width: `${topicProgress.percentage}%` }}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;