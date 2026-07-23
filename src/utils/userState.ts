import { AvatarConfig } from '../types';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  emoji: string;
  color: string;
  category: 'lessons' | 'quizzes' | 'streak' | 'general';
  requiredValue: number;
  targetCount: number;
  currentCount: (progress: UserProgress) => number;
}

export interface UserProgress {
  completedItems: Record<string, number[]>;
  completedQuizzes: number;
  perfectQuizzesCount?: number;
  dailyChallengeCompleted: boolean;
  streak: number;
  streakCount?: number;
  lastActiveDate: string;
  dailyHistory: Record<string, number>;
  unlockedAchievements: string[];
  avatar: AvatarConfig;
  dailyGoal: number;
  dailyGoalProgress: number;
  dailyGoalCompleted?: boolean;
  dailyQuizLastCompletedDate?: string;
  lastQuizResult?: {
    score: number;
    total: number;
    percentage: number;
    timestamp: number;
  };
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_step',
    title: 'First Step',
    description: 'Complete your first learning activity',
    icon: '🌟',
    emoji: '🌟',
    color: 'from-amber-400 to-yellow-500',
    category: 'lessons',
    requiredValue: 1,
    targetCount: 1,
    currentCount: (progress) => {
      let total = 0;
      Object.values(progress.completedItems || {}).forEach(arr => { if (arr) total += arr.length; });
      return total;
    }
  },
  {
    id: 'quiz_master_1',
    title: 'Quiz Novice',
    description: 'Complete 1 quiz with a score',
    icon: '🎯',
    emoji: '🎯',
    color: 'from-blue-400 to-indigo-500',
    category: 'quizzes',
    requiredValue: 1,
    targetCount: 1,
    currentCount: (progress) => progress.completedQuizzes || 0
  },
  {
    id: 'quiz_master_5',
    title: 'Quiz Master',
    description: 'Complete 5 quizzes',
    icon: '🏆',
    emoji: '🏆',
    color: 'from-purple-400 to-pink-500',
    category: 'quizzes',
    requiredValue: 5,
    targetCount: 5,
    currentCount: (progress) => progress.completedQuizzes || 0
  },
  {
    id: 'streak_3',
    title: '3-Day Streak',
    description: 'Learn 3 days in a row',
    icon: '🔥',
    emoji: '🔥',
    color: 'from-red-400 to-orange-500',
    category: 'streak',
    requiredValue: 3,
    targetCount: 3,
    currentCount: (progress) => progress.streak || 0
  },
  {
    id: 'streak_7',
    title: 'Super Learner',
    description: '7-day learning streak',
    icon: '⚡',
    emoji: '⚡',
    color: 'from-yellow-400 to-amber-500',
    category: 'streak',
    requiredValue: 7,
    targetCount: 7,
    currentCount: (progress) => progress.streak || 0
  },
  {
    id: 'lesson_10',
    title: 'Knowledge Seeker',
    description: 'Complete 10 learning items',
    icon: '📚',
    emoji: '📚',
    color: 'from-emerald-400 to-teal-500',
    category: 'lessons',
    requiredValue: 10,
    targetCount: 10,
    currentCount: (progress) => {
      let total = 0;
      Object.values(progress.completedItems || {}).forEach(arr => { if (arr) total += arr.length; });
      return total;
    }
  }
];

const PROGRESS_STORAGE_KEY = 'kids_learning_app_progress_v1';

export function getDefaultUserProgress(): UserProgress {
  return {
    completedItems: {},
    completedQuizzes: 0,
    dailyChallengeCompleted: false,
    streak: 1,
    lastActiveDate: new Date().toISOString().split('T')[0],
    dailyHistory: {
      [new Date().toISOString().split('T')[0]]: 0
    },
    unlockedAchievements: [],
    avatar: {
      playerName: 'Little Explorer',
      shape: 'squircle',
      bgColor: '#FF6B6B',
      emoji: '🦁',
      borderColor: '#FFD93D',
      borderStyle: 'solid'
    },
    dailyGoal: 5,
    dailyGoalProgress: 0
  };
}

export function loadUserProgress(): UserProgress {
  try {
    const data = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return {
        ...getDefaultUserProgress(),
        ...parsed
      };
    }
  } catch (err) {
    console.error('Error loading user progress:', err);
  }
  return getDefaultUserProgress();
}

export function saveUserProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.error('Error saving user progress:', err);
  }
}

