'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')
    const [step, setStep] = useState(1) 
    const router = useRouter()
    // 1. OTP илгээх функц
    const handleSendOTP = async () => {
        try {
            const res = await fetch('http://localhost:4000/api/auth/forgot-password', { // 4000 порт нэмэв
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (res.ok) {
                setStep(2);
            } else {
                const data = await res.json();
                alert(data.message || 'Алдаа гарлаа');
            }
        } catch (error) {
            console.error("Fetch error:", error);
            alert('Сервертэй холбогдож чадсангүй (Backend ассан уу?)');
        }
    };

    // 2. OTP шалгах функц
    const handleVerifyOTP = async () => {
        const res = await fetch('http://localhost:4000/api/auth/verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp })
        })
        if (res.ok) {
            // Код зөв бол шинэ нууц үг үүсгэх хуудас руу и-мэйлийг нь дамжуулж шилжинэ
            router.push(`/new-password?email=${email}`)
        } else {
            alert('Буруу код байна')
        }
    }

    return (
        <section className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-md w-full items-center text-black border border-black/5 shadow-md p-10 rounded-2xl">
            <h2 className="text-2xl font-semibold mb-4 text-center text-[#102B5A]">
                {step === 1 ? 'Нууц үгээ мартсан' : 'Код баталгаажуулах'}
            </h2>

            {step === 1 ? (
                <>
                    <input
                        placeholder="И-мэйл"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border p-2 rounded mb-3"
                    />
                    <button
                        className="btn-primary p-2 rounded-lg mt-3 w-full bg-[#102B5A] text-white"
                        onClick={handleSendOTP}
                    >
                        OTP код илгээх
                    </button>
                </>
            ) : (
                <>
                    <p className="text-sm mb-2 text-gray-500">{email} хаягт ирсэн кодыг оруулна уу.</p>
                    <input
                        placeholder="OTP код"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full border p-2 rounded mb-3"
                    />
                    <button
                        className="btn-primary p-2 rounded-lg mt-3 w-full bg-[#102B5A] text-white"
                        onClick={handleVerifyOTP}
                    >
                        Үргэлжлүүлэх
                    </button>
                    <button onClick={() => setStep(1)} className="text-sm text-gray-400 mt-2 block w-full text-center">Буцах</button>
                </>
            )}

            <p className="mt-3 text-center">
                <Link href="/login" className="hover-mustard text-[#102B5A]">Нэвтрэх</Link>
            </p>
        </section>
    )
}