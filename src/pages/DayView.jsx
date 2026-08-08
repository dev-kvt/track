import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useTheme } from '../components/ThemeProvider';
import { Moon, Sun, ArrowLeft, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DayView() {
  const { date } = useParams();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasksForDate = async () => {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('completed', true)
        .order('completed_at', { ascending: false });
      
      if (!error && data) {
        // Filter client-side to ensure we don't miss anything due to strict UTC boundary issues
        // The graph groups by dateStr = completed_at.split('T')[0]
        const matchedTasks = data.filter(t => t.completed_at && t.completed_at.startsWith(date));
        setTasks(matchedTasks);
      } else {
        console.error('Error fetching tasks for date:', error);
      }
      setLoading(false);
    };

    if (date) {
      fetchTasksForDate();
    }
  }, [date]);

  const displayDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="min-h-screen bg-[#f8fafc] dark:bg-[#030303] text-gray-900 dark:text-gray-100 flex justify-center p-4 sm:p-8 font-sans"
    >
      <div className="w-full max-w-4xl flex flex-col mt-4 sm:mt-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors font-medium text-sm"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-md bg-white dark:bg-[#161b22] text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 border border-gray-200 dark:border-gray-800 transition-colors"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-[#161b22] p-8 rounded-xl border border-gray-200 dark:border-gray-800">
          <h1 className="text-2xl font-bold mb-1 text-gray-900 dark:text-gray-100">
            {displayDate}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">Tasks completed on this day</p>

          {loading ? (
            <div className="animate-pulse space-y-3">
              {[1,2,3].map(i => (
                <div key={i} className="h-14 bg-gray-100 dark:bg-gray-800 rounded-lg w-full"></div>
              ))}
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gray-200 dark:border-gray-800 rounded-lg">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-800/50 mb-3 text-xl">
                📭
              </div>
              <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">No tasks completed</h3>
              <p className="text-sm text-gray-500 mt-1">Looks like it was a chill day!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={task.id}
                  className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-[#0d1117] border border-gray-100 dark:border-gray-800"
                >
                  <CheckCircle className="text-green-500 shrink-0" size={24} />
                  <div>
                    <p className="text-base font-medium text-gray-800 dark:text-gray-200">{task.task}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Completed at {new Date(task.completed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