export function updateStreak(progress: UserProgress): { updatedProgress: UserProgress } {
  const today = new Date().toISOString().split('T')[0];
  const lastActive = progress.lastActiveDate;

  let newStreak = progress.streak;
  if (lastActive !== today) {
    const lastDate = new Date(lastActive);
    const currDate = new Date(today);
    const diffTime = Math.abs(currDate.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      newStreak += 1;
    } else if (diffDays > 1) {
      newStreak = 1;
    }
  }

  const updatedProgress: UserProgress = {
    ...progress,
    streak: newStreak,
    lastActiveDate: today,
    dailyHistory: {
      ...progress.dailyHistory,
      [today]: progress.dailyHistory[today] || 0
    }
  };

  return { updatedProgress };
}

function checkAndUnlockAchievements(progress: UserProgress): { updatedProgress: UserProgress; newUnlocked: string[] } {
  const newUnlocked: string[] = [];
  const currentUnlocked = new Set(progress.unlockedAchievements || []);

  let totalCompletedLessons = 0;
  Object.values(progress.completedItems).forEach(arr => {
    if (arr) totalCompletedLessons += arr.length;
  });

  ACHIEVEMENTS.forEach(ach => {
    if (!currentUnlocked.has(ach.id)) {
      let isUnlocked = false;
      if (ach.category === 'lessons' && totalCompletedLessons >= ach.requiredValue) {
        isUnlocked = true;
      } else if (ach.category === 'quizzes' && progress.completedQuizzes >= ach.requiredValue) {
        isUnlocked = true;
      } else if (ach.category === 'streak' && progress.streak >= ach.requiredValue) {
        isUnlocked = true;
      }

      if (isUnlocked) {
        currentUnlocked.add(ach.id);
        newUnlocked.push(ach.id);
      }
    }
  });

  const updatedProgress: UserProgress = {
    ...progress,
    unlockedAchievements: Array.from(currentUnlocked)
  };

  return { updatedProgress, newUnlocked };
}

export function completeLearningItem(
  progress: UserProgress,
  type: string,
  index: number
): { updatedProgress: UserProgress; dailyGoalJustCompleted: boolean; newAchievementsUnlocked: string[] } {
  const today = new Date().toISOString().split('T')[0];
  const key = String(type);
  const existingIndices = progress.completedItems[key] || [];

  let isNewCompletion = false;
  let newIndices = existingIndices;
  if (!existingIndices.includes(index)) {
    isNewCompletion = true;
    newIndices = [...existingIndices, index];
  }

  const prevDailyCount = progress.dailyHistory[today] || 0;
  const newDailyCount = isNewCompletion ? prevDailyCount + 1 : prevDailyCount;

  const prevGoalProg = progress.dailyGoalProgress || 0;
  const newGoalProg = isNewCompletion ? prevGoalProg + 1 : prevGoalProg;
  const dailyGoalJustCompleted = prevGoalProg < progress.dailyGoal && newGoalProg >= progress.dailyGoal;

  const baseUpdated: UserProgress = {
    ...progress,
    completedItems: {
      ...progress.completedItems,
      [key]: newIndices
    },
    dailyHistory: {
      ...progress.dailyHistory,
      [today]: newDailyCount
    },
    dailyGoalProgress: newGoalProg
  };

  const { updatedProgress, newUnlocked } = checkAndUnlockAchievements(baseUpdated);
  saveUserProgress(updatedProgress);

  return {
    updatedProgress,
    dailyGoalJustCompleted,
    newAchievementsUnlocked: newUnlocked
  };
}

export function completeQuizProgress(
  progress: UserProgress,
  score: number,
  totalQuestions: number,
  isDailyChallenge?: boolean
): { updatedProgress: UserProgress; newAchievementsUnlocked: string[] } {
  const newCompletedQuizzes = progress.completedQuizzes + 1;
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  const isPerfect = percentage === 100;
  const newPerfectCount = (progress.perfectQuizzesCount || 0) + (isPerfect ? 1 : 0);

  const baseUpdated: UserProgress = {
    ...progress,
    completedQuizzes: newCompletedQuizzes,
    perfectQuizzesCount: newPerfectCount,
    dailyChallengeCompleted: isDailyChallenge ? true : progress.dailyChallengeCompleted,
    lastQuizResult: {
      score,
      total: totalQuestions,
      percentage,
      timestamp: Date.now()
    }
  };

  const { updatedProgress, newUnlocked } = checkAndUnlockAchievements(baseUpdated);
  saveUserProgress(updatedProgress);

  return {
    updatedProgress,
    newAchievementsUnlocked: newUnlocked
  };
}
