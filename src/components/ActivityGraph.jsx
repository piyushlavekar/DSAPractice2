
import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ActivityCalendar from 'react-activity-calendar';
import { FireIcon, InformationCircleIcon } from '@heroicons/react/24/solid';

const ActivityGraph = () => {
  const { solveDates } = useSelector(state => state.questions);
  
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipContent, setTooltipContent] = useState('');

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);

    return () => {
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  const handleBlockClick = (event, activity) => {
    setSelectedDate(activity.date);
    // You can add additional functionality here when a date is clicked
    console.log('Selected date:', activity.date, 'Count:', activity.count);
  };

  const handleBlockHover = (event, activity) => {
    const rect = event.target.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
    
    if (activity.count > 0) {
      const date = new Date(activity.date);
      const formattedDate = date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      setTooltipContent(`${activity.count} question${activity.count > 1 ? 's' : ''} solved on ${formattedDate}`);
    } else {
      setTooltipContent(`No activity on ${activity.date}`);
    }
    
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const { activityData, longestStreak, currentStreak } = useMemo(() => {
    if (!solveDates || Object.keys(solveDates).length === 0) {
      return { activityData: [], longestStreak: 0, currentStreak: 0 };
    }

    const dailyCounts = {};
    Object.values(solveDates).forEach(ts => {
      const dateString = new Date(ts).toISOString().slice(0, 10);
      dailyCounts[dateString] = (dailyCounts[dateString] || 0) + 1;
    });

    const today = new Date();
    const startDate = new Date();
    startDate.setFullYear(today.getFullYear() - 1);

    const calendarData = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= today) {
      const dateString = currentDate.toISOString().slice(0, 10);
      const count = dailyCounts[dateString] || 0;
      
      calendarData.push({
        date: dateString,
        count,
        level: count > 0 ? Math.min(4, Math.ceil(count / 2)) : 0,
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const uniqueSolveDays = new Set(Object.keys(dailyCounts));
    const sortedUniqueSolveDays = [...uniqueSolveDays].sort();
    
    let longest = 0;
    let current = 0;
    
    if (sortedUniqueSolveDays.length > 0) {
      let currentLongest = 1;
      longest = 1;
      
      for (let i = 1; i < sortedUniqueSolveDays.length; i++) {
        const prevDate = new Date(sortedUniqueSolveDays[i - 1]);
        const currDate = new Date(sortedUniqueSolveDays[i]);
        const diffDays = (currDate - prevDate) / (1000 * 60 * 60 * 24);
        
        if (diffDays === 1) {
          currentLongest++;
        } else {
          longest = Math.max(longest, currentLongest);
          currentLongest = 1;
        }
      }
      
      longest = Math.max(longest, currentLongest);
      
      const todayStr = today.toISOString().slice(0, 10);
      if (uniqueSolveDays.has(todayStr)) {
        current = 1;
        let yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        
        while (uniqueSolveDays.has(yesterday.toISOString().slice(0, 10))) {
          current++;
          yesterday.setDate(yesterday.getDate() - 1);
        }
      }
    }

    return {
      activityData: calendarData,
      longestStreak: longest,
      currentStreak: current,
    };
  }, [solveDates]);

  const theme = {
    light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
    dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353']
  };

  return (
    <div className="p-4 md:p-6">
      <div ref={containerRef} className="bg-slate-800/60 border border-slate-700 rounded-2xl shadow-lg p-6 relative">
        <h3 className="text-xl font-bold text-slate-200 mb-4">
          Progress Activity
        </h3>
        
        <div className="mb-6 text-slate-400 relative" onMouseLeave={handleMouseLeave}>
          {activityData.length > 0 ? (
            <>
              <ActivityCalendar
                data={activityData}
                theme={theme}
                blockSize={14}
                blockMargin={4}
                fontSize={12}
                showWeekdayLabels
                hideTotalCount
                hideColorLegend
                loading={activityData.length === 0}
                eventHandlers={{
                  onClick: handleBlockClick,
                  onMouseOver: handleBlockHover
                }}
              />
              
              {showTooltip && (
                <div 
                  className="absolute bg-slate-900 text-slate-200 px-3 py-2 rounded-md shadow-lg z-10 text-sm whitespace-nowrap transform -translate-x-1/2 -translate-y-full"
                  style={{
                    left: `${tooltipPosition.x}px`,
                    top: `${tooltipPosition.y}px`
                  }}
                >
                  {tooltipContent}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-t-slate-900 border-l-transparent border-r-transparent"></div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-slate-400">
              No activity data available
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-8 gap-y-4 text-slate-400">
          <div className="flex items-center gap-2">
            <FireIcon className={`h-6 w-6 ${currentStreak > 0 ? 'text-orange-400' : 'text-slate-500'}`} />
            <span>Current streak:</span>
            <span className="font-bold text-white">{currentStreak} days</span>
          </div>
          <div className="flex items-center gap-2">
            <FireIcon className={`h-6 w-6 ${longestStreak > 0 ? 'text-orange-400' : 'text-slate-500'}`} />
            <span>Longest streak:</span>
            <span className="font-bold text-white">{longestStreak} days</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityGraph;