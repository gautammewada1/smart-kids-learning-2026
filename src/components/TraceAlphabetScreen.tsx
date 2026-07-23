import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Volume2, Sparkles, Check } from 'lucide-react';
import { AppSettings } from '../types';
import { playClickSound, speakText } from '../utils/audio';
import CategoryHeader from './CategoryHeader';
import { GUJARATI_CONSONANTS } from '../data';

interface TraceAlphabetScreenProps {
  settings: AppSettings;
  onBackToHome: () => void;
  language?: 'en' | 'gu';
}

const CRAYON_COLORS = [
  '#FF4757', // Coral Red
  '#2ED573', // Lime Green
  '#1E90FF', // Sky Blue
  '#FFA502', // Orange
  '#9B59B6', // Purple
  '#FF6B81', // Pink
];

export default function TraceAlphabetScreen({
  settings,
  onBackToHome,
  language = 'en'
}: TraceAlphabetScreenProps) {
  const [langTab, setLangTab] = useState<'en' | 'gu'>(language);
  const englishChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const gujaratiChars = GUJARATI_CONSONANTS.map(item => item.char);
  
  const currentChars = langTab === 'en' ? englishChars : gujaratiChars;
  const [currentChar, setCurrentChar] = useState(currentChars[0] || 'A');
  const [selectedColor, setSelectedColor] = useState(CRAYON_COLORS[0]);

  // Canvas drawing state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    clearCanvas();
  }, [currentChar, langTab]);

  const handleSelectLang = (newLang: 'en' | 'gu') => {
    playClickSound(settings.soundEnabled);
    setLangTab(newLang);
    const firstChar = newLang === 'en' ? englishChars[0] : gujaratiChars[0];
    setCurrentChar(firstChar);
  };

  const handleCharSelect = (char: string) => {
    playClickSound(settings.soundEnabled);
    setCurrentChar(char);
    speakText(char, langTab, undefined, settings.soundEnabled);
  };

  // Drawing mouse/touch handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = 16;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  return (
    <div className="fixed inset-0 overflow-y-auto pb-12 px-3 sm:px-4 pt-3 flex flex-col items-center transition-all duration-500 ease-in-out select-none" style={{ background: 'var(--bg-gradient, var(--high-bg))', color: 'var(--high-ink)' }}>
      
      {/* Category Hero Header */}
      <CategoryHeader 
        title={langTab === 'en' ? "Alphabet Trace" : "અક્ષર લખતા શીખો"}
        subtitle={langTab === 'en' ? "Practice writing letters with your finger! ✏️" : "આંગળી વડે અક્ષર લખવાનો મહાવરો કરો! ✏️"}
        emoji="✍️"
        onBack={() => {
          playClickSound(settings.soundEnabled);
          onBackToHome();
        }}
      />

      {/* Language Switcher Tabs */}
      <div className="flex gap-3 my-3 z-10 bg-white/40 dark:bg-slate-800/80 backdrop-blur-md p-2 rounded-full border-4 border-high-ink shadow-[0_6px_0_#2D3436]">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleSelectLang('en')}
          className={`px-6 py-2.5 rounded-full font-black text-sm sm:text-base transition-all border-3 ${
            langTab === 'en'
              ? 'bg-[#FFD93D] text-high-ink border-high-ink shadow-[0_3px_0_#2D3436]'
              : 'bg-white/80 text-high-ink border-transparent hover:bg-white'
          }`}
        >
          English ABC 🔤
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleSelectLang('gu')}
          className={`px-6 py-2.5 rounded-full font-black text-sm sm:text-base transition-all border-3 ${
            langTab === 'gu'
              ? 'bg-[#FFD93D] text-high-ink border-high-ink shadow-[0_3px_0_#2D3436]'
              : 'bg-white/80 text-high-ink border-transparent hover:bg-white'
          }`}
        >
          ગુજરાતી ક-ખ-ગ 🪶
        </motion.button>
      </div>

      {/* Character Selector Grid */}
      <div className="w-full max-w-2xl flex flex-wrap gap-2 justify-center mb-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-3.5 rounded-3xl border-4 border-high-ink shadow-[0_8px_0_#2D3436] max-h-36 overflow-y-auto">
        {currentChars.map((char) => (
          <motion.button
            key={char}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleCharSelect(char)}
            className={`w-11 h-11 rounded-2xl font-black text-lg sm:text-xl border-3 transition-all flex items-center justify-center cursor-pointer ${
              currentChar === char
                ? 'bg-[#FF6B6B] text-white border-high-ink shadow-[0_4px_0_#2D3436] scale-110'
                : 'bg-white dark:bg-slate-700 text-high-ink dark:text-white border-high-ink/20 hover:border-high-ink shadow-[0_2px_0_#2D3436]'
            }`}
          >
            {char}
          </motion.button>
        ))}
      </div>

      {/* Crayon Color Selector Bar */}
      <div className="flex items-center gap-3 mb-4 bg-white/90 dark:bg-slate-800/90 px-5 py-2.5 rounded-2xl border-4 border-high-ink shadow-[0_4px_0_#2D3436]">
        <span className="text-xs font-black uppercase text-high-ink dark:text-white">Crayon:</span>
        {CRAYON_COLORS.map(color => (
          <button
            key={color}
            onClick={() => {
              playClickSound(settings.soundEnabled);
              setSelectedColor(color);
            }}
            className={`w-8 h-8 rounded-full border-3 border-high-ink transition-all flex items-center justify-center ${
              selectedColor === color ? 'scale-125 shadow-[0_3px_0_#2D3436]' : 'hover:scale-110'
            }`}
            style={{ backgroundColor: color }}
          >
            {selectedColor === color && <Check className="w-4 h-4 text-white stroke-[3]" />}
          </button>
        ))}

        <button
          onClick={() => {
            playClickSound(settings.soundEnabled);
            clearCanvas();
          }}
          className="ml-2 bg-amber-400 text-high-ink font-black px-3 py-1.5 rounded-xl border-3 border-high-ink shadow-[0_2px_0_#2D3436] active:translate-y-[1px] text-xs flex items-center gap-1 uppercase"
        >
          <RotateCcw className="w-4 h-4 stroke-[3]" />
          Eraser
        </button>

        <button
          onClick={() => speakText(currentChar, langTab, undefined, settings.soundEnabled)}
          className="bg-[#4D96FF] text-white font-black px-3 py-1.5 rounded-xl border-3 border-high-ink shadow-[0_2px_0_#2D3436] active:translate-y-[1px] text-xs flex items-center gap-1 uppercase"
        >
          <Volume2 className="w-4 h-4 stroke-[3]" />
          Hear 🔊
        </button>
      </div>

      {/* Interactive Tracing Canvas Box */}
      <div className="relative w-80 h-80 sm:w-96 sm:h-96 bg-white dark:bg-slate-800 rounded-[2.5rem] border-8 border-high-ink shadow-[0_12px_0_#2D3436] flex items-center justify-center overflow-hidden touch-none">
        
        {/* Background Trace Letter Template */}
        <span className="text-[10rem] sm:text-[12rem] font-black text-slate-200 dark:text-slate-700/60 select-none leading-none filter drop-shadow-sm pointer-events-none absolute">
          {currentChar}
        </span>
        
        {/* HTML5 Canvas overlay for drawing */}
        <canvas
          ref={canvasRef}
          width={384}
          height={384}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="absolute inset-0 w-full h-full cursor-crosshair z-10"
        />

        {/* Footer info banner */}
        <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center bg-amber-100/90 dark:bg-slate-700/90 backdrop-blur-sm px-4 py-2 rounded-2xl border-3 border-high-ink z-20 pointer-events-none">
          <span className="font-extrabold text-xs sm:text-sm text-high-ink dark:text-white">
            Trace letter "{currentChar}" with your finger! ✏️
          </span>
          <Sparkles className="w-5 h-5 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
        </div>
      </div>
    </div>
  );
}
