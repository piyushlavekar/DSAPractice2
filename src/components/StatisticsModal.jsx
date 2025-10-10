// // src/components/StatisticsModal.jsx

// import React, { useMemo } from 'react';
// import { useSelector } from 'react-redux';
// import { motion } from 'framer-motion';
// import { XMarkIcon } from '@heroicons/react/24/solid';

// // Chart.js आणि त्याच्या React wrapper मधून आवश्यक गोष्टी इम्पोर्ट करा
// import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
// import { Pie, Bar } from 'react-chartjs-2';

// // Chart.js ला आवश्यक असलेले मॉड्यूल्स रजिस्टर करा
// ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

// const StatisticsModal = ({ closeModal }) => {
//   const { topics, solvedQuestions } = useSelector(state => state.questions);

//   // --- टॉपिक-वाईज बार चार्टसाठी डेटा (टक्केवारीसह आणि सर्व टॉपिक्स) ---
//   const topicProgress = useMemo(() => {
//     // आपण प्रत्येक टॉपिकसाठी सविस्तर माहिती साठवू
//     const topicStats = topics.map(topic => {
//       let solvedCount = 0;
//       let totalQuestions = 0;

//       topic.patterns.forEach(p => {
//         Object.values(p.questions).forEach(qList => {
//           totalQuestions += qList.length; // टॉपिकमधील एकूण प्रश्न मोजा
//           qList.forEach(q => {
//             if (solvedQuestions[q.name]) solvedCount++;
//           });
//         });
//       });

//       // टक्केवारी काढा (शून्याने भागणे टाळा)
//       const percentage = totalQuestions > 0 ? Math.round((solvedCount / totalQuestions) * 100) : 0;
      
//       return {
//         name: topic.name,
//         solved: solvedCount,
//         total: totalQuestions,
//         percentage: percentage,
//       };
//     });

//     // चार्टसाठी डेटा तयार करा
//     const chartData = {
//       labels: topicStats.map(t => t.name),
//       datasets: [{
//         label: 'Progress Percentage',
//         data: topicStats.map(t => t.percentage), // डेटा म्हणून टक्केवारी पास करा
//         backgroundColor: [
//           'rgba(59, 130, 246, 0.7)', 'rgba(20, 184, 166, 0.7)', 'rgba(139, 92, 246, 0.7)',
//           'rgba(236, 72, 153, 0.7)', 'rgba(245, 158, 11, 0.7)', 'rgba(239, 68, 68, 0.7)',
//           'rgba(132, 204, 22, 0.7)', 'rgba(217, 70, 239, 0.7)', 'rgba(16, 185, 129, 0.7)', 'rgba(99, 102, 241, 0.7)'
//         ],
//         borderRadius: 5,
//       }],
//     };

//     // आपण मूळ माहिती (raw stats) सुद्धा परत करू, जी टूलटिपमध्ये वापरता येईल
//     return { chartData, rawStats: topicStats };

//   }, [topics, solvedQuestions]);


//   // --- डिफिकल्टी-वाईज पाई चार्टसाठी डेटा ---
//   const difficultyProgressData = useMemo(() => {
//     const counts = { easy: 0, medium: 0, hard: 0 };
//     let totalSolved = 0;

//     topics.forEach(topic => {
//       topic.patterns.forEach(p => {
//         Object.entries(p.questions).forEach(([difficulty, qList]) => {
//           qList.forEach(q => {
//             if (solvedQuestions[q.name]) {
//               if (counts[difficulty] !== undefined) counts[difficulty]++;
//               totalSolved++;
//             }
//           });
//         });
//       });
//     });
    
//     if (totalSolved === 0) return null;

//     return {
//       labels: ['Easy', 'Medium', 'Hard'],
//       datasets: [{
//         label: 'Solved Questions',
//         data: [counts.easy, counts.medium, counts.hard],
//         backgroundColor: ['#22c55e', '#facc15', '#ef4444'],
//         borderColor: '#1f2937',
//         borderWidth: 2,
//       }],
//     };
//   }, [topics, solvedQuestions]);

