"use client";
import { useState } from "react";

export default function FAQPage() {
    const faqData = [
        {
            q: "Та бүхэн ямар үйлчилгээ үзүүлдэг вэ?",
            a: "Гэр, СӨХ, Олон нийтийн талбайн ерөнхий болон гүн цэвэрлэгээний үйлчилгээ үзүүлдэг.",
        },
        {
            q: "Цэвэрлэгээний үнэ хэрхэн тооцогдох вэ?",
            a: "Талбайн хэмжээ, бохирдол болон үйлчилгээний төрөлд үндэслэн үнэ тогтооно.",
        },
        {
            q: "Баталгаат үйлчилгээтэй юу?",
            a: "Тийм, үйлчилгээндээ 100% сэтгэл ханамжийн баталгаа өгдөг.",
        },
        {
            q: "Бэлэн мөнгөөр төлж болох уу?",
            a: "Тийм, бэлэн мөнгө болон дижитал төлбөрийн бүх төрлийг хүлээн авна.",
        },
    ];

    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) =>
        setOpenIndex(openIndex === index ? null : index);

    return (
        <section className="max-w-3xl mx-auto px-6 py-14 text-black">
            <h2 className="text-4xl font-bold text-center mb-10 text-[#102B5A]">Түгээмэл асуултууд</h2>

            <div className="space-y-4">
                {faqData.map((item, index) => (
                    <div key={index} className="border rounded-lg p-5 bg-white shadow-sm">
                        <button
                            onClick={() => toggleFAQ(index)}
                            className="w-full text-left text-lg font-semibold flex justify-between items-center"
                        >
                            {item.q}
                            <span className="text-[#102B5A]">
                                {openIndex === index ? "−" : "+"}
                            </span>
                        </button>
                        {openIndex === index && (
                            <p className="mt-3 text-gray-700 leading-relaxed">{item.a}</p>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
