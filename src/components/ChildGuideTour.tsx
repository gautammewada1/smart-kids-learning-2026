import React from 'react';
import { AppSettings } from '../types';

interface ChildGuideTourProps {
  settings: AppSettings;
  onClose: () => void;
}

export default function ChildGuideTour({ settings, onClose }: ChildGuideTourProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-sm w-full text-center flex flex-col items-center gap-4">
        <span className="text-6xl">🦁</span>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Welcome Little Explorer!</h2>
        <p className="text-slate-600 dark:text-slate-300">Tap on any activity to start learning ABCs, Numbers, Stories, and fun games!</p>
        <button
          onClick={onClose}
          className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl shadow-lg transition-colors"
        >
          Let's Start!
        </button>
      </div>
    </div>
  );
}
