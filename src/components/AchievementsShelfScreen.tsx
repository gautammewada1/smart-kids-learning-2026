import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Star, Award, Lock, CheckCircle, Zap } from 'lucide-react';
import { ScreenType, AppSettings } from '../types';
import { playClickSound } from '../utils/audio';
import { UserProgress, ACHIEVEMENTS } from '../utils/userState';

interface AchievementsShelfScreenProps {
  settings: AppSettings;
  progress: UserProgress;
  onBackToHome: () => void;
}

export default function AchievementsShelfScreen({
  settings,
  progress,
  onBackToHome
}: AchievementsShelfScreenProps) {

  // Calculate stats
  let totalCompletedLessons = 0;
  Object.values(progress.completedItems).forEach(arr => {
    if (arr) totalCompletedLessons += arr.length;
  });

  const totalAchievementsCount = ACHIEVEMENTS.length;
  const unlockedAchievementsCount = progress.unlockedAchievements.length;

  const handleBack = () => {
    playClickSound(settings.soundEnabled);
    onBackToHome();
  };

  return (
    <div className="min-h-screen pb-20 px-4 pt-4 flex flex-col items-center relative overflow-x-hidden select-none transition-all duration-500 ease-in-out" style={{ background: 'var(--bg-gradient, var(--high-bg))', color: 'var(--high-ink)' }}>
      {/* Playful top clouds pattern */}
      <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-[#FFD93D]/10 to-transparent -z-10 overflow-hidden" />

      {/* Header */}
      <header className="w-full max-w-4xl flex items-center justify-center mb-8 z-10">
        <h1 className="text-2xl sm:text-3xl font-black text-high-ink dark:text-white flex items-center gap-2">
          <span>🏆</span> Achievements Shelf
        </h1>
      </header>

      {/* Main Container */}
      <div className="w-full max-w-4xl space-y-6 z-10">
        
        {/* Playful Stats Summary Cards Row */}
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          {/* Card 1: Total Stars */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-3 sm:p-4 border-3 sm:border-4 border-high-ink shadow-[0_4px_0_#2D3436] text-center flex flex-col justify-center items-center"
          >
            <span className="text-2xl sm:text-4xl animate-pulse mb-1">⭐</span>
            <span className="text-lg sm:text-2xl font-black text-[#FFD93D]">{totalCompletedLessons}</span>
            <span className="text-[8px] sm:text-[10px] font-black text-slate-400 dark:text-slate-300 uppercase tracking-wider mt-0.5 sm:mt-1 leading-none">
              Stars Collected
            </span>
          </motion.div>

          {/* Card 2: Badges Unlocked */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-3 sm:p-4 border-3 sm:border-4 border-high-ink shadow-[0_4px_0_#2D3436] text-center flex flex-col justify-center items-center"
          >
            <span className="text-2xl sm:text-4xl mb-1">🏅</span>
            <span className="text-lg sm:text-2xl font-black text-[#6BCB77]">
              {unlockedAchievementsCount}/{totalAchievementsCount}
            </span>
            <span className="text-[8px] sm:text-[10px] font-black text-slate-400 dark:text-slate-300 uppercase tracking-wider mt-0.5 sm:mt-1 leading-none">
              Badges Earned
            </span>
          </motion.div>

          {/* Card 3: Quizzes Perfect */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-3 sm:p-4 border-3 sm:border-4 border-high-ink shadow-[0_4px_0_#2D3436] text-center flex flex-col justify-center items-center"
          >
            <span className="text-2xl sm:text-4xl mb-1">🎯</span>
            <span className="text-lg sm:text-2xl font-black text-[#4D96FF]">{progress.perfectQuizzesCount || 0}</span>
            <span className="text-[8px] sm:text-[10px] font-black text-slate-400 dark:text-slate-300 uppercase tracking-wider mt-0.5 sm:mt-1 leading-none">
              Perfect Quizzes
            </span>
          </motion.div>
        </div>

        {/* Showcase Shelf Grid Section */}
        <div className="bg-amber-50 dark:bg-slate-850 rounded-[2.5rem] border-4 border-dashed border-amber-300 dark:border-slate-700 p-4 sm:p-6 shadow-inner relative overflow-hidden">
          {/* Wooden Shelf Graphic Accent (very subtle bottom border spacing mimicking a real child play shelf!) */}
          <div className="absolute inset-x-0 bottom-0 h-4 bg-amber-800/10 dark:bg-slate-900/40 pointer-events-none" />

          <h2 className="text-lg sm:text-xl font-black text-amber-800 dark:text-slate-300 uppercase tracking-wide mb-6 flex items-center gap-2">
            <span>🎒</span> My Collection Shelf
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pb-4">
            {ACHIEVEMENTS.map((ach) => {
              const isUnlocked = progress.unlockedAchievements.includes(ach.id);
              const currentVal = ach.currentCount(progress);
              const targetVal = ach.targetCount;
              const progressPct = Math.min((currentVal / targetVal) * 100, 100);

              return (
                <div 
                  key={ach.id}
                  className={`bg-white dark:bg-slate-800 rounded-3xl p-4 border-3 sm:border-4 border-high-ink shadow-[0_5px_0_#2D3436] flex flex-col justify-between items-center text-center relative overflow-hidden transition-all duration-300 ${
                    isUnlocked 
                      ? 'hover:translate-y-[-2px] hover:shadow-[0_7px_0_#2D3436]' 
                      : 'opacity-75 bg-slate-50 dark:bg-slate-800/50'
                  }`}
                >
                  {/* Visual Icon */}
                  <div className="relative mt-2">
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${ach.color} border-4 border-high-ink flex items-center justify-center text-2xl sm:text-3xl shadow-[0_4px_0_#2D3436] relative z-10 ${
                      !isUnlocked ? 'grayscale opacity-75' : 'animate-pulse'
                    }`}>
                      {ach.emoji}
                    </div>
                    
                    {/* Status Overlay */}
                    {!isUnlocked && (
                      <div className="absolute -bottom-1 -right-1 bg-slate-500 border-2 border-high-ink p-1 rounded-lg z-20 text-white flex items-center justify-center leading-none">
                        <Lock className="w-3 h-3 stroke-[3.5]" />
                      </div>
                    )}

                    {isUnlocked && (
                      <div className="absolute -bottom-1 -right-1 bg-green-500 border-2 border-high-ink p-1 rounded-lg z-20 text-white flex items-center justify-center leading-none">
                        <CheckCircle className="w-3 h-3 stroke-[3.5]" />
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex flex-col items-center w-full">
                    <h4 className="text-sm sm:text-base font-black text-slate-800 dark:text-white leading-tight">
                      {ach.title}
                    </h4>
                    <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 dark:text-slate-300 mt-1 leading-snug">
                      {ach.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="w-full mt-3">
                      <div className="flex justify-between text-[8px] font-extrabold text-slate-400 mb-1 uppercase tracking-wider">
                        <span>{isUnlocked ? 'UNLOCKED' : 'PROGRESS'}</span>
                        <span>{isUnlocked ? '100%' : `${currentVal}/${targetVal}`}</span>
                      </div>

                      <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full border border-high-ink p-0.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${isUnlocked ? 'bg-green-500' : 'bg-amber-400'}`}
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Completed Milestones/Trophies Area (Additional beautifully styled reward block!) */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-6 border-4 border-high-ink shadow-[0_6px_0_#2D3436] flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left"
        >
          <div className="w-14 h-14 bg-gradient-to-br from-yellow-300 to-amber-500 border-4 border-high-ink rounded-full flex items-center justify-center text-3xl shrink-0 animate-bounce">
            🎈
          </div>
          <div>
            <h3 className="font-black text-lg text-slate-800 dark:text-white uppercase leading-tight">
              Unlock amazing things!
            </h3>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-300 mt-1 uppercase tracking-wide leading-relaxed">
              Every completed quiz and finished topic gives you stars and fills up your collection shelf with trophies! Keep up the brilliant effort!
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
