import React from 'react';
import { motion } from 'motion/react';
import { ScreenType } from '../types';
import { toGujaratiNumberString } from '../data';

export interface CategoryCardProps {
  type: ScreenType;
  title: string;
  subtitle: string;
  emoji: string;
  gradient: string;
  badge: string;
  totalItems: number;
  completedCount: number;
  onClick: () => void;
  activeTab: 'english' | 'gujarati';
  decorations?: string[];
  id?: string;
}

export default function CategoryCard({
  type,
  title,
  subtitle,
  emoji,
  gradient,
  badge,
  totalItems,
  completedCount,
  onClick,
  activeTab,
  decorations = ['✨', '⭐'],
  id
}: CategoryCardProps) {
  const isGujarati = activeTab === 'gujarati';
  const pct = totalItems > 0 ? Math.min(100, Math.round((completedCount / totalItems) * 100)) : 0;
  const isFullyCompleted = totalItems > 0 && completedCount >= totalItems;
  const xp = completedCount * 10;

  // Format numbers for Gujarati
  const formattedCompleted = isGujarati ? toGujaratiNumberString(completedCount) : completedCount;
  const formattedTotal = isGujarati ? toGujaratiNumberString(totalItems) : totalItems;
  const formattedPct = isGujarati ? toGujaratiNumberString(pct) : pct;

  // Star rating calculation
  const getStarsDisplay = () => {
    if (totalItems === 0) return '⭐⭐⭐';
    if (isFullyCompleted) return '⭐⭐⭐';
    if (pct >= 50) return '⭐⭐';
    if (completedCount > 0) return '⭐';
    return '⭐ 0%';
  };

  return (
    <motion.button
      type="button"
      id={id}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.95, y: 3 }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-[2rem] sm:rounded-[2.25rem] border-4 border-high-ink shadow-[0_8px_0_#2D3436] hover:shadow-[0_12px_0_#2D3436] active:shadow-[0_2px_0_#2D3436] transition-all duration-300 p-4 sm:p-5 md:p-6 flex flex-col justify-between min-h-[175px] sm:min-h-[200px] md:min-h-[220px] w-full text-left cursor-pointer group select-none bg-gradient-to-br ${gradient}`}
    >
      {/* Top Gloss Reflection Overlay */}
      <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/35 via-white/10 to-transparent pointer-events-none rounded-t-[1.8rem]" />

      {/* Floating Background Decorations */}
      {decorations[0] && (
        <span className="absolute -top-1 -right-1 text-4xl sm:text-5xl opacity-20 pointer-events-none select-none group-hover:scale-125 transition-transform duration-500">
          {decorations[0]}
        </span>
      )}
      {decorations[1] && (
        <span className="absolute bottom-2 right-3 text-3xl sm:text-4xl opacity-20 pointer-events-none select-none group-hover:rotate-12 transition-transform duration-500">
          {decorations[1]}
        </span>
      )}

      {/* TOP AREA: Large Cute Icon Badge + Floating Pill Badge */}
      <div className="flex items-center justify-between w-full relative z-10 mb-2">
        {/* Large Cute Icon Badge */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl bg-white/25 backdrop-blur-md border-3 border-white/50 shadow-[0_4px_0_rgba(0,0,0,0.18)] flex items-center justify-center text-2xl sm:text-3xl md:text-4xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shrink-0">
          {emoji}
        </div>

        {/* Top Right Floating Pill Badge */}
        <div className="flex items-center gap-1.5 shrink-0">
          {isFullyCompleted && (
            <span className="bg-amber-300 text-high-ink border-2 border-high-ink w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm shadow-[0_2px_0_#2D3436] animate-bounce">
              ⭐
            </span>
          )}
          <span className="bg-white/30 backdrop-blur-md text-white border-2 border-white/60 shadow-[0_2px_4px_rgba(0,0,0,0.15)] rounded-full px-3 py-1 sm:px-3.5 sm:py-1.5 text-[9px] sm:text-xs font-black tracking-widest uppercase flex items-center gap-1">
            {badge}
          </span>
        </div>
      </div>

      {/* CENTER AREA: Very Large Bold Title & Subtitle */}
      <div className="relative z-10 w-full my-auto py-1">
        <h3 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-black text-white filter drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)] tracking-tight leading-snug break-words">
          {title}
        </h3>
        <p className="text-[10px] sm:text-xs md:text-sm font-extrabold text-white/95 filter drop-shadow-xs mt-0.5 sm:mt-1 leading-tight line-clamp-1">
          {subtitle}
        </p>
      </div>

      {/* BOTTOM AREA: Progress Bar / XP / Stars */}
      <div className="relative z-10 w-full mt-2">
        {totalItems > 0 ? (
          <div className="flex flex-col w-full gap-1">
            {/* Stats Info Header Line */}
            <div className="flex items-center justify-between text-[10px] sm:text-xs font-black uppercase tracking-wider text-white filter drop-shadow-xs">
              <span className="bg-black/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-white/20 shadow-xs flex items-center gap-1">
                {getStarsDisplay()}
              </span>
              <span className="bg-white/25 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-white/30 shadow-xs">
                {formattedCompleted}/{formattedTotal} • {isGujarati ? 'અંક' : 'XP'} {isGujarati ? toGujaratiNumberString(xp) : xp}
              </span>
            </div>

            {/* Glossy Progress Bar */}
            <div className="w-full bg-black/25 backdrop-blur-xs h-2.5 sm:h-3 rounded-full p-0.5 border border-white/40 overflow-hidden shadow-inner mt-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-300 via-yellow-200 to-white shadow-[0_1px_3px_rgba(0,0,0,0.3)] transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        ) : (
          /* Non-item interactive cards bottom bar */
          <div className="flex items-center justify-between text-[10px] sm:text-xs font-black uppercase tracking-wider text-white">
            <span className="bg-black/20 backdrop-blur-xs px-3 py-1 rounded-full border border-white/20 shadow-xs flex items-center gap-1.5">
              <span>{getStarsDisplay()}</span>
              <span>{isGujarati ? 'રમવા માટે સ્પર્શ કરો' : 'TAP TO PLAY'}</span>
            </span>
            <span className="bg-white/30 backdrop-blur-xs px-3 py-1 rounded-full border border-white/40 shadow-xs flex items-center gap-1">
              <span>🚀</span>
              <span>{isGujarati ? 'શરૂ કરો' : 'START'}</span>
            </span>
          </div>
        )}
      </div>
    </motion.button>
  );
}
