"use client";
import React, { useEffect, useState } from 'react';

export default function BubbleBackground() {
  const [bubbles, setBubbles] = useState<{ id: number; left: string; size: string; delay: string; duration: string }[]>([]);

  useEffect(() => {
    const newBubbles = [...Array(15)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 40 + 20}px`,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 6 + 4}s`,
    }));
    setBubbles(newBubbles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="absolute bottom-[-60px] rounded-full animate-bubble"
          style={{
            left: bubble.left,
            width: bubble.size,
            height: bubble.size,
            animationDelay: bubble.delay,
            animationDuration: bubble.duration,
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.7) 0%, rgba(173,216,230,0.3) 50%, rgba(135,206,250,0.1) 100%)',
            boxShadow: 'inset -1px -1px 4px rgba(255,255,255,0.5)',
            border: '0.5px solid rgba(255,255,255,0.4)',
          }}
        >
          <div className="absolute top-1/4 left-1/4 w-1/4 h-1/4 bg-white/40 rounded-full filter blur-[1px]" />
        </div>
      ))}
      <style jsx global>{`
        @keyframes bubble {
          0% { transform: translateY(0) scale(0.8); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-110vh) scale(1.5); opacity: 0; }
        }
        .animate-bubble { animation: bubble infinite linear; }
      `}</style>
    </div>
  );
}