import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Header, Footer } from '../components/Layout';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DayView() {
  const { date } = useParams();
  const navigate = useNavigate();
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
    <div className="page-container bg-[#f8fafc] dark:bg-[#030303] text-gray-900 dark:text-gray-100 font-sans">
      <Header />

      <main className="page-content">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-3 py-2 mb-6 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium text-sm"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </button>
          </motion.div>

          {/* Content Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white dark:bg-[#0a0a0b] p-6 sm:p-8 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 shadow-sm"
          >
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
              {displayDate}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6 sm:mb-8 text-sm mt-1">
              Tasks completed on this day
            </p>

            {loading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => (
                  <div key={i} className="animate-pulse h-14 bg-gray-100 dark:bg-gray-800/50 rounded-lg w-full"></div>
                ))}
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
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
                    className="flex items-start gap-3 sm:gap-4 p-4 rounded-xl bg-gray-50 dark:bg-[#111] border border-gray-100 dark:border-gray-800"
                  >
                    <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={20} />
                    <div className="min-w-0">
                      <p className="text-sm sm:text-base font-medium text-gray-800 dark:text-gray-200 break-words">
                        {task.task}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Completed at {new Date(task.completed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
