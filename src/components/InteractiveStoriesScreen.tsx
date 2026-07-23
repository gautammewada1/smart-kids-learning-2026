import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Sparkles, Volume2, X, ChevronRight, ChevronLeft, Award } from 'lucide-react';
import { ScreenType, AppSettings } from '../types';
import { playClickSound, speakText, playSuccessSound } from '../utils/audio';
import { UserProgress } from '../utils/userState';
import CategoryHeader from './CategoryHeader';

interface InteractiveStoriesScreenProps {
  settings: AppSettings;
  progress: UserProgress;
  onCompleteItem: (idx: number) => void;
  onBackToHome: () => void;
  language?: 'en' | 'gu';
  screenType?: ScreenType;
}

interface StoryItem {
  id: number;
  title: string;
  emoji: string;
  moral: string;
  paragraphs: string[];
}

export default function InteractiveStoriesScreen({
  settings,
  progress,
  onCompleteItem,
  onBackToHome,
  language = 'en',
  screenType
}: InteractiveStoriesScreenProps) {
  const [selectedStory, setSelectedStory] = useState<StoryItem | null>(null);
  const [currentParagraph, setCurrentParagraph] = useState(0);

  const stories: StoryItem[] = language === 'gu' ? [
    {
      id: 0,
      title: 'ધ તરસ્યો કાગડો',
      emoji: '🦅',
      moral: 'જ્યાં ચાહ ત્યાં રાહ - બુદ્ધિથી બધું શક્ય છે!',
      paragraphs: [
        'એક ઉનાળાના દિવસે એક તરસ્યો કાગડો પાણીની શોધમાં આકાશમાં ઊડી રહ્યો હતો.',
        'બહુ શોધ્યા પછી તેને એક બગીચામાં એક કૂંજો દેખાયો. કાગડો ખુશ થઈને નીચે આવ્યો.',
        'કૂંજામાં પાણી ખૂબ ઓછું હતું. કાગડાની ચાંચ પાણી સુધી પહોંચી શકતી નહોતી.',
        'કાગડાએ આસપાસ જોયું અને તેને નાના નાના કાંકરા દેખાયા. તેને એક યુક્તિ સુઝી!',
        'તેણે એક-એક કરીને કાંકરા કૂંજામાં નાખવાનું શરૂ કર્યું. ધીમે ધીમે પાણી ઉપર આવ્યું!',
        'કાગડાએ ધરાઈને પાણી પીધું અને આનંદથી આકાશમાં ઊડી ગયો!'
      ]
    },
    {
      id: 1,
      title: 'સસલું અને કાચબો',
      emoji: '🐢',
      moral: 'ધીરજના ફળ મીઠા - સતત મહેનતથી જ સફળતા મળે છે!',
      paragraphs: [
        'એક સુંદર જંગલમાં એક સસલું અને એક કાચબો રહેતા હતા. સસલાને તેની ઝડપ પર ખૂબ ઘમંડ હતો.',
        'એક દિવસે સસલાએ કાચબાને રેસ લગાવવા માટે પડકાર ફેંક્યો. કાચબાએ સ્વીકાર કર્યો.',
        'રેસ શરૂ થઈ! સસલું ખૂબ ઝડપથી દોડીને આગળ નીકળી ગયું.',
        'રસ્તામાં સસલાએ પાછળ જોયું, કાચબો ખૂબ પાછળ હતો. સસલું એક વૃક્ષ નીચે સૂઈ ગયું.',
        'કાચબો ધીમે ધીમે પણ રોકાયા વગર ચાલતો રહ્યો. તે સસલાને વટાવીને આગળ નીકળી ગયો.',
        'જ્યારે સસલું જાગ્યું ત્યારે કાચબો જીતી ચૂક્યો હતો! સસલાનું ઘમંડ તૂટી ગયું.'
      ]
    },
    {
      id: 2,
      title: 'સિંહ અને ઉંદર',
      emoji: '🦁',
      moral: 'કોઈને નાનું ના સમજવું - નાનો મિત્ર પણ મોટી મદદ કરી શકે છે!',
      paragraphs: [
        'એક જંગલમાં એક મોટો સિંહ સૂઈ રહ્યો હતો. એક નાનો ઉંદર તેના પર કૂદાકૂદ કરવા લાગ્યો.',
        'સિંહ જાગી ગયો અને ગુસ્સામાં ઉંદરને પકડી લીધો. ઉંદરે દયાની ભીખ માંગી.',
        'સિંહે હસીને ઉંદરને છોડી દીધો. થોડા દિવસ પછી સિંહ શિકારીની જાળમાં ફસાઈ ગયો.',
        'સિંહે મોટેથી ગર્જના કરી. તે સાંભળીને નાનો ઉંદર દોડી આવ્યો.',
        'ઉંદરે પોતાના તીક્ષ્ણ દાંત વડે જાળ કાપી નાખી! સિંહ આઝાદ થઈ ગયો.',
        'સિંહે નાનકડા ઉંદરનો આભાર માન્યો અને બંને પાકા મિત્રો બની ગયા!'
      ]
    }
  ] : [
    {
      id: 0,
      title: 'The Thirsty Crow',
      emoji: '🦅',
      moral: 'Where there is a will, there is a way!',
      paragraphs: [
        'On a hot summer day, a thirsty crow flew all around searching for water.',
        'After searching for a long time, he spotted a pitcher in a lovely garden.',
        'He flew down, but the pitcher had very little water at the bottom. His beak could not reach it!',
        'The clever crow looked around and saw small pebbles on the ground. He had a brilliant idea!',
        'One by one, he dropped pebbles into the pitcher. Slowly, the water level rose to the top!',
        'The crow drank the cool water happily and flew away into the blue sky!'
      ]
    },
    {
      id: 1,
      title: 'The Tortoise and Hare',
      emoji: '🐢',
      moral: 'Slow and steady wins the race!',
      paragraphs: [
        'In a peaceful forest, a speedy hare was very proud of how fast he could run.',
        'He challenged a slow-moving tortoise to a racing competition. The tortoise agreed smile.',
        'The race started! The hare sprinted far ahead and decided to take a nap under a shady tree.',
        'Meanwhile, the tortoise kept walking step by step, never stopping or giving up.',
        'When the hare woke up, he saw the tortoise near the finish line and ran as fast as he could!',
        'But it was too late! The tortoise crossed the finish line first and won the gold trophy!'
      ]
    },
    {
      id: 2,
      title: 'The Lion and the Mouse',
      emoji: '🦁',
      moral: 'A small act of kindness is never wasted!',
      paragraphs: [
        'A mighty lion was sleeping peacefully in the jungle under a big tree.',
        'A tiny mouse started playing on the lion. The lion woke up and caught the mouse in his paw!',
        'The little mouse begged, "Please let me go! I might help you one day!" The lion laughed and set him free.',
        'A few days later, the lion got caught in a strong hunter\'s net and roared for help.',
        'The tiny mouse heard the roar, ran to the spot, and quickly chewed through the thick ropes!',
        'The lion was free! He thanked the mouse, and they became best friends forever.'
      ]
    }
  ];

  const handleOpenStory = (story: StoryItem) => {
    playClickSound(settings.soundEnabled);
    setSelectedStory(story);
    setCurrentParagraph(0);
    speakText(story.title, language, undefined, settings.soundEnabled);
  };

  const handleReadParagraph = () => {
    if (!selectedStory) return;
    speakText(selectedStory.paragraphs[currentParagraph], language, undefined, settings.soundEnabled);
  };

  const handleNextParagraph = () => {
    playClickSound(settings.soundEnabled);
    if (!selectedStory) return;

    if (currentParagraph < selectedStory.paragraphs.length - 1) {
      const nextIdx = currentParagraph + 1;
      setCurrentParagraph(nextIdx);
      speakText(selectedStory.paragraphs[nextIdx], language, undefined, settings.soundEnabled);
    } else {
      // Completed story!
      playSuccessSound(settings.soundEnabled);
      onCompleteItem(selectedStory.id);
      setSelectedStory(null);
    }
  };

  const handlePrevParagraph = () => {
    playClickSound(settings.soundEnabled);
    if (currentParagraph > 0) {
      const prevIdx = currentParagraph - 1;
      setCurrentParagraph(prevIdx);
      if (selectedStory) {
        speakText(selectedStory.paragraphs[prevIdx], language, undefined, settings.soundEnabled);
      }
    }
  };

  return (
    <div className="fixed inset-0 overflow-y-auto pb-12 px-3 sm:px-4 pt-3 flex flex-col items-center transition-all duration-500 ease-in-out select-none" style={{ background: 'var(--bg-gradient, var(--high-bg))', color: 'var(--high-ink)' }}>
      
      {/* Category Hero Header */}
      <CategoryHeader 
        title={language === 'gu' ? 'વાર્તાઓ' : 'Interactive Stories'}
        subtitle={language === 'gu' ? 'મજાની બાળ વાર્તાઓ વાંચો અને સાંભળો! 📖' : 'Read & listen to fun illustrated stories! 📖'}
        emoji="📖"
        onBack={() => {
          playClickSound(settings.soundEnabled);
          onBackToHome();
        }}
      />

      {/* Story Cards List */}
      <div className="w-full max-w-xl flex flex-col gap-4 mt-4">
        {stories.map((story) => (
          <motion.div
            key={story.id}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleOpenStory(story)}
            className="p-5 sm:p-6 bg-white dark:bg-slate-800 rounded-[2.5rem] border-4 border-high-ink shadow-[0_8px_0_#2D3436] cursor-pointer flex flex-col gap-3 transition-all relative overflow-hidden group"
          >
            <div className="flex items-center gap-4 relative z-10">
              <span className="text-5xl md:text-6xl bg-amber-100 dark:bg-slate-700 p-3 rounded-2xl border-3 border-high-ink shrink-0 group-hover:scale-110 transition-transform">
                {story.emoji}
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-high-ink dark:text-white leading-tight">
                    {story.title}
                  </h2>
                  <span className="bg-[#FFD93D] text-high-ink text-xs font-black px-3 py-1 rounded-full border-2 border-high-ink uppercase">
                    Read ➔
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400 mt-1">
                  ✨ {story.moral}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Story Reader Fullscreen Popup */}
      <AnimatePresence>
        {selectedStory && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 p-4 flex items-center justify-center bg-black/60 backdrop-blur-md"
          >
            <div className="w-full max-w-xl bg-white dark:bg-slate-800 rounded-[3rem] border-8 border-high-ink shadow-[0_16px_0_#2D3436] p-6 md:p-8 flex flex-col items-center relative text-center">
              
              {/* Close Button */}
              <button 
                onClick={() => {
                  playClickSound(settings.soundEnabled);
                  setSelectedStory(null);
                }}
                className="absolute top-4 right-4 bg-[#FF6B6B] text-white p-2.5 rounded-full border-3 border-high-ink shadow-[0_3px_0_#2D3436] hover:scale-110 active:scale-95 transition-all"
              >
                <X className="w-6 h-6 stroke-[3]" />
              </button>

              {/* Story Header */}
              <div className="flex items-center gap-3 mb-4 mt-2">
                <span className="text-5xl">{selectedStory.emoji}</span>
                <h2 className="text-2xl md:text-3xl font-black text-high-ink dark:text-white">
                  {selectedStory.title}
                </h2>
              </div>

              {/* Progress Indicator */}
              <div className="w-full bg-slate-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden border-2 border-high-ink mb-6">
                <div 
                  className="bg-[#FFD93D] h-full transition-all duration-300"
                  style={{ width: `${((currentParagraph + 1) / selectedStory.paragraphs.length) * 100}%` }}
                />
              </div>

              {/* Story Paragraph Box */}
              <div className="bg-amber-50 dark:bg-slate-700/80 rounded-3xl p-6 border-4 border-high-ink shadow-[0_6px_0_#2D3436] min-h-[160px] flex items-center justify-center text-center mb-6 w-full relative">
                <p className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white leading-relaxed">
                  "{selectedStory.paragraphs[currentParagraph]}"
                </p>
              </div>

              {/* Read Aloud Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReadParagraph}
                className="bg-[#FFD93D] text-high-ink font-black px-6 py-2.5 rounded-2xl border-3 border-high-ink shadow-[0_3px_0_#2D3436] mb-6 flex items-center gap-2 text-sm uppercase"
              >
                <Volume2 className="w-5 h-5 stroke-[3]" />
                Read Aloud 🔊
              </motion.button>

              {/* Bottom Nav Controls */}
              <div className="flex items-center justify-between w-full gap-4">
                <button
                  disabled={currentParagraph === 0}
                  onClick={handlePrevParagraph}
                  className={`flex-1 py-3 px-4 rounded-2xl border-4 border-high-ink font-black text-base flex items-center justify-center gap-1.5 transition-all ${
                    currentParagraph === 0
                      ? 'opacity-40 bg-slate-200 text-slate-400 border-slate-300 pointer-events-none'
                      : 'bg-white text-high-ink shadow-[0_4px_0_#2D3436] active:translate-y-[2px]'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5 stroke-[3]" />
                  Back
                </button>

                <button
                  onClick={handleNextParagraph}
                  className="flex-1 py-3 px-4 rounded-2xl border-4 border-high-ink font-black text-base bg-[#6BCB77] text-white shadow-[0_4px_0_#2D3436] active:translate-y-[2px] flex items-center justify-center gap-1.5 transition-all uppercase"
                >
                  {currentParagraph < selectedStory.paragraphs.length - 1 ? (
                    <>
                      Next
                      <ChevronRight className="w-5 h-5 stroke-[3]" />
                    </>
                  ) : (
                    <>
                      Finish 🏆
                      <Award className="w-5 h-5 stroke-[3]" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
