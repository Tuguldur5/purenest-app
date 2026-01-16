"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Home, Sparkle } from 'lucide-react';
import BubbleBackground from './components/BubbleBackground';

export default function NotFound() {
  const router = useRouter();

  const goToHome = () => router.push('/');
  const goBack = () => router.back();

  return (
    <div className="fixed inset-0 z-[9999] min-h-screen bg-white flex items-center justify-center px-6 overflow-hidden">
      
      {/* Таны өмнөх BubbleBackground-ийг энд хэвээр нь үлдээлээ */}
      <BubbleBackground />

      <div className="max-w-2xl w-full text-center relative z-10">
        
        {/* 1. Creative 404 Section */}
        <div className="relative mb-6 inline-block">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-[12rem] md:text-[16rem] font-black text-[#102B5A] leading-none tracking-tighter select-none">
              404
            </h1>
          </motion.div>
          
          {/* Гялалздаг оч - Цэвэрлэгээний эффект */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5] 
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-10 right-0 text-blue-400"
          >
            <Sparkle size={48} fill="currentColor" />
          </motion.div>
        </div>

        {/* 2. Текст хэсэг - Илүү цэгцтэй */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="space-y-4 mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-slate-800 tracking-tight">
            Төгс цэвэрлэгээний үр дүн.
          </h2>
          <div className="h-1.5 w-24 bg-blue-500 mx-auto rounded-full mb-6"></div>
          <p className="text-slate-500 text-lg md:text-xl font-medium max-w-lg mx-auto leading-relaxed">
            Уучлаарай, бид энэ хуудсыг хэтэрхий сайн цэвэрлэчихжээ. 
            Таны хайсан мэдээлэл энд алга байна.
          </p>
        </motion.div>

        {/* 3. Товчнууд - Дугуй бөгөөд "Clean" загвар */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={goToHome}
            className="group flex items-center gap-3 px-10 py-4 bg-[#102B5A] text-white text-base font-bold rounded-full hover:bg-blue-800 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(16,43,90,0.3)] active:scale-95"
          >
            <Home size={20} />
            Нүүр хуудас руу
          </button>
          
          <button
            onClick={goBack}
            className="group flex items-center gap-3 px-10 py-4 bg-white text-[#102B5A] text-base font-bold rounded-full border-2 border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-300 active:scale-95"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Буцаад хайх
          </button>
        </motion.div>
      </div>
    </div>
  );
}