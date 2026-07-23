export enum ScreenType {
  Home = 'home',
  EnglishABC = 'english_abc',
  EnglishABCLower = 'english_abc_lower',
  EnglishWords = 'english_words',
  EnglishNumbers = 'english_numbers',
  EnglishSpellings = 'english_spellings',
  GujaratiAlphabet = 'gujarati_alphabet',
  GujaratiBarakhadi = 'gujarati_barakhadi',
  GujaratiNumbers = 'gujarati_numbers',
  GujaratiGhadiya = 'gujarati_ghadiya',
  EnglishTables = 'english_tables',
  Quiz = 'quiz',
  Settings = 'settings',
  WordMatching = 'word_matching',
  InteractiveStories = 'interactive_stories',
  InteractiveStoriesGuj = 'interactive_stories_guj',
  Games = 'games',
  TraceAlphabet = 'trace_alphabet',
  WeeklyProgress = 'weekly_progress',
  AchievementsShelf = 'achievements_shelf'
}

export interface AppSettings {
  englishVoiceURI: string;
  gujaratiVoiceURI: string;
  darkMode: boolean;
  soundEnabled: boolean;
  bgMusicEnabled: boolean;
  autoPlayAudio: boolean;
  vibrationEnabled?: boolean;
  colorPalette?: string;
  englishFontStyle?: string;
}

export interface ColorPalette {
  name: string;
  label: string;
  emoji: string;
  isDark: boolean;
  colors: {
    highBg: string;
    bgGradient: string;
    highInk: string;
    textSecondary: string;
    highPrimary: string;
    highSecondary: string;
    highAccent: string;
    highSuccess: string;
    cardBg: string;
    cardBorder: string;
    headerBg: string;
    navBg: string;
    buttonBg: string;
    buttonText: string;
    shadowColor: string;
    progressBg: string;
    progressFill: string;
    textOnBg: string;
  };
}

