import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Shuffle, Check, Save } from 'lucide-react';
import { AvatarConfig, AppSettings } from '../types';
import AvatarPreview from './AvatarPreview';
import { playClickSound, playSuccessSound } from '../utils/audio';

interface AvatarCustomizerProps {
  initialConfig: AvatarConfig;
  settings: AppSettings;
  onSave: (config: AvatarConfig) => void;
  onClose: () => void;
}

const SHAPES = [
  { key: 'circle', name: 'Circle 🟢' },
  { key: 'squircle', name: 'Badge 🔲' },
  { key: 'flower', name: 'Flower 🌸' },
  { key: 'hexagon', name: 'Honeycomb ⬡' },
  { key: 'shield', name: 'Hero Shield 🛡️' },
  { key: 'star', name: 'Magic Star ⭐' }
];

const COLORS = [
  { key: 'bg-[#FFD93D]', name: '☀️ Sun Gold' },
  { key: 'bg-[#FF6B6B]', name: '🍎 Coral' },
  { key: 'bg-[#4D96FF]', name: '🐬 Sky Blue' },
  { key: 'bg-[#6BCB77]', name: '🦕 Dino Green' },
  { key: 'bg-[#B10DC9]', name: '🦄 Purple' },
  { key: 'bg-[#FF851B]', name: '🍊 Orange' },
  { key: 'bg-gradient-to-tr from-[#FF6B6B] to-[#6BCB77]', name: '🍉 Watermelon' },
  { key: 'bg-gradient-to-tr from-[#FF851B] to-[#4D96FF]', name: '🍭 Candy' },
  { key: 'bg-gradient-to-tr from-[#B10DC9] to-indigo-900', name: '🌌 Cosmic' },
  { key: 'bg-gradient-to-tr from-[#FF41C8] to-[#FF6B6B]', name: '🍒 Berry' }
];

const EMOJIS = [
  '😄', '😎', '🤩', '🥳', '🥰', '🤪', '🦁', '🐱', '🐶', '🦊', '🦖', '🐼', '🐨', '🐸', '🦄', '🐰', '🚀', '👑', '⭐️', '🎨', '🎮', '🧸', '🌈', '🏎️'
];

const BORDER_COLORS = [
  { key: 'border-[#2D3436]', name: 'Charcoal' },
  { key: 'border-[#4D96FF]', name: 'Blue' },
  { key: 'border-[#FF6B6B]', name: 'Red' },
  { key: 'border-[#6BCB77]', name: 'Green' },
  { key: 'border-[#FFD93D]', name: 'Yellow' },
  { key: 'border-[#B10DC9]', name: 'Purple' }
];

const BORDER_STYLES = [
  { key: 'solid', name: 'Solid ➖' },
  { key: 'dashed', name: 'Dashed ╌' },
  { key: 'dotted', name: 'Dotted ⋯' }
];

