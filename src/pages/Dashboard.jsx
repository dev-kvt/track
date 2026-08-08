import React, { useState, useEffect } from 'react';
import { GitHubCalendar } from 'react-github-calendar';
import { ActivityCalendar } from 'react-activity-calendar';
import LeetCodeCalendar from '../LeetCodeCalendar';
import DailyQuote from '../components/DailyQuote';
import { DashboardCard, SectionHeader } from '../components/DashboardCard';
import { useTheme } from '../components/ThemeProvider';
import { Moon, Sun, Calendar, Edit3, PlusCircle, Check, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

const GITHUB_ICON = (
  <svg className="w-[18px] h-[18px] fill-current text-gray-400 dark:text-gray-500" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const LEETCODE_ICON = (
  <svg className="w-[18px] h-[18px] text-gray-400 dark:text-gray-500" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-4.332-4.363c-.467-.467-.702-1.15-.702-1.863s.235-1.357.702-1.824l4.319-4.38c.467-.467 1.125-.645 1.837-.645s1.357.195 1.823.662l2.697 2.606c.514.515 1.365.497 1.9-.038.535-.536.553-1.387.039-1.901l-2.609-2.636a5.055 5.055 0 0 0-7.015 0l-4.32 4.38C2.52 12.016 2 13.064 2 14.195s.52 2.179 1.488 3.147l4.332 4.364A4.984 4.984 0 0 0 11.378 23c1.37 0 2.673-.556 3.535-1.524l2.609-2.636c.514-.514.496-1.365-.039-1.9-.535-.535-1.386-.517-1.901.039z" />
    <path d="M22.512 7.153l-4.332-4.363c-.922-.922-2.126-1.39-3.327-1.39s-2.405.468-3.327 1.39l-2.697 2.606c-.514.515-.496 1.365.039 1.9.535.535 1.386.517 1.901-.039l2.697-2.606c.466-.467 1.111-.662 1.823-.662s1.357.195 1.824.662l4.332 4.363c.467.467.702 1.15.702 1.863s-.235 1.357-.702 1.824l-4.319 4.38c-.467.467-1.125.645-1.837.645s-1.357-.195-1.823-.662l-2.697-2.606c-.514-.515-1.365-.497-1.9.038-.535.536-.553 1.387-.039 1.901l2.609 2.636a5.055 5.055 0 0 0 7.015 0l4.32-4.38c.968-.968 1.488-2.016 1.488-3.147s-.52-2.179-1.488-3.147z" />
  </svg>
);

const HEATMAP_THEME = {
  light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
  dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
};

export default function Dashboard() {
  const username = 'dev-kvt';
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [newTask, setNewTask] = useState('');
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => { fetchActivity(); }, []);

  const fetchActivity = async () => {
    try {
      const { data, error: dbError } = await supabase
        .from('todos')
        .select('completed_at')
        .eq('completed', true)
        .not('completed_at', 'is', null);

      if (dbError) { setError('Database connection failed.'); buildCalendar({}); return; }

      const map = {};
      (data || []).forEach(t => {
        const d = t.completed_at.split('T')[0];
        map[d] = (map[d] || 0) + 1;
      });
      buildCalendar(map);
    } catch (e) {
      setError(e.message);
      buildCalendar({});
    }
  };

  const buildCalendar = (map) => {
    const now = new Date();
    const out = [];
    for (let i = 365; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const ds = d.toISOString().split('T')[0];
      const c = map[ds] || 0;
      let l = 0;
      if (c > 0 && c <= 2) l = 1;
      else if (c > 2 && c <= 5) l = 2;
      else if (c > 5 && c <= 8) l = 3;
      else if (c > 8) l = 4;
      out.push({ date: ds, count: c, level: l });
    }
    setActivities(out);
  };

  const addTask = async (e) => {
    if (e) e.preventDefault();
    if (!newTask.trim()) return;
    setError(null);
    setSuccess(false);
    try {
      const { error: dbError } = await supabase
        .from('todos')
        .insert([{ task: newTask, completed: true, completed_at: new Date().toISOString() }]);
      if (dbError) { setError('Failed to save. Check RLS policies.'); return; }
      setNewTask('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
      fetchActivity();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addTask(); }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#030303] text-gray-900 dark:text-gray-100 p-6 font-sans">
      <div className="max-w-[1400px] mx-auto">

        <div className="flex items-center justify-end mb-6">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full bg-white dark:bg-[#111] text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white border border-gray-200 dark:border-gray-800 hover:shadow-md transition-all duration-200"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6">

          {/* LEFT — Analytics */}
          <div className="flex flex-col gap-6">
            <DashboardCard>
              <SectionHeader icon={Calendar} title="Task Activity" />
              <div className="w-full overflow-x-auto">
                {activities.length > 0 ? (
                  <ActivityCalendar
                    data={activities}
                    colorScheme="light"
                    theme={{ light: HEATMAP_THEME.light }}
                    blockSize={12}
                    blockMargin={4}
                    blockRadius={3}
                    fontSize={12}
                    hideTotalCount={true}
                    hideColorLegend={false}
                    renderBlock={(block, activity) =>
                      React.cloneElement(block, {
                        onClick: () => navigate(`/day/${activity.date}`),
                        style: { ...block.props.style, cursor: 'pointer' },
                      })
                    }
                  />
                ) : (
                  <div className="animate-pulse h-28 bg-gray-100 dark:bg-gray-800/30 rounded-lg w-full" />
                )}
              </div>
            </DashboardCard>

            <DashboardCard>
              <SectionHeader iconSvg={GITHUB_ICON} title="GitHub Activity" description="Contributions over the last year" />
              <div className="w-full overflow-x-auto">
                <GitHubCalendar
                  username={username}
                  colorScheme="light"
                  theme={{ light: HEATMAP_THEME.light }}
                  fontSize={12}
                  blockSize={12}
                  blockMargin={4}
                  blockRadius={3}
                  hideTotalCount={true}
                  hideColorLegend={false}
                />
              </div>
            </DashboardCard>

            <DashboardCard>
              <SectionHeader iconSvg={LEETCODE_ICON} title="LeetCode Activity" description="Problem solving consistency" />
              <LeetCodeCalendar username={username} />
            </DashboardCard>
          </div>

          {/* RIGHT — Logging + Motivation */}
          <div className="flex flex-col gap-6">
            <DashboardCard className="flex-1 flex flex-col">
              <SectionHeader icon={Edit3} title="Quick Log" />
              <form onSubmit={addTask} className="flex-1 flex flex-col">
                {error && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl text-sm text-red-600 dark:text-red-400">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="mb-4 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-xl text-sm text-green-700 dark:text-green-400 flex items-center gap-2">
                    <Check size={16} /> Logged to your activity graph!
                  </div>
                )}
                <textarea
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 min-h-[120px] w-full p-4 bg-gray-50 dark:bg-[#111] text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 placeholder-gray-400 transition-all resize-none text-[15px] leading-relaxed"
                />
                <button
                  type="submit"
                  className="mt-4 w-full py-3 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 text-white rounded-xl flex items-center justify-center gap-2 transition-all font-semibold text-sm active:scale-[0.98]"
                >
                  <PlusCircle size={18} />
                  Add to Activity
                </button>
              </form>
            </DashboardCard>

            <DashboardCard className="flex-1 flex items-center justify-center">
              <DailyQuote />
            </DashboardCard>
          </div>

        </div>
      </div>
    </div>
  );
}
