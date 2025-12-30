'use client';
import React, { useEffect, useState } from 'react';

export default function GlassBubbleLoader() {
  const [bubbles, setBubbles] = useState<{ id: number; left: string; size: string; delay: string; duration: string }[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const newBubbles = [...Array(15)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 30 + 20}px`,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 3 + 4}s`,
    }));
    setBubbles(newBubbles);

    // Жишээ: 3 секундын дараа алга болох эффект (Раутинг дуусахад setIsVisible(false) болгоно)
    // const timer = setTimeout(() => setIsVisible(false), 3000);
    // return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center 
      bg-white/40 backdrop-blur-xs transition-all duration-700 ease-in-out
      ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'}`}>
      
      {/* 1. МУШГИРДАГ АЛЧУУРНЫ ХЭСЭГ */}
      <div className="relative w-64 h-40 flex flex-col items-center justify-center z-20">
        <div className="animate-towel-wring relative drop-shadow-xl">
          <svg width="180" height="100" viewBox="0 0 180 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M30 40C30 30 50 35 90 50C130 65 150 70 150 60V45C150 35 130 40 90 55C50 70 30 65 30 55V40Z" 
              fill="#102B5A" 
              stroke="#081A38" 
              strokeWidth="2"
              className="animate-morph"
            />
            <g opacity="0.4">
              <path d="M75 48C85 52 95 60 105 65" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <path d="M70 55C80 58 90 65 100 68" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </g>
          </svg>
        </div>

        {/* Алчуурнаас дусах дусал */}
        <div className="absolute top-[60%] w-full flex pl-1 justify-center gap-3">
            <div className="w-1.5 h-4 bg-blue-500 rounded-full opacity-0 animate-leak" />
            <div className="w-1.5 h-4 bg-blue-500 rounded-full opacity-0 animate-leak [animation-delay:0.5s]" />
            <div className="w-1.5 h-4 bg-blue-500 rounded-full opacity-0 animate-leak [animation-delay:1s]" />
        </div>
      </div>

      {/* 2. ТЕКСТ ХЭСЭГ */}
      <div className="z-20 text-center mt-2">
        <h1 className="text-[#102B5A] text-2xl font-bold tracking-widest animate-pulse">
          Түр хүлээнэ үү...
        </h1>
      </div>

      {/* 3. САВАНГИЙН БӨМБӨЛГҮҮД */}
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
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.7) 0%, rgba(173,216,230,0.3) 50%, rgba(135,206,250,0.1) 100%)',
            boxShadow: 'inset -1px -1px 4px rgba(255,255,255,0.5)',
            border: '0.5px solid rgba(255,255,255,0.4)',
          }}
        >
          <div className="absolute top-1/4 left-1/4 w-1/4 h-1/4 bg-white/40 rounded-full filter blur-[1px]" />
        </div>
      ))}

      <style jsx>{`
        @keyframes towel-wring {
          0%, 100% { transform: scale(1) rotate(-2deg); }
          50% { transform: scale(0.9, 0.8) rotate(2deg); }
        }
        @keyframes morph {
          0%, 100% { d: path("M30 40C30 30 50 35 90 50C130 65 150 70 150 60V45C150 35 130 40 90 55C50 70 30 65 30 55V40Z"); }
          50% { d: path("M35 50C35 45 60 48 90 50C120 52 145 55 145 60V50C145 45 120 48 90 50C60 52 35 55 35 60V50Z"); }
        }
        @keyframes leak {
          0% { transform: translateY(0) scaleY(0.5); opacity: 0; }
          20% { opacity: 1; transform: translateY(5px) scaleY(1.2); }
          100% { transform: translateY(60px) scaleY(0.8); opacity: 0; }
        }
        @keyframes bubble {
          0% { transform: translateY(0) scale(0.8); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-110vh) scale(1.5); opacity: 0; }
        }
        .animate-towel-wring { animation: towel-wring 2s ease-in-out infinite; }
        .animate-morph { animation: morph 2s ease-in-out infinite; }
        .animate-leak { animation: leak 1.2s infinite ease-in; }
        .animate-bubble { animation: bubble infinite linear; }
      `}</style>
    </div>
  );
}