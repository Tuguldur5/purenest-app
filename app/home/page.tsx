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
      {/* Hero Section */}
      <section className="relative w-full min-h-screen justify-center items-center flex overflow-hidden">
        <img
          src="/home.png"
          alt="Cleaning Service"
          className="absolute inset-0 w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/10">
          <BubbleBackground />
        </div>
        <div className="relative z-10 flex flex-col justify-center items-center h-full text-center py-50 px-4">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-4">
            Тавтай морилно уу — <span className="text-amber-300">Purenest</span>
          </h1>
          <p className="text-lg md:text-2xl text-white drop-shadow-md mb-6 max-w-2xl">
            Бидний найдвартай цэвэрлэгээ үйлчилгээ таны <strong>Оффис</strong>, <strong>СӨХ</strong> болон <strong>Олон нийтийн талбай</strong>-г цэвэр, эрүүл болгоно.
          </p>
          <Link href="/booking" className="mt-6 max-w-150 px-10 py-4 rounded-[14px] bg-emerald-400 hover:bg-emerald-500 text-white text-lg font-semibold transition-all duration-300">
            Захиалга өгөх
          </Link>
        </div>
      </section>
      
      {/* Services Section */}
      <section className="py-24 bg-gray-50">
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
                className={`group relative p-8 bg-white rounded-[14px] shadow-sm border border-gray-100 transition-all duration-500 overflow-hidden cursor-pointer ${service.color} hover:shadow-xl hover:-translate-y-2`}
              >
                {/* Hover Background Decor (optional) */}
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full transition-all duration-500 group-hover:scale-150" />

                {/* Icon Container */}
                <div className="relative z-10 w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-8 transition-colors duration-500 group-hover:bg-white/20">
                  <Icon 
                    size={32} 
                    className="text-gray-700 transition-colors duration-500 group-hover:text-white" 
                  />
                </div>

                {/* Content */}
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
    </main>
  );
}