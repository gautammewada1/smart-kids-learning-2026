import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, 
  Sparkles, 
  RotateCcw, 
  Check, 
  HelpCircle, 
  ArrowRight, 
  Trash2,
  Bookmark,
  Award,
  Grid,
  Sparkle
} from 'lucide-react';
import { AppSettings, ScreenType } from '../types';
import { speakText, playClickSound, playSuccessSound, playErrorSound, triggerVibration } from '../utils/audio';
import confetti from 'canvas-confetti';
import { toGujaratiNumberString, ENGLISH_WORDS, GUJARATI_CONSONANTS, GUJARATI_VOWELS } from '../data';
import ChikuMascot from './ChikuMascot';
import CategoryHeader from './CategoryHeader';

interface GamesScreenProps {
  settings: AppSettings;
  onBackToHome: () => void;
  activeTab: 'english' | 'gujarati';
}

type GameType = 'menu' | 'letter-match' | 'sound-match' | 'number-trace' | 'guj-number-trace' | 'learn-math' | 'guess-word';

export default function GamesScreen({ settings, onBackToHome, activeTab }: GamesScreenProps) {
  const [activeGame, setActiveGame] = useState<GameType>('menu');

  // Back handling
  const handleBack = () => {
    playClickSound(settings.soundEnabled);
    if (activeGame === 'menu') {
      onBackToHome();
    } else {
      setActiveGame('menu');
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col justify-between overflow-hidden p-3 md:p-6 transition-all duration-500 ease-in-out" style={{ background: 'var(--bg-gradient, var(--high-bg))', color: 'var(--high-ink)' }}>
      {/* Category Hero Header */}
      <CategoryHeader 
        title={
          activeGame === 'menu' ? (activeTab === 'english' ? 'English Games' : 'ગુજરાતી રમતો') :
          activeGame === 'letter-match' ? 'Letter Match' :
          activeGame === 'sound-match' ? 'Gujarati Sound Match' :
          activeGame === 'number-trace' ? 'Number Trace (1-100)' :
          activeGame === 'guj-number-trace' ? 'Gujarati Number Trace' :
          activeGame === 'learn-math' ? (activeTab === 'english' ? 'Learn Math' : 'સરળ ગણિત') :
          (activeTab === 'english' ? 'Guess the Word' : 'શબ્દ ઓળખો')
        }
        subtitle={
          activeGame === 'menu' ? 'Fun interactive games for kids! 🎮' : 'Play and learn! 🏆'
        }
        emoji="🎮"
        onBack={handleBack}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto flex flex-col items-center justify-center my-3 relative overflow-hidden bg-white dark:bg-slate-800 rounded-[2.5rem] border-8 border-high-ink shadow-[0_12px_0_#2D3436] p-4 sm:p-6 md:p-8">
        <AnimatePresence mode="wait">
          {activeGame === 'menu' && (
            <motion.div 
              key="menu"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="w-full h-full flex flex-col justify-center items-center"
            >
              <ChikuMascot 
                lang={activeTab === 'english' ? 'en' : 'gu'}
                soundEnabled={settings.soundEnabled}
                context="games"
                className="mb-4 z-10"
              />

              <div className="grid grid-cols-2 gap-2 sm:gap-4 md:gap-5 w-full max-w-4xl max-h-[68vh] overflow-y-auto p-2 custom-scrollbar">
                {activeTab === 'english' ? (
                  <>
                    {/* 1. Letter Match Game */}
                    <button
                      onClick={() => {
                        playClickSound(settings.soundEnabled);
                        setActiveGame('letter-match');
                      }}
                      className="bg-[#FF6B6B] text-white font-extrabold rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 md:p-5 border-3 sm:border-4 border-high-ink shadow-[0_4px_0_#2D3436] sm:shadow-[0_6px_0_#2D3436] hover:translate-y-[-2px] hover:shadow-[0_4px_0_#2D3436] sm:hover:shadow-[0_8px_0_#2D3436] active:translate-y-[2px] active:shadow-[0_1px_0_#2D3436] sm:active:shadow-[0_2px_0_#2D3436] transition-all text-left flex flex-col justify-between h-28 sm:h-38 md:h-48 group relative overflow-hidden"
                    >
                      {/* Top Row with Category Emoji & Badge */}
                      <div className="flex justify-between items-start w-full relative z-10">
                        <span className="text-lg sm:text-2xl md:text-3xl bg-white/20 backdrop-blur-sm w-7 h-7 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform font-black">
                          🔤
                        </span>
                        
                        <span className="bg-black/10 text-[7px] sm:text-[10px] md:text-xs font-black uppercase py-0.5 px-1.5 sm:py-1 sm:px-2.5 md:px-3 rounded-full border border-black/5">
                          Play ➔
                        </span>
                      </div>

                      {/* Bottom Row with Titles */}
                      <div className="relative z-10 w-full text-left">
                        <h3 className="text-[10px] sm:text-base md:text-xl lg:text-2xl tracking-wide font-black leading-tight filter drop-shadow-sm truncate">
                          Letter Match
                        </h3>
                        <p className="text-[8px] sm:text-xs font-semibold opacity-90 mt-0.5 sm:mt-1.5 tracking-wider line-clamp-2 sm:line-clamp-none">
                          Drag English letters to match uppercase/lowercase or objects!
                        </p>
                      </div>

                      {/* Decorative cartoon circle inside */}
                      <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full group-hover:scale-150 transition-all duration-300 pointer-events-none" />
                    </button>

                    {/* 3. Number Trace */}
                    <button
                      onClick={() => {
                        playClickSound(settings.soundEnabled);
                        setActiveGame('number-trace');
                      }}
                      className="bg-[#6BCB77] text-white font-extrabold rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 md:p-5 border-3 sm:border-4 border-high-ink shadow-[0_4px_0_#2D3436] sm:shadow-[0_6px_0_#2D3436] hover:translate-y-[-2px] hover:shadow-[0_4px_0_#2D3436] sm:hover:shadow-[0_8px_0_#2D3436] active:translate-y-[2px] active:shadow-[0_1px_0_#2D3436] sm:active:shadow-[0_2px_0_#2D3436] transition-all text-left flex flex-col justify-between h-28 sm:h-38 md:h-48 group relative overflow-hidden"
                    >
                      {/* Top Row with Category Emoji & Badge */}
                      <div className="flex justify-between items-start w-full relative z-10">
                        <span className="text-lg sm:text-2xl md:text-3xl bg-white/20 backdrop-blur-sm w-7 h-7 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform font-black">
                          ✏️
                        </span>
                        
                        <span className="bg-black/10 text-[7px] sm:text-[10px] md:text-xs font-black uppercase py-0.5 px-1.5 sm:py-1 sm:px-2.5 md:px-3 rounded-full border border-black/5">
                          Draw ➔
                        </span>
                      </div>

                      {/* Bottom Row with Titles */}
                      <div className="relative z-10 w-full text-left">
                        <h3 className="text-[10px] sm:text-base md:text-xl lg:text-2xl tracking-wide font-black leading-tight filter drop-shadow-sm truncate">
                          Number Trace
                        </h3>
                        <p className="text-[8px] sm:text-xs font-semibold opacity-90 mt-0.5 sm:mt-1.5 tracking-wider line-clamp-2 sm:line-clamp-none">
                          Trace numbers 1 to 100 on screen to reveal spellings & pronounce!
                        </p>
                      </div>

                      {/* Decorative cartoon circle inside */}
                      <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full group-hover:scale-150 transition-all duration-300 pointer-events-none" />
                    </button>

                    {/* 4. Learn Math */}
                    <button
                      onClick={() => {
                        playClickSound(settings.soundEnabled);
                        setActiveGame('learn-math');
                      }}
                      className="bg-[#4D96FF] text-white font-extrabold rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 md:p-5 border-3 sm:border-4 border-high-ink shadow-[0_4px_0_#2D3436] sm:shadow-[0_6px_0_#2D3436] hover:translate-y-[-2px] hover:shadow-[0_4px_0_#2D3436] sm:hover:shadow-[0_8px_0_#2D3436] active:translate-y-[2px] active:shadow-[0_1px_0_#2D3436] sm:active:shadow-[0_2px_0_#2D3436] transition-all text-left flex flex-col justify-between h-28 sm:h-38 md:h-48 group relative overflow-hidden"
                    >
                      {/* Top Row with Category Emoji & Badge */}
                      <div className="flex justify-between items-start w-full relative z-10">
                        <span className="text-lg sm:text-2xl md:text-3xl bg-white/20 backdrop-blur-sm w-7 h-7 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform font-black">
                          ➕
                        </span>
                        
                        <span className="bg-black/10 text-[7px] sm:text-[10px] md:text-xs font-black uppercase py-0.5 px-1.5 sm:py-1 sm:px-2.5 md:px-3 rounded-full border border-black/5">
                          Play ➔
                        </span>
                      </div>

                      {/* Bottom Row with Titles */}
                      <div className="relative z-10 w-full text-left">
                        <h3 className="text-[10px] sm:text-base md:text-xl lg:text-2xl tracking-wide font-black leading-tight filter drop-shadow-sm truncate">
                          Learn Math
                        </h3>
                        <p className="text-[8px] sm:text-xs font-semibold opacity-90 mt-0.5 sm:mt-1.5 tracking-wider line-clamp-2 sm:line-clamp-none">
                          Addition & Subtraction with fun levels and colorful points!
                        </p>
                      </div>

                      {/* Decorative cartoon circle inside */}
                      <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full group-hover:scale-150 transition-all duration-300 pointer-events-none" />
                    </button>

                    {/* 5. Guess the Word */}
                    <button
                      onClick={() => {
                        playClickSound(settings.soundEnabled);
                        setActiveGame('guess-word');
                      }}
                      className="bg-[#9B5DE5] text-white font-extrabold rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 md:p-5 border-3 sm:border-4 border-high-ink shadow-[0_4px_0_#2D3436] sm:shadow-[0_6px_0_#2D3436] hover:translate-y-[-2px] hover:shadow-[0_4px_0_#2D3436] sm:hover:shadow-[0_8px_0_#2D3436] active:translate-y-[2px] active:shadow-[0_1px_0_#2D3436] sm:active:shadow-[0_2px_0_#2D3436] transition-all text-left flex flex-col justify-between h-28 sm:h-38 md:h-48 group relative overflow-hidden"
                    >
                      {/* Top Row with Category Emoji & Badge */}
                      <div className="flex justify-between items-start w-full relative z-10">
                        <span className="text-lg sm:text-2xl md:text-3xl bg-white/20 backdrop-blur-sm w-7 h-7 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform font-black">
                          🖼️
                        </span>
                        
                        <span className="bg-black/10 text-[7px] sm:text-[10px] md:text-xs font-black uppercase py-0.5 px-1.5 sm:py-1 sm:px-2.5 md:px-3 rounded-full border border-black/5">
                          Spell ➔
                        </span>
                      </div>

                      {/* Bottom Row with Titles */}
                      <div className="relative z-10 w-full text-left">
                        <h3 className="text-[10px] sm:text-base md:text-xl lg:text-2xl tracking-wide font-black leading-tight filter drop-shadow-sm truncate">
                          Guess the Word
                        </h3>
                        <p className="text-[8px] sm:text-xs font-semibold opacity-90 mt-0.5 sm:mt-1.5 tracking-wider line-clamp-2 sm:line-clamp-none">
                          Look at the picture, tap shuffled letters, and spell the word!
                        </p>
                      </div>

                      {/* Decorative cartoon circle inside */}
                      <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full group-hover:scale-150 transition-all duration-300 pointer-events-none" />
                    </button>
                  </>
                ) : (
                  <>
                    {/* 2. Gujarati Sound Match / Letter Match */}
                    <button
                      onClick={() => {
                        playClickSound(settings.soundEnabled);
                        setActiveGame('sound-match');
                      }}
                      className="bg-[#FFD93D] text-high-ink font-extrabold rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 md:p-5 border-3 sm:border-4 border-high-ink shadow-[0_4px_0_#2D3436] sm:shadow-[0_6px_0_#2D3436] hover:translate-y-[-2px] hover:shadow-[0_4px_0_#2D3436] sm:hover:shadow-[0_8px_0_#2D3436] active:translate-y-[2px] active:shadow-[0_1px_0_#2D3436] sm:active:shadow-[0_2px_0_#2D3436] transition-all text-left flex flex-col justify-between h-28 sm:h-38 md:h-48 group relative overflow-hidden"
                    >
                      {/* Top Row with Category Emoji & Badge */}
                      <div className="flex justify-between items-start w-full relative z-10">
                        <span className="text-lg sm:text-2xl md:text-3xl bg-white/40 backdrop-blur-sm w-7 h-7 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform font-black">
                          🔊
                        </span>
                        
                        <span className="bg-high-ink/10 text-[7px] sm:text-[10px] md:text-xs text-high-ink font-black uppercase py-0.5 px-1.5 sm:py-1 sm:px-2.5 md:px-3 rounded-full border border-high-ink/10">
                          રમો ➔
                        </span>
                      </div>

                      {/* Bottom Row with Titles */}
                      <div className="relative z-10 w-full flex flex-col items-center justify-center text-center">
                        <h3 className="text-xs sm:text-lg md:text-xl lg:text-2xl tracking-wide font-black leading-tight filter drop-shadow-sm text-center flex-wrap whitespace-normal break-words max-w-full">
                          અક્ષર મેળવો
                        </h3>
                        <p className="text-[9px] sm:text-xs font-semibold opacity-90 mt-0.5 sm:mt-1.5 tracking-wider text-center line-clamp-2">
                          અવાજ સાંભળીને સાચો અક્ષર ઓળખો!
                        </p>
                      </div>

                      {/* Decorative cartoon circle inside */}
                      <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full group-hover:scale-150 transition-all duration-300 pointer-events-none" />
                    </button>

                    {/* 3. Gujarati Number Trace */}
                    <button
                      onClick={() => {
                        playClickSound(settings.soundEnabled);
                        setActiveGame('guj-number-trace');
                      }}
                      className="bg-[#6BCB77] text-white font-extrabold rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 md:p-5 border-3 sm:border-4 border-high-ink shadow-[0_4px_0_#2D3436] sm:shadow-[0_6px_0_#2D3436] hover:translate-y-[-2px] hover:shadow-[0_4px_0_#2D3436] sm:hover:shadow-[0_8px_0_#2D3436] active:translate-y-[2px] active:shadow-[0_2px_0_#2D3436] transition-all text-left flex flex-col justify-between h-28 sm:h-38 md:h-48 group relative overflow-hidden"
                    >
                      {/* Top Row with Category Emoji & Badge */}
                      <div className="flex justify-between items-start w-full relative z-10">
                        <span className="text-lg sm:text-2xl md:text-3xl bg-white/20 backdrop-blur-sm w-7 h-7 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform font-black">
                          ✏️
                        </span>
                        
                        <span className="bg-black/10 text-[7px] sm:text-[10px] md:text-xs font-black uppercase py-0.5 px-1.5 sm:py-1 sm:px-2.5 md:px-3 rounded-full border border-black/5">
                          લખો ➔
                        </span>
                      </div>

                      {/* Bottom Row with Titles */}
                      <div className="relative z-10 w-full flex flex-col items-center justify-center text-center">
                        <h3 className="text-xs sm:text-lg md:text-xl lg:text-2xl tracking-wide font-black leading-tight filter drop-shadow-sm text-center flex-wrap whitespace-normal break-words max-w-full">
                          અંક લખતા શીખો
                        </h3>
                        <p className="text-[9px] sm:text-xs font-semibold opacity-90 mt-0.5 sm:mt-1.5 tracking-wider text-center line-clamp-2">
                          ગુજરાતી અંકો ૦ થી ૯ લખવાની મજા લો!
                        </p>
                      </div>

                      {/* Decorative cartoon circle inside */}
                      <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full group-hover:scale-150 transition-all duration-300 pointer-events-none" />
                    </button>

                    {/* 4. અંક મેળવો / ગણિત */}
                    <button
                      onClick={() => {
                        playClickSound(settings.soundEnabled);
                        setActiveGame('learn-math');
                      }}
                      className="bg-[#4D96FF] text-white font-extrabold rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 md:p-5 border-3 sm:border-4 border-high-ink shadow-[0_4px_0_#2D3436] sm:shadow-[0_6px_0_#2D3436] hover:translate-y-[-2px] hover:shadow-[0_4px_0_#2D3436] sm:hover:shadow-[0_8px_0_#2D3436] active:translate-y-[2px] active:shadow-[0_2px_0_#2D3436] transition-all text-left flex flex-col justify-between h-28 sm:h-38 md:h-48 group relative overflow-hidden"
                    >
                      {/* Top Row with Category Emoji & Badge */}
                      <div className="flex justify-between items-start w-full relative z-10">
                        <span className="text-lg sm:text-2xl md:text-3xl bg-white/20 backdrop-blur-sm w-7 h-7 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform font-black">
                          ➕
                        </span>
                        
                        <span className="bg-black/10 text-[7px] sm:text-[10px] md:text-xs font-black uppercase py-0.5 px-1.5 sm:py-1 sm:px-2.5 md:px-3 rounded-full border border-black/5">
                          ગણો ➔
                        </span>
                      </div>

                      {/* Bottom Row with Titles */}
                      <div className="relative z-10 w-full flex flex-col items-center justify-center text-center">
                        <h3 className="text-xs sm:text-lg md:text-xl lg:text-2xl tracking-wide font-black leading-tight filter drop-shadow-sm text-center flex-wrap whitespace-normal break-words max-w-full">
                          અંક મેળવો
                        </h3>
                        <p className="text-[9px] sm:text-xs font-semibold opacity-90 mt-0.5 sm:mt-1.5 tracking-wider text-center line-clamp-2">
                          સરળ સરવાળો અને બાદબાકી મજેદાર રીતે શીખો!
                        </p>
                      </div>

                      {/* Decorative cartoon circle inside */}
                      <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full group-hover:scale-150 transition-all duration-300 pointer-events-none" />
                    </button>

                    {/* 5. શબ્દ ઓળખો */}
                    <button
                      onClick={() => {
                        playClickSound(settings.soundEnabled);
                        setActiveGame('guess-word');
                      }}
                      className="bg-[#9B5DE5] text-white font-extrabold rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 md:p-5 border-3 sm:border-4 border-high-ink shadow-[0_4px_0_#2D3436] sm:shadow-[0_6px_0_#2D3436] hover:translate-y-[-2px] hover:shadow-[0_4px_0_#2D3436] sm:hover:shadow-[0_8px_0_#2D3436] active:translate-y-[2px] active:shadow-[0_2px_0_#2D3436] transition-all text-left flex flex-col justify-between h-28 sm:h-38 md:h-48 group relative overflow-hidden"
                    >
                      {/* Top Row with Category Emoji & Badge */}
                      <div className="flex justify-between items-start w-full relative z-10">
                        <span className="text-lg sm:text-2xl md:text-3xl bg-white/20 backdrop-blur-sm w-7 h-7 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform font-black">
                          🖼️
                        </span>
                        
                        <span className="bg-black/10 text-[7px] sm:text-[10px] md:text-xs font-black uppercase py-0.5 px-1.5 sm:py-1 sm:px-2.5 md:px-3 rounded-full border border-black/5">
                          શોધો ➔
                        </span>
                      </div>

                      {/* Bottom Row with Titles */}
                      <div className="relative z-10 w-full flex flex-col items-center justify-center text-center">
                        <h3 className="text-xs sm:text-lg md:text-xl lg:text-2xl tracking-wide font-black leading-tight filter drop-shadow-sm text-center flex-wrap whitespace-normal break-words max-w-full">
                          શબ્દ ઓળખો
                        </h3>
                        <p className="text-[9px] sm:text-xs font-semibold opacity-90 mt-0.5 sm:mt-1.5 tracking-wider text-center line-clamp-2">
                          ચિત્ર જુઓ, અક્ષરો ગોઠવીને સાચો શબ્દ બનાવો!
                        </p>
                      </div>

                      {/* Decorative cartoon circle inside */}
                      <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full group-hover:scale-150 transition-all duration-300 pointer-events-none" />
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {activeGame === 'letter-match' && (
            <LetterMatchGame settings={settings} />
          )}

          {activeGame === 'sound-match' && (
            <GujaratiSoundMatchGame settings={settings} />
          )}

          {activeGame === 'number-trace' && (
            <NumberTraceGame settings={settings} />
          )}

          {activeGame === 'guj-number-trace' && (
            <GujaratiNumberTraceGame settings={settings} />
          )}

          {activeGame === 'learn-math' && (
            <LearnMathGame settings={settings} activeTab={activeTab} />
          )}

          {activeGame === 'guess-word' && (
            <GuessWordGame settings={settings} activeTab={activeTab} />
          )}
        </AnimatePresence>
      </main>

      {/* Decorative footer message */}
      <footer className="text-center font-bold text-slate-400 dark:text-slate-500 text-xs py-1 select-none">
        🎮 Play, Learn, and Collect Stars! • રમો અને તારા મેળવો! ⭐
      </footer>
    </div>
  );
}

/* ==========================================
   1. LETTER MATCH GAME COMPONENT (Pointer Drag & Drop)
   ========================================== */
function LetterMatchGame({ settings }: { settings: AppSettings }) {
  const [levelType, setLevelType] = useState<'case' | 'picture'>('case');
  const [score, setScore] = useState(0);
  const [pairs, setPairs] = useState<any[]>([]);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [celebrating, setCelebrating] = useState(false);

  // Pointer drag positions
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const startPointerPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Generate levels
  const generateLevel = (type: 'case' | 'picture') => {
    // Pick 3 random letters from English Alphabet
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const shuffled = [...alphabet].sort(() => 0.5 - Math.random());
    const selectedLetters = shuffled.slice(0, 3);

    const leftCards = selectedLetters.map(letter => ({
      id: `left-${letter}`,
      value: letter,
      side: 'left'
    }));

    const rightCards = selectedLetters.map(letter => {
      let value = '';
      if (type === 'case') {
        value = letter.toLowerCase();
      } else {
        // Find picture for this letter in ENGLISH_WORDS
        const wordItem = ENGLISH_WORDS.find(w => w.letter === letter);
        value = wordItem ? `${wordItem.emoji} ${wordItem.word}` : `${letter} Word`;
      }
      return {
        id: `right-${letter}`,
        matchingLetter: letter,
        value: value,
        side: 'right'
      };
    });

    // Shuffle right cards to randomize placement
    const shuffledRight = [...rightCards].sort(() => 0.5 - Math.random());

    setPairs(leftCards.map((lc, i) => ({
      left: lc,
      right: shuffledRight[i]
    })));

    setMatchedIds([]);
    setCelebrating(false);
    setDraggedId(null);
    setDragOffset({ x: 0, y: 0 });
  };

  useEffect(() => {
    generateLevel(levelType);
  }, [levelType]);

  // Pointer event handlers for custom Drag & Drop
  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>, id: string, value: string) => {
    if (matchedIds.includes(id)) return;
    
    e.currentTarget.setPointerCapture(e.pointerId);
    startPointerPos.current = { x: e.clientX, y: e.clientY };
    setDraggedId(id);
    setDragOffset({ x: 0, y: 0 });

    playClickSound(settings.soundEnabled);
    speakText(value, 'en', settings.englishVoiceURI, settings.soundEnabled);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (draggedId !== e.currentTarget.id) return;
    const dx = e.clientX - startPointerPos.current.x;
    const dy = e.clientY - startPointerPos.current.y;
    setDragOffset({ x: dx, y: dy });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>, matchingLetter: string) => {
    if (draggedId !== e.currentTarget.id) return;
    e.currentTarget.releasePointerCapture(e.pointerId);

    const clientX = e.clientX;
    const clientY = e.clientY;

    // Detect target element
    let dropTargetId: string | null = null;
    if (document.elementsFromPoint) {
      const elements = document.elementsFromPoint(clientX, clientY);
      for (const el of elements) {
        const targetId = el.getAttribute('data-target-id');
        if (targetId) {
          dropTargetId = targetId;
          break;
        }
      }
    } else if (document.elementFromPoint) {
      const topEl = document.elementFromPoint(clientX, clientY);
      let curr = topEl as HTMLElement | null;
      while (curr) {
        const targetId = curr.getAttribute('data-target-id');
        if (targetId) {
          dropTargetId = targetId;
          break;
        }
        curr = curr.parentElement;
      }
    }

    if (dropTargetId) {
      const targetLetter = dropTargetId.replace('right-', '');
      if (matchingLetter === targetLetter) {
        // MATCH SUCCESS!
        const pair = pairs.find(p => p.left.value === matchingLetter);
        const speakTextVal = pair ? pair.right.value : matchingLetter;
        
        playSuccessSound(settings.soundEnabled);
        speakText(`Correct! ${matchingLetter} is for ${speakTextVal}`, 'en', settings.englishVoiceURI, settings.soundEnabled);

        const newMatched = [...matchedIds, `left-${matchingLetter}`, `right-${matchingLetter}`];
        setMatchedIds(newMatched);

        if (newMatched.length === 6) {
          setScore(prev => prev + 1);
          setCelebrating(true);
          confetti({
            particleCount: 60,
            spread: 50,
            origin: { y: 0.6 }
          });
        }
      } else {
        // WRONG DROP TARGET
        playErrorSound(settings.soundEnabled);
      }
    } else {
      // RELEASED OUTSIDE
      playClickSound(settings.soundEnabled);
    }

    setDraggedId(null);
    setDragOffset({ x: 0, y: 0 });
  };

  return (
    <div className="w-full h-full flex flex-col justify-between items-center py-2 select-none">
      {/* Top control selectors */}
      <div className="flex gap-3 mb-4 bg-slate-100 dark:bg-slate-700 p-1.5 rounded-2xl border-4 border-high-ink shadow-[0_4px_0_#2D3436]">
        <button
          onClick={() => {
            playClickSound(settings.soundEnabled);
            setLevelType('case');
          }}
          className={`font-black px-4 py-2 rounded-xl text-xs sm:text-sm uppercase transition-all cursor-pointer ${
            levelType === 'case'
              ? 'bg-[#FF6B6B] text-white border-3 border-high-ink shadow-[0_3px_0_#2D3436]'
              : 'text-slate-500 hover:text-high-ink dark:text-slate-300'
          }`}
        >
          🔤 Capital ➔ Small
        </button>
        <button
          onClick={() => {
            playClickSound(settings.soundEnabled);
            setLevelType('picture');
          }}
          className={`font-black px-4 py-2 rounded-xl text-xs sm:text-sm uppercase transition-all cursor-pointer ${
            levelType === 'picture'
              ? 'bg-[#4D96FF] text-white border-3 border-high-ink shadow-[0_3px_0_#2D3436]'
              : 'text-slate-500 hover:text-high-ink dark:text-slate-300'
          }`}
        >
          🍎 Letter ➔ Picture
        </button>
      </div>

      <div className="w-full flex-1 flex flex-col justify-center items-center max-w-2xl px-2">
        <p className="text-xs sm:text-sm font-black text-slate-500 dark:text-slate-300 uppercase tracking-widest mb-4 text-center">
          👇 Touch and Drag a letter from the left into its matching slot on the right! 🎨
        </p>

        {/* Matching rows */}
        <div className="grid grid-cols-2 gap-x-12 gap-y-4 w-full relative">
          {/* Left Column (Source cards - Draggable) */}
          <div className="flex flex-col gap-4 relative z-20">
            <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase text-center block mb-1">Letters</span>
            {pairs.map((p) => {
              const lc = p.left;
              const isMatched = matchedIds.includes(lc.id);
              const isDragging = draggedId === lc.id;

              return (
                <motion.button
                  key={lc.id}
                  id={lc.id}
                  onPointerDown={(e) => handlePointerDown(e, lc.id, lc.value)}
                  onPointerMove={handlePointerMove}
                  onPointerUp={(e) => handlePointerUp(e, lc.value)}
                  className={`h-24 sm:h-28 rounded-3xl border-4 border-high-ink flex items-center justify-center text-4xl sm:text-5xl font-black shadow-[0_6px_0_#2D3436] transition-all relative overflow-hidden select-none cursor-grab active:cursor-grabbing ${
                    isMatched 
                      ? 'bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-300 border-green-500 shadow-none translate-y-[6px] pointer-events-none' 
                      : isDragging 
                        ? 'bg-[#FFD93D] text-high-ink ring-4 ring-[#FF6B6B] z-50 shadow-none' 
                        : 'bg-white dark:bg-slate-700 text-high-ink dark:text-white'
                  }`}
                  style={{
                    transform: isDragging 
                      ? `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0px) scale(1.08)` 
                      : 'translate3d(0px, 0px, 0px)',
                    zIndex: isDragging ? 50 : 10,
                    transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    touchAction: 'none' // Essential touch override to allow vertical/horizontal drag
                  }}
                >
                  {lc.value}
                  {isMatched && (
                    <span className="absolute bottom-1 right-1 bg-green-500 border-2 border-high-ink p-1 rounded-full text-white text-xs">
                      <Check className="w-3.5 h-3.5 stroke-[4]" />
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Right Column (Target cards - Drop zones) */}
          <div className="flex flex-col gap-4 relative z-10">
            <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase text-center block mb-1">Answers</span>
            {pairs.map((p) => {
              const rc = p.right;
              const isMatched = matchedIds.includes(rc.id);

              return (
                <div
                  key={rc.id}
                  data-target-id={rc.id}
                  className={`h-24 sm:h-28 rounded-3xl border-4 border-high-ink flex items-center justify-center text-lg sm:text-2xl font-black transition-all relative overflow-hidden select-none ${
                    isMatched 
                      ? 'bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-300 border-green-500 translate-y-[6px] shadow-none border-dashed' 
                      : 'bg-white dark:bg-slate-700 text-high-ink dark:text-white shadow-[0_6px_0_#2D3436]'
                  }`}
                >
                  {rc.value}
                  {isMatched && (
                    <span className="absolute bottom-1 right-1 bg-green-500 border-2 border-high-ink p-1 rounded-full text-white text-xs">
                      <Check className="w-3.5 h-3.5 stroke-[4]" />
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Level Complete Celebrating Modal */}
      {celebrating && (
        <div className="absolute inset-0 bg-white/95 dark:bg-slate-800/95 flex flex-col justify-center items-center p-6 z-40">
          <span className="text-5xl animate-bounce">🌟 Awesome Match! 🌟</span>
          <p className="text-xl font-black text-green-500 mt-2 uppercase tracking-wide text-center">
            You matched all English pairs correctly!
          </p>
          
          <button
            onClick={() => generateLevel(levelType)}
            className="mt-6 bg-[#6BCB77] hover:bg-[#5bba67] text-white font-black py-3 px-8 rounded-2xl border-4 border-high-ink shadow-[0_4px_0_#2D3436] hover:translate-y-[-2px] hover:shadow-[0_6px_0_#2D3436] active:translate-y-[2px] active:shadow-[0_2px_0_#2D3436] transition-all text-lg flex items-center gap-2 cursor-pointer"
          >
            <span>Play Next Level ➔</span>
          </button>
        </div>
      )}

      {/* Score and Reset footer */}
      <div className="w-full flex justify-between items-center border-t-2 border-slate-100 dark:border-slate-700 pt-3">
        <span className="text-sm font-black text-high-ink dark:text-white bg-amber-100 dark:bg-amber-950 px-3 py-1.5 rounded-xl border-2 border-high-ink shadow-[0_2px_0_#2D3436]">
          Score: {score} ⭐
        </span>

        <button
          onClick={() => {
            playClickSound(settings.soundEnabled);
            generateLevel(levelType);
          }}
          className="bg-white hover:bg-slate-50 text-high-ink text-xs font-black p-2 rounded-xl border-2 border-high-ink shadow-[0_2px_0_#2D3436] flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>New Game</span>
        </button>
      </div>
    </div>
  );
}

/* ==========================================
   2. GUJARATI SOUND MATCH GAME COMPONENT (Letters / Barakhadi)
   ========================================== */
const BARAKHADI_MODIFIERS = [
  { suffix: 'ા', name: 'આ', soundHint: 'aa' },
  { suffix: 'િ', name: 'ઇ', soundHint: 'i' },
  { suffix: 'ી', name: 'ઈ', soundHint: 'ee' },
  { suffix: 'ુ', name: 'ઉ', soundHint: 'u' },
  { suffix: 'ૂ', name: 'ઊ', soundHint: 'oo' },
  { suffix: 'ે', name: 'એ', soundHint: 'e' },
  { suffix: 'ૈ', name: 'ઐ', soundHint: 'ai' },
  { suffix: 'ો', name: 'ઓ', soundHint: 'o' },
  { suffix: 'ૌ', name: 'ઔ', soundHint: 'au' },
  { suffix: 'ં', name: 'અં', soundHint: 'am' },
  { suffix: 'ઃ', name: 'અઃ', soundHint: 'aha' },
];

const BASE_CONSONANTS = [
  'ક', 'ખ', 'ગ', 'ચ', 'જ', 'ત', 'દ', 'ન', 'પ', 'બ', 'મ', 'ર', 'લ', 'વ', 'સ', 'હ'
];

function GujaratiSoundMatchGame({ settings }: { settings: AppSettings }) {
  const [gameMode, setGameMode] = useState<'letters' | 'barakhadi'>('letters');
  const [score, setScore] = useState(0);
  const [celebrating, setCelebrating] = useState(false);
  const [currentSymbol, setCurrentSymbol] = useState<string>('');
  const [options, setOptions] = useState<string[]>([]);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<boolean | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hintVisible, setHintVisible] = useState(false);
  const [hintText, setHintText] = useState('');

  const generateTurn = (mode: 'letters' | 'barakhadi' = gameMode) => {
    setHintVisible(false);
    
    if (mode === 'letters') {
      // Combine consonants & vowels characters
      const gujPool = [
        ...GUJARATI_CONSONANTS.map(c => c.char), 
        ...GUJARATI_VOWELS.map(v => v.char)
      ];
      const shuffled = [...gujPool].sort(() => 0.5 - Math.random());
      
      const correct = shuffled[0];
      const distractors = shuffled.slice(1, 4);
      const optionList = [correct, ...distractors].sort(() => 0.5 - Math.random());

      setCurrentSymbol(correct);
      setOptions(optionList);
      
      // Setup hint text
      const consonantObj = GUJARATI_CONSONANTS.find(c => c.char === correct);
      const vowelObj = GUJARATI_VOWELS.find(v => v.char === correct);
      if (consonantObj) {
        setHintText(`Phonetic: ${consonantObj.phonetic} (${consonantObj.word} ${consonantObj.emoji})`);
      } else if (vowelObj) {
        setHintText(`Phonetic: ${vowelObj.phonetic} (${vowelObj.word} ${vowelObj.emoji})`);
      } else {
        setHintText(`Phonetic: ${correct}`);
      }
    } else {
      // Barakhadi Mode: Pick Consonant + Modifier
      const randConsonent = BASE_CONSONANTS[Math.floor(Math.random() * BASE_CONSONANTS.length)];
      const randModifier = BARAKHADI_MODIFIERS[Math.floor(Math.random() * BARAKHADI_MODIFIERS.length)];
      
      const correct = `${randConsonent}${randModifier.suffix}`;
      
      // Generate educational distractors:
      // 1. Same consonant, different modifier suffix
      const diffMod = BARAKHADI_MODIFIERS.find(m => m.suffix !== randModifier.suffix) || BARAKHADI_MODIFIERS[0];
      const distractor1 = `${randConsonent}${diffMod.suffix}`;
      
      // 2. Different consonant, same modifier suffix
      const diffCons = BASE_CONSONANTS.find(c => c !== randConsonent) || BASE_CONSONANTS[0];
      const distractor2 = `${diffCons}${randModifier.suffix}`;
      
      // 3. Fully random barakhadi consonant + modifier
      const rCons = BASE_CONSONANTS.filter(c => c !== randConsonent)[Math.floor(Math.random() * (BASE_CONSONANTS.length - 1))];
      const rMod = BARAKHADI_MODIFIERS.filter(m => m.suffix !== randModifier.suffix)[Math.floor(Math.random() * (BARAKHADI_MODIFIERS.length - 1))];
      const distractor3 = `${rCons}${rMod.suffix}`;

      const optionList = [correct, distractor1, distractor2, distractor3].sort(() => 0.5 - Math.random());
      
      setCurrentSymbol(correct);
      setOptions(optionList);
      setHintText(`Sounds like: ${randConsonent} + '${randModifier.soundHint}'`);
    }

    setAnsweredCorrectly(null);
    setSelectedOption(null);
    setCelebrating(false);
  };

  // Autoplay audio on new level
  useEffect(() => {
    generateTurn(gameMode);
  }, [gameMode]);

  const handleSpeak = () => {
    playClickSound(settings.soundEnabled);
    if (currentSymbol) {
      speakText(currentSymbol, 'gu', settings.gujaratiVoiceURI, settings.soundEnabled);
    }
  };

  // Trigger speak automatically on load
  useEffect(() => {
    if (currentSymbol) {
      const timer = setTimeout(() => {
        speakText(currentSymbol, 'gu', settings.gujaratiVoiceURI, settings.soundEnabled);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentSymbol]);

  const handleOptionClick = (option: string) => {
    if (answeredCorrectly) return;
    setSelectedOption(option);
    
    if (option === currentSymbol) {
      setAnsweredCorrectly(true);
      playSuccessSound(settings.soundEnabled);
      speakText(`સાચું! આ '${currentSymbol}' છે.`, 'gu', settings.gujaratiVoiceURI, settings.soundEnabled);
      setScore(prev => prev + 1);
      
      confetti({
        particleCount: 45,
        spread: 35,
        origin: { y: 0.6 }
      });

      setTimeout(() => {
        setCelebrating(true);
      }, 1000);
    } else {
      setAnsweredCorrectly(false);
      playErrorSound(settings.soundEnabled);
      
      // Let them try again
      setTimeout(() => {
        setAnsweredCorrectly(null);
        setSelectedOption(null);
      }, 850);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between items-center py-2 relative select-none">
      {/* Top control selectors */}
      <div className="flex gap-3 mb-4 bg-slate-100 dark:bg-slate-700 p-1.5 rounded-2xl border-4 border-high-ink shadow-[0_4px_0_#2D3436]">
        <button
          onClick={() => {
            playClickSound(settings.soundEnabled);
            setGameMode('letters');
          }}
          className={`font-black px-4 py-2 rounded-xl text-xs sm:text-sm uppercase transition-all cursor-pointer ${
            gameMode === 'letters'
              ? 'bg-[#FFD93D] text-high-ink border-3 border-high-ink shadow-[0_3px_0_#2D3436]'
              : 'text-slate-500 hover:text-high-ink dark:text-slate-300'
          }`}
        >
          🔊 Letters & Vowels
        </button>
        <button
          onClick={() => {
            playClickSound(settings.soundEnabled);
            setGameMode('barakhadi');
          }}
          className={`font-black px-4 py-2 rounded-xl text-xs sm:text-sm uppercase transition-all cursor-pointer ${
            gameMode === 'barakhadi'
              ? 'bg-[#FF9F43] text-white border-3 border-high-ink shadow-[0_3px_0_#2D3436]'
              : 'text-slate-500 hover:text-high-ink dark:text-slate-300'
          }`}
        >
          🎶 Barakhadi Combinations
        </button>
      </div>

      <div className="w-full flex-1 flex flex-col justify-center items-center">
        {/* Playful prompt */}
        <p className="text-xs sm:text-sm font-black text-slate-500 dark:text-slate-300 uppercase tracking-widest text-center mb-4 px-4 leading-relaxed">
          Tap the Speaker, listen closely, and select the matching Gujarati symbol! 🔊
        </p>

        {/* Central Speaker play card */}
        <div className="flex items-center gap-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSpeak}
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-[2.5rem] bg-[#FFD93D] hover:bg-[#ffe26b] border-4 border-high-ink shadow-[0_8px_0_#2D3436] flex flex-col items-center justify-center gap-1 cursor-pointer select-none group"
          >
            <Volume2 className="w-10 h-10 sm:w-12 sm:h-12 text-high-ink group-hover:scale-110 transition-transform stroke-[2.5]" />
            <span className="font-black text-[10px] uppercase tracking-wider text-high-ink">Listen • સાંભળો</span>
          </motion.button>

          {/* Help Hint trigger */}
          <button
            onClick={() => {
              playClickSound(settings.soundEnabled);
              setHintVisible(!hintVisible);
            }}
            className={`w-14 h-14 rounded-2xl border-3 border-high-ink flex items-center justify-center font-black transition-all cursor-pointer shadow-[0_4px_0_#2D3436] active:translate-y-[2px] active:shadow-[0_1px_0_#2D3436] ${
              hintVisible 
                ? 'bg-[#FF6B6B] text-white' 
                : 'bg-white dark:bg-slate-700 text-high-ink dark:text-white'
            }`}
            title="Show Hint"
          >
            <HelpCircle className="w-7 h-7 stroke-[2.5]" />
          </button>
        </div>

        {/* Dynamic Help Hint Text */}
        <AnimatePresence>
          {hintVisible && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-sky-100 dark:bg-slate-700/60 border-2 border-high-ink rounded-2xl p-2.5 px-4 mb-5 text-center text-xs sm:text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider"
            >
              💡 {hintText}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Options grid */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-md px-2">
          {options.map((opt) => {
            const isSelected = selectedOption === opt;
            const isCorrect = opt === currentSymbol;
            
            let btnClass = 'bg-white dark:bg-slate-700 text-high-ink dark:text-white';
            if (isSelected) {
              if (isCorrect) {
                btnClass = 'bg-[#6BCB77] text-white ring-4 ring-[#2D3436]';
              } else {
                btnClass = 'bg-[#FF6B6B] text-white ring-4 ring-[#2D3436]';
              }
            }

            return (
              <motion.button
                key={opt}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleOptionClick(opt)}
                className={`h-20 sm:h-24 rounded-3xl border-4 border-high-ink flex items-center justify-center text-3xl sm:text-4xl font-extrabold shadow-[0_6px_0_#2D3436] transition-all cursor-pointer ${btnClass}`}
              >
                {opt}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Celebrating turnaround overlay */}
      {celebrating && (
        <div className="absolute inset-0 bg-white/95 dark:bg-slate-800/95 flex flex-col justify-center items-center p-6 z-40">
          <span className="text-5xl animate-bounce">✨ સાચું ઉત્તર! ✨</span>
          <p className="text-xl font-black text-[#6BCB77] mt-2 uppercase tracking-wide text-center">
            Excellent! You solved the Gujarati Sound match!
          </p>
          
          <button
            onClick={() => generateTurn(gameMode)}
            className="mt-6 bg-[#6BCB77] hover:bg-[#5bba67] text-white font-black py-3 px-8 rounded-2xl border-4 border-high-ink shadow-[0_4px_0_#2D3436] hover:translate-y-[-2px] hover:shadow-[0_6px_0_#2D3436] active:translate-y-[2px] active:shadow-[0_2px_0_#2D3436] transition-all text-lg flex items-center gap-2 cursor-pointer"
          >
            <span>Next Round ➔</span>
          </button>
        </div>
      )}

      {/* Footer controls */}
      <div className="w-full flex justify-between items-center border-t-2 border-slate-100 dark:border-slate-700 pt-3">
        <span className="text-sm font-black text-high-ink dark:text-white bg-[#FFD93D] px-3 py-1.5 rounded-xl border-2 border-high-ink shadow-[0_2px_0_#2D3436]">
          Score: {toGujaratiNumberString(score)} ⭐
        </span>

        <button
          onClick={() => {
            playClickSound(settings.soundEnabled);
            generateTurn(gameMode);
          }}
          className="bg-white hover:bg-slate-50 text-high-ink text-xs font-black p-2 rounded-xl border-2 border-high-ink shadow-[0_2px_0_#2D3436] flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>નવી રમત</span>
        </button>
      </div>
    </div>
  );
}

/* ==========================================
   3. NUMBER TRACE GAME COMPONENT (1-100 Tracing Sandbox)
   ========================================== */
function NumberTraceGame({ settings }: { settings: AppSettings }) {
  const [currentNum, setCurrentNum] = useState<number>(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tracePercentage, setTracePercentage] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [isGridModalOpen, setIsGridModalOpen] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointsDrawnRef = useRef<{ x: number; y: number }[]>([]);

  // Pronunciation speaker TTS
  const playPronunciation = () => {
    const englishSpelling = getEnglishNumberSpelling(currentNum);
    const gujSpelling = getGujSpelling(currentNum);

    // Speak English spelling
    speakText(`${currentNum}, ${englishSpelling}`, 'en', settings.englishVoiceURI, settings.soundEnabled);
    
    // Speak Gujarati spelling with a comfortable gap
    setTimeout(() => {
      speakText(gujSpelling, 'gu', settings.gujaratiVoiceURI, settings.soundEnabled);
    }, 1100);
  };

  // Reset drawing canvas
  const handleResetTrace = () => {
    setTracePercentage(0);
    setRevealed(false);
    pointsDrawnRef.current = [];
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  // Handle number change
  const handleNumChange = (newNum: number) => {
    if (newNum < 1 || newNum > 100) return;
    playClickSound(settings.soundEnabled);
    setCurrentNum(newNum);
    handleResetTrace();
  };

  // Quick select grid selector handler
  const handleSelectNumberGrid = (num: number) => {
    setIsGridModalOpen(false);
    setCurrentNum(num);
    handleResetTrace();
  };

  // Adjust canvas coordinates on load/number change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    handleResetTrace();
  }, [currentNum]);

  // Tracing handlers (supporting touch + mouse)
  const getCoordinates = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const handleStartDraw = (e: any) => {
    e.preventDefault();
    setIsDrawing(true);
    const coords = getCoordinates(e);
    drawSegment(coords.x, coords.y, true);
  };

  const handleDraw = (e: any) => {
    if (!isDrawing) return;
    e.preventDefault();
    const coords = getCoordinates(e);
    drawSegment(coords.x, coords.y, false);
  };

  const handleStopDraw = () => {
    setIsDrawing(false);
  };

  const drawSegment = (x: number, y: number, isNewStroke: boolean) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Colorful rainbow sparkly glowing brush specs
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    const colors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#B10DC9', '#FF9F43'];
    ctx.strokeStyle = colors[Math.floor(Math.random() * colors.length)];
    ctx.shadowColor = ctx.strokeStyle;
    ctx.shadowBlur = 8;

    if (isNewStroke) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else {
      const prevPoint = pointsDrawnRef.current[pointsDrawnRef.current.length - 1];
      if (prevPoint) {
        ctx.beginPath();
        ctx.moveTo(prevPoint.x, prevPoint.y);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    }

    pointsDrawnRef.current.push({ x, y });

    // Interactive Tracing Feedback calculation based on bounding-box + point density coverage
    const pointsCount = pointsDrawnRef.current.length;
    
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    pointsDrawnRef.current.forEach(p => {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    });

    const drawWidth = maxX - minX;
    const drawHeight = maxY - minY;
    
    const wRatio = Math.min(drawWidth / (canvas.width * 0.42), 1);
    const hRatio = Math.min(drawHeight / (canvas.height * 0.42), 1);
    const densityProgress = Math.min(pointsCount / 24, 1);

    const calculatedPercentage = Math.round(
      (densityProgress * 40) + (wRatio * 30) + (hRatio * 30)
    );

    setTracePercentage(Math.min(calculatedPercentage, 100));

    if (calculatedPercentage >= 100 && !revealed) {
      setTracePercentage(100);
      setRevealed(true);
      playSuccessSound(settings.soundEnabled);
      playPronunciation();
      confetti({
        particleCount: 50,
        spread: 35,
        origin: { y: 0.65 }
      });
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between items-center py-1 relative select-none">
      {/* Dynamic top control row */}
      <div className="flex justify-between items-center w-full gap-2 mb-2">
        <button
          onClick={() => handleNumChange(currentNum - 1)}
          disabled={currentNum <= 1}
          className="bg-white hover:bg-slate-50 dark:bg-slate-800 text-high-ink dark:text-white disabled:opacity-30 disabled:pointer-events-none font-black px-3.5 py-2 rounded-xl border-2 border-high-ink shadow-[0_2px_0_#2D3436] cursor-pointer text-xs flex items-center gap-1 transition-all"
        >
          <span>◀ Back</span>
        </button>

        {/* Big styled center numeral selector display */}
        <div className="flex items-center gap-2">
          <span className="text-lg sm:text-2xl font-black text-high-ink dark:text-white bg-amber-100 dark:bg-amber-950 px-4 py-1.5 rounded-2xl border-4 border-high-ink shadow-[0_4px_0_#2D3436] flex items-center gap-2">
            <span>{currentNum}</span>
            <span className="text-slate-400 dark:text-slate-400 font-extrabold">•</span>
            <span>{toGujaratiNumberString(currentNum)}</span>
          </span>
          
          <button
            onClick={() => {
              playClickSound(settings.soundEnabled);
              setIsGridModalOpen(true);
            }}
            className="w-11 h-11 bg-white dark:bg-slate-800 text-high-ink dark:text-white border-3 border-high-ink rounded-xl shadow-[0_3px_0_#2D3436] flex items-center justify-center hover:translate-y-[-1px] hover:shadow-[0_4px_0_#2D3436] active:translate-y-[1px] active:shadow-[0_1.5px_0_#2D3436] transition-all cursor-pointer"
            title="Choose number 1-100"
          >
            <Grid className="w-5.5 h-5.5 stroke-[3]" />
          </button>
        </div>

        <button
          onClick={() => handleNumChange(currentNum + 1)}
          disabled={currentNum >= 100}
          className="bg-white hover:bg-slate-50 dark:bg-slate-800 text-high-ink dark:text-white disabled:opacity-30 disabled:pointer-events-none font-black px-3.5 py-2 rounded-xl border-2 border-high-ink shadow-[0_2px_0_#2D3436] cursor-pointer text-xs flex items-center gap-1 transition-all"
        >
          <span>Next ▶</span>
        </button>
      </div>

      <p className="text-[10px] sm:text-xs font-black text-slate-500 dark:text-slate-300 uppercase tracking-widest text-center mb-2 leading-tight">
        ✏️ Trace the dotted number with your finger or mouse! ✏️
      </p>

      {/* Tracing Sandbox Canvas Area */}
      <div className="flex-1 w-full max-w-sm relative flex items-center justify-center bg-[#2D3436] rounded-[2rem] border-6 border-high-ink p-1 min-h-[220px] overflow-hidden shadow-inner">
        {/* Chalkboard dotted numeral background */}
        <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none opacity-20">
          <span className="text-[11rem] md:text-[14rem] font-bold text-white select-none border-spacing-2 select-none font-sans font-black select-none pointer-events-none select-none select-none tracking-tighter">
            {currentNum}
          </span>
        </div>

        {/* Tracing canvas layer */}
        <canvas
          ref={canvasRef}
          onMouseDown={handleStartDraw}
          onMouseMove={handleDraw}
          onMouseUp={handleStopDraw}
          onMouseLeave={handleStopDraw}
          onTouchStart={handleStartDraw}
          onTouchMove={handleDraw}
          onTouchEnd={handleStopDraw}
          className="absolute inset-0 w-full h-full cursor-crosshair touch-none z-10"
        />

        {/* Tracing success overlay */}
        <AnimatePresence>
          {revealed && (
            <motion.div 
              initial={{ scale: 0.82, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.82, opacity: 0 }}
              className="absolute inset-0 bg-white/95 dark:bg-slate-800/95 flex flex-col justify-center items-center p-4 z-20 rounded-[1.6rem] text-center"
            >
              <Sparkles className="w-10 h-10 text-[#FFD93D] animate-bounce mb-1" />
              
              <h2 className="text-4xl font-extrabold text-[#6BCB77] leading-none mb-1.5">
                {currentNum}
              </h2>
              
              <div className="bg-slate-100 dark:bg-slate-700 p-3.5 rounded-2xl border-2 border-high-ink w-full max-w-xs mb-3">
                <p className="text-lg font-black text-[#4D96FF]">
                  {getEnglishNumberSpelling(currentNum)}
                </p>
                <p className="text-xl font-black text-[#FF851B] mt-1">
                  {getGujSpelling(currentNum)}
                </p>
              </div>

              <div className="flex gap-2.5">
                <button
                  onClick={playPronunciation}
                  className="bg-[#FFD93D] hover:bg-[#ffe26b] text-high-ink font-black py-2 px-4 rounded-xl border-2 border-high-ink shadow-[0_2.5px_0_#2D3436] hover:translate-y-[-1px] hover:shadow-[0_3.5px_0_#2D3436] active:translate-y-[1px] active:shadow-[0_1px_0_#2D3436] transition-all text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4 stroke-[3]" />
                  <span>Hear</span>
                </button>

                <button
                  onClick={handleResetTrace}
                  className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-high-ink dark:text-white font-black py-2 px-4 rounded-xl border-2 border-high-ink shadow-[0_2.5px_0_#2D3436] hover:translate-y-[-1px] hover:shadow-[0_3.5px_0_#2D3436] active:translate-y-[1px] active:shadow-[0_1px_0_#2D3436] transition-all text-xs flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Redraw</span>
                </button>

                {currentNum < 100 && (
                  <button
                    onClick={() => handleNumChange(currentNum + 1)}
                    className="bg-[#6BCB77] hover:bg-[#5bba67] text-white font-black py-2 px-4 rounded-xl border-2 border-high-ink shadow-[0_2.5px_0_#2D3436] hover:translate-y-[-1px] hover:shadow-[0_3.5px_0_#2D3436] active:translate-y-[1px] active:shadow-[0_1px_0_#2D3436] transition-all text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <span>Next ➔</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tracing percentage feedback bar */}
      <div className="w-full flex justify-between items-center border-t-2 border-slate-100 dark:border-slate-700 pt-3 mt-2">
        <span className="text-xs sm:text-sm font-black text-slate-500 dark:text-slate-300">
          Trace progress: {tracePercentage}%
        </span>

        <button
          onClick={handleResetTrace}
          className="bg-white hover:bg-slate-50 text-high-ink text-[10px] sm:text-xs font-black p-2 rounded-xl border-2 border-high-ink shadow-[0_2px_0_#2D3436] flex items-center gap-1.5 cursor-pointer"
        >
          <Trash2 className="w-4 h-4 text-[#FF6B6B]" />
          <span>Clear board</span>
        </button>
      </div>

      {/* 1-100 Bento Grid Modal Selector */}
      <AnimatePresence>
        {isGridModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-[2.5rem] border-8 border-high-ink p-5 sm:p-6 w-full max-w-2xl h-[75vh] flex flex-col justify-between"
            >
              <div className="flex items-center justify-between border-b-4 border-high-ink pb-3 mb-4">
                <h3 className="text-lg sm:text-xl font-black text-high-ink dark:text-white uppercase">
                  Select Number 1 to 100 🎯
                </h3>
                <button
                  onClick={() => {
                    playClickSound(settings.soundEnabled);
                    setIsGridModalOpen(false);
                  }}
                  className="bg-red-400 text-white font-black rounded-lg text-xs px-2.5 py-1.5 border-2 border-high-ink shadow-[0_2px_0_#2D3436] cursor-pointer"
                >
                  Close ✕
                </button>
              </div>

              {/* Grid content box */}
              <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-5 sm:grid-cols-10 gap-2 pb-4">
                {Array.from({ length: 100 }, (_, i) => {
                  const num = i + 1;
                  const isActive = currentNum === num;
                  const colors = [
                    'bg-red-100 dark:bg-red-950/40 text-red-600',
                    'bg-orange-100 dark:bg-orange-950/40 text-orange-600',
                    'bg-yellow-100 dark:bg-yellow-950/40 text-yellow-600',
                    'bg-green-100 dark:bg-green-950/40 text-green-600',
                    'bg-teal-100 dark:bg-teal-950/40 text-teal-600',
                    'bg-blue-100 dark:bg-blue-950/40 text-blue-600',
                    'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600',
                    'bg-purple-100 dark:bg-purple-950/40 text-purple-600',
                    'bg-pink-100 dark:bg-pink-950/40 text-pink-600',
                    'bg-rose-100 dark:bg-rose-950/40 text-rose-600',
                  ];
                  const cIndex = Math.floor((num - 1) / 10) % colors.length;

                  return (
                    <button
                      key={num}
                      onClick={() => handleSelectNumberGrid(num)}
                      className={`h-11 rounded-xl border-2 border-high-ink font-black text-sm transition-all cursor-pointer flex items-center justify-center ${
                        isActive 
                          ? 'bg-amber-400 text-high-ink border-amber-500 scale-105 shadow-[0_2.5px_0_#2D3436]' 
                          : `${colors[cIndex]} hover:scale-105 active:scale-95`
                      }`}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ==========================================
   3.5 GUJARATI NUMBER TRACE GAME COMPONENT (૦-૯ Tracing Sandbox)
   ========================================== */
const GUJARATI_TRACE_DIGITS = ['૦', '૧', '૨', '૩', '૪', '૫', '૬', '૭', '૮', '૯'];
const GUJARATI_TRACE_EN_SPELLINGS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
const GUJARATI_TRACE_GU_SPELLINGS = ['શૂન્ય', 'એક', 'બે', 'ત્રણ', 'ચાર', 'પાંચ', 'છ', 'સાત', 'આઠ', 'નવ'];

function GujaratiNumberTraceGame({ settings }: { settings: AppSettings }) {
  const [currentIdx, setCurrentIdx] = useState<number>(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tracePercentage, setTracePercentage] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [isGridModalOpen, setIsGridModalOpen] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointsDrawnRef = useRef<{ x: number; y: number }[]>([]);

  // Pronunciation speaker TTS
  const playPronunciation = () => {
    const englishSpelling = GUJARATI_TRACE_EN_SPELLINGS[currentIdx];
    const gujSpelling = GUJARATI_TRACE_GU_SPELLINGS[currentIdx];

    // Speak Gujarati spelling first
    speakText(gujSpelling, 'gu', settings.gujaratiVoiceURI, settings.soundEnabled);
    
    // Speak English spelling with a comfortable gap
    setTimeout(() => {
      speakText(`${currentIdx}, ${englishSpelling}`, 'en', settings.englishVoiceURI, settings.soundEnabled);
    }, 1100);
  };

  // Reset drawing canvas
  const handleResetTrace = () => {
    setTracePercentage(0);
    setRevealed(false);
    pointsDrawnRef.current = [];
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  // Handle number change
  const handleNumChange = (newIdx: number) => {
    if (newIdx < 0 || newIdx > 9) return;
    playClickSound(settings.soundEnabled);
    setCurrentIdx(newIdx);
    handleResetTrace();
  };

  // Quick select grid selector handler
  const handleSelectNumberGrid = (idx: number) => {
    setIsGridModalOpen(false);
    setCurrentIdx(idx);
    handleResetTrace();
  };

  // Adjust canvas coordinates on load/number change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    handleResetTrace();
  }, [currentIdx]);

  // Tracing handlers (supporting touch + mouse)
  const getCoordinates = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const handleStartDraw = (e: any) => {
    e.preventDefault();
    setIsDrawing(true);
    const coords = getCoordinates(e);
    drawSegment(coords.x, coords.y, true);
  };

  const handleDraw = (e: any) => {
    if (!isDrawing) return;
    e.preventDefault();
    const coords = getCoordinates(e);
    drawSegment(coords.x, coords.y, false);
  };

  const handleStopDraw = () => {
    setIsDrawing(false);
  };

  const drawSegment = (x: number, y: number, isNewStroke: boolean) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Colorful rainbow sparkly glowing brush specs
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    const colors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#B10DC9', '#FF9F43'];
    ctx.strokeStyle = colors[Math.floor(Math.random() * colors.length)];
    ctx.shadowColor = ctx.strokeStyle;
    ctx.shadowBlur = 8;

    if (isNewStroke) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else {
      const prevPoint = pointsDrawnRef.current[pointsDrawnRef.current.length - 1];
      if (prevPoint) {
        ctx.beginPath();
        ctx.moveTo(prevPoint.x, prevPoint.y);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    }

    pointsDrawnRef.current.push({ x, y });

    // Interactive Tracing Feedback calculation based on bounding-box + point density coverage
    const pointsCount = pointsDrawnRef.current.length;
    
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    pointsDrawnRef.current.forEach(p => {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    });

    const drawWidth = maxX - minX;
    const drawHeight = maxY - minY;
    
    const wRatio = Math.min(drawWidth / (canvas.width * 0.42), 1);
    const hRatio = Math.min(drawHeight / (canvas.height * 0.42), 1);
    const densityProgress = Math.min(pointsCount / 24, 1);

    const calculatedPercentage = Math.round(
      (densityProgress * 40) + (wRatio * 30) + (hRatio * 30)
    );

    setTracePercentage(Math.min(calculatedPercentage, 100));

    if (calculatedPercentage >= 100 && !revealed) {
      setTracePercentage(100);
      setRevealed(true);
      playSuccessSound(settings.soundEnabled);
      playPronunciation();
      confetti({
        particleCount: 50,
        spread: 35,
        origin: { y: 0.65 }
      });
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between items-center py-1 relative select-none">
      {/* Dynamic top control row */}
      <div className="flex justify-between items-center w-full gap-2 mb-2">
        <button
          onClick={() => handleNumChange(currentIdx - 1)}
          disabled={currentIdx <= 0}
          className="bg-white hover:bg-slate-50 dark:bg-slate-800 text-high-ink dark:text-white disabled:opacity-30 disabled:pointer-events-none font-black px-3.5 py-2 rounded-xl border-2 border-high-ink shadow-[0_2px_0_#2D3436] cursor-pointer text-xs flex items-center gap-1 transition-all"
        >
          <span>◀ Back</span>
        </button>

        {/* Big styled center numeral selector display */}
        <div className="flex items-center gap-2">
          <span className="text-lg sm:text-2xl font-black text-high-ink dark:text-white bg-amber-100 dark:bg-amber-950 px-4 py-1.5 rounded-2xl border-4 border-high-ink shadow-[0_4px_0_#2D3436] flex items-center gap-2">
            <span>{GUJARATI_TRACE_DIGITS[currentIdx]}</span>
            <span className="text-slate-400 dark:text-slate-400 font-extrabold">•</span>
            <span>{GUJARATI_TRACE_GU_SPELLINGS[currentIdx]}</span>
          </span>
          
          <button
            onClick={() => {
              playClickSound(settings.soundEnabled);
              setIsGridModalOpen(true);
            }}
            className="w-11 h-11 bg-white dark:bg-slate-800 text-high-ink dark:text-white border-3 border-high-ink rounded-xl shadow-[0_3px_0_#2D3436] flex items-center justify-center hover:translate-y-[-1px] hover:shadow-[0_4px_0_#2D3436] active:translate-y-[1px] active:shadow-[0_1.5px_0_#2D3436] transition-all cursor-pointer"
            title="Choose number ૦-૯"
          >
            <Grid className="w-5.5 h-5.5 stroke-[3]" />
          </button>
        </div>

        <button
          onClick={() => handleNumChange(currentIdx + 1)}
          disabled={currentIdx >= 9}
          className="bg-white hover:bg-slate-50 dark:bg-slate-800 text-high-ink dark:text-white disabled:opacity-30 disabled:pointer-events-none font-black px-3.5 py-2 rounded-xl border-2 border-high-ink shadow-[0_2px_0_#2D3436] cursor-pointer text-xs flex items-center gap-1 transition-all"
        >
          <span>Next ▶</span>
        </button>
      </div>

      <p className="text-[10px] sm:text-xs font-black text-slate-500 dark:text-slate-300 uppercase tracking-widest text-center mb-2 leading-tight">
        ✏️ Trace the dotted number with your finger or mouse! ✏️
      </p>

      {/* Tracing Sandbox Canvas Area */}
      <div className="flex-1 w-full max-w-sm relative flex items-center justify-center bg-[#2D3436] rounded-[2rem] border-6 border-high-ink p-1 min-h-[220px] overflow-hidden shadow-inner">
        {/* Chalkboard dotted numeral background */}
        <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none opacity-20">
          <span className="text-[11rem] md:text-[14rem] font-bold text-white select-none border-spacing-2 select-none font-sans font-black select-none pointer-events-none select-none select-none tracking-tighter">
            {GUJARATI_TRACE_DIGITS[currentIdx]}
          </span>
        </div>

        {/* Tracing canvas layer */}
        <canvas
          ref={canvasRef}
          onMouseDown={handleStartDraw}
          onMouseMove={handleDraw}
          onMouseUp={handleStopDraw}
          onMouseLeave={handleStopDraw}
          onTouchStart={handleStartDraw}
          onTouchMove={handleDraw}
          onTouchEnd={handleStopDraw}
          className="absolute inset-0 w-full h-full cursor-crosshair touch-none z-10"
        />

        {/* Tracing success overlay */}
        <AnimatePresence>
          {revealed && (
            <motion.div 
              initial={{ scale: 0.82, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.82, opacity: 0 }}
              className="absolute inset-0 bg-white/95 dark:bg-slate-800/95 flex flex-col justify-center items-center p-4 z-20 rounded-[1.6rem] text-center"
            >
              <Sparkles className="w-10 h-10 text-[#FFD93D] animate-bounce mb-1" />
              
              <h2 className="text-4xl font-extrabold text-[#6BCB77] leading-none mb-1.5">
                {GUJARATI_TRACE_DIGITS[currentIdx]}
              </h2>
              
              <div className="bg-slate-100 dark:bg-slate-700 p-3.5 rounded-2xl border-2 border-high-ink w-full max-w-xs mb-3">
                <p className="text-lg font-black text-[#4D96FF]">
                  {GUJARATI_TRACE_EN_SPELLINGS[currentIdx]}
                </p>
                <p className="text-xl font-black text-[#FF851B] mt-1">
                  {GUJARATI_TRACE_GU_SPELLINGS[currentIdx]}
                </p>
              </div>

              <div className="flex gap-2.5">
                <button
                  onClick={playPronunciation}
                  className="bg-[#FFD93D] hover:bg-[#ffe26b] text-high-ink font-black py-2 px-4 rounded-xl border-2 border-high-ink shadow-[0_2.5px_0_#2D3436] hover:translate-y-[-1px] hover:shadow-[0_3.5px_0_#2D3436] active:translate-y-[1px] active:shadow-[0_1px_0_#2D3436] transition-all text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4 stroke-[3]" />
                  <span>Hear</span>
                </button>

                <button
                  onClick={handleResetTrace}
                  className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-high-ink dark:text-white font-black py-2 px-4 rounded-xl border-2 border-high-ink shadow-[0_2.5px_0_#2D3436] hover:translate-y-[-1px] hover:shadow-[0_3.5px_0_#2D3436] active:translate-y-[1px] active:shadow-[0_1px_0_#2D3436] transition-all text-xs flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Redraw</span>
                </button>

                {currentIdx < 9 && (
                  <button
                    onClick={() => handleNumChange(currentIdx + 1)}
                    className="bg-[#6BCB77] hover:bg-[#5bba67] text-white font-black py-2 px-4 rounded-xl border-2 border-high-ink shadow-[0_2.5px_0_#2D3436] hover:translate-y-[-1px] hover:shadow-[0_3.5px_0_#2D3436] active:translate-y-[1px] active:shadow-[0_1px_0_#2D3436] transition-all text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <span>Next ➔</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tracing percentage feedback bar */}
      <div className="w-full flex justify-between items-center border-t-2 border-slate-100 dark:border-slate-700 pt-3 mt-2">
        <span className="text-xs sm:text-sm font-black text-slate-500 dark:text-slate-300">
          Trace progress: {tracePercentage}%
        </span>

        <button
          onClick={handleResetTrace}
          className="bg-white hover:bg-slate-50 text-high-ink text-[10px] sm:text-xs font-black p-2 rounded-xl border-2 border-high-ink shadow-[0_2px_0_#2D3436] flex items-center gap-1.5 cursor-pointer"
        >
          <Trash2 className="w-4 h-4 text-[#FF6B6B]" />
          <span>Clear board</span>
        </button>
      </div>

      {/* ૦-૯ Bento Grid Modal Selector */}
      <AnimatePresence>
        {isGridModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-[2.5rem] border-8 border-high-ink p-5 sm:p-6 w-full max-w-lg h-[45vh] flex flex-col justify-between"
            >
              <div className="flex items-center justify-between border-b-4 border-high-ink pb-3 mb-4">
                <h3 className="text-lg sm:text-xl font-black text-high-ink dark:text-white uppercase">
                  Select Digit ૦ to ૯ 🎯
                </h3>
                <button
                  onClick={() => {
                    playClickSound(settings.soundEnabled);
                    setIsGridModalOpen(false);
                  }}
                  className="bg-red-400 text-white font-black rounded-lg text-xs px-2.5 py-1.5 border-2 border-high-ink shadow-[0_2px_0_#2D3436] cursor-pointer"
                >
                  Close ✕
                </button>
              </div>

              {/* Grid content box */}
              <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-5 gap-2 pb-4">
                {GUJARATI_TRACE_DIGITS.map((digit, idx) => {
                  const isActive = currentIdx === idx;
                  const colors = [
                    'bg-red-100 dark:bg-red-950/40 text-red-600',
                    'bg-orange-100 dark:bg-orange-950/40 text-orange-600',
                    'bg-yellow-100 dark:bg-yellow-950/40 text-yellow-600',
                    'bg-green-100 dark:bg-green-950/40 text-green-600',
                    'bg-teal-100 dark:bg-teal-950/40 text-teal-600',
                    'bg-blue-100 dark:bg-blue-950/40 text-blue-600',
                    'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600',
                    'bg-purple-100 dark:bg-purple-950/40 text-purple-600',
                    'bg-pink-100 dark:bg-pink-950/40 text-pink-600',
                    'bg-rose-100 dark:bg-rose-950/40 text-rose-600',
                  ];
                  const cIndex = idx % colors.length;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectNumberGrid(idx)}
                      className={`h-11 rounded-xl border-2 border-high-ink font-black text-sm transition-all cursor-pointer flex items-center justify-center ${
                        isActive 
                          ? 'bg-amber-400 text-high-ink border-amber-500 scale-105 shadow-[0_2.5px_0_#2D3436]' 
                          : `${colors[cIndex]} hover:scale-105 active:scale-95`
                      }`}
                    >
                      {digit}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ==========================================
   HELPERS & DATA DEFINITIONS
   ========================================== */
function getEnglishNumberSpelling(num: number): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 
                'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  if (num === 0) return 'Zero';
  if (num === 100) return 'One Hundred';
  if (num < 20) return ones[num];
  
  const digitOne = num % 10;
  const digitTen = Math.floor(num / 10);
  
  return tens[digitTen] + (digitOne > 0 ? ' ' + ones[digitOne] : '');
}

function getGujSpelling(num: number): string {
  const gujSpellings: { [key: number]: string } = {
    1: 'એક', 2: 'બે', 3: 'ત્રણ', 4: 'ચાર', 5: 'પાંચ', 6: 'છ', 7: 'સાત', 8: 'આઠ', 9: 'નવ', 10: 'દસ',
    11: 'અગિયાર', 12: 'બાર', 13: 'તેર', 14: 'ચૌદ', 15: 'પંદર', 16: 'સોળ', 17: 'સત્તર', 18: 'અઢાર', 19: 'ઓગણીસ', 20: 'વીસ',
    21: 'એકવીસ', 22: 'બાવીસ', 23: 'તેવીસ', 24: 'ચોવીસ', 25: 'પચીસ', 26: 'છવીસ', 27: 'સત્તાવીસ', 28: 'અઠ્ઠાવીસ', 29: 'ઓગણત્રીસ', 30: 'ત્રીસ',
    31: 'એકત્રીસ', 32: 'બત્રીસ', 33: 'તેત્રીસ', 34: 'ચોત્રીસ', 35: 'પાંત્રીસ', 36: 'છત્રીસ', 37: 'સડત્રીસ', 38: 'આડત્રીસ', 39: 'ઓગણચાળીસ', 40: 'ચાળીસ',
    41: 'એકતાળીસ', 42: 'બેતાળીસ', 43: 'તેતાળીસ', 44: 'ચોતાળીસ', 45: 'પિસ્તાળીસ', 46: 'છેતાળીસ', 47: 'સુડતાળીસ', 48: 'અડતાળીસ', 49: 'ઓગણપચાસ', 50: 'પચાસ',
    51: 'એકાવન', 52: 'બાવન', 53: 'તરેવન', 54: 'ચોવન', 55: 'પંચાવન', 56: 'છપ્પન', 57: 'સત્તાવન', 58: 'અઠ્ઠાવન', 59: 'ઓગણસાઇઠ', 60: 'સાઇઠ',
    61: 'એકસઠ', 62: 'બાસઠ', 63: 'ત્રેસઠ', 64: 'ચોસઠ', 65: 'પાંસઠ', 66: 'છાસઠ', 67: 'સડસઠ', 68: 'આડસઠ', 69: 'ઓગણસિત્તેર', 70: 'સિત્તેર',
    71: 'એક્યોતેર', 72: 'બાયોતેર', 73: 'ત્યોતેર', 74: 'ચોક્યોતેર', 75: 'પંચોતેર', 76: 'છ્યોતેર', 77: 'સત્યોતેર', 78: 'ઇઠ્યોતેર', 79: 'ઓગણએંસી', 80: 'એંસી',
    81: 'એક્યાસી', 82: 'બ્યાસી', 83: 'ત્યાસી', 84: 'ચોર્યાસી', 85: 'પંચાસી', 86: 'છ્યાસી', 87: 'સત્યાસી', 88: 'ઈઠ્યાસી', 89: 'ઓગણતેવું', 90: 'નેવું',
    91: 'એકણું', 92: 'બાણું', 93: 'ત્રાણું', 94: 'ચોરાણું', 95: 'પંચાણું', 96: 'છન્નું', 97: 'સત્તાણું', 98: 'અઠ્ઠાણું', 99: 'નવ્વાણું', 100: 'એક સો'
  };
  return gujSpellings[num] || '';
}

/* ==========================================
   4. LEARN MATH GAME COMPONENT (સરળ ગણિત)
   ========================================== */
interface LearnMathGameProps {
  settings: AppSettings;
  activeTab: 'english' | 'gujarati';
}

function LearnMathGame({ settings, activeTab }: LearnMathGameProps) {
  const [mode, setMode] = useState<'select' | 'addition' | 'subtraction'>('select');
  const [level, setLevel] = useState<'select' | 'easy' | 'medium' | 'hard'>('select');
  const [gameState, setGameState] = useState<'playing' | 'completed'>('playing');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [selectedWrongOptions, setSelectedWrongOptions] = useState<number[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);
  
  // Total stars saved in local storage
  const [totalMathStars, setTotalMathStars] = useState(() => {
    try {
      const saved = localStorage.getItem('kids_math_stars_v2');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [currentEmoji, setCurrentEmoji] = useState('🍎');
  const emojiPool = ['🍎', '🍓', '🎈', '🧸', '🍬', '⭐', '🦁', '🚗', '🐶', '🍕'];

  // Load new question
  const loadQuestion = (currMode: 'addition' | 'subtraction', currLevel: 'easy' | 'medium' | 'hard', index: number) => {
    const q = generateMathQuestionHelper(currMode, currLevel);
    setCurrentQuestion(q);
    setSelectedWrongOptions([]);
    setIsCorrect(false);
    // Pick a new random emoji for this question
    const randomEmoji = emojiPool[Math.floor(Math.random() * emojiPool.length)];
    setCurrentEmoji(randomEmoji);
  };

  const handleSelectMode = (selectedMode: 'addition' | 'subtraction') => {
    playClickSound(settings.soundEnabled);
    setMode(selectedMode);
    setLevel('select');
    setGameState('playing');
  };

  const handleSelectLevel = (selectedLevel: 'easy' | 'medium' | 'hard') => {
    playClickSound(settings.soundEnabled);
    setLevel(selectedLevel);
    setCurrentQuestionIdx(0);
    setScore(0);
    setGameState('playing');
    loadQuestion(mode, selectedLevel, 0);
  };

  const handleOptionClick = (option: number) => {
    if (isCorrect || selectedWrongOptions.includes(option)) return;

    if (option === currentQuestion.answer) {
      setIsCorrect(true);
      setScore(prev => prev + 1);
      playSuccessSound(settings.soundEnabled);
      triggerVibration([50, 50]);
      
      // Pronounce equation
      let speakStr = '';
      if (activeTab === 'english') {
        speakStr = `${currentQuestion.num1} ${currentQuestion.operator === '+' ? 'plus' : 'minus'} ${currentQuestion.num2} equals ${currentQuestion.answer}`;
        speakText(speakStr, 'en', undefined, settings.soundEnabled);
      } else {
        // Gujarati translation speech
        const opWord = currentQuestion.operator === '+' ? 'વત્તા' : 'ઓછા';
        speakStr = `${toGujaratiNumberString(currentQuestion.num1)} ${opWord} ${toGujaratiNumberString(currentQuestion.num2)} બરાબર ${toGujaratiNumberString(currentQuestion.answer)}`;
        speakText(speakStr, 'gu', undefined, settings.soundEnabled);
      }

      // Automatically advance after 2.2 seconds
      setTimeout(() => {
        if (currentQuestionIdx < 4) {
          const nextIdx = currentQuestionIdx + 1;
          setCurrentQuestionIdx(nextIdx);
          loadQuestion(mode, level as any, nextIdx);
        } else {
          // Finish round
          const earnedInRound = score + 1; // plus this correct one
          const updatedStars = totalMathStars + earnedInRound;
          setTotalMathStars(updatedStars);
          try {
            localStorage.setItem('kids_math_stars_v2', updatedStars.toString());
          } catch (e) {
            console.error(e);
          }
          setGameState('completed');
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      }, 2200);

    } else {
      playErrorSound(settings.soundEnabled);
      triggerVibration(100);
      setSelectedWrongOptions(prev => [...prev, option]);
    }
  };

  const handleReset = () => {
    playClickSound(settings.soundEnabled);
    setMode('select');
    setLevel('select');
    setGameState('playing');
  };

  const startNewRound = () => {
    playClickSound(settings.soundEnabled);
    setScore(0);
    setCurrentQuestionIdx(0);
    setGameState('playing');
    loadQuestion(mode, level as any, 0);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-1 sm:p-2 overflow-y-auto max-h-[75vh]">
      {/* Math Game Header */}
      <div className="w-full flex items-center justify-between border-b-2 border-slate-100 dark:border-slate-700 pb-2 mb-3">
        <button
          onClick={handleReset}
          className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-high-ink dark:text-white font-black py-1.5 px-3 rounded-xl border-2 border-high-ink text-xs flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{activeTab === 'english' ? 'Reset' : 'ફરીથી'}</span>
        </button>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 font-black px-3 py-1 rounded-full border border-amber-300">
            <span>⭐</span>
            <span className="text-sm">{totalMathStars}</span>
          </div>
          {level !== 'select' && gameState === 'playing' && (
            <div className="text-xs sm:text-sm font-black text-slate-500 dark:text-slate-300">
              {activeTab === 'english' ? 'Q' : 'પ્રશ્ન'} {currentQuestionIdx + 1}/5
            </div>
          )}
        </div>
      </div>

      {/* 1. Mode Selection */}
      {mode === 'select' && (
        <div className="flex-1 flex flex-col justify-center items-center w-full max-w-md my-4">
          <h2 className="text-xl sm:text-2xl font-black text-high-ink dark:text-white mb-6 uppercase tracking-tight text-center">
            {activeTab === 'english' ? 'Select Math Operation 🧮' : 'ગણિતની રમત પસંદ કરો 🧮'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <button
              onClick={() => handleSelectMode('addition')}
              className="bg-[#FF6B6B] text-white rounded-3xl p-6 border-4 border-high-ink shadow-[0_6px_0_#2D3436] hover:translate-y-[-2px] hover:shadow-[0_8px_0_#2D3436] active:translate-y-[2px] active:shadow-[0_2px_0_#2D3436] transition-all text-center flex flex-col items-center justify-center gap-3 h-40 cursor-pointer"
            >
              <span className="text-4xl">➕</span>
              <span className="text-lg font-black uppercase tracking-wider">
                {activeTab === 'english' ? 'Addition (+)' : 'સરવાળો (+)'}
              </span>
            </button>
            <button
              onClick={() => handleSelectMode('subtraction')}
              className="bg-[#6BCB77] text-white rounded-3xl p-6 border-4 border-high-ink shadow-[0_6px_0_#2D3436] hover:translate-y-[-2px] hover:shadow-[0_8px_0_#2D3436] active:translate-y-[2px] active:shadow-[0_2px_0_#2D3436] transition-all text-center flex flex-col items-center justify-center gap-3 h-40 cursor-pointer"
            >
              <span className="text-4xl">➖</span>
              <span className="text-lg font-black uppercase tracking-wider">
                {activeTab === 'english' ? 'Subtraction (-)' : 'બાદબાકી (-)'}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Level Selection */}
      {mode !== 'select' && level === 'select' && (
        <div className="flex-1 flex flex-col justify-center items-center w-full max-w-sm my-4">
          <h2 className="text-lg sm:text-xl font-black text-high-ink dark:text-white mb-4 uppercase tracking-tight text-center">
            {activeTab === 'english' ? 'Choose Difficulty Level' : 'મુશ્કેલીનું સ્તર પસંદ કરો'}
          </h2>
          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={() => handleSelectLevel('easy')}
              className="bg-[#FFD93D] text-high-ink font-black text-base py-3 px-6 rounded-2xl border-4 border-high-ink shadow-[0_4px_0_#2D3436] hover:translate-y-[-1px] hover:shadow-[0_5px_0_#2D3436] active:translate-y-[1px] active:shadow-[0_2px_0_#2D3436] transition-all cursor-pointer uppercase tracking-wider text-center"
            >
              🟢 {activeTab === 'english' ? 'Easy (1 - 10)' : 'સરળ (૧ - ૧૦)'}
            </button>
            <button
              onClick={() => handleSelectLevel('medium')}
              className="bg-[#FF9F43] text-white font-black text-base py-3 px-6 rounded-2xl border-4 border-high-ink shadow-[0_4px_0_#2D3436] hover:translate-y-[-1px] hover:shadow-[0_5px_0_#2D3436] active:translate-y-[1px] active:shadow-[0_2px_0_#2D3436] transition-all cursor-pointer uppercase tracking-wider text-center"
            >
              🟡 {activeTab === 'english' ? 'Medium (1 - 30)' : 'મધ્યમ (૧ - ૩૦)'}
            </button>
            <button
              onClick={() => handleSelectLevel('hard')}
              className="bg-[#FF6B6B] text-white font-black text-base py-3 px-6 rounded-2xl border-4 border-high-ink shadow-[0_4px_0_#2D3436] hover:translate-y-[-1px] hover:shadow-[0_5px_0_#2D3436] active:translate-y-[1px] active:shadow-[0_2px_0_#2D3436] transition-all cursor-pointer uppercase tracking-wider text-center"
            >
              🔴 {activeTab === 'english' ? 'Hard (1 - 100)' : 'કઠિન (૧ - ૧૦૦)'}
            </button>
          </div>
        </div>
      )}

      {/* 3. Playing State */}
      {mode !== 'select' && level !== 'select' && gameState === 'playing' && currentQuestion && (
        <div className="flex-1 w-full flex flex-col justify-between items-center my-2">
          {/* Progress bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-700 h-3.5 rounded-full border-2 border-high-ink overflow-hidden mb-3">
            <div 
              className="bg-[#6BCB77] h-full transition-all duration-300"
              style={{ width: `${((currentQuestionIdx) / 5) * 100}%` }}
            />
          </div>

          {/* Interactive Equation Card */}
          <div className="bg-[#EDF2F7] dark:bg-slate-700/50 rounded-3xl border-4 border-high-ink w-full p-4 text-center flex flex-col justify-center items-center shadow-inner relative min-h-[140px] sm:min-h-[160px]">
            {/* Numbers display */}
            <div className="text-4xl sm:text-5xl font-black text-high-ink dark:text-white flex items-center justify-center gap-4 select-none">
              <span>
                {activeTab === 'english' ? currentQuestion.num1 : toGujaratiNumberString(currentQuestion.num1)}
              </span>
              <span className="text-[#FF6B6B]">{currentQuestion.operator}</span>
              <span>
                {activeTab === 'english' ? currentQuestion.num2 : toGujaratiNumberString(currentQuestion.num2)}
              </span>
              <span className="text-[#4D96FF]">=</span>
              <span className="text-amber-500 bg-white dark:bg-slate-800 border-4 border-dashed border-high-ink rounded-2xl px-4 py-1.5 w-16 sm:w-20 inline-block min-h-[64px] flex items-center justify-center">
                {isCorrect ? (
                  activeTab === 'english' ? currentQuestion.answer : toGujaratiNumberString(currentQuestion.answer)
                ) : '?'}
              </span>
            </div>

            {/* Tactile counting visual helper for kids (only when numbers are small <= 10) */}
            {currentQuestion.num1 <= 10 && currentQuestion.num2 <= 10 && (
              <div className="mt-4 flex flex-col gap-1 items-center justify-center text-center opacity-85">
                <div className="flex flex-wrap justify-center gap-0.5 max-w-xs text-lg">
                  {Array.from({ length: currentQuestion.num1 }).map((_, i) => (
                    <span key={`v1-${i}`} className="animate-pulse">{currentEmoji}</span>
                  ))}
                </div>
                <div className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  {currentQuestion.operator === '+' ? 'AND / અને' : 'TAKE AWAY / બાદ કરો'}
                </div>
                <div className="flex flex-wrap justify-center gap-0.5 max-w-xs text-lg">
                  {currentQuestion.operator === '+' ? (
                    Array.from({ length: currentQuestion.num2 }).map((_, i) => (
                      <span key={`v2-${i}`} className="animate-pulse">{currentEmoji}</span>
                    ))
                  ) : (
                    Array.from({ length: currentQuestion.num2 }).map((_, i) => (
                      <span key={`v2-minus-${i}`} className="opacity-30 line-through filter grayscale">{currentEmoji}</span>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Correct / Wrong Popups */}
          <div className="h-6 flex items-center justify-center my-1">
            <AnimatePresence>
              {isCorrect && (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="text-emerald-500 dark:text-emerald-400 font-black uppercase text-sm flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-yellow-400 fill-yellow-400 animate-spin" />
                  <span>{activeTab === 'english' ? '⭐ Correct! Excellent!' : '⭐ સાચું! ખૂબ સરસ!'}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 4 Option Buttons */}
          <div className="grid grid-cols-2 gap-3 w-full max-w-md mb-2">
            {currentQuestion.options.map((opt: number) => {
              const isWrong = selectedWrongOptions.includes(opt);
              const isRight = isCorrect && opt === currentQuestion.answer;
              
              let btnClass = 'bg-white dark:bg-slate-800 text-high-ink dark:text-white border-high-ink';
              if (isWrong) {
                btnClass = 'bg-red-200 dark:bg-red-950/40 text-red-500 border-red-300 opacity-60 scale-95 pointer-events-none cursor-not-allowed';
              } else if (isRight) {
                btnClass = 'bg-[#6BCB77] text-white border-[#5bba67] scale-105 pointer-events-none shadow-[0_4px_0_#2D3436] animate-bounce';
              }

              return (
                <button
                  key={opt}
                  onClick={() => handleOptionClick(opt)}
                  disabled={isCorrect}
                  className={`py-2.5 sm:py-3.5 px-4 font-black text-xl rounded-2xl border-4 shadow-[0_4px_0_#2D3436] hover:translate-y-[-1px] hover:shadow-[0_5px_0_#2D3436] active:translate-y-[1px] active:shadow-[0_2px_0_#2D3436] transition-all text-center flex items-center justify-center select-none cursor-pointer ${btnClass}`}
                >
                  {activeTab === 'english' ? opt : toGujaratiNumberString(opt)}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Complete Screen */}
      {gameState === 'completed' && (
        <div className="flex-1 flex flex-col justify-center items-center text-center my-4 p-4 w-full max-w-sm bg-amber-50 dark:bg-amber-900/10 border-4 border-amber-400 rounded-3xl shadow-inner animate-fade-in">
          <span className="text-6xl animate-bounce mb-3">🏆</span>
          <h3 className="text-xl sm:text-2xl font-black text-amber-500 uppercase tracking-tight">
            {activeTab === 'english' ? 'Round Complete!' : 'રમત પૂર્ણ થઈ!'}
          </h3>
          <p className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wide mt-1">
            {activeTab === 'english' 
              ? `You scored ${score}/5 questions!` 
              : `તમે ૫ માંથી ${toGujaratiNumberString(score)} પ્રશ્નો સાચા આપ્યા!`}
          </p>

          <div className="flex justify-center gap-1.5 my-4 text-3xl">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={i < score ? "animate-pulse scale-110 inline-block text-amber-400" : "opacity-30 filter grayscale text-slate-400"}>
                ⭐
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-2.5 w-full">
            <button
              onClick={startNewRound}
              className="bg-[#6BCB77] hover:bg-[#5bba67] text-white font-black text-sm py-2.5 px-6 rounded-xl border-2 border-high-ink shadow-[0_3px_0_#2D3436] hover:translate-y-[-1px] hover:shadow-[0_4px_0_#2D3436] active:translate-y-[1px] active:shadow-[0_1.5px_0_#2D3436] transition-all cursor-pointer uppercase tracking-wider text-center flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{activeTab === 'english' ? 'Play Again' : 'ફરી રમો'}</span>
            </button>
            <button
              onClick={() => {
                playClickSound(settings.soundEnabled);
                setLevel('select');
                setGameState('playing');
              }}
              className="bg-[#FFD93D] text-high-ink font-black text-sm py-2.5 px-6 rounded-xl border-2 border-high-ink shadow-[0_3px_0_#2D3436] hover:translate-y-[-1px] hover:shadow-[0_4px_0_#2D3436] active:translate-y-[1px] active:shadow-[0_1.5px_0_#2D3436] transition-all cursor-pointer uppercase tracking-wider text-center"
            >
              {activeTab === 'english' ? 'Try Another Level' : 'બીજું સ્તર પસંદ કરો'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Math question generator auxiliary helper
function generateMathQuestionHelper(mode: 'addition' | 'subtraction', level: 'easy' | 'medium' | 'hard') {
  let num1 = 0;
  let num2 = 0;
  let operator: '+' | '-' = mode === 'addition' ? '+' : '-';
  
  if (mode === 'addition') {
    if (level === 'easy') {
      num1 = Math.floor(Math.random() * 5) + 1; // 1-5
      num2 = Math.floor(Math.random() * 5) + 1; // 1-5
    } else if (level === 'medium') {
      num1 = Math.floor(Math.random() * 15) + 1; // 1-15
      num2 = Math.floor(Math.random() * 15) + 1; // 1-15
    } else {
      num1 = Math.floor(Math.random() * 50) + 1; // 1-50
      num2 = Math.floor(Math.random() * 50) + 1; // 1-50
    }
  } else {
    if (level === 'easy') {
      num1 = Math.floor(Math.random() * 9) + 2; // 2-10
      num2 = Math.floor(Math.random() * (num1 - 1)) + 1; // 1 to num1-1
    } else if (level === 'medium') {
      num1 = Math.floor(Math.random() * 25) + 6; // 6-30
      num2 = Math.floor(Math.random() * (num1 - 2)) + 2; // 2 to num1-2
    } else {
      num1 = Math.floor(Math.random() * 70) + 11; // 11-80
      num2 = Math.floor(Math.random() * (num1 - 5)) + 3; // 3 to num1-5
    }
  }
  
  const answer = operator === '+' ? num1 + num2 : num1 - num2;
  
  const optionsSet = new Set<number>([answer]);
  while (optionsSet.size < 4) {
    let wrong = answer + (Math.floor(Math.random() * 11) - 5); // offset by -5 to +5
    if (wrong >= 0 && wrong !== answer) {
      optionsSet.add(wrong);
    }
  }
  const options = Array.from(optionsSet).sort((a, b) => a - b);
  
  return { num1, num2, operator, answer, options };
}

/* ==========================================
   5. GUESS THE WORD GAME COMPONENT (શબ્દ ઓળખો)
   ========================================== */
interface GuessWordGameProps {
  settings: AppSettings;
  activeTab: 'english' | 'gujarati';
}

function GuessWordGame({ settings, activeTab }: GuessWordGameProps) {
  const [level, setLevel] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledPool, setShuffledPool] = useState<string[]>([]);
  const [tappedIndices, setTappedIndices] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const [celebrating, setCelebrating] = useState(false);
  
  // Accumulated Guess Word Stars saved globally
  const [wordStars, setWordStars] = useState(() => {
    try {
      const saved = localStorage.getItem('kids_word_stars_v2');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  // Get current word based on list and index
  const getWordList = () => {
    return activeTab === 'english' ? ENGLISH_GUESS_WORDS : GUJARATI_GUESS_WORDS;
  };

  const filteredWords = getWordList().filter(w => w.level === level);
  const currentItem = filteredWords[currentIndex] || filteredWords[0];

  // Initialize and Shuffle letters
  const initializeWord = (item: any) => {
    if (!item) return;
    const correctLetters = activeTab === 'english' ? item.word.split('') : [...item.letters];
    
    // Add extra letters to make it fun
    const lettersPool = activeTab === 'english' 
      ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
      : ['ક', 'ખ', 'ગ', 'ઘ', 'ચ', 'છ', 'જ', 'ટ', 'ત', 'દ', 'ન', 'પ', 'બ', 'મ', 'ય', 'ર', 'લ', 'વ', 'સ', 'હ'];
      
    const extras = [];
    const count = level === 'easy' ? 1 : level === 'medium' ? 2 : 3;
    for (let i = 0; i < count; i++) {
      const randChar = lettersPool[Math.floor(Math.random() * lettersPool.length)];
      if (!correctLetters.includes(randChar)) {
        extras.push(randChar);
      }
    }

    const pool = [...correctLetters, ...extras];
    // Shuffle
    const shuffled = pool.sort(() => 0.5 - Math.random());
    setShuffledPool(shuffled);
    setTappedIndices([]);
    setFeedback('none');
    setCelebrating(false);
  };

  // Re-initialize when word or language changes
  useEffect(() => {
    if (currentItem) {
      initializeWord(currentItem);
    }
  }, [currentIndex, level, activeTab]);

  const handleLetterTap = (poolIndex: number) => {
    if (feedback === 'correct' || tappedIndices.includes(poolIndex)) return;

    playClickSound(settings.soundEnabled);
    const updated = [...tappedIndices, poolIndex];
    setTappedIndices(updated);

    const targetLength = activeTab === 'english' ? (currentItem as any).word.length : (currentItem as any).letters.length;
    
    // Check if spelling complete
    if (updated.length === targetLength) {
      const spelledStr = updated.map(idx => shuffledPool[idx]).join('');
      const targetStr = currentItem.word;

      if (spelledStr === targetStr) {
        setFeedback('correct');
        setCelebrating(true);
        playSuccessSound(settings.soundEnabled);
        triggerVibration([100, 50, 100]);
        
        // Pronounce correct answer
        speakText(targetStr, activeTab === 'english' ? 'en' : 'gu', undefined, settings.soundEnabled);

        const newStars = wordStars + 1;
        setWordStars(newStars);
        try {
          localStorage.setItem('kids_word_stars_v2', newStars.toString());
        } catch {}

        // Confetti effect
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });

        // Auto-advance after 2.8 seconds
        setTimeout(() => {
          handleNextHelper();
        }, 2800);

      } else {
        setFeedback('wrong');
        playErrorSound(settings.soundEnabled);
        triggerVibration(150);

        // Reset spelling after 1.5 seconds so they can retry
        setTimeout(() => {
          setTappedIndices([]);
          setFeedback('none');
        }, 1500);
      }
    }
  };

  const handleClearSpelling = () => {
    if (feedback === 'correct') return;
    playClickSound(settings.soundEnabled);
    setTappedIndices([]);
    setFeedback('none');
  };

  const handleNextHelper = () => {
    if (currentIndex < filteredWords.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Loop back
      setCurrentIndex(0);
    }
    setTappedIndices([]);
    setFeedback('none');
  };

  const handleLevelChange = (newLevel: 'easy' | 'medium' | 'hard') => {
    playClickSound(settings.soundEnabled);
    setLevel(newLevel);
    setCurrentIndex(0);
  };

  const targetLetters = activeTab === 'english' ? (currentItem as any)?.word.split('') : (currentItem as any)?.letters;

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-1 sm:p-2 overflow-y-auto max-h-[75vh]">
      {/* Header Info */}
      <div className="w-full flex items-center justify-between border-b-2 border-slate-100 dark:border-slate-700 pb-2 mb-3">
        {/* Difficulty Selectors */}
        <div className="flex gap-1">
          {(['easy', 'medium', 'hard'] as const).map(lvl => (
            <button
              key={lvl}
              onClick={() => handleLevelChange(lvl)}
              className={`text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-xl border border-high-ink cursor-pointer select-none uppercase tracking-wider ${
                level === lvl 
                  ? 'bg-amber-400 text-high-ink shadow-[0_2px_0_#2D3436] translate-y-[-1px]' 
                  : 'bg-white dark:bg-slate-800 text-slate-500'
              }`}
            >
              {lvl === 'easy' ? (activeTab === 'english' ? 'Easy' : 'સરળ') : 
               lvl === 'medium' ? (activeTab === 'english' ? 'Medium' : 'મધ્યમ') : 
               (activeTab === 'english' ? 'Hard' : 'કઠિન')}
            </button>
          ))}
        </div>

        {/* Total Stars Counter */}
        <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 font-black px-3 py-1 rounded-full border border-amber-300">
          <span>⭐</span>
          <span className="text-sm font-black">{wordStars}</span>
        </div>
      </div>

      {currentItem ? (
        <div className="flex-1 w-full flex flex-col justify-between items-center my-1">
          {/* Big Bouncy Colorful Emoji Picture Card */}
          <div className="relative flex items-center justify-center bg-sky-100 dark:bg-sky-950/20 border-4 border-high-ink rounded-[2rem] p-4 w-32 h-32 sm:w-36 sm:h-36 shadow-lg">
            <motion.div
              animate={celebrating ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
              transition={{ duration: 0.6, repeat: celebrating ? Infinity : 0 }}
              className="text-6xl sm:text-7xl select-none"
            >
              {currentItem.emoji}
            </motion.div>
          </div>

          {/* Correct / Wrong message prompt */}
          <div className="h-6 flex items-center justify-center mt-2">
            <AnimatePresence>
              {feedback === 'correct' && (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="text-[#6BCB77] font-black uppercase text-sm tracking-widest flex items-center gap-1"
                >
                  <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400 animate-spin" />
                  <span>⭐ Correct! ⭐ સાચું!</span>
                </motion.div>
              )}
              {feedback === 'wrong' && (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="text-[#FF6B6B] font-black uppercase text-sm tracking-widest"
                >
                  ❌ Try Again! ❌ ફરી પ્રયત્ન કરો!
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Spelling target slots (blanks) */}
          <div className="flex justify-center gap-2 my-2 sm:my-3 select-none">
            {targetLetters.map((letter: string, idx: number) => {
              const letterIndexInTapped = tappedIndices[idx];
              const tappedVal = letterIndexInTapped !== undefined ? shuffledPool[letterIndexInTapped] : '';
              
              let borderClass = 'border-high-ink';
              if (feedback === 'correct') {
                borderClass = 'border-[#6BCB77] bg-emerald-100 dark:bg-emerald-950/30 text-[#6BCB77]';
              } else if (feedback === 'wrong') {
                borderClass = 'border-[#FF6B6B] bg-red-100 dark:bg-red-950/30 text-[#FF6B6B] animate-bounce';
              } else {
                borderClass = tappedVal ? 'bg-slate-100 dark:bg-slate-700' : 'bg-white dark:bg-slate-800 border-dashed border-3';
              }

              return (
                <div
                  key={idx}
                  className={`w-11 h-11 sm:w-12 sm:h-12 border-4 rounded-xl flex items-center justify-center font-black text-lg uppercase transition-all duration-200 ${borderClass}`}
                >
                  {tappedVal}
                </div>
              );
            })}
          </div>

          {/* Shuffled letter bubbles pool */}
          <div className="flex flex-wrap justify-center gap-2.5 max-w-sm my-2">
            {shuffledPool.map((letter, idx) => {
              const isTapped = tappedIndices.includes(idx);
              
              return (
                <button
                  key={idx}
                  onClick={() => handleLetterTap(idx)}
                  disabled={isTapped || feedback === 'correct'}
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full border-4 border-high-ink shadow-[0_3px_0_#2D3436] font-black text-lg uppercase flex items-center justify-center transition-all cursor-pointer ${
                    isTapped
                      ? 'bg-slate-200 dark:bg-slate-700 text-transparent border-slate-300 shadow-none translate-y-[3px] opacity-40 pointer-events-none'
                      : 'bg-[#4D96FF] text-white hover:translate-y-[-1px] hover:shadow-[0_4px_0_#2D3436] active:translate-y-[2px] active:shadow-[0_1px_0_#2D3436]'
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>

          {/* Controller footer button bar */}
          <div className="w-full flex justify-between items-center border-t border-slate-100 dark:border-slate-700 pt-3.5 mt-2">
            <button
              onClick={handleClearSpelling}
              disabled={feedback === 'correct' || tappedIndices.length === 0}
              className={`bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-high-ink dark:text-white font-black py-1.5 px-3 rounded-xl border-2 border-high-ink shadow-[0_2px_0_#2D3436] hover:translate-y-[-1px] hover:shadow-[0_3px_0_#2D3436] active:translate-y-[1px] active:shadow-[0_1px_0_#2D3436] transition-all text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:pointer-events-none select-none`}
            >
              <RotateCcw className="w-4 h-4" />
              <span>{activeTab === 'english' ? 'Reset' : 'ફરીથી'}</span>
            </button>

            <button
              onClick={handleNextHelper}
              className="bg-[#6BCB77] hover:bg-[#5bba67] text-white font-black py-1.5 px-3.5 rounded-xl border-2 border-high-ink shadow-[0_2px_0_#2D3436] hover:translate-y-[-1px] hover:shadow-[0_3px_0_#2D3436] active:translate-y-[1px] active:shadow-[0_1px_0_#2D3436] transition-all text-xs flex items-center gap-1 cursor-pointer select-none"
            >
              <span>{activeTab === 'english' ? 'Skip ➔' : 'છોડો ➔'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="text-slate-400 font-bold py-8">Loading word...</div>
      )}
    </div>
  );
}

// Words and Emojis definition lists
const ENGLISH_GUESS_WORDS = [
  // Easy (3-letter)
  { word: 'CAT', emoji: '🐱', level: 'easy' },
  { word: 'DOG', emoji: '🐶', level: 'easy' },
  { word: 'SUN', emoji: '☀️', level: 'easy' },
  { word: 'VAN', emoji: '🚐', level: 'easy' },
  { word: 'HAT', emoji: '🎩', level: 'easy' },
  { word: 'PIG', emoji: '🐷', level: 'easy' },
  { word: 'TOY', emoji: '🧸', level: 'easy' },
  { word: 'FOX', emoji: '🦊', level: 'easy' },
  { word: 'CUP', emoji: '🥛', level: 'easy' },
  { word: 'PEN', emoji: '🖊️', level: 'easy' },
  // Medium (4-letter)
  { word: 'BALL', emoji: '⚽', level: 'medium' },
  { word: 'FISH', emoji: '🐟', level: 'medium' },
  { word: 'LION', emoji: '🦁', level: 'medium' },
  { word: 'FROG', emoji: '🐸', level: 'medium' },
  { word: 'DUCK', emoji: '🦆', level: 'medium' },
  { word: 'CAKE', emoji: '🍰', level: 'medium' },
  { word: 'STAR', emoji: '⭐', level: 'medium' },
  { word: 'WIND', emoji: '💨', level: 'medium' },
  { word: 'RING', emoji: '💍', level: 'medium' },
  { word: 'KITE', emoji: '🪁', level: 'medium' },
  // Hard (5+)
  { word: 'APPLE', emoji: '🍎', level: 'hard' },
  { word: 'GRAPES', emoji: '🍇', level: 'hard' },
  { word: 'TIGER', emoji: '🐯', level: 'hard' },
  { word: 'ORANGE', emoji: '🍊', level: 'hard' },
  { word: 'PARROT', emoji: '🦜', level: 'hard' },
  { word: 'RABBIT', emoji: '🐰', level: 'hard' },
  { word: 'MONKEY', emoji: '🐒', level: 'hard' },
  { word: 'BANANA', emoji: '🍌', level: 'hard' },
];

const GUJARATI_GUESS_WORDS = [
  // Easy
  { word: 'ઘર', letters: ['ઘ', 'ર'], emoji: '🏠', level: 'easy' },
  { word: 'નળ', letters: ['ન', 'ળ'], emoji: '🚰', level: 'easy' },
  { word: 'રથ', letters: ['ર', 'થ'], emoji: '🐎', level: 'easy' },
  { word: 'થડ', letters: ['થ', 'ડ'], emoji: '🪵', level: 'easy' },
  { word: 'દડો', letters: ['દ', 'ડો'], emoji: '⚽', level: 'easy' },
  // Medium
  { word: 'મગર', letters: ['મ', 'ગ', 'ર'], emoji: '🐊', level: 'medium' },
  { word: 'કમળ', letters: ['ક', 'મ', 'ળ'], emoji: '🪷', level: 'medium' },
  { word: 'બતક', letters: ['બ', 'ત', 'ક'], emoji: '🦆', level: 'medium' },
  { word: 'હરણ', letters: ['હ', 'ર', 'ણ'], emoji: '🦌', level: 'medium' },
  { word: 'પતંગ', letters: ['પ', 'તં', 'ગ'], emoji: '🪁', level: 'medium' },
  // Hard
  { word: 'ચકલી', letters: ['ચ', 'ક', 'લી'], emoji: '🐦', level: 'hard' },
  { word: 'છત્રી', letters: ['છ', 'ત્રી'], emoji: '☔', level: 'hard' },
  { word: 'જલેબી', letters: ['જ', 'લે', 'બી'], emoji: '🍥', level: 'hard' },
  { word: 'ટમેટું', letters: ['ટ', 'મે', 'ટું'], emoji: '🍅', level: 'hard' },
  { word: 'વહાણ', letters: ['વ', 'હા', 'ણ'], emoji: '⛵', level: 'hard' },
  { word: 'સસલું', letters: ['સ', 'સ', 'લું'], emoji: '🐇', level: 'hard' },
  { word: 'અનાનસ', letters: ['અ', 'ના', 'ન', 'સ'], emoji: '🍍', level: 'hard' },
  { word: 'ઇમારત', letters: ['ઇ', 'મા', 'ર', 'ત'], emoji: '🏢', level: 'hard' },
];
