import React from 'react';

export interface ChikuMascotProps {
  message?: string;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  lang?: string;
  soundEnabled?: boolean;
  context?: string;
  moduleName?: string;
  className?: string;
}

export default function ChikuMascot({ message, onClick, className = '' }: ChikuMascotProps) {
  return (
    <div onClick={onClick} className={`flex items-center gap-3 cursor-pointer group ${className}`}>
      <div className="w-14 h-14 bg-amber-400 rounded-full flex items-center justify-center text-3xl shadow-md border-2 border-white group-hover:scale-110 transition-transform">
        🦁
      </div>
      {message && (
        <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-2xl shadow border border-amber-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-semibold text-sm">
          {message}
        </div>
      )}
    </div>
  );
}
