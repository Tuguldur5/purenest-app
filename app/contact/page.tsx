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

        if (!name.trim() || !email.trim() || !message.trim()) {
            setStatus({ ok: false, text: "Бүх талбарыг бөглөнө үү." });
            return;
        }

        setLoading(true);
        try {
            // POST to your backend API that will send the email to company mailbox
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, message }),
            });

            if (res.ok) {
                setStatus({ ok: true, text: "Таны захиаг хүлээн авлаа. Баярлалаа!" });
                setName("");
                setEmail("");
                setMessage("");
            } else {
                const err = await res.json().catch(() => ({}));
                setStatus({ ok: false, text: err.error || "Серверийн алдаа. Дахин оролдоно уу." });
            }
        } catch (err) {
            setStatus({ ok: false, text: "Сүлжээний алдаа. Интернэтээ шалгана уу." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto text-black">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* LEFT: Company summary / contact quick info */}
                    <div className="bg-white p-6 rounded-2xl shadow">
                        <h1 className="text-2xl text-center font-semibold mb-4">Захиа илгээх</h1>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm mb-1">Нэр</label>
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full border rounded p-2"
                                    placeholder="Таны нэр"
                                />
                            </div>

                            <div>
                                <label className="block text-sm mb-1">Имэйл</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border rounded p-2"
                                    placeholder="name@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm mb-1">Сэтгэгдэл / Асуулт</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full border rounded p-2 min-h-40"
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
                     <div className="bg-white p-4 rounded-2xl shadow">
                    <h2 className="text-lg font-semibold mb-3">Бидний байршил</h2>
                    <div className="w-full h-150 ">
                        {/* Google Maps iframe — replace lat/lng or use your own embed link */}
                        <iframe
                            title="company-map"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            src={`https://www.google.com/maps?q=${MAP_LAT},${MAP_LNG}&z=15&output=embed`}
                        />
                    </div>
                </div>
                    

                    
                </div>
                {/* Bottom: Map */}
               <div className="bg-white p-6 rounded-2xl shadow">
                        <h2 className="text-2xl font-semibold mb-3">Холбоо барих</h2>
                        <p className="text-gray-700 mb-4">
                            Манай компанитай холбогдох хүсэлтэй бол доорх маягтыг бөглөн илгээнэ үү. Бид 1-3 ажлын хоногийн дотор хариу өгөх болно.
                        </p>

                        <div className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                <div className="bg-white p-4 border border-black/5 rounded-lg shadow text-center hover:shadow-lg transition-shadow ">
                                    <p className="text-sm text-gray-500">Имэйлээр холбогдох</p>
                                    <p className="font-medium mt-2">{COMPANY_EMAIL}</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg  border border-black/5 shadow text-center hover:shadow-lg transition-shadow">
                                    <p className="text-sm text-gray-500">Утас</p>
                                    <p className="font-medium mt-2">{COMPANY_PHONE}</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg  border border-black/5 shadow text-center hover:shadow-lg transition-shadow">
                                    <p className="text-sm text-gray-500">Байршил</p>
                                    <p className="font-medium mt-2">{COMPANY_ADDRESS}</p>
                                </div>
                            </div>

                            <hr className="my-6" />

                            <p className="text-xm text-center text-gray-500">Манай ажлын цаг: Даваа - Баасан 09:00 - 18:00</p>
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
