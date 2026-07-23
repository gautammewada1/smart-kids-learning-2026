export interface EnglishFontOption {
  id: string;
  name: string;
  fontFamily: string;
  fontWeight: number;
  description: string;
  emoji: string;
}

export const ENGLISH_FONTS: EnglishFontOption[] = [
  {
    id: 'fredoka',
    name: 'Fredoka Bold',
    fontFamily: "'Fredoka', 'Fredoka One', 'Arial Rounded MT Bold', 'Chalkboard SE', sans-serif",
    fontWeight: 700,
    description: 'Round, playful & bubbly',
    emoji: '🎈',
  },
  {
    id: 'baloo',
    name: 'Baloo 2 Bold',
    fontFamily: "'Baloo 2', 'Baloo Bhai 2', 'Trebuchet MS', cursive, sans-serif",
    fontWeight: 800,
    description: 'Bouncy, expressive & fun',
    emoji: '🧸',
  },
  {
    id: 'nunito',
    name: 'Nunito ExtraBold',
    fontFamily: "'Nunito', 'Segoe UI', 'Comic Sans MS', sans-serif",
    fontWeight: 800,
    description: 'Soft, rounded & super clear',
    emoji: '🎨',
  },
  {
    id: 'poppins',
    name: 'Poppins Bold',
    fontFamily: "'Poppins', 'Helvetica Neue', 'Arial', sans-serif",
    fontWeight: 700,
    description: 'Modern, crisp & punchy',
    emoji: '⚡',
  },
  {
    id: 'quicksand',
    name: 'Quicksand Bold',
    fontFamily: "'Quicksand', 'Century Gothic', sans-serif",
    fontWeight: 700,
    description: 'Clean, geometric & cute',
    emoji: '✨',
  },
  {
    id: 'comic',
    name: 'Comic Neue Bold',
    fontFamily: "'Comic Neue', 'Comic Sans MS', 'Chalkboard', cursive, sans-serif",
    fontWeight: 700,
    description: 'Classic comic book style',
    emoji: '📚',
  },
];

export function getEnglishFont(fontId?: string): EnglishFontOption {
  if (!fontId) return ENGLISH_FONTS[0];
  return ENGLISH_FONTS.find(f => f.id === fontId) || ENGLISH_FONTS[0];
}

export function applyEnglishFontGlobal(fontId?: string) {
  const font = getEnglishFont(fontId);
  if (typeof document !== 'undefined' && document.documentElement) {
    const root = document.documentElement;
    root.style.setProperty('--english-font-family', font.fontFamily);
    root.style.setProperty('--english-font-weight', String(font.fontWeight));
  }
}
