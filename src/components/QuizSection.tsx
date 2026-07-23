import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, CheckCircle2, XCircle, RotateCcw, HelpCircle, Trophy, Sparkles, Mic, MicOff, Loader2 } from 'lucide-react';
import { ScreenType, AppSettings, QuizQuestion } from '../types';
import { 
  ENGLISH_ABC, 
  ENGLISH_WORDS, 
  getEnglishNumberSpelling, 
  GUJARATI_ALPHABET, 
  GUJARATI_VOWELS,
  GUJARATI_CONSONANTS, 
  GUJARATI_BARAKHADI_MATRAS, 
  GUJARATI_NUMBERS,
  toGujaratiNumberString
} from '../data';
import { speakText, playClickSound, playSuccessSound, playErrorSound } from '../utils/audio';
import {
  getEnglishABCQuestions,
  getEnglishABCLowerQuestions,
  getEnglishWordsQuestions,
  getEnglishNumbersQuestions,
  getEnglishSpellingsQuestions,
  getEnglishTablesQuestions,
  getEnglishVoiceSpellingQuestions,
  getEnglishStoriesQuestions,
  getGujaratiSwarQuestions,
  getGujaratiVyanjanQuestions,
  getGujaratiBarakhadiQuestions,
  getGujaratiNumbersQuestions,
  getGujaratiGhadiyaQuestions,
  getGujaratiVoiceSpellingQuestions,
  getGujaratiStoriesQuestions
} from '../utils/quizPools';
import Confetti from './Confetti';
import ChikuMascot from './ChikuMascot';
import CategoryHeader from './CategoryHeader';

interface QuizSectionProps {
  settings: AppSettings;
  onBackToHome: () => void;
  onCompleteQuiz: (score: number, totalQuestions: number, category?: string) => void;
  language?: 'en' | 'gu';
  initialCategory?: string;
}

enum QuizSubCategory {
  EnglishABC = 'english_abc',
  EnglishABCLower = 'english_abc_lower',
  EnglishWords = 'english_words',
  EnglishNumbers = 'english_numbers',
  EnglishSpellings = 'english_spellings',
  EnglishVoiceSpelling = 'english_voice_spelling',
  GujaratiSwar = 'gujarati_swar',
  GujaratiVyanjan = 'gujarati_vyanjan',
  GujaratiBarakhadi = 'gujarati_barakhadi',
  GujaratiNumbers = 'gujarati_numbers',
  GujaratiGhadiya = 'gujarati_ghadiya',
  GujaratiVoiceSpelling = 'gujarati_voice_spelling',
  EnglishTables = 'english_tables',
  EnglishStories = 'english_stories',
  GujaratiStories = 'gujarati_stories',
  DailyChallenge = 'daily_challenge'
}

const getTodayDateString = (): string => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const getDailyQuizQuestions = (dateString: string): QuizQuestion[] => {
  const pools = [
    getEnglishABCQuestions(),
    getEnglishABCLowerQuestions(),
    getEnglishWordsQuestions(),
    getEnglishNumbersQuestions(),
    getEnglishSpellingsQuestions(),
    getEnglishTablesQuestions(),
    getGujaratiSwarQuestions(),
    getGujaratiVyanjanQuestions(),
    getGujaratiBarakhadiQuestions(),
    getGujaratiNumbersQuestions(),
    getGujaratiGhadiyaQuestions()
  ];

  // Pick some questions from each pool
  const combined: QuizQuestion[] = [];
  pools.forEach(pool => {
    if (pool && pool.length > 0) {
      const shuffledPool = [...pool].sort(() => Math.random() - 0.5);
      combined.push(...shuffledPool.slice(0, 3));
    }
  });

  // Use date string to create a deterministic seed
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    hash = dateString.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Deterministic seeded random number generator
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  let currentSeed = Math.abs(hash || 1);
  const shuffled = [...combined];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const r = seededRandom(currentSeed);
    currentSeed += i;
    const j = Math.floor(r * (i + 1));
    const temp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = temp;
  }

  // Slice 10 questions for a quick daily challenge!
  return shuffled.slice(0, 10);
};

