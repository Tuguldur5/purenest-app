'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSiteToast } from '../hooks/useSiteToast'

export default function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState(1) // 1: Email, 2: OTP
    const [timer, setTimer] = useState(60)
    const [canResend, setCanResend] = useState(false)
    
    const router = useRouter()
    const { showToast } = useSiteToast()

    // Таймер логик
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (step === 2 && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    const handleSendOTP = async () => {
        if (!email) {
            showToast({ title: "Алдаа", description: "И-мэйл хаягаа оруулна уу.", variant: "error" });
            return;
        }

        setLoading(true);
        try {
            // Backend-д хүсэлт илгээх (Энэ endpoint нь цаанаа User table-ээс и-мэйл шалгадаг байх ёстой)
            const res = await fetch('https://purenest-app.onrender.com/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            if (res.ok) {
                setStep(2);
                setTimer(60);
                setCanResend(false);
                showToast({ title: "Амжилттай", description: "OTP код таны и-мэйл рүү илгээгдлээ." });
            } else {
                // Backend-ээс "User not found" эсвэл "Email does not exist" гэж ирвэл:
                showToast({ 
                    title: "Алдаа", 
                    description: data.message || "Энэ и-мэйл хаяг бүртгэлгүй байна.", 
                    variant: "error" 
                });
            }
        } catch (error) {
            showToast({ title: "Алдаа", description: "Сервертэй холбогдож чадсангүй.", variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        setLoading(true);
        try {
            const res = await fetch('https://purenest-app.onrender.com/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp })
            });
            if (res.ok) {
                router.push(`/new-password?email=${email}`);
            } else {
                showToast({ title: "Алдаа", description: "Баталгаажуулах код буруу эсвэл хугацаа нь дууссан байна.", variant: "error" });
            }
        } catch (error) {
            showToast({ title: "Алдаа", description: "Хүсэлт илгээхэд алдаа гарлаа.", variant: "error" });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <section className="max-w-md w-full bg-white border border-gray-100 shadow-2xl p-10 rounded-[24px] transition-all">
                <div className="mb-5 text-center">
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                        {step === 1 ? 'Нууц үг сэргээх' : 'Код баталгаажуулах'}
                    </h2>
                </div>

                <div className="space-y-3">
                    {step === 1 ? (
                        <>
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">И-мэйл хаяг</label>
                                <input
                                    placeholder="example@mail.com"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border border-gray-200 p-4 rounded-xl outline-none transition-all focus:border-[#102B5A] focus:ring-4 focus:ring-indigo-500/5 text-slate-900 placeholder:text-slate-300"
                                />
                            </div>
                            <button
                                disabled={loading || !email}
                                onClick={handleSendOTP}
                                className="w-full bg-[#102B5A] text-white p-4 rounded-xl font-bold hover:bg-[#1a3d7a] transition-all shadow-lg shadow-indigo-900/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : "Код илгээх"}
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="space-y-2 text-center">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">6 оронтой код</label>
                                <input
                                    placeholder="000000"
                                    type="text"
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full border border-gray-200 p-4 rounded-xl text-center text-3xl tracking-[12px] font-black outline-none focus:border-[#102B5A] focus:ring-4 focus:ring-indigo-500/5 text-slate-900"
                                />
                            </div>
                            
                            <button
                                disabled={loading || otp.length < 4}
                                onClick={handleVerifyOTP}
                                className="w-full bg-[#102B5A] text-white p-4 rounded-xl font-bold hover:bg-[#1a3d7a] transition-all shadow-lg shadow-indigo-900/10"
                            >
                                {loading ? "Шалгаж байна..." : "Баталгаажуулах"}
                            </button>

                            <div className="text-center pt-2">
                                {canResend ? (
                                    <button 
                                        onClick={handleSendOTP}
                                        className="text-sm font-bold text-[#102B5A] hover:text-indigo-800 transition-colors"
                                    >
                                        Код дахин илгээх
                                    </button>
                                ) : (
                                    <div className="flex items-center justify-center gap-2 text-xs text-slate-400 bg-slate-50 py-2 rounded-lg">
                                        <span>Дахин код илгээх:</span>
                                        <span className="text-[#102B5A] font-bold tabular-nums">{timer}с</span>
                                    </div>
                                )}
                            </div>

                            <button 
                                onClick={() => setStep(1)} 
                                className="text-xs text-slate-400 hover:text-slate-600 block w-full text-center mt-2 transition-colors font-medium"
                            >
                                ← И-мэйл хаяг өөрчлөх
                            </button>
                        </>
                    )}
                </div>

                <div className="mt-10 text-center border-t border-slate-50 pt-8">
                    <Link href="/login" className="text-sm font-bold text-slate-400 hover:text-[#102B5A] transition-all flex items-center justify-center gap-2">
                        Нэвтрэх хэсэг рүү буцах
                    </Link>
                </div>
            </section>
        </div>
    )
}