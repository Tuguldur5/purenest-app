'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Partner from './../components/partner';
import { link } from 'fs';

import BubbleBackground from '../components/BubbleBackground';
import { Building2, Home as HomeIcon, Users, ArrowRight } from 'lucide-react';


export default function Home() {
  const services = [
    {
      title: 'Оффис цэвэрлэгээ',
      desc: 'Бидний найдвартай оффис цэвэрлэгээ таны ажлын орчинг цэвэр, эрүүл болгоно.',
      icon: Building2, // Оффис икон
      link: '/service/office',
      color: 'hover:bg-blue-600'
    },
    {
      title: 'СӨХ цэвэрлэгээ',
      desc: 'Орон сууцны СӨХ-ийн нийтлэг талбайн цэвэрлэгээг мэргэжлийн түвшинд гүйцэтгэнэ.',
      icon: HomeIcon, // Гэр икон
      link: '/service/suh',
      color: 'hover:bg-emerald-600'
    },
    {
      title: 'Олон нийтийн талбай',
      desc: 'Олон нийтийн талбайн цэвэрлэгээ, ажилбар, гадаргуу арчилгаа.',
      icon: Users, // Хүмүүс икон
      link: '/service/public-space',
      color: 'hover:bg-indigo-600'
    },
  ];

  return (
    <main className="bg-white text-black relative font-sans">
      <section className="relative w-full h-screen min-h-[750px] flex items-center justify-center overflow-hidden">

        <div className="absolute inset-0 z-0">
          {/* Үндсэн Gradient дэвсгэр */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#102b5a] via-[#112d4e] to-[#064e3b] opacity-90" />

          {/* Гэрлийн тусгал эффектүүд (Blobs) */}
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/20 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-[130px]" />

          {/* Нарийн торон эффект (Grid pattern) */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        </div>

        <BubbleBackground />

        {/* Hero Content - Center Aligned Glassmorphism */}
        <div className="relative z-20 container mx-auto px-6 text-center">

          <h1 className="text-3xl md:text-6xl font-black text-white leading-tight mb-2">
            Тавтай морилно уу<br />
            <span className="text-amber-300">PURENEST</span>
          </h1>

          <p className="text-gray-200 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            Бид таны цаг завыг хэмнэж, амьдрах орчинг тань гэрэлтүүлнэ.
            Мэргэжлийн түвшинд гүйцэтгэх цогц шийдэл.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/booking"
              className="group relative px-12 py-5 bg-emerald-500 hover:bg-emerald-400 text-white hover:text-[#102b5a] font-black rounded-2xl transition-all duration-300 shadow-[0_20px_50px_rgba(16,_185,_129,_0.3)] flex items-center gap-3 overflow-hidden"
            >
              <span className="relative z-10">Одоо Захиалах</span>
              <ArrowRight size={20} className="relative z-10 group-hover:translate-x-2 transition-transform" />
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
            </Link>

          </div>

        </div>
        {/* Hero section-ий хамгийн доор байрлуулна */}
        <div className="absolute -bottom-[1px] left-0 w-full overflow-hidden leading-[0] z-10">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative block w-full h-[60px] fill-white"
          >
            <path d="M600,112.77C268.63,112.77,0,65.52,0,7.23V120H1200V7.23C1200,65.52,931.37,112.77,600,112.77Z"></path>
          </svg>
        </div>
      </section>
      <BubbleBackground />
      {/* Services Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900"
          >
            Бидний үйлчилгээ
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, idx) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={`group relative p-8 bg-white rounded-[14px] shadow-md border border-gray-100 transition-all duration-500 overflow-hidden cursor-pointer ${service.color} hover:shadow-xl hover:-translate-y-2`}
                >

                  <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full transition-all duration-500 group-hover:scale-150" />


                  <div className="relative z-10 w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-8 transition-colors duration-500 group-hover:bg-white/20">
                    <Icon
                      size={32}
                      className="text-gray-700 transition-colors duration-500 group-hover:text-white"
                    />
                  </div>

                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-4 text-gray-900 transition-colors duration-500 group-hover:text-white">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-8 leading-relaxed transition-colors duration-500 group-hover:text-white/90">
                      {service.desc}
                    </p>

                    <Link
                      href={service.link}
                      className="inline-flex items-center font-semibold text-gray-900 transition-colors duration-500 group-hover:text-white group-hover:gap-3"
                    >
                      Дэлгэрэнгүй
                      <ArrowRight size={18} className="ml-2 transition-transform duration-300" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="bg-gradient-to-r from-amber-200 to-amber-300 py-20">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#102b5a] mb-4 drop-shadow-md">
            Цэвэрлэгээгээ одоо захиалаарай
          </h2>
          <p className="text-gray-700 mb-8 text-lg md:text-xl">
            Таны цагийг хэмнэх орчноо цэвэр байлгах хамгийн хялбар арга
          </p>
          <Link
            href="/booking"
            className="px-10 py-4 rounded-[14px] bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white font-semibold shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            Захиалах
          </Link>
        </div>
       
      </section>
     <BubbleBackground />
    </main >
  );
}