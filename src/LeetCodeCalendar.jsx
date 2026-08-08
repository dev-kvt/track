import React, { useState, useEffect } from 'react';
import { ActivityCalendar } from 'react-activity-calendar';
import { format, fromUnixTime } from 'date-fns';
import { useTheme } from './components/ThemeProvider';

const HEATMAP_THEME = {
  light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
  dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
};

const LeetCodeCalendar = ({ username }) => {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      // 1. Check cached data first for instant load
      const cached = localStorage.getItem(`leetcode_${username}`);
      if (cached) {
        try {
          const { stats: cachedStats, data: cachedData } = JSON.parse(cached);
          if (cachedStats && cachedData?.length) {
            setStats(cachedStats);
            setData(cachedData);
            setLoading(false);
          }
        } catch (e) {
          console.warn("Failed to parse cached LeetCode data", e);
        }
      }

      // 2. Fetch fresh data with fallback support
      try {
        let fetchedStats = null;
        let calendarObj = null;

        // Try Primary API
        try {
          const res = await fetch(`https://leetcode-api-faisalshohag.vercel.app/${username}`);
          if (res.ok) {
            const result = await res.json();
            if (result.easySolved !== undefined) {
              fetchedStats = {
                easy: result.easySolved,
                medium: result.mediumSolved,
                hard: result.hardSolved,
                total: result.totalSolved
              };
            }
            if (result.submissionCalendar) {
              calendarObj = typeof result.submissionCalendar === 'string'
                ? JSON.parse(result.submissionCalendar)
                : result.submissionCalendar;
            }
          }
        } catch (e) {
          console.warn("Primary LeetCode API failed, trying fallback...", e);
        }

        // Try Fallback API if primary failed to get calendar
        if (!calendarObj) {
          try {
            const [calRes, profileRes] = await Promise.all([
              fetch(`https://alfa-leetcode-api.onrender.com/${username}/calendar`),
              fetch(`https://alfa-leetcode-api.onrender.com/userProfile/${username}`)
            ]);

            if (calRes.ok) {
              const calData = await calRes.json();
              if (calData.submissionCalendar) {
                calendarObj = typeof calData.submissionCalendar === 'string'
                  ? JSON.parse(calData.submissionCalendar)
                  : calData.submissionCalendar;
              }
            }

            if (profileRes.ok && !fetchedStats) {
              const profData = await profileRes.json();
              if (profData.totalSolved !== undefined) {
                fetchedStats = {
                  easy: profData.easySolved || 0,
                  medium: profData.mediumSolved || 0,
                  hard: profData.hardSolved || 0,
                  total: profData.totalSolved || 0
                };
              }
            }
          } catch (e) {
            console.warn("Fallback LeetCode API also failed...", e);
          }
        }

        if (!calendarObj) {
          if (!cached) setError(true);
          setLoading(false);
          return;
        }

        const activityMap = new Map();
        Object.entries(calendarObj).forEach(([timestamp, count]) => {
          const dateStr = format(fromUnixTime(parseInt(timestamp)), 'yyyy-MM-dd');
          activityMap.set(dateStr, count);
        });

        const today = new Date();
        const activities = [];
        const startDate = new Date();
        startDate.setFullYear(today.getFullYear() - 1);

        for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
          const dateStr = format(d, 'yyyy-MM-dd');
          const count = activityMap.get(dateStr) || 0;
          let level = 0;
          if (count > 0 && count <= 2) level = 1;
          else if (count > 2 && count <= 5) level = 2;
          else if (count > 5 && count <= 10) level = 3;
          else if (count > 10) level = 4;
          activities.push({ date: dateStr, count, level });
        }

        if (fetchedStats) setStats(fetchedStats);
        setData(activities);
        setError(false);
        setLoading(false);

        // Save to cache
        localStorage.setItem(`leetcode_${username}`, JSON.stringify({
          stats: fetchedStats,
          data: activities
        }));
      } catch (err) {
        console.error("LeetCode fetch error:", err);
        if (!cached) setError(true);
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  const colorScheme = theme === 'dark' ? 'dark' : 'light';
  const heatmapColors = theme === 'dark' ? { dark: HEATMAP_THEME.dark } : { light: HEATMAP_THEME.light };

  if (loading) return <div className="animate-pulse h-28 bg-gray-100 dark:bg-gray-800/30 rounded-lg w-full" />;
  if (error) return <div className="text-sm text-red-500 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900">Failed to load LeetCode data.</div>;

  return (
    <div>
      {stats && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="flex items-center gap-3 sm:gap-4 bg-gray-50 dark:bg-[#111] px-3 sm:px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-800 text-sm">
            <div className="flex flex-col items-center px-1">
              <span className="text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-widest font-bold">Total</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100 tabular-nums">{stats.total}</span>
            </div>
            <div className="h-7 w-px bg-gray-200 dark:bg-gray-800" />
            <div className="flex flex-col items-center px-1">
              <span className="text-[9px] sm:text-[10px] text-green-600 dark:text-green-500 uppercase tracking-widest font-bold">Easy</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100 tabular-nums">{stats.easy}</span>
            </div>
            <div className="flex flex-col items-center px-1">
              <span className="text-[9px] sm:text-[10px] text-yellow-600 dark:text-yellow-500 uppercase tracking-widest font-bold">Med</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100 tabular-nums">{stats.medium}</span>
            </div>
            <div className="flex flex-col items-center px-1">
              <span className="text-[9px] sm:text-[10px] text-red-600 dark:text-red-500 uppercase tracking-widest font-bold">Hard</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100 tabular-nums">{stats.hard}</span>
            </div>
          </div>
        </div>
      )}
      <div className="w-full overflow-x-auto calendar-scroll pb-1">
        <div className="min-w-[680px]">
          <ActivityCalendar
            data={data}
            colorScheme={colorScheme}
            theme={heatmapColors}
            blockSize={12}
            blockMargin={4}
            blockRadius={3}
            fontSize={12}
            hideTotalCount={false}
            hideColorLegend={false}
          />
        </div>
      </div>
    </div>
  );
};

export default LeetCodeCalendar;
