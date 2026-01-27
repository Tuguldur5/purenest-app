"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Бөмбөлөг бүрийн төрөл
interface Bubble {
  id: string; // number биш string (Unique ID)
}

const SingleBubble = ({ id, onComplete }: { id: string, onComplete: (id: string) => void }) => {
  const [isPopped, setIsPopped] = useState(false);
  const [config, setConfig] = useState<{ 
    left: string, size: number, duration: number, popY: number, delay: number 
  } | null>(null);

  useEffect(() => {
    setConfig({
      left: `${Math.random() * 100}%`,
      size: Math.random() * 25 + 15,
      duration: Math.random() * 3 + 4, // 4-7 сек
      popY: Math.random() * 70 + 5,   // 5vh-ээс 75vh хооронд хагарна
      delay: Math.random() * 2,
    });
  }, []);

  const handlePop = useCallback(() => {
    if (isPopped) return;
    setIsPopped(true);
    setTimeout(() => onComplete(id), 600);
  }, [id, onComplete, isPopped]);

  if (!config) return null;

  return (
    <AnimatePresence>
      {!isPopped ? (
        <motion.div
          key={id}
          initial={{ y: "110vh", opacity: 0 }}
          animate={{ y: `${config.popY}vh`, opacity: 1 }}
          transition={{ duration: config.duration, delay: config.delay, ease: "linear" }}
          onAnimationComplete={handlePop}
          onMouseEnter={handlePop}
          className="absolute rounded-full pointer-events-auto cursor-pointer"
          style={{
            left: config.left,
            width: config.size,
            height: config.size,
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, rgba(173,216,230,0.1) 50%, transparent 100%)',
            boxShadow: 'inset -1px -1px 2px rgba(255,255,255,0.2)',
            border: '0.5px solid rgba(255,255,255,0.15)',
            backdropFilter: 'blur(0.5px)',
          }}
        >
           <div className="absolute top-1/4 left-1/4 w-1/4 h-1/4 bg-white/20 rounded-full" />
        </motion.div>
      ) : (
        // --- ЦАЦРАХ ЭФФЕКТ ---
        <div className="absolute" style={{ left: config.left, top: `${config.popY}vh` }}>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`splash-${id}-${i}`} // Сүрхий Unique Key
              initial={{ x: 0, y: 0, opacity: 1 }}
              animate={{ 
                x: Math.cos(i * 45) * 50, 
                y: Math.sin(i * 45) * 50 + 20, 
                opacity: 0,
              }}
              transition={{ duration: 0.5 }}
              className="absolute w-1 h-1 bg-white/50 rounded-full"
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

export default function BubbleBackground() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  // Эхлээд 15 бөмбөлөг үүсгэх
  useEffect(() => {
    const initialBubbles = Array.from({ length: 15 }, () => ({
      id: Math.random().toString(36).substr(2, 9)
    }));
    setBubbles(initialBubbles);
  }, []);

  const resetBubble = useCallback((id: string) => {
    setBubbles(prev => {
      // Хагарсан бөмбөлөгийг устгаж, шинэ Unique ID-тай бөмбөлөг нэмэх
      const filtered = prev.filter(b => b.id !== id);
      return [...filtered, { id: Math.random().toString(36).substr(2, 9) }];
    });
  }, []);

  return (
    <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
      {bubbles.map((bubble) => (
        <SingleBubble 
          key={bubble.id} // Энэ key маш чухал!
          id={bubble.id} 
          onComplete={resetBubble} 
        />
      ))}
    </div>
  );
}