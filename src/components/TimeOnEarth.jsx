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

  const items = [
    { label: 'YRS', value: time.years },
    { label: 'MOS', value: time.months },
    { label: 'DAYS', value: pad(time.days) },
    { label: 'HRS', value: pad(time.hours) },
    { label: 'MINS', value: pad(time.minutes) },
    { label: 'SECS', value: pad(time.seconds) }
  ];

  return (
    <div className="flex flex-col h-full w-full">
      <SectionHeader icon={Clock} title="Time on Earth" description="Since Apr 23, 2004" />
      <div className="flex-1 flex items-center justify-center">
        <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center py-2.5 sm:py-3 px-1 bg-gray-50 dark:bg-[#111] rounded-xl border border-gray-100 dark:border-gray-800 transition-colors"
            >
              <span className="text-lg sm:text-xl font-bold font-mono text-gray-900 dark:text-white tabular-nums">
                {item.value}
              </span>
              <span className="text-[9px] sm:text-[10px] font-semibold text-gray-400 dark:text-gray-500 tracking-wider mt-0.5">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
