"use client"

import React, { useState, useEffect } from "react";
import { Toast } from "../components/ui/toast"; // Toast компонентоо ийм замаар импортлоорой

export default function ContactPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    
    // Toast-д зориулсан шинэ state
    const [toast, setToast] = useState<{ title: string; description: string; variant: "success" | "error" | "default" } | null>(null);

    // Toast-ыг 3 секундын дараа автоматаар хаах эффект
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim() || !email.trim() || !message.trim()) {
            setToast({
                title: "Алдаа",
                description: "Бүх талбарыг бөглөнө үү.",
                variant: "error"
            });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setToast({
                title: "Алдаа",
                description: "Имэйл хаягийн формат буруу байна.",
                variant: "error"
            });
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("https://purenest-app.onrender.com/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, message }),
            });

            if (res.ok) {
                setToast({
                    title: "Амжилттай",
                    description: "Таны захиаг хүлээн авлаа. Баярлалаа!",
                    variant: "success"
                });
                setName("");
                setEmail("");
                setMessage("");
            } else {
                setToast({
                    title: "Амжилтгүй боллоо",
                    description: "Серверийн алдаа гарлаа. Дахин оролдоно уу.",
                    variant: "error"
                });
            }
        } catch (err) {
            setToast({
                title: "Сүлжээний алдаа",
                description: "Интернэт холболтоо шалгана уу.",
                variant: "error"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen px-4 py-16 bg-gray-50/50 text-black">
            {/* Toast-ыг дэлгэцийн хамгийн дээд хэсэгт байрлуулна */}
            {toast && (
                <Toast 
                    title={toast.title} 
                    description={toast.description} 
                    variant={toast.variant} 
                />
            )}

            <div className="max-w-6xl mx-auto">
                <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-[#102B5A]">Холбоо барих</h2>
                    <div className="w-20 h-1.5 bg-amber-400 mx-auto mt-4 rounded-full"></div> 
                    <p className="text-base md:text-lg mt-6 text-gray-600 leading-relaxed">
                        Асуулт, санал хүсэлт, эсвэл үйлчилгээний талаарх мэдээлэл авахыг хүсвэл доорх маягтыг бөглөнө үү.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Мэдээллийн хэсэг (Зүүн тал) */}
                    <div className="order-2 md:order-1 flex flex-col justify-between p-8 bg-[#102B5A] rounded-3xl shadow-2xl text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                        <div className="space-y-8 relative z-10">
                            <h3 className="text-3xl font-bold border-b border-amber-400/30 pb-4">Мэдээлэл</h3>
                            <div className="space-y-7">
                                <div className="flex items-start group">
                                    <div className="p-3 bg-amber-400/10 rounded-xl mr-4 group-hover:bg-amber-400/20 transition-colors">
                                        <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-amber-400/60 mb-1">Утас</p>
                                        <div className="flex flex-wrap gap-2 text-lg font-medium">
                                            <a href="tel:+97699069162" className="hover:text-amber-400 transition">+976 9906 9162</a>
                                            <span className="text-white/20">|</span>
                                            <a href="tel:+97690504700" className="hover:text-amber-400 transition">+976 9050 4700</a>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start group">
                                    <div className="p-3 bg-amber-400/10 rounded-xl mr-4 group-hover:bg-amber-400/20 transition-colors">
                                        <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.892 5.263A2 2 0 0012 14c.72 0 1.404-.263 1.992-.737L21 8m-2 4v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7"></path></svg>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-amber-400/60 mb-1">Имэйл</p>
                                        <p onClick={() => {navigator.clipboard.writeText("sale@purenest.mn"); alert("Хууллаа!");}} className="text-lg font-medium cursor-pointer hover:text-amber-400 transition-colors">sale@purenest.mn</p>
                                    </div>
                                </div>

                                <div className="flex items-start group">
                                    <div className="p-3 bg-amber-400/10 rounded-xl mr-4 group-hover:bg-amber-400/20 transition-colors">
                                        <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-amber-400/60 mb-1">Байршил</p>
                                        <p className="text-lg font-medium leading-snug">Хан-Уул дүүрэг, 3-р хороо,<br/>Чингисийн өргөн чөлөө, Анун төв</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 pt-6 border-t border-white/10 relative z-10">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <p className="text-sm font-medium text-gray-300">Ажлын цаг: 09:00 - 18:00 (Өдөр бүр)</p>
                            </div>
                        </div>
                    </div>

                    {/* Форм (Баруун тал) */}
                    <div className="order-1 md:order-2 bg-white p-8 md:p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100">
                        <h3 className="text-3xl font-bold text-gray-800 mb-8">Захиа илгээх</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-600 ml-1">Нэр</label>
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 outline-none rounded-2xl p-4 transition-all"
                                    placeholder="Таны нэр"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-600 ml-1">Имэйл</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 outline-none rounded-2xl p-4 transition-all"
                                    placeholder="name@example.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-600 ml-1">Сэтгэгдэл / Асуулт</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 outline-none rounded-2xl p-4 min-h-[160px] transition-all resize-none"
                                    placeholder="Энд бичнэ үү..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#102B5A] text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-blue-900/20 hover:bg-[#1a3f7a] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Илгээж байна...
                                    </>
                                ) : "Захиа илгээх"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Газрын зураг */}
                <div className="mt-16 p-2 bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
                    <div className="w-full h-[450px] rounded-[1.8rem] overflow-hidden grayscale-[0.3] hover:grayscale-0 transition-all duration-700">
                        <iframe
                            title="anun-center-location"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d2675.762194954005!2d106.88428437637841!3d47.897519886286766!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNDfCsDUzJzUxLjEiTiAxMDbCsDUzJzEyLjciRQ!5e0!3m2!1smn!2smn!4v1715600000000!5m2!1smn!2smn"/>
                    </div>
                </div>
            </div>
        </div>
    );
}