import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, ChevronLeft, ChevronRight, Grid, Shuffle, Printer } from 'lucide-react';
import CategoryHeader from './CategoryHeader';
import { ScreenType, AppSettings } from '../types';
import { 
  ENGLISH_ABC, 
  ENGLISH_WORDS, 
  getEnglishNumberSpelling, 
  GUJARATI_ALPHABET, 
  GUJARATI_VOWELS,
  GUJARATI_CONSONANTS, 
  GUJARATI_BARAKHADI_MATRAS, 
  GUJARATI_NUMBERS,
  toGujaratiNumberString,
  getEnglishTable,
  getGujaratiTable,
  TableRow
} from '../data';
import { speakText, playClickSound } from '../utils/audio';
import { UserProgress } from '../utils/userState';
import ChikuMascot from './ChikuMascot';

interface LearningScreenProps {
  type: ScreenType;
  settings: AppSettings;
  progress: UserProgress;
  onCompleteItem: (index: number, customType?: ScreenType) => void;
  onBackToHome: () => void;
  onUpdateSettings: (newSettings: AppSettings) => void;
  initialIndex?: number;
}

// Cheer/motivation words to show on card
const EN_MOTIVATIONS = ['Super!', 'Great!', 'Awesome!', 'Brilliant!', 'Smart Kid!', 'Wonderful!', 'Wow!'];
const GUJ_MOTIVATIONS = ['ખૂબ સરસ!', 'શાબાશ!', 'અદ્ભુત!', 'વાહ ભાઈ વાહ!', 'સુપર!', 'ઉત્તમ!'];

export default function LearningScreen({ 
  type, 
  settings, 
  progress, 
  onCompleteItem, 
  onBackToHome, 
  onUpdateSettings,
  initialIndex
}: LearningScreenProps) {
  const [alphabetTab, setAlphabetTab] = useState<'swar' | 'vyanjan'>(() => {
    if (type === ScreenType.GujaratiAlphabet && initialIndex !== undefined) {
      return initialIndex >= 13 ? 'vyanjan' : 'swar';
    }
    return 'vyanjan';
  });

  const [englishTab, setEnglishTab] = useState<'upper' | 'lower'>(() => {
    if (type === ScreenType.EnglishABCLower) {
      return 'lower';
    }
    return 'upper';
  });

  const [englishNumbersTab, setEnglishNumbersTab] = useState<'1-100' | '100-51' | '50-1'>('1-100');
  const [gujaratiNumbersTab, setGujaratiNumbersTab] = useState<'ascending' | 'descending'>('ascending');

  const [index, setIndex] = useState(() => {
    if (initialIndex !== undefined) {
      if (type === ScreenType.GujaratiAlphabet) {
        return initialIndex >= 13 ? initialIndex - 13 : initialIndex;
      }
      return initialIndex;
    }
    return 0;
  });

  const [direction, setDirection] = useState(0); // -1 for prev, 1 for next
  const [motivation, setMotivation] = useState('');
  const [showBarakhadiMenu, setShowBarakhadiMenu] = useState(false);
  const [showTopicMenu, setShowTopicMenu] = useState(false);

  // Determine total items and screen details based on type
  let itemsCount = 0;
  let title = '';
  let bgClass = 'bg-[#FF6B6B]';

  // 1. English ABC
  if (type === ScreenType.EnglishABC) {
    itemsCount = ENGLISH_ABC.length;
    title = 'English Alphabet';
    bgClass = 'bg-[#FF6B6B]';
  } 
  else if (type === ScreenType.EnglishABCLower) {
    itemsCount = ENGLISH_ABC.length;
    title = 'English Alphabet';
    bgClass = 'bg-[#FF6B6B]';
  }
  // 2. English Words
  else if (type === ScreenType.EnglishWords) {
    itemsCount = ENGLISH_WORDS.length;
    title = 'English Words (A–Z)';
    bgClass = 'bg-[#4D96FF]';
  } 
  // 3. English Numbers
  else if (type === ScreenType.EnglishNumbers) {
    itemsCount = englishNumbersTab === '1-100' ? 100 : 50;
    title = 'English Numbers';
    bgClass = 'bg-[#6BCB77]';
  } 
  // 4. English Spellings
  else if (type === ScreenType.EnglishSpellings) {
    itemsCount = 100; // 1 to 100
    title = 'English Numbers With Spellings';
    bgClass = 'bg-[#B10DC9]';
  } 
  // 5. Gujarati Alphabet
  else if (type === ScreenType.GujaratiAlphabet) {
    itemsCount = alphabetTab === 'swar' ? GUJARATI_VOWELS.length : GUJARATI_CONSONANTS.length;
    title = alphabetTab === 'swar' ? 'ગુજરાતી સ્વર' : 'ગુજરાતી કક્કો';
    bgClass = 'bg-[#FF851B]';
  } 
  // 6. Gujarati Barakhadi
  else if (type === ScreenType.GujaratiBarakhadi) {
    // 36 consonants * 12 matras = 432 total
    itemsCount = GUJARATI_CONSONANTS.length * GUJARATI_BARAKHADI_MATRAS.length;
    title = 'ગુજરાતી બારાખડી';
    bgClass = 'bg-[#39CCCC]';
  } 
  // 7. Gujarati Numbers
  else if (type === ScreenType.GujaratiNumbers) {
    itemsCount = GUJARATI_NUMBERS.length;
    title = 'ગુજરાતી અંકો';
    bgClass = 'bg-[#FF41C8]';
  }
  // 8. Gujarati Ghadiya
  else if (type === ScreenType.GujaratiGhadiya) {
    itemsCount = 20; // 1 to 20 tables
    title = 'ગુજરાતી અંકોના શબ્દો';
    bgClass = 'bg-[#FF851B]';
  }
  // 9. English Tables
  else if (type === ScreenType.EnglishTables) {
    itemsCount = 20; // 1 to 20 tables
    title = 'English Tables (1–20)';
    bgClass = 'bg-[#1ABC9C]';
  }

  // Get current card's voice playback text and information
  const handleSpeak = (forceIndex?: number) => {
    // For English Tables and Gujarati Ghadiya ONLY, do NOT use Text-to-Speech as requested.
    if (type === ScreenType.EnglishTables || type === ScreenType.GujaratiGhadiya) {
      console.log(`[handleSpeak] Skipping Text-to-Speech for module: ${type}`);
      return;
    }

    const currentIndex = forceIndex !== undefined ? forceIndex : index;
    let textToSpeak = '';
    let language: 'en' | 'gu' = 'en';

    if (type === ScreenType.EnglishABC) {
      const letter = ENGLISH_ABC[currentIndex];
      if (englishTab === 'upper') {
        // Speak "A, small a" format as required
        textToSpeak = `${letter}, small ${letter.toLowerCase()}`;
      } else {
        // Speak the small letter name, e.g. "small a"
        textToSpeak = `small ${letter.toLowerCase()}`;
      }
      language = 'en';
    } 
    else if (type === ScreenType.EnglishABCLower) {
      const letter = ENGLISH_ABC[currentIndex];
      // Speak the small letter name, e.g. "small a"
      textToSpeak = `small ${letter.toLowerCase()}`;
      language = 'en';
    }
    else if (type === ScreenType.EnglishWords) {
      const item = ENGLISH_WORDS[currentIndex];
      // Speak the complete learning phrase based on the displayed image and word, e.g. "A for Apple"
      textToSpeak = item.phonetic;
      language = 'en';
    } 
    else if (type === ScreenType.EnglishNumbers) {
      // Speak the spelling of the number, e.g. "One", "Fifteen"
      let val = currentIndex + 1;
      if (englishNumbersTab === '1-100') {
        val = currentIndex + 1;
      } else if (englishNumbersTab === '100-51') {
        val = 100 - currentIndex;
      } else if (englishNumbersTab === '50-1') {
        val = 50 - currentIndex;
      }
      textToSpeak = getEnglishNumberSpelling(val);
      language = 'en';
    } 
    else if (type === ScreenType.EnglishSpellings) {
      // Speak the spelling of the number, e.g. "One", "Fifteen"
      textToSpeak = getEnglishNumberSpelling(currentIndex + 1);
      language = 'en';
    } 
    else if (type === ScreenType.GujaratiAlphabet) {
      const item = alphabetTab === 'swar' ? GUJARATI_VOWELS[currentIndex] : GUJARATI_CONSONANTS[currentIndex];
      if (alphabetTab === 'vyanjan' && item.word && item.word !== item.char) {
        textToSpeak = `${item.char} ${item.word} નો ${item.char}`;
      } else {
        textToSpeak = `${item.char}`;
      }
      language = 'gu';
    } 
    else if (type === ScreenType.GujaratiBarakhadi) {
      const consonantIdx = Math.floor(currentIndex / GUJARATI_BARAKHADI_MATRAS.length);
      const matraIdx = currentIndex % GUJARATI_BARAKHADI_MATRAS.length;
      const consonant = GUJARATI_CONSONANTS[consonantIdx];
      const matra = GUJARATI_BARAKHADI_MATRAS[matraIdx];
      // Speak combined barakhadi letter phonetically (e.g. કા)
      textToSpeak = `${consonant.char}${matra.sign}`;
      language = 'gu';
    } 
    else if (type === ScreenType.GujaratiNumbers) {
      const realIdx = gujaratiNumbersTab === 'ascending' ? currentIndex : 99 - currentIndex;
      const item = GUJARATI_NUMBERS[realIdx];
      // Speak spelling word, e.g. "એક", "દસ"
      textToSpeak = `${item.gujSpelling}`;
      language = 'gu';
    }

    speakText(textToSpeak, language, language === 'gu' ? settings.gujaratiVoiceURI : settings.englishVoiceURI, settings.soundEnabled, type);
  };

  const speakRow = (row: TableRow) => {
    // For English Tables and Gujarati Ghadiya ONLY, do NOT use Text-to-Speech as requested.
    console.log('[speakRow] Skipping Text-to-Speech for table row:', row);
  };

  // Trigger speech when slide index changes and report progress
  useEffect(() => {
    if (settings.autoPlayAudio) {
      handleSpeak();
    }
    
    if (type === ScreenType.EnglishABC) {
      const targetType = englishTab === 'upper' ? ScreenType.EnglishABC : ScreenType.EnglishABCLower;
      onCompleteItem(index, targetType);
    } else if (type === ScreenType.EnglishNumbers) {
      let absIdx = index;
      if (englishNumbersTab === '1-100') {
        absIdx = index;
      } else if (englishNumbersTab === '100-51') {
        absIdx = 99 - index;
      } else if (englishNumbersTab === '50-1') {
        absIdx = 49 - index;
      }
      onCompleteItem(absIdx);
    } else if (type === ScreenType.GujaratiNumbers) {
      const absIdx = gujaratiNumbersTab === 'ascending' ? index : 99 - index;
      onCompleteItem(absIdx);
    } else {
      onCompleteItem(type === ScreenType.GujaratiAlphabet && alphabetTab === 'vyanjan' ? index + 13 : index);
    }
    
    // Choose random kid cheer/motivation
    const isGuj = type === ScreenType.GujaratiAlphabet || type === ScreenType.GujaratiBarakhadi || type === ScreenType.GujaratiNumbers || type === ScreenType.GujaratiGhadiya;
    const array = isGuj ? GUJ_MOTIVATIONS : EN_MOTIVATIONS;
    setMotivation(array[Math.floor(Math.random() * array.length)]);
  }, [index, type, alphabetTab, englishTab, englishNumbersTab, gujaratiNumbersTab, settings.autoPlayAudio]);

  const handleNext = () => {
    playClickSound(settings.soundEnabled);
    if (index < itemsCount - 1) {
      setDirection(1);
      setIndex(prev => prev + 1);
    } else {
      // Loop back to start
      setDirection(1);
      setIndex(0);
    }
  };

  const handlePrev = () => {
    playClickSound(settings.soundEnabled);
    if (index > 0) {
      setDirection(-1);
      setIndex(prev => prev - 1);
    } else {
      // Loop to end
      setDirection(-1);
      setIndex(itemsCount - 1);
    }
  };

  // Keyboard and swipe-like buttons
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [index, itemsCount]);

  // Specific content renderer inside the gorgeous kids card
  const renderCardContent = () => {
    // English ABC
    if (type === ScreenType.EnglishABC) {
      const letter = englishTab === 'upper' ? ENGLISH_ABC[index] : ENGLISH_ABC[index].toLowerCase();
      const colors = [
        'text-rose-500', 'text-teal-500', 'text-amber-500', 'text-blue-500', 
        'text-pink-500', 'text-indigo-500', 'text-orange-500', 'text-emerald-500'
      ];
      const color = colors[index % colors.length];
      return (
        <div className="flex flex-col items-center justify-center h-full p-4 select-none text-center">
          <motion.div 
            initial={{ scale: 0.5, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 10 }}
            className={`font-extrabold tracking-tight filter drop-shadow-md flex flex-col items-center justify-center leading-none ${color} text-[8.5rem] md:text-[11.5rem]`}
          >
            <span>{letter}</span>
          </motion.div>
          <div className="mt-4 text-gray-500 font-medium tracking-wide text-2xl uppercase">
            Letter {index + 1} of 26
          </div>
        </div>
      );
    }

    // English abc
    if (type === ScreenType.EnglishABCLower) {
      const letter = ENGLISH_ABC[index].toLowerCase();
      const colors = [
        'text-rose-500', 'text-teal-500', 'text-amber-500', 'text-blue-500', 
        'text-pink-500', 'text-indigo-500', 'text-orange-500', 'text-emerald-500'
      ];
      const color = colors[index % colors.length];
      return (
        <div className="flex flex-col items-center justify-center h-full p-4 select-none text-center">
          <motion.div 
            initial={{ scale: 0.5, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 10 }}
            className={`font-extrabold tracking-tight filter drop-shadow-md flex flex-col items-center justify-center leading-none ${color} text-[8.5rem] md:text-[11.5rem]`}
          >
            <span>{letter}</span>
          </motion.div>
          <div className="mt-4 text-gray-500 font-medium tracking-wide text-2xl uppercase">
            Letter {index + 1} of 26
          </div>
        </div>
      );
    }

    // English Words
    if (type === ScreenType.EnglishWords) {
      const item = ENGLISH_WORDS[index];
      return (
        <div className="flex flex-col items-center justify-between h-full p-6 select-none">
          {/* Header Indicator */}
          <div className="text-5xl md:text-6xl font-extrabold text-indigo-500 bg-indigo-50 px-6 py-2 rounded-full border-3 border-indigo-200">
            {item.letter}
          </div>

          {/* Large Emoji / Visual */}
          <motion.div 
            initial={{ scale: 0.3, bounce: 0.5 }}
            animate={{ scale: 1 }}
            key={item.emoji}
            className="text-[10rem] md:text-[13rem] my-4 filter drop-shadow-lg cursor-pointer transform hover:scale-105 active:scale-95 transition-transform duration-150"
          >
            {item.emoji}
          </motion.div>

          {/* Label Word */}
          <div className="flex flex-col items-center">
            <h2 className="text-4xl md:text-5xl font-black text-gray-800 tracking-wide">
              {item.word}
            </h2>
            <p className="text-lg text-gray-400 font-semibold tracking-wider uppercase mt-1">
              {item.phonetic}
            </p>
          </div>
        </div>
      );
    }

    // English Numbers
    if (type === ScreenType.EnglishNumbers) {
      const colors = ['text-pink-500', 'text-teal-500', 'text-violet-500', 'text-orange-500', 'text-sky-500', 'text-emerald-500'];
      const color = colors[index % colors.length];
      
      let value = index + 1;
      if (englishNumbersTab === '1-100') {
        value = index + 1;
      } else if (englishNumbersTab === '100-51') {
        value = 100 - index;
      } else if (englishNumbersTab === '50-1') {
        value = 50 - index;
      }

      return (
        <div className="flex flex-col items-center justify-center h-full p-4 select-none text-center">
          <motion.div 
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            key={`${value}-${englishNumbersTab}`}
            className={`font-black leading-none ${color} ${
              value < 10 
                ? 'text-[11rem] md:text-[14rem]' 
                : value < 100 
                ? 'text-[9rem] md:text-[11rem]' 
                : 'text-[7.5rem] md:text-[9.5rem]'
            }`}
          >
            {value}
          </motion.div>
          
          {/* Count stars dynamically for numbers 1 to 10 to assist early learners */}
          {value <= 10 && (
            <div className="flex flex-wrap justify-center gap-2 mt-8 max-w-xs md:max-w-md">
              {Array.from({ length: value }).map((_, i) => (
                <span key={i} className="text-2xl md:text-3xl animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
                  ⭐
                </span>
              ))}
            </div>
          )}
        </div>
      );
    }

    // English Spellings
    if (type === ScreenType.EnglishSpellings) {
      const value = index + 1;
      const spelling = getEnglishNumberSpelling(value);
      return (
        <div className="flex flex-col items-center justify-center h-full p-6 select-none text-center gap-6">
          {/* Card for Number */}
          <div className="w-full max-w-[280px] bg-white dark:bg-slate-700 rounded-3xl border-4 border-high-ink shadow-[0_8px_0_#2D3436] p-6 flex items-center justify-center">
            <span className="text-7xl md:text-8xl font-black text-purple-600 dark:text-purple-400">
              {value}
            </span>
          </div>

          {/* Card for Spelling */}
          <div className="w-full max-w-[280px] bg-white dark:bg-slate-700 rounded-3xl border-4 border-high-ink shadow-[0_8px_0_#2D3436] p-6 flex items-center justify-center">
            <motion.h3 
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              key={`spelling-${value}`}
              className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white uppercase tracking-wider leading-tight"
            >
              {spelling}
            </motion.h3>
          </div>
        </div>
      );
    }

    // Gujarati Alphabet
    if (type === ScreenType.GujaratiAlphabet) {
      const item = alphabetTab === 'swar' ? GUJARATI_VOWELS[index] : GUJARATI_CONSONANTS[index];
      return (
        <div className="flex flex-col items-center justify-between h-full p-6 select-none text-center">
          {/* Vowel / Consonant Indicator */}
          <span className="text-sm font-black uppercase px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 border border-orange-200">
            {alphabetTab === 'swar' ? 'સ્વર (Vowel)' : 'વ્યંજન (Consonant)'}
          </span>

          <motion.div 
            initial={{ scale: 0.6 }}
            animate={{ scale: 1 }}
            key={item.char}
            className="text-[10rem] md:text-[13rem] font-bold text-orange-600 leading-none filter drop-shadow-sm my-2"
          >
            {item.char}
          </motion.div>

          <div className="bg-amber-50 dark:bg-slate-700 rounded-2xl p-4 w-full max-w-sm border-2 border-amber-200 dark:border-slate-600">
            <div className="flex items-center justify-center gap-3">
              <span className="text-5xl">{item.emoji}</span>
              <div className="text-left">
                <p className="text-xs text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">Example Word</p>
                <h4 className="text-2xl md:text-3xl font-extrabold text-amber-900 dark:text-amber-100">{item.word}</h4>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Gujarati Barakhadi
    if (type === ScreenType.GujaratiBarakhadi) {
      const consonantIdx = Math.floor(index / GUJARATI_BARAKHADI_MATRAS.length);
      const matraIdx = index % GUJARATI_BARAKHADI_MATRAS.length;
      const consonant = GUJARATI_CONSONANTS[consonantIdx];
      const matra = GUJARATI_BARAKHADI_MATRAS[matraIdx];
      const barakhadiLetter = `${consonant.char}${matra.sign}`;

      return (
        <div className="flex flex-col items-center justify-between h-full p-6 select-none text-center">
          {/* Top helper info */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-black text-blue-600 bg-blue-100 px-4 py-1.5 rounded-full border border-blue-200">
              વ્યંજન: {consonant.char}
            </span>
            <span className="text-lg font-black text-teal-600 bg-teal-100 px-4 py-1.5 rounded-full border border-teal-200">
              સ્વર ચિહ્ન: {matra.sign || 'અ'}
            </span>
          </div>

          <motion.div 
            initial={{ scale: 0.4 }}
            animate={{ scale: 1 }}
            key={barakhadiLetter}
            className="text-[11rem] md:text-[14rem] font-bold text-blue-600 leading-none filter drop-shadow-md my-4"
          >
            {barakhadiLetter}
          </motion.div>

          <div className="text-xl md:text-2xl font-bold text-gray-500 bg-slate-50 px-6 py-2 rounded-2xl border border-slate-200">
            {consonant.char} + {matra.sign || 'અ'} = {barakhadiLetter}
          </div>
        </div>
      );
    }

    // Gujarati Numbers
    if (type === ScreenType.GujaratiNumbers) {
      const realIdx = gujaratiNumbersTab === 'ascending' ? index : 99 - index;
      const item = GUJARATI_NUMBERS[realIdx];
      return (
        <div className="flex flex-col items-center justify-center h-full p-6 select-none text-center">
          <motion.div 
            initial={{ scale: 0.5, y: -10 }}
            animate={{ scale: 1, y: 0 }}
            key={`${realIdx}-${gujaratiNumbersTab}`}
            className={`font-black text-rose-500 leading-none select-none ${
              item.gujNumber.length === 1 
                ? 'text-[12rem] md:text-[15rem]' 
                : item.gujNumber.length === 2 
                ? 'text-[9.5rem] md:text-[12.5rem]' 
                : 'text-[7.5rem] md:text-[9.5rem]'
            }`}
          >
            {item.gujNumber}
          </motion.div>
 
          <motion.h3 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            key={`spelling-${realIdx}`}
            className="text-4xl md:text-5xl font-black text-gray-700 dark:text-slate-100 mt-6 tracking-wide"
          >
            {item.gujSpelling}
          </motion.h3>
        </div>
      );
    }

    // Gujarati Ghadiya
    if (type === ScreenType.GujaratiGhadiya) {
      const tableRows = getGujaratiTable(index + 1);
      return (
        <div className="flex flex-col h-full px-4 py-3 select-none justify-center">
          <div className="text-center mb-2">
            <h3 className="text-2xl md:text-3xl font-black text-orange-500 uppercase tracking-wide">
              {toGujaratiNumberString(index + 1)} નો ઘડિયો
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-2 max-w-md mx-auto w-full">
            {tableRows.map((row) => (
              <button
                key={row.mult}
                onClick={(e) => {
                  e.stopPropagation();
                  playClickSound(settings.soundEnabled);
                  speakRow(row);
                }}
                className="py-2.5 px-4 text-base md:text-lg font-extrabold bg-slate-50 hover:bg-orange-500/10 dark:bg-slate-700 dark:hover:bg-slate-600 border-3 border-high-ink rounded-2xl flex items-center justify-center gap-1.5 shadow-[0_3px_0_#2D3436] hover:translate-y-[-1px] hover:shadow-[0_4px_0_#2D3436] active:translate-y-[1px] active:shadow-[0_1px_0_#2D3436] transition-all text-high-ink dark:text-white"
              >
                <span>{row.gujNum}</span>
                <span className="text-xs text-slate-400">×</span>
                <span>{row.gujMult}</span>
                <span className="text-xs text-slate-400">=</span>
                <span className="text-orange-500 font-black">{row.gujResult}</span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    // English Tables
    if (type === ScreenType.EnglishTables) {
      const tableRows = getEnglishTable(index + 1);
      return (
        <div className="flex flex-col h-full px-4 py-3 select-none justify-center">
          <div className="text-center mb-2">
            <h3 className="text-2xl md:text-3xl font-black text-[#1ABC9C] uppercase tracking-wide">
              Table of {index + 1}
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-2 max-w-md mx-auto w-full">
            {tableRows.map((row) => (
              <button
                key={row.mult}
                onClick={(e) => {
                  e.stopPropagation();
                  playClickSound(settings.soundEnabled);
                  speakRow(row);
                }}
                className="py-2.5 px-4 text-base md:text-lg font-extrabold bg-slate-50 hover:bg-[#1ABC9C]/10 dark:bg-slate-700 dark:hover:bg-slate-600 border-3 border-high-ink rounded-2xl flex items-center justify-center gap-1.5 shadow-[0_3px_0_#2D3436] hover:translate-y-[-1px] hover:shadow-[0_4px_0_#2D3436] active:translate-y-[1px] active:shadow-[0_1px_0_#2D3436] transition-all text-high-ink dark:text-white"
              >
                <span>{row.num}</span>
                <span className="text-xs text-slate-400">×</span>
                <span>{row.mult}</span>
                <span className="text-xs text-slate-400">=</span>
                <span className="text-[#1ABC9C] font-black">{row.result}</span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  // Helper to jump to a specific consonant's Barakhadi
  const handleBarakhadiConsonantSelect = (cIdx: number) => {
    const newIdx = cIdx * GUJARATI_BARAKHADI_MATRAS.length;
    setIndex(newIdx);
    setShowBarakhadiMenu(false);
    playClickSound(settings.soundEnabled);
  };

  // Print-friendly worksheet structure
  const renderPrintWorksheet = () => {
    // English ABC
    if (type === ScreenType.EnglishABC) {
      const letter = ENGLISH_ABC[index];
      if (englishTab === 'upper') {
        return (
          <div className="flex flex-col gap-6 text-slate-800">
            <div className="flex items-center justify-between border-4 border-slate-900 rounded-[2rem] p-6 bg-slate-50">
              <div className="flex flex-col">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Lesson</span>
                <span className="text-7xl font-black text-slate-900 mt-1">{letter}</span>
              </div>
              <div className="w-56 h-28 border-4 border-dashed border-slate-300 rounded-2xl flex items-center justify-center text-slate-400 text-xs font-bold p-3 text-center">
                Draw or color an object starting with "{letter}"!
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-base font-black text-slate-900 uppercase tracking-wider mb-2">1. Tracing Practice</h4>
              <p className="text-sm font-bold text-slate-500 mb-4">Carefully trace the letters following the guidelines:</p>
              <div className="space-y-4">
                <div className="border-2 border-slate-300 rounded-2xl p-4 bg-slate-50/50">
                  <span className="text-3xl font-normal tracking-[2.5rem] text-slate-300 border-b border-dashed border-slate-200 pb-1.5 block w-full leading-none pl-2">
                    {Array(6).fill(letter).join(' ')}
                  </span>
                  <span className="text-[10px] font-black text-slate-400 uppercase block mt-1">Trace Uppercase Letter {letter}</span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-base font-black text-slate-900 uppercase tracking-wider mb-2">2. Independent Handwriting Practice</h4>
              <p className="text-sm font-bold text-slate-500 mb-3">Now write the letters on your own in the guide lines below:</p>
              <div className="space-y-4">
                <div className="handwriting-lines rounded-2xl" />
                <div className="handwriting-lines rounded-2xl" />
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div className="flex flex-col gap-6 text-slate-800">
            <div className="flex items-center justify-between border-4 border-slate-900 rounded-[2rem] p-6 bg-slate-50">
              <div className="flex flex-col">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Lesson</span>
                <span className="text-7xl font-black text-slate-900 mt-1">{letter.toLowerCase()}</span>
              </div>
              <div className="w-56 h-28 border-4 border-dashed border-slate-300 rounded-2xl flex items-center justify-center text-slate-400 text-xs font-bold p-3 text-center">
                Draw or color an object starting with "{letter.toLowerCase()}"!
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-base font-black text-slate-900 uppercase tracking-wider mb-2">1. Tracing Practice</h4>
              <p className="text-sm font-bold text-slate-500 mb-4">Carefully trace the letters following the guidelines:</p>
              <div className="space-y-4">
                <div className="border-2 border-slate-300 rounded-2xl p-4 bg-slate-50/50">
                  <span className="text-3xl font-normal tracking-[2.5rem] text-slate-300 border-b border-dashed border-slate-200 pb-1.5 block w-full leading-none pl-2">
                    {Array(6).fill(letter.toLowerCase()).join(' ')}
                  </span>
                  <span className="text-[10px] font-black text-slate-400 uppercase block mt-1">Trace Lowercase Letter {letter.toLowerCase()}</span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-base font-black text-slate-900 uppercase tracking-wider mb-2">2. Independent Handwriting Practice</h4>
              <p className="text-sm font-bold text-slate-500 mb-3">Now write the letters on your own in the guide lines below:</p>
              <div className="space-y-4">
                <div className="handwriting-lines rounded-2xl" />
                <div className="handwriting-lines rounded-2xl" />
              </div>
            </div>
          </div>
        );
      }
    }

    // English abc
    if (type === ScreenType.EnglishABCLower) {
      const letter = ENGLISH_ABC[index];
      return (
        <div className="flex flex-col gap-6 text-slate-800">
          <div className="flex items-center justify-between border-4 border-slate-900 rounded-[2rem] p-6 bg-slate-50">
            <div className="flex flex-col">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Lesson</span>
              <span className="text-7xl font-black text-slate-900 mt-1">{letter.toLowerCase()}</span>
            </div>
            <div className="w-56 h-28 border-4 border-dashed border-slate-300 rounded-2xl flex items-center justify-center text-slate-400 text-xs font-bold p-3 text-center">
              Draw or color an object starting with "{letter.toLowerCase()}"!
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-base font-black text-slate-900 uppercase tracking-wider mb-2">1. Tracing Practice</h4>
            <p className="text-sm font-bold text-slate-500 mb-4">Carefully trace the letters following the guidelines:</p>
            <div className="space-y-4">
              <div className="border-2 border-slate-300 rounded-2xl p-4 bg-slate-50/50">
                <span className="text-3xl font-normal tracking-[2.5rem] text-slate-300 border-b border-dashed border-slate-200 pb-1.5 block w-full leading-none pl-2">
                  {Array(6).fill(letter.toLowerCase()).join(' ')}
                </span>
                <span className="text-[10px] font-black text-slate-400 uppercase block mt-1">Trace Lowercase Letter {letter.toLowerCase()}</span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-base font-black text-slate-900 uppercase tracking-wider mb-2">2. Independent Handwriting Practice</h4>
            <p className="text-sm font-bold text-slate-500 mb-3">Now write the letters on your own in the guide lines below:</p>
            <div className="space-y-4">
              <div className="handwriting-lines rounded-2xl" />
              <div className="handwriting-lines rounded-2xl" />
            </div>
          </div>
        </div>
      );
    }

    // English Words
    if (type === ScreenType.EnglishWords) {
      const item = ENGLISH_WORDS[index];
      return (
        <div className="flex flex-col gap-6 text-slate-800">
          <div className="flex items-center justify-between border-4 border-slate-900 rounded-[2rem] p-6 bg-slate-50">
            <div>
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">A-Z Kids Dictionary</span>
              <h2 className="text-4xl font-black text-slate-900 mt-1">{item.word}</h2>
              <p className="text-sm text-slate-500 font-bold tracking-wider mt-1">{item.letter} is for {item.word}</p>
            </div>
            <span className="text-7xl p-2 select-none filter grayscale">{item.emoji}</span>
          </div>

          <div className="mt-4">
            <h4 className="text-base font-black text-slate-900 uppercase tracking-wider mb-2">1. Word Spelling Tracing</h4>
            <p className="text-sm font-bold text-slate-500 mb-4">Trace the word letters carefully to learn spelling:</p>
            <div className="border-2 border-slate-300 rounded-2xl p-4 bg-slate-50/50">
              <span className="text-3xl font-black tracking-[1.5rem] text-slate-300 border-b-2 border-dashed border-slate-200 pb-2 block w-full pl-2">
                {item.word.toUpperCase().split('').join(' ')}
              </span>
              <span className="text-[10px] font-black text-slate-400 uppercase block mt-2">Pronounced: "{item.phonetic}"</span>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-base font-black text-slate-900 uppercase tracking-wider mb-2">2. Spelling Handwriting Practice</h4>
            <p className="text-sm font-bold text-slate-500 mb-3">Write the word three times on the lines below:</p>
            <div className="space-y-4">
              <div className="handwriting-lines rounded-2xl" />
              <div className="handwriting-lines rounded-2xl" />
            </div>
          </div>
        </div>
      );
    }

    // English Numbers
    if (type === ScreenType.EnglishNumbers) {
      const value = englishNumbersTab === 'ascending' ? index + 1 : 100 - index;
      const spelling = getEnglishNumberSpelling(value);
      return (
        <div className="flex flex-col gap-6 text-slate-800">
          <div className="flex items-center justify-between border-4 border-slate-900 rounded-[2rem] p-6 bg-slate-50">
            <div>
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Math Number Academy</span>
              <h2 className="text-5xl font-black text-slate-900 mt-1">{value}</h2>
              <p className="text-base text-slate-500 font-black mt-1 capitalize">Word Spelling: {spelling}</p>
            </div>
            <div className="flex flex-wrap gap-1 max-w-xs justify-end">
              {Array.from({ length: Math.min(value, 20) }).map((_, i) => (
                <span key={i} className="text-xl">⭐</span>
              ))}
              {value > 20 && <span className="text-xs font-black text-slate-400 self-end">...and more!</span>}
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-base font-black text-slate-900 uppercase tracking-wider mb-2">1. Number Tracing</h4>
            <p className="text-sm font-bold text-slate-500 mb-4">Trace the digit:</p>
            <div className="border-2 border-slate-300 rounded-2xl p-4 bg-slate-50/50">
              <span className="text-3xl font-black tracking-[2rem] text-slate-300 border-b border-dashed border-slate-200 pb-1.5 block w-full pl-2">
                {Array(6).fill(value).join(' ')}
              </span>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-base font-black text-slate-900 uppercase tracking-wider mb-2">2. Color or Draw Practice</h4>
            <p className="text-sm font-bold text-slate-500 mb-4">Color or draw {value} small shapes inside the box below:</p>
            <div className="border-4 border-dashed border-slate-300 rounded-[2rem] h-40 flex items-center justify-center text-slate-400 text-xs font-bold bg-slate-50/30">
              Draw {value} shapes!
            </div>
          </div>
        </div>
      );
    }

    // English Spellings
    if (type === ScreenType.EnglishSpellings) {
      const value = index + 1;
      const spelling = getEnglishNumberSpelling(value);
      return (
        <div className="flex flex-col gap-6 text-slate-800">
          <div className="flex items-center justify-between border-4 border-slate-900 rounded-[2rem] p-6 bg-slate-50">
            <div>
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Number Spelling Academy</span>
              <h2 className="text-4xl font-black text-slate-900 mt-1">{spelling.toUpperCase()}</h2>
              <p className="text-sm text-slate-500 font-bold mt-1">Number digit: {value}</p>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-base font-black text-slate-900 uppercase tracking-wider mb-2">1. Number Spelling Tracing</h4>
            <p className="text-sm font-bold text-slate-500 mb-4">Trace the spelling letters carefully:</p>
            <div className="border-2 border-slate-300 rounded-2xl p-4 bg-slate-50/50">
              <span className="text-2xl font-black tracking-widest text-slate-300 border-b-2 border-dashed border-slate-200 pb-2 block w-full pl-2">
                {spelling.toUpperCase().split('').join(' ')}
              </span>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-base font-black text-slate-900 uppercase tracking-wider mb-2">2. Spelling Practice</h4>
            <p className="text-sm font-bold text-slate-500 mb-3">Practice writing the spelling name on the lines below:</p>
            <div className="space-y-4">
              <div className="handwriting-lines rounded-2xl" />
              <div className="handwriting-lines rounded-2xl" />
            </div>
          </div>
        </div>
      );
    }

    // Gujarati Alphabet
    if (type === ScreenType.GujaratiAlphabet) {
      const item = alphabetTab === 'swar' ? GUJARATI_VOWELS[index] : GUJARATI_CONSONANTS[index];
      return (
        <div className="flex flex-col gap-6 text-slate-800">
          <div className="flex items-center justify-between border-4 border-slate-900 rounded-[2rem] p-6 bg-slate-50">
            <div>
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">ગુજરાતી બાળવાર્તા મૂળાક્ષર લેખન</span>
              <h2 className="text-6xl font-black text-slate-900 mt-1">{item.char}</h2>
              <p className="text-sm text-slate-500 font-bold mt-1">ઉચ્ચારણ: {item.phonetic}</p>
            </div>
            <div className="text-right flex flex-col items-end">
              <span className="text-6xl filter grayscale select-none">{item.emoji}</span>
              <span className="text-lg font-black text-slate-700 mt-1">{item.word}</span>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-base font-black text-slate-900 uppercase tracking-wider mb-2">૧. અક્ષર લેખન મરોળ (Trace the Letter)</h4>
            <p className="text-sm font-bold text-slate-500 mb-4">નીચે આપેલા અક્ષરને ટપકા જોડીને પૂર્ણ કરો:</p>
            <div className="border-2 border-slate-300 rounded-2xl p-4 bg-slate-50/50">
              <span className="text-4xl font-bold tracking-[2.5rem] text-slate-300 border-b-2 border-dashed border-slate-200 pb-2 block w-full pl-2">
                {Array(5).fill(item.char).join(' ')}
              </span>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-base font-black text-slate-900 uppercase tracking-wider mb-2">૨. જાતે લખવાનો મહાવરો (Independent Writing)</h4>
            <p className="text-sm font-bold text-slate-500 mb-3">ખાલી બોક્સમાં અક્ષર જાતે લખો:</p>
            <div className="grid grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="aspect-square border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center text-slate-300 text-xl font-bold bg-slate-50/10">
                  {item.char}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Gujarati Barakhadi
    if (type === ScreenType.GujaratiBarakhadi) {
      const consonantIdx = Math.floor(index / GUJARATI_BARAKHADI_MATRAS.length);
      const matraIdx = index % GUJARATI_BARAKHADI_MATRAS.length;
      const consonant = GUJARATI_CONSONANTS[consonantIdx];
      const matra = GUJARATI_BARAKHADI_MATRAS[matraIdx];
      const barakhadiLetter = `${consonant.char}${matra.sign}`;
      return (
        <div className="flex flex-col gap-6 text-slate-800">
          <div className="flex items-center justify-between border-4 border-slate-900 rounded-[2rem] p-6 bg-slate-50">
            <div>
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">બારાખડી મહાવરો</span>
              <h2 className="text-6xl font-black text-slate-900 mt-1">{barakhadiLetter}</h2>
              <p className="text-sm text-slate-500 font-bold mt-1">બનાવટ: {consonant.char} + સ્વર ચિહ્ન {matra.sign || 'અ'} = {barakhadiLetter}</p>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-base font-black text-slate-900 uppercase tracking-wider mb-2">૧. અક્ષર ઘૂંટવાનો મહાવરો (Trace the Letter)</h4>
            <p className="text-sm font-bold text-slate-500 mb-4">ટપકા જોડીને બારાખડી અક્ષર પૂર્ણ કરો:</p>
            <div className="border-2 border-slate-300 rounded-2xl p-4 bg-slate-50/50">
              <span className="text-4xl font-bold tracking-[2.5rem] text-slate-300 border-b-2 border-dashed border-slate-200 pb-2 block w-full pl-2">
                {Array(5).fill(barakhadiLetter).join(' ')}
              </span>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-base font-black text-slate-900 uppercase tracking-wider mb-2">૨. સ્વતંત્ર લેખન (Independent Writing)</h4>
            <p className="text-sm font-bold text-slate-500 mb-3">ખાલી ખાનાઓમાં અક્ષર જાતે લખો:</p>
            <div className="grid grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="aspect-square border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center text-slate-300 text-xl font-bold bg-slate-50/10">
                  {barakhadiLetter}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Gujarati Numbers
    if (type === ScreenType.GujaratiNumbers) {
      const realIdx = gujaratiNumbersTab === 'ascending' ? index : 99 - index;
      const item = GUJARATI_NUMBERS[realIdx];
      const englishVal = gujaratiNumbersTab === 'ascending' ? index + 1 : 100 - index;
      return (
        <div className="flex flex-col gap-6 text-slate-800">
          <div className="flex items-center justify-between border-4 border-slate-900 rounded-[2rem] p-6 bg-slate-50">
            <div>
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">ગુજરાતી અંક લેખન</span>
              <h2 className="text-6xl font-black text-slate-900 mt-1">{item.gujNumber}</h2>
              <p className="text-sm text-slate-500 font-bold mt-1">ગુજરાતી અંક નામ: {item.gujSpelling}</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-slate-400 block">English: {englishVal}</span>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-base font-black text-slate-900 uppercase tracking-wider mb-2">૧. અંક ઘૂંટવાનો મહાવરો (Trace the Digit)</h4>
            <p className="text-sm font-bold text-slate-500 mb-4">ગુજરાતી અંક ટ્રેસ કરો:</p>
            <div className="border-2 border-slate-300 rounded-2xl p-4 bg-slate-50/50">
              <span className="text-4xl font-bold tracking-[2.5rem] text-slate-300 border-b-2 border-dashed border-slate-200 pb-2 block w-full pl-2">
                {Array(5).fill(item.gujNumber).join(' ')}
              </span>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-base font-black text-slate-900 uppercase tracking-wider mb-2">૨. અંક જોડણી લેખન (Trace the Spelling)</h4>
            <p className="text-sm font-bold text-slate-500 mb-4">અંકનું ગુજરાતી નામ ગૂંથણી:</p>
            <div className="border-2 border-slate-300 rounded-2xl p-4 bg-slate-50/50">
              <span className="text-2xl font-bold tracking-widest text-slate-300 border-b-2 border-dashed border-slate-200 pb-2 block w-full pl-2">
                {item.gujSpelling.split('').join(' ')}
              </span>
            </div>
          </div>
        </div>
      );
    }

    // Gujarati Ghadiya / English Tables
    if (type === ScreenType.GujaratiGhadiya || type === ScreenType.EnglishTables) {
      const isGuj = type === ScreenType.GujaratiGhadiya;
      const rows = isGuj ? getGujaratiTable(index + 1) : getEnglishTable(index + 1);
      const heading = isGuj ? `${toGujaratiNumberString(index + 1)} નો ઘડિયો` : `Multiplication Table of ${index + 1}`;
      
      return (
        <div className="flex flex-col gap-6 text-slate-800">
          <div className="text-center bg-slate-50 border-4 border-slate-900 rounded-[2rem] p-5">
            <h2 className="text-3xl font-black text-slate-900">{heading}</h2>
            <p className="text-xs text-slate-500 uppercase font-black tracking-wider mt-1">Study study and fill in the blanks to test your skills!</p>
          </div>

          <div className="grid grid-cols-2 gap-8 mt-4">
            {/* Column 1: Standard Table for learning */}
            <div className="border-2 border-slate-300 rounded-[2rem] p-5 bg-slate-50/30">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 text-center border-b pb-2">Read & Memorize</h4>
              <div className="space-y-1.5 text-center">
                {rows.map((row) => (
                  <div key={row.mult} className="text-sm font-bold text-slate-700">
                    {isGuj ? (
                      <span>{row.gujNum} &times; {row.gujMult} = <strong className="text-slate-900">{row.gujResult}</strong></span>
                    ) : (
                      <span>{row.num} &times; {row.mult} = <strong className="text-slate-900">{row.result}</strong></span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Missing Table for test practice offline */}
            <div className="border-2 border-dashed border-slate-300 rounded-[2rem] p-5 bg-slate-50/50">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 text-center border-b pb-2">Practice & Fill-in</h4>
              <div className="space-y-2 text-center">
                {rows.map((row) => (
                  <div key={row.mult} className="text-sm font-bold text-slate-400 flex items-center justify-center gap-1.5">
                    {isGuj ? (
                      <>
                        <span>{row.gujNum}</span>
                        <span>&times;</span>
                        <span>{row.gujMult}</span>
                        <span>=</span>
                        <span className="w-12 h-5 border-b-2 border-dashed border-slate-400 inline-block" />
                      </>
                    ) : (
                      <>
                        <span>{row.num}</span>
                        <span>&times;</span>
                        <span>{row.mult}</span>
                        <span>=</span>
                        <span className="w-12 h-5 border-b-2 border-dashed border-slate-400 inline-block" />
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  // Slide transition variants
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.25, ease: 'easeOut' }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 }
    })
  };

  return (
    <div 
      className="fixed inset-0 flex flex-col justify-between overflow-y-auto p-3 sm:p-5 md:p-6 pb-6 sm:pb-8 transition-all duration-500 ease-in-out relative select-none"
      style={{ background: 'var(--bg-gradient, var(--high-bg))', color: 'var(--high-ink)' }}
    >
      {/* Playful Floating Background Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-20 dark:opacity-10">
        <div className="absolute top-10 left-10 text-4xl animate-bounce" style={{ animationDuration: '4s' }}>✨</div>
        <div className="absolute top-1/4 right-12 text-5xl animate-pulse" style={{ animationDuration: '3s' }}>⭐</div>
        <div className="absolute bottom-20 left-16 text-4xl animate-bounce" style={{ animationDuration: '5s' }}>🎈</div>
        <div className="absolute bottom-32 right-20 text-5xl animate-pulse" style={{ animationDuration: '4.5s' }}>✨</div>
        <div className="absolute top-1/3 left-1/2 text-3xl animate-bounce" style={{ animationDuration: '6s' }}>🌟</div>
      </div>
      
      {/* Top Category Hero Header */}
      <CategoryHeader 
        title={title}
        emoji={
          type === ScreenType.EnglishABC || type === ScreenType.EnglishABCLower ? '🔤' :
          type === ScreenType.EnglishWords ? '🔤' :
          type === ScreenType.EnglishNumbers ? '🔢' :
          type === ScreenType.EnglishSpellings ? '✏️' :
          type === ScreenType.GujaratiAlphabet ? '🪶' :
          type === ScreenType.GujaratiBarakhadi ? '📖' :
          type === ScreenType.GujaratiNumbers ? '🔢' :
          type === ScreenType.GujaratiGhadiya || type === ScreenType.EnglishTables ? '📊' : '🌟'
        }
        onBack={() => {
          playClickSound(settings.soundEnabled);
          onBackToHome();
        }}
        soundEnabled={settings.soundEnabled}
        onToggleSound={() => {
          const nextVal = !settings.soundEnabled;
          playClickSound(nextVal);
          onUpdateSettings({ ...settings, soundEnabled: nextVal });
        }}
        onOpenGrid={type === ScreenType.GujaratiBarakhadi ? () => setShowBarakhadiMenu(!showBarakhadiMenu) : () => setShowTopicMenu(!showTopicMenu)}
        gridTitle={type === ScreenType.GujaratiBarakhadi ? "Choose Character 🔍" : "Choose Lesson 🔍"}
        onPrint={() => {
          playClickSound(settings.soundEnabled);
          window.print();
        }}
      />

      {/* Friendly Mascot Companion */}
      <ChikuMascot 
        lang={type === ScreenType.EnglishABC || type === ScreenType.EnglishABCLower || type === ScreenType.EnglishWords || type === ScreenType.EnglishNumbers || type === ScreenType.EnglishSpellings || type === ScreenType.EnglishTables ? 'en' : 'gu'}
        soundEnabled={settings.soundEnabled}
        context="learning"
        moduleName={title}
        className="mb-2 z-10"
      />

      {/* Main Flashcard Container */}
      <main className="flex-1 w-full max-w-2xl mx-auto flex flex-col items-center justify-center my-2 sm:my-3 md:my-4 relative z-10">

        {/* Tab switcher for Gujarati Alphabet swar vs vyanjan */}
        {type === ScreenType.GujaratiAlphabet && (
          <div className="flex gap-2.5 mb-3 md:mb-4 z-10 bg-white/40 dark:bg-slate-800/80 backdrop-blur-md p-2 rounded-full border-4 border-high-ink shadow-[0_6px_0_#2D3436]">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                playClickSound(settings.soundEnabled);
                setAlphabetTab('vyanjan');
                setIndex(0);
              }}
              className={`px-5 py-2.5 rounded-full font-black text-sm sm:text-base transition-all border-3 ${
                alphabetTab === 'vyanjan'
                  ? 'bg-[#FFD93D] text-high-ink border-high-ink shadow-[0_3px_0_#2D3436]'
                  : 'bg-white/80 text-high-ink border-transparent hover:bg-white'
              }`}
            >
              ગુજરાતી કક્કો 🪶
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                playClickSound(settings.soundEnabled);
                setAlphabetTab('swar');
                setIndex(0);
              }}
              className={`px-5 py-2.5 rounded-full font-black text-sm sm:text-base transition-all border-3 ${
                alphabetTab === 'swar'
                  ? 'bg-[#FFD93D] text-high-ink border-high-ink shadow-[0_3px_0_#2D3436]'
                  : 'bg-white/80 text-high-ink border-transparent hover:bg-white'
              }`}
            >
              ગુજરાતી સ્વર ✨
            </motion.button>
          </div>
        )}

        {/* Tab switcher for English Alphabet uppercase vs lowercase */}
        {type === ScreenType.EnglishABC && (
          <div className="flex gap-2.5 mb-3 md:mb-4 z-10 bg-white/40 dark:bg-slate-800/80 backdrop-blur-md p-2 rounded-full border-4 border-high-ink shadow-[0_6px_0_#2D3436]">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                playClickSound(settings.soundEnabled);
                setEnglishTab('upper');
                setIndex(0);
              }}
              className={`px-5 py-2.5 rounded-full font-black text-sm sm:text-base transition-all border-3 ${
                englishTab === 'upper'
                  ? 'bg-[#FFD93D] text-high-ink border-high-ink shadow-[0_3px_0_#2D3436]'
                  : 'bg-white/80 text-high-ink border-transparent hover:bg-white'
              }`}
            >
              Uppercase (ABC)
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                playClickSound(settings.soundEnabled);
                setEnglishTab('lower');
                setIndex(0);
              }}
              className={`px-5 py-2.5 rounded-full font-black text-sm sm:text-base transition-all border-3 ${
                englishTab === 'lower'
                  ? 'bg-[#FFD93D] text-high-ink border-high-ink shadow-[0_3px_0_#2D3436]'
                  : 'bg-white/80 text-high-ink border-transparent hover:bg-white'
              }`}
            >
              Lowercase (abc)
            </motion.button>
          </div>
        )}

        {/* Tab switcher for English Numbers */}
        {type === ScreenType.EnglishNumbers && (
          <div className="flex gap-2 mb-3 md:mb-4 z-10 bg-white/40 dark:bg-slate-800/80 backdrop-blur-md p-2 rounded-full border-4 border-high-ink shadow-[0_6px_0_#2D3436] flex-wrap justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                playClickSound(settings.soundEnabled);
                setEnglishNumbersTab('1-100');
                setIndex(0);
              }}
              className={`px-4 py-2 rounded-full font-black text-sm sm:text-base transition-all border-3 ${
                englishNumbersTab === '1-100'
                  ? 'bg-[#FFD93D] text-high-ink border-high-ink shadow-[0_3px_0_#2D3436]'
                  : 'bg-white/80 text-high-ink border-transparent hover:bg-white'
              }`}
            >
              1–100
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                playClickSound(settings.soundEnabled);
                setEnglishNumbersTab('100-51');
                setIndex(0);
              }}
              className={`px-4 py-2 rounded-full font-black text-sm sm:text-base transition-all border-3 ${
                englishNumbersTab === '100-51'
                  ? 'bg-[#FFD93D] text-high-ink border-high-ink shadow-[0_3px_0_#2D3436]'
                  : 'bg-white/80 text-high-ink border-transparent hover:bg-white'
              }`}
            >
              100–51
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                playClickSound(settings.soundEnabled);
                setEnglishNumbersTab('50-1');
                setIndex(0);
              }}
              className={`px-4 py-2 rounded-full font-black text-sm sm:text-base transition-all border-3 ${
                englishNumbersTab === '50-1'
                  ? 'bg-[#FFD93D] text-high-ink border-high-ink shadow-[0_3px_0_#2D3436]'
                  : 'bg-white/80 text-high-ink border-transparent hover:bg-white'
              }`}
            >
              50–1
            </motion.button>
          </div>
        )}

        {/* Tab switcher for Gujarati Numbers ascending vs descending */}
        {type === ScreenType.GujaratiNumbers && (
          <div className="flex gap-2.5 mb-3 md:mb-4 z-10 bg-white/40 dark:bg-slate-800/80 backdrop-blur-md p-2 rounded-full border-4 border-high-ink shadow-[0_6px_0_#2D3436]">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                playClickSound(settings.soundEnabled);
                setGujaratiNumbersTab('ascending');
                setIndex(0);
              }}
              className={`px-5 py-2.5 rounded-full font-black text-sm sm:text-base transition-all border-3 ${
                gujaratiNumbersTab === 'ascending'
                  ? 'bg-[#FFD93D] text-high-ink border-high-ink shadow-[0_3px_0_#2D3436]'
                  : 'bg-white/80 text-high-ink border-transparent hover:bg-white'
              }`}
            >
              Ascending (૧ → ૧૦૦)
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                playClickSound(settings.soundEnabled);
                setGujaratiNumbersTab('descending');
                setIndex(0);
              }}
              className={`px-5 py-2.5 rounded-full font-black text-sm sm:text-base transition-all border-3 ${
                gujaratiNumbersTab === 'descending'
                  ? 'bg-[#FFD93D] text-high-ink border-high-ink shadow-[0_3px_0_#2D3436]'
                  : 'bg-white/80 text-high-ink border-transparent hover:bg-white'
              }`}
            >
              Descending (૧૦૦ → ૧)
            </motion.button>
          </div>
        )}

        {/* Swipeable Premium Card Area */}
        <div className="w-full flex-1 max-h-[480px] md:max-h-[520px] min-h-[380px] sm:min-h-[420px] md:min-h-[480px] relative overflow-hidden bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-[2.5rem] sm:rounded-[3rem] border-6 sm:border-8 border-high-ink shadow-[0_12px_0_#2D3436] flex flex-col justify-center">
          
          {/* Decorative Corner Sparkles inside card */}
          <div className="absolute top-4 right-5 text-2xl opacity-40 select-none pointer-events-none animate-pulse">✨</div>
          <div className="absolute bottom-4 left-5 text-2xl opacity-40 select-none pointer-events-none animate-pulse">⭐</div>

          {/* Card Body */}
          <div 
            className="flex-1 relative overflow-hidden cursor-pointer" 
            onClick={() => {
              playClickSound(settings.soundEnabled);
              handleSpeak();
            }}
          >
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={`${index}-${alphabetTab}-${englishTab}-${englishNumbersTab}-${gujaratiNumbersTab}`}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 w-full h-full flex flex-col justify-center"
              >
                {renderCardContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Navigation Buttons and Progress bar at the bottom */}
      <footer className="w-full max-w-2xl mx-auto flex flex-col gap-3.5 sm:gap-4 z-10 mt-6 sm:mt-8 pb-3 sm:pb-6">
        
        {/* Navigation Action Buttons - PREV • Page Counter • NEXT */}
        <div className="flex items-center justify-center gap-2.5 sm:gap-4 w-full">
          {/* Previous Button - Blue -> Cyan Gradient Pill */}
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.92, y: 2 }}
            onClick={handlePrev}
            className="flex-1 max-w-[150px] sm:max-w-[180px] h-14 sm:h-16 min-h-[56px] bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 text-white font-black px-3 sm:px-6 rounded-full border-4 border-high-ink shadow-[0_6px_0_#1E3A8A] hover:shadow-[0_8px_0_#1E3A8A] active:shadow-[0_2px_0_#1E3A8A] transition-all text-sm sm:text-lg flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer uppercase tracking-wider relative overflow-hidden group select-none"
          >
            {/* Top Gloss Highlight */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/25 rounded-t-full pointer-events-none" />
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3.5] text-white group-hover:-translate-x-1 transition-transform shrink-0 drop-shadow-sm" />
            <span className="drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,0.3)]">PREV</span>
          </motion.button>

          {/* Floating Page Counter Badge */}
          <motion.div 
            whileHover={{ scale: 1.04 }}
            className="bg-white/95 dark:bg-slate-800/95 text-high-ink dark:text-white px-3 sm:px-5 h-14 sm:h-16 min-h-[56px] rounded-full text-xs sm:text-base font-black tracking-wider border-4 border-high-ink shadow-[0_6px_0_#2D3436] shrink-0 min-w-[110px] sm:min-w-[150px] text-center flex items-center justify-center gap-1.5 sm:gap-2 backdrop-blur-md relative overflow-hidden select-none"
          >
            <span className="text-base sm:text-xl animate-pulse">📖</span>
            <span className="drop-shadow-sm whitespace-nowrap">
              {type === ScreenType.GujaratiNumbers || type === ScreenType.GujaratiAlphabet || type === ScreenType.GujaratiBarakhadi || type === ScreenType.GujaratiGhadiya
                ? `Page ${toGujaratiNumberString(index + 1)} of ${toGujaratiNumberString(itemsCount)}`
                : `Page ${index + 1} of ${itemsCount}`
              }
            </span>
          </motion.div>

          {/* Next Button - Orange -> Yellow Gradient Pill */}
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.92, y: 2 }}
            onClick={handleNext}
            className="flex-1 max-w-[150px] sm:max-w-[180px] h-14 sm:h-16 min-h-[56px] bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-400 text-white font-black px-3 sm:px-6 rounded-full border-4 border-high-ink shadow-[0_6px_0_#9A3412] hover:shadow-[0_8px_0_#9A3412] active:shadow-[0_2px_0_#9A3412] transition-all text-sm sm:text-lg flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer uppercase tracking-wider relative overflow-hidden group select-none"
          >
            {/* Top Gloss Highlight */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/25 rounded-t-full pointer-events-none" />
            <span className="drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,0.3)]">NEXT</span>
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3.5] text-white group-hover:translate-x-1 transition-transform shrink-0 drop-shadow-sm" />
          </motion.button>
        </div>

        {/* Pronunciation CTA Bar */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            playClickSound(settings.soundEnabled);
            handleSpeak();
          }}
          className="w-full bg-[#FFD93D] text-high-ink py-2.5 sm:py-3 text-center border-4 border-high-ink rounded-2xl text-xs md:text-sm font-black tracking-wide select-none flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_0_#2D3436] active:translate-y-[2px] active:shadow-[0_2px_0_#2D3436] transition-all uppercase"
        >
          <Volume2 className="w-5 h-5 text-high-ink stroke-[3] animate-pulse" />
          TAP CARD OR HERE TO HEAR PRONUNCIATION 🔊
        </motion.button>

        {/* Premium Animated Progress Bar */}
        <div className="w-full bg-black/15 dark:bg-white/10 h-5 rounded-full overflow-hidden p-1 border-2 border-high-ink relative">
          <div 
            className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 h-full rounded-full transition-all duration-300 border-r-2 border-high-ink shadow-sm"
            style={{ width: `${((index + 1) / itemsCount) * 100}%` }}
          />
        </div>
      </footer>

      {/* Custom Barakhadi Consonant Drawer Menu */}
      <AnimatePresence>
        {showBarakhadiMenu && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowBarakhadiMenu(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-white rounded-[2rem] p-6 w-full max-w-xl max-h-[80vh] overflow-y-auto shadow-2xl border-4 border-blue-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4 pb-2 border-b-2 border-slate-100">
                <h3 className="text-2xl font-black text-slate-800">Choose Consonant (અક્ષર)</h3>
                <button 
                  onClick={() => setShowBarakhadiMenu(false)}
                  className="bg-slate-100 hover:bg-slate-200 font-extrabold text-slate-500 rounded-full w-8 h-8 flex items-center justify-center text-lg"
                >
                  ✕
                </button>
              </div>
              
              <p className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">
                Tap a letter to see and learn its 12 Barakhadi variations:
              </p>

              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {GUJARATI_CONSONANTS.map((consonant, cIdx) => (
                  <button
                    key={consonant.char}
                    onClick={() => handleBarakhadiConsonantSelect(cIdx)}
                    className="aspect-square bg-blue-50 text-blue-700 hover:bg-blue-100 active:scale-95 transition-all rounded-2xl font-black text-2xl flex flex-col items-center justify-center border-2 border-blue-200/50 shadow-sm"
                  >
                    <span>{consonant.char}</span>
                    <span className="text-[10px] text-blue-400 font-medium font-mono uppercase">{consonant.phonetic}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* General Choose Lesson Drawer Menu */}
      <AnimatePresence>
        {showTopicMenu && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowTopicMenu(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 w-full max-w-xl max-h-[80vh] overflow-y-auto shadow-2xl border-4 border-high-ink"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4 pb-2 border-b-4 border-high-ink">
                <h3 className="text-2xl font-black text-high-ink dark:text-white uppercase tracking-wide">Choose Lesson</h3>
                <button 
                  onClick={() => setShowTopicMenu(false)}
                  className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 font-extrabold text-high-ink dark:text-white rounded-full w-10 h-10 flex items-center justify-center text-lg border-2 border-high-ink"
                >
                  ✕
                </button>
              </div>
              
              <p className="text-xs font-bold text-slate-400 dark:text-slate-300 mb-5 uppercase tracking-widest">
                Tap to jump directly to any card. Completed lessons have a checkmark!
              </p>

              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3.5 pb-4">
                {Array.from({ length: itemsCount }).map((_, idx) => {
                  let completed = false;
                  if (type === ScreenType.GujaratiAlphabet) {
                    const progressIdx = alphabetTab === 'vyanjan' ? idx + 13 : idx;
                    completed = progress.completedItems[type]?.includes(progressIdx) || false;
                  } else if (type === ScreenType.EnglishABC) {
                    const targetType = englishTab === 'upper' ? ScreenType.EnglishABC : ScreenType.EnglishABCLower;
                    completed = progress.completedItems[targetType]?.includes(idx) || false;
                  } else {
                    completed = progress.completedItems[type]?.includes(idx) || false;
                  }

                  const isCurrent = idx === index;

                  // Label helper
                  let label = `${idx + 1}`;
                  if (type === ScreenType.EnglishABC) {
                    label = englishTab === 'upper' ? ENGLISH_ABC[idx] || '' : ENGLISH_ABC[idx]?.toLowerCase() || '';
                  } else if (type === ScreenType.EnglishABCLower) {
                    label = ENGLISH_ABC[idx]?.toLowerCase() || '';
                  } else if (type === ScreenType.EnglishWords) {
                    const item = ENGLISH_WORDS[idx];
                    label = item ? `${item.letter} ${item.emoji}` : '';
                  } else if (type === ScreenType.GujaratiAlphabet) {
                    const item = alphabetTab === 'swar' ? GUJARATI_VOWELS[idx] : GUJARATI_CONSONANTS[idx];
                    label = item ? item.char : '';
                  } else if (type === ScreenType.GujaratiNumbers) {
                    const item = GUJARATI_NUMBERS[idx];
                    label = item ? item.gujNumber : '';
                  } else if (type === ScreenType.GujaratiGhadiya) {
                    label = toGujaratiNumberString(idx + 1);
                  } else if (type === ScreenType.EnglishTables) {
                    label = `${idx + 1}`;
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        playClickSound(settings.soundEnabled);
                        setIndex(idx);
                        setShowTopicMenu(false);
                      }}
                      className={`relative p-3 rounded-2xl border-4 border-high-ink font-black text-xl flex flex-col items-center justify-center transition-all aspect-square ${
                        isCurrent
                          ? 'bg-[#FFD93D] text-high-ink scale-105 shadow-[0_4px_0_#2D3436] translate-y-[-2px]'
                          : completed
                          ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 shadow-[0_4px_0_#2D3436] hover:translate-y-[-2px]'
                          : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-[0_4px_0_#2D3436] hover:translate-y-[-2px]'
                      }`}
                    >
                      <span className="text-xl">{label}</span>
                      {completed && (
                        <span className="absolute top-1 right-1 text-[10px] bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center font-black border border-white leading-none">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 
        This is the printer-friendly hidden block. 
        It is rendered only in print media.
      */}
      <div className="print-container">
        {/* Cute kid header */}
        <div className="border-b-4 border-slate-900 pb-4 mb-6 flex justify-between items-center text-slate-800">
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-wide">
              🌟 Little Explorer Academy 🌟
            </h1>
            <p className="text-sm font-bold text-slate-500 uppercase mt-1">
              Offline Practice Worksheet &bull; {title}
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-slate-400">Date: __________________</div>
            <div className="text-xs font-bold text-slate-400 mt-1">Name: __________________</div>
          </div>
        </div>

        {/* Content specific worksheets */}
        {renderPrintWorksheet()}

        {/* Footer info */}
        <div className="mt-12 pt-4 border-t-2 border-dashed border-slate-300 text-center text-slate-800">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
            You are doing amazing! Keep learning and growing! ⭐⭐⭐⭐⭐
          </p>
        </div>
      </div>
    </div>
  );
}
