"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FAQPage() {
    const router = useRouter();
    const [showAll, setShowAll] = useState(false); // Бүгдийг харуулах эсэхийг хянах
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqData = [
        { q: "Та бүхэн ямар үйлчилгээ үзүүлдэг вэ?", a: "Гэр, СӨХ, Олон нийтийн талбайн ерөнхий болон гүн цэвэрлэгээний үйлчилгээ үзүүлдэг." },
        { q: "Цэвэрлэгээний үнэ хэрхэн тооцогдох вэ?", a: "Талбайн хэмжээ, бохирдол болон үйлчилгээний төрөлд үндэслэн үнэ тогтооно." },
        { q: "Баталгаат үйлчилгээтэй юу?", a: "Тийм, үйлчилгээндээ 100% сэтгэл ханамжийн баталгаа өгдөг." },
        { q: "Бэлэн мөнгөөр төлж болох уу?", a: "Тийм, бэлэн мөнгө болон дижитал төлбөрийн бүх төрлийг хүлээн авна." },
        { q: "Цэвэрлэгээний хугацаа хэр удаан үргэлжлэх вэ?", a: "Талбайн хэмжээнээс хамаарч дунджаар 3-8 цаг үргэлжилнэ." },
        { q: "Ажлын өдрүүдэд ажиллах уу?", a: "Бид 7 хоногийн бүх өдөр 09:00 - 20:00 цагийн хооронд ажилладаг." },
    ];

    // Хэрэв showAll худал бол эхний 3-ыг, үнэн бол бүгдийг нь харуулна
    const displayedFaqs = showAll ? faqData : faqData.slice(0, 3);

    const toggleFAQ = (index: number) => setOpenIndex(openIndex === index ? null : index);

    return (
        <section className="max-w-5xl mx-auto px-6 py-14 text-black font-sans">
            <h2 className="text-4xl font-bold text-center mb-10 text-[#102B5A]">Түгээмэл асуултууд</h2>

            <div className="space-y-4 max-w-5xl mx-auto">
                {displayedFaqs.map((item, index) => (
                    <div 
                        key={index} 
                        className={`border border-black/5 rounded-2xl p-6 transition-all duration-300 ${
                            openIndex === index ? 'bg-white shadow-md' : 'bg-gray-50 hover:bg-white hover:shadow-sm'
                        }`}
                    >
                        <button
                            onClick={() => toggleFAQ(index)}
                            className="w-full text-left text-lg font-semibold flex justify-between items-center text-slate-800"
                        >
                            <span className="pr-8">{item.q}</span>
                            <span className={`transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-indigo-500' : 'text-slate-400'}`}>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </span>
                        </button>
                        
                        <div className={`grid transition-all duration-300 ease-in-out ${
                            openIndex === index ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'
                        }`}>
                            <div className="overflow-hidden">
                                <p className="text-slate-600 leading-relaxed border-t border-slate-100 pt-4 text-sm md:text-base">
                                    {item.a}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* БҮГДИЙГ ХАРАХ ТОВЧЛУУР */}
            <div className="mt-12 text-center">
                <button
                    onClick={() => setShowAll(!showAll)}
                    className="group inline-flex items-center gap-2 px-8 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-full hover:bg-[#102B5A] hover:text-white hover:border-[#102B5A] transition-all duration-300 shadow-sm"
                >
                    {showAll ? "Цөөн харах" : "Бүх асуултыг харах"}
                    <svg 
                        className={`w-4 h-4 transition-transform duration-300 ${showAll ? 'rotate-180' : 'group-hover:translate-y-1'}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-lg text-center mt-10 ">
                {/* Толгой хэсэг */}
                <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                </div>

                <h2 className="text-2xl font-semibold text-gray-900 mb-2 tracking-tight">Тусламж хэрэгтэй юу?</h2>
                <p className="text-sm text-gray-400 font-normal mb-6 leading-relaxed">
                    Танд асуух зүйл гарвал манай дэмжлэгийн баг туслахад бэлэн байна.
                </p>

                {/* Холбоо барих мэдээлэл */}
                <div className="md:grid md:grid-cols-3 mb-6 gap-4">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600 font-normal border border-black/5 shadow-md rounded-xl py-2 px-4">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span>sales@purenest.mn</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600 font-normal border border-black/5 shadow-md rounded-xl py-2 px-4">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>+976 9999-9999</span>
                    </div>
                    <button
                    onClick={() => router.push('/contact')}
                    className="w-full py-3 px-4 bg-gray-900 text-white text-sm font-normal rounded-xl hover:bg-indigo-600 transition-all duration-300 shadow-sm shadow-gray-200"
                >
                    Холбоо барих хуудас руу
                </button>
                </div>

                {/* Үйлдэл хийх товчлуур */}
                
            </div>
        </section>
    );
}
