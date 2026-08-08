import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { SectionHeader } from './DashboardCard';

export default function TimeOnEarth() {
  const dob = new Date('2004-04-23T00:00:00');
  
  const [time, setTime] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      let diff = now - dob;
      
      const seconds = Math.floor((diff / 1000) % 60);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      
      // Rough estimation for years and months for visual display
      const years = Math.floor(days / 365.25);
      const remainingDaysAfterYears = days - Math.floor(years * 365.25);
      const months = Math.floor(remainingDaysAfterYears / 30.44);
      const remainingDays = Math.floor(remainingDaysAfterYears - (months * 30.44));

      setTime({
        years,
        months,
        days: remainingDays,
        hours,
        minutes,
        seconds
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (num) => num.toString().padStart(2, '0');

  return (
    <div className="flex flex-col h-full w-full">
      <SectionHeader icon={Clock} title="Time on Earth" description="Since Apr 23, 2004" />
      <div className="flex-1 flex items-center justify-center p-2">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 sm:gap-4 w-full">
          {[
            { label: 'YRS', value: time.years },
            { label: 'MOS', value: time.months },
            { label: 'DAYS', value: pad(time.days) },
            { label: 'HRS', value: pad(time.hours) },
            { label: 'MINS', value: pad(time.minutes) },
            { label: 'SECS', value: pad(time.seconds) }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center justify-center p-2 sm:p-3 bg-gray-50 dark:bg-[#111] rounded-xl border border-gray-100 dark:border-gray-800">
              <span className="text-xl sm:text-2xl font-bold font-mono text-gray-900 dark:text-white">
                {item.value}
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-gray-400 tracking-wider mt-1">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
