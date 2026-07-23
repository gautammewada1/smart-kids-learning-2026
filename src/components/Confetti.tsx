import React, { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  angle: number;
  delay: number;
}

export default function Confetti() {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    const colors = ['#FF4136', '#FF851B', '#FFDC00', '#2ECC40', '#0074D9', '#B10DC9', '#FF41C8', '#39CCCC'];
    const totalPieces = 80;
    const generatedPieces: ConfettiPiece[] = Array.from({ length: totalPieces }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage width
      y: -20 - Math.random() * 20, // start above screen
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 12 + 8, // size in px
      angle: Math.random() * 360,
      delay: Math.random() * 1.5 // staggered falling delay
    }));
    
    setPieces(generatedPieces);

    // Clean up after 4.5 seconds
    const timer = setTimeout(() => {
      setPieces([]);
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  if (pieces.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute rounded-sm animate-fall"
          style={{
            left: `${piece.x}%`,
            width: `${piece.size}px`,
            height: `${piece.size * 1.4}px`,
            backgroundColor: piece.color,
            opacity: 0.9,
            transform: `rotate(${piece.angle}deg)`,
            animation: `fall 3s linear infinite`,
            animationDelay: `${piece.delay}s`,
            top: `${piece.y}px`
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(0px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
