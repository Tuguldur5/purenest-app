'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSiteToast } from '../hooks/useSiteToast'

function ResetPasswordForm() {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const { showToast } = useSiteToast()
    
    const email = searchParams.get('email')

    // 🛡️ Хэрэв и-мэйл байхгүй бол энэ хуудас руу шууд хандах боломжгүй болгох
    useEffect(() => {
        if (!email) {
            showToast({ 
                title: "Хандах эрхгүй", 
                description: "Эхлээд баталгаажуулах кодоо оруулна уу.",
                variant: "error" 
            })
            router.replace('/forgot-password') // Шууд буцаах
        }
    }, [email, router, showToast])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            showToast({ title: "Анхаар!", description: "Нууц үг хоорондоо таарахгүй байна!", variant: "error" })
            return
        }

        // Нууц үгний аюулгүй байдлыг шалгах (Optional)
        if (password.length < 8) {
            showToast({ title: "Алдаа", description: "Нууц үг хамгийн багадаа 8 тэмдэгт байх ёстой.", variant: "error" })
            return
        }

        setLoading(true)
        try {
            const res = await fetch('https://purenest-app.onrender.com/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email: decodeURIComponent(email!), 
                    password: password 
                })
            })

            const data = await res.json()

            if (res.ok) {
                showToast({ title: "Амжилттай", description: "Нууц үг амжилттай шинэчлэгдлээ. Та нэвтэрч орно уу." })
                router.push('/login')
            } else {
                showToast({ title: "Алдаа", description: data.message || "Нууц үг шинэчлэхэд алдаа гарлаа.", variant: "error" })
            }
        } catch (err) {
            showToast({ title: "Сүлжээний алдаа", description: "Сервертэй холбогдож чадсангүй.", variant: "error" })
        } finally {
            setLoading(false)
        }
    }

    if (!email) return null; // Email байхгүй үед формыг харуулахгүй

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <section className="max-w-md w-full bg-white border border-gray-100 shadow-2xl p-10 rounded-[24px]">
                <div className="mb-8 text-center">
                    <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-[#102B5A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Шинэ нууц үг</h2>
                    <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                         <span className="text-[#102B5A] font-medium">{email}</span> хаягт зориулсан шинэ нууц үгээ оруулна уу.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Шинэ нууц үг</label>
                        <input 
                            type="password" 
                            required
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            className="w-full border border-gray-200 p-4 rounded-xl outline-none transition-all focus:border-[#102B5A] focus:ring-4 focus:ring-indigo-500/5 text-slate-900 placeholder:text-slate-300"
                            placeholder="********"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Нууц үг давтах</label>
                        <input 
                            type="password" 
                            required
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            className="w-full border border-gray-200 p-4 rounded-xl outline-none transition-all focus:border-[#102B5A] focus:ring-4 focus:ring-indigo-500/5 text-slate-900 placeholder:text-slate-300"
                            placeholder="********"
                        />
                    </div>

                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#102B5A] text-white p-4 rounded-xl font-bold hover:bg-[#1a3d7a] transition-all shadow-lg shadow-indigo-900/10 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : 'Нууц үг шинэчлэх'}
                    </button>
                </form>
            </section>
        </div>
    )
}

export default function NewPassword() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400">
                Ачаалж байна...
            </div>
        }>
            <ResetPasswordForm />
        </Suspense>
    )
}