import React from 'react';
import { AvatarConfig } from '../types';

interface AvatarPreviewProps {
  avatar?: AvatarConfig;
  config?: AvatarConfig;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
}

const DEFAULT_AVATAR: AvatarConfig = {
  playerName: 'Little Explorer',
  shape: 'circle',
  bgColor: 'bg-[#FFD93D]',
  emoji: '🦁',
  borderColor: 'border-[#2D3436]',
  borderStyle: 'solid'
};

export default function AvatarPreview({ avatar, config, size = 'md', onClick }: AvatarPreviewProps) {
  const activeAvatar = config || avatar || DEFAULT_AVATAR;

  const sizeClasses: Record<string, string> = {
    sm: 'w-10 h-10 text-xl',
    md: 'w-16 h-16 text-3xl',
    lg: 'w-20 h-20 text-4xl',
    xl: 'w-28 h-28 text-6xl'
  };

  const selectedSizeClass = sizeClasses[size] || sizeClasses.md;

  const shapeClasses: Record<string, string> = {
    circle: 'rounded-full',
    squircle: 'rounded-2xl',
    flower: 'rounded-[38%]',
    hexagon: 'rounded-xl rotate-3',
    shield: 'rounded-t-2xl rounded-b-[2rem]',
    star: 'rounded-[30%]'
  };

  const selectedShapeClass = shapeClasses[activeAvatar.shape || 'circle'] || 'rounded-full';

  // Determine background styling:
  const rawBg = activeAvatar.bgColor || 'bg-[#FFD93D]';
  const isBgClass = rawBg.startsWith('bg-') || rawBg.startsWith('from-');
  const bgStyle = !isBgClass ? { backgroundColor: rawBg } : {};
  const bgClassName = isBgClass ? rawBg : '';

  // Determine border color styling:
  const rawBorder = activeAvatar.borderColor || 'border-[#2D3436]';
  const isBorderClass = rawBorder.startsWith('border-');
  const borderStyleColor = !isBorderClass ? { borderColor: rawBorder } : {};
  const borderClassName = isBorderClass ? rawBorder : '';

  // Determine border style:
  const styleBorderStyle = activeAvatar.borderStyle || 'solid';

  return (
    <div
      onClick={onClick}
      style={{
        ...bgStyle,
        ...borderStyleColor,
        borderStyle: styleBorderStyle
      }}
      className={`${selectedSizeClass} ${selectedShapeClass} ${bgClassName} ${borderClassName} border-4 flex items-center justify-center shadow-lg cursor-pointer transform hover:scale-105 transition-transform overflow-hidden relative select-none`}
    >
      <span>{activeAvatar.emoji || '🦁'}</span>
    </div>
  );
}