export default function QuizSection({ settings, onBackToHome, onCompleteQuiz, language = 'en', initialCategory }: QuizSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<QuizSubCategory | null>(
    initialCategory ? (initialCategory as QuizSubCategory) : null
  );
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  // Timed challenge states
  const [timedChallenge, setTimedChallenge] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [points, setPoints] = useState(0);
  const [lastBonusPoints, setLastBonusPoints] = useState(0);

  // Voice recognition states
  const [isListening, setIsListening] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [recognitionInstance, setRecognitionInstance] = useState<any>(null);
  const [voiceMatchSuccess, setVoiceMatchSuccess] = useState<boolean | null>(null);
  const [voiceModeActive, setVoiceModeActive] = useState(false);

  // Helper to shuffle an array
  const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  // Generate 5 random incorrect options from a list of strings
  const getIncorrectOptions = (correct: string, allItems: string[], count: number = 3): string[] => {
    const filtered = allItems.filter(item => item !== correct);
    const shuffled = shuffleArray(filtered);
    return shuffled.slice(0, count);
  };

  // Generate questions dynamically
  const generateQuiz = (category: QuizSubCategory) => {
    playClickSound(settings.soundEnabled);
    let pool: QuizQuestion[] = [];
    let questionCount = 50; // Default count is 50

    if (category === QuizSubCategory.EnglishABC) {
      pool = getEnglishABCQuestions();
    } else if (category === QuizSubCategory.EnglishABCLower) {
      pool = getEnglishABCLowerQuestions();
    } else if (category === QuizSubCategory.EnglishWords) {
      pool = getEnglishWordsQuestions();
    } else if (category === QuizSubCategory.EnglishNumbers) {
      pool = getEnglishNumbersQuestions();
    } else if (category === QuizSubCategory.EnglishSpellings) {
      pool = getEnglishSpellingsQuestions();
    } else if (category === QuizSubCategory.EnglishTables) {
      pool = getEnglishTablesQuestions();
    } else if (category === QuizSubCategory.EnglishVoiceSpelling) {
      pool = getEnglishVoiceSpellingQuestions();
    } else if (category === QuizSubCategory.EnglishStories) {
      pool = getEnglishStoriesQuestions();
    } else if (category === QuizSubCategory.GujaratiSwar) {
      pool = getGujaratiSwarQuestions();
    } else if (category === QuizSubCategory.GujaratiVyanjan) {
      pool = getGujaratiVyanjanQuestions();
    } else if (category === QuizSubCategory.GujaratiBarakhadi) {
      pool = getGujaratiBarakhadiQuestions();
    } else if (category === QuizSubCategory.GujaratiNumbers) {
      pool = getGujaratiNumbersQuestions();
    } else if (category === QuizSubCategory.GujaratiGhadiya) {
      pool = getGujaratiGhadiyaQuestions();
    } else if (category === QuizSubCategory.GujaratiVoiceSpelling) {
      pool = getGujaratiVoiceSpellingQuestions();
    } else if (category === QuizSubCategory.GujaratiStories) {
      pool = getGujaratiStoriesQuestions();
    } else if (category === QuizSubCategory.DailyChallenge) {
      const todayStr = getTodayDateString();
      pool = getDailyQuizQuestions(todayStr);
      questionCount = 10;
    }

    // Shuffle the entire pool of questions to randomize them, and then slice the requested count
    const generated = shuffleArray(pool).slice(0, Math.min(questionCount, pool.length));

    // Ensure options are also shuffled
    const finalQuestions = generated.map(q => ({
      ...q,
      options: shuffleArray(q.options)
    }));

    setQuestions(finalQuestions);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setPoints(0);
    setLastBonusPoints(0);
    setTimeLeft(15);
    setQuizFinished(false);
    setSelectedCategory(category);
    // If it's a voice or spelling category, turn on Voice Mode Active by default
    if (
      category === QuizSubCategory.EnglishVoiceSpelling || 
      category === QuizSubCategory.EnglishSpellings ||
      category === QuizSubCategory.EnglishWords ||
      category === QuizSubCategory.GujaratiVoiceSpelling
    ) {
      setVoiceModeActive(true);
    } else {
      setVoiceModeActive(false);
    }
  };

  // Helper to determine if selected category is Gujarati
  const checkIsGujaratiCategory = (cat: QuizSubCategory | null, currentQ?: QuizQuestion): boolean => {
    if (cat === QuizSubCategory.DailyChallenge && currentQ) {
      return currentQ.id.startsWith('gu_');
    }
    return cat === QuizSubCategory.GujaratiSwar || 
           cat === QuizSubCategory.GujaratiVyanjan || 
           cat === QuizSubCategory.GujaratiBarakhadi || 
           cat === QuizSubCategory.GujaratiNumbers ||
           cat === QuizSubCategory.GujaratiGhadiya ||
           cat === QuizSubCategory.GujaratiVoiceSpelling ||
           cat === QuizSubCategory.GujaratiStories;
  };

  // Automatically read question aloud
  const readQuestionAloud = () => {
    if (questions.length === 0 || quizFinished) return;
    const currentQ = questions[currentQuestionIndex];
    const isGuj = checkIsGujaratiCategory(selectedCategory, currentQ);
    
    speakText(
      currentQ.speakText, 
      isGuj ? 'gu' : 'en', 
      isGuj ? settings.gujaratiVoiceURI : settings.englishVoiceURI, 
      settings.soundEnabled,
      selectedCategory || undefined
    );
  };

  // Voice recognition start/stop handlers
  const startVoiceRecognition = () => {
    playClickSound(settings.soundEnabled);
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceError("Your browser doesn't support speech recognition. Please try using Google Chrome or Safari.");
      return;
    }

    if (isListening) {
      if (recognitionInstance) {
        try {
          recognitionInstance.stop();
        } catch (e) {}
      }
      setIsListening(false);
      return;
    }

    setVoiceError(null);
    setTranscribedText('');
    setVoiceMatchSuccess(null);

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    const currentQ = questions[currentQuestionIndex];
    const isGuj = checkIsGujaratiCategory(selectedCategory, currentQ);
    recognition.lang = isGuj ? 'gu-IN' : 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onerror = (event: any) => {
      console.error('[SpeechRecognition] Error event:', event);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        setVoiceError('Microphone permission denied. Please allow microphone access.');
      } else if (event.error === 'no-speech') {
        setVoiceError("We didn't hear anything. Try speaking closer to your mic!");
      } else {
        setVoiceError(`Error: ${event.error}. Please try again.`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      console.log('[SpeechRecognition] Transcribed text:', transcript);
      setTranscribedText(transcript);
      handleVoiceResult(transcript);
    };

    setRecognitionInstance(recognition);
    try {
      recognition.start();
    } catch (err) {
      console.error('[SpeechRecognition] Start error:', err);
      setVoiceError('Could not start microphone. Please check system settings.');
    }
  };

  const handleVoiceResult = (transcript: string) => {
    const currentQ = questions[currentQuestionIndex];
    if (!currentQ) return;

    const cleanStr = (str: string) => {
      return str
        .toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "")
        .replace(/\s+/g, "")
        .trim();
    };

    const cleanTranscript = cleanStr(transcript);
    console.log('[SpeechRecognition] Normalized:', cleanTranscript);

    let matchedOption: string | null = null;

    // 1. Direct match in options
    for (const opt of currentQ.options) {
      if (cleanStr(opt) === cleanTranscript) {
        matchedOption = opt;
        break;
      }
    }

    // 2. Contains/substring match in options
    if (!matchedOption) {
      for (const opt of currentQ.options) {
        const cleanOpt = cleanStr(opt);
        if (cleanOpt.length >= 2 && (cleanTranscript.includes(cleanOpt) || cleanOpt.includes(cleanTranscript))) {
          matchedOption = opt;
          break;
        }
      }
    }

    // 3. Specific checks for Gujarati Voice Spelling (phonetics, full word matching)
    if (!matchedOption && selectedCategory === QuizSubCategory.GujaratiVoiceSpelling) {
      const combined = [...GUJARATI_VOWELS, ...GUJARATI_CONSONANTS];
      const matchedItem = combined.find(
        item => cleanStr(item.char) === cleanTranscript || 
                cleanStr(item.phonetic) === cleanTranscript || 
                cleanStr(item.word) === cleanTranscript ||
                cleanTranscript.includes(cleanStr(item.word))
      );
      if (matchedItem && currentQ.options.includes(matchedItem.char)) {
        matchedOption = matchedItem.char;
      }
    }

    // 4. Fallback direct or partial match with correct answer
    if (!matchedOption) {
      const cleanCorrect = cleanStr(currentQ.correctAnswer);
      if (cleanCorrect === cleanTranscript || cleanTranscript.includes(cleanCorrect)) {
        matchedOption = currentQ.correctAnswer;
      }
    }

    // 5. Special match for spelling numeric words
    if (!matchedOption) {
      const numberSpellings: { [key: string]: string } = {
        "1": "one", "2": "two", "3": "three", "4": "four", "5": "five",
        "6": "six", "7": "seven", "8": "eight", "9": "nine", "10": "ten",
        "one": "1", "two": "2", "three": "3", "four": "4", "five": "5",
        "six": "6", "seven": "7", "eight": "8", "nine": "9", "ten": "10"
      };
      const converted = numberSpellings[cleanTranscript];
      if (converted) {
        const targetOpt = currentQ.options.find(opt => cleanStr(opt) === cleanStr(converted) || cleanStr(opt) === cleanTranscript);
        if (targetOpt) {
          matchedOption = targetOpt;
        }
      }
    }

    if (matchedOption) {
      setVoiceMatchSuccess(true);
      setTimeout(() => {
        handleOptionSelect(matchedOption!);
      }, 1200);
    } else {
      setVoiceMatchSuccess(false);
    }
  };

  // Timeout handler when countdown ends
  const handleTimeout = () => {
    if (isAnswered) return;
    setIsAnswered(true);
    setIsCorrect(false);
    setSelectedOption(null);
    playErrorSound(settings.soundEnabled);

    const isGuj = checkIsGujaratiCategory(selectedCategory, questions[currentQuestionIndex]);
    const timeoutText = isGuj ? "સમય પૂરો થઈ ગયો!" : "Time's up!";
    speakText(
      timeoutText, 
      isGuj ? 'gu' : 'en', 
      isGuj ? settings.gujaratiVoiceURI : settings.englishVoiceURI, 
      settings.soundEnabled,
      selectedCategory || undefined
    );
  };

  // Timed challenge timer interval
  useEffect(() => {
    if (!timedChallenge || selectedCategory === null || quizFinished || isAnswered || questions.length === 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timedChallenge, selectedCategory, quizFinished, isAnswered, currentQuestionIndex, questions]);

  // Abort speech recognition on slide / screen change
  useEffect(() => {
    if (recognitionInstance) {
      try {
        recognitionInstance.abort();
      } catch (e) {}
    }
    setIsListening(false);
    setTranscribedText('');
    setVoiceError(null);
    setVoiceMatchSuccess(null);
  }, [currentQuestionIndex, selectedCategory, quizFinished]);

  // Trigger voice speak on new question
  useEffect(() => {
    if (questions.length > 0 && !quizFinished) {
      const timer = setTimeout(() => {
        readQuestionAloud();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentQuestionIndex, questions, quizFinished]);

  // Trigger auto-quiz-generation if initialCategory is set on mount
  useEffect(() => {
    if (initialCategory) {
      generateQuiz(initialCategory as QuizSubCategory);
    }
  }, [initialCategory]);

  const handleOptionSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    const currentQ = questions[currentQuestionIndex];
    const correct = option === currentQ.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setScore(prev => prev + 1);
      
      // Calculate points
      let earnedPoints = 10;
      let bonus = 0;
      if (timedChallenge) {
        bonus = timeLeft; // 1 point per remaining second
        earnedPoints += bonus;
      }
      setPoints(prev => prev + earnedPoints);
      setLastBonusPoints(bonus);

      playSuccessSound(settings.soundEnabled);
      setShowConfetti(true);
      
      // Let speech voice congratulate!
      const isGuj = checkIsGujaratiCategory(selectedCategory, currentQ);
      
      const congrats = isGuj ? 'અદ્ભુત' : 'Awesome';
      setTimeout(() => {
        speakText(
          congrats, 
          isGuj ? 'gu' : 'en', 
          isGuj ? settings.gujaratiVoiceURI : settings.englishVoiceURI, 
          settings.soundEnabled,
          selectedCategory || undefined
        );
      }, 800);
    } else {
      setLastBonusPoints(0);
      playErrorSound(settings.soundEnabled);
    }
  };

  const handleNextQuestion = () => {
    playClickSound(settings.soundEnabled);
    setShowConfetti(false);
    setSelectedOption(null);
    setIsAnswered(false);
    setTimeLeft(15);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
      onCompleteQuiz(score, questions.length, selectedCategory || undefined);
      // Congratulations sound!
      playSuccessSound(settings.soundEnabled);
      setShowConfetti(true);
      const isGuj = checkIsGujaratiCategory(selectedCategory, questions[currentQuestionIndex]);
      const congratsEnd = isGuj ? 'ખૂબ સરસ! તમારો ક્વિઝ પૂરો થયો' : 'Great job! You finished the quiz!';
      speakText(
        congratsEnd, 
        isGuj ? 'gu' : 'en', 
        isGuj ? settings.gujaratiVoiceURI : settings.englishVoiceURI, 
        settings.soundEnabled,
        selectedCategory || undefined
      );
    }
  };

  const handleRestartQuiz = () => {
    if (selectedCategory) {
      generateQuiz(selectedCategory);
    }
  };

  // Subcategory lists for the Quiz selection menu
  const QUIZ_CATEGORIES = [
    // English Cards
    { key: QuizSubCategory.EnglishABC, label: 'English ABC', emoji: '🔤', color: 'bg-[#FF6B6B]' },
    { key: QuizSubCategory.EnglishABCLower, label: 'English abc', emoji: '✏️', color: 'bg-[#FF6B6B]' },
    { key: QuizSubCategory.EnglishWords, label: 'English Words', emoji: '🍎', color: 'bg-[#4D96FF]' },
    { key: QuizSubCategory.EnglishNumbers, label: 'English Numbers', emoji: '🔟', color: 'bg-[#6BCB77]' },
    { key: QuizSubCategory.EnglishSpellings, label: 'English Numbers With Spellings', emoji: '✏️', color: 'bg-[#B10DC9]' },
    { key: QuizSubCategory.EnglishTables, label: 'English Tables', emoji: '🔢', color: 'bg-[#1ABC9C]' },
    { key: QuizSubCategory.EnglishStories, label: 'Interactive Stories (English)', emoji: '📖', color: 'bg-[#FF851B]' },
    { key: QuizSubCategory.EnglishVoiceSpelling, label: 'Voice Spelling (English)', emoji: '🎙️', color: 'bg-[#FF3E6C]' },

    // Gujarati Cards
    { key: QuizSubCategory.GujaratiSwar, label: 'ગુજરાતી સ્વર', emoji: 'અ', color: 'bg-[#FF851B]' },
    { key: QuizSubCategory.GujaratiVyanjan, label: 'ગુજરાતી કક્કો', emoji: 'ક', color: 'bg-[#FF851B]' },
    { key: QuizSubCategory.GujaratiBarakhadi, label: 'ગુજરાતી બારાખડી', emoji: 'કિ', color: 'bg-[#39CCCC]' },
    { key: QuizSubCategory.GujaratiNumbers, label: 'ગુજરાતી અંકો', emoji: '૧', color: 'bg-[#FF41C8]' },
    { key: QuizSubCategory.GujaratiGhadiya, label: 'ગુજરાતી અંકોના શબ્દો', emoji: '✖️', color: 'bg-[#FF851B]' },
    { key: QuizSubCategory.GujaratiStories, label: 'ગુજરાતી વાર્તાઓ', emoji: '📖', color: 'bg-[#FF851B]' },
    { key: QuizSubCategory.GujaratiVoiceSpelling, label: 'અવાજથી સ્પેલિંગ', emoji: '🎙️', color: 'bg-[#1DDB9E]' },
  ];

  const filteredCategories = QUIZ_CATEGORIES.filter(cat => {
    const isEn = cat.key === QuizSubCategory.EnglishABC ||
                 cat.key === QuizSubCategory.EnglishABCLower ||
                 cat.key === QuizSubCategory.EnglishWords ||
                 cat.key === QuizSubCategory.EnglishNumbers ||
                 cat.key === QuizSubCategory.EnglishSpellings ||
                 cat.key === QuizSubCategory.EnglishTables ||
                 cat.key === QuizSubCategory.EnglishStories ||
                 cat.key === QuizSubCategory.EnglishVoiceSpelling;
    return language === 'en' ? isEn : !isEn;
  });

  return (
    <div className="fixed inset-0 overflow-y-auto p-3 sm:p-4 md:p-6 pb-12 flex flex-col items-center transition-all duration-500 ease-in-out" style={{ background: 'var(--bg-gradient, var(--high-bg))', color: 'var(--high-ink)' }}>
      
      {/* Category Hero Header */}
      <CategoryHeader 
        title={selectedCategory ? 'Quiz Challenge' : (language === 'en' ? 'English Quiz' : 'ગુજરાતી ક્વિઝ')}
        subtitle={selectedCategory ? 'Answer questions & earn stars! ⭐' : 'Choose a category to test your skills! 🎯'}
        emoji="🎯"
        onBack={() => {
          playClickSound(settings.soundEnabled);
          if (selectedCategory) {
            setSelectedCategory(null);
            setQuestions([]);
            setShowConfetti(false);
          } else {
            onBackToHome();
          }
        }}
      />

      {/* Confetti element */}
      {showConfetti && <Confetti />}

      {/* Category selection view */}
      {!selectedCategory && (
        <div className="w-full max-w-3xl flex flex-col items-center">
          <ChikuMascot 
            lang={language}
            soundEnabled={settings.soundEnabled}
            context="quiz"
            className="mb-4 z-10"
          />

          {/* Timed Challenge Toggle */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border-4 border-high-ink shadow-[0_4px_0_#2D3436] mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl animate-pulse">⏱️</span>
              <div className="text-left">
                <h4 className="font-black text-sm text-high-ink dark:text-white">Timed Challenge</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">15s countdown with extra speed points! ⚡</p>
              </div>
            </div>
            <button
              onClick={() => {
                playClickSound(settings.soundEnabled);
                setTimedChallenge(!timedChallenge);
              }}
              className={`font-black px-5 py-2.5 rounded-2xl border-4 border-high-ink shadow-[0_3px_0_#2D3436] transition-all text-sm flex items-center gap-1.5 ${
                timedChallenge 
                  ? 'bg-amber-400 text-high-ink hover:translate-y-[-1px] active:translate-y-[1px]' 
                  : 'bg-white dark:bg-slate-700 text-slate-400 dark:text-slate-300 hover:translate-y-[-1px] active:translate-y-[1px]'
              }`}
            >
              <span>{timedChallenge ? '⚡ ENABLED' : '⏱️ DISABLED'}</span>
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 md:gap-5 w-full">
            {filteredCategories.map((cat) => (
              <motion.button
                key={cat.key}
                onClick={() => generateQuiz(cat.key)}
                whileHover={{ scale: 1.02, translateY: -4 }}
                whileTap={{ scale: 0.98 }}
                className={`${cat.color} text-high-ink text-left border-4 border-high-ink rounded-3xl p-5 shadow-[0_6px_0_#2D3436] flex flex-col justify-between h-44 md:h-52 relative overflow-hidden group`}
              >
                {/* Decorative elements */}
                <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full translate-x-8 -translate-y-8 group-hover:scale-125 transition-transform duration-300 pointer-events-none" />
                
                {/* Top row with emoji */}
                <div className="flex justify-between items-start w-full relative z-10">
                  <span className="text-2xl md:text-3xl bg-white/30 backdrop-blur-sm w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center border-2 border-white/40 shadow-inner group-hover:scale-110 transition-transform">
                    {cat.emoji}
                  </span>
                  
                  <span className="bg-white/80 dark:bg-slate-800/80 border-2 border-high-ink text-high-ink dark:text-white py-1 px-2.5 md:px-3 rounded-full text-[10px] font-black uppercase tracking-wider">
                    {language === 'en' ? 'QUIZ 🎯' : 'ક્વિઝ 🎯'}
                  </span>
                </div>

                {/* Content */}
                <div className="relative z-10 w-full flex flex-col items-center justify-center text-center">
                  <h3 className="text-base md:text-2xl tracking-wide font-black leading-tight line-clamp-2 filter drop-shadow-sm text-center flex-wrap whitespace-normal break-words max-w-full">
                    {cat.label}
                  </h3>
                  <p className="text-[10px] md:text-xs font-semibold opacity-90 mt-1 line-clamp-2 text-center">
                    {language === 'en' 
                      ? 'Test your knowledge! ⭐️' 
                      : 'જ્ઞાનની ચકાસણી કરો! ⭐️'}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Active Quiz View */}
      {selectedCategory && !quizFinished && questions.length > 0 && (
        <div className="w-full max-w-xl flex flex-col gap-6">
          
          {/* Progress bar and score */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border-4 border-high-ink shadow-[0_4px_0_#2D3436] flex items-center justify-between">
            <div className="flex-1 mr-4">
              <div className="flex justify-between text-xs font-bold text-slate-400 dark:text-slate-300 uppercase mb-1">
                <span>
                  {checkIsGujaratiCategory(selectedCategory)
                    ? `પ્રશ્ન ${toGujaratiNumberString(currentQuestionIndex + 1)} / ${toGujaratiNumberString(questions.length)}` 
                    : `Question ${currentQuestionIndex + 1} of ${questions.length}`
                  }
                </span>
                <span>
                  {checkIsGujaratiCategory(selectedCategory)
                    ? `સ્કોર: ${toGujaratiNumberString(score)}${timedChallenge ? ` • પોઇન્ટ્સ: ${toGujaratiNumberString(points)}` : ''}` 
                    : `Score: ${score}${timedChallenge ? ` • Points: ${points}` : ''}`
                  }
                </span>
              </div>
              <div className="w-full bg-black/10 dark:bg-white/10 h-5 rounded-full overflow-hidden p-1 border-2 border-high-ink">
                <div 
                  className="bg-[#FFD93D] h-full rounded-full transition-all duration-300 border-r-2 border-high-ink"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>
            
            <button
              onClick={readQuestionAloud}
              className="bg-[#FFD93D] text-high-ink rounded-2xl p-3 border-4 border-high-ink shadow-[0_4px_0_#2D3436] hover:translate-y-[-2px] hover:shadow-[0_6px_0_#2D3436] active:translate-y-[2px] active:shadow-[0_2px_0_#2D3436] transition-all"
              title="Speak Question"
            >
              <Volume2 className="w-6 h-6 stroke-[3]" />
            </button>
          </div>

          {/* Timed Challenge countdown clock */}
          {timedChallenge && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-4 border-4 border-high-ink shadow-[0_4px_0_#2D3436] flex items-center justify-between overflow-hidden relative">
              <div className="flex items-center gap-3">
                <span className={`text-2xl ${timeLeft <= 5 ? 'animate-bounce text-[#FF6B6B]' : 'text-amber-500'}`}>⏱️</span>
                <span className="font-black text-xs md:text-sm text-high-ink dark:text-white uppercase tracking-wider">
                  {checkIsGujaratiCategory(selectedCategory) ? 'સમય બાકી:' : 'Time Remaining:'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xl md:text-2xl font-black ${timeLeft <= 5 ? 'text-[#FF6B6B] animate-pulse scale-110' : 'text-high-ink dark:text-white'}`}>
                  {checkIsGujaratiCategory(selectedCategory) ? toGujaratiNumberString(timeLeft) : timeLeft}s
                </span>
                <div className="w-24 bg-black/10 dark:bg-white/10 h-3 rounded-full overflow-hidden border-2 border-high-ink">
                  <div 
                    className={`h-full transition-all duration-1000 ${timeLeft <= 5 ? 'bg-[#FF6B6B]' : 'bg-[#FFD93D]'}`}
                    style={{ width: `${(timeLeft / 15) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Voice Mode Toggle Bar */}
          <div className="bg-[#4D96FF]/10 dark:bg-slate-800/80 rounded-3xl p-4 border-4 border-high-ink shadow-[0_4px_0_#2D3436] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl animate-pulse">🎙️</span>
              <div className="text-left">
                <h4 className="font-black text-sm text-high-ink dark:text-white">Microphone Voice Mode</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Speak into the mic to answer!</p>
              </div>
            </div>
            <button
              onClick={() => {
                playClickSound(settings.soundEnabled);
                setVoiceModeActive(!voiceModeActive);
              }}
              className={`font-black px-4 py-2 rounded-2xl border-4 border-high-ink shadow-[0_3px_0_#2D3436] transition-all text-sm ${
                voiceModeActive 
                  ? 'bg-[#6BCB77] text-white hover:translate-y-[-1px] active:translate-y-[1px]' 
                  : 'bg-white dark:bg-slate-700 text-slate-400 dark:text-slate-300 hover:translate-y-[-1px] active:translate-y-[1px]'
              }`}
            >
              {voiceModeActive ? 'Enabled ✅' : 'Disabled ❌'}
            </button>
          </div>

          {/* Question Display Card */}
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 border-8 border-high-ink shadow-[0_8px_0_#2D3436] text-center flex flex-col items-center py-8">
            <HelpCircle className="w-10 h-10 text-high-secondary mb-2 animate-bounce" />
            
            {questions[currentQuestionIndex].emojiHint && (
              <span className="text-8xl my-4 block transform hover:scale-110 transition-transform duration-300">
                {questions[currentQuestionIndex].emojiHint}
              </span>
            )}

            <h2 className="text-2xl md:text-3xl font-black text-gray-800 dark:text-white px-2 leading-snug">
              {questions[currentQuestionIndex].questionText}
            </h2>
            {questions[currentQuestionIndex].type === 'words' && isAnswered && (
              <span className="text-xl font-bold text-white mt-4 bg-[#4D96FF] border-2 border-high-ink px-4 py-1.5 rounded-full shadow-[0_2px_0_#2D3436]">
                {ENGLISH_WORDS.find(w => w.emoji === questions[currentQuestionIndex].correctAnswer)?.word || questions[currentQuestionIndex].correctAnswer}
              </span>
            )}
          </div>

          {/* Voice Input Panel (Shown when Voice Mode is active and question not answered) */}
          {voiceModeActive && !isAnswered && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 border-8 border-high-ink shadow-[0_8px_0_#2D3436] flex flex-col items-center gap-4 text-center"
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs font-black text-slate-400 dark:text-slate-300 uppercase tracking-widest">
                  {checkIsGujaratiCategory(selectedCategory) ? 'મોટેથી ઉત્તર બોલો 🎙️' : 'Speak Your Answer 🎙️'}
                </span>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-300">
                  {checkIsGujaratiCategory(selectedCategory) 
                    ? 'કૃપા કરીને સાચો ઉત્તર માઇકમાં મોટેથી બોલો' 
                    : 'Tap the mic and speak the correct answer!'
                  }
                </p>
              </div>

              {/* Pulsing Voice Button */}
              <button
                onClick={startVoiceRecognition}
                className={`relative w-24 h-24 rounded-full border-4 border-high-ink shadow-[0_6px_0_#2D3436] flex items-center justify-center transition-all ${
                  isListening 
                    ? 'bg-[#FF6B6B] text-white animate-pulse' 
                    : 'bg-[#4D96FF] text-white hover:translate-y-[-2px] hover:shadow-[0_8px_0_#2D3436] active:translate-y-[2px] active:shadow-[0_2px_0_#2D3436]'
                }`}
              >
                {isListening ? (
                  <>
                    <span className="absolute inset-0 rounded-full bg-[#FF6B6B] animate-ping opacity-75" />
                    <Loader2 className="w-10 h-10 animate-spin z-10" />
                  </>
                ) : (
                  <Mic className="w-10 h-10 stroke-[3]" />
                )}
              </button>

              {/* Status & Feedback */}
              <div className="w-full min-h-[3.5rem] flex flex-col items-center justify-center">
                {isListening && (
                  <p className="text-[#FF6B6B] font-black text-lg animate-bounce">
                    {checkIsGujaratiCategory(selectedCategory) ? 'સાંભળી રહ્યા છીએ... બોલો!' : 'Listening... Speak now!'}
                  </p>
                )}

                {transcribedText && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center gap-1"
                  >
                    <span className="text-xs text-slate-400 dark:text-slate-300 font-bold uppercase">You said:</span>
                    <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700 px-5 py-2 rounded-2xl border-2 border-high-ink shadow-[0_2px_0_#2D3436]">
                      <span className="font-black text-lg text-high-ink dark:text-white">"{transcribedText}"</span>
                      {voiceMatchSuccess === true && <span className="text-xl">✅</span>}
                      {voiceMatchSuccess === false && <span className="text-xl">🤔</span>}
                    </div>
                  </motion.div>
                )}

                {voiceError && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[#FF6B6B] font-bold text-sm bg-[#FF6B6B]/10 px-4 py-2 rounded-2xl border-2 border-[#FF6B6B] mt-1"
                  >
                    {voiceError}
                  </motion.p>
                )}

                {voiceMatchSuccess === false && !transcribedText && !voiceError && (
                  <p className="text-amber-500 font-bold text-sm">
                    {checkIsGujaratiCategory(selectedCategory) 
                      ? 'મેળ ખાતો નથી! ફરીથી પ્રયત્ન કરો' 
                      : "We couldn't match that. Try again or select an option below!"
                    }
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* Option Buttons */}
          <div className="grid grid-cols-2 gap-4">
            {questions[currentQuestionIndex].options.map((option, idx) => {
              const isSelected = selectedOption === option;
              const isCorrectAnswer = option === questions[currentQuestionIndex].correctAnswer;
              
              let buttonStyle = 'bg-white dark:bg-slate-800 text-high-ink dark:text-white border-4 border-high-ink shadow-[0_6px_0_#2D3436] hover:translate-y-[-2px] hover:shadow-[0_8px_0_#2D3436] active:translate-y-[2px] active:shadow-[0_2px_0_#2D3436]';
              
              if (isAnswered) {
                if (isCorrectAnswer) {
                  // highlight the correct answer in green
                  buttonStyle = 'bg-[#6BCB77] text-white border-4 border-high-ink shadow-[0_6px_0_#2D3436]';
                } else if (isSelected) {
                  // highlight the selected incorrect answer in red
                  buttonStyle = 'bg-[#FF6B6B] text-white border-4 border-high-ink shadow-[0_6px_0_#2D3436]';
                } else {
                  buttonStyle = 'bg-slate-100 dark:bg-slate-800 text-slate-300 border-4 border-slate-200 pointer-events-none opacity-50';
                }
              }

              // Determine display size based on content length
              const isEmoji = option.match(/\p{Emoji}/u) && option.length <= 4;
              const sizeStyle = isEmoji ? 'text-6xl py-6' : 'text-xl py-5 md:py-6';

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleOptionSelect(option)}
                  className={`${buttonStyle} ${sizeStyle} font-black rounded-3xl active:scale-95 transition-all flex flex-col items-center justify-center relative overflow-hidden`}
                >
                  <span>{option}</span>
                  
                  {/* Icon overplays on answered state */}
                  {isAnswered && isCorrectAnswer && (
                    <CheckCircle2 className="w-6 h-6 text-white absolute top-2 right-2" />
                  )}
                  {isAnswered && isSelected && !isCorrectAnswer && (
                    <XCircle className="w-6 h-6 text-white absolute top-2 right-2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Next / feedback drawer */}
          <AnimatePresence>
            {isAnswered && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className={`rounded-3xl p-5 border-4 border-high-ink shadow-[0_6px_0_#2D3436] flex items-center justify-between text-white ${
                  isCorrect ? 'bg-[#6BCB77]' : 'bg-[#FF6B6B]'
                }`}
              >
                <div>
                  <h4 className="text-xl md:text-2xl font-black">
                    {timeLeft === 0 && timedChallenge ? "⏱️ Time's Up!" : (isCorrect ? '🎉 Correct!' : '😢 Oops! Try Again')}
                  </h4>
                  <p className="text-sm font-semibold opacity-90 mt-1">
                    {timeLeft === 0 && timedChallenge 
                      ? (checkIsGujaratiCategory(selectedCategory) ? `સાચો ઉત્તર "${questions[currentQuestionIndex].correctAnswer}" હતો` : `The correct answer was "${questions[currentQuestionIndex].correctAnswer}"`)
                      : (isCorrect 
                        ? (timedChallenge && lastBonusPoints > 0 
                          ? `+10 pts & +${lastBonusPoints} speed bonus! 🔥` 
                          : 'You did amazing!') 
                        : (checkIsGujaratiCategory(selectedCategory) ? `સાચો ઉત્તર "${questions[currentQuestionIndex].correctAnswer}" હતો` : `The correct answer was "${questions[currentQuestionIndex].correctAnswer}"`))
                    }
                  </p>
                </div>
                <button
                  onClick={handleNextQuestion}
                  className="bg-white text-high-ink font-black px-6 py-3 rounded-2xl border-4 border-high-ink shadow-[0_4px_0_#2D3436] hover:translate-y-[-2px] hover:shadow-[0_6px_0_#2D3436] active:translate-y-[2px] active:shadow-[0_2px_0_#2D3436] transition-all text-lg"
                >
                  {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish 🏆'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Finished Quiz Summary Card */}
      {selectedCategory && quizFinished && (
        <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-[3rem] p-8 border-8 border-high-ink shadow-[0_12px_0_#2D3436] text-center flex flex-col items-center">
          
          {/* Badge */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
            className="w-32 h-32 bg-[#FFD93D] rounded-full flex items-center justify-center mb-6 border-4 border-high-ink shadow-[0_4px_0_#2D3436] relative"
          >
            <Trophy className="w-16 h-16 text-high-ink animate-bounce" />
            <Sparkles className="w-6 h-6 text-high-primary absolute top-4 right-4 animate-ping" />
          </motion.div>

          <h2 className="text-3xl font-black text-gray-800 dark:text-white mb-2">
            Quiz Completed!
          </h2>
          <p className="text-slate-500 dark:text-slate-300 font-bold mb-6 text-lg">
            Superb learning! You scored
          </p>

          {/* Big Score counter */}
          <div className="bg-slate-50 dark:bg-slate-700 rounded-3xl py-4 px-10 border-4 border-high-ink mb-8 inline-block">
            <span className="text-6xl font-black text-high-secondary">
              {checkIsGujaratiCategory(selectedCategory) ? toGujaratiNumberString(score) : score}
            </span>
            <span className="text-3xl font-black text-slate-300 dark:text-slate-500 mx-2">/</span>
            <span className="text-3xl font-black text-slate-400 dark:text-slate-200">
              {checkIsGujaratiCategory(selectedCategory) ? toGujaratiNumberString(questions.length) : questions.length}
            </span>
            {timedChallenge && (
              <div className="mt-3 pt-2 border-t-2 border-high-ink/15 text-sm font-black text-amber-500 uppercase tracking-wide flex items-center justify-center gap-1.5 animate-pulse">
                <span>⚡ POINTS: {checkIsGujaratiCategory(selectedCategory) ? toGujaratiNumberString(points) : points}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4.5 w-full">
            <button
              onClick={handleRestartQuiz}
              className="bg-[#6BCB77] text-white font-black py-4 rounded-2xl border-4 border-high-ink shadow-[0_6px_0_#2D3436] hover:translate-y-[-2px] hover:shadow-[0_8px_0_#2D3436] active:translate-y-[2px] active:shadow-[0_2px_0_#2D3436] transition-all text-xl flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5 stroke-[3]" />
              Play Again
            </button>

            <button
              onClick={() => {
                playClickSound(settings.soundEnabled);
                setSelectedCategory(null);
                setQuestions([]);
                setShowConfetti(false);
              }}
              className="bg-white text-high-ink font-black py-4 rounded-2xl border-4 border-high-ink shadow-[0_6px_0_#2D3436] hover:translate-y-[-2px] hover:shadow-[0_8px_0_#2D3436] active:translate-y-[2px] active:shadow-[0_2px_0_#2D3436] transition-all text-lg"
            >
              Choose Another Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
