'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Partner from './../components/partner';
import { link } from 'fs';
export default function Home() {
  const services = [
    {
      title: 'Оффис цэвэрлэгээ',
      desc: 'Бидний найдвартай оффис цэвэрлэгээ таны ажлын орчинг цэвэр, эрүүл болгоно.',
      image: '/office.jpg', 
      link: '/service/office',   
    },
    {
      title: 'СӨХ цэвэрлэгээ',
      desc: 'Орон сууцны СӨХ-ийн нийтлэг талбайн цэвэрлэгээг мэргэжлийн түвшинд гүйцэтгэнэ.',
      image: '/ONT.jpg',
      link: '/service/suh',
    },
    {
      title: 'Олон нийтийн талбай',
      desc: 'Олон нийтийн талбайн цэвэрлэгээ, ажилбар, гадаргуу арчилгаа.',
      image: '/ОНТ.jpg',
      link: '/service             /public-space',
    },
  ];

  return (
    <main className="bg-white text-black relative font-sans">
      {/* Hero Section */}
      <section className="relative w-full min-h-screen">
        <img
          src="/home.png"
          alt="Cleaning Service"
          className="absolute inset-0 w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/10"></div>
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
     {/* Services Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900"
          >
            Бидний үйлчилгээ
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-10">
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -10 }} // Дээшээ бага зэрэг нүүх
                transition={{ duration: 0.3 }}
                className="relative group h-[450px] overflow-hidden rounded-3xl shadow-2xl cursor-pointer"
              >
                {/* Background Image */}
                <img
                  src={service.image}
                  alt={service.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Overlay - Эхлээд харанхуй, hover хийхэд илүү тодорно */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 group-hover:from-black/95"></div>

                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                  <h3 className="text-2xl font-bold mb-3 transition-transform duration-300 group-hover:-translate-y-2">
                    {service.title}
                  </h3>
                  
                  {/* Hover хийхэд гарч ирэх текст */}
                  <div className="max-h-0 opacity-0 overflow-hidden transition-all duration-500 group-hover:max-h-40 group-hover:opacity-100">
                    <p className="text-gray-200 text-sm md:text-base leading-relaxed mb-4">
                      {service.desc}
                    </p>
                    <Link href={service.link} className="inline-block text-emerald-400 font-semibold hover:underline">
                      Дэлгэрэнгүй ➔
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
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
            className="px-10 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white font-semibold shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            Захиалах
          </Link>
        </div>
      </section>
    </main>
  );
}
