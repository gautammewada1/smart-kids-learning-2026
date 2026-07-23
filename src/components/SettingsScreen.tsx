import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, Sun, Volume2, VolumeX, Music, HelpCircle, RefreshCw, Play, Square, Check, Sparkles, MessageSquare, Info, X, Star, Send, Mail, Globe, Heart, MessageCircle, ExternalLink, Code, Award, Share2, ArrowLeft, Home } from 'lucide-react';
import { AppSettings, ScreenType, COLOR_PALETTES } from '../types';
import { getAvailableVoices, speakText, playClickSound, playSuccessSound, startBackgroundMusic, stopBackgroundMusic } from '../utils/audio';
import { applyThemeGlobal } from '../utils/theme';
import { ENGLISH_FONTS, getEnglishFont, applyEnglishFontGlobal } from '../utils/fonts';
import { UserProgress } from '../utils/userState';
import { 
  ENGLISH_ABC, 
  ENGLISH_WORDS, 
  GUJARATI_VOWELS, 
  GUJARATI_CONSONANTS, 
  GUJARATI_NUMBERS, 
  GUJARATI_BARAKHADI_MATRAS,
  getEnglishNumberSpelling,
  toGujaratiNumberString
} from '../data';

interface SettingsScreenProps {
  settings: AppSettings;
  progress: UserProgress;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onBackToHome: () => void;
}

const ENGLISH_PRESETS = [
  { label: "👋 Hello!", text: "Hi there! Let's explore and learn something fun today!" },
  { label: "🌟 Superstar!", text: "Woohoo! You did an amazing job! I am so proud of you!" },
  { label: "📖 Story Mode", text: "Once upon a time, there was a little clever cat who loved playing in the garden." },
  { label: "🔢 Let's Count", text: "One, two, three, four, five! Can you count with me?" }
];

const GUJARATI_PRESETS = [
  { label: "👋 નમસ્તે!", text: "કેમ છો બાળમિત્રો! આજે આપણે કંઈક નવું અને મજેદાર શીખીશું!" },
  { label: "🌟 શાબાશ!", text: "અરે વાહ! તમે ખૂબ જ સરસ પ્રયત્ન કર્યો! શાબાશ, બેટા!" },
  { label: "📖 વાર્તાનો સમય", text: "એક નાની સુંદર બિલાડી હતી. તે આખો દિવસ બગીચામાં પતંગિયા પાછળ દોડતી હતી." },
  { label: "🔢 ગણતરી કરીએ", text: "એક, બે, ત્રણ, ચાર, પાંચ! ચાલો સાથે મળીને ગણીએ!" }
];

const getFlagEmoji = (lang: string): string => {
  const l = lang.toLowerCase();
  if (l.includes('us')) return '🇺🇸';
  if (l.includes('gb') || l.includes('uk')) return '🇬🇧';
  if (l.includes('in')) return '🇮🇳';
  if (l.includes('ca')) return '🇨🇦';
  if (l.includes('au')) return '🇦🇺';
  if (l.includes('nz')) return '🇳🇿';
  if (l.includes('ie')) return '🇮🇪';
  if (l.includes('za')) return '🇿🇦';
  return '🗣️';
};