//   // --- चार्ट्ससाठी ऑप्शन्स ---
//   const barChartOptions = {
//     responsive: true,
//     indexAxis: 'y',
//     plugins: {
//       legend: { display: false },
//       title: { display: true, text: 'Topic Progress (%)', color: '#e5e7eb', font: { size: 16 } },
//       tooltip: {
//         callbacks: {
//           label: function(tooltipItem) {
//             const index = tooltipItem.dataIndex;
//             const stats = topicProgress.rawStats[index];
//             if (!stats) return '';
//             return ` Progress: ${stats.percentage}% (${stats.solved} of ${stats.total} solved)`;
//           }
//         }
//       }
//     },
//     scales: {
//       x: { 
//         ticks: { color: '#9ca3af', callback: (value) => `${value}%` },
//         grid: { color: 'rgba(255, 255, 255, 0.1)' }
//       },
//       y: { 
//         ticks: { color: '#9ca3af' },
//         grid: { display: false }
//       }
//     }
//   };

//   const pieChartOptions = {
//     responsive: true,
//     plugins: {
//       legend: { position: 'top', labels: { color: '#e5e7eb', font: { size: 14 } } },
//       title: { display: true, text: 'Solved by Difficulty', color: '#e5e7eb', font: { size: 16 } }
//     }
//   };
  
//   // एकूण किती प्रश्न सॉल्व्ह केले आहेत हे तपासण्यासाठी
//   const totalSolvedCount = useMemo(() => Object.keys(solvedQuestions).filter(key => solvedQuestions[key]).length, [solvedQuestions]);

//   return (
//     <motion.div
//       initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//       className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
//       onClick={closeModal}
//     >
//       <motion.div
//         initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
//         className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col"
//         onClick={e => e.stopPropagation()}
//       >
//         <div className="p-5 flex justify-between items-center border-b border-slate-700 flex-shrink-0">
//           <h2 className="text-xl font-bold text-slate-100">Progress Statistics</h2>
//           <button onClick={closeModal} className="p-1 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"><XMarkIcon className="h-6 w-6" /></button>
//         </div>
        
//         <div className="p-6 overflow-y-auto">
//           {totalSolvedCount > 0 ? (
//             <div className="grid lg:grid-cols-5 gap-8">
//               <div className="lg:col-span-2 bg-slate-900/50 p-4 rounded-xl flex items-center justify-center">
//                 {difficultyProgressData && <Pie data={difficultyProgressData} options={pieChartOptions} />}
//               </div>
//               <div className="lg:col-span-3 bg-slate-900/50 p-4 rounded-xl">
//                  <Bar data={topicProgress.chartData} options={barChartOptions} />
//               </div>
//             </div>
//           ) : (
//             <div className="text-center py-20">
//               <p className="text-2xl font-semibold text-slate-400">No Data Yet!</p>
//               <p className="mt-2 text-slate-500">Start solving some questions to see your statistics.</p>
//             </div>
//           )}
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default StatisticsModal;

