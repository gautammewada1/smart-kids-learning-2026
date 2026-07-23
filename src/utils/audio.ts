// Offline Audio Synthesis and Speech System for Kids Learning App
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { Capacitor } from '@capacitor/core';

let audioCtx: AudioContext | null = null;
let bgMusicInterval: any = null;
let isMusicPlaying = false;
let vibrationEnabled = true;

// Cached list of native voices if available
let nativeVoices: any[] = [];

// Initialize Web Audio Context lazily
function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
}

// Global vibration controllers
export function setVibrationEnabled(enabled: boolean) {
  vibrationEnabled = enabled;
  console.log(`[Haptics] Vibration feedback set to: ${enabled}`);
}

export function triggerVibration(pattern: number | number[]) {
  if (!vibrationEnabled) return;
  if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      navigator.vibrate(pattern);
    } catch (err) {
      console.warn('[Haptics] Vibration failed or was blocked by browser:', err);
    }
  }
}

/**
 * Startup initialization for TextToSpeech engine and Web Audio.
 */
export function initTextToSpeech() {
  if (typeof window === 'undefined') return;

  console.log('[initTextToSpeech] Initializing TextToSpeech system...');

  // Warm up native Capacitor TTS on Android
  if (Capacitor.isNativePlatform()) {
    try {
      TextToSpeech.getSupportedLanguages().then((res) => {
        console.log('[initTextToSpeech] Native TTS supported languages:', res.languages);
      }).catch((err) => {
        console.warn('[initTextToSpeech] Native TTS getSupportedLanguages warning:', err);
      });

      TextToSpeech.getSupportedVoices().then((res) => {
        if (res && res.voices) {
          nativeVoices = res.voices;
          console.log(`[initTextToSpeech] Native TTS loaded ${res.voices.length} voices.`);
        }
      }).catch((err) => {
        console.warn('[initTextToSpeech] Native TTS getSupportedVoices warning:', err);
      });
    } catch (e) {
      console.warn('[initTextToSpeech] Native TTS init exception:', e);
    }
  }

  // Warm up browser SpeechSynthesis
  if (window.speechSynthesis) {
    try {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        const v = window.speechSynthesis.getVoices();
        console.log(`[initTextToSpeech] Web SpeechSynthesis loaded ${v.length} voices.`);
      };
    } catch (err) {
      console.warn('[initTextToSpeech] Web SpeechSynthesis getVoices error:', err);
    }
  }

  // Resume Web Audio Context on first user touch/click
  const unlockAudio = () => {
    try {
      const ctx = getAudioContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume();
      }
    } catch (e) {}
    window.removeEventListener('click', unlockAudio);
    window.removeEventListener('touchstart', unlockAudio);
  };
  window.addEventListener('click', unlockAudio);
  window.addEventListener('touchstart', unlockAudio);
}

// 1. Dynamic Sound Effects (Click, Success, Error)
export function playClickSound(enabled: boolean) {
  triggerVibration(15);

  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.12);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch (err) {
    console.error('Click sound failed:', err);
  }
}

export function playSuccessSound(enabled: boolean) {
  triggerVibration([40, 30, 40, 30, 60]);

  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  
  try {
    const notes = [261.63, 329.63, 392.00, 523.25];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.08 + 0.3);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + idx * 0.08 + 0.3);
    });
  } catch (err) {
    console.error('Success sound failed:', err);
  }
}

export function playErrorSound(enabled: boolean) {
  triggerVibration([70, 50, 70]);

  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.25);
    
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.25);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  } catch (err) {
    console.error('Error sound failed:', err);
  }
}

