import { useMemo } from 'react';
import './ActivityHeatmap.css';

/**
 * GitHub-style Activity Heatmap Component.
 * Displays a grid of 52 weeks across the last year.
 */
export default function ActivityHeatmap({ registrations = [] }) {
  // 1. Process registrations into a lookup map
  const activityMap = useMemo(() => {
    const map = {};
    registrations.forEach(reg => {
      if (reg.dateTime) {
        const dateKey = new Date(reg.dateTime).toISOString().split('T')[0];
        map[dateKey] = (map[dateKey] || 0) + 1;
      }
    });
    return map;
  }, [registrations]);

  // 2. Generate the grid data (last 365 days)
  const gridData = useMemo(() => {
    const days = [];
    const today = new Date();
    
    // We want 52 full weeks (364 days + today's partial week)
    // Starting from the Sunday of 52 weeks ago
    const startDay = new Date();
    startDay.setDate(today.getDate() - 364);
    // Align to Sunday
    const dayOfWeek = startDay.getDay(); 
    startDay.setDate(startDay.getDate() - dayOfWeek);

    const current = new Date(startDay);
    while (current <= today || days.length < 371) { // 53 weeks * 7
      const dateKey = current.toISOString().split('T')[0];
      const count = activityMap[dateKey] || 0;
      
      days.push({
        date: new Date(current),
        dateKey,
        count,
        level: getLevel(count)
      });
      current.setDate(current.getDate() + 1);
    }
    return days;
  }, [activityMap]);

  function getLevel(count) {
    if (count === 0) return 0;
    if (count === 1) return 1;
    if (count === 2) return 2;
    if (count === 3) return 3;
    return 4;
  }

  // 3. Stats logic
  const activeDays = Object.keys(activityMap).length;
  
  const currentStreak = useMemo(() => {
    let streak = 0;
    const checkDate = new Date();
    while (true) {
        const key = checkDate.toISOString().split('T')[0];
        if (activityMap[key]) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            // Check if streak broke today or yesterday
            if (streak === 0) {
                 // Try yesterday if today is empty
                 const yesterday = new Date();
                 yesterday.setDate(yesterday.getDate() - 1);
                 const yKey = yesterday.toISOString().split('T')[0];
                 if (!activityMap[yKey]) return 0; // Truly 0
                 // If yesterday has it, wait the loop will handle it? 
                 // No, standard streak logic: if yesterday exists but today doesn't, streak is still active.
            }
            break;
        }
    }
    return streak;
  }, [activityMap]);

  // Group by weeks for the grid
  const weeks = [];
  for (let i = 0; i < gridData.length; i += 7) {
    weeks.push(gridData.slice(i, i + 7));
  }

  const monthLabels = useMemo(() => {
    const labels = [];
    weeks.forEach((week, i) => {
        const firstDay = week[0].date;
        if (firstDay.getDate() <= 7) {
            labels.push({ index: i, name: firstDay.toLocaleString('default', { month: 'short' }) });
        }
    });
    return labels;
  }, [weeks]);

  return (
    <div className="activity-heatmap-wrapper card glass shadow-sm animate-fade-in">
      <div className="heatmap-header mb-6">
        <div className="heatmap-titles">
          <h3>Your Learning Activity</h3>
          <p className="text-muted">{activeDays} days active this year • <span className="streak-badge">🔥 {currentStreak} day streak</span></p>
        </div>
      </div>

      <div className="heatmap-container-outer">
        <div className="heatmap-labels-y">
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
        </div>
        
        <div className="heatmap-grid-scroll">
          <div className="heatmap-labels-x">
             {monthLabels.map((m, i) => (
                 <span key={i} style={{ gridColumn: m.index + 1 }}>{m.name}</span>
             ))}
          </div>
          
          <div className="heatmap-grid">
            {weeks.map((week, weekIdx) => (
              <div key={weekIdx} className="heatmap-week">
                {week.map((day, dayIdx) => (
                  <div 
                    key={dayIdx} 
                    className={`heatmap-day level-${day.level}`}
                    title={`${day.date.toLocaleDateString('default', { month: 'long', day: 'numeric' })} - ${day.count} webinars attended`}
                  ></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="heatmap-legend mt-4">
        <span>Less</span>
        <div className="legend-items">
            <div className="heatmap-day level-0"></div>
            <div className="heatmap-day level-1"></div>
            <div className="heatmap-day level-2"></div>
            <div className="heatmap-day level-3"></div>
            <div className="heatmap-day level-4"></div>
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
