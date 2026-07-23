import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play } from 'lucide-react';
import { playClickSound, playLionRoarSound, speakText } from '../utils/audio';
import { UserProgress } from '../utils/userState';

interface HeroHeaderProps {
  soundEnabled: boolean;
  onPlayTour: () => void;
  userProgress?: UserProgress;
}

const LETTER_COLORS = [
  '#FFD166', // Yellow
  '#FF6B6B', // Coral Red
  '#4D96FF', // Sky Blue
  '#6BCB77', // Green
  '#FF7EB3', // Pink
  '#FF9F43', // Orange
  '#B10DC9', // Purple
  '#00C6FF', // Cyan
  '#FFD166', // Yellow
  '#FF6B6B', // Red
  '#6BCB77', // Green
  '#4D96FF', // Blue
  '#FF9F43', // Orange
];

const LION_GREETINGS = [
  { text: "Roar! Hello little friend! Let's learn and play together!", bubble: "Roar! Hello Friend! 🦁" },
  { text: "Roar! કેમ છો મિત્ર! ચાલો સાથે શીખીએ!", bubble: "Roar! કેમ છો મિત્ર! 🦁" },
  { text: "Welcome to Kids Learning! Have fun today!", bubble: "Welcome! Have Fun! 🌟" },
  { text: "You are super smart! Keep growing!", bubble: "You are Super Smart! ⭐" }
];

