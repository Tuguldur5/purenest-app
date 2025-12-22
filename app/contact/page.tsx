"use client"

import React, { useState } from "react";

export default function ContactPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<null | { ok: boolean; text: string }>(null);

    // Replace these placeholders with your real company info
    const COMPANY_EMAIL = "info@purenest.mn";
    const COMPANY_PHONE = "+976 12345678";
    const COMPANY_ADDRESS = "Баянгол дүүрэг, Улаанбаатар, Монгол Баянгол дүүрэг, Улаанбаатар, Монгол";

    // Example map coordinates (Ulaanbaatar center). Replace with your lat/lng.
    const MAP_LAT = 47.9181;
    const MAP_LNG = 106.9170;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus(null);

        // 1. Утга байгаа эсэхийг шалгах
        if (!name.trim() || !email.trim() || !message.trim()) {
            setStatus({ ok: false, text: "Бүх талбарыг бөглөнө үү." });
            return;
        }

        // 2. 📧 Имэйл форматыг шалгах (Нэмэлт сайжруулалт)
        // Энэ Regex нь энгийн имэйл форматыг шалгадаг.
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setStatus({ ok: false, text: "Имэйл хаягийн формат буруу байна." });
            return;
        }

        setLoading(true);
        try {
            // POST to your backend API
            const res = await fetch("http://localhost:4000/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, message }),
            });

            if (res.ok) {
                // 3. ✅ Амжилттай хариу
                setStatus({ ok: true, text: "Таны захиаг хүлээн авлаа. Баярлалаа!" });
                setName("");
                setEmail("");
                setMessage("");
            } else {
                // 4. ❌ Бек-эндээс алдаа ирсэн
                const contentType = res.headers.get("content-type");
                let errorText = "Серверийн алдаа. Дахин оролдоно уу.";

                if (contentType && contentType.includes("application/json")) {
                    // Хэрэв JSON хариу ирсэн бол, алдааг нь гаргаж авна
                    const err = await res.json().catch(() => ({}));
                    errorText = err.error || errorText;
                } else {
                    // Хэрэв JSON бус алдаа (жишээ нь, 404, 500 HTML) ирсэн бол
                    console.error(`Бек-эндээс JSON бус алдаа ирлээ. Статус: ${res.status}`);
                    errorText = `Хүсэлт амжилтгүй боллоо (Статус: ${res.status}).`;
                }

                // 💡 Хэрэглэгчид алдааг харуулна
                setStatus({ ok: false, text: errorText });
            }
        } catch (err) {
            // 5. 🛑 Сүлжээний (Fetch) алдаа
            console.error("Fetch/Сүлжээний алдаа:", err); // Алдааг консолд хэвлэж байна
            setStatus({ ok: false, text: "Сүлжээний алдаа. Интернэтээ шалгана уу." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-16">
            <div className="max-w-6xl mx-auto text-black rounded-[18px] shadow-2xl p-6 md:p-10 bg-white border border-gray-100">
                <h2 className="text-4xl font-bold text-[#102B5A] mb-4 text-center">
                    Холбоо Барих
                </h2>
                <p className="text-gray-600 mb-12 text-center max-w-2xl mx-auto">
                    Асуулт, санал хүсэлт, эсвэл үйлчилгээний талаарх мэдээлэл авахыг хүсвэл доорх маягтыг бөглөнө үү.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                    {/* 1. RIGHT: Quick Contact Info (Зүүн талын хэсэг - БОДИТ УТГУУД) */}
                    <div className="order-2 md:order-1 max-h-130 flex flex-col justify-between p-6 bg-[#102B5A] rounded-xl shadow-inner text-white">
                        <div className="space-y-8">
                            <h3 className="text-3xl font-bold border-b border-amber-400 pb-3">Мэдээлэл</h3>

                            {/* Contact Items */}
                            <div className="space-y-6">
                                {/* Утас */}
                                <div className="flex items-start">
                                    <svg className="w-6 h-6 mr-3 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                    <div>
                                        <p className="text-sm font-light text-gray-300">Утас</p>
                                        {/* {COMPANY_PHONE}-ийг бодит утгаар солив */}
                                        <p className="text-lg font-medium hover:text-amber-400 transition-colors">+976 7711 7711</p>
                                    </div>
                                </div>

                                {/* Имэйл */}
                                <div className="flex items-start">
                                    <svg className="w-6 h-6 mr-3 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.892 5.263A2 2 0 0012 14c.72 0 1.404-.263 1.992-.737L21 8m-2 4v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7"></path></svg>
                                    <div>
                                        <p className="text-sm font-light text-gray-300">Имэйлээр холбогдох</p>
                                        {/* {COMPANY_EMAIL}-ийг бодит утгаар солив */}
                                        <p className="text-lg font-medium hover:text-amber-400 transition-colors">info@example.mn</p>
                                    </div>
                                </div>

                                {/* Байршил */}
                                <div className="flex items-start">
                                    <svg className="w-6 h-6 mr-3 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                    <div>
                                        <p className="text-sm font-light text-gray-300">Байршил</p>
                                        {/* {COMPANY_ADDRESS}-ийг бодит утгаар солив */}
                                        <p className="text-lg font-medium">Улаанбаатар, Сүхбаатарын талбай 9</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Ажлын цаг */}
                        <div className="mt-8 pt-4 border-t border-gray-600">
                            <p className="text-sm font-medium text-amber-400">Ажлын цаг:</p>
                            <p className="text-sm text-gray-300">Даваа - Баасан 09:00 - 18:00</p>
                        </div>
                    </div>

                    {/* 2. LEFT: Contact Form (Баруун талын хэсэг - LOGIC-ИЙГ ХЭВЭЭР ҮЛДЭЭВ) */}
                    <div className="order-1 md:order-2 bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100">
                        <h3 className="text-3xl font-bold text-gray-800 mb-6">Захиа илгээх</h3>

                        {/* Form - (Backend/State Logic хэвээр) */}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm mb-1">Нэр</label>
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full border border-black/20 hover:shadow-lg rounded p-2"
                                    placeholder="Таны нэр"
                                />
                            </div>

                            <div>
                                <label className="block text-sm mb-1">Имэйл</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border border-black/20 hover:shadow-lg rounded p-2"
                                    placeholder="name@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm mb-1">Сэтгэгдэл / Асуулт</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full border border-black/20 hover:shadow-lg rounded p-2 min-h-40"
                                    placeholder="Сэтгэгдэлээ бичнэ үү..."
                                />
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#102B5A] text-white p-3 rounded ] disabled:opacity-60 hover:text-amber-400 transition-colors"
                                >
                                    {loading ? "Илгээж байна..." : "Илгээх"}
                                </button>
                            </div>

                            {status && (
                                <p className={`text-sm pt-2 ${status.ok ? 'text-green-600' : 'text-red-600'}`}>{status.text}</p>
                            )}
                        </form>
                    </div>
                </div>

                {/* 3. BOTTOM: Google Map (Газрын зураг - БОДИТ УТГУУД) */}
                <div className="mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
                    <h3 className="text-2xl font-bold text-center text-gray-800 mb-4">Манай Байршил (Газрын зураг)</h3>
                    <div className="w-full" style={{ height: '400px' }}>
                        {/* MAP_LAT/MAP_LNG-ийг бодит утгаар солив */}
                        <iframe
                            title="company-map"
                            width="100%"
                            height="100%"
                            style={{ border: 0, borderRadius: '10px' }}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            src={`https://maps.google.com/maps?q=47.918,106.918&z=15&output=embed`}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}

/*
  --- Backend example (Next.js API route or Express) ---
  This is a sample Node.js + Nodemailer handler you can put at /api/contact.

  // pages/api/contact.ts (Next.js) or /api/contact (Express)

  import nodemailer from 'nodemailer';

  export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    const { name, email, message } = req.body || {};
    if (!name || !email || !message) return res.status(400).json({ error: 'Missing fields' });

    // Configure transporter (use env vars)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `Website <${process.env.SMTP_USER}>`,
      to: process.env.COMPANY_MAIL || 'info@your-company.mn',
      subject: `Шинэ холбоо барих захиа — ${name}`,
      text: `Нэр: ${name}\nИмэйл: ${email}\n\n${message}`,
      html: `<p><strong>Нэр:</strong> ${name}</p><p><strong>Имэйл:</strong> ${email}</p><p>${message}</p>`
    };

    try {
      await transporter.sendMail(mailOptions);
      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to send email' });
    }
  }

  --- Notes ---
  • Use environment variables for SMTP credentials (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, COMPANY_MAIL).
  • If deploying to Vercel, configure environment variables in the project settings.
*/
