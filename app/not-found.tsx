"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BubbleBackground from './components/BubbleBackground';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 overflow-hidden relative">
      
      {/* Background Bubbles Component */}
      <BubbleBackground />

      <div className="max-w-md w-full text-center relative z-10">
        
        {/* 1. 404 Header - Minimal & Clean */}
        <div className="mb-6">
          <h1 className="text-9xl font-extrabold text-[#102B5A] tracking-tighter leading-none opacity-90">
            404
          </h1>
          <div className="h-1 w-12 bg-blue-500 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* 2. Content - Typography-г илүү эмх цэгцтэй болгосон */}
        <div className="mb-10 px-4">
          <h2 className="text-2xl font-bold text-slate-800 mb-3 tracking-tight">
            Хуудас олдсонгүй
          </h2>
          <p className="text-slate-500 text-base font-medium leading-relaxed">
            Уучлаарай, таны хайсан хуудас байхгүй байна. <br />
            Бид энэ хэсгийг гялалзтал нь цэвэрлэж байна.
          </p>
        </div>

        {/* 3. Buttons - Илүү цэвэрхэн, орчин үеийн (Rounded) */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link
            href="/"
            className="w-full sm:w-auto px-10 py-3.5 bg-[#102B5A] text-white text-sm font-semibold rounded-full hover:bg-blue-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
          >
            Нүүр хуудас
          </Link>
          <button
            onClick={() => router.back()}
            className="w-full sm:w-auto px-10 py-3.5 bg-white text-[#102B5A] text-sm font-semibold rounded-full border border-slate-200 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-300 active:scale-95"
          >
            Буцах
          </button>
        </div>

      </div>
    </div>
  );
}