export default function AvatarCustomizer({ initialConfig, settings, onSave, onClose }: AvatarCustomizerProps) {
  const [config, setConfig] = useState<AvatarConfig>({ ...initialConfig });
  const [activeTab, setActiveTab] = useState<'shape' | 'color' | 'emoji' | 'border'>('shape');

  const handleUpdate = (updates: Partial<AvatarConfig>) => {
    playClickSound(settings.soundEnabled);
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const handleRandomize = () => {
    playClickSound(settings.soundEnabled);
    const randomShape = SHAPES[Math.floor(Math.random() * SHAPES.length)].key;
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)].key;
    const randomEmoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    const randomBorderColor = BORDER_COLORS[Math.floor(Math.random() * BORDER_COLORS.length)].key;
    const randomBorderStyle = BORDER_STYLES[Math.floor(Math.random() * BORDER_STYLES.length)].key;

    setConfig(prev => ({
      ...prev,
      shape: randomShape,
      bgColor: randomColor,
      emoji: randomEmoji,
      borderColor: randomBorderColor,
      borderStyle: randomBorderStyle
    }));
  };

  const handleSave = () => {
    const finalName = config.playerName.trim() || 'Little Explorer';
    const finalConfig = { ...config, playerName: finalName };
    playSuccessSound(settings.soundEnabled);
    onSave(finalConfig);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-6"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        transition={{ type: 'spring', damping: 18 }}
        className="bg-white dark:bg-slate-900 rounded-[2.5rem] border-8 border-high-ink shadow-[0_12px_0_#2D3436] max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col relative"
      >
        {/* Top Header */}
        <div className="bg-[#4D96FF] border-b-6 border-high-ink p-5 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <span className="text-3xl animate-bounce">🎨</span>
            <div className="text-left">
              <h2 className="font-black text-xl md:text-2xl leading-none">Avatar Customizer</h2>
              <p className="text-xs text-blue-100 font-extrabold uppercase mt-1 tracking-wider">Create your dream profile icon!</p>
            </div>
          </div>
          <button 
            onClick={() => {
              playClickSound(settings.soundEnabled);
              onClose();
            }}
            className="bg-white text-high-ink hover:bg-slate-100 p-2.5 rounded-2xl border-4 border-high-ink shadow-[0_3px_0_#2D3436] active:translate-y-[3px] active:shadow-none transition-all"
          >
            <X className="w-5 h-5 stroke-[3.5]" />
          </button>
        </div>

        {/* Scrollable Workspace */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-6 items-center md:items-stretch">
          
          {/* Left Side: Live Preview and Name Input */}
          <div className="flex flex-col items-center justify-between gap-5 bg-slate-50 dark:bg-slate-800/60 rounded-[2rem] p-5 border-4 border-high-ink shadow-[0_6px_0_#2D3436] w-full md:w-56 shrink-0 text-center">
            <div className="flex flex-col items-center gap-2">
              <span className="text-[10px] font-black tracking-widest text-slate-400 dark:text-slate-300 uppercase">Live Preview</span>
              
              {/* Pulsing, bouncy avatar container */}
              <motion.div 
                key={`${config.shape}-${config.bgColor}-${config.emoji}-${config.borderColor}-${config.borderStyle}`}
                initial={{ scale: 0.82 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 150, damping: 10 }}
                className="my-3 flex items-center justify-center cursor-pointer"
                onClick={handleRandomize}
                title="Tap to Randomize!"
              >
                <AvatarPreview config={config} size="xl" />
              </motion.div>
            </div>

            {/* Name Input Field */}
            <div className="w-full flex flex-col gap-1.5">
              <label className="text-xs font-black text-slate-500 dark:text-slate-300 uppercase tracking-wider text-left">Your Profile Name</label>
              <input 
                type="text"
                maxLength={18}
                value={config.playerName}
                onChange={(e) => setConfig(prev => ({ ...prev, playerName: e.target.value }))}
                placeholder="Enter nickname..."
                className="w-full bg-white dark:bg-slate-700 font-black text-center text-high-ink dark:text-white px-3 py-2.5 rounded-2xl border-4 border-high-ink shadow-[0_3px_0_#2D3436] focus:outline-none focus:translate-y-[-1px] focus:shadow-[0_4px_0_#2D3436] transition-all text-sm"
              />
            </div>

            {/* Randomize Button */}
            <button
              onClick={handleRandomize}
              className="w-full bg-[#FFD93D] hover:bg-[#ffe169] text-high-ink font-black py-2.5 px-4 rounded-2xl border-4 border-high-ink shadow-[0_4px_0_#2D3436] hover:translate-y-[-2px] hover:shadow-[0_6px_0_#2D3436] active:translate-y-[2px] active:shadow-[0_2px_0_#2D3436] transition-all flex items-center justify-center gap-2 text-xs"
            >
              <Shuffle className="w-4 h-4 stroke-[3]" />
              <span>Randomize 🎲</span>
            </button>
          </div>

          {/* Right Side: Options Customization Panels */}
          <div className="flex-1 flex flex-col gap-4 w-full">
            
            {/* Horizontal Tabs */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border-4 border-high-ink gap-1">
              {(['shape', 'color', 'emoji', 'border'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    playClickSound(settings.soundEnabled);
                    setActiveTab(tab);
                  }}
                  className={`flex-1 text-center py-2 px-1 rounded-xl font-black text-xs uppercase tracking-wider border-2 transition-all ${
                    activeTab === tab
                      ? 'bg-[#FF6B6B] text-white border-high-ink shadow-[0_2px_0_#2D3436] translate-y-[-1px]'
                      : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-high-ink dark:hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Contents Panel */}
            <div className="flex-1 bg-slate-50 dark:bg-slate-800/40 border-4 border-high-ink rounded-[2rem] p-5 shadow-[0_4px_0_#2D3436] min-h-[220px]">
              
              {/* Tab: Shapes */}
              {activeTab === 'shape' && (
                <div className="grid grid-cols-2 gap-3">
                  {SHAPES.map((shp) => (
                    <button
                      key={shp.key}
                      onClick={() => handleUpdate({ shape: shp.key })}
                      className={`flex items-center gap-3 p-3 rounded-2xl border-4 transition-all font-black text-sm text-left ${
                        config.shape === shp.key
                          ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-500 shadow-[0_3px_0_#10B981]'
                          : 'bg-white dark:bg-slate-700 hover:bg-slate-100 text-slate-700 dark:text-white border-high-ink shadow-[0_3px_0_#2D3436] active:translate-y-[2px] active:shadow-[0_1px_0_#2D3436]'
                      }`}
                    >
                      <div className="w-8 h-8 shrink-0 flex items-center justify-center">
                        <AvatarPreview 
                          config={{ ...config, shape: shp.key, emoji: '✨' }} 
                          size="sm" 
                        />
                      </div>
                      <span>{shp.name}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Tab: Colors */}
              {activeTab === 'color' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {COLORS.map((clr) => (
                    <button
                      key={clr.key}
                      onClick={() => handleUpdate({ bgColor: clr.key })}
                      className={`flex items-center gap-2 p-2.5 rounded-2xl border-4 transition-all font-black text-xs text-left ${
                        config.bgColor === clr.key
                          ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-500 shadow-[0_3px_0_#10B981]'
                          : 'bg-white dark:bg-slate-700 hover:bg-slate-100 text-slate-700 dark:text-white border-high-ink shadow-[0_3px_0_#2D3436] active:translate-y-[2px] active:shadow-[0_1px_0_#2D3436]'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-lg ${clr.key} border-2 border-high-ink shadow-sm shrink-0`} />
                      <span className="truncate">{clr.name}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Tab: Emojis */}
              {activeTab === 'emoji' && (
                <div className="grid grid-cols-6 gap-2 max-h-[220px] overflow-y-auto pr-1">
                  {EMOJIS.map((emj) => (
                    <button
                      key={emj}
                      onClick={() => handleUpdate({ emoji: emj })}
                      className={`aspect-square rounded-xl border-4 flex items-center justify-center text-2xl transition-all ${
                        config.emoji === emj
                          ? 'bg-emerald-100 dark:bg-emerald-950/50 border-emerald-500 shadow-[0_3px_0_#10B981] scale-105'
                          : 'bg-white dark:bg-slate-700 hover:bg-slate-100 border-high-ink shadow-[0_3px_0_#2D3436] active:translate-y-[2px] active:shadow-[0_1px_0_#2D3436]'
                      }`}
                    >
                      {emj}
                    </button>
                  ))}
                </div>
              )}

              {/* Tab: Border */}
              {activeTab === 'border' && (
                <div className="flex flex-col gap-4">
                  {/* Border Colors */}
                  <div>
                    <h4 className="text-xs font-black text-slate-400 dark:text-slate-300 uppercase tracking-wider mb-2 text-left">Border Color</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {BORDER_COLORS.map((bc) => (
                        <button
                          key={bc.key}
                          onClick={() => handleUpdate({ borderColor: bc.key })}
                          className={`flex items-center gap-2 p-2 rounded-xl border-2 transition-all font-bold text-[10px] uppercase text-left ${
                            config.borderColor === bc.key
                              ? 'bg-emerald-100 dark:bg-emerald-950/50 border-emerald-500 shadow-[0_2px_0_#10B981]'
                              : 'bg-white dark:bg-slate-700 hover:bg-slate-100 text-slate-700 dark:text-white border-high-ink shadow-[0_2px_0_#2D3436] active:translate-y-[1px] active:shadow-[0_0.5px_0_#2D3436]'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full border border-high-ink shrink-0`} style={{ backgroundColor: bc.key.split('[')[1]?.split(']')[0] || '#2D3436' }} />
                          <span className="truncate">{bc.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Border Styles */}
                  <div>
                    <h4 className="text-xs font-black text-slate-400 dark:text-slate-300 uppercase tracking-wider mb-2 text-left">Border Style</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {BORDER_STYLES.map((bs) => (
                        <button
                          key={bs.key}
                          onClick={() => handleUpdate({ borderStyle: bs.key })}
                          className={`p-2 rounded-xl border-2 transition-all font-black text-xs text-center ${
                            config.borderStyle === bs.key
                              ? 'bg-emerald-100 dark:bg-emerald-950/50 border-emerald-500 shadow-[0_2px_0_#10B981]'
                              : 'bg-white dark:bg-slate-700 hover:bg-slate-100 text-slate-700 dark:text-white border-high-ink shadow-[0_2px_0_#2D3436] active:translate-y-[1px] active:shadow-[0_0.5px_0_#2D3436]'
                          }`}
                        >
                          {bs.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 dark:bg-slate-800 border-t-6 border-high-ink p-5 flex items-center justify-end gap-3 shrink-0">
          <button
            onClick={() => {
              playClickSound(settings.soundEnabled);
              onClose();
            }}
            className="bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-white font-black py-3 px-6 rounded-2xl border-4 border-high-ink shadow-[0_4px_0_#2D3436] active:translate-y-[4px] active:shadow-none transition-all text-sm"
          >
            Cancel
          </button>
          
          <button
            onClick={handleSave}
            className="bg-[#6BCB77] hover:bg-[#5fc06b] text-white font-black py-3 px-8 rounded-2xl border-4 border-high-ink shadow-[0_4px_0_#2D3436] hover:translate-y-[-2px] hover:shadow-[0_6px_0_#2D3436] active:translate-y-[2px] active:shadow-[0_2px_0_#2D3436] transition-all flex items-center gap-2 text-sm"
          >
            <Save className="w-4 h-4 stroke-[3]" />
            <span>Apply & Save</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