// 2. Playful Ambient Music Synthesizer
export function startBackgroundMusic(enabled: boolean) {
  if (!enabled) {
    stopBackgroundMusic();
    return;
  }
  
  if (isMusicPlaying) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  
  isMusicPlaying = true;
  
  const melody = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 392.00, 329.63];
  let beat = 0;
  
  function playNote() {
    if (!isMusicPlaying || !ctx) return;
    try {
      if (beat % 2 === 0) {
        const freq = melody[Math.floor(Math.random() * melody.length)];
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.3);
      }
      beat = (beat + 1) % 16;
    } catch (err) {
      console.error('Music scheduler tick failed:', err);
    }
  }
  
  if (bgMusicInterval) clearInterval(bgMusicInterval);
  bgMusicInterval = setInterval(playNote, 600);
}

export function stopBackgroundMusic() {
  isMusicPlaying = false;
  if (bgMusicInterval) {
    clearInterval(bgMusicInterval);
    bgMusicInterval = null;
  }
}

// 3. Audio & Text-to-Speech Engine

let activeUtterance: SpeechSynthesisUtterance | null = null;
let pendingSpeakTimeout: any = null;

export function getAvailableVoices(): any[] {
  if (typeof window === 'undefined') return [];
  const webVoices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
  if (webVoices && webVoices.length > 0) {
    return webVoices;
  }
  return nativeVoices;
}

/**
 * Builds candidate paths for local MP3 files based on spoken text and metadata.
 */
function getAudioPathCandidates(text: string, lang: 'en' | 'gu', moduleType?: string): string[] {
  const candidates: string[] = [];
  if (!text) return candidates;

  const trimmed = text.trim();

  // If text is a direct mp3 file path
  if (trimmed.endsWith('.mp3') || trimmed.startsWith('/audio/')) {
    candidates.push(trimmed);
  }

  // Convert text to safe filename slug
  const slug = trimmed
    .toLowerCase()
    .replace(/[^a-z0-9\u0A80-\u0AFF]+/g, '_')
    .replace(/^_+|_+$/g, '');

  if (slug) {
    candidates.push(`/audio/${lang}/${slug}.mp3`);
    candidates.push(`/audio/${slug}.mp3`);
    if (moduleType) {
      candidates.push(`/audio/${lang}/${moduleType}/${slug}.mp3`);
    }
  }

  return candidates;
}

/**
 * Attempts to play a local MP3 file if present.
 * Returns true if local audio played successfully, false if missing/error.
 */
async function tryPlayLocalAudio(candidates: string[]): Promise<boolean> {
  if (typeof window === 'undefined' || candidates.length === 0) return false;

  for (const url of candidates) {
    try {
      const success = await new Promise<boolean>((resolve) => {
        const audio = new Audio(url);
        audio.volume = 1.0;
        let handled = false;

        audio.oncanplaythrough = () => {
          if (!handled) {
            handled = true;
            audio.play().then(() => resolve(true)).catch(() => resolve(false));
          }
        };

        audio.onerror = () => {
          if (!handled) {
            handled = true;
            resolve(false);
          }
        };

        // Safety timeout to avoid hanging if network request stalls
        setTimeout(() => {
          if (!handled) {
            handled = true;
            try { audio.pause(); } catch (e) {}
            resolve(false);
          }
        }, 120);
      });

      if (success) {
        console.log(`[tryPlayLocalAudio] Played local MP3: ${url}`);
        return true;
      }
    } catch (err) {
      // Ignore and try next candidate
    }
  }

  return false;
}

/**
 * Speaks text using Android Native Text-to-Speech plugin (@capacitor-community/text-to-speech).
 */
