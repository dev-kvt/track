import React, { useState, useEffect } from 'react';
import { ActivityCalendar } from 'react-activity-calendar';
import { format, fromUnixTime, getYear } from 'date-fns';

const LeetCodeCalendar = ({ username }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://leetcode-api-faisalshohag.vercel.app/${username}`);
        if (!response.ok) throw new Error('Failed to fetch');
        
        const result = await response.json();
        
        if (!result.submissionCalendar) {
           setData([]);
           setLoading(false);
           return;
        }

        const calendarData = typeof result.submissionCalendar === 'string' 
          ? JSON.parse(result.submissionCalendar) 
          : result.submissionCalendar;
        
        // Convert UNIX timestamps to ActivityCalendar format
        const activityMap = new Map();
        
        Object.entries(calendarData).forEach(([timestamp, count]) => {
          const dateStr = format(fromUnixTime(parseInt(timestamp)), 'yyyy-MM-dd');
          activityMap.set(dateStr, count);
        });
        
        // Generate last 365 days to fill missing dates with 0 count
        const today = new Date();
        const activities = [];
        
        // Start from 1 year ago
        const startDate = new Date();
        startDate.setFullYear(today.getFullYear() - 1);
        
        for (let d = startDate; d <= today; d.setDate(d.getDate() + 1)) {
          const dateStr = format(d, 'yyyy-MM-dd');
          const count = activityMap.get(dateStr) || 0;
          
          let level = 0;
          if (count > 0 && count <= 2) level = 1;
          else if (count > 2 && count <= 5) level = 2;
          else if (count > 5 && count <= 10) level = 3;
          else if (count > 10) level = 4;
          
          activities.push({
            date: dateStr,
            count: count,
            level: level
          });
        }
        
        setData(activities);
        setLoading(false);
      } catch (err) {
        console.error("LeetCode fetch error:", err);
        setError(true);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [username]);

  if (loading) return <div className="animate-pulse flex h-32 bg-gray-800 rounded-md"></div>;
  if (error) return <div className="text-red-400">Failed to load LeetCode data</div>;

  const theme = {
    light: ['#2c2c2c', '#2c4c2c', '#2c7c2c', '#2cac2c', '#2cdc2c'],
    dark: ['#2c2c2c', '#2c4c2c', '#2c7c2c', '#2cac2c', '#2cdc2c'],
  };

  return (
    <div className="flex flex-col gap-2">
      <ActivityCalendar 
        data={data} 
        theme={theme}
        hideTotalCount={true}
        hideColorLegend={true}
        colorScheme="dark"
      />
    </div>
  );
};

export default LeetCodeCalendar;
