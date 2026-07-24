import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Settings, Flame, Trophy, Lock, Award, CheckCircle, BarChart3, X } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { ScreenType, AppSettings, AvatarConfig } from '../types';
import { playClickSound, playSuccessSound } from '../utils/audio';
import { UserProgress, ACHIEVEMENTS, Achievement } from '../utils/userState';
import { 
  toGujaratiNumberString,
  ENGLISH_ABC,
  ENGLISH_WORDS,
  GUJARATI_VOWELS,
  GUJARATI_CONSONANTS,
  GUJARATI_NUMBERS,
  GUJARATI_BARAKHADI_MATRAS,
  getEnglishNumberSpelling
} from '../data';
import CategoryCard from './CategoryCard';
import AvatarPreview from './AvatarPreview';
import AvatarCustomizer from './AvatarCustomizer';
import ChildGuideTour from './ChildGuideTour';
import ChikuMascot from './ChikuMascot';
import HeroHeader from './HeroHeader';

interface HomeScreenProps {
  settings: AppSettings;
  progress: UserProgress;
  unlockedAchievementsQueue: string[];
  onClearAchievementFromQueue: (id: string) => void;
  onSelectScreen: (screen: ScreenType, quizLanguage?: 'en' | 'gu', initialQuizCategory?: string, initialIndex?: number) => void;
  onUpdateAvatar: (config: AvatarConfig) => void;
  activeTab: 'gujarati' | 'english';
  setActiveTab: (tab: 'gujarati' | 'english') => void;
  savedScrollY?: number | null;
  onClearSavedScroll?: () => void;
}



export default function HomeScreen({ 
  settings, 
  progress, 
  unlockedAchievementsQueue, 
  onClearAchievementFromQueue, 
  onSelectScreen,
  onUpdateAvatar,
  activeTab,
  setActiveTab,
  savedScrollY,
  onClearSavedScroll
}: HomeScreenProps) {
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [showParentalGate, setShowParentalGate] = useState(false);
  const [parentalMathProblem, setParentalMathProblem] = useState<{ num1: number; num2: number; op: '+' | '-'; answer: number } | null>(null);
  const [parentalInput, setParentalInput] = useState('');
  const [parentalError, setParentalError] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  // Restore scroll position when returning to the Home Screen
  useEffect(() => {
    if (savedScrollY !== null && savedScrollY !== undefined) {
      // Use instant scrolling so there is no visual jump
      const timer1 = setTimeout(() => {
        window.scrollTo(0, savedScrollY);
      }, 30);

      const timer2 = setTimeout(() => {
        window.scrollTo(0, savedScrollY);
        if (onClearSavedScroll) {
          onClearSavedScroll();
        }
      }, 120);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [savedScrollY, onClearSavedScroll]);

  // Auto-run animated guide on first mount if not completed before
  useEffect(() => {
    const completed = localStorage.getItem('kids_learning_guide_completed');
    if (completed !== 'true') {
      const timer = setTimeout(() => {
        setShowGuide(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const generateParentalGate = () => {
    const num1 = Math.floor(Math.random() * 41) + 30; // 30 to 70
    const num2 = Math.floor(Math.random() * 21) + 10; // 10 to 30
    const op = Math.random() > 0.5 ? '+' : '-';
    const answer = op === '+' ? num1 + num2 : num1 - num2;
    
    setParentalMathProblem({ num1, num2, op, answer });
    setParentalInput('');
    setParentalError(false);
    setShowParentalGate(true);
  };
  
  const handleSelect = (screen: ScreenType) => {
    playClickSound(settings.soundEnabled);
    if (screen === ScreenType.Settings) {
      generateParentalGate();
      return;
    }
    if (screen === ScreenType.Quiz) {
      onSelectScreen(screen, activeTab === 'english' ? 'en' : 'gu');
    } else {
      onSelectScreen(screen);
    }
  };

  // Play success sound when a new achievement celebration popup shows up
  useEffect(() => {
    if (unlockedAchievementsQueue.length > 0) {
      playSuccessSound(settings.soundEnabled);
    }
  }, [unlockedAchievementsQueue.length]);

  // Topic totals mapping
  const getCategoryTotalItems = (type: ScreenType): number => {
    switch (type) {
      case ScreenType.EnglishABC: return 52;
      case ScreenType.EnglishABCLower: return 26;
      case ScreenType.EnglishWords: return 26;
      case ScreenType.EnglishNumbers: return 100;
      case ScreenType.EnglishSpellings: return 100;
      case ScreenType.GujaratiAlphabet: return 49;
      case ScreenType.GujaratiBarakhadi: return 432;
      case ScreenType.GujaratiNumbers: return 100;
      case ScreenType.GujaratiGhadiya: return 20;
      case ScreenType.EnglishTables: return 20;
      case ScreenType.InteractiveStories: return 3;
      case ScreenType.InteractiveStoriesGuj: return 3;
      default: return 0;
    }
  };

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

  // Cute cards mapping for categories
  const categories = [
    // --- ENGLISH CATEGORIES ---
    {
      type: ScreenType.EnglishABC,
      title: 'English Alphabet',
      subtitle: 'Learn A-Z & Lowercase',
      emoji: '🔤',
      gradient: 'from-[#FF5E62] via-[#FF758C] to-[#FF7EB3]',
      badge: 'ABC',
      decorations: ['✨', '🅰️']
    },
    {
      type: ScreenType.EnglishWords,
      title: 'English Words',
      subtitle: 'A for Apple, B for Ball 🍎',
      emoji: '🦁',
      gradient: 'from-[#00c6ff] via-[#0072ff] to-[#3a7bd5]',
      badge: 'LEARN',
      decorations: ['🍎', '🦁']
    },
    {
      type: ScreenType.EnglishSpellings,
      title: 'English Numbers With Spellings',
      subtitle: '1 – One, 2 – Two ✏️',
      emoji: '✏️',
      gradient: 'from-[#11998e] via-[#38ef7d] to-[#00b09b]',
      badge: 'WORDS',
      decorations: ['✏️', '1️⃣']
    },
    {
      type: ScreenType.EnglishNumbers,
      title: 'English Numbers',
      subtitle: 'Count 1 to 100 🔟',
      emoji: '🔢',
      gradient: 'from-[#8E2DE2] via-[#B10DC9] to-[#4A00E0]',
      badge: '1-100',
      decorations: ['🔢', '🔟']
    },
    {
      type: ScreenType.EnglishTables,
      title: 'English Tables',
      subtitle: '1 to 20 Math Tables 📈',
      emoji: '📈',
      gradient: 'from-[#FF8008] via-[#FF9F43] to-[#FFC837]',
      badge: '1-20',
      decorations: ['📈', '✖️']
    },
    {
      type: ScreenType.InteractiveStories,
      title: 'English Stories',
      subtitle: 'Read & Choose Adventures 📚',
      emoji: '📖',
      gradient: 'from-[#f857a6] via-[#ff5858] to-[#ff851b]',
      badge: 'STORY',
      decorations: ['📖', '👑']
    },

    // --- GUJARATI CATEGORIES ---
    {
      type: ScreenType.GujaratiAlphabet,
      title: 'ગુજરાતી કક્કો',
      subtitle: 'અ, આ, ઇ, ક, ખ, ગ...',
      emoji: '🕉️',
      gradient: 'from-[#FF512F] via-[#F09819] to-[#DD2476]',
      badge: 'કક્કો',
      decorations: ['🕉️', '☁️']
    },
    {
      type: ScreenType.GujaratiBarakhadi,
      title: 'ગુજરાતી બારાખડી',
      subtitle: 'ક, કા, કિ, કી, કુ...',
      emoji: '📚',
      gradient: 'from-[#1FA2FF] via-[#12D8FA] to-[#0DA1C9]',
      badge: 'બારાખડી',
      decorations: ['📚', '✨']
    },
    {
      type: ScreenType.GujaratiNumbers,
      title: 'ગુજરાતી અંક',
      subtitle: '૧, ૨, ૩... ૧૦૦',
      emoji: '🍇',
      gradient: 'from-[#f857a6] via-[#ff5858] to-[#ff851b]',
      badge: '૧–૧૦૦',
      decorations: ['🍇', '🔢']
    },
    {
      type: ScreenType.GujaratiGhadiya,
      title: 'ગુજરાતી ઘડિયા',
      subtitle: '૧ થી ૨૦ ના ઘડિયા અને અંકોના શબ્દો 📚',
      emoji: '🧮',
      gradient: 'from-[#654ea3] via-[#eaafc8] to-[#8e2de2]',
      badge: 'ઘડિયા',
      decorations: ['🧮', '✨']
    },
    {
      type: ScreenType.InteractiveStoriesGuj,
      title: 'ગુજરાતી વાર્તાઓ',
      subtitle: 'વાર્તાઓ અને રોમાંચક પસંદગીઓ 📚',
      emoji: '📖',
      gradient: 'from-[#FF8008] via-[#FF9F43] to-[#FFC837]',
      badge: 'વાર્તાઓ',
      decorations: ['📖', '👑']
    },

    // --- COMMON INTERACTIVE CATEGORIES ---
    {
      type: ScreenType.Quiz,
      title: activeTab === 'gujarati' ? 'ગુજરાતી ક્વિઝ' : 'Play Quiz',
      subtitle: activeTab === 'gujarati' ? 'તારા કમાઓ અને જીતો! 🏆' : 'Score Points & Win Trophies! 🏆',
      emoji: '🎯',
      gradient: 'from-[#FFD200] via-[#F7971E] to-[#FF9F43]',
      badge: activeTab === 'gujarati' ? 'ક્વિઝ' : 'QUIZ',
      decorations: ['🎯', '🏆']
    },
    {
      type: ScreenType.Games,
      title: activeTab === 'gujarati' ? 'ગુજરાતી રમત ઘર' : 'Games Room',
      subtitle: activeTab === 'gujarati' ? 'અક્ષર, અંક અને ટ્રેસિંગ! 🎨' : '3 Fun Educational Games! 🧩',
      emoji: '🧩',
      gradient: 'from-[#00b09b] via-[#96c93d] to-[#4D96FF]',
      badge: activeTab === 'gujarati' ? 'રમતો' : 'GAME',
      decorations: ['🧩', '🎨']
    },
    {
      type: ScreenType.WordMatching,
      title: activeTab === 'gujarati' ? 'ગુજરાતી આર્કેડ' : 'Kids Arcade',
      subtitle: activeTab === 'gujarati' ? 'મજા સાથે શીખો! 🎮' : '4 Arcade Learning Games! 🎮',
      emoji: '🎮',
      gradient: 'from-[#ec008c] via-[#ae23bc] to-[#fc6767]',
      badge: activeTab === 'gujarati' ? 'આર્કેડ' : 'PLAY',
      decorations: ['🎮', '🕹️']
    },
    {
      type: ScreenType.TraceAlphabet,
      title: activeTab === 'gujarati' ? 'અક્ષર લખતા શીખો' : 'Trace Alphabet',
      subtitle: activeTab === 'gujarati' ? 'અક્ષરો અને અંકો લખો! ✍️' : 'Write Letters & Numbers! ✍️',
      emoji: '✍️',
      gradient: 'from-[#FF416C] via-[#FF4B2B] to-[#FF851B]',
      badge: activeTab === 'gujarati' ? 'લખતા શીખો' : 'TRACE',
      decorations: ['✍️', '✏️']
    },
    {
      type: ScreenType.WeeklyProgress,
      title: activeTab === 'gujarati' ? 'સાપ્તાહિક પ્રગતિ' : 'Weekly Progress',
      subtitle: activeTab === 'gujarati' ? 'તમારી શાનદાર પ્રગતિ જુઓ! 📈' : 'Check Your Learning Stats! 📈',
      emoji: '📊',
      gradient: activeTab === 'gujarati' ? 'from-[#3A1C71] via-[#D76D77] to-[#FFAF7B]' : 'from-[#4776E6] via-[#8E54E9] to-[#4E65FF]',
      badge: activeTab === 'gujarati' ? 'પ્રગતિ' : 'PROGRESS',
      decorations: ['📊', '📈']
    },
    {
      type: ScreenType.AchievementsShelf,
      title: activeTab === 'gujarati' ? 'સિદ્ધિઓ' : 'Achievements Shelf',
      subtitle: activeTab === 'gujarati' ? 'તમારા એવોર્ડ અને ટ્રોફી જુઓ! ⭐' : 'Your Badges & Trophies! ⭐',
      emoji: '🏆',
      gradient: 'from-[#F7971E] via-[#FFD200] to-[#FFB703]',
      badge: activeTab === 'gujarati' ? 'સિદ્ધિઓ' : 'BADGE',
      decorations: ['🏆', '👑']
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 25, opacity: 0, scale: 0.95 },
    show: { 
      y: 0, 
      opacity: 1, 
      scale: 1,
      transition: { type: 'spring', stiffness: 100, damping: 12 }
    }
  };

  // Get first new achievement from queue
  const currentCelebratingAchievement = unlockedAchievementsQueue.length > 0 
    ? ACHIEVEMENTS.find(a => a.id === unlockedAchievementsQueue[0]) 
    : null;

  return (
    <div className="min-h-screen pb-20 flex flex-col items-center px-4 relative overflow-x-hidden transition-all duration-500 ease-in-out" style={{ background: 'var(--bg-gradient, var(--high-bg))', color: 'var(--high-ink)' }}>
      
      {/* Playful top clouds pattern */}
      <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-[#4D96FF]/20 to-transparent -z-10 overflow-hidden" />

      {/* Redesigned Hero Header Card */}
      <HeroHeader 
        soundEnabled={settings.soundEnabled}
        onPlayTour={() => setShowGuide(true)}
        userProgress={progress}
      />

      {/* Friendly Animated Mascot */}
      <ChikuMascot 
        lang={activeTab === 'english' ? 'en' : 'gu'}
        soundEnabled={settings.soundEnabled}
        context="home"
        className="mb-6 z-10"
      />

      {/* Customize Profile Card - Redesigned Little Explorer Card */}
      <div className="w-full max-w-4xl z-10 mt-2 flex justify-center">
        <div 
          id="avatar-customizer-card" 
          className="w-full bg-gradient-to-br from-[#8E2DE2] via-[#6a11cb] to-[#2575fc] rounded-[1.5rem] sm:rounded-[1.75rem] py-3.5 px-4 sm:py-4.5 sm:px-6 md:py-5 md:px-7 border-4 border-high-ink shadow-[0_6px_0_#2D3436] hover:shadow-[0_9px_0_#2D3436] flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 group select-none"
        >
          {/* Gloss Reflection Overlay */}
          <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/30 via-white/10 to-transparent pointer-events-none rounded-t-[1.4rem]" />

          {/* Decorative Floating Sparkles, Clouds, Stars */}
          <span className="absolute top-2 left-3 text-lg opacity-35 pointer-events-none animate-pulse">☁️</span>
          <span className="absolute bottom-2 left-1/3 text-base opacity-35 pointer-events-none">✨</span>
          <span className="absolute top-3 right-12 text-xl opacity-30 pointer-events-none animate-bounce">⭐</span>
          <span className="absolute bottom-1.5 right-3 text-lg opacity-35 pointer-events-none">🎈</span>

          {/* Mascot / Avatar with Glow & Sparkles */}
          <motion.button 
            type="button"
            whileHover={{ scale: 1.08, rotate: 3 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => {
              playClickSound(settings.soundEnabled);
              setShowCustomizer(true);
            }}
            className="group/avatar relative cursor-pointer flex justify-center items-center shrink-0 z-10"
            title="Customize your avatar! 🎨"
          >
            {/* Soft Glow behind avatar */}
            <div className="absolute -inset-1.5 bg-white/30 rounded-full blur-md animate-pulse group-hover/avatar:bg-amber-300/50 transition-colors" />

            {/* Avatar Wrapper */}
            <div className="relative z-10 p-1 sm:p-1.5 bg-white/20 backdrop-blur-md rounded-full border-2 sm:border-3 border-white/60 shadow-[0_3px_0_rgba(0,0,0,0.2)]">
              <AvatarPreview 
                config={progress.avatar || {
                  playerName: 'Little Explorer',
                  shape: 'circle',
                  bgColor: 'bg-[#FFD93D]',
                  emoji: '⭐',
                  borderColor: 'border-[#2D3436]',
                  borderStyle: 'solid'
                }} 
                size="md" 
              />
            </div>

            {/* Floating Edit Badge */}
            <span className="absolute -bottom-0.5 -right-0.5 bg-amber-300 text-high-ink text-[10px] sm:text-xs p-1 rounded-lg border-2 border-high-ink font-black group-hover/avatar:scale-125 transition-transform shadow-[0_2px_0_#2D3436] z-20 flex items-center justify-center">
              🎨
            </span>
          </motion.button>

          {/* Center Text Section */}
          <div className="z-10 text-center sm:text-left flex-1">
            <div className="inline-flex items-center gap-1 bg-white/25 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/40 shadow-xs mb-1">
              <span className="text-[10px]">✨</span>
              <span className="text-[9px] sm:text-[10px] font-black uppercase text-white tracking-widest">
                {activeTab === 'gujarati' ? 'તમારું પ્રોફાઇલ' : 'MY PROFILE'}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white filter drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)] leading-tight">
              👋 {activeTab === 'gujarati' ? 'નમસ્તે' : 'Hi'}, <span className="text-amber-300">{progress.avatar?.playerName || (activeTab === 'gujarati' ? 'નાના બાળ' : 'Little Explorer')}</span>!
            </h3>
            <p className="text-[11px] sm:text-xs font-extrabold text-white/95 filter drop-shadow-xs mt-0.5 leading-snug">
              {activeTab === 'gujarati' ? 'આજે કંઈક નવું અને અદ્ભુત શીખવા તૈયાર છો?' : 'Ready to learn something amazing today?'}
            </p>
          </div>

          {/* Right: Customize Avatar Button */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95, y: 2 }}
            onClick={() => {
              playClickSound(settings.soundEnabled);
              setShowCustomizer(true);
            }}
            className="z-10 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-300 hover:to-orange-400 text-high-ink font-black py-2 px-4 sm:py-2.5 sm:px-5 rounded-full border-3 border-high-ink shadow-[0_3px_0_#2D3436] active:shadow-[0_1px_0_#2D3436] transition-all flex items-center gap-1.5 text-[11px] sm:text-xs uppercase tracking-wider cursor-pointer shrink-0"
          >
            <span className="text-sm sm:text-base animate-bounce">🎨</span>
            <span>{activeTab === 'gujarati' ? 'અવતાર બદલો' : 'Customize Avatar'}</span>
          </motion.button>
        </div>
      </div>

      {/* Daily Quiz Challenge Banner - Redesigned Daily Challenge Card */}
      {(() => {
        const todayDate = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;
        const isCompletedToday = progress.dailyQuizLastCompletedDate === todayDate;

        return (
          <div id="daily-quiz-banner" className="w-full max-w-4xl z-10 mt-4 mb-2">
            <motion.div 
              whileHover={{ y: -3 }}
              className="bg-gradient-to-r from-[#FFD200] via-[#FF9F43] to-[#FF5252] rounded-[1.5rem] sm:rounded-[1.75rem] py-3.5 px-4 sm:py-4.5 sm:px-6 md:py-5 md:px-7 border-4 border-high-ink shadow-[0_6px_0_#2D3436] hover:shadow-[0_9px_0_#2D3436] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-3.5 sm:gap-4 transition-all duration-300 group select-none"
            >
              {/* Gloss Reflection Overlay */}
              <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/35 via-white/10 to-transparent pointer-events-none rounded-t-[1.4rem]" />

              {/* Watermarks & Floating Bubbles/Sparkles */}
              <div className="absolute -right-4 -bottom-4 text-7xl opacity-10 pointer-events-none select-none rotate-12 group-hover:scale-110 transition-transform duration-700">
                🏆
              </div>
              <div className="absolute top-2 right-1/4 text-6xl opacity-10 pointer-events-none select-none -rotate-12">
                🎯
              </div>
              <span className="absolute top-1.5 left-8 text-xl opacity-40 pointer-events-none animate-pulse">✨</span>
              <span className="absolute bottom-2 left-1/3 text-lg opacity-30 pointer-events-none">🎈</span>

              {/* Top Right Reward Badge */}
              <div className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-4 z-20">
                <span className="bg-amber-300 text-high-ink border-2 border-high-ink shadow-[0_2px_0_#2D3436] rounded-full px-2.5 py-1 text-[10px] sm:text-xs font-black uppercase tracking-widest flex items-center gap-1 animate-bounce">
                  <span>🏆</span>
                  <span>{isCompletedToday ? (activeTab === 'gujarati' ? 'પૂર્ણ ✅' : 'CLEARED ✅') : '+3 Stars ⭐'}</span>
                </span>
              </div>

              {/* Left: Challenge Icon & Info */}
              <div className="flex items-center gap-3 sm:gap-4 text-center md:text-left flex-col md:flex-row z-10 flex-1">
                {/* Large Premium Animated Challenge Icon Box */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl bg-white/30 backdrop-blur-md border-3 border-white/70 shadow-[0_4px_0_rgba(0,0,0,0.15)] flex items-center justify-center text-2xl sm:text-3xl md:text-4xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shrink-0 relative">
                  <span className="animate-pulse">🎯</span>
                  <div className="absolute -inset-1 bg-amber-300/30 rounded-2xl blur-md pointer-events-none -z-10" />
                </div>

                <div className="pr-0 md:pr-12">
                  <div className="flex items-center gap-1.5 justify-center md:justify-start mb-0.5">
                    <span className="bg-black/25 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-black uppercase py-0.5 px-2.5 rounded-full tracking-widest border border-white/30 shadow-xs">
                      {activeTab === 'gujarati' ? 'દૈનિક પડકાર' : 'DAILY CHALLENGE'}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white filter drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)] leading-tight">
                    🎯 {activeTab === 'gujarati' ? 'દૈનિક ક્વિઝ પડકાર' : 'Daily Challenge'}
                  </h3>

                  <p className="text-[11px] sm:text-xs md:text-sm font-extrabold text-white/95 filter drop-shadow-xs mt-0.5 max-w-lg leading-snug">
                    {isCompletedToday
                      ? (activeTab === 'gujarati' 
                          ? 'શાનદાર! તમે આજનો દૈનિક પડકાર પૂર્ણ કર્યો છે! 🌟' 
                          : "Awesome job! You completed today's challenge and earned bonus stars! 🌟")
                      : (activeTab === 'gujarati' 
                          ? 'આજની મજેદાર પ્રવૃત્તિ પૂર્ણ કરો અને બોનસ તારા મેળવો! ⭐' 
                          : "Complete today's fun activity and earn bonus stars!")
                    }
                  </p>
                </div>
              </div>

              {/* Right: Start Challenge Button */}
              <div className="w-full md:w-auto shrink-0 z-10 flex justify-center">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95, y: 2 }}
                  onClick={() => {
                    playClickSound(settings.soundEnabled);
                    onSelectScreen(ScreenType.Quiz, activeTab === 'english' ? 'en' : 'gu', 'daily_challenge');
                  }}
                  className={`font-black py-2.5 px-6 sm:px-8 rounded-xl sm:rounded-2xl border-3 border-high-ink shadow-[0_3px_0_#2D3436] active:shadow-[0_1px_0_#2D3436] transition-all text-sm sm:text-base md:text-lg flex items-center justify-center gap-2 cursor-pointer w-full md:w-auto uppercase tracking-wider ${
                    isCompletedToday
                      ? 'bg-white hover:bg-slate-100 text-high-ink'
                      : 'bg-gradient-to-r from-[#FF416C] to-[#FF4B2B] text-white hover:brightness-110'
                  }`}
                >
                  <span className="text-lg sm:text-xl animate-bounce">🚀</span>
                  <span>
                    {isCompletedToday 
                      ? (activeTab === 'gujarati' ? 'ફરીથી રમો 🔄' : 'Replay Challenge 🔄') 
                      : (activeTab === 'gujarati' ? 'શરૂ કરો 🚀' : 'Start Challenge')
                    }
                  </span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        );
      })()}



      {/* Category Bento Grid */}
      <main className="w-full max-w-4xl">
        <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-wide mb-4 uppercase flex items-center justify-center gap-2 text-center">
          <span>📚</span> Categories
        </h3>

        {/* Segmented Category Tabs */}
        <div id="language-tabs-container" className="flex justify-center mb-8">
          <div className="bg-white dark:bg-slate-800 p-2 rounded-2xl border-4 border-high-ink shadow-[0_4px_0_#2D3436] flex items-center gap-2 select-none">
            <button
              onClick={() => {
                playClickSound(settings.soundEnabled);
                setActiveTab('gujarati');
              }}
              className={`font-black px-6 py-2.5 rounded-xl text-base transition-all cursor-pointer ${
                activeTab === 'gujarati'
                  ? 'bg-[#FF851B] text-white border-3 border-high-ink shadow-[0_3px_0_#2D3436] -translate-y-0.5'
                  : 'text-slate-500 dark:text-slate-400 hover:text-high-ink hover:translate-y-[-1px] border-3 border-transparent'
              }`}
            >
              Gujarati
            </button>
            <button
              onClick={() => {
                playClickSound(settings.soundEnabled);
                setActiveTab('english');
              }}
              className={`font-black px-6 py-2.5 rounded-xl text-base transition-all cursor-pointer ${
                activeTab === 'english'
                  ? 'bg-[#4D96FF] text-white border-3 border-high-ink shadow-[0_3px_0_#2D3436] -translate-y-0.5'
                  : 'text-slate-500 dark:text-slate-400 hover:text-high-ink hover:translate-y-[-1px] border-3 border-transparent'
              }`}
            >
              English
            </button>
          </div>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6 w-full max-w-4xl"
        >
          {categories
            .filter((cat) => {
              if (activeTab === 'gujarati') {
                return (
                  cat.type === ScreenType.GujaratiAlphabet ||
                  cat.type === ScreenType.GujaratiBarakhadi ||
                  cat.type === ScreenType.GujaratiNumbers ||
                  cat.type === ScreenType.GujaratiGhadiya ||
                  cat.type === ScreenType.InteractiveStoriesGuj ||
                  cat.type === ScreenType.TraceAlphabet ||
                  cat.type === ScreenType.Quiz ||
                  cat.type === ScreenType.Games ||
                  cat.type === ScreenType.WordMatching ||
                  cat.type === ScreenType.WeeklyProgress ||
                  cat.type === ScreenType.AchievementsShelf
                );
              } else {
                return (
                  cat.type === ScreenType.EnglishABC ||
                  cat.type === ScreenType.EnglishWords ||
                  cat.type === ScreenType.EnglishNumbers ||
                  cat.type === ScreenType.EnglishSpellings ||
                  cat.type === ScreenType.EnglishTables ||
                  cat.type === ScreenType.InteractiveStories ||
                  cat.type === ScreenType.TraceAlphabet ||
                  cat.type === ScreenType.Quiz ||
                  cat.type === ScreenType.Games ||
                  cat.type === ScreenType.WordMatching ||
                  cat.type === ScreenType.WeeklyProgress ||
                  cat.type === ScreenType.AchievementsShelf
                );
              }
            })
            .map((cat) => {
              const totalItems = getCategoryTotalItems(cat.type);
              const completedCount = cat.type === ScreenType.EnglishABC
                ? (progress.completedItems[ScreenType.EnglishABC]?.length || 0) + (progress.completedItems[ScreenType.EnglishABCLower]?.length || 0)
                : cat.type === ScreenType.AchievementsShelf
                ? progress.unlockedAchievements?.length || 0
                : progress.completedItems[cat.type]?.length || 0;

              const isStoriesCard = cat.type === ScreenType.InteractiveStories || cat.type === ScreenType.InteractiveStoriesGuj;
              const isAchievementsCard = cat.type === ScreenType.AchievementsShelf;
              const cardId = isStoriesCard ? 'stories-category-card' : isAchievementsCard ? 'achievements-shelf-card' : undefined;

              return (
                <motion.div key={cat.type} variants={itemVariants} className="w-full">
                  <CategoryCard 
                    id={cardId}
                    type={cat.type}
                    title={cat.title}
                    subtitle={cat.subtitle}
                    emoji={cat.emoji}
                    gradient={cat.gradient}
                    badge={cat.badge}
                    totalItems={totalItems}
                    completedCount={completedCount}
                    onClick={() => handleSelect(cat.type)}
                    activeTab={activeTab}
                    decorations={cat.decorations}
                  />
                </motion.div>
              );
            })}
        </motion.div>
      </main>

      {/* Settings trigger */}
      <footer className="mt-14 z-10 flex flex-col items-center">
        <button
          onClick={() => handleSelect(ScreenType.Settings)}
          className="comic-button-ink py-4 px-8 rounded-3xl font-extrabold text-lg flex items-center gap-3"
        >
          <Settings className="w-5 h-5 text-high-secondary animate-spin" style={{ animationDuration: '6s' }} />
          <span>App Settings</span>
        </button>
      </footer>

      {/* Achievement Celebratory Dialog Overlay */}
      <AnimatePresence>
        {currentCelebratingAchievement && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ type: 'spring', damping: 15 }}
              className="bg-white dark:bg-slate-800 rounded-[3rem] p-8 border-8 border-high-ink shadow-[0_12px_0_#2D3436] max-w-sm w-full text-center flex flex-col items-center relative overflow-hidden"
            >
              {/* Animated star backgrounds */}
              <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#FFD93D]/20 to-transparent -z-10" />

              {/* Huge animated badge */}
              <motion.div 
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className={`w-28 h-28 rounded-[2rem] bg-gradient-to-br ${currentCelebratingAchievement.color} border-6 border-high-ink flex items-center justify-center text-6xl shadow-[0_8px_0_#2D3436] mb-6 relative`}
              >
                {currentCelebratingAchievement.emoji}
                <Sparkles className="w-6 h-6 text-white absolute top-2 right-2 animate-ping" />
              </motion.div>

              <h3 className="text-[10px] font-black tracking-widest text-orange-500 uppercase">
                🏆 ACHIEVEMENT UNLOCKED! 🏆
              </h3>
              
              <h2 className="text-3xl font-black text-slate-800 dark:text-white mt-1 mb-2 leading-none">
                {currentCelebratingAchievement.title}
              </h2>

              <p className="text-sm font-bold text-slate-500 dark:text-slate-300 px-2 leading-snug">
                {currentCelebratingAchievement.description}
              </p>

              <div className="bg-green-50 dark:bg-green-950 border-2 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 font-extrabold text-xs py-2 px-5 rounded-xl mt-4 mb-6 uppercase tracking-wider">
                Earned with outstanding learning! 🌟
              </div>

              <button
                onClick={() => {
                  playClickSound(settings.soundEnabled);
                  onClearAchievementFromQueue(currentCelebratingAchievement.id);
                }}
                className="bg-[#6BCB77] hover:bg-[#5bba67] text-white font-black py-4 px-10 rounded-2xl border-4 border-high-ink shadow-[0_6px_0_#2D3436] hover:translate-y-[-2px] hover:shadow-[0_8px_0_#2D3436] active:translate-y-[2px] active:shadow-[0_2px_0_#2D3436] transition-all text-xl w-full flex items-center justify-center gap-2"
              >
                YAY! CELEBRATE 🎈
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Parental Gate Overlay */}
      <AnimatePresence>
        {showParentalGate && parentalMathProblem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 18 }}
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] border-8 border-high-ink shadow-[0_12px_0_#2D3436] max-w-md w-full overflow-hidden flex flex-col relative p-6 text-center"
            >
              {/* Close Button */}
              <button 
                type="button"
                onClick={() => {
                  playClickSound(settings.soundEnabled);
                  setShowParentalGate(false);
                }}
                className="absolute top-4 right-4 bg-slate-100 dark:bg-slate-800 text-high-ink dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 p-2 rounded-xl border-4 border-high-ink shadow-[0_3px_0_#2D3436] active:translate-y-[3px] active:shadow-none transition-all z-10"
              >
                <X className="w-4 h-4 stroke-[3.5]" />
              </button>

              <div className="flex flex-col items-center gap-3 mt-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950 border-4 border-high-ink flex items-center justify-center text-3xl shadow-[0_4px_0_#2D3436] animate-pulse">
                  🔐
                </div>
                <div>
                  <h3 className="font-black text-2xl text-slate-800 dark:text-white leading-none">Parents Only!</h3>
                  <p className="text-xs text-orange-500 font-black uppercase mt-1.5 tracking-wider">Parental Verification</p>
                </div>
              </div>

              <div className="my-6 p-5 bg-amber-50 dark:bg-amber-950/40 border-4 border-high-ink rounded-[2rem] shadow-[0_4px_0_#2D3436]">
                <p className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  Please solve this math problem to access App Settings:
                </p>
                <div className="font-black text-3xl tracking-tight text-[#4D96FF] dark:text-[#6BCB77] select-none py-2 bg-white dark:bg-slate-800 rounded-2xl border-4 border-high-ink inline-block px-6">
                  {parentalMathProblem.num1} {parentalMathProblem.op === '+' ? '+' : '-'} {parentalMathProblem.num2} = ?
                </div>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                playClickSound(settings.soundEnabled);
                const val = parseInt(parentalInput.trim(), 10);
                if (val === parentalMathProblem.answer) {
                  setShowParentalGate(false);
                  onSelectScreen(ScreenType.Settings);
                } else {
                  setParentalError(true);
                  setParentalInput('');
                }
              }} className="w-full flex flex-col gap-4">
                <input 
                  type="text"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  autoFocus
                  value={parentalInput}
                  onChange={(e) => {
                    setParentalInput(e.target.value);
                    if (parentalError) setParentalError(false);
                  }}
                  placeholder="Enter your answer..."
                  className={`w-full bg-white dark:bg-slate-700 font-black text-center text-xl text-high-ink dark:text-white px-4 py-3 rounded-2xl border-4 ${parentalError ? 'border-red-500 shadow-[0_3px_0_#EF4444]' : 'border-high-ink shadow-[0_4px_0_#2D3436]'} focus:outline-none focus:translate-y-[-1px] transition-all`}
                />

                {parentalError && (
                  <p className="text-sm font-black text-red-500 dark:text-red-400 animate-bounce">
                    ❌ Incorrect answer. Please try again!
                  </p>
                )}

                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound(settings.soundEnabled);
                      setShowParentalGate(false);
                    }}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-high-ink dark:text-white font-black py-3 rounded-2xl border-4 border-high-ink shadow-[0_4px_0_#2D3436] active:translate-y-[2px] active:shadow-[0_2px_0_#2D3436] transition-all text-sm uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#6BCB77] hover:bg-[#5bba67] text-white font-black py-3 rounded-2xl border-4 border-high-ink shadow-[0_4px_0_#2D3436] active:translate-y-[2px] active:shadow-[0_2px_0_#2D3436] transition-all text-sm uppercase tracking-wider"
                  >
                    Verify
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Avatar Customizer Dialog Overlay */}
      <AnimatePresence>
        {showCustomizer && (
          <AvatarCustomizer
            initialConfig={progress.avatar || {
              playerName: 'Little Explorer',
              shape: 'circle',
              bgColor: 'bg-[#FFD93D]',
              emoji: '⭐',
              borderColor: 'border-[#2D3436]',
              borderStyle: 'solid'
            }}
            settings={settings}
            onClose={() => setShowCustomizer(false)}
            onSave={(updatedConfig) => {
              onUpdateAvatar(updatedConfig);
              setShowCustomizer(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Interactive Child-friendly Tour Guide Overlay */}
      <AnimatePresence>
        {showGuide && (
          <ChildGuideTour 
            settings={settings}
            onClose={() => setShowGuide(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
