/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { ScreenType, AppSettings, AvatarConfig, COLOR_PALETTES } from './types';
import HomeScreen from './components/HomeScreen';
import LearningScreen from './components/LearningScreen';
import QuizSection from './components/QuizSection';
import SettingsScreen from './components/SettingsScreen';
import WordMatchingGame from './components/WordMatchingGame';
import InteractiveStoriesScreen from './components/InteractiveStoriesScreen';
import GamesScreen from './components/GamesScreen';
import TraceAlphabetScreen from './components/TraceAlphabetScreen';
import WeeklyProgressScreen from './components/WeeklyProgressScreen';
import AchievementsShelfScreen from './components/AchievementsShelfScreen';
import { startBackgroundMusic, stopBackgroundMusic, playClickSound, setVibrationEnabled, initTextToSpeech } from './utils/audio';
import { applyThemeGlobal } from './utils/theme';
import { applyEnglishFontGlobal } from './utils/fonts';
import { 
  UserProgress, 
  loadUserProgress, 
  saveUserProgress, 
  updateStreak, 
  getDefaultUserProgress,
  completeLearningItem,
  completeQuizProgress,
  ACHIEVEMENTS
} from './utils/userState';
import confetti from 'canvas-confetti';

const LOCAL_STORAGE_KEY = 'kids_learning_app_settings_v1';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>(ScreenType.Home);
  const [activeTab, setActiveTab] = useState<'gujarati' | 'english'>('gujarati');
  const [quizLanguage, setQuizLanguage] = useState<'en' | 'gu'>('en');
  const [initialQuizCategory, setInitialQuizCategory] = useState<string | undefined>(undefined);
  const [settings, setSettings] = useState<AppSettings>({
    englishVoiceURI: '',
    gujaratiVoiceURI: '',
    darkMode: false,
    soundEnabled: true,
    bgMusicEnabled: false, // Default off to avoid annoying parents, easily toggled in Settings!
    autoPlayAudio: true, // Auto play slides by default
    vibrationEnabled: true, // Vibration/haptics enabled by default
    colorPalette: 'default', // Playful Rainbow is default
    englishFontStyle: 'fredoka', // Default English font style
  });

  const [progress, setProgress] = useState<UserProgress>(getDefaultUserProgress());
  const [unlockedAchievementsQueue, setUnlockedAchievementsQueue] = useState<string[]>([]);
  const [showGoalCompletionToast, setShowGoalCompletionToast] = useState(false);
  const [savedScrollY, setSavedScrollY] = useState<number | null>(null);
  const [initialIndex, setInitialIndex] = useState<number | undefined>(undefined);

  const currentScreenRef = useRef<ScreenType>(currentScreen);
  useEffect(() => {
    currentScreenRef.current = currentScreen;
  }, [currentScreen]);

  // Synchronize history state for standard back button & Android back button support
  useEffect(() => {
    // Replace initial state with Home screen
    window.history.replaceState({ screen: ScreenType.Home, activeTab: activeTab, initIndex: undefined }, '');

    const handlePopState = (event: PopStateEvent) => {
      const targetScreen = event.state && event.state.screen ? event.state.screen : ScreenType.Home;
      currentScreenRef.current = targetScreen;
      setCurrentScreen(targetScreen);
      if (event.state && event.state.activeTab) {
        setActiveTab(event.state.activeTab);
      }
      setInitialIndex(event.state ? event.state.initIndex : undefined);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Update history state when activeTab changes, so popping back restores correct tab
  useEffect(() => {
    if (currentScreen === ScreenType.Home) {
      window.history.replaceState({ screen: ScreenType.Home, activeTab: activeTab, initIndex: undefined }, '');
    }
  }, [activeTab, currentScreen]);

  const handleBackToHome = () => {
    setInitialQuizCategory(undefined);
    setInitialIndex(undefined);
    // If browser history has a screen we pushed, go back in history.
    // This will trigger popstate, which restores currentScreen, activeTab, and triggers scroll restoration on HomeScreen.
    if (window.history.state && window.history.state.screen && window.history.state.screen !== ScreenType.Home) {
      window.history.back();
    } else {
      // Direct state fallback if history is not populated
      currentScreenRef.current = ScreenType.Home;
      setCurrentScreen(ScreenType.Home);
    }
  };

  // Handle Android hardware back button via Capacitor App plugin
  useEffect(() => {
    let backButtonListener: any = null;

    const setupBackButton = async () => {
      try {
        backButtonListener = await CapacitorApp.addListener('backButton', () => {
          if (currentScreenRef.current !== ScreenType.Home) {
            handleBackToHome();
          } else {
            CapacitorApp.exitApp();
          }
        });
      } catch (err) {
        console.log('Capacitor backButton listener not active in web environment:', err);
      }
    };

    setupBackButton();

    return () => {
      if (backButtonListener && typeof backButtonListener.remove === 'function') {
        backButtonListener.remove();
      }
    };
  }, []);

  // Load settings and progress from local storage
  useEffect(() => {
    initTextToSpeech();

    // 1. Load Settings
    try {
      const storedSettings = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedSettings) {
        const parsed = JSON.parse(storedSettings);
        setSettings(parsed);
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    }

    // 2. Load Progress and update streak
    const loadedProgress = loadUserProgress();
    const { updatedProgress } = updateStreak(loadedProgress);
    setProgress(updatedProgress);
    saveUserProgress(updatedProgress);
  }, []);

  // Keep vibration state in sync with settings
  useEffect(() => {
    setVibrationEnabled(settings.vibrationEnabled !== false);
  }, [settings.vibrationEnabled]);

  // Sync color palette with HTML root document style properties
  useEffect(() => {
    applyThemeGlobal(settings.colorPalette || 'sunshine');
  }, [settings.colorPalette, settings.darkMode]);

  // Sync English font style with HTML root document style properties
  useEffect(() => {
    applyEnglishFontGlobal(settings.englishFontStyle || 'fredoka');
  }, [settings.englishFontStyle]);

  // Update and persist settings
  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newSettings));
    } catch (err) {
      console.error('Failed to persist settings:', err);
    }
  };

  const handleUpdateAvatar = (avatarConfig: AvatarConfig) => {
    const updated = {
      ...progress,
      avatar: avatarConfig
    };
    setProgress(updated);
    saveUserProgress(updated);
  };



  // Callback when a child completes an item in a learning screen
  const handleCompleteLearningItem = (type: ScreenType, index: number) => {
    const result = completeLearningItem(progress, type, index);
    
    if (JSON.stringify(result.updatedProgress) !== JSON.stringify(progress)) {
      setProgress(result.updatedProgress);

      // Celebrate daily goal completion with confetti
      if (result.dailyGoalJustCompleted) {
        setShowGoalCompletionToast(true);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        setTimeout(() => setShowGoalCompletionToast(false), 4000);
      }

      // Celebrate any newly unlocked achievements
      if (result.newAchievementsUnlocked.length > 0) {
        setUnlockedAchievementsQueue(prev => [...prev, ...result.newAchievementsUnlocked]);
        confetti({
          particleCount: 150,
          spread: 80,
          colors: ['#FFD93D', '#FF6B6B', '#4D96FF', '#6BCB77'],
          origin: { y: 0.5 }
        });
      }
    }
  };

  // Callback when a quiz is completed
  const handleCompleteQuiz = (score: number, totalQuestions: number, category?: string) => {
    const isDailyChallenge = category === 'daily_challenge';
    const result = completeQuizProgress(progress, score, totalQuestions, isDailyChallenge);
    
    if (JSON.stringify(result.updatedProgress) !== JSON.stringify(progress)) {
      setProgress(result.updatedProgress);

      // Celebrate newly unlocked achievements
      if (result.newAchievementsUnlocked.length > 0) {
        setUnlockedAchievementsQueue(prev => [...prev, ...result.newAchievementsUnlocked]);
        confetti({
          particleCount: 150,
          spread: 80,
          colors: ['#FFD93D', '#FF6B6B', '#4D96FF', '#6BCB77'],
          origin: { y: 0.5 }
        });
      }
    }
  };

  // Start background music when enabled, or stop when disabled/leaving app
  useEffect(() => {
    if (settings.bgMusicEnabled && currentScreen === ScreenType.Home) {
      startBackgroundMusic(true);
    } else {
      stopBackgroundMusic();
    }
    return () => stopBackgroundMusic();
  }, [settings.bgMusicEnabled, currentScreen]);

  // Handle first gesture to unlock background audio context (browser security feature)
  useEffect(() => {
    const handleGesture = () => {
      if (settings.bgMusicEnabled && currentScreen === ScreenType.Home) {
        startBackgroundMusic(true);
      }
      window.removeEventListener('click', handleGesture);
    };
    window.addEventListener('click', handleGesture);
    return () => window.removeEventListener('click', handleGesture);
  }, [settings.bgMusicEnabled, currentScreen]);

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case ScreenType.Home:
        return (
          <HomeScreen 
            settings={settings} 
            progress={progress}
            unlockedAchievementsQueue={unlockedAchievementsQueue}
            onClearAchievementFromQueue={(id) => {
              setUnlockedAchievementsQueue(prev => prev.filter(x => x !== id));
            }}
            onSelectScreen={(screen, quizLang, category, initIndex) => {
              // Save Home Screen scroll position before leaving
              setSavedScrollY(window.scrollY);

              if (quizLang) setQuizLanguage(quizLang);
              setInitialQuizCategory(category);
              setInitialIndex(initIndex);

              // Push the state into the browser history
              window.history.pushState({ screen, activeTab, initIndex }, '');
              currentScreenRef.current = screen;
              setCurrentScreen(screen);
            }} 
            onUpdateAvatar={handleUpdateAvatar}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            savedScrollY={savedScrollY}
            onClearSavedScroll={() => setSavedScrollY(null)}
          />
        );
      
      case ScreenType.Settings:
        return (
          <SettingsScreen 
            settings={settings}
            progress={progress}
            onUpdateSettings={handleUpdateSettings}
            onBackToHome={handleBackToHome}
          />
        );
      
      case ScreenType.Quiz:
        return (
          <QuizSection 
            settings={settings}
            onBackToHome={handleBackToHome}
            onCompleteQuiz={handleCompleteQuiz}
            language={quizLanguage}
            initialCategory={initialQuizCategory}
          />
        );

      case ScreenType.WordMatching:
        return (
          <WordMatchingGame
            settings={settings}
            onBackToHome={handleBackToHome}
            onCompleteRound={(roundIndex) => handleCompleteLearningItem(ScreenType.WordMatching, roundIndex)}
            activeTab={activeTab}
          />
        );

      case ScreenType.InteractiveStories:
        return (
          <InteractiveStoriesScreen
            settings={settings}
            progress={progress}
            onCompleteItem={(idx) => handleCompleteLearningItem(ScreenType.InteractiveStories, idx)}
            onBackToHome={handleBackToHome}
          />
        );

      case ScreenType.InteractiveStoriesGuj:
        return (
          <InteractiveStoriesScreen
            settings={settings}
            progress={progress}
            onCompleteItem={(idx) => handleCompleteLearningItem(ScreenType.InteractiveStoriesGuj, idx)}
            onBackToHome={handleBackToHome}
            language="gu"
            screenType={ScreenType.InteractiveStoriesGuj}
          />
        );

      case ScreenType.Games:
        return (
          <GamesScreen
            settings={settings}
            onBackToHome={handleBackToHome}
            activeTab={activeTab}
          />
        );

      case ScreenType.TraceAlphabet:
        return (
          <TraceAlphabetScreen
            settings={settings}
            onBackToHome={handleBackToHome}
          />
        );

      // Any learning slideshow screens
      case ScreenType.EnglishABC:
      case ScreenType.EnglishABCLower:
      case ScreenType.EnglishWords:
      case ScreenType.EnglishNumbers:
      case ScreenType.EnglishSpellings:
      case ScreenType.GujaratiAlphabet:
      case ScreenType.GujaratiBarakhadi:
      case ScreenType.GujaratiNumbers:
      case ScreenType.GujaratiGhadiya:
      case ScreenType.EnglishTables:
        return (
          <LearningScreen 
            type={currentScreen}
            settings={settings}
            progress={progress}
            onCompleteItem={(idx) => handleCompleteLearningItem(currentScreen, idx)}
            onBackToHome={handleBackToHome}
            onUpdateSettings={handleUpdateSettings}
            initialIndex={initialIndex}
          />
        );

      case ScreenType.WeeklyProgress:
        return (
          <WeeklyProgressScreen
            settings={settings}
            progress={progress}
            onBackToHome={handleBackToHome}
          />
        );

      case ScreenType.AchievementsShelf:
        return (
          <AchievementsShelfScreen
            settings={settings}
            progress={progress}
            onBackToHome={handleBackToHome}
          />
        );

      default:
        return <div className="text-center p-12">Oops! Let's go home.</div>;
    }
  };

  return (
    <div 
      className="min-h-screen transition-all duration-500 ease-in-out font-sans relative"
      style={{
        background: 'var(--bg-gradient, var(--high-bg))',
        color: 'var(--high-ink)'
      }}
    >
      {renderActiveScreen()}

      {/* Daily Goal Completion Popup */}
      {showGoalCompletionToast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-[#6BCB77] border-4 border-high-ink text-white font-black py-4 px-8 rounded-3xl shadow-[0_8px_0_#2D3436] flex items-center gap-3 animate-bounce">
          <span className="text-3xl">🌟</span>
          <div>
            <h4 className="text-lg">DAILY GOAL COMPLETED!</h4>
            <p className="text-xs text-green-100 uppercase tracking-widest font-extrabold">You learned 5 or more items today! Awesome!</p>
          </div>
        </div>
      )}
    </div>
  );
}