export default function HeroHeader({ soundEnabled, onPlayTour, userProgress }: HeroHeaderProps) {
  const titleText = "KIDS LEARNING";
  const [activeSpeech, setActiveSpeech] = useState<string | null>(null);
  const [greetingIndex, setGreetingIndex] = useState(0);

  // Derive mascot expression state based on quiz performance
  const lastResult = userProgress?.lastQuizResult;
  let expressionType: 'perfect' | 'great' | 'encouraging' | 'default' = 'default';
  let accessoryBadge = '✨';
  let scoreText = '';

  if (lastResult) {
    if (lastResult.percentage === 100) {
      expressionType = 'perfect';
      accessoryBadge = '👑';
      scoreText = `Perfect 100%! 🏆`;
    } else if (lastResult.percentage >= 75) {
      expressionType = 'great';
      accessoryBadge = '🌟';
      scoreText = `Super ${lastResult.percentage}%! ⭐`;
    } else {
      expressionType = 'encouraging';
      accessoryBadge = '💪';
      scoreText = `Keep Growing! 💪`;
    }
  } else if ((userProgress?.perfectQuizzesCount || 0) > 0) {
    expressionType = 'perfect';
    accessoryBadge = '👑';
    scoreText = `Quiz Champion! 👑`;
  } else if ((userProgress?.completedQuizzes || 0) > 0) {
    expressionType = 'great';
    accessoryBadge = '🌟';
    scoreText = `Great Learner! 🌟`;
  }

  const handleLionTap = () => {
    // Play roar sound effect
    playLionRoarSound(soundEnabled);

    if (lastResult) {
      // Provide score-aware mascot reaction & speech
      let greetingText = '';
      let bubbleText = '';

      if (lastResult.percentage === 100) {
        greetingText = "Roar! Wow! Perfect score 100%! You are a Quiz Champion!";
        bubbleText = "Roar! Perfect 100%! 👑🎉";
      } else if (lastResult.percentage >= 75) {
        greetingText = `Roar! Awesome job! You scored ${lastResult.percentage}%! You are super smart!`;
        bubbleText = `Awesome ${lastResult.percentage}%! 🌟🤩`;
      } else {
        greetingText = `Roar! Good effort scoring ${lastResult.score} out of ${lastResult.total}! Practice makes perfect!`;
        bubbleText = `Good Effort ${lastResult.score}/${lastResult.total}! 💪✨`;
      }

      setActiveSpeech(bubbleText);
      speakText(greetingText, 'en', undefined, soundEnabled);
    } else {
      // Standard friendly greeting cycle
      const greeting = LION_GREETINGS[greetingIndex % LION_GREETINGS.length];
      setGreetingIndex(prev => prev + 1);

      setActiveSpeech(greeting.bubble);

      const isGujarati = greeting.text.includes('કેમ છો');
      speakText(
        greeting.text, 
        isGujarati ? 'gu' : 'en', 
        undefined, 
        soundEnabled
      );
    }

    // Auto dismiss bubble after 3.2s
    setTimeout(() => {
      setActiveSpeech(null);
    }, 3200);
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-3 md:my-5 relative z-10 px-2 sm:px-4 select-none">
      {/* Floating Premium Hero Card */}
      <motion.div 
        initial={{ opacity: 0, y: -24, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative overflow-hidden rounded-[2.25rem] sm:rounded-[2.75rem] border-4 border-high-ink shadow-[0_10px_0_#2D3436] hover:shadow-[0_14px_0_#2D3436] p-5 sm:p-7 md:p-9 text-center bg-gradient-to-br from-[#FF512F] via-[#F09819] to-[#8E2DE2] dark:from-[#3A1C71] dark:via-[#D76D77] dark:to-[#FFAF7B] transition-all duration-300 group"
      >
        {/* Gloss Reflection Overlay */}
        <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/35 via-white/10 to-transparent pointer-events-none rounded-t-[2.2rem]" />

        {/* Floating Background Decorations */}
        <div className="absolute top-2 left-4 text-2xl sm:text-4xl opacity-40 pointer-events-none select-none animate-bounce">
          ☁️
        </div>
        <div className="absolute top-3 right-16 sm:right-24 text-2xl sm:text-4xl opacity-40 pointer-events-none select-none animate-pulse">
          ☁️
        </div>
        <div className="absolute top-6 left-2 sm:left-8 text-3xl sm:text-5xl pointer-events-none select-none drop-shadow-md">
          🎈
        </div>
        <div className="absolute top-8 right-10 sm:right-16 text-3xl sm:text-5xl pointer-events-none select-none drop-shadow-md hidden xs:block">
          🎈
        </div>

        {/* Floating Stars & Sparkles */}
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-3 left-1/4 text-amber-300 text-xl sm:text-3xl pointer-events-none filter drop-shadow-xs"
        >
          ⭐
        </motion.div>
        <motion.div 
          animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          className="absolute bottom-4 left-6 text-yellow-200 text-lg sm:text-2xl pointer-events-none hidden sm:block"
        >
          ✨
        </motion.div>
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
          className="absolute top-4 right-1/3 text-amber-300 text-lg sm:text-2xl pointer-events-none"
        >
          🌟
        </motion.div>

        {/* Extra Fun Toy Decorations */}
        <div className="absolute bottom-3 left-4 sm:bottom-5 sm:left-8 text-2xl sm:text-3xl pointer-events-none select-none filter drop-shadow-xs hidden sm:block">
          🔤
        </div>
        <div className="absolute bottom-3 right-24 sm:bottom-5 sm:right-32 text-2xl sm:text-3xl pointer-events-none select-none filter drop-shadow-xs hidden md:block">
          🔢
        </div>

        {/* Rainbow Accent */}
        <div className="flex justify-center mb-1">
          <motion.div 
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex items-center gap-1.5 bg-white/25 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/40 shadow-xs"
          >
            <span className="text-xl sm:text-2xl">🌈</span>
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-white">
              FUN LEARNING APP
            </span>
            <span className="text-xl sm:text-2xl">⭐</span>
          </motion.div>
        </div>

        {/* Main Title: KIDS LEARNING */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap my-2 relative">
          <span className="text-3xl sm:text-5xl select-none animate-bounce">🎈</span>
          
          <div className="relative inline-block">
            {/* Sparkle overlays */}
            <span className="absolute -top-3 -left-4 text-amber-300 text-sm sm:text-xl animate-pulse pointer-events-none">✨</span>
            <span className="absolute -top-4 right-6 text-yellow-200 text-xs sm:text-lg pointer-events-none">⭐</span>
            <span className="absolute -bottom-2 -left-2 text-cyan-200 text-xs sm:text-base pointer-events-none">✦</span>
            <span className="absolute -bottom-3 -right-3 text-pink-300 text-sm sm:text-xl pointer-events-none">✨</span>

            <h1 className="flex items-center justify-center gap-0.5 sm:gap-1 text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight select-none">
              {titleText.split('').map((char, index) => {
                if (char === ' ') {
                  return <span key={index} className="w-2 sm:w-4 inline-block" />;
                }
                const color = LETTER_COLORS[index % LETTER_COLORS.length];
                return (
                  <motion.span
                    key={index}
                    whileHover={{ scale: 1.25, rotate: Math.random() * 20 - 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="inline-block cursor-pointer font-black drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)]"
                    style={{
                      color,
                      WebkitTextStroke: '2.5px #2D3436',
                      filter: 'drop-shadow(0px 4px 0px #2D3436)'
                    }}
                  >
                    {char}
                  </motion.span>
                );
              })}
            </h1>
          </div>

          <span className="text-3xl sm:text-5xl select-none animate-bounce [animation-delay:0.3s]">🦁</span>
        </div>

        {/* Subtitle: English & Gujarati (2 centered lines) */}
        <div className="flex flex-col items-center justify-center gap-0.5 my-2">
          <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white filter drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)] tracking-wide">
            English & Gujarati
          </span>
          <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-amber-300 filter drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)] tracking-wide">
            અંગ્રેજી અને ગુજરાતી
          </span>
        </div>

        {/* Tagline Pill Capsule */}
        <div className="my-3 sm:my-4 flex justify-center">
          <motion.div 
            whileHover={{ scale: 1.04 }}
            className="bg-black/25 backdrop-blur-md px-4 sm:px-6 py-2 rounded-full border-2 border-white/50 shadow-[0_4px_0_rgba(0,0,0,0.2)] inline-flex items-center gap-2 max-w-full"
          >
            <span className="text-xs sm:text-sm md:text-base font-black text-white filter drop-shadow-xs tracking-wider">
              🎤 Learn • 📚 Explore • 🎮 Play • ⭐ Grow
            </span>
          </motion.div>
        </div>

        {/* Play Tour Button */}
        <div className="mt-4 flex justify-center items-center">
          <motion.button
            type="button"
            whileHover={{ scale: 1.06, y: -2 }}
            whileTap={{ scale: 0.95, y: 2 }}
            onClick={() => {
              playClickSound(soundEnabled);
              onPlayTour();
            }}
            className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-300 hover:to-orange-400 text-high-ink font-black py-2.5 px-6 sm:px-8 rounded-full border-4 border-high-ink shadow-[0_5px_0_#2D3436] active:shadow-[0_1px_0_#2D3436] flex items-center gap-2.5 text-sm sm:text-base cursor-pointer transition-all uppercase tracking-wider"
          >
            <div className="w-6 h-6 rounded-full bg-white border-2 border-high-ink flex items-center justify-center shadow-xs">
              <Play className="w-3.5 h-3.5 text-high-ink fill-high-ink ml-0.5" />
            </div>
            <span>Play Tour 🗺️</span>
          </motion.button>
        </div>

        {/* Peeking Lion Mascot on Right */}
        <div className="absolute -right-1 sm:-right-2 bottom-0 flex flex-col items-end z-20 select-none">
          {/* Speech Bubble */}
          <AnimatePresence>
            {activeSpeech && (
              <motion.div
                initial={{ opacity: 0, scale: 0.6, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.6, y: 10 }}
                className="mb-1 mr-1 sm:mr-2 bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-300 text-high-ink font-black text-xs sm:text-sm px-3 py-1.5 rounded-2xl border-2 border-high-ink shadow-[0_3px_0_#2D3436] relative whitespace-nowrap z-30 max-w-[220px] text-center"
              >
                {activeSpeech}
                <div className="absolute -bottom-2 right-4 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-amber-300" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Score Expression Tag */}
          {scoreText && !activeSpeech && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-1 mr-1 bg-white/90 dark:bg-slate-800/90 text-high-ink dark:text-amber-300 font-extrabold text-[10px] sm:text-xs px-2 py-0.5 rounded-full border border-high-ink shadow-xs flex items-center gap-1"
            >
              <span>{accessoryBadge}</span>
              <span>{scoreText}</span>
            </motion.div>
          )}

          <div className="relative flex items-center justify-center">
            <motion.div
              animate={expressionType === 'perfect' 
                ? { y: [0, -6, 0], rotate: [-8, 8, -8], scale: [1, 1.25, 1] }
                : { y: [0, -3, 0], scale: [1, 1.1, 1] }
              }
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-3 sm:-top-5 right-2 sm:right-4 text-lg sm:text-2xl z-30 pointer-events-none drop-shadow-md"
            >
              {accessoryBadge}
            </motion.div>

            <motion.button
              type="button"
              whileHover={{ scale: 1.18, rotate: 6 }}
              whileTap={{ scale: 1.32, rotate: [-12, 12, 0] }}
              onClick={handleLionTap}
              title={`Tap the lion mascot! Expression: ${expressionType}`}
              aria-label="Tap lion mascot for greeting and quiz reaction"
              className="cursor-pointer focus:outline-none focus:ring-0 group p-1 relative"
            >
              <div 
                className={`text-4xl sm:text-6xl md:text-7xl drop-shadow-lg group-hover:drop-shadow-2xl transition-all ${
                  expressionType === 'perfect' ? 'animate-bounce' : 'animate-lion-bounce'
                }`}
              >
                🦁
              </div>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
