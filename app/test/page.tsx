"use clinet"
import React from 'react';
import { Calendar, CheckCircle2, ArrowRight, Building2, Home, TreePine } from 'lucide-react';

const CleaningServiceHero = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-white font-sans">
      {/* 1. Background Layer (Цэвэрлэгээний ажил хийж байгаа зураг) */}
      <div 
        className="absolute inset-0 w-full h-full z-0 bg-cover bg-right md:bg-center"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1581578731548-c64695cc6958?auto=format&fit=crop&q=80')" 
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* 2. Текстэн талбар - Custom Blue (#102b5a) */}
      <div 
        className="relative z-10 h-full w-full md:w-[60%] flex flex-col justify-center px-6 md:px-20 text-white
                   [clip-path:polygon(0_0,_100%_0,_85%_50%,_100%_100%,_0_100%)]"
        style={{ backgroundColor: '#102b5a' }}
      >
        <div className="max-w-xl">
          {/* Badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="h-[2px] w-8 bg-amber-400"></span>
            <span className="text-amber-400 font-bold tracking-widest text-sm uppercase">Мэргэжлийн цэвэрлэгээ</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6">
            Тав тухтай орчинг <br /> 
            <span className="text-amber-400">Бид цогцлооно</span>
          </h1>
          
          <p className="text-gray-200 text-lg mb-8 max-w-md">
            Оффис, орон сууц болон нийтийн эзэмшлийн талбайн цэвэрлэгээг 
            мэргэжлийн түвшинд, хамгийн богино хугацаанд гүйцэтгэнэ.
          </p>

          {/* Үйлчилгээний төрлүүд (Icons) */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            <div className="flex flex-col items-center p-3 bg-white/5 rounded-lg border border-white/10">
              <Building2 className="text-amber-400 mb-2" size={24} />
              <span className="text-xs font-semibold">Оффис</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-white/5 rounded-lg border border-white/10">
              <Home className="text-amber-400 mb-2" size={24} />
              <span className="text-xs font-semibold">Орон сууц</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-white/5 rounded-lg border border-white/10">
              <TreePine className="text-amber-400 mb-2" size={24} />
              <span className="text-xs font-semibold">Нийтийн талбай</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <button className="flex items-center gap-3 px-8 py-4 bg-amber-400 hover:bg-amber-500 text-[#102b5a] font-bold rounded-full transition-all shadow-xl">
              <Calendar size={20} />
              ЗАХИАЛГА ӨГӨХ
            </button>
            
            <button className="flex items-center gap-2 px-8 py-4 border-2 border-white/30 hover:border-white text-white font-bold rounded-full transition-all">
              ҮНИЙН САНАЛ
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* Давуу талууд */}
        <div className="absolute bottom-10 left-6 md:left-20 flex flex-wrap gap-6">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <CheckCircle2 size={16} className="text-amber-400" />
            Эрүүл ахуйн баталгаа
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <CheckCircle2 size={16} className="text-amber-400" />
            Мэргэжлийн хамт олон
          </div>
        </div>
      </div>
    </div>
  );
};

export default CleaningServiceHero;