export default function SettingsScreen({ 
  settings, 
  progress, 
  onUpdateSettings, 
  onBackToHome
}: SettingsScreenProps) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [activeVoiceTab, setActiveVoiceTab] = useState<'en' | 'gu'>('en');
  const [customText, setCustomText] = useState<string>("Welcome to the Kids Learning App! You are doing an amazing job. Let's learn together!");
  const [isPlayingVoiceURI, setIsPlayingVoiceURI] = useState<string | null>(null);

  // Theme Preview state
  const [selectedPaletteKey, setSelectedPaletteKey] = useState<string>(
    settings.colorPalette || 'sunshine'
  );
  const [themeTab, setThemeTab] = useState<'light' | 'dark'>(() => {
    const key = settings.colorPalette || 'sunshine';
    const pal = COLOR_PALETTES[key] || COLOR_PALETTES.sunshine;
    return pal.isDark ? 'dark' : 'light';
  });
  const [isThemeApplied, setIsThemeApplied] = useState(false);

  // Feedback & About Dialog States
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [isBugReport, setIsBugReport] = useState<boolean>(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);
  const [isOfflineFeedback, setIsOfflineFeedback] = useState<boolean>(false);

  const handleOpenFeedback = () => {
    playClickSound(settings.soundEnabled);
    setFeedbackRating(5);
    setFeedbackText('');
    setIsBugReport(false);
    setFeedbackSubmitted(false);
    setIsOfflineFeedback(false);
    setIsFeedbackOpen(true);
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    playSuccessSound(settings.soundEnabled);

    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    setIsOfflineFeedback(!isOnline);

    const feedbackObj = {
      rating: feedbackRating,
      text: feedbackText,
      isBugReport,
      date: new Date().toISOString(),
      status: isOnline ? 'sent' : 'saved_offline',
    };

    try {
      const existing = JSON.parse(localStorage.getItem('kids_app_feedback_list') || '[]');
      existing.push(feedbackObj);
      localStorage.setItem('kids_app_feedback_list', JSON.stringify(existing));
    } catch (err) {
      console.error('Error saving feedback:', err);
    }

    if (isOnline) {
      const subject = encodeURIComponent(`Kids Learning App Feedback (${isBugReport ? 'Bug Report' : 'Suggestion'})`);
      const body = encodeURIComponent(`Rating: ${feedbackRating}/5 Stars\nType: ${isBugReport ? 'Bug Report' : 'Suggestion'}\n\nMessage:\n${feedbackText}`);
      window.location.href = `mailto:GautamMewada51@gmail.com?subject=${subject}&body=${body}`;
    }

    setFeedbackSubmitted(true);
  };

  const handleOpenAbout = () => {
    playClickSound(settings.soundEnabled);
    setIsAboutOpen(true);
  };

  const handleOpenRateApp = () => {
    playClickSound(settings.soundEnabled);
    setIsRateModalOpen(true);
  };

  const CONNECT_ITEMS = [
    {
      id: 'instagram',
      name: 'Instagram',
      subtitle: 'Follow us for app updates and educational content.',
      emoji: '📸',
      action: () => {
        playClickSound(settings.soundEnabled);
        window.open('https://www.instagram.com/gautammewada', '_blank', 'noopener,noreferrer');
      }
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      subtitle: 'Get instant app updates & announcements.',
      emoji: '💬',
      action: () => {
        playClickSound(settings.soundEnabled);
        window.open('https://whatsapp.com/channel/0029Vb8EKsS3WHTbtMdAKc2l', '_blank', 'noopener,noreferrer');
      }
    },
    {
      id: 'blog',
      name: 'Official Blog',
      subtitle: 'Explore free learning resources & activities.',
      emoji: '🌐',
      action: () => {
        playClickSound(settings.soundEnabled);
        window.open('https://gautammewada.blogspot.com', '_blank', 'noopener,noreferrer');
      }
    },
    {
      id: 'rate',
      name: 'Rate App',
      subtitle: 'Love the app? Give us 5 stars!',
      emoji: '⭐',
      action: handleOpenRateApp
    },
    {
      id: 'feedback',
      name: 'Feedback',
      subtitle: 'Share suggestions & bug reports.',
      emoji: '💡',
      action: handleOpenFeedback
    },
    {
      id: 'email',
      name: 'Email Support',
      subtitle: 'Contact developer directly',
      emoji: '📧',
      action: () => {
        playClickSound(settings.soundEnabled);
        window.location.href = 'mailto:GautamMewada51@gmail.com?subject=Kids%20Learning%20App%20Support';
      }
    }
  ];

  const LIGHT_THEME_KEYS = ['sunshine', 'skyblue', 'mintgreen', 'peachorange', 'lavenderpurple', 'candypink'];
  const DARK_THEME_KEYS = ['midnightblue', 'royalpurple', 'emeralddark', 'maroonmagic', 'tealblue'];

  const handleSelectTheme = (key: string) => {
    playClickSound(settings.soundEnabled);
    setSelectedPaletteKey(key);
    setIsThemeApplied(false);

    // Immediately transform theme globally
    applyThemeGlobal(key);

    // Live update settings across the whole application
    const pal = COLOR_PALETTES[key] || COLOR_PALETTES.sunshine;
    onUpdateSettings({
      ...settings,
      colorPalette: key,
      darkMode: pal.isDark
    });
  };

  const handleApplyTheme = () => {
    playSuccessSound(settings.soundEnabled);
    const pal = COLOR_PALETTES[selectedPaletteKey] || COLOR_PALETTES.sunshine;
    onUpdateSettings({
      ...settings,
      colorPalette: selectedPaletteKey,
      darkMode: pal.isDark
    });
    setIsThemeApplied(true);
    setTimeout(() => setIsThemeApplied(false), 2000);
  };

  const loadVoices = () => {
    const list = getAvailableVoices();
    setVoices(list);
  };

  useEffect(() => {
    loadVoices();
    let intervalId: any;
    
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
      
      // Resiliently poll a few times in case onvoiceschanged fires before the hook or doesn't fire
      let attempts = 0;
      intervalId = setInterval(() => {
        const list = getAvailableVoices();
        if (list.length > 0) {
          setVoices(list);
          clearInterval(intervalId);
        } else if (attempts > 12) {
          clearInterval(intervalId);
        }
        attempts++;
      }, 250);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Filter English and Gujarati voices (language code begins with 'en' or 'gu')
  const englishVoices = voices.filter(v => v.lang.toLowerCase().startsWith('en') || v.lang.toLowerCase().replace('_', '-').startsWith('en-'));
  
  // Try to find native Gujarati voices first
  let gujaratiVoices = voices.filter(v => v.lang.toLowerCase().startsWith('gu') || v.lang.toLowerCase().replace('_', '-').startsWith('gu-'));
  let isGujaratiFallbackActive = false;

  if (gujaratiVoices.length === 0) {
    // Fallback 1: Hindi
    gujaratiVoices = voices.filter(v => {
      const l = v.lang.toLowerCase();
      return l.includes('hi-in') || l.includes('hi_in') || l.startsWith('hi');
    });
    if (gujaratiVoices.length > 0) {
      isGujaratiFallbackActive = true;
    } else {
      // Fallback 2: Indian English (en-IN)
      gujaratiVoices = voices.filter(v => {
        const l = v.lang.toLowerCase();
        return l.includes('en-in') || l.includes('en_in');
      });
      if (gujaratiVoices.length > 0) {
        isGujaratiFallbackActive = true;
      }
    }
  }

  const toggleSound = () => {
    const nextVal = !settings.soundEnabled;
    playClickSound(nextVal);
    onUpdateSettings({ ...settings, soundEnabled: nextVal });
  };

  const toggleBgMusic = () => {
    playClickSound(settings.soundEnabled);
    const nextVal = !settings.bgMusicEnabled;
    onUpdateSettings({ ...settings, bgMusicEnabled: nextVal });
    
    // start or stop background music immediately
    if (nextVal) {
      startBackgroundMusic(true);
    } else {
      stopBackgroundMusic();
    }
  };

  const toggleDarkMode = () => {
    playClickSound(settings.soundEnabled);
    onUpdateSettings({ ...settings, darkMode: !settings.darkMode });
  };

  const toggleAutoPlayAudio = () => {
    playClickSound(settings.soundEnabled);
    onUpdateSettings({ ...settings, autoPlayAudio: !settings.autoPlayAudio });
  };

  const toggleVibration = () => {
    const nextVal = settings.vibrationEnabled === false ? true : false;
    playClickSound(settings.soundEnabled);
    if (nextVal && typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(15);
      } catch (err) {}
    }
    onUpdateSettings({ ...settings, vibrationEnabled: nextVal });
  };

  const getAutoDetectedVoice = (lang: 'en' | 'gu'): SpeechSynthesisVoice | undefined => {
    if (lang === 'en') {
      const usVoice = voices.find(v => {
        const l = v.lang.toLowerCase();
        return l === 'en-us' || l === 'en_us' || l.startsWith('en-us') || l.startsWith('en_us');
      });
      if (usVoice) return usVoice;
      return voices.find(v => v.lang.toLowerCase().startsWith('en'));
    } else {
      let v = voices.find(v => {
        const l = v.lang.toLowerCase();
        return l === 'gu-in' || l === 'gu_in' || l.startsWith('gu');
      });
      if (!v) {
        v = voices.find(v => {
          const l = v.lang.toLowerCase();
          return l.includes('hi-in') || l.includes('hi_in') || l.startsWith('hi');
        });
      }
      if (!v) {
        v = voices.find(v => {
          const l = v.lang.toLowerCase();
          return l.includes('en-in') || l.includes('en_in');
        });
      }
      if (!v) {
        v = voices.find(v => v.default);
      }
      return v;
    }
  };

  const playVoicePreview = (text: string, voiceURI: string, lang: 'en' | 'gu') => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    playClickSound(settings.soundEnabled);

    const utterance = new SpeechSynthesisUtterance(text);
    
    let resolvedVoice: SpeechSynthesisVoice | undefined;
    if (voiceURI) {
      resolvedVoice = voices.find(v => v.voiceURI === voiceURI);
    } else {
      resolvedVoice = getAutoDetectedVoice(lang);
    }

    if (resolvedVoice) {
      utterance.voice = resolvedVoice;
      utterance.lang = resolvedVoice.lang;
    } else {
      utterance.lang = lang === 'en' ? 'en-US' : 'gu-IN';
    }

    utterance.volume = 1.0;
    utterance.rate = 0.85; 
    utterance.pitch = 1.15; 

    const targetURI = voiceURI || (resolvedVoice ? resolvedVoice.voiceURI : 'auto-' + lang);

    utterance.onstart = () => {
      setIsPlayingVoiceURI(targetURI);
    };

    utterance.onend = () => {
      setIsPlayingVoiceURI(null);
    };

    utterance.onerror = () => {
      setIsPlayingVoiceURI(null);
    };

    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    window.speechSynthesis.speak(utterance);
  };

  const stopVoicePreview = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlayingVoiceURI(null);
    }
  };

  const handleTabChange = (lang: 'en' | 'gu') => {
    playClickSound(settings.soundEnabled);
    setActiveVoiceTab(lang);
    setCustomText(lang === 'en' 
      ? "Welcome to the Kids Learning App! You are doing an amazing job. Let's learn together!"
      : "નમસ્તે બાળમિત્ર! તમારું ખૂબ ખૂબ સ્વાગત છે. ચાલો આપણે સાથે મળીને રમીએ અને શીખીએ!"
    );
    stopVoicePreview();
  };

  return (
    <div className="fixed inset-0 overflow-y-auto p-4 md:p-6 pb-12 flex flex-col items-center transition-all duration-500 ease-in-out" style={{ background: 'var(--bg-gradient, var(--high-bg))', color: 'var(--high-ink)' }}>
      
      {/* Hero Header */}
      <div className="w-full max-w-2xl md:max-w-3xl lg:max-w-4xl z-10 mb-2">
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 dark:from-indigo-900 dark:via-purple-900 dark:to-slate-900 border-8 border-high-ink p-4 sm:p-6 md:p-7 shadow-[0_12px_0_#2D3436]"
        >
          {/* Floating Decorative Elements */}
          <div className="absolute top-2 left-4 text-2xl sm:text-3xl opacity-80 pointer-events-none animate-cloud-drift select-none">
            ☁️
          </div>
          <div className="absolute top-3 right-6 text-2xl sm:text-3xl opacity-80 pointer-events-none animate-cloud-drift [animation-delay:-8s] select-none">
            ☁️
          </div>
          <div className="absolute bottom-2 right-16 text-xl sm:text-2xl pointer-events-none animate-sparkle-1 select-none">
            ✨
          </div>
          <div className="absolute top-3 left-1/3 text-base sm:text-xl pointer-events-none animate-sparkle-2 select-none">
            ⭐
          </div>

          {/* Header Content Bar */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            
            {/* Main Title & Subtitle */}
            <div className="flex flex-col items-center text-center flex-1 my-1">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <span className="text-3xl sm:text-5xl drop-shadow-md animate-bounce">⚙️</span>
                <h1 className="text-2xl sm:text-4xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] tracking-tight">
                  App Settings
                </h1>
              </div>
              <p className="text-xs sm:text-sm font-extrabold text-white/95 dark:text-slate-200 mt-1 drop-shadow-sm max-w-md">
                Customize your learning experience.
              </p>
            </div>

            {/* Decorative Badge */}
            <div className="hidden sm:flex items-center gap-1.5 bg-white/25 dark:bg-black/30 backdrop-blur-md px-3.5 py-2 rounded-2xl border-2 border-white/40 text-white font-black text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-yellow-300 fill-yellow-300 animate-pulse" />
              <span>Personalize</span>
            </div>

          </div>
        </motion.div>
      </div>

      <div className="w-full max-w-2xl md:max-w-3xl lg:max-w-4xl flex flex-col gap-6 sm:gap-8 mt-2">
        
        {/* App Audio & Theme Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-[2.5rem] p-5 sm:p-7 shadow-[0_8px_0_#2D3436] border-8 border-high-ink flex flex-col gap-5 relative overflow-hidden"
        >
          {/* Card Title Header */}
          <div className="flex items-center justify-between pb-4 border-b-4 border-high-ink">
            <div className="flex items-center gap-3">
              <span className="text-3xl bg-amber-100 dark:bg-amber-900/40 p-2.5 rounded-2xl border-3 border-high-ink shadow-[0_3px_0_#2D3436]">
                🔊
              </span>
              <div className="flex flex-col">
                <h2 className="text-xl md:text-2xl font-black text-high-ink dark:text-white uppercase tracking-wider">
                  App Audio & Sound
                </h2>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-300">
                  Toggle sound effects, background music, dark mode & haptic vibration
                </p>
              </div>
            </div>
            <span className="hidden md:inline-flex px-3 py-1 bg-amber-400 text-high-ink font-black text-xs rounded-full border-2 border-high-ink shadow-sm uppercase">
              Audio
            </span>
          </div>

          {/* 2-Column Responsive Options Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4">
            {/* Sound Effects */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.95, y: 1 }}
              onClick={toggleSound}
              className={`flex flex-col justify-between p-4 rounded-3xl border-4 transition-all duration-300 text-left cursor-pointer relative overflow-hidden min-h-[145px] ${
                settings.soundEnabled
                  ? 'bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950/60 dark:to-slate-800 border-high-primary shadow-[0_6px_0_var(--high-primary,#FF6B6B)] ring-2 ring-high-primary/20'
                  : 'bg-high-bg dark:bg-slate-700/80 border-high-ink/20 dark:border-slate-600 shadow-[0_3px_0_#2D3436] hover:border-high-ink'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-2xl bg-white dark:bg-slate-800 border-2 border-high-ink w-12 h-12 rounded-2xl flex items-center justify-center shadow-[0_2px_0_#2D3436]">
                  {settings.soundEnabled ? '🔊' : '🔇'}
                </span>
                <div className={`w-7 h-7 rounded-full border-2 border-high-ink flex items-center justify-center transition-all ${
                  settings.soundEnabled ? 'bg-high-primary text-white shadow-sm' : 'bg-slate-200 dark:bg-slate-600'
                }`}>
                  {settings.soundEnabled && <Check className="w-4 h-4 stroke-[4]" />}
                </div>
              </div>
              <div className="mt-2">
                <h3 className="font-black text-high-ink dark:text-white text-sm sm:text-base leading-tight">Sound Effects</h3>
                <p className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-300 mt-0.5">Clicks & chimes</p>
              </div>
            </motion.button>

            {/* Background Music */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.95, y: 1 }}
              onClick={toggleBgMusic}
              className={`flex flex-col justify-between p-4 rounded-3xl border-4 transition-all duration-300 text-left cursor-pointer relative overflow-hidden min-h-[145px] ${
                settings.bgMusicEnabled
                  ? 'bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950/60 dark:to-slate-800 border-high-primary shadow-[0_6px_0_var(--high-primary,#FF6B6B)] ring-2 ring-high-primary/20'
                  : 'bg-high-bg dark:bg-slate-700/80 border-high-ink/20 dark:border-slate-600 shadow-[0_3px_0_#2D3436] hover:border-high-ink'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-2xl bg-white dark:bg-slate-800 border-2 border-high-ink w-12 h-12 rounded-2xl flex items-center justify-center shadow-[0_2px_0_#2D3436]">
                  🎵
                </span>
                <div className={`w-7 h-7 rounded-full border-2 border-high-ink flex items-center justify-center transition-all ${
                  settings.bgMusicEnabled ? 'bg-high-primary text-white shadow-sm' : 'bg-slate-200 dark:bg-slate-600'
                }`}>
                  {settings.bgMusicEnabled && <Check className="w-4 h-4 stroke-[4]" />}
                </div>
              </div>
              <div className="mt-2">
                <h3 className="font-black text-high-ink dark:text-white text-sm sm:text-base leading-tight">Background Music</h3>
                <p className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-300 mt-0.5">Play offline tunes</p>
              </div>
            </motion.button>

            {/* Dark Mode */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.95, y: 1 }}
              onClick={toggleDarkMode}
              className={`flex flex-col justify-between p-4 rounded-3xl border-4 transition-all duration-300 text-left cursor-pointer relative overflow-hidden min-h-[145px] ${
                settings.darkMode
                  ? 'bg-gradient-to-br from-indigo-900/40 to-slate-800 border-high-primary shadow-[0_6px_0_var(--high-primary,#FF6B6B)] ring-2 ring-high-primary/20'
                  : 'bg-high-bg dark:bg-slate-700/80 border-high-ink/20 dark:border-slate-600 shadow-[0_3px_0_#2D3436] hover:border-high-ink'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-2xl bg-white dark:bg-slate-800 border-2 border-high-ink w-12 h-12 rounded-2xl flex items-center justify-center shadow-[0_2px_0_#2D3436]">
                  {settings.darkMode ? '🌙' : '☀️'}
                </span>
                <div className={`w-7 h-7 rounded-full border-2 border-high-ink flex items-center justify-center transition-all ${
                  settings.darkMode ? 'bg-high-primary text-white shadow-sm' : 'bg-slate-200 dark:bg-slate-600'
                }`}>
                  {settings.darkMode && <Check className="w-4 h-4 stroke-[4]" />}
                </div>
              </div>
              <div className="mt-2">
                <h3 className="font-black text-high-ink dark:text-white text-sm sm:text-base leading-tight">Dark Mode</h3>
                <p className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-300 mt-0.5">Night visual theme</p>
              </div>
            </motion.button>

            {/* Auto-Play Audio */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.95, y: 1 }}
              onClick={toggleAutoPlayAudio}
              className={`flex flex-col justify-between p-4 rounded-3xl border-4 transition-all duration-300 text-left cursor-pointer relative overflow-hidden min-h-[145px] ${
                settings.autoPlayAudio
                  ? 'bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950/60 dark:to-slate-800 border-high-primary shadow-[0_6px_0_var(--high-primary,#FF6B6B)] ring-2 ring-high-primary/20'
                  : 'bg-high-bg dark:bg-slate-700/80 border-high-ink/20 dark:border-slate-600 shadow-[0_3px_0_#2D3436] hover:border-high-ink'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-2xl bg-white dark:bg-slate-800 border-2 border-high-ink w-12 h-12 rounded-2xl flex items-center justify-center shadow-[0_2px_0_#2D3436]">
                  {settings.autoPlayAudio ? '📢' : '🔇'}
                </span>
                <div className={`w-7 h-7 rounded-full border-2 border-high-ink flex items-center justify-center transition-all ${
                  settings.autoPlayAudio ? 'bg-high-primary text-white shadow-sm' : 'bg-slate-200 dark:bg-slate-600'
                }`}>
                  {settings.autoPlayAudio && <Check className="w-4 h-4 stroke-[4]" />}
                </div>
              </div>
              <div className="mt-2">
                <h3 className="font-black text-high-ink dark:text-white text-sm sm:text-base leading-tight">Auto-Play Audio</h3>
                <p className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-300 mt-0.5">Speak on slide changes</p>
              </div>
            </motion.button>

            {/* Haptic Feedback (5th item - centered on mobile 2-col) */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.95, y: 1 }}
              onClick={toggleVibration}
              className={`col-span-2 sm:col-span-1 md:col-span-1 max-w-[280px] sm:max-w-none justify-self-center w-full flex flex-col justify-between p-4 rounded-3xl border-4 transition-all duration-300 text-left cursor-pointer relative overflow-hidden min-h-[145px] ${
                settings.vibrationEnabled !== false
                  ? 'bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950/60 dark:to-slate-800 border-high-primary shadow-[0_6px_0_var(--high-primary,#FF6B6B)] ring-2 ring-high-primary/20'
                  : 'bg-high-bg dark:bg-slate-700/80 border-high-ink/20 dark:border-slate-600 shadow-[0_3px_0_#2D3436] hover:border-high-ink'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-2xl bg-white dark:bg-slate-800 border-2 border-high-ink w-12 h-12 rounded-2xl flex items-center justify-center shadow-[0_2px_0_#2D3436]">
                  {settings.vibrationEnabled !== false ? '📳' : '📴'}
                </span>
                <div className={`w-7 h-7 rounded-full border-2 border-high-ink flex items-center justify-center transition-all ${
                  settings.vibrationEnabled !== false ? 'bg-high-primary text-white shadow-sm' : 'bg-slate-200 dark:bg-slate-600'
                }`}>
                  {settings.vibrationEnabled !== false && <Check className="w-4 h-4 stroke-[4]" />}
                </div>
              </div>
              <div className="mt-2">
                <h3 className="font-black text-high-ink dark:text-white text-sm sm:text-base leading-tight">Haptic Feedback</h3>
                <p className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-300 mt-0.5">Vibrate on taps</p>
              </div>
            </motion.button>
          </div>
        </motion.div>

        {/* Theme Preview Card */}
        <div className="flex flex-col bg-white dark:bg-slate-800 rounded-[2.5rem] p-5 sm:p-6 shadow-[0_8px_0_#2D3436] border-8 border-high-ink gap-6">
          <div className="flex flex-col gap-1 pb-3 border-b-4 border-high-ink">
            <h2 className="text-xl md:text-2xl font-black text-high-ink dark:text-white uppercase tracking-wider flex items-center gap-2">
              🎨 Theme Preview
            </h2>
            <p className="text-xs font-extrabold text-slate-500 dark:text-slate-300 uppercase">
              Select and preview vibrant kid-friendly themes
            </p>
          </div>

          {/* Theme Mode Tabs */}
          <div className="grid grid-cols-2 gap-3 bg-high-bg dark:bg-slate-700 p-1.5 rounded-2xl border-4 border-high-ink">
            <button
              type="button"
              onClick={() => {
                playClickSound(settings.soundEnabled);
                setThemeTab('light');
              }}
              className={`py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                themeTab === 'light'
                  ? 'bg-amber-400 text-high-ink border-2 border-high-ink shadow-[0_3px_0_#2D3436] translate-y-[-1px]'
                  : 'text-slate-500 dark:text-slate-300 hover:text-high-ink dark:hover:text-white'
              }`}
            >
              <span>☀️ LIGHT THEMES</span>
            </button>
            <button
              type="button"
              onClick={() => {
                playClickSound(settings.soundEnabled);
                setThemeTab('dark');
              }}
              className={`py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                themeTab === 'dark'
                  ? 'bg-indigo-600 text-white border-2 border-high-ink shadow-[0_3px_0_#2D3436] translate-y-[-1px]'
                  : 'text-slate-500 dark:text-slate-300 hover:text-high-ink dark:hover:text-white'
              }`}
            >
              <span>🌙 DARK THEMES</span>
            </button>
          </div>

          {/* Theme Grid */}
          <div className="flex flex-col gap-2.5">
            <div className="text-xs font-black uppercase text-slate-500 dark:text-slate-300 tracking-wide">
              {themeTab === 'light' ? '☀️ Light Themes' : '🌙 Dark Themes'}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
              {(themeTab === 'light' ? LIGHT_THEME_KEYS : DARK_THEME_KEYS).map((key, idx, arr) => {
                const palette = COLOR_PALETTES[key] || COLOR_PALETTES.sunshine;
                const isSelected = selectedPaletteKey === key;
                const isOddLast = arr.length % 2 !== 0 && idx === arr.length - 1;

                return (
                  <motion.button
                    key={key}
                    type="button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleSelectTheme(key)}
                    className={`flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl border-4 transition-all duration-300 cursor-pointer text-left relative overflow-hidden min-h-[145px] ${
                      isOddLast ? 'col-span-2 sm:col-span-1 max-w-[280px] sm:max-w-none justify-self-center w-full' : 'w-full'
                    } ${
                      isSelected
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-high-primary shadow-[0_6px_0_var(--high-primary,#FF6B6B)] ring-2 ring-high-primary/30'
                        : 'bg-white dark:bg-slate-800 border-high-ink/20 dark:border-slate-600 shadow-[0_3px_0_#2D3436] hover:border-high-ink'
                    }`}
                  >
                    {/* Top row: Emoji & Theme Name + Selection Check */}
                    <div className="flex items-center justify-between w-full mb-1">
                      <div className="flex items-center gap-1.5 overflow-hidden">
                        <span className="text-xl flex-shrink-0">{palette.emoji}</span>
                        <span className="font-black text-xs sm:text-sm text-high-ink dark:text-white truncate">
                          {palette.label}
                        </span>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 border-high-ink flex-shrink-0 flex items-center justify-center transition-all ${
                        isSelected ? 'bg-high-primary text-white' : 'bg-slate-100 dark:bg-slate-700'
                      }`}>
                        {isSelected && <Check className="w-4 h-4 stroke-[4]" />}
                      </div>
                    </div>

                    {/* Middle Theme Preview Box */}
                    <div 
                      className="w-full h-12 rounded-xl border-2 border-high-ink/20 p-2 flex flex-col justify-between my-2 shadow-inner"
                      style={{ background: palette.colors.bgGradient || palette.colors.highBg }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="w-10 h-2 rounded-full" style={{ backgroundColor: palette.colors.highPrimary }} />
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: palette.colors.highAccent }} />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full border border-black/20" style={{ backgroundColor: palette.colors.highBg }} />
                        <span className="w-2.5 h-2.5 rounded-full border border-black/20" style={{ backgroundColor: palette.colors.highPrimary }} />
                        <span className="w-2.5 h-2.5 rounded-full border border-black/20" style={{ backgroundColor: palette.colors.highSecondary }} />
                        <span className="w-2.5 h-2.5 rounded-full border border-black/20" style={{ backgroundColor: palette.colors.highAccent }} />
                      </div>
                    </div>

                    {/* Bottom tag / indicator */}
                    <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-400">
                      <span>{palette.isDark ? '🌙 Dark' : '☀️ Light'}</span>
                      {isSelected && (
                        <span className="text-high-primary font-extrabold bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded-md border border-high-primary/40">
                          ACTIVE
                        </span>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="my-1 border-b-4 border-dashed border-slate-200 dark:border-slate-700 w-full" />

          {/* Live Preview Miniature Home Screen */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-xs font-black text-slate-500 dark:text-slate-300 uppercase tracking-wide">
              <span>Live Preview</span>
              <span className="text-[10px] text-slate-400 font-extrabold">(Miniature Home Screen)</span>
            </div>

            <div className="relative overflow-hidden rounded-3xl border-4 border-high-ink shadow-[0_6px_0_#2D3436]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedPaletteKey}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="p-3.5 flex flex-col gap-3 min-h-[220px]"
                  style={{
                    background: (COLOR_PALETTES[selectedPaletteKey] || COLOR_PALETTES.sunshine).colors.bgGradient,
                    color: (COLOR_PALETTES[selectedPaletteKey] || COLOR_PALETTES.sunshine).colors.highInk,
                  }}
                >
                  {/* Mini Navbar */}
                  <div className="flex items-center justify-between bg-white/80 dark:bg-slate-800/80 p-2 rounded-2xl border-2 border-high-ink backdrop-blur-sm">
                    <div className="flex items-center gap-1.5">
                      <span className="text-lg">👑</span>
                      <span className="font-black text-xs" style={{ color: (COLOR_PALETTES[selectedPaletteKey] || COLOR_PALETTES.sunshine).colors.highInk }}>
                        Smart Kids 🌟
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-black">
                      <span 
                        className="px-2 py-0.5 rounded-full border border-black/10" 
                        style={{ 
                          backgroundColor: (COLOR_PALETTES[selectedPaletteKey] || COLOR_PALETTES.sunshine).colors.highAccent, 
                          color: (COLOR_PALETTES[selectedPaletteKey] || COLOR_PALETTES.sunshine).colors.highInk 
                        }}
                      >
                        🔥 5 Streak
                      </span>
                      <span 
                        className="px-2 py-0.5 rounded-full border border-black/10 text-white" 
                        style={{ 
                          backgroundColor: (COLOR_PALETTES[selectedPaletteKey] || COLOR_PALETTES.sunshine).colors.highSuccess 
                        }}
                      >
                        ⭐ 120
                      </span>
                    </div>
                  </div>

                  {/* Mini Mascot Banner */}
                  <div 
                    className="p-2.5 rounded-2xl border-3 flex items-center justify-between shadow-sm"
                    style={{
                      backgroundColor: (COLOR_PALETTES[selectedPaletteKey] || COLOR_PALETTES.sunshine).colors.cardBg,
                      borderColor: (COLOR_PALETTES[selectedPaletteKey] || COLOR_PALETTES.sunshine).colors.cardBorder,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl animate-bounce">🐥</span>
                      <div>
                        <div className="font-black text-xs" style={{ color: (COLOR_PALETTES[selectedPaletteKey] || COLOR_PALETTES.sunshine).colors.highInk }}>
                          Hi Chiku! Let's Learn!
                        </div>
                        <div className="text-[10px] opacity-80 font-bold">
                          Daily Goal: 8/10 Complete
                        </div>
                      </div>
                    </div>
                    <span 
                      className="px-2 py-1 rounded-xl text-[10px] font-black border"
                      style={{
                        backgroundColor: (COLOR_PALETTES[selectedPaletteKey] || COLOR_PALETTES.sunshine).colors.highAccent,
                        color: (COLOR_PALETTES[selectedPaletteKey] || COLOR_PALETTES.sunshine).colors.highInk,
                        borderColor: (COLOR_PALETTES[selectedPaletteKey] || COLOR_PALETTES.sunshine).colors.highInk,
                      }}
                    >
                      Play
                    </span>
                  </div>

                  {/* Mini 2x2 Learning Modules Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    <div 
                      className="p-2 rounded-xl border-2 flex flex-col items-center gap-1 text-center"
                      style={{
                        backgroundColor: (COLOR_PALETTES[selectedPaletteKey] || COLOR_PALETTES.sunshine).colors.cardBg,
                        borderColor: (COLOR_PALETTES[selectedPaletteKey] || COLOR_PALETTES.sunshine).colors.highPrimary,
                      }}
                    >
                      <span className="text-xl">🔤</span>
                      <span className="font-black text-[11px]" style={{ color: (COLOR_PALETTES[selectedPaletteKey] || COLOR_PALETTES.sunshine).colors.highInk }}>
                        English ABC
                      </span>
                      <span 
                        className="w-full py-0.5 rounded-lg text-[9px] font-extrabold text-white"
                        style={{ backgroundColor: (COLOR_PALETTES[selectedPaletteKey] || COLOR_PALETTES.sunshine).colors.highPrimary }}
                      >
                        Learn
                      </span>
                    </div>

                    <div 
                      className="p-2 rounded-xl border-2 flex flex-col items-center gap-1 text-center"
                      style={{
                        backgroundColor: (COLOR_PALETTES[selectedPaletteKey] || COLOR_PALETTES.sunshine).colors.cardBg,
                        borderColor: (COLOR_PALETTES[selectedPaletteKey] || COLOR_PALETTES.sunshine).colors.highSecondary,
                      }}
                    >
                      <span className="text-xl">🇮🇳</span>
                      <span className="font-black text-[11px]" style={{ color: (COLOR_PALETTES[selectedPaletteKey] || COLOR_PALETTES.sunshine).colors.highInk }}>
                        ગુજરાતી
                      </span>
                      <span 
                        className="w-full py-0.5 rounded-lg text-[9px] font-extrabold text-white"
                        style={{ backgroundColor: (COLOR_PALETTES[selectedPaletteKey] || COLOR_PALETTES.sunshine).colors.highSecondary }}
                      >
                        શીખો
                      </span>
                    </div>

                    <div 
                      className="p-2 rounded-xl border-2 flex flex-col items-center gap-1 text-center"
                      style={{
                        backgroundColor: (COLOR_PALETTES[selectedPaletteKey] || COLOR_PALETTES.sunshine).colors.cardBg,
                        borderColor: (COLOR_PALETTES[selectedPaletteKey] || COLOR_PALETTES.sunshine).colors.highAccent,
                      }}
                    >
                      <span className="text-xl">🧩</span>
                      <span className="font-black text-[11px]" style={{ color: (COLOR_PALETTES[selectedPaletteKey] || COLOR_PALETTES.sunshine).colors.highInk }}>
                        Quiz Time
                      </span>
                      <span 
                        className="w-full py-0.5 rounded-lg text-[9px] font-extrabold text-black"
                        style={{ backgroundColor: (COLOR_PALETTES[selectedPaletteKey] || COLOR_PALETTES.sunshine).colors.highAccent }}
                      >
                        Start
                      </span>
                    </div>

                    <div 
                      className="p-2 rounded-xl border-2 flex flex-col items-center gap-1 text-center"
                      style={{
                        backgroundColor: (COLOR_PALETTES[selectedPaletteKey] || COLOR_PALETTES.sunshine).colors.cardBg,
                        borderColor: (COLOR_PALETTES[selectedPaletteKey] || COLOR_PALETTES.sunshine).colors.highSuccess,
                      }}
                    >
                      <span className="text-xl">🎮</span>
                      <span className="font-black text-[11px]" style={{ color: (COLOR_PALETTES[selectedPaletteKey] || COLOR_PALETTES.sunshine).colors.highInk }}>
                        Arcade Room
                      </span>
                      <span 
                        className="w-full py-0.5 rounded-lg text-[9px] font-extrabold text-white"
                        style={{ backgroundColor: (COLOR_PALETTES[selectedPaletteKey] || COLOR_PALETTES.sunshine).colors.highSuccess }}
                      >
                        Play
                      </span>
                    </div>
                  </div>

                  {/* Mini CTA Button */}
                  <div 
                    className="w-full py-2 rounded-xl font-black text-xs text-center text-white border-2 border-high-ink shadow-[0_3px_0_#2D3436] flex items-center justify-center gap-1 mt-1"
                    style={{ backgroundColor: (COLOR_PALETTES[selectedPaletteKey] || COLOR_PALETTES.sunshine).colors.highPrimary }}
                  >
                    <span>🚀 Start Learning</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Selected Theme Display & Apply Theme Button */}
          <div className="flex flex-col gap-3 pt-2">
            <div className="flex items-center justify-between bg-high-bg dark:bg-slate-700/60 p-3 rounded-2xl border-4 border-high-ink">
              <span className="text-xs font-black uppercase text-slate-500 dark:text-slate-300">
                Selected Theme:
              </span>
              <span className="font-black text-sm md:text-base text-high-ink dark:text-white flex items-center gap-1.5">
                <span>{(COLOR_PALETTES[selectedPaletteKey] || COLOR_PALETTES.sunshine).emoji}</span>
                <span>{(COLOR_PALETTES[selectedPaletteKey] || COLOR_PALETTES.sunshine).label}</span>
              </span>
            </div>

            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleApplyTheme}
              className={`w-full py-3.5 px-6 rounded-2xl font-black text-base uppercase tracking-wider border-4 border-high-ink shadow-[0_6px_0_#2D3436] active:translate-y-[3px] active:shadow-[0_2px_0_#2D3436] transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isThemeApplied
                  ? 'bg-green-500 text-white'
                  : 'bg-high-primary text-white hover:brightness-110'
              }`}
            >
              {isThemeApplied ? (
                <>
                  <Check className="w-5 h-5 stroke-[4]" />
                  <span>Theme Applied! 🎉</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 fill-white stroke-[2]" />
                  <span>Apply Theme</span>
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* English Font Style Card */}
        <div className="flex flex-col bg-white dark:bg-slate-800 rounded-[2.5rem] p-5 sm:p-6 shadow-[0_8px_0_#2D3436] border-8 border-high-ink gap-6">
          <div className="flex flex-col gap-1 pb-3 border-b-4 border-high-ink">
            <h2 className="text-xl md:text-2xl font-black text-high-ink dark:text-white uppercase tracking-wider flex items-center gap-2">
              🅰️ English Font Style
            </h2>
            <p className="text-xs font-extrabold text-slate-500 dark:text-slate-300 uppercase">
              Select a bold, kid-friendly font style for all English text
            </p>
          </div>

          {/* Font Selection Cards Grid (2-column responsive) */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
            {ENGLISH_FONTS.map((fontOption) => {
              const isSelected = (settings.englishFontStyle || 'fredoka') === fontOption.id;
              return (
                <motion.button
                  key={fontOption.id}
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    playClickSound(settings.soundEnabled);
                    applyEnglishFontGlobal(fontOption.id);
                    onUpdateSettings({
                      ...settings,
                      englishFontStyle: fontOption.id
                    });
                  }}
                  className={`flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl border-4 transition-all duration-300 text-left cursor-pointer relative overflow-hidden min-h-[145px] ${
                    isSelected
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-high-primary shadow-[0_6px_0_var(--high-primary,#FF6B6B)] ring-2 ring-high-primary/30'
                      : 'bg-white/90 dark:bg-slate-800 border-high-ink/20 dark:border-slate-600 shadow-[0_3px_0_#2D3436] hover:border-high-ink'
                  }`}
                >
                  {/* Header Row */}
                  <div className="flex items-center justify-between w-full mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xl">{fontOption.emoji}</span>
                    </div>

                    {/* Selection Checkmark */}
                    <div className={`w-6 h-6 rounded-full border-2 border-high-ink flex items-center justify-center transition-all ${
                      isSelected ? 'bg-high-primary text-white' : 'bg-slate-100 dark:bg-slate-700'
                    }`}>
                      {isSelected && <Check className="w-4 h-4 stroke-[4]" />}
                    </div>
                  </div>

                  {/* Typography Sample Box */}
                  <div 
                    className="bg-white dark:bg-slate-900/90 rounded-xl p-2.5 border-2 border-high-ink/20 dark:border-slate-700 my-1.5 flex flex-col gap-0.5 text-center shadow-inner"
                    style={{ fontFamily: fontOption.fontFamily, fontWeight: fontOption.fontWeight }}
                  >
                    <div className="text-xl sm:text-2xl font-black text-high-primary tracking-wide">
                      ABC
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-high-ink dark:text-white tracking-wider">
                      Aa Bb Cc
                    </div>
                  </div>

                  {/* Bottom font name & description */}
                  <div className="mt-1 flex flex-col gap-0.5">
                    <span className="font-black text-xs sm:text-sm text-high-ink dark:text-white truncate">
                      {fontOption.name}
                    </span>
                    <span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 truncate">
                      {fontOption.description}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Font Live Preview Box */}
          <div className="flex flex-col gap-2 pt-2 border-t-4 border-dashed border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between text-xs font-black text-slate-500 dark:text-slate-300 uppercase tracking-wide">
              <span>Current Font Live Preview</span>
              <span className="text-[10px] text-high-primary font-extrabold uppercase">
                {getEnglishFont(settings.englishFontStyle || 'fredoka').name}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={settings.englishFontStyle || 'fredoka'}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="p-4 rounded-2xl border-4 border-high-ink bg-high-bg dark:bg-slate-700/60 shadow-[0_4px_0_#2D3436] flex flex-col gap-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg md:text-xl font-black text-high-ink dark:text-white">
                    🌟 Learn English Alphabet & Words
                  </span>
                  <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-high-accent text-high-ink border-2 border-high-ink shadow-sm">
                    Play!
                  </span>
                </div>

                <p className="text-xs md:text-sm font-bold text-slate-600 dark:text-slate-200">
                  The quick brown fox jumps over the lazy dog. 1, 2, 3... 100!
                </p>

                <div className="flex items-center gap-2 text-xs font-extrabold text-slate-500 dark:text-slate-300">
                  <span className="bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border-2 border-high-ink/20">
                    A is for Apple 🍎
                  </span>
                  <span className="bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border-2 border-high-ink/20">
                    B is for Ball ⚽
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Text-to-Speech Engine Settings */}
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 shadow-[0_8px_0_#2D3436] border-8 border-high-ink flex flex-col gap-6">
          <div className="flex flex-col gap-1 pb-3 border-b-4 border-high-ink">
            <h2 className="text-xl font-black text-high-ink dark:text-white uppercase tracking-wider flex items-center gap-2">
              🗣️ TEXT-TO-SPEECH VOICES
            </h2>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-300 uppercase">
              Choose the most natural sounding voices for your child
            </p>
          </div>

          {/* Tab Selector */}
          <div className="grid grid-cols-2 gap-3 bg-high-bg dark:bg-slate-700 p-1.5 rounded-2xl border-4 border-high-ink">
            <button
              onClick={() => handleTabChange('en')}
              className={`py-2.5 px-4 rounded-xl font-black text-xs md:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                activeVoiceTab === 'en'
                  ? 'bg-high-primary text-white border-2 border-high-ink shadow-[0_3px_0_#2D3436] translate-y-[-1px]'
                  : 'text-slate-500 dark:text-slate-300 hover:text-high-ink dark:hover:text-white'
              }`}
            >
              <span>🇬🇧 English</span>
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px]">
                {englishVoices.length}
              </span>
            </button>
            <button
              onClick={() => handleTabChange('gu')}
              className={`py-2.5 px-4 rounded-xl font-black text-xs md:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                activeVoiceTab === 'gu'
                  ? 'bg-high-success text-high-ink border-2 border-high-ink shadow-[0_3px_0_#2D3436] translate-y-[-1px]'
                  : 'text-slate-500 dark:text-slate-300 hover:text-high-ink dark:hover:text-white'
              }`}
            >
              <span>🇮🇳 ગુજરાતી</span>
              <span className="bg-high-ink/10 px-2 py-0.5 rounded-full text-[10px]">
                {gujaratiVoices.length}
              </span>
            </button>
          </div>

          {/* Voice list box */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center text-xs font-black text-slate-500 dark:text-slate-300 uppercase tracking-wide">
              <span>Select voice model:</span>
              {activeVoiceTab === 'gu' && isGujaratiFallbackActive && (
                <span className="text-amber-600 dark:text-amber-400 font-extrabold">No native voice found (fallback active)</span>
              )}
            </div>

            <div className="border-4 border-high-ink rounded-2xl bg-high-bg dark:bg-slate-700 p-3 max-h-64 overflow-y-auto flex flex-col gap-2.5 custom-scrollbar">
              {/* Auto-detect Option Card */}
              <div
                onClick={() => {
                  playClickSound(settings.soundEnabled);
                  if (activeVoiceTab === 'en') {
                    onUpdateSettings({ ...settings, englishVoiceURI: "" });
                  } else {
                    onUpdateSettings({ ...settings, gujaratiVoiceURI: "" });
                  }
                }}
                className={`p-3 rounded-xl border-2 border-high-ink flex items-center justify-between cursor-pointer transition-all ${
                  (activeVoiceTab === 'en' ? settings.englishVoiceURI === "" : settings.gujaratiVoiceURI === "")
                    ? 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-500 shadow-sm'
                    : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 border-high-ink flex items-center justify-center ${
                    (activeVoiceTab === 'en' ? settings.englishVoiceURI === "" : settings.gujaratiVoiceURI === "")
                      ? 'bg-high-primary'
                      : 'bg-white dark:bg-slate-700'
                  }`}>
                    {(activeVoiceTab === 'en' ? settings.englishVoiceURI === "" : settings.gujaratiVoiceURI === "") && (
                      <Check className="w-3.5 h-3.5 text-white stroke-[4]" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 font-black text-sm text-high-ink dark:text-white">
                      <span>⚡ Auto-Detect Best Voice</span>
                      <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
                    </div>
                    <div className="text-[11px] font-bold text-slate-400 dark:text-slate-300 mt-0.5 uppercase">
                      {activeVoiceTab === 'en'
                        ? `Default: ${getAutoDetectedVoice('en')?.name || 'System Standard'}`
                        : `Fallback: ${getAutoDetectedVoice('gu')?.name || 'None'}`
                      }
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const testPhrase = activeVoiceTab === 'en' ? 'Hello! Speaking with auto detected voice.' : 'નમસ્તે! ઓટો ડિટેક્ટ અવાજ સાથે બોલી રહ્યું છે.';
                    playVoicePreview(testPhrase, "", activeVoiceTab);
                  }}
                  className={`w-9 h-9 rounded-lg border-2 border-high-ink flex items-center justify-center transition-all ${
                    isPlayingVoiceURI === ('auto-' + activeVoiceTab)
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-white hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-high-ink dark:text-white shadow-[0_2px_0_#2D3436] active:translate-y-[1px] active:shadow-none'
                  }`}
                >
                  {isPlayingVoiceURI === ('auto-' + activeVoiceTab) ? (
                    <Square className="w-4 h-4 fill-white stroke-[3]" />
                  ) : (
                    <Play className="w-4 h-4 fill-current stroke-[3] ml-0.5" />
                  )}
                </button>
              </div>

              {/* System Voices Loop */}
              {activeVoiceTab === 'en' ? (
                englishVoices.length === 0 ? (
                  <div className="text-center py-4 text-xs font-black text-slate-400 uppercase">
                    No English system voices detected
                  </div>
                ) : (
                  englishVoices.map((voice) => {
                    const isSelected = settings.englishVoiceURI === voice.voiceURI;
                    const isSpeaking = isPlayingVoiceURI === voice.voiceURI;
                    return (
                      <div
                        key={voice.voiceURI}
                        onClick={() => {
                          playClickSound(settings.soundEnabled);
                          onUpdateSettings({ ...settings, englishVoiceURI: voice.voiceURI });
                        }}
                        className={`p-3 rounded-xl border-2 border-high-ink flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-500 shadow-sm'
                            : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 border-high-ink flex items-center justify-center ${
                            isSelected ? 'bg-high-primary' : 'bg-white dark:bg-slate-700'
                          }`}>
                            {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[4]" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 font-black text-sm text-high-ink dark:text-white">
                              <span>{getFlagEmoji(voice.lang)}</span>
                              <span className="line-clamp-1">{voice.name}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 font-extrabold px-1.5 py-0.5 rounded uppercase">
                                {voice.lang}
                              </span>
                              {voice.localService ? (
                                <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 font-extrabold px-1.5 py-0.5 rounded uppercase">
                                  Offline
                                </span>
                              ) : (
                                <span className="text-[10px] bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 font-extrabold px-1.5 py-0.5 rounded uppercase">
                                  Natural
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            playVoicePreview("Hello, little superstar! Let's play!", voice.voiceURI, 'en');
                          }}
                          className={`w-9 h-9 rounded-lg border-2 border-high-ink flex items-center justify-center transition-all ${
                            isSpeaking
                              ? 'bg-red-500 text-white animate-pulse'
                              : 'bg-white hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-high-ink dark:text-white shadow-[0_2px_0_#2D3436] active:translate-y-[1px] active:shadow-none'
                          }`}
                        >
                          {isSpeaking ? (
                            <Square className="w-4 h-4 fill-white stroke-[3]" />
                          ) : (
                            <Play className="w-4 h-4 fill-current stroke-[3] ml-0.5" />
                          )}
                        </button>
                      </div>
                    );
                  })
                )
              ) : (
                gujaratiVoices.length === 0 ? (
                  <div className="text-center py-4 text-xs font-black text-slate-400 uppercase leading-relaxed p-2 text-red-500">
                    📢 No compatible Gujarati voice found.
                  </div>
                ) : (
                  gujaratiVoices.map((voice) => {
                    const isSelected = settings.gujaratiVoiceURI === voice.voiceURI;
                    const isSpeaking = isPlayingVoiceURI === voice.voiceURI;
                    return (
                      <div
                        key={voice.voiceURI}
                        onClick={() => {
                          playClickSound(settings.soundEnabled);
                          onUpdateSettings({ ...settings, gujaratiVoiceURI: voice.voiceURI });
                        }}
                        className={`p-3 rounded-xl border-2 border-high-ink flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-500 shadow-sm'
                            : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 border-high-ink flex items-center justify-center ${
                            isSelected ? 'bg-high-primary' : 'bg-white dark:bg-slate-700'
                          }`}>
                            {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[4]" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 font-black text-sm text-high-ink dark:text-white">
                              <span>{getFlagEmoji(voice.lang)}</span>
                              <span className="line-clamp-1">
                                {isGujaratiFallbackActive ? `${voice.name} (Gujarati Fallback)` : voice.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 font-extrabold px-1.5 py-0.5 rounded uppercase">
                                {voice.lang}
                              </span>
                              {voice.localService ? (
                                <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 font-extrabold px-1.5 py-0.5 rounded uppercase">
                                  Offline
                                </span>
                              ) : (
                                <span className="text-[10px] bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 font-extrabold px-1.5 py-0.5 rounded uppercase">
                                  Natural
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            playVoicePreview("નમસ્તે બાળમિત્ર! કેમ છો!", voice.voiceURI, 'gu');
                          }}
                          className={`w-9 h-9 rounded-lg border-2 border-high-ink flex items-center justify-center transition-all ${
                            isSpeaking
                              ? 'bg-red-500 text-white animate-pulse'
                              : 'bg-white hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-high-ink dark:text-white shadow-[0_2px_0_#2D3436] active:translate-y-[1px] active:shadow-none'
                          }`}
                        >
                          {isSpeaking ? (
                            <Square className="w-4 h-4 fill-white stroke-[3]" />
                          ) : (
                            <Play className="w-4 h-4 fill-current stroke-[3] ml-0.5" />
                          )}
                        </button>
                      </div>
                    );
                  })
                )
              )}
            </div>
          </div>

          {/* Playground Playground */}
          <div className="flex flex-col gap-3 pt-3 border-t-4 border-dashed border-slate-200 dark:border-slate-700">
            <h3 className="text-xs font-black text-slate-500 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-high-primary" />
              <span>🧪 Live Voice Sandbox (Playground)</span>
            </h3>

            {/* Presets Row */}
            <div className="flex flex-wrap gap-2">
              {(activeVoiceTab === 'en' ? ENGLISH_PRESETS : GUJARATI_PRESETS).map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    playClickSound(settings.soundEnabled);
                    setCustomText(preset.text);
                    const selectedVoiceURI = activeVoiceTab === 'en' ? settings.englishVoiceURI : settings.gujaratiVoiceURI;
                    playVoicePreview(preset.text, selectedVoiceURI, activeVoiceTab);
                  }}
                  className="bg-[#FFF9E6] dark:bg-slate-700 hover:bg-[#FFF2CC] dark:hover:bg-slate-600 border-2 border-high-ink py-1.5 px-3 rounded-full text-xs font-bold text-high-ink dark:text-white shadow-[0_2px_0_#2D3436] hover:translate-y-[-1px] hover:shadow-[0_3px_0_#2D3436] active:translate-y-[1px] active:shadow-none transition-all"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="flex flex-col gap-2">
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Type a word or phrase here to test pronunciation..."
                className="w-full bg-white dark:bg-slate-900 text-high-ink dark:text-white font-extrabold rounded-xl p-3 border-4 border-high-ink focus:outline-none min-h-[4.5rem] text-sm leading-relaxed"
              />

              {/* Animated Sound Wave visualizer (shows when isPlayingVoiceURI is not null) */}
              <div className="flex items-center justify-between bg-high-bg dark:bg-slate-700/50 p-2 px-4 rounded-xl border-2 border-high-ink min-h-[3rem]">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 h-5">
                    {[...Array(9)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-high-primary dark:bg-yellow-400 rounded-full"
                        animate={{
                          height: isPlayingVoiceURI ? [6, 18, 8, 22, 10, 6][(i + i % 3) % 6] : 6,
                        }}
                        transition={{
                          duration: 0.5,
                          repeat: Infinity,
                          repeatType: "reverse",
                          delay: i * 0.04,
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-300">
                    {isPlayingVoiceURI ? "Speaking..." : "Idle"}
                  </span>
                </div>

                <div className="flex gap-2">
                  {isPlayingVoiceURI && (
                    <button
                      onClick={stopVoicePreview}
                      className="bg-red-500 hover:bg-red-600 border-2 border-high-ink text-white font-black py-1 px-3 rounded-lg text-xs flex items-center gap-1 shadow-[0_2px_0_#2D3436]"
                    >
                      <Square className="w-3 h-3 fill-current" />
                      <span>Stop</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      const selectedVoiceURI = activeVoiceTab === 'en' ? settings.englishVoiceURI : settings.gujaratiVoiceURI;
                      playVoicePreview(customText, selectedVoiceURI, activeVoiceTab);
                    }}
                    className="bg-high-primary hover:bg-[#FF8585] border-2 border-high-ink text-white font-black py-1 px-4.5 rounded-lg text-xs flex items-center gap-1 shadow-[0_2px_0_#2D3436] active:translate-y-[1px] active:shadow-none transition-all"
                  >
                    <Volume2 className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Speak</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Child Safety & Educational Info Tip */}
          <div className="bg-[#E6F4EA] dark:bg-green-950/20 p-4 rounded-2xl border-4 border-high-ink flex gap-3">
            <Info className="w-6 h-6 text-green-600 dark:text-green-400 shrink-0 stroke-[3]" />
            <div className="flex flex-col gap-1">
              <span className="text-xs font-black text-green-800 dark:text-green-300 uppercase tracking-wide">
                Parent Tip: Smooth Pronunciation
              </span>
              <p className="text-[11px] font-bold text-green-700 dark:text-green-400 leading-normal">
                If children are having difficulty understanding letters, select a voice with &quot;Natural&quot; or &quot;Google&quot; in the name. They utilize modern deep learning models to produce smooth, cheerful, and crisp syllable enunciations!
              </p>
            </div>
          </div>
        </div>

        {/* Connect With Us Section */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-col bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-[2.5rem] p-5 sm:p-7 shadow-[0_8px_0_#2D3436] border-8 border-high-ink gap-5 relative overflow-hidden"
        >
          {/* Section Header */}
          <div className="flex items-center justify-between pb-4 border-b-4 border-high-ink">
            <div className="flex items-center gap-3">
              <span className="text-3xl bg-blue-100 dark:bg-blue-900/40 p-2.5 rounded-2xl border-3 border-high-ink shadow-[0_3px_0_#2D3436]">
                🌐
              </span>
              <div className="flex flex-col">
                <h2 className="text-xl md:text-2xl font-black text-high-ink dark:text-white uppercase tracking-wider">
                  Connect With Us
                </h2>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-300">
                  Stay connected for updates, learning tips and new features
                </p>
              </div>
            </div>
            <span className="hidden md:inline-flex px-3 py-1 bg-sky-400 text-high-ink font-black text-xs rounded-full border-2 border-high-ink shadow-sm uppercase">
              Community
            </span>
          </div>

          {/* 2-Column Responsive Options Grid (Exact 2 per row on phones & large phones) */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {CONNECT_ITEMS.map((item) => {
              return (
                <motion.button
                  key={item.id}
                  type="button"
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.94, y: 1 }}
                  onClick={item.action}
                  className="flex flex-col justify-between p-3.5 sm:p-4 rounded-3xl border-4 transition-all duration-300 text-left cursor-pointer relative overflow-hidden h-full min-h-[125px] sm:min-h-[135px] bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-700/80 border-high-ink/20 dark:border-slate-600 shadow-[0_4px_0_#2D3436] hover:border-high-ink hover:shadow-[0_6px_0_#2D3436] active:translate-y-[2px] active:shadow-[0_2px_0_#2D3436] w-full group select-none"
                >
                  {/* Top row: Icon Badge & External Arrow */}
                  <div className="flex items-center justify-between w-full">
                    <span className="text-2xl sm:text-3xl bg-amber-50 dark:bg-slate-700 border-2 border-high-ink w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shadow-[0_2px_0_#2D3436] group-hover:scale-110 group-hover:rotate-3 transition-all shrink-0">
                      {item.emoji}
                    </span>
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl border-2 border-high-ink/30 dark:border-slate-600 flex items-center justify-center bg-slate-100 dark:bg-slate-700 group-hover:bg-amber-400 group-hover:border-high-ink transition-all">
                      <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 dark:text-slate-300 group-hover:text-high-ink" />
                    </div>
                  </div>

                  {/* Text details */}
                  <div className="mt-2.5">
                    <h3 className="font-black text-high-ink dark:text-white text-xs sm:text-sm leading-tight group-hover:text-high-primary transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-300 mt-1 leading-snug line-clamp-2">
                      {item.subtitle}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* About Developer Standalone Centered Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="w-full flex justify-center mt-1"
        >
          <motion.button
            type="button"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenAbout}
            className="w-full max-w-md sm:max-w-lg p-4 sm:p-5 rounded-[2.2rem] border-4 border-high-ink bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 dark:from-teal-800 dark:via-emerald-900 dark:to-slate-800 text-white shadow-[0_8px_0_#065F46] hover:shadow-[0_10px_0_#065F46] active:translate-y-[2px] active:shadow-[0_4px_0_#065F46] transition-all flex items-center justify-between gap-3.5 cursor-pointer relative overflow-hidden group select-none"
          >
            {/* Gloss Highlight */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/20 rounded-t-full pointer-events-none" />

            <div className="flex items-center gap-3.5 relative z-10">
              <span className="text-3xl sm:text-4xl bg-white/20 p-2.5 rounded-2xl border-2 border-white/40 shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all shrink-0">
                👨‍💻
              </span>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-black uppercase tracking-widest text-teal-100">Creator & Studio</span>
                <h3 className="text-base sm:text-xl font-black text-white leading-tight drop-shadow-sm">
                  About Developer
                </h3>
                <p className="text-xs font-bold text-teal-50 drop-shadow-xs mt-0.5">
                  KidTech Studio • Gautam Mewada
                </p>
              </div>
            </div>

            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-teal-700 transition-colors shadow-sm">
              <Info className="w-5 h-5 stroke-[3]" />
            </div>
          </motion.button>
        </motion.div>

        {/* Offline & About status */}
        <div className="text-center text-xs text-slate-400 dark:text-slate-300 font-extrabold tracking-widest uppercase mt-4 flex flex-col gap-1.5">
          <p>KIDS LEARNING APP • 100% OFFLINE</p>
          <p>SECURE & SAFE FOR CHILDREN • NO ADS</p>
        </div>
      </div>

      {/* Send Feedback Modal */}
      <AnimatePresence>
        {isFeedbackOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-800 rounded-[2.5rem] border-8 border-high-ink shadow-[0_12px_0_#2D3436] p-6 max-w-lg w-full relative flex flex-col gap-5 overflow-hidden text-left"
            >
              <button
                onClick={() => {
                  playClickSound(settings.soundEnabled);
                  setIsFeedbackOpen(false);
                }}
                className="absolute top-4 right-4 w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-700 border-2 border-high-ink flex items-center justify-center font-black text-high-ink dark:text-white shadow-[0_2px_0_#2D3436] active:translate-y-[1px] cursor-pointer"
              >
                <X className="w-5 h-5 stroke-[3]" />
              </button>

              <div className="flex items-center gap-3 pr-10">
                <span className="text-3xl bg-amber-100 dark:bg-amber-900/40 p-2 rounded-2xl border-2 border-high-ink shadow-[0_3px_0_#2D3436]">
                  💡
                </span>
                <div>
                  <h3 className="text-xl font-black text-high-ink dark:text-white uppercase tracking-wider">
                    Send Feedback
                  </h3>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-300">
                    We love hearing from parents & kids!
                  </p>
                </div>
              </div>

              {!feedbackSubmitted ? (
                <form onSubmit={handleSubmitFeedback} className="flex flex-col gap-4">
                  {/* Star Rating */}
                  <div className="flex flex-col gap-1.5 bg-high-bg dark:bg-slate-700/50 p-3.5 rounded-2xl border-4 border-high-ink">
                    <label className="text-xs font-black uppercase text-high-ink dark:text-white">
                      How do you rate the app?
                    </label>
                    <div className="flex items-center justify-center gap-2 my-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.button
                          key={star}
                          type="button"
                          whileHover={{ scale: 1.2, rotate: 5 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            playClickSound(settings.soundEnabled);
                            setFeedbackRating(star);
                          }}
                          className="cursor-pointer p-1"
                        >
                          <Star
                            className={`w-9 h-9 transition-colors ${
                              star <= feedbackRating
                                ? 'fill-amber-400 text-amber-500 drop-shadow-[0_2px_0_rgba(0,0,0,0.2)]'
                                : 'text-slate-300 dark:text-slate-600'
                            }`}
                          />
                        </motion.button>
                      ))}
                    </div>
                    <span className="text-center text-xs font-black text-amber-600 dark:text-amber-400">
                      {feedbackRating === 5 && '🎉 Super Amazing! 5 Stars'}
                      {feedbackRating === 4 && '🌟 Great App! 4 Stars'}
                      {feedbackRating === 3 && '😄 Good! 3 Stars'}
                      {feedbackRating === 2 && '🙂 Okay (Needs Work)'}
                      {feedbackRating === 1 && '😕 Needs Improvement'}
                    </span>
                  </div>

                  {/* Bug Report Checkbox */}
                  <label className="flex items-center gap-3 bg-white dark:bg-slate-700/80 p-3 rounded-xl border-2 border-high-ink cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isBugReport}
                      onChange={(e) => setIsBugReport(e.target.checked)}
                      className="w-5 h-5 rounded border-2 border-high-ink accent-high-primary cursor-pointer"
                    />
                    <span className="text-xs font-extrabold text-high-ink dark:text-white">
                      🐞 Report a Bug
                    </span>
                  </label>

                  {/* Suggestion Text */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-black uppercase text-high-ink dark:text-white">
                      Suggestions / Details:
                    </label>
                    <textarea
                      required
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Type your message, ideas, or feature requests here..."
                      className="w-full bg-high-bg dark:bg-slate-900 text-high-ink dark:text-white font-extrabold rounded-2xl p-3 border-4 border-high-ink focus:outline-none min-h-[5rem] text-sm"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="bg-high-primary hover:bg-[#FF8585] text-white font-black py-3.5 px-6 rounded-2xl border-4 border-high-ink text-base uppercase tracking-wider shadow-[0_5px_0_#2D3436] active:translate-y-[2px] active:shadow-[0_2px_0_#2D3436] transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
                  >
                    <Send className="w-5 h-5 stroke-[3]" />
                    <span>Submit Feedback</span>
                  </button>
                </form>
              ) : (
                <div className="flex flex-col items-center text-center gap-4 py-4">
                  <div className="text-5xl animate-bounce">
                    {isOfflineFeedback ? '💾' : '🎉'}
                  </div>
                  <h4 className="text-xl font-black text-high-ink dark:text-white">
                    {isOfflineFeedback ? 'Feedback Saved Offline' : 'Thank You So Much!'}
                  </h4>
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-300 max-w-xs leading-relaxed">
                    {isOfflineFeedback
                      ? 'You are currently offline. Your rating and feedback have been saved locally on your device and will be sent when you connect to the internet.'
                      : 'Your feedback and suggestions have been submitted. Thank you for helping us improve Kids Learning App!'}
                  </p>
                  <button
                    onClick={() => {
                      playClickSound(settings.soundEnabled);
                      setIsFeedbackOpen(false);
                    }}
                    className="bg-amber-400 hover:bg-amber-300 text-high-ink font-black py-2.5 px-8 rounded-2xl border-4 border-high-ink text-sm uppercase shadow-[0_4px_0_#2D3436] active:translate-y-[2px] active:shadow-[0_1px_0_#2D3436] transition-all cursor-pointer"
                  >
                    Done 👍
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Rate This App Modal */}
      <AnimatePresence>
        {isRateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-800 rounded-[2.5rem] border-8 border-high-ink shadow-[0_12px_0_#2D3436] p-6 max-w-sm w-full relative flex flex-col items-center text-center gap-4 overflow-hidden"
            >
              <button
                onClick={() => {
                  playClickSound(settings.soundEnabled);
                  setIsRateModalOpen(false);
                }}
                className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 border-2 border-high-ink flex items-center justify-center font-black text-high-ink dark:text-white shadow-[0_2px_0_#2D3436] active:translate-y-[1px] cursor-pointer"
              >
                <X className="w-5 h-5 stroke-[3]" />
              </button>

              <div className="text-5xl mt-2 bg-amber-100 dark:bg-amber-900/40 p-3 rounded-2xl border-4 border-high-ink shadow-[0_4px_0_#2D3436]">
                ⭐
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-black text-high-ink dark:text-white uppercase tracking-wider">
                  Rate This App
                </h3>
                <p className="text-sm font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 py-1.5 px-3 rounded-xl border-2 border-amber-400/40 mt-1">
                  Coming Soon on Google Play.
                </p>
              </div>

              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 leading-relaxed max-w-xs">
                We are preparing our official Google Play Store listing! Stay tuned for updates and new releases.
              </p>

              <button
                onClick={() => {
                  playClickSound(settings.soundEnabled);
                  setIsRateModalOpen(false);
                }}
                className="w-full bg-high-primary hover:bg-[#FF8585] text-white font-black py-3 px-6 rounded-2xl border-4 border-high-ink text-sm uppercase tracking-wider shadow-[0_4px_0_#2D3436] active:translate-y-[2px] active:shadow-[0_1px_0_#2D3436] transition-all cursor-pointer mt-1"
              >
                Got It 👍
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* About Developer Modal */}
      <AnimatePresence>
        {isAboutOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-800 rounded-[2.5rem] border-8 border-high-ink shadow-[0_12px_0_#2D3436] p-6 max-w-md w-full relative flex flex-col gap-4 overflow-hidden text-left"
            >
              <button
                onClick={() => {
                  playClickSound(settings.soundEnabled);
                  setIsAboutOpen(false);
                }}
                className="absolute top-4 right-4 w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-700 border-2 border-high-ink flex items-center justify-center font-black text-high-ink dark:text-white shadow-[0_2px_0_#2D3436] active:translate-y-[1px] cursor-pointer"
              >
                <X className="w-5 h-5 stroke-[3]" />
              </button>

              <div className="flex items-center gap-3 pr-10">
                <span className="text-4xl bg-teal-100 dark:bg-teal-900/40 p-2.5 rounded-2xl border-2 border-high-ink shadow-[0_3px_0_#2D3436]">
                  🚀
                </span>
                <div>
                  <h3 className="text-xl font-black text-high-ink dark:text-white uppercase tracking-wider">
                    KidTech Studio
                  </h3>
                  <span className="text-[10px] font-black uppercase text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded border border-teal-500/30">
                    Version 2.5.0
                  </span>
                </div>
              </div>

              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 leading-relaxed">
                Empowering children with fun, interactive, and 100% offline educational tools in English and Gujarati without ads or distractions.
              </p>

              <div className="flex flex-col gap-2 bg-high-bg dark:bg-slate-700/60 p-3.5 rounded-2xl border-4 border-high-ink">
                <span className="text-xs font-black uppercase text-high-ink dark:text-white flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" /> Key Features
                </span>
                <ul className="text-[11px] font-extrabold text-slate-700 dark:text-slate-200 flex flex-col gap-1">
                  <li>✨ 100% Child-Safe & Ad-Free Experience</li>
                  <li> Offline Interactive Tracing & Phonetics</li>
                  <li>🗣️ Natural English & Gujarati Voice Quiz Engine</li>
                  <li>🎨 Customizable Kids Themes & Audio Modes</li>
                </ul>
              </div>

              <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-400 border-t-2 border-dashed border-slate-200 dark:border-slate-700 pt-3">
                <span>© 2026 KidTech Studio</span>
                <span>Made with ❤️ for Kids</span>
              </div>

              <button
                onClick={() => {
                  playClickSound(settings.soundEnabled);
                  setIsAboutOpen(false);
                }}
                className="bg-high-primary hover:bg-[#FF8585] text-white font-black py-3 px-6 rounded-2xl border-4 border-high-ink text-sm uppercase shadow-[0_4px_0_#2D3436] active:translate-y-[2px] active:shadow-[0_1px_0_#2D3436] transition-all cursor-pointer mt-1 text-center"
              >
                Got It! 👍
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
