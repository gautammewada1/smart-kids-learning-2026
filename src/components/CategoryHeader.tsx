import React from 'react';
import { motion } from 'motion/react';
import { Volume2, VolumeX, Grid, Printer } from 'lucide-react';

interface CategoryHeaderProps {
  title: string;
  subtitle?: string;
  emoji?: string;
  onBack?: () => void;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  onOpenGrid?: () => void;
  gridTitle?: string;
  onPrint?: () => void;
  categoryType?: string;
  customRightContent?: React.ReactNode;
}

export default function CategoryHeader({
  title,
  subtitle,
  emoji = '🌟',
  soundEnabled = true,
  onToggleSound,
  onOpenGrid,
  gridTitle = 'Choose Lesson 🔍',
  onPrint,
  customRightContent
}: CategoryHeaderProps) {
  return (
    <div className="w-full max-w-4xl mx-auto z-20 mb-3 md:mb-5 px-2 sm:px-4 select-none">
      <motion.div 
        initial={{ opacity: 0, y: -15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 dark:from-slate-800 dark:via-purple-900 dark:to-indigo-900 border-4 sm:border-8 border-high-ink p-3.5 sm:p-5 md:p-6 shadow-[0_8px_0_#2D3436] sm:shadow-[0_12px_0_#2D3436]"
      >
        {/* Floating Decorative Elements */}
        <div className="absolute top-1 left-2 sm:top-2 sm:left-4 text-xl sm:text-3xl opacity-80 pointer-events-none animate-cloud-drift select-none">
          ☁️
        </div>
        <div className="absolute top-2 right-3 sm:top-3 sm:right-6 text-xl sm:text-3xl opacity-80 pointer-events-none animate-cloud-drift [animation-delay:-10s] select-none">
          ☁️
        </div>
        <div className="absolute -bottom-2 right-12 sm:bottom-1 sm:right-20 text-lg sm:text-2xl pointer-events-none animate-sparkle-1 select-none">
          ✨
        </div>
        <div className="absolute top-2 left-1/3 text-sm sm:text-lg pointer-events-none animate-sparkle-2 select-none">
          ⭐
        </div>

        {/* Header Main Bar */}
        <div className="relative z-10 flex flex-row items-center justify-between gap-2 sm:gap-4">
          
          {/* Center Title Area */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 text-center flex-1 my-1 md:my-0">
            <span className="text-3xl sm:text-4xl md:text-5xl drop-shadow-md select-none animate-bounce shrink-0">
              {emoji}
            </span>
            <div className="flex flex-col items-center">
              <h1 
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white dark:text-amber-300 leading-snug drop-shadow-[0_3px_0_#2D3436] text-center max-w-full break-words"
                style={{
                  WebkitTextStroke: '1.5px #2D3436',
                  filter: 'drop-shadow(0px 3px 0px #2D3436)'
                }}
              >
                {title}
              </h1>
              {subtitle && (
                <span className="mt-0.5 px-3 py-0.5 bg-white/90 dark:bg-slate-900/90 text-high-ink dark:text-amber-300 font-extrabold text-xs sm:text-sm rounded-full border border-high-ink shadow-xs">
                  {subtitle}
                </span>
              )}
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {customRightContent}

            {onOpenGrid && (
              <motion.button
                type="button"
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.92, y: 2 }}
                onClick={onOpenGrid}
                className="p-2 sm:p-3 bg-[#FFD93D] text-high-ink font-black rounded-2xl border-3 sm:border-4 border-high-ink shadow-[0_3px_0_#2D3436] sm:shadow-[0_4px_0_#2D3436] hover:shadow-[0_6px_0_#2D3436] active:shadow-[0_1px_0_#2D3436] transition-all cursor-pointer flex items-center gap-1.5 text-xs sm:text-sm"
                title={gridTitle}
              >
                <Grid className="w-5 h-5 stroke-[3]" />
                <span className="uppercase font-extrabold hidden sm:inline">Topics</span>
              </motion.button>
            )}

            {onPrint && (
              <motion.button
                type="button"
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.92, y: 2 }}
                onClick={onPrint}
                className="p-2 sm:p-3 bg-[#6BCB77] text-white font-black rounded-2xl border-3 sm:border-4 border-high-ink shadow-[0_3px_0_#2D3436] sm:shadow-[0_4px_0_#2D3436] hover:shadow-[0_6px_0_#2D3436] active:shadow-[0_1px_0_#2D3436] transition-all cursor-pointer flex items-center gap-1.5 text-xs sm:text-sm"
                title="Print Worksheet 🖨️"
              >
                <Printer className="w-5 h-5 stroke-[3]" />
                <span className="uppercase font-extrabold hidden sm:inline">Print</span>
              </motion.button>
            )}

            {onToggleSound && (
              <motion.button
                type="button"
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.92, y: 2 }}
                onClick={onToggleSound}
                className={`p-2 sm:p-3 rounded-2xl border-3 sm:border-4 border-high-ink shadow-[0_3px_0_#2D3436] sm:shadow-[0_4px_0_#2D3436] hover:shadow-[0_6px_0_#2D3436] active:shadow-[0_1px_0_#2D3436] transition-all cursor-pointer flex items-center gap-1.5 text-xs sm:text-sm ${
                  soundEnabled ? 'bg-[#FFD93D] text-high-ink' : 'bg-slate-300 text-slate-600'
                }`}
                title={soundEnabled ? "Mute Sound 🔊" : "Unmute Sound 🔇"}
              >
                {soundEnabled ? (
                  <>
                    <Volume2 className="w-5 h-5 stroke-[3]" />
                    <span className="uppercase font-extrabold hidden sm:inline">Sound On</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-5 h-5 stroke-[3]" />
                    <span className="uppercase font-extrabold hidden sm:inline">Muted</span>
                  </>
                )}
              </motion.button>
            )}
          </div>

        </div>
      </motion.div>
    </div>
  );
}
