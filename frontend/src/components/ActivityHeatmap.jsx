import { useMemo } from 'react';
import './ActivityHeatmap.css';

/**
 * Enhanced ActivityHeatmap — Rewritten using pure SVG for pixel-perfect rendering.
 * Mimics GitHub's contribution graph with 53 columns and 7 rows.
 */
export default function ActivityHeatmap({ registrations = [] }) {
  // 1. Process registrations into a date-count lookup
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

  // 2. Generate the 53-week grid data starting from Sunday
  const { weeks, monthLabels, totalActiveDays, currentStreak } = useMemo(() => {
    const today = new Date();
    const resultWeeks = [];
    let activeDaysCount = 0;
    const mLabels = [];
    
    // Calculate start date: 52 weeks ago + current partial week, aligned to Sunday
    const startDate = new Date();
    startDate.setDate(today.getDate() - 364);
    startDate.setDate(startDate.getDate() - startDate.getDay()); // Align to Sunday

    const dateCursor = new Date(startDate);
    
    for (let w = 0; w < 53; w++) {
      const days = [];
      for (let d = 0; d < 7; d++) {
        const dateKey = dateCursor.toISOString().split('T')[0];
        const count = activityMap[dateKey] || 0;
        if (count > 0) activeDaysCount++;

        // Detect month change for labels
        if (dateCursor.getDate() <= 7 && d === 0) {
            const mName = dateCursor.toLocaleString('default', { month: 'short' });
            if (!mLabels.some(l => l.name === mName)) {
                mLabels.push({ name: mName, weekIndex: w });
            }
        }

        days.push({
          date: new Date(dateCursor),
          dateKey,
          count,
          level: getLevel(count)
        });
        dateCursor.setDate(dateCursor.getDate() + 1);
      }
      resultWeeks.push(days);
    }

    // Current Streak logic
    let streak = 0;
    const streakCursor = new Date();
    while (true) {
        const skey = streakCursor.toISOString().split('T')[0];
        if (activityMap[skey]) {
            streak++;
            streakCursor.setDate(streakCursor.getDate() - 1);
        } else {
            // Check if streak broke today or is ongoing from yesterday
            if (streak === 0) {
                 const yesterday = new Date();
                 yesterday.setDate(yesterday.getDate() - 1);
                 const yKey = yesterday.toISOString().split('T')[0];
                 if (!activityMap[yKey]) break; // Streak is 0
                 streakCursor.setDate(streakCursor.getDate() - 1); // Start from yesterday
                 continue;
            }
            break;
        }
    }

    return { 
        weeks: resultWeeks, 
        monthLabels: mLabels, 
        totalActiveDays: activeDaysCount,
        currentStreak: streak
    };
  }, [activityMap]);

  function getLevel(count) {
    if (count === 0) return 0;
    if (count === 1) return 1;
    if (count === 2) return 2;
    if (count === 3) return 3;
    return 4;
  }

  const levelColors = {
    0: 'var(--heatmap-bg-0)',
    1: '#0e4429',
    2: '#006d32',
    3: '#26a641',
    4: '#39d353'
  };

  return (
    <div className="activity-heatmap-wrapper card glass shadow-sm animate-fade-in">
      <div className="heatmap-header mb-4">
        <div className="heatmap-titles">
          <h3>Your Learning Activity</h3>
          <p className="text-muted">
            {totalActiveDays} days active this year • <span className="streak-badge">🔥 {currentStreak} day streak</span>
          </p>
        </div>
      </div>

      <div className="heatmap-svg-container">
        <svg width="100%" height="130" style={{ maxWidth: '850px' }}>
          {/* Month Labels */}
          {monthLabels.map((m, i) => (
            <text 
                key={i} 
                x={35 + (m.weekIndex * 16)} 
                y="12" 
                className="heatmap-text month-label"
            >
                {m.name}
            </text>
          ))}

          {/* Day Labels - All 7 rows exist, but only show labels for Mon, Wed, Fri */}
          <text x="0" y="32" className="heatmap-text day-label">Mon</text>
          <text x="0" y="64" className="heatmap-text day-label">Wed</text>
          <text x="0" y="96" className="heatmap-text day-label">Fri</text>

          {/* The Grid */}
          <g transform="translate(35, 20)">
            {weeks.map((week, weekIdx) => (
              <g key={weekIdx} transform={`translate(${weekIdx * 16}, 0)`}>
                {week.map((day, dayIdx) => (
                  <rect
                    key={dayIdx}
                    width="13"
                    height="13"
                    x="0"
                    y={dayIdx * 16}
                    rx="2.5"
                    fill={levelColors[day.level]}
                    className="heatmap-cell"
                    title={`${day.date.toLocaleDateString('default', { weekday: 'short', month: 'short', day: 'numeric' })} - ${day.count} webinars`}
                  >
                    <title>{`${day.date.toLocaleDateString('default', { weekday: 'short', month: 'short', day: 'numeric' })} - ${day.count} webinars`}</title>
                  </rect>
                ))}
              </g>
            ))}
          </g>
        </svg>
      </div>

      <div className="heatmap-legend mt-4">
        <span>Less</span>
        <div className="legend-items">
            {Object.entries(levelColors).map(([lvl, color]) => (
                <div key={lvl} className="heatmap-day" style={{ backgroundColor: color }}></div>
            ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