async function speakNativeTTS(text: string, lang: 'en' | 'gu'): Promise<boolean> {
  try {
    await TextToSpeech.stop();

    let targetLang = lang === 'gu' ? 'gu-IN' : 'en-US';

    if (lang === 'gu') {
      try {
        const check = await TextToSpeech.isLanguageSupported({ lang: 'gu-IN' });
        if (!check.supported) {
          const checkGu = await TextToSpeech.isLanguageSupported({ lang: 'gu' });
          if (checkGu.supported) {
            targetLang = 'gu';
          } else {
            const checkHi = await TextToSpeech.isLanguageSupported({ lang: 'hi-IN' });
            if (checkHi.supported) {
              targetLang = 'hi-IN';
            }
          }
        }
      } catch (e) {
        // Fall back to gu-IN
      }
    } else {
      try {
        const check = await TextToSpeech.isLanguageSupported({ lang: 'en-US' });
        if (!check.supported) {
          const checkIn = await TextToSpeech.isLanguageSupported({ lang: 'en-IN' });
          if (checkIn.supported) {
            targetLang = 'en-IN';
          }
        }
      } catch (e) {
        // Fall back to en-US
      }
    }

    await TextToSpeech.speak({
      text: text,
      lang: targetLang,
      rate: 0.82,
      pitch: 1.1,
      volume: 1.0,
    });

    console.log(`[speakNativeTTS] Spoke via Native Android TTS: "${text}" (${targetLang})`);
    return true;
  } catch (err) {
    console.warn('[speakNativeTTS] Native TTS failed:', err);
    return false;
  }
}

/**
 * Speaks text using Web SpeechSynthesis API.
 */
function speakWebSpeechSynthesis(
  text: string, 
  lang: 'en' | 'gu', 
  preferredVoiceURI?: string
) {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    console.warn('[speakWebSpeechSynthesis] SpeechSynthesis not supported.');
    return;
  }

  try {
    window.speechSynthesis.cancel();
  } catch (err) {
    console.error('[speakWebSpeechSynthesis] Error during cancel:', err);
  }

  let voiceURI = preferredVoiceURI;
  if (!voiceURI) {
    try {
      const stored = localStorage.getItem('kids_learning_app_settings_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (lang === 'en') {
          voiceURI = parsed.englishVoiceURI;
        } else if (lang === 'gu') {
          voiceURI = parsed.gujaratiVoiceURI;
        }
      }
    } catch (err) {
      console.error('[speakWebSpeechSynthesis] Failed reading settings:', err);
    }
  }

  const doSpeak = (voicesList: SpeechSynthesisVoice[]) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const utterance = new SpeechSynthesisUtterance(text);
    activeUtterance = utterance;

    utterance.volume = 1.0;
    utterance.rate = 0.82;
    utterance.pitch = 1.15;

    let selectedVoice: SpeechSynthesisVoice | undefined;

    const enVoices = voicesList.filter(v => v.lang.toLowerCase().startsWith('en') || v.lang.toLowerCase().replace('_', '-').startsWith('en-'));
    let guVoices = voicesList.filter(v => v.lang.toLowerCase().startsWith('gu') || v.lang.toLowerCase().replace('_', '-').startsWith('gu-'));
    
    if (guVoices.length === 0) {
      guVoices = voicesList.filter(v => {
        const l = v.lang.toLowerCase();
        return l.includes('hi-in') || l.includes('hi_in') || l.startsWith('hi');
      });
      if (guVoices.length === 0) {
        guVoices = voicesList.filter(v => {
          const l = v.lang.toLowerCase();
          return l.includes('en-in') || l.includes('en_in');
        });
      }
    }

    if (lang === 'en') {
      if (voiceURI) {
        selectedVoice = enVoices.find(v => v.voiceURI === voiceURI);
      }
      if (!selectedVoice) {
        selectedVoice = enVoices.find(v => {
          const l = v.lang.toLowerCase();
          return l === 'en-us' || l === 'en_us' || l.startsWith('en-us') || l.startsWith('en_us');
        });
        if (!selectedVoice && enVoices.length > 0) {
          selectedVoice = enVoices[0];
        }
      }
    } else {
      if (voiceURI) {
        selectedVoice = guVoices.find(v => v.voiceURI === voiceURI);
      }
      if (!selectedVoice) {
        selectedVoice = voicesList.find(v => {
          const l = v.lang.toLowerCase();
          return l === 'gu-in' || l === 'gu_in' || l.startsWith('gu');
        });
        if (!selectedVoice) {
          selectedVoice = voicesList.find(v => {
            const l = v.lang.toLowerCase();
            return l.includes('hi-in') || l.includes('hi_in') || l.startsWith('hi');
          });
        }
        if (!selectedVoice) {
          selectedVoice = voicesList.find(v => {
            const l = v.lang.toLowerCase();
            return l.includes('en-in') || l.includes('en_in');
          });
        }
        if (!selectedVoice && guVoices.length > 0) {
          selectedVoice = guVoices[0];
        }
      }
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    } else {
      utterance.lang = lang === 'gu' ? 'gu-IN' : 'en-US';
    }

    if (window.speechSynthesis.paused) {
      try {
        window.speechSynthesis.resume();
      } catch (e) {}
    }

    try {
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('[speakWebSpeechSynthesis] Speak error:', err);
    }
  };

  const voices = window.speechSynthesis.getVoices();
  if (voices && voices.length > 0) {
    doSpeak(voices);
  } else {
    let resolved = false;
    const handleVoicesChanged = () => {
      if (resolved) return;
      const updatedVoices = window.speechSynthesis.getVoices();
      if (updatedVoices && updatedVoices.length > 0) {
        resolved = true;
        if (window.speechSynthesis) {
          window.speechSynthesis.onvoiceschanged = null;
        }
        doSpeak(updatedVoices);
      }
    };

    window.speechSynthesis.onvoiceschanged = handleVoicesChanged;

    setTimeout(() => {
      if (resolved) return;
      resolved = true;
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
      const finalVoices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
      doSpeak(finalVoices);
    }, 200);
  }
}