// src/components/StatisticsModal.jsx
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/solid';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const StatisticsModal = ({ closeModal }) => {
  const { topics, solvedQuestions } = useSelector((state) => state.questions);

  // --- Topic-wise progress ---
  const topicProgress = useMemo(() => {
    const topicStats = topics.map((topic) => {
      let solvedCount = 0;
      let totalQuestions = 0;

      topic.patterns.forEach((p) => {
        Object.values(p.questions).forEach((qList) => {
          totalQuestions += qList.length;
          qList.forEach((q) => {
            if (solvedQuestions[q.name]) solvedCount++;
          });
        });
      });

      const percentage = totalQuestions > 0 ? Math.round((solvedCount / totalQuestions) * 100) : 0;
      return { name: topic.name, solved: solvedCount, total: totalQuestions, percentage };
    });

    const chartData = {
      labels: topicStats.map((t) => t.name),
      datasets: [
        {
          label: 'Progress Percentage',
          data: topicStats.map((t) => t.percentage),
          backgroundColor: [
            'rgba(59, 130, 246, 0.7)',
            'rgba(20, 184, 166, 0.7)',
            'rgba(139, 92, 246, 0.7)',
            'rgba(236, 72, 153, 0.7)',
            'rgba(245, 158, 11, 0.7)',
            'rgba(239, 68, 68, 0.7)',
            'rgba(132, 204, 22, 0.7)',
            'rgba(217, 70, 239, 0.7)',
            'rgba(16, 185, 129, 0.7)',
            'rgba(99, 102, 241, 0.7)',
          ],
          borderRadius: 5,
        },
      ],
    };

    return { chartData, rawStats: topicStats };
  }, [topics, solvedQuestions]);

  // --- Difficulty-wise pie chart ---
  const difficultyProgressData = useMemo(() => {
    const counts = { easy: 0, medium: 0, hard: 0 };
    let totalSolved = 0;

    topics.forEach((topic) => {
      topic.patterns.forEach((p) => {
        Object.entries(p.questions).forEach(([difficulty, qList]) => {
          qList.forEach((q) => {
            if (solvedQuestions[q.name]) {
              if (counts[difficulty] !== undefined) counts[difficulty]++;
              totalSolved++;
            }
          });
        });
      });
    });

    if (totalSolved === 0) return null;

    return {
      labels: ['Easy', 'Medium', 'Hard'],
      datasets: [
        {
          label: 'Solved Questions',
          data: [counts.easy, counts.medium, counts.hard],
          backgroundColor: ['#22c55e', '#facc15', '#ef4444'],
          borderColor: '#1f2937',
          borderWidth: 2,
        },
      ],
    };
  }, [topics, solvedQuestions]);

  // ✅ Smooth chart background plugin
  const backgroundColorFix = {
    id: 'backgroundColorFix',
    beforeDraw: (chart) => {
      const { ctx, width, height } = chart;
      ctx.save();
      ctx.fillStyle = '#111827';
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    },
  };

  // ✅ Bar chart options (with smooth animation)
  const barChartOptions = {
    responsive: true,
    indexAxis: 'y',
    maintainAspectRatio: false,
    animation: {
      duration: 1000, // smooth in-out animation
      easing: 'easeInOutQuart',
    },
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Topic Progress (%)',
        color: '#e5e7eb',
        font: { size: 16 },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const index = tooltipItem.dataIndex;
            const stats = topicProgress.rawStats[index];
            if (!stats) return '';
            return ` Progress: ${stats.percentage}% (${stats.solved} of ${stats.total} solved)`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#9ca3af', callback: (value) => `${value}%` },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      y: {
        ticks: {
          color: '#9ca3af',
          font: { size: 12 },
          autoSkip: false,
          maxRotation: 0,
          minRotation: 0,
        },
        grid: { display: false },
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    animation: {
      duration: 1200,
      easing: 'easeInOutCubic',
    },
    plugins: {
      legend: { position: 'top', labels: { color: '#e5e7eb', font: { size: 14 } } },
      title: { display: true, text: 'Solved by Difficulty', color: '#e5e7eb', font: { size: 16 } },
    },
  };

  const totalSolvedCount = useMemo(
    () => Object.keys(solvedQuestions).filter((key) => solvedQuestions[key]).length,
    [solvedQuestions]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={closeModal}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 flex justify-between items-center border-b border-slate-700 flex-shrink-0">
          <h2 className="text-xl font-bold text-slate-100">Progress Statistics</h2>
          <button
            onClick={closeModal}
            className="p-1 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {totalSolvedCount > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="grid lg:grid-cols-5 gap-8"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="lg:col-span-2 bg-slate-900/50 p-4 rounded-xl flex items-center justify-center"
              >
                {difficultyProgressData && <Pie data={difficultyProgressData} options={pieChartOptions} />}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="lg:col-span-3 bg-slate-900/50 p-4 rounded-xl"
              >
                <div style={{ height: `${topicProgress.chartData.labels.length * 50}px` }}>
                  <Bar data={topicProgress.chartData} options={barChartOptions} plugins={[backgroundColorFix]} />
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <div className="text-center py-20">
              <p className="text-2xl font-semibold text-slate-400">No Data Yet!</p>
              <p className="mt-2 text-slate-500">Start solving some questions to see your statistics.</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StatisticsModal;
