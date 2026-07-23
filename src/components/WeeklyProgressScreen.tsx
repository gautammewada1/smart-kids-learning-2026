import React from 'react';
import { motion } from 'motion/react';
import { Flame, BarChart3, TrendingUp, Calendar, Trophy } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { ScreenType, AppSettings } from '../types';
import { playClickSound } from '../utils/audio';
import { UserProgress } from '../utils/userState';

interface WeeklyProgressScreenProps {
  settings: AppSettings;
  progress: UserProgress;
  onBackToHome: () => void;
}

export default function WeeklyProgressScreen({
  settings,
  progress,
  onBackToHome
}: WeeklyProgressScreenProps) {
  
  // Weekly progress chart computation
  const getWeeklyProgressData = () => {
    const daysOfWeekShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const data = [];
    const todayObj = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(todayObj.getDate() - i);
      
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;
      
      const dayIndex = d.getDay();
      const dayLabel = i === 0 ? 'Today' : daysOfWeekShort[dayIndex];
      
      const count = progress.dailyHistory?.[dateKey] || 0;
      data.push({
        day: dayLabel,
        count: count,
        dateKey,
        isToday: i === 0,
      });
    }
    return data;
  };

  const chartData = getWeeklyProgressData();
  const weeklyTotal = chartData.reduce((acc, curr) => acc + curr.count, 0);
  
  // Find best day
  let bestDayCount = 0;
  let bestDayLabel = '';
  chartData.forEach(item => {
    if (item.count > bestDayCount) {
      bestDayCount = item.count;
      bestDayLabel = item.day;
    }
  });

  const handleBack = () => {
    playClickSound(settings.soundEnabled);
    onBackToHome();
  };

  return (
    <div className="min-h-screen pb-20 px-4 pt-4 flex flex-col items-center relative overflow-x-hidden select-none transition-all duration-500 ease-in-out" style={{ background: 'var(--bg-gradient, var(--high-bg))', color: 'var(--high-ink)' }}>
      {/* Header */}
      <header className="w-full max-w-4xl flex items-center justify-center mb-8 z-10">
        <h1 className="text-2xl sm:text-3xl font-black text-high-ink dark:text-white flex items-center gap-2">
          <span>📊</span> Weekly Progress
        </h1>
      </header>

      {/* Main Container */}
      <div className="w-full max-w-4xl space-y-6 z-10">
        
        {/* Streak & Daily Goal Section (Combined beautiful card layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          
          {/* Daily Streak Card */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-slate-800 rounded-3xl p-6 border-4 border-high-ink shadow-[0_6px_0_#2D3436] flex flex-col items-center text-center justify-center min-h-[180px]"
          >
            <span className="text-5xl animate-bounce mb-3">🔥</span>
            <h3 className="font-black text-xl text-high-ink dark:text-white uppercase tracking-wider">
              {progress.streakCount > 0 ? `${progress.streakCount} Day Streak!` : '0 Day Streak'}
            </h3>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-300 mt-2 uppercase tracking-wide">
              Keep learning every day to keep your streak alive! 🚀
            </p>
          </motion.div>

          {/* Daily Goal Progress Card */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="bg-white dark:bg-slate-800 rounded-3xl p-6 border-4 border-high-ink shadow-[0_6px_0_#2D3436] flex flex-col justify-between items-center text-center min-h-[180px]"
          >
            <div className="w-full">
              <span className="text-3xl mb-1 block">🎯</span>
              <span className="text-xs font-black text-slate-400 dark:text-slate-300 uppercase tracking-widest block leading-none mb-1">
                Daily Goal
              </span>
              <span className="text-sm font-extrabold text-slate-600 dark:text-slate-200 uppercase leading-none block mb-4">
                Learn 5 lessons
              </span>
              
              <div className="w-full bg-slate-100 dark:bg-slate-700 h-4 rounded-full overflow-hidden border-2 border-high-ink p-0.5 relative">
                <div 
                  className="bg-amber-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((progress.dailyGoalProgress / 5) * 100, 100)}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <span className="text-sm font-black text-high-ink dark:text-white bg-amber-100 dark:bg-amber-950 border-2 border-high-ink rounded-lg px-3 py-1 leading-none">
                {progress.dailyGoalProgress}/5 Completed
              </span>
              {progress.dailyGoalCompleted && (
                <span className="text-xl leading-none animate-pulse" title="Completed!">🌟</span>
              )}
            </div>
          </motion.div>
          
        </div>

        {/* Weekly Chart Container */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border-4 border-high-ink shadow-[0_6px_0_#2D3436] w-full"
        >
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-7 h-7 text-[#FF6B6B]" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white uppercase tracking-wide">
              Weekly Activity Chart
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total summary Box */}
            <div className="bg-slate-50 dark:bg-slate-850 rounded-2xl p-5 border-3 border-high-ink flex flex-col justify-between items-center text-center">
              <div>
                <span className="text-xs font-black tracking-widest text-slate-400 dark:text-slate-300 uppercase block mb-1">
                  Weekly Total
                </span>
                <span className="text-6xl font-black text-[#FF6B6B] leading-none block">
                  {weeklyTotal}
                </span>
                <span className="text-xs font-black text-slate-500 dark:text-slate-300 block mt-3 uppercase tracking-wider leading-snug">
                  Lessons & items finished this week!
                </span>
              </div>
              
              <div className="mt-5 border-t-2 border-dashed border-slate-200 dark:border-slate-700 pt-4 flex items-center justify-center gap-3 w-full">
                <div className="text-4xl animate-bounce">🏆</div>
                <div className="text-left">
                  <span className="text-[10px] font-black text-slate-400 dark:text-slate-300 uppercase block leading-none">Best Day</span>
                  <span className="text-sm font-black text-[#6BCB77] leading-tight block uppercase">
                    {bestDayLabel ? `${bestDayLabel} (${bestDayCount})` : 'Keep Learning!'}
                  </span>
                </div>
              </div>
            </div>

            {/* Recharts Chart Area */}
            <div className="md:col-span-2 bg-slate-50 dark:bg-slate-850 rounded-2xl p-4 border-3 border-high-ink flex items-center justify-center min-h-[250px]">
              {weeklyTotal === 0 ? (
                <div className="text-center p-4">
                  <span className="text-5xl block mb-3">🚀</span>
                  <h4 className="text-base font-black text-slate-600 dark:text-slate-300 uppercase tracking-wide">
                    No activities completed yet!
                  </h4>
                  <p className="text-xs font-bold text-slate-400 mt-2">
                    Start learning or playing quizzes to see your beautiful progress chart!
                  </p>
                </div>
              ) : (
                <div className="w-full h-full min-h-[220px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <XAxis 
                        dataKey="day" 
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: settings.darkMode ? '#94a3b8' : '#475569', fontWeight: 900, fontSize: 11 }}
                      />
                      <YAxis 
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                        tick={{ fill: settings.darkMode ? '#94a3b8' : '#475569', fontWeight: 900, fontSize: 11 }}
                      />
                      <Tooltip 
                        cursor={{ fill: 'rgba(0, 0, 0, 0.05)', radius: 10 }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const value = payload[0].value;
                            return (
                              <div className="bg-white dark:bg-slate-800 border-3 border-high-ink rounded-xl p-2 px-3 shadow-[0_3px_0_#2D3436] text-xs font-black">
                                <span className="text-[#FF6B6B] block">⭐ {value} Completed!</span>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar 
                        dataKey="count" 
                        radius={[8, 8, 0, 0]}
                      >
                        {chartData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.isToday ? '#FFD93D' : '#4D96FF'}
                            stroke="#2D3436"
                            strokeWidth={2.5}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Motivational Quote or Activity History Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="bg-gradient-to-r from-[#FFD93D] to-[#FF9F43] dark:from-slate-800 dark:to-slate-900 rounded-3xl p-6 border-4 border-high-ink shadow-[0_6px_0_#2D3436] text-center flex flex-col items-center justify-center"
        >
          <span className="text-4xl mb-2 animate-pulse">✨</span>
          <h4 className="text-lg font-black text-high-ink dark:text-white uppercase leading-none">
            Outstanding Learning Journey!
          </h4>
          <p className="text-xs sm:text-sm font-bold text-high-ink/80 dark:text-slate-300 mt-2 max-w-xl leading-relaxed">
            Every lesson and quiz brings you closer to becoming a brilliant explorer! Keep completing challenges and unlocking wonderful badges. You are doing fantastic!
          </p>
        </motion.div>

      </div>
    </div>
  );
}
