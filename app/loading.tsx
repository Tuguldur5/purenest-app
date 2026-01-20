'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function LuxuryBubbleLoader() {
  const [bubbles, setBubbles] = useState<{ id: number; left: string; size: string; delay: string; duration: string }[]>([]);

  useEffect(() => {
    // Хамгийн анхны кодон дээрх санамсаргүй бөмбөлөг үүсгэх логик
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
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white overflow-hidden">
      
      {/* 1. Зөөлөн гэрлийн эффект (Background Glow) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-50 rounded-full blur-[100px]" />

      {/* 2. Төв хэсэг: Цэвэрлэгээний эффект */}
      <div className="relative mb-10 z-20">
        {/* Эргэлдэх цагираг */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="w-32 h-32 border-t-2 border-b-2 border-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.2)]"
        />
        
        {/* Гялалзах одод (Sparkles) */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 1, 0], 
              scale: [0.5, 1.2, 0.5],
              x: Math.random() * 120 - 60,
              y: Math.random() * 120 - 60 
            }}
            transition={{ 
              duration: 2.5, 
              repeat: Infinity, 
              delay: i * 0.6 
            }}
            className="absolute top-1/2 left-1/2 text-blue-400"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
            </svg>
          </motion.div>
        ))}

        {/* Төв икон: Усны дусал */}
        <div className="absolute inset-0 flex items-center justify-center text-[#102B5A]">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="currentColor" fillOpacity="0.05" />
            </svg>
          </motion.div>
        </div>
      </div>

      {/* 3. Текст хэсэг: PureNest */}
      <div className="text-center relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-[#102B5A] text-4xl md:text-5xl font-black tracking-[0.2em] mb-3 uppercase">
            Pure<span className="text-blue-500">nest</span>
          </h1>
           
          <div className="flex items-center justify-center gap-4">
            <p className="text-blue-500 font-bold mt-1 uppercase tracking-[0.3em] text-[12px]">Цэвэр цэмцгэр байдал</p>
          </div>
        </motion.div>
      </div>

      {/* 4. АРД ТАЛЫН БӨМБӨЛГҮҮД (Таны өгсөн хамгийн анхны код) */}
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="absolute bottom-[-60px] rounded-full animate-bubble pointer-events-none z-10"
          style={{
            left: bubble.left,
            width: bubble.size,
            height: bubble.size,
            animationDelay: bubble.delay,
            animationDuration: bubble.duration,
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9) 0%, rgba(173,216,230,0.3) 60%, rgba(135,206,250,0.1) 100%)',
            boxShadow: 'inset -2px -2px 6px rgba(255,255,255,0.5), 0 4px 10px rgba(0,0,0,0.02)',
            border: '0.5px solid rgba(255,255,255,0.4)',
            backdropFilter: 'blur(1px)',
          }}
        ></div>
      ))}

      <style jsx>{`
        /* Хамгийн анхны кодон дээрх бөмбөлөг дээшлэх анимэйшн */
        @keyframes bubble {
          0% { 
            transform: translateY(0) scale(0.7); 
            opacity: 0; 
          }
          10% { 
            opacity: 0.7; 
          }
          100% { 
            transform: translateY(-115vh) scale(1.2); 
            opacity: 0; 
          }
        }

        .animate-bubble { 
          animation: bubble infinite ease-in; 
        }
      `}</style>
    </div>
  );
}