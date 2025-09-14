// import React from 'react';

// const ProgressBar = ({ progress }) => {
//   // Ensure progress is always between 0 and 100 for styling
//   const clampedProgress = Math.max(0, Math.min(100, progress));

//   return (
//     // The background track remains a subtle gray
//     <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
      
//       {/* --- KEY CHANGE: New "Aurora" Gradient --- */}
//       {/* This gradient is specifically chosen to look vibrant and attractive on dark backgrounds. */}
//       <div
//         className="bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 h-2.5 rounded-full transition-all duration-500 ease-out"
//         style={{ width: `${clampedProgress}%` }}
//       ></div>

//     </div>
//   );
// };

// export default ProgressBar;
import React from 'react';

const ProgressBar = ({ progress }) => {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    // The background track
    <div className="w-full bg-slate-700 rounded-full h-2.5 overflow-hidden">
      
      {/* --- KEY CHANGE: A new, elegant gradient from Cyan to a deeper Blue --- */}
      <div
        className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2.5 rounded-full transition-all duration-700 ease-out"
        style={{ width: `${clampedProgress}%` }}
      ></div>

    </div>
  );
};

export default ProgressBar;