'use client';
import React, { useEffect, useState } from 'react';

export default function UltimateBubbleLoader() {
  const [bubbles, setBubbles] = useState<{ id: number; left: string; size: string; delay: string; duration: string }[]>([]);

  useEffect(() => {
    // Client-side дээр бөмбөлгүүдийг үүсгэж Turbopack/Next.js hydration алдаанаас сэргийлнэ
    const newBubbles = [...Array(15)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 30 + 20}px`,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 3 + 4}s`,
    }));
    setBubbles(newBubbles);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white overflow-hidden">
      
      {/* 1. МУШГИРДАГ АЛЧУУРНЫ ХЭСЭГ */}
      <div className="relative w-64 h-40 flex flex-col items-center justify-center z-20">
        <div className="animate-towel-wring relative drop-shadow-2xl">
          <svg width="180" height="100" viewBox="0 0 180 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M30 40C30 30 50 35 90 50C130 65 150 70 150 60V45C150 35 130 40 90 55C50 70 30 65 30 55V40Z" 
              fill="#102B5A" 
              stroke="#081A38" 
              strokeWidth="2"
              className="animate-morph"
            />
            {/* Мушгианы шугамууд */}
            <g opacity="0.4">
              <path d="M75 48C85 52 95 60 105 65" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <path d="M70 55C80 58 90 65 100 68" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </g>
          </svg>
        </div>

        {/* Алчуурнаас дусах дусал */}
        <div className="absolute top-[60%] w-full flex justify-center">
            <div className="w-1.5 h-4 bg-blue-400 rounded-full opacity-0 animate-leak" />
        </div>
      </div>

      {/* 2. ТЕКСТ ХЭСЭГ */}
      <div className="z-20 text-center mt-4">
        <h1 className="text-[#102B5A] text-4xl font-black tracking-widest animate-pulse">PURENEST</h1>
        <p className="text-blue-500 font-bold mt-1 uppercase tracking-[0.3em] text-[10px]">Цэвэр цэмцгэр байдал</p>
      </div>

      {/* 3. САВАНГИЙН БӨӨРӨНХИЙ БӨМБӨЛГҮҮД */}
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="absolute bottom-[-60px] rounded-full animate-bubble pointer-events-none"
          style={{
            left: bubble.left,
            width: bubble.size,
            height: bubble.size,
            animationDelay: bubble.delay,
            animationDuration: bubble.duration,
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, rgba(173,216,230,0.4) 50%, rgba(135,206,250,0.1) 100%)',
            boxShadow: 'inset -2px -2px 6px rgba(255,255,255,0.4), 0 4px 10px rgba(0,0,0,0.05)',
            border: '1px solid rgba(255,255,255,0.3)',
            backdropFilter: 'blur(1px)',
          }}
        >
          {/* Бөмбөлөг дээрх гялбаа */}
          <div className="absolute top-1/4 left-1/4 w-1/4 h-1/4 bg-white/60 rounded-full filter blur-[1px]" />
        </div>
      ))}

      <style jsx>{`
        @keyframes towel-wring {
          0%, 100% { transform: scale(1.05) rotate(-2deg); }
          50% { transform: scale(0.92, 0.85) rotate(2deg); }
        }
        @keyframes morph {
          0%, 100% { d: path("M30 40C30 30 50 35 90 50C130 65 150 70 150 60V45C150 35 130 40 90 55C50 70 30 65 30 55V40Z"); }
          50% { d: path("M35 50C35 45 60 48 90 50C120 52 145 55 145 60V50C145 45 120 48 90 50C60 52 35 55 35 60V50Z"); }
        }
        @keyframes leak {
          0% { transform: translateY(0) scaleY(0.5); opacity: 0; }
          20% { opacity: 1; transform: translateY(5px) scaleY(1.2); }
          100% { transform: translateY(40px) scaleY(0.8); opacity: 0; }
        }
        @keyframes bubble {
          0% { transform: translateY(0) scale(0.8) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-110vh) scale(1.2) rotate(20deg); opacity: 0; }
        }
        .animate-towel-wring { animation: towel-wring 2s ease-in-out infinite; }
        .animate-morph { animation: morph 2s ease-in-out infinite; }
        .animate-leak { animation: leak 1.5s infinite linear; }
        .animate-bubble { animation: bubble infinite ease-in; }
      `}</style>
    </div>
  );
}