/**
 * Main Entry Point for Educational Pronunciation.
 * Priority:
 * 1. Play Local MP3 audio if available.
 * 2. If local MP3 missing, automatically use Native Android Text-To-Speech (if on Android).
 * 3. Fallback to Web SpeechSynthesis API.
 */
export async function speakText(
  text: string, 
  lang: 'en' | 'gu', 
  preferredVoiceURI?: string, 
  soundOn: boolean = true,
  moduleType?: string
) {
  if (!soundOn || !text) return;

  console.log(`[speakText] Triggered with text: "${text}", lang: "${lang}", preferredVoiceURI: "${preferredVoiceURI || 'none'}", moduleType: "${moduleType || 'none'}"`);

  // Skip TTS for English Tables and Gujarati Ghadiya modules as per design
  if (moduleType === 'english_tables' || moduleType === 'gujarati_ghadiya') {
    console.log(`[speakText] Skipping TTS playback for module type: "${moduleType}"`);
    return;
  }

  // Clear pending timeouts
  if (pendingSpeakTimeout) {
    clearTimeout(pendingSpeakTimeout);
    pendingSpeakTimeout = null;
  }

  pendingSpeakTimeout = setTimeout(async () => {
    pendingSpeakTimeout = null;

    // STEP 1: Attempt Local MP3 Audio First
    const audioCandidates = getAudioPathCandidates(text, lang, moduleType);
    const playedLocal = await tryPlayLocalAudio(audioCandidates);
    if (playedLocal) {
      return;
    }

    // STEP 2: Android Native Text-to-Speech (if on Android device)
    if (Capacitor.isNativePlatform()) {
      const playedNative = await speakNativeTTS(text, lang);
      if (playedNative) {
        return;
      }
    }

    // STEP 3: Fallback to Web SpeechSynthesis
    speakWebSpeechSynthesis(text, lang, preferredVoiceURI);
  }, 100);
}

/**
 * Playful synthesized lion roar sound effect.
 */
export function playLionRoarSound(enabled: boolean) {
  triggerVibration([60, 40, 80, 40, 100]);

  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    // Frequency sweep simulating a cute lion roar: starts low, rises up, then growls down
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.15);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.5);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.08);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.35);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.55);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.55);
  } catch (err) {
    console.error('Lion roar sound failed:', err);
  }
}