export const COLOR_PALETTES: Record<string, ColorPalette> = {
  // ☀️ Sunny Yellow Theme
  sunshine: {
    name: 'sunshine',
    label: 'Sunny Yellow',
    emoji: '☀️',
    isDark: false,
    colors: {
      highBg: '#FFF9E6',
      bgGradient: 'linear-gradient(135deg, #FFF9E6 0%, #FEF08A 100%)',
      highInk: '#2D3436',
      textSecondary: '#64748B',
      highPrimary: '#FF6B6B',
      highSecondary: '#4D96FF',
      highAccent: '#FFD93D',
      highSuccess: '#6BCB77',
      cardBg: '#FFFFFF',
      cardBorder: '#2D3436',
      headerBg: '#FFFFFF',
      navBg: '#FFFFFF',
      buttonBg: '#FF6B6B',
      buttonText: '#FFFFFF',
      shadowColor: '#2D3436',
      progressBg: '#FEF08A',
      progressFill: '#FF6B6B',
      textOnBg: '#2D3436'
    },
  },

  // ☁️ Sky Blue Theme
  skyblue: {
    name: 'skyblue',
    label: 'Sky Blue',
    emoji: '☁️',
    isDark: false,
    colors: {
      highBg: '#E0F2FE',
      bgGradient: 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)',
      highInk: '#0C4A6E',
      textSecondary: '#0369A1',
      highPrimary: '#0284C7',
      highSecondary: '#38BDF8',
      highAccent: '#FACC15',
      highSuccess: '#10B981',
      cardBg: '#FFFFFF',
      cardBorder: '#0C4A6E',
      headerBg: '#FFFFFF',
      navBg: '#FFFFFF',
      buttonBg: '#0284C7',
      buttonText: '#FFFFFF',
      shadowColor: '#0C4A6E',
      progressBg: '#BAE6FD',
      progressFill: '#0284C7',
      textOnBg: '#0C4A6E'
    },
  },

  // 🌿 Mint Green Theme
  mintgreen: {
    name: 'mintgreen',
    label: 'Mint Green',
    emoji: '🌿',
    isDark: false,
    colors: {
      highBg: '#ECFDF5',
      bgGradient: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
      highInk: '#064E3B',
      textSecondary: '#047857',
      highPrimary: '#10B981',
      highSecondary: '#34D399',
      highAccent: '#FACC15',
      highSuccess: '#059669',
      cardBg: '#FFFFFF',
      cardBorder: '#064E3B',
      headerBg: '#FFFFFF',
      navBg: '#FFFFFF',
      buttonBg: '#10B981',
      buttonText: '#FFFFFF',
      shadowColor: '#064E3B',
      progressBg: '#D1FAE5',
      progressFill: '#10B981',
      textOnBg: '#064E3B'
    },
  },

  // 🍑 Peach Orange Theme
  peachorange: {
    name: 'peachorange',
    label: 'Peach Orange',
    emoji: '🍑',
    isDark: false,
    colors: {
      highBg: '#FFF7ED',
      bgGradient: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
      highInk: '#7C2D12',
      textSecondary: '#C2410C',
      highPrimary: '#F97316',
      highSecondary: '#FB923C',
      highAccent: '#FACC15',
      highSuccess: '#22C55E',
      cardBg: '#FFFFFF',
      cardBorder: '#7C2D12',
      headerBg: '#FFFFFF',
      navBg: '#FFFFFF',
      buttonBg: '#F97316',
      buttonText: '#FFFFFF',
      shadowColor: '#7C2D12',
      progressBg: '#FFEDD5',
      progressFill: '#F97316',
      textOnBg: '#7C2D12'
    },
  },

  // 🪻 Lavender Purple Theme
  lavenderpurple: {
    name: 'lavenderpurple',
    label: 'Lavender Purple',
    emoji: '🪻',
    isDark: false,
    colors: {
      highBg: '#F5F3FF',
      bgGradient: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)',
      highInk: '#4C1D95',
      textSecondary: '#6D28D9',
      highPrimary: '#8B5CF6',
      highSecondary: '#A78BFA',
      highAccent: '#FACC15',
      highSuccess: '#10B981',
      cardBg: '#FFFFFF',
      cardBorder: '#4C1D95',
      headerBg: '#FFFFFF',
      navBg: '#FFFFFF',
      buttonBg: '#8B5CF6',
      buttonText: '#FFFFFF',
      shadowColor: '#4C1D95',
      progressBg: '#EDE9FE',
      progressFill: '#8B5CF6',
      textOnBg: '#4C1D95'
    },
  },

  // 🌸 Candy Pink Theme
  candypink: {
    name: 'candypink',
    label: 'Candy Pink',
    emoji: '🌸',
    isDark: false,
    colors: {
      highBg: '#FDF2F8',
      bgGradient: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)',
      highInk: '#831843',
      textSecondary: '#BE185D',
      highPrimary: '#EC4899',
      highSecondary: '#F472B6',
      highAccent: '#FDE047',
      highSuccess: '#10B981',
      cardBg: '#FFFFFF',
      cardBorder: '#831843',
      headerBg: '#FFFFFF',
      navBg: '#FFFFFF',
      buttonBg: '#EC4899',
      buttonText: '#FFFFFF',
      shadowColor: '#831843',
      progressBg: '#FCE7F3',
      progressFill: '#EC4899',
      textOnBg: '#831843'
    },
  },

  // 🌌 Midnight Blue Theme
  midnightblue: {
    name: 'midnightblue',
    label: 'Midnight Blue',
    emoji: '🌌',
    isDark: true,
    colors: {
      highBg: '#0F172A',
      bgGradient: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
      highInk: '#F8FAFC',
      textSecondary: '#94A3B8',
      highPrimary: '#38BDF8',
      highSecondary: '#818CF8',
      highAccent: '#FACC15',
      highSuccess: '#34D399',
      cardBg: '#1E293B',
      cardBorder: '#38BDF8',
      headerBg: '#1E293B',
      navBg: '#1E293B',
      buttonBg: '#38BDF8',
      buttonText: '#0F172A',
      shadowColor: '#0284C7',
      progressBg: '#334155',
      progressFill: '#38BDF8',
      textOnBg: '#F8FAFC'
    },
  },

  // 💜 Deep Purple Theme
  royalpurple: {
    name: 'royalpurple',
    label: 'Deep Purple',
    emoji: '💜',
    isDark: true,
    colors: {
      highBg: '#1E1B4B',
      bgGradient: 'linear-gradient(135deg, #1E1B4B 0%, #311042 100%)',
      highInk: '#F5F3FF',
      textSecondary: '#C4B5FD',
      highPrimary: '#C084FC',
      highSecondary: '#A855F7',
      highAccent: '#FDE047',
      highSuccess: '#34D399',
      cardBg: '#2E2A72',
      cardBorder: '#C084FC',
      headerBg: '#2E2A72',
      navBg: '#2E2A72',
      buttonBg: '#C084FC',
      buttonText: '#1E1B4B',
      shadowColor: '#7E22CE',
      progressBg: '#4338CA',
      progressFill: '#C084FC',
      textOnBg: '#F5F3FF'
    },
  },

  // 🌲 Forest Green Theme
  emeralddark: {
    name: 'emeralddark',
    label: 'Forest Green',
    emoji: '🌲',
    isDark: true,
    colors: {
      highBg: '#064E3B',
      bgGradient: 'linear-gradient(135deg, #064E3B 0%, #022C22 100%)',
      highInk: '#ECFDF5',
      textSecondary: '#A7F3D0',
      highPrimary: '#34D399',
      highSecondary: '#10B981',
      highAccent: '#FACC15',
      highSuccess: '#6EE7B7',
      cardBg: '#065F46',
      cardBorder: '#34D399',
      headerBg: '#065F46',
      navBg: '#065F46',
      buttonBg: '#34D399',
      buttonText: '#064E3B',
      shadowColor: '#047857',
      progressBg: '#047857',
      progressFill: '#34D399',
      textOnBg: '#ECFDF5'
    },
  },

  // 🍷 Maroon Magic Theme
  maroonmagic: {
    name: 'maroonmagic',
    label: 'Maroon Magic',
    emoji: '🍷',
    isDark: true,
    colors: {
      highBg: '#450A0A',
      bgGradient: 'linear-gradient(135deg, #450A0A 0%, #2A0808 100%)',
      highInk: '#FEF2F2',
      textSecondary: '#FECACA',
      highPrimary: '#F87171',
      highSecondary: '#FB923C',
      highAccent: '#FDE047',
      highSuccess: '#4ADE80',
      cardBg: '#7F1D1D',
      cardBorder: '#F87171',
      headerBg: '#7F1D1D',
      navBg: '#7F1D1D',
      buttonBg: '#F87171',
      buttonText: '#450A0A',
      shadowColor: '#991B1B',
      progressBg: '#991B1B',
      progressFill: '#F87171',
      textOnBg: '#FEF2F2'
    },
  },

  // 🌊 Teal Blue Theme
  tealblue: {
    name: 'tealblue',
    label: 'Teal Blue',
    emoji: '🌊',
    isDark: true,
    colors: {
      highBg: '#042F2E',
      bgGradient: 'linear-gradient(135deg, #042F2E 0%, #0F766E 100%)',
      highInk: '#F0FDFA',
      textSecondary: '#99F6E4',
      highPrimary: '#2DD4BF',
      highSecondary: '#38BDF8',
      highAccent: '#FACC15',
      highSuccess: '#34D399',
      cardBg: '#0F766E',
      cardBorder: '#2DD4BF',
      headerBg: '#0F766E',
      navBg: '#0F766E',
      buttonBg: '#2DD4BF',
      buttonText: '#042F2E',
      shadowColor: '#115E59',
      progressBg: '#115E59',
      progressFill: '#2DD4BF',
      textOnBg: '#F0FDFA'
    },
  },

  // Aliases for legacy palettes if stored in localStorage
  default: {
    name: 'sunshine',
    label: 'Sunny Yellow',
    emoji: '☀️',
    isDark: false,
    colors: {
      highBg: '#FFF9E6',
      bgGradient: 'linear-gradient(135deg, #FFF9E6 0%, #FEF08A 100%)',
      highInk: '#2D3436',
      textSecondary: '#64748B',
      highPrimary: '#FF6B6B',
      highSecondary: '#4D96FF',
      highAccent: '#FFD93D',
      highSuccess: '#6BCB77',
      cardBg: '#FFFFFF',
      cardBorder: '#2D3436',
      headerBg: '#FFFFFF',
      navBg: '#FFFFFF',
      buttonBg: '#FF6B6B',
      buttonText: '#FFFFFF',
      shadowColor: '#2D3436',
      progressBg: '#FEF08A',
      progressFill: '#FF6B6B',
      textOnBg: '#2D3436'
    },
  },
  ocean: {
    name: 'tealblue',
    label: 'Teal Blue',
    emoji: '🌊',
    isDark: true,
    colors: {
      highBg: '#042F2E',
      bgGradient: 'linear-gradient(135deg, #042F2E 0%, #0F766E 100%)',
      highInk: '#F0FDFA',
      textSecondary: '#99F6E4',
      highPrimary: '#2DD4BF',
      highSecondary: '#38BDF8',
      highAccent: '#FACC15',
      highSuccess: '#34D399',
      cardBg: '#0F766E',
      cardBorder: '#2DD4BF',
      headerBg: '#0F766E',
      navBg: '#0F766E',
      buttonBg: '#2DD4BF',
      buttonText: '#042F2E',
      shadowColor: '#115E59',
      progressBg: '#115E59',
      progressFill: '#2DD4BF',
      textOnBg: '#F0FDFA'
    },
  },
  forest: {
    name: 'emeralddark',
    label: 'Forest Green',
    emoji: '🌲',
    isDark: true,
    colors: {
      highBg: '#064E3B',
      bgGradient: 'linear-gradient(135deg, #064E3B 0%, #022C22 100%)',
      highInk: '#ECFDF5',
      textSecondary: '#A7F3D0',
      highPrimary: '#34D399',
      highSecondary: '#10B981',
      highAccent: '#FACC15',
      highSuccess: '#6EE7B7',
      cardBg: '#065F46',
      cardBorder: '#34D399',
      headerBg: '#065F46',
      navBg: '#065F46',
      buttonBg: '#34D399',
      buttonText: '#064E3B',
      shadowColor: '#047857',
      progressBg: '#047857',
      progressFill: '#34D399',
      textOnBg: '#ECFDF5'
    },
  },
  sunset: {
    name: 'peachorange',
    label: 'Peach Orange',
    emoji: '🍑',
    isDark: false,
    colors: {
      highBg: '#FFF7ED',
      bgGradient: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
      highInk: '#7C2D12',
      textSecondary: '#C2410C',
      highPrimary: '#F97316',
      highSecondary: '#FB923C',
      highAccent: '#FACC15',
      highSuccess: '#22C55E',
      cardBg: '#FFFFFF',
      cardBorder: '#7C2D12',
      headerBg: '#FFFFFF',
      navBg: '#FFFFFF',
      buttonBg: '#F97316',
      buttonText: '#FFFFFF',
      shadowColor: '#7C2D12',
      progressBg: '#FFEDD5',
      progressFill: '#F97316',
      textOnBg: '#7C2D12'
    },
  },
};

export interface AvatarConfig {
  playerName: string;
  shape: string;       // 'circle' | 'squircle' | 'hexagon' | 'shield' | 'flower' | 'star'
  bgColor: string;     // color key (class or hex or gradient)
  emoji: string;       // emoji character
  borderColor: string; // color key or name
  borderStyle: string; // 'solid' | 'dashed' | 'double' | 'dotted'
}

export interface WordItem {
  letter: string;
  word: string;
  emoji: string;
  phonetic: string;
}

export interface SpellingItem {
  number: number;
  spelling: string;
}

export interface GujNumberItem {
  number: number;
  gujNumber: string;
  gujSpelling: string;
}

export interface QuizQuestion {
  id: string;
  type: string;
  questionText: string;
  speakText: string; // Text to speak when question loads
  options: string[];
  correctAnswer: string;
  emojiHint?: string;
}




