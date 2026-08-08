import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { ActivityCalendar } from 'react-activity-calendar';
import { PlusCircle, Calendar as CalendarIcon, Edit3, Check, Music } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './DashboardCard';

export default function TodoApp({ children }) {
  const [newTask, setNewTask] = useState('');
  const [activities, setActivities] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [success, setSuccess] = useState(false);
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    fetchActivityData();
  }, []);

  const fetchActivityData = async () => {
    setErrorMsg(null);
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('completed_at')
        .eq('completed', true)
        .not('completed_at', 'is', null);

      if (error) {
        console.error('Supabase fetch error:', error);
        setErrorMsg('Failed to connect to Supabase. Check your Anon Key and database setup.');
        buildCalendar({});
        return;
      }

      const activityMap = {};
      (data || []).forEach(todo => {
        const dateStr = todo.completed_at.split('T')[0];
        activityMap[dateStr] = (activityMap[dateStr] || 0) + 1;
      });
      buildCalendar(activityMap);
    } catch (err) {
      console.error('Unexpected fetch error:', err);
      setErrorMsg(err.message);
      buildCalendar({});
    }
  };

  const buildCalendar = (activityMap) => {
    const now = new Date();
    const data = [];
    for (let i = 365; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = activityMap[dateStr] || 0;
      let level = 0;
      if (count > 0 && count <= 2) level = 1;
      else if (count > 2 && count <= 5) level = 2;
      else if (count > 5 && count <= 8) level = 3;
      else if (count > 8) level = 4;
      data.push({ date: dateStr, count, level });
    }
    setActivities(data);
  };

  const addTodo = async (e) => {
    if (e) e.preventDefault();
    if (!newTask.trim()) return;
    setErrorMsg(null);
    setSuccess(false);

    const now = new Date().toISOString();

    try {
      const { error } = await supabase
        .from('todos')
        .insert([{ task: newTask, completed: true, completed_at: now }]);

      if (error) {
        console.error('Supabase insert error:', error);
        setErrorMsg('Failed to add task. Check RLS policies or table setup.');
        return;
      }

      setNewTask('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      fetchActivityData(); // refresh the graph
    } catch (err) {
      console.error('Unexpected add error:', err);
      setErrorMsg(err.message);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addTodo();
    }
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

      {/* ===== LEFT COLUMN: All Activity Graphs ===== */}
      <div className="flex flex-col gap-6">
        {/* Task Activity Graph */}
        <Card>
          <CardHeader>
            <CardTitle>
              <CalendarIcon className="text-green-600 dark:text-green-500" size={20} />
              Task Activity
            </CardTitle>
            <CardDescription>
              Your daily completed tasks over the last year. Click any square to view history.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-x-auto pb-2">
              {activities.length > 0 ? (
                <ActivityCalendar
                  data={activities}
                  colorScheme={theme === 'dark' ? 'dark' : 'light'}
                  theme={{
                    light: ['#f1f5f9', '#bbf7d0', '#4ade80', '#22c55e', '#16a34a'],
                    dark: ['#111111', '#064e3b', '#047857', '#059669', '#10b981'],
                  }}
                  blockSize={12}
                  blockMargin={4}
                  blockRadius={3}
                  fontSize={12}
                  renderBlock={(block, activity) =>
                    React.cloneElement(block, {
                      onClick: () => navigate(`/day/${activity.date}`),
                      style: { ...block.props.style, cursor: 'pointer' },
                    })
                  }
                />
              ) : (
                <div className="animate-pulse h-[110px] bg-gray-100 dark:bg-[#111111] rounded-md w-full" />
              )}
            </div>
          </CardContent>
        </Card>

        {/* GitHub + LeetCode graphs passed from Dashboard */}
        {children}
      </div>

      {/* ===== RIGHT COLUMN: Add Task + empty space for music player ===== */}
      <div className="w-full flex flex-col gap-6 lg:sticky lg:top-6">
        {/* Add Task Card */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Edit3 className="text-blue-600 dark:text-blue-500" size={20} />
              Quick Log
            </CardTitle>
            <CardDescription>
              Write what you accomplished today and press Enter. It automatically logs to your activity graph.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {errorMsg && (
              <div className="mb-5 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl text-sm text-red-600 dark:text-red-400">
                <span className="font-semibold block mb-0.5">Error</span>
                {errorMsg}
              </div>
            )}

            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-5 overflow-hidden"
                >
                  <div className="p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-xl text-sm text-green-700 dark:text-green-400 flex items-center gap-2">
                    <Check size={16} />
                    Added to your daily log!
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={addTodo} className="flex flex-col gap-4">
              <textarea
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="E.g., Built the new authentication flow, reviewed PRs, and solved 2 LeetCode problems..."
                rows={4}
                className="w-full p-4 bg-gray-50/50 dark:bg-[#111111] text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 dark:focus:ring-blue-500/20 dark:focus:border-blue-500/50 placeholder-gray-400/80 transition-all resize-none text-[15px] leading-relaxed shadow-inner"
              />
              <button
                type="submit"
                className="w-full py-3 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-950 text-white rounded-xl flex items-center justify-center gap-2 transition-all font-semibold text-sm shadow-sm active:scale-[0.98]"
              >
                <PlusCircle size={18} />
                Add Accomplishment
              </button>
            </form>
          </CardContent>
        </Card>

        {/* Music Player Placeholder */}
        <Card className="min-h-[200px] flex items-center justify-center overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0a0a0b] dark:to-[#111111] opacity-50"></div>
          <div className="relative z-10 flex flex-col items-center justify-center text-gray-400 dark:text-gray-600 gap-3">
            <div className="p-4 rounded-full bg-gray-100 dark:bg-[#161618] group-hover:scale-110 transition-transform duration-300">
              <Music size={24} />
            </div>
            <p className="text-sm font-medium">Music Player Widget</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
