'use client';

import ServiceCard from '../components/ServiceCard';
import Link from 'next/link';

export default function Home() {
  const services = [
    {
      title: 'Оффис цэвэрлэгээ',
      desc: 'Бидний найдвартай оффис цэвэрлэгээ таны ажлын орчинг цэвэр, эрүүл болгоно.',
      included: ["Шал угаах / шүүрдэх", "Ширээ, тавилга цэвэрлэх", "Компьютер, тоног төхөөрөмж цэвэрлэх"],
      extras: ["Хөргөгч, шүүгээ дотор цэвэрлэх", "Нүүж орох / гарах цэвэрлэгээ"],
      excluded: ["11.3 кг-аас хүнд зүйл өргөх", "Гадаах экстерьер цэвэрлэгээ"],
    },
    {
      title: 'СӨХ цэвэрлэгээ',
      desc: 'Орон сууцны СӨХ-ийн нийтлэг талбайн цэвэрлэгээ.',
      included: ["Коридор, шатны шал цэвэрлэх", "Суудал, тавилга тоос арчих", "Ширээ, сандал арчих"],
      extras: ["Хивс / шалыг нэмэлт цэвэрлэх"],
      excluded: ["Био-аюултай бохирдол", "Том арга хэмжээний дараах их цэвэрлэгээ"],
    },
    {
      title: 'Олон нийтийн талбай',
      desc: 'Олон нийтийн талбайн цэвэрлэгээ, ажилбар, гадаргуу.',
      included: ["Шал, гадаргуу цэвэрлэх", "Тоног төхөөрөмж арчих", "Цонх, хаалга арчих"],
      extras: ["Нэмэлт тоног төхөөрөмж цэвэрлэх"],
      excluded: ["Барилгын дараах их цэвэрлэгээ", "Hoarding нөхцөлтэй байшин"],
    },
  ];

  return (
    <main className="bg-gray-50 text-black relative font-sans">
      {/* Hero Section */}
      <section className="relative w-full min-h-screen">
        <img
          src="/home.png"
          alt="Cleaning Service"
          className="absolute inset-0 w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/10"></div>
        <div className="relative z-10 flex flex-col justify-center items-center h-full text-center py-50 px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg mb-4">
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
      <section className="container mx-auto px-6 py-20  mt-10 mb-10 relative z-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
          Бидний үйлчилгээ
        </h2>
        <div className="grid md:grid-cols-3 gap-8 ">
          {services.map((service, idx) => (
            <ServiceCard 
              key={idx}
              title={service.title}
              desc={service.desc}
              included={service.included}
              extras={service.extras}
              excluded={service.excluded}
            />
          ))}
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
