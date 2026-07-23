import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, 
  RotateCcw, 
  Check, 
  Trophy, 
  Sparkles, 
  HelpCircle, 
  Gamepad2, 
  ChevronRight, 
  Languages, 
  Smile 
} from 'lucide-react';
import { ScreenType, AppSettings } from '../types';
import { 
  ENGLISH_WORDS, 
  GUJARATI_ALPHABET, 
  GUJARATI_CONSONANTS, 
  toGujaratiNumberString 
} from '../data';
import { 
  playClickSound, 
  playSuccessSound, 
  playErrorSound, 
  speakText 
} from '../utils/audio';
import confetti from 'canvas-confetti';

interface WordMatchingGameProps {
  settings: AppSettings;
  onBackToHome: () => void;
  onCompleteRound: (roundIndex: number) => void;
  activeTab?: 'english' | 'gujarati';
}

type GameMode = 'menu' | 'word_match' | 'letter_picture' | 'counting' | 'guj_letter';

interface MatchingItem {
  id: string;
  word: string;
  emoji: string;
  speakText: string;
}

interface CardItem {
  id: string;
  value: string; // Emoji or Word
  type: 'emoji' | 'word';
  originalItem: MatchingItem;
}

export default function WordMatchingGame({ 
  settings, 
  onBackToHome, 
  onCompleteRound,
  activeTab = 'english'
}: WordMatchingGameProps) {
  // Current active game mode inside the Arcade
  const [activeGame, setActiveGame] = useState<GameMode>('menu');

  // Shared stats
  const [arcadeScore, setArcadeScore] = useState(0);

  const initialLang = activeTab === 'gujarati' ? 'gu' : 'en';

  // ==========================================
  // GAME 1: WORD MATCHING STATE & LOGIC
  // ==========================================
  const [matchLang, setMatchLang] = useState<'en' | 'gu'>(initialLang);
  const [matchRound, setMatchRound] = useState(1);
  const [matchItems, setMatchItems] = useState<MatchingItem[]>([]);
  const [emojiCards, setEmojiCards] = useState<CardItem[]>([]);
  const [wordCards, setWordCards] = useState<CardItem[]>([]);
  const [selectedEmojiId, setSelectedEmojiId] = useState<string | null>(null);
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [wrongMatchId, setWrongMatchId] = useState<string | null>(null);
  const [wrongWordId, setWrongWordId] = useState<string | null>(null);
  const [showMatchCelebration, setShowMatchCelebration] = useState(false);

  // Helper to shuffle array
  const shuffle = <T,>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const generateWordMatchRound = (selectedLang: 'en' | 'gu') => {
    setSelectedEmojiId(null);
    setSelectedWordId(null);
    setMatchedIds([]);
    setWrongMatchId(null);
    setWrongWordId(null);
    setShowMatchCelebration(false);

    let selectedItems: MatchingItem[] = [];

    if (selectedLang === 'en') {
      const shuffledSource = shuffle(ENGLISH_WORDS);
      selectedItems = shuffledSource.slice(0, 4).map((item, idx) => ({
        id: `en-${item.letter}-${idx}-${Date.now()}`,
        word: item.word,
        emoji: item.emoji,
        speakText: `${item.letter} is for ${item.word}`,
      }));
    } else {
      const shuffledSource = shuffle(GUJARATI_ALPHABET);
      selectedItems = shuffledSource.slice(0, 4).map((item, idx) => ({
        id: `gu-${item.char}-${idx}-${Date.now()}`,
        word: item.word,
        emoji: item.emoji,
        speakText: `${item.char} એટલે ${item.word}`,
      }));
    }

    setMatchItems(selectedItems);

    const eCards: CardItem[] = selectedItems.map(item => ({
      id: item.id,
      value: item.emoji,
      type: 'emoji',
      originalItem: item
    }));

    const wCards: CardItem[] = selectedItems.map(item => ({
      id: item.id,
      value: item.word,
      type: 'word',
      originalItem: item
    }));

    setEmojiCards(shuffle(eCards));
    setWordCards(shuffle(wCards));
  };

  // ==========================================
  // GAME 2: LETTER TO PICTURE (ENGLISH) STATE & LOGIC
  // ==========================================
  const [lpRound, setLpRound] = useState(1);
  const [lpLetterItem, setLpLetterItem] = useState<typeof ENGLISH_WORDS[0] | null>(null);
  const [lpOptions, setLpOptions] = useState<typeof ENGLISH_WORDS>([]);
  const [lpWrongSelected, setLpWrongSelected] = useState<string[]>([]);
  const [lpCorrectSelected, setLpCorrectSelected] = useState(false);

  const generateLpRound = () => {
    setLpWrongSelected([]);
    setLpCorrectSelected(false);

    // Pick 1 correct letter item
    const source = shuffle(ENGLISH_WORDS);
    const correct = source[0];
    setLpLetterItem(correct);

    // Pick 3 distractor items
    const distractors = source.slice(1, 4);
    const combined = shuffle([correct, ...distractors]);
    setLpOptions(combined);
  };

  const handleLpOptionClick = (item: typeof ENGLISH_WORDS[0]) => {
    if (lpCorrectSelected || lpWrongSelected.includes(item.letter)) return;

    if (item.letter === lpLetterItem?.letter) {
      // Correct!
      setLpCorrectSelected(true);
      playSuccessSound(settings.soundEnabled);
      setArcadeScore(prev => prev + 1);
      
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });

      const phrase = `${item.letter} for ${item.word}! You are brilliant!`;
      speakText(phrase, 'en', settings.englishVoiceURI, settings.soundEnabled);

      // Trigger user profile completion points
      onCompleteRound(lpRound);
    } else {
      // Incorrect!
      playErrorSound(settings.soundEnabled);
      setLpWrongSelected(prev => [...prev, item.letter]);
      const hint = `Try again! Find the picture for the letter ${lpLetterItem?.letter}!`;
      speakText(hint, 'en', settings.englishVoiceURI, settings.soundEnabled);
    }
  };

  const speakLpInstruction = () => {
    if (!lpLetterItem) return;
    const text = `Which picture starts with the letter ${lpLetterItem.letter}?`;
    speakText(text, 'en', settings.englishVoiceURI, settings.soundEnabled);
  };

  // ==========================================
  // GAME 3: COUNT THE OBJECTS STATE & LOGIC
  // ==========================================
  const [countRound, setCountRound] = useState(1);
  const [countLang, setCountLang] = useState<'en' | 'gu'>(initialLang);
  const [countTarget, setCountTarget] = useState(3);
  const [countEmoji, setCountEmoji] = useState('🎈');
  const [countOptions, setCountOptions] = useState<number[]>([]);
  const [countWrongSelected, setCountWrongSelected] = useState<number[]>([]);
  const [countCorrectSelected, setCountCorrectSelected] = useState(false);
  const [objectsTapped, setObjectsTapped] = useState<number[]>([]); // track tapped object indices

  const cuteEmojis = ['🎈', '⭐', '🍎', '🚗', '🍬', '🦖', '🧸', '🦆', '🍰', '🦋', '⚽', '🍦'];

  const generateCountRound = () => {
    setCountWrongSelected([]);
    setCountCorrectSelected(false);
    setObjectsTapped([]);

    // Target count between 1 and 9
    const target = Math.floor(Math.random() * 9) + 1;
    setCountTarget(target);

    // Cute emoji selection
    const rEmoji = cuteEmojis[Math.floor(Math.random() * cuteEmojis.length)];
    setCountEmoji(rEmoji);

    // Create 4 distinct option numbers
    const optionsSet = new Set<number>([target]);
    while (optionsSet.size < 4) {
      const distractor = Math.floor(Math.random() * 10) + 1;
      optionsSet.add(distractor);
    }
    setCountOptions(shuffle(Array.from(optionsSet)));
  };

  const handleCountOptionClick = (num: number) => {
    if (countCorrectSelected || countWrongSelected.includes(num)) return;

    if (num === countTarget) {
      setCountCorrectSelected(true);
      playSuccessSound(settings.soundEnabled);
      setArcadeScore(prev => prev + 1);

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });

      if (countLang === 'en') {
        const phrase = `Excellent! There are ${countTarget} ${countTarget === 1 ? 'object' : 'objects'}!`;
        speakText(phrase, 'en', settings.englishVoiceURI, settings.soundEnabled);
      } else {
        const phrase = `ખૂબ સરસ! આ ${toGujaratiNumberString(countTarget)} વસ્તુઓ છે!`;
        speakText(phrase, 'gu', settings.gujaratiVoiceURI, settings.soundEnabled);
      }

      onCompleteRound(countRound);
    } else {
      playErrorSound(settings.soundEnabled);
      setCountWrongSelected(prev => [...prev, num]);

      if (countLang === 'en') {
        const hint = `Not quite! Let's count them together and select the correct number.`;
        speakText(hint, 'en', settings.englishVoiceURI, settings.soundEnabled);
      } else {
        const hint = `ના, ચાલો બધી વસ્તુઓ એક પછી એક ગણીએ અને સાચો નંબર શોધીએ!`;
        speakText(hint, 'gu', settings.gujaratiVoiceURI, settings.soundEnabled);
      }
    }
  };

  const handleObjectTap = (index: number) => {
    if (countCorrectSelected) return;
    playClickSound(settings.soundEnabled);
    if (!objectsTapped.includes(index)) {
      setObjectsTapped(prev => [...prev, index]);
      // Speak the count number tapped so far
      const countLabel = objectsTapped.length + 1;
      if (countLang === 'en') {
        speakText(String(countLabel), 'en', settings.englishVoiceURI, settings.soundEnabled);
      } else {
        speakText(toGujaratiNumberString(countLabel), 'gu', settings.gujaratiVoiceURI, settings.soundEnabled);
      }
    }
  };

  const speakCountInstruction = () => {
    if (countLang === 'en') {
      const text = `Let's count the items! Touch each item to count, then click the correct number below.`;
      speakText(text, 'en', settings.englishVoiceURI, settings.soundEnabled);
    } else {
      const text = `ચાલો વસ્તુઓ ગણીએ! ગણવા માટે દરેક ચિત્રને અડકો, પછી સાચો નંબર દબાવો.`;
      speakText(text, 'gu', settings.gujaratiVoiceURI, settings.soundEnabled);
    }
  };


  // ==========================================
  // GAME 4: IDENTIFY GUJARATI LETTER STATE & LOGIC
  // ==========================================
  const [gujRound, setGujRound] = useState(1);
  const [gujTarget, setGujTarget] = useState<typeof GUJARATI_CONSONANTS[0] | null>(null);
  const [gujOptions, setGujOptions] = useState<typeof GUJARATI_CONSONANTS>([]);
  const [gujWrongSelected, setGujWrongSelected] = useState<string[]>([]);
  const [gujCorrectSelected, setGujCorrectSelected] = useState(false);

  const generateGujRound = () => {
    setGujWrongSelected([]);
    setGujCorrectSelected(false);

    // Pick 1 correct Gujarati consonant
    const source = shuffle(GUJARATI_CONSONANTS);
    const correct = source[0];
    setGujTarget(correct);

    // Pick 3 distractor consonants
    const distractors = source.slice(1, 4);
    const combined = shuffle([correct, ...distractors]);
    setGujOptions(combined);
  };

  const handleGujOptionClick = (item: typeof GUJARATI_CONSONANTS[0]) => {
    if (gujCorrectSelected || gujWrongSelected.includes(item.char)) return;

    if (item.char === gujTarget?.char) {
      setGujCorrectSelected(true);
      playSuccessSound(settings.soundEnabled);
      setArcadeScore(prev => prev + 1);

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });

      // Perfect custom phonetic consonant speak phrase! E.g. "ક કમળ નો ક"
      const phrase = `${item.char} ${item.word} નો ${item.char}! ખૂબ જ સુંદર પ્રદર્શન!`;
      speakText(phrase, 'gu', settings.gujaratiVoiceURI, settings.soundEnabled);

      onCompleteRound(gujRound);
    } else {
      playErrorSound(settings.soundEnabled);
      setGujWrongSelected(prev => [...prev, item.char]);

      const hint = `ખોટું છે! ચિત્ર છે ${gujTarget?.word}. આ ચિત્રનો સાચો પહેલો અક્ષર કયો છે?`;
      speakText(hint, 'gu', settings.gujaratiVoiceURI, settings.soundEnabled);
    }
  };

  const speakGujInstruction = () => {
    if (!gujTarget) return;
    const text = `આ ચિત્ર જુઓ. ચિત્ર છે ${gujTarget.word}. તે કયા અક્ષરથી શરૂ થાય છે તે ઓળખો!`;
    speakText(text, 'gu', settings.gujaratiVoiceURI, settings.soundEnabled);
  };


  // ==========================================
  // GENERAL CONTROLLER EFFECTS
  // ==========================================
  useEffect(() => {
    const lang = activeTab === 'gujarati' ? 'gu' : 'en';
    setMatchLang(lang);
    setCountLang(lang);
  }, [activeTab]);

  useEffect(() => {
    if (activeGame === 'word_match') {
      generateWordMatchRound(matchLang);
    } else if (activeGame === 'letter_picture') {
      generateLpRound();
    } else if (activeGame === 'counting') {
      generateCountRound();
    } else if (activeGame === 'guj_letter') {
      generateGujRound();
    }
  }, [activeGame]);

  // Handle voice instructions trigger on mode load
  useEffect(() => {
    const t = setTimeout(() => {
      if (activeGame === 'word_match') {
        const text = matchLang === 'en' 
          ? "Match the picture with the correct word!" 
          : "ચિત્રને સાચા શબ્દ સાથે જોડો!";
        speakText(text, matchLang, undefined, settings.soundEnabled);
      } else if (activeGame === 'letter_picture') {
        speakLpInstruction();
      } else if (activeGame === 'counting') {
        speakCountInstruction();
      } else if (activeGame === 'guj_letter') {
        speakGujInstruction();
      }
    }, 800);
    return () => clearTimeout(t);
  }, [activeGame, matchRound, matchLang, lpRound, countRound, countLang, gujRound]);


  // ==========================================
  // WORD MATCH GAME PLAY LAUNCHERS & HANDLERS
  // ==========================================
  const handleWordMatchProcess = (emojiId: string, wordId: string) => {
    if (emojiId === wordId) {
      const matchedItem = matchItems.find(item => item.id === emojiId);
      if (matchedItem) {
        setMatchedIds(prev => [...prev, emojiId]);
        playSuccessSound(settings.soundEnabled);
        speakText(matchedItem.speakText, matchLang, undefined, settings.soundEnabled);

        setSelectedEmojiId(null);
        setSelectedWordId(null);

        if (matchedIds.length + 1 === matchItems.length) {
          setArcadeScore(prev => prev + 1);
          setShowMatchCelebration(true);
          onCompleteRound(matchRound);

          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });

          setTimeout(() => {
            const congrats = matchLang === 'en'
              ? "Wow! You matched them all! Brilliant job!"
              : "ખૂબ સરસ! તમે બધા જોડકાં સાચા જોડ્યા!";
            speakText(congrats, matchLang, undefined, settings.soundEnabled);
          }, 1000);
        }
      }
    } else {
      playErrorSound(settings.soundEnabled);
      setWrongMatchId(emojiId);
      setWrongWordId(wordId);
      
      setTimeout(() => {
        setWrongMatchId(null);
        setWrongWordId(null);
        setSelectedEmojiId(null);
        setSelectedWordId(null);
      }, 800);
    }
  };

  const handleWordMatchEmojiTap = (card: CardItem) => {
    if (matchedIds.includes(card.id)) return;
    playClickSound(settings.soundEnabled);

    if (selectedEmojiId === card.id) {
      setSelectedEmojiId(null);
    } else {
      setSelectedEmojiId(card.id);
      speakText(card.originalItem.word, matchLang, undefined, settings.soundEnabled);
      if (selectedWordId) {
        handleWordMatchProcess(card.id, selectedWordId);
      }
    }
  };

  const handleWordMatchWordTap = (card: CardItem) => {
    if (matchedIds.includes(card.id)) return;
    playClickSound(settings.soundEnabled);

    if (selectedWordId === card.id) {
      setSelectedWordId(null);
    } else {
      setSelectedWordId(card.id);
      speakText(card.value, matchLang, undefined, settings.soundEnabled);
      if (selectedEmojiId) {
        handleWordMatchProcess(selectedEmojiId, card.id);
      }
    }
  };

  const handleWordMatchDragStart = (e: React.DragEvent, card: CardItem) => {
    if (matchedIds.includes(card.id)) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData('text/plain', card.id);
    playClickSound(settings.soundEnabled);
  };


  // ==========================================
  // RENDER INTERFACES
  // ==========================================

  if (activeGame === 'menu') {
    return (
      <div className="min-h-screen w-full transition-all duration-500 ease-in-out" style={{ background: 'var(--bg-gradient, var(--high-bg))', color: 'var(--high-ink)' }}>
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 flex flex-col min-h-screen relative select-none">
          {/* Header */}
          <div className="flex items-center justify-between gap-4 mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-high-ink dark:text-white uppercase tracking-wide flex items-center gap-2 justify-center drop-shadow-sm flex-1">
              <span>🎮 KIDS ARCADE</span>
              <span className="text-2xl animate-bounce">✨</span>
            </h1>

            <div className="bg-white dark:bg-slate-800 border-4 border-high-ink px-4 py-2 rounded-2xl shadow-[0_4px_0_#2D3436] flex items-center gap-2 shrink-0">
              <Trophy className="w-5 h-5 text-amber-500 fill-amber-500 stroke-[2.5]" />
              <span className="font-black text-slate-700 dark:text-slate-200">{arcadeScore} ⭐</span>
            </div>
          </div>

          <div className="text-center mb-8 max-w-lg mx-auto">
            <p className="text-slate-500 dark:text-slate-400 font-extrabold text-sm md:text-base uppercase tracking-wider">
              {activeTab === 'gujarati' 
                ? 'પ્રેક્ટિસ કરવા, આનંદ માણવા અને ચમકતા સ્ટાર્સ મેળવવા માટે નીચેની રમત પસંદ કરો!'
                : 'Choose an interactive game below to practice, have fun, and earn shiny stars!'}
            </p>
          </div>

          {/* Bento Grid of Kids Games */}
          <div className="grid grid-cols-2 gap-2 sm:gap-4 md:gap-5 w-full max-w-4xl mx-auto mt-2">
            
            {/* Game 1: Word Match */}
            <motion.button
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                playClickSound(settings.soundEnabled);
                setActiveGame('word_match');
              }}
              className="bg-gradient-to-br from-pink-400 to-rose-400 font-extrabold rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 md:p-5 border-3 sm:border-4 border-high-ink shadow-[0_4px_0_#2D3436] sm:shadow-[0_6px_0_#2D3436] hover:translate-y-[-2px] hover:shadow-[0_4px_0_#2D3436] sm:hover:shadow-[0_8px_0_#2D3436] active:translate-y-[2px] active:shadow-[0_1px_0_#2D3436] sm:active:shadow-[0_2px_0_#2D3436] transition-all text-left flex flex-col justify-between h-28 sm:h-38 md:h-48 group relative overflow-hidden text-white"
            >
              <div className="flex justify-between items-start w-full relative z-10">
                <span className="text-lg sm:text-2xl md:text-3xl bg-white/20 backdrop-blur-sm w-7 h-7 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform font-black">
                  🧩
                </span>
                <span className="bg-white/30 text-[7px] sm:text-[10px] md:text-xs font-black uppercase py-0.5 px-1.5 sm:py-1 sm:px-2.5 md:px-3 rounded-full border border-white/10">
                  {activeTab === 'gujarati' ? 'જોડકાં જોડો' : 'Matching'}
                </span>
              </div>
              <div className="relative z-10 w-full text-left">
                <h3 className="text-[10px] sm:text-base md:text-xl lg:text-2xl tracking-wide font-black leading-tight filter drop-shadow-sm truncate">
                  {activeTab === 'gujarati' ? 'શબ્દ મિલાન' : 'Word Match'}
                </h3>
                <p className="text-[8px] sm:text-xs font-semibold opacity-90 mt-0.5 sm:mt-1.5 tracking-wider line-clamp-2 sm:line-clamp-none">
                  {activeTab === 'gujarati' 
                    ? 'ચિત્રોને સાચા ગુજરાતી શબ્દો સાથે જોડો!' 
                    : 'Connect colorful picture emojis with correct English words!'}
                </p>
              </div>
              <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full group-hover:scale-150 transition-all duration-300 pointer-events-none" />
            </motion.button>

            {/* Game 2: Letter to Picture (English only) */}
            {activeTab !== 'gujarati' && (
              <motion.button
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  playClickSound(settings.soundEnabled);
                  setActiveGame('letter_picture');
                }}
                className="bg-gradient-to-br from-indigo-400 to-purple-500 font-extrabold rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 md:p-5 border-3 sm:border-4 border-high-ink shadow-[0_4px_0_#2D3436] sm:shadow-[0_6px_0_#2D3436] hover:translate-y-[-2px] hover:shadow-[0_4px_0_#2D3436] sm:hover:shadow-[0_8px_0_#2D3436] active:translate-y-[2px] active:shadow-[0_1px_0_#2D3436] sm:active:shadow-[0_2px_0_#2D3436] transition-all text-left flex flex-col justify-between h-28 sm:h-38 md:h-48 group relative overflow-hidden text-white"
              >
                <div className="flex justify-between items-start w-full relative z-10">
                  <span className="text-lg sm:text-2xl md:text-3xl bg-white/20 backdrop-blur-sm w-7 h-7 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform font-black">
                    🅰️
                  </span>
                  <span className="bg-white/30 text-[7px] sm:text-[10px] md:text-xs font-black uppercase py-0.5 px-1.5 sm:py-1 sm:px-2.5 md:px-3 rounded-full border border-white/10">
                    Words
                  </span>
                </div>
                <div className="relative z-10 w-full text-left">
                  <h3 className="text-[10px] sm:text-base md:text-xl lg:text-2xl tracking-wide font-black leading-tight filter drop-shadow-sm truncate">Letter to Picture</h3>
                  <p className="text-[8px] sm:text-xs font-semibold opacity-90 mt-0.5 sm:mt-1.5 tracking-wider line-clamp-2 sm:line-clamp-none">
                    Look at the alphabet letter and find the correct object that starts with it!
                  </p>
                </div>
                <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full group-hover:scale-150 transition-all duration-300 pointer-events-none" />
              </motion.button>
            )}

            {/* Game 3: Count the Objects */}
            <motion.button
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                playClickSound(settings.soundEnabled);
                setActiveGame('counting');
              }}
              className="bg-gradient-to-br from-emerald-400 to-teal-500 font-extrabold rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 md:p-5 border-3 sm:border-4 border-high-ink shadow-[0_4px_0_#2D3436] sm:shadow-[0_6px_0_#2D3436] hover:translate-y-[-2px] hover:shadow-[0_4px_0_#2D3436] sm:hover:shadow-[0_8px_0_#2D3436] active:translate-y-[2px] active:shadow-[0_1px_0_#2D3436] sm:active:shadow-[0_2px_0_#2D3436] transition-all text-left flex flex-col justify-between h-28 sm:h-38 md:h-48 group relative overflow-hidden text-white"
            >
              <div className="flex justify-between items-start w-full relative z-10">
                <span className="text-lg sm:text-2xl md:text-3xl bg-white/20 backdrop-blur-sm w-7 h-7 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform font-black">
                  🎈
                </span>
                <span className="bg-white/30 text-[7px] sm:text-[10px] md:text-xs font-black uppercase py-0.5 px-1.5 sm:py-1 sm:px-2.5 md:px-3 rounded-full border border-white/10">
                  {activeTab === 'gujarati' ? 'ગણતરી' : 'Math'}
                </span>
              </div>
              <div className="relative z-10 w-full text-left">
                <h3 className="text-[10px] sm:text-base md:text-xl lg:text-2xl tracking-wide font-black leading-tight filter drop-shadow-sm truncate">
                  {activeTab === 'gujarati' ? 'વસ્તુઓની ગણતરી' : 'Count the Objects'}
                </h3>
                <p className="text-[8px] sm:text-xs font-semibold opacity-90 mt-0.5 sm:mt-1.5 tracking-wider line-clamp-2 sm:line-clamp-none">
                  {activeTab === 'gujarati'
                    ? 'રમકડાં, ફળો અથવા પ્રાણીઓ ગણો અને સાચો નંબર દબાવો!'
                    : 'Count colorful toys, fruits, or animals and click the matching number card!'}
                </p>
              </div>
              <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full group-hover:scale-150 transition-all duration-300 pointer-events-none" />
            </motion.button>

            {/* Game 4: Identify Gujarati Letter (Gujarati only) */}
            {activeTab === 'gujarati' && (
              <motion.button
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  playClickSound(settings.soundEnabled);
                  setActiveGame('guj_letter');
                }}
                className="bg-gradient-to-br from-amber-400 to-orange-500 font-extrabold rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 md:p-5 border-3 sm:border-4 border-high-ink shadow-[0_4px_0_#2D3436] sm:shadow-[0_6px_0_#2D3436] hover:translate-y-[-2px] hover:shadow-[0_4px_0_#2D3436] sm:hover:shadow-[0_8px_0_#2D3436] active:translate-y-[2px] active:shadow-[0_1px_0_#2D3436] sm:active:shadow-[0_2px_0_#2D3436] transition-all text-left flex flex-col justify-between h-28 sm:h-38 md:h-48 group relative overflow-hidden text-white"
              >
                <div className="flex justify-between items-start w-full relative z-10">
                  <span className="text-lg sm:text-2xl md:text-3xl bg-white/20 backdrop-blur-sm w-7 h-7 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform font-black">
                    🕉️
                  </span>
                  <span className="bg-white/30 text-[7px] sm:text-[10px] md:text-xs font-black uppercase py-0.5 px-1.5 sm:py-1 sm:px-2.5 md:px-3 rounded-full border border-white/10">
                    ગુજરાતી
                  </span>
                </div>
                <div className="relative z-10 w-full text-left">
                  <h3 className="text-[10px] sm:text-base md:text-xl lg:text-2xl tracking-wide font-black leading-tight filter drop-shadow-sm truncate">ગુજરાતી મૂળાક્ષર</h3>
                  <p className="text-[8px] sm:text-xs font-semibold opacity-90 mt-0.5 sm:mt-1.5 tracking-wider line-clamp-2 sm:line-clamp-none">
                    ચિત્ર જુઓ અને તેનો સાચો ગુજરાતી અક્ષર ઓળખો!
                  </p>
                </div>
                <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full group-hover:scale-150 transition-all duration-300 pointer-events-none" />
              </motion.button>
            )}

          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // GAME SUB-VIEW 1: PICTURE-WORD MATCHING
  // ----------------------------------------------------
  if (activeGame === 'word_match') {
    return (
      <div className="min-h-screen w-full transition-all duration-500 ease-in-out" style={{ background: 'var(--bg-gradient, var(--high-bg))', color: 'var(--high-ink)' }}>
        <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 flex flex-col min-h-screen relative select-none">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl md:text-3xl font-black text-high-ink dark:text-white uppercase tracking-wide">
              🧩 WORD MATCH
            </h2>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  const text = matchLang === 'en' 
                    ? "Match the picture with the correct word!" 
                    : "ચિત્રને સાચા શબ્દ સાથે જોડો!";
                  speakText(text, matchLang, undefined, settings.soundEnabled);
                }}
                className="bg-[#FFD93D] text-high-ink p-3 rounded-2xl border-4 border-high-ink shadow-[0_4px_0_#2D3436] hover:translate-y-[-2px] hover:shadow-[0_6px_0_#2D3436]"
                title="Hear Instructions"
              >
                <Volume2 className="w-5 h-5 stroke-[3]" />
              </button>
              <button
                onClick={() => {
                  playClickSound(settings.soundEnabled);
                  setMatchRound(1);
                  generateWordMatchRound(matchLang);
                }}
                className="bg-[#4D96FF] text-white p-3 rounded-2xl border-4 border-high-ink shadow-[0_4px_0_#2D3436] hover:translate-y-[-2px]"
                title="Restart"
              >
                <RotateCcw className="w-5 h-5 stroke-[3]" />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-6 flex justify-center">
            <div className="bg-white dark:bg-slate-800 px-6 py-3 border-4 border-high-ink rounded-[2rem] shadow-[0_4px_0_#2D3436] flex items-center justify-between max-w-md w-full gap-4">
              <span className="font-black text-xs tracking-wider text-slate-400">
                {matchLang === 'en' ? `ROUND ${matchRound}` : `રાઉન્ડ ${toGujaratiNumberString(matchRound)}`}
              </span>
              <span className="bg-[#6BCB77] text-white text-xs font-black px-4 py-1 border-2 border-high-ink rounded-full">
                {matchLang === 'en' ? `ARCADE STARS: ${arcadeScore} ⭐` : `સ્ટાર્સ: ${toGujaratiNumberString(arcadeScore)} ⭐`}
              </span>
            </div>
          </div>

          {/* Game Area */}
          <div className="flex-1 bg-sky-100/50 dark:bg-slate-800/50 rounded-[2.5rem] border-4 border-dashed border-sky-300 dark:border-slate-700 p-6 flex flex-col justify-center relative">
            
            <div className="text-center mb-6">
              <p className="text-sm font-black text-slate-600 dark:text-slate-300 flex items-center justify-center gap-1.5">
                <HelpCircle className="w-5 h-5 text-[#4D96FF]" />
                <span>
                  {matchLang === 'en' 
                    ? 'Tap the picture card, then tap its matching word card!' 
                    : 'ચિત્ર દબાવીને પછી તેના સાચા ગુજરાતી શબ્દ પર દબાવો!'}
                </span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-4 max-w-2xl mx-auto w-full relative">
              
              {/* EMOJIS */}
              <div className="flex flex-col gap-4">
                <h3 className="text-xs font-black text-center text-slate-400 uppercase tracking-widest mb-1">
                  {matchLang === 'en' ? '🍎 PICTURES' : '🍎 ચિત્રો'}
                </h3>
                {emojiCards.map(card => {
                  const isMatched = matchedIds.includes(card.id);
                  const isSelected = selectedEmojiId === card.id;
                  const isWiggling = wrongMatchId === card.id;

                  return (
                    <motion.button
                      key={`emoji-${card.id}`}
                      onClick={() => handleWordMatchEmojiTap(card)}
                      animate={{
                        x: isWiggling ? [-10, 10, -10, 10, 0] : 0,
                        scale: isSelected ? 1.05 : 1,
                      }}
                      transition={{ type: 'spring', damping: 10 }}
                      className={`aspect-video md:aspect-[4/3] rounded-3xl border-4 flex flex-col items-center justify-center relative transition-all duration-300 ${
                        isMatched
                          ? 'bg-emerald-100 dark:bg-emerald-950/40 border-emerald-500 opacity-60'
                          : isSelected
                            ? 'bg-amber-100 dark:bg-amber-950/40 border-amber-500 ring-4 ring-amber-300/50'
                            : isWiggling
                              ? 'bg-red-100 border-red-500'
                              : 'bg-white dark:bg-slate-700 border-high-ink hover:translate-y-[-2px] shadow-[0_4px_0_#2D3436]'
                      }`}
                    >
                      <span className="text-4xl select-none">{card.value}</span>
                      {isMatched && (
                        <span className="absolute bottom-2 bg-emerald-500 text-white rounded-full p-0.5 border-2 border-white">
                          <Check className="w-3.5 h-3.5 stroke-[4]" />
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* WORDS */}
              <div className="flex flex-col gap-4">
                <h3 className="text-xs font-black text-center text-slate-400 uppercase tracking-widest mb-1">
                  {matchLang === 'en' ? '✏️ WORDS' : '✏️ શબ્દો'}
                </h3>
                {wordCards.map(card => {
                  const isMatched = matchedIds.includes(card.id);
                  const isSelected = selectedWordId === card.id;
                  const isWiggling = wrongWordId === card.id;

                  return (
                    <motion.button
                      key={`word-${card.id}`}
                      onClick={() => handleWordMatchWordTap(card)}
                      animate={{
                        x: isWiggling ? [-10, 10, -10, 10, 0] : 0,
                        scale: isSelected ? 1.05 : 1,
                      }}
                      transition={{ type: 'spring', damping: 10 }}
                      className={`aspect-video md:aspect-[4/3] rounded-3xl border-4 p-3 flex flex-col items-center justify-center text-center transition-all duration-300 relative ${
                        isMatched
                          ? 'bg-emerald-100 dark:bg-emerald-950/40 border-emerald-500 opacity-60'
                          : isSelected
                            ? 'bg-amber-100 dark:bg-amber-950/40 border-amber-500 ring-4 ring-amber-300/50'
                            : isWiggling
                              ? 'bg-red-100 border-red-500'
                              : 'bg-white dark:bg-slate-700 border-high-ink hover:translate-y-[-2px] shadow-[0_4px_0_#2D3436]'
                      }`}
                    >
                      <span className={`text-sm md:text-base font-black uppercase text-high-ink dark:text-white tracking-wide truncate max-w-full ${isMatched ? 'line-through text-slate-400' : ''}`}>
                        {card.value}
                      </span>
                      {isMatched && (
                        <span className="absolute bottom-2 bg-emerald-500 text-white rounded-full p-0.5 border-2 border-white">
                          <Check className="w-3.5 h-3.5 stroke-[4]" />
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>

            </div>

            <AnimatePresence>
              {showMatchCelebration && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute inset-0 bg-[#6BCB77]/95 rounded-[2.5rem] p-6 flex flex-col items-center justify-center text-center border-4 border-high-ink z-10"
                >
                  <div className="bg-white p-4 rounded-full border-4 border-high-ink shadow-[0_4px_0_#2D3436] mb-4 animate-bounce">
                    <Sparkles className="w-10 h-10 text-[#FFD93D] fill-[#FFD93D]" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-wide mb-1">
                    {matchLang === 'en' ? 'FABULOUS MATCHES! 🌟' : 'અદ્ભુત સફળતા! 🌟'}
                  </h2>
                  <p className="text-xs md:text-sm font-bold text-slate-700 mb-6 max-w-md">
                    {matchLang === 'en' 
                      ? 'You matched every single word with its picture! Brilliant job!' 
                      : 'તમે બધા ચિત્રોને સાચા ગુજરાતી શબ્દો સાથે જોડી દીધા!'}
                  </p>
                  <button
                    onClick={() => {
                      playClickSound(settings.soundEnabled);
                      setMatchRound(prev => prev + 1);
                      generateWordMatchRound(matchLang);
                    }}
                    className="bg-[#FFD93D] text-high-ink font-black text-sm px-6 py-3 rounded-2xl border-4 border-high-ink shadow-[0_4px_0_#2D3436] active:translate-y-[2px]"
                  >
                    {matchLang === 'en' ? 'PLAY NEXT ROUND' : 'બીજો રાઉન્ડ રમો'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // GAME SUB-VIEW 2: LETTER TO PICTURE (ENGLISH)
  // ----------------------------------------------------
  if (activeGame === 'letter_picture') {
    return (
      <div className="min-h-screen w-full transition-all duration-500 ease-in-out" style={{ background: 'var(--bg-gradient, var(--high-bg))', color: 'var(--high-ink)' }}>
        <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 flex flex-col min-h-screen relative select-none">
          {/* Header */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <h2 className="text-xl md:text-2xl font-black text-high-ink dark:text-white uppercase tracking-wide">
              🅰️ LETTER & PICTURE
            </h2>

            <button
              onClick={speakLpInstruction}
              className="bg-[#FFD93D] text-high-ink p-3 rounded-2xl border-4 border-high-ink shadow-[0_4px_0_#2D3436] hover:translate-y-[-2px]"
            >
              <Volume2 className="w-5 h-5 stroke-[3]" />
            </button>
          </div>

          {/* Stats */}
          <div className="bg-white dark:bg-slate-800 p-4 border-4 border-high-ink rounded-[2rem] shadow-[0_4px_0_#2D3436] flex items-center justify-between mb-8">
            <span className="font-black text-xs uppercase tracking-widest text-slate-400">ROUND {lpRound}</span>
            <span className="bg-[#4D96FF] text-white text-xs font-black px-4 py-1.5 rounded-full border-2 border-high-ink">
              ARCADE STARS: {arcadeScore} ⭐
            </span>
          </div>

          {/* Central Card */}
          <div className="flex-1 bg-violet-100/40 dark:bg-slate-800/50 rounded-[3rem] border-4 border-dashed border-violet-300 dark:border-slate-700 p-6 md:p-8 flex flex-col justify-center items-center relative">
            
            {/* Large target letter */}
            <div className="mb-8 text-center">
              <p className="text-xs font-black text-slate-400 dark:text-slate-300 uppercase tracking-widest mb-2">Find the picture starting with:</p>
              <motion.div 
                animate={{ scale: [0.95, 1.05, 0.95] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className="w-28 h-28 md:w-32 md:h-32 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-purple-600 border-4 border-high-ink flex items-center justify-center font-black text-white text-6xl shadow-[0_6px_0_#2D3436]"
              >
                {lpLetterItem?.letter}
              </motion.div>
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-2 gap-4 md:gap-6 w-full max-w-lg">
              {lpOptions.map((item, idx) => {
                const isWrong = lpWrongSelected.includes(item.letter);
                const isCorrect = lpCorrectSelected && item.letter === lpLetterItem?.letter;

                return (
                  <motion.button
                    key={`lp-opt-${idx}`}
                    whileHover={!isWrong && !lpCorrectSelected ? { scale: 1.03, y: -2 } : {}}
                    whileTap={!isWrong && !lpCorrectSelected ? { scale: 0.97 } : {}}
                    onClick={() => handleLpOptionClick(item)}
                    className={`aspect-square p-4 rounded-3xl border-4 flex flex-col items-center justify-center text-center relative transition-all duration-300 ${
                      isCorrect
                        ? 'bg-emerald-100 border-emerald-500 scale-105 shadow-[0_4px_0_#10B981]'
                        : isWrong
                          ? 'bg-red-50 border-red-400 opacity-45 cursor-not-allowed line-through'
                          : 'bg-white dark:bg-slate-700 border-high-ink shadow-[0_4px_0_#2D3436]'
                    }`}
                  >
                    <span className={`text-4xl md:text-5xl select-none ${isWrong ? 'grayscale' : ''}`}>
                      {item.emoji}
                    </span>
                    <span className="font-extrabold text-xs md:text-sm mt-3 uppercase tracking-wide text-high-ink dark:text-white">
                      {isWrong ? 'TRY AGAIN' : item.word}
                    </span>

                    {isCorrect && (
                      <span className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-1 border-2 border-white animate-bounce">
                        <Check className="w-4 h-4 stroke-[4]" />
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Correct feedback card overlay */}
            <AnimatePresence>
              {lpCorrectSelected && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute inset-0 bg-gradient-to-br from-[#6BCB77] to-[#51B35C] rounded-[3rem] p-6 flex flex-col items-center justify-center text-center border-4 border-high-ink z-10 shadow-2xl"
                >
                  <motion.div 
                    animate={{ scale: [0.9, 1.1, 0.9], rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="bg-white p-4 rounded-full border-4 border-high-ink shadow-[0_4px_0_#2D3436] mb-4 text-4xl"
                  >
                    🥳
                  </motion.div>
                  <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wider mb-2 drop-shadow-sm">
                    {['SUPER!', 'BRILLIANT!', 'GREAT JOB!', 'AWESOME!', 'FANTASTIC!', 'AMAZING!'][lpRound % 6]}
                  </h3>
                  <p className="text-base md:text-lg font-black text-white bg-black/10 px-5 py-2.5 rounded-2xl border-2 border-white/20 max-w-sm mb-4">
                    🌟 {lpLetterItem?.letter} is for {lpLetterItem?.word}! 🌟
                  </p>
                  <div className="flex gap-1.5 justify-center mb-4">
                    {[1, 2, 3, 4, 5].map((_, i) => (
                      <span key={i} className="text-3xl animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>⭐</span>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      playClickSound(settings.soundEnabled);
                      setLpRound(prev => prev + 1);
                      generateLpRound();
                    }}
                    className="bg-[#FFD93D] text-high-ink font-black text-lg px-8 py-3.5 rounded-2xl border-4 border-high-ink shadow-[0_4px_0_#2D3436] hover:translate-y-[-2px] hover:shadow-[0_6px_0_#2D3436] active:translate-y-[2px] active:shadow-[0_2px_0_#2D3436] transition-all flex items-center justify-center gap-2 cursor-pointer w-full max-w-xs"
                  >
                    <span>NEXT</span>
                    <ChevronRight className="w-6 h-6 stroke-[3]" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // GAME SUB-VIEW 3: COUNT THE OBJECTS
  // ----------------------------------------------------
  if (activeGame === 'counting') {
    return (
      <div className="min-h-screen w-full transition-all duration-500 ease-in-out" style={{ background: 'var(--bg-gradient, var(--high-bg))', color: 'var(--high-ink)' }}>
        <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 flex flex-col min-h-screen relative select-none">
          {/* Header */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <h2 className="text-xl md:text-2xl font-black text-high-ink dark:text-white uppercase tracking-wide">
              🎈 OBJECT COUNTING
            </h2>

            <button
              onClick={speakCountInstruction}
              className="bg-[#FFD93D] text-high-ink p-3 rounded-2xl border-4 border-high-ink shadow-[0_4px_0_#2D3436] hover:translate-y-[-2px]"
            >
              <Volume2 className="w-5 h-5 stroke-[3]" />
            </button>
          </div>

          {/* Stats */}
          <div className="mb-6 flex justify-center">
            <div className="bg-white dark:bg-slate-800 px-6 py-3 border-4 border-high-ink rounded-[2rem] shadow-[0_4px_0_#2D3436] flex items-center justify-between max-w-md w-full gap-4">
              <span className="font-black text-xs uppercase tracking-widest text-slate-400">
                {countLang === 'en' ? `ROUND ${countRound}` : `રાઉન્ડ ${toGujaratiNumberString(countRound)}`}
              </span>
              <span className="bg-[#6BCB77] text-white text-xs font-black px-4 py-1.5 rounded-full border-2 border-high-ink">
                {countLang === 'en' ? `ARCADE STARS: ${arcadeScore} ⭐` : `સ્ટાર્સ: ${toGujaratiNumberString(arcadeScore)} ⭐`}
              </span>
            </div>
          </div>

          {/* Central Play Box */}
          <div className="flex-1 bg-emerald-100/40 dark:bg-slate-800/50 rounded-[3rem] border-4 border-dashed border-emerald-300 dark:border-slate-700 p-6 flex flex-col justify-center items-center relative">
            
            <p className="text-sm font-black text-slate-500 dark:text-slate-300 uppercase mb-4 text-center">
              {countLang === 'en' 
                ? 'Tap each item to count, then choose the correct number!' 
                : 'ગણવા માટે દરેક ચિત્રને અડો, પછી સાચો નંબર દબાવો!'}
            </p>

            {/* Objects Display Frame */}
            <div className="w-full max-w-xl bg-white dark:bg-slate-700 p-6 md:p-8 rounded-[2.5rem] border-4 border-high-ink shadow-[0_6px_0_#2D3436] mb-8 relative min-h-[160px] md:min-h-[200px] flex items-center justify-center">
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-4 md:gap-6 justify-center items-center">
                {Array.from({ length: countTarget }).map((_, i) => {
                  const isTapped = objectsTapped.includes(i);
                  const tapOrderIndex = objectsTapped.indexOf(i) + 1;

                  return (
                    <motion.div
                      key={`count-obj-${i}`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleObjectTap(i)}
                      className="relative cursor-pointer select-none"
                    >
                      <motion.span 
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', delay: i * 0.05 }}
                        className="text-4xl md:text-5xl block"
                      >
                        {countEmoji}
                      </motion.span>

                      {/* Highly interactive tap-to-count order indicator badge! */}
                      <AnimatePresence>
                        {isTapped && (
                          <motion.span
                            initial={{ scale: 0, y: 10 }}
                            animate={{ scale: 1, y: 0 }}
                            className="absolute -top-1.5 -right-1.5 bg-[#FF6B6B] text-white border border-white rounded-full w-5 h-5 flex items-center justify-center font-black text-[10px] shadow-sm"
                          >
                            {countLang === 'en' ? tapOrderIndex : toGujaratiNumberString(tapOrderIndex)}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Multiple Choice Number Options */}
            <div className="grid grid-cols-4 gap-3 md:gap-4 w-full max-w-md">
              {countOptions.map((num, idx) => {
                const isWrong = countWrongSelected.includes(num);
                const isCorrect = countCorrectSelected && num === countTarget;

                return (
                  <motion.button
                    key={`cnt-opt-${idx}`}
                    whileHover={!isWrong && !countCorrectSelected ? { scale: 1.05, y: -2 } : {}}
                    whileTap={!isWrong && !countCorrectSelected ? { scale: 0.95 } : {}}
                    onClick={() => handleCountOptionClick(num)}
                    className={`py-3 md:py-4 px-2 rounded-2xl border-4 font-black text-lg md:text-2xl flex flex-col items-center justify-center transition-all duration-200 ${
                      isCorrect
                        ? 'bg-emerald-400 text-white border-emerald-600 scale-105 shadow-[0_4px_0_#10B981]'
                        : isWrong
                          ? 'bg-red-100 text-red-500 border-red-300 opacity-40 cursor-not-allowed line-through'
                          : 'bg-white dark:bg-slate-700 text-high-ink dark:text-white border-high-ink shadow-[0_4px_0_#2D3436]'
                    }`}
                  >
                    <span>{countLang === 'en' ? num : toGujaratiNumberString(num)}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Correct feedback card overlay */}
            <AnimatePresence>
              {countCorrectSelected && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute inset-0 bg-gradient-to-br from-[#6BCB77] to-[#51B35C] rounded-[3rem] p-6 flex flex-col items-center justify-center text-center border-4 border-high-ink z-10 shadow-2xl"
                >
                  <motion.div 
                    animate={{ scale: [0.9, 1.1, 0.9], rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="bg-white p-4 rounded-full border-4 border-high-ink shadow-[0_4px_0_#2D3436] mb-4 text-4xl"
                  >
                    🎈
                  </motion.div>
                  <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wider mb-2 drop-shadow-sm">
                    {countLang === 'en' 
                      ? ['EXCELLENT!', 'FABULOUS!', 'AWESOME!', 'TERRIFIC!', 'SMART KID!'][countRound % 5]
                      : ['ખૂબ સરસ!', 'શાબાશ!', 'અદ્ભુત!', 'સુપર!', 'વાહ ભાઈ વાહ!'][countRound % 5]}
                  </h3>
                  <p className="text-base md:text-lg font-black text-white bg-black/10 px-5 py-2.5 rounded-2xl border-2 border-white/20 max-w-sm mb-4">
                    {countLang === 'en' 
                      ? `There are exactly ${countTarget} ${countTarget === 1 ? countEmoji : `${countEmoji}s`}!`
                      : `અહીં બરાબર ${toGujaratiNumberString(countTarget)} ${countEmoji} છે!`}
                  </p>
                  <div className="flex gap-1.5 justify-center mb-4">
                    {[1, 2, 3, 4, 5].map((_, i) => (
                      <span key={i} className="text-3xl animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>⭐</span>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      playClickSound(settings.soundEnabled);
                      setCountRound(prev => prev + 1);
                      generateCountRound();
                    }}
                    className="bg-[#FFD93D] text-high-ink font-black text-lg px-8 py-3.5 rounded-2xl border-4 border-high-ink shadow-[0_4px_0_#2D3436] hover:translate-y-[-2px] hover:shadow-[0_6px_0_#2D3436] active:translate-y-[2px] active:shadow-[0_2px_0_#2D3436] transition-all flex items-center justify-center gap-2 cursor-pointer w-full max-w-xs"
                  >
                    <span>{countLang === 'en' ? 'NEXT' : 'આગળ વધો'}</span>
                    <ChevronRight className="w-6 h-6 stroke-[3]" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </div>
    );
  }

  if (activeGame === 'guj_letter') {
    return (
      <div className="min-h-screen w-full transition-all duration-500 ease-in-out" style={{ background: 'var(--bg-gradient, var(--high-bg))', color: 'var(--high-ink)' }}>
        <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 flex flex-col min-h-screen relative select-none">
          {/* Header */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <h2 className="text-xl md:text-2xl font-black text-high-ink dark:text-white uppercase tracking-wide">
              🅰️ GUJARATI LETTERS
            </h2>

            <button
              onClick={speakGujInstruction}
              className="bg-[#FFD93D] text-high-ink p-3 rounded-2xl border-4 border-high-ink shadow-[0_4px_0_#2D3436] hover:translate-y-[-2px]"
            >
              <Volume2 className="w-5 h-5 stroke-[3]" />
            </button>
          </div>

          {/* Stats */}
          <div className="bg-white dark:bg-slate-800 p-4 border-4 border-high-ink rounded-[2rem] shadow-[0_4px_0_#2D3436] flex items-center justify-between mb-8">
            <span className="font-black text-xs tracking-widest text-slate-400">રાઉન્ડ {toGujaratiNumberString(gujRound)}</span>
            <span className="bg-[#FF851B] text-white text-xs font-black px-4 py-1.5 rounded-full border-2 border-high-ink">
              સ્ટાર્સ: {toGujaratiNumberString(arcadeScore)} ⭐
            </span>
          </div>

          {/* Central Stage */}
          <div className="flex-1 bg-amber-100/40 dark:bg-slate-800/50 rounded-[3rem] border-4 border-dashed border-amber-300 dark:border-slate-700 p-6 flex flex-col justify-center items-center relative">
            
            {/* Main Question Display Card */}
            <div className="mb-8 text-center max-w-sm w-full">
              <p className="text-sm font-black text-slate-500 dark:text-slate-300 uppercase tracking-wide mb-3">આ ચિત્રનો પહેલો અક્ષર શોધો:</p>
              <div className="bg-white dark:bg-slate-700 p-6 rounded-[2rem] border-4 border-high-ink shadow-[0_6px_0_#2D3436] flex flex-col items-center">
                <motion.span 
                  animate={{ rotate: [-2, 2, -2] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                  className="text-6xl md:text-7xl block mb-4 select-none"
                >
                  {gujTarget?.emoji}
                </motion.span>
                <h3 className="font-black text-2xl tracking-wide text-high-ink dark:text-white uppercase">
                  {gujTarget?.word}
                </h3>
              </div>
            </div>

            {/* Gujarati Letter Option Bubbles */}
            <div className="grid grid-cols-2 gap-4 md:gap-6 w-full max-w-lg">
              {gujOptions.map((item, idx) => {
                const isWrong = gujWrongSelected.includes(item.char);
                const isCorrect = gujCorrectSelected && item.char === gujTarget?.char;

                return (
                  <motion.button
                    key={`guj-opt-${idx}`}
                    whileHover={!isWrong && !gujCorrectSelected ? { scale: 1.04, y: -2 } : {}}
                    whileTap={!isWrong && !gujCorrectSelected ? { scale: 0.96 } : {}}
                    onClick={() => handleGujOptionClick(item)}
                    className={`aspect-video p-4 rounded-3xl border-4 flex flex-col items-center justify-center relative transition-all duration-200 ${
                      isCorrect
                        ? 'bg-emerald-400 text-white border-emerald-600 scale-105 shadow-[0_4px_0_#10B981]'
                        : isWrong
                          ? 'bg-red-50 text-red-300 border-red-300 opacity-40 cursor-not-allowed line-through'
                          : 'bg-white dark:bg-slate-700 text-high-ink dark:text-white border-high-ink shadow-[0_4px_0_#2D3436]'
                    }`}
                  >
                    <span className="text-3xl md:text-4xl font-black">{item.char}</span>
                    {isCorrect && (
                      <span className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-0.5 border-2 border-white animate-bounce">
                        <Check className="w-3.5 h-3.5 stroke-[4]" />
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Correct feedback card overlay */}
            <AnimatePresence>
              {gujCorrectSelected && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute inset-0 bg-gradient-to-br from-[#6BCB77] to-[#51B35C] rounded-[3rem] p-6 flex flex-col items-center justify-center text-center border-4 border-high-ink z-10 shadow-2xl"
                >
                  <motion.div 
                    animate={{ scale: [0.9, 1.1, 0.9], rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="bg-white p-4 rounded-full border-4 border-high-ink shadow-[0_4px_0_#2D3436] mb-4 text-4xl"
                  >
                    🌟
                  </motion.div>
                  <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wider mb-2 drop-shadow-sm">
                    {['અદ્ભુત!', 'ખૂબ સરસ!', 'શાબાશ!', 'ઉત્તમ!', 'સુપર પ્રદર્શન!'][gujRound % 5]}
                  </h3>
                  <p className="text-base md:text-lg font-black text-white bg-black/10 px-5 py-2.5 rounded-2xl border-2 border-white/20 max-w-sm mb-4">
                    🌟 {gujTarget?.char} {gujTarget?.word} નો {gujTarget?.char}! 🌟
                  </p>
                  <div className="flex gap-1.5 justify-center mb-4">
                    {[1, 2, 3, 4, 5].map((_, i) => (
                      <span key={i} className="text-3xl animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>⭐</span>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      playClickSound(settings.soundEnabled);
                      setGujRound(prev => prev + 1);
                      generateGujRound();
                    }}
                    className="bg-[#FFD93D] text-high-ink font-black text-lg px-8 py-3.5 rounded-2xl border-4 border-high-ink shadow-[0_4px_0_#2D3436] hover:translate-y-[-2px] hover:shadow-[0_6px_0_#2D3436] active:translate-y-[2px] active:shadow-[0_2px_0_#2D3436] transition-all flex items-center justify-center gap-2 cursor-pointer w-full max-w-xs"
                  >
                    <span>આગળ વધો</span>
                    <ChevronRight className="w-6 h-6 stroke-[3]" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </div>
    );
  }

  return null;
}
