"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Loading from '../loading'
import { useSiteToast } from '../hooks/useSiteToast'
import { Eye, EyeOff } from 'lucide-react'

export default function Login() {
    const [email, setEmail] = useState<string>('')
    const [pass, setPass] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [showPassword, setShowPassword] = useState<boolean>(false)
    
    const router = useRouter()
    const { showToast } = useSiteToast()

    const handleLogin = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        
        if (!email || !pass) {
            showToast({ title: "Алдаа", description: "И-мэйл болон нууц үгээ оруулна уу." });
            return;
        }

        setLoading(true)

        try {
            const res = await fetch("https://purenest-app.onrender.com/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password: pass })
            })

            const data = await res.json()

            if (!res.ok) {
                // Серверээс ирсэн алдааг шалгах (404 бол бүртгэлгүй гэж үзнэ)
                if (res.status === 404 || data.message?.includes("not found") || data.error?.includes("User")) {
                    showToast({ 
                        title: "Бүртгэлгүй хэрэглэгч", 
                        description: "Энэ и-мэйл хаяг бүртгэлгүй байна. Та бүртгүүлнэ үү." 
                    });
                } else {
                    showToast({ 
                        title: "Алдаа", 
                        description: data.error || data.message || "И-мэйл эсвэл нууц үг буруу байна." 
                    });
                }
                setLoading(false)
                return
            }

            // Хадгалах хэсэг
            localStorage.setItem("token", data.token)
            if (data.user) {
                localStorage.setItem("userRole", data.user.role || 'user');
                localStorage.setItem("user", JSON.stringify(data.user))
            }

            showToast({ title: "Амжилттай", description: "Нэвтэрлээ. Тавтай морил!" })

            const redirectPath = data.user?.role === 'admin' ? '/admin' : '/home';
            router.push(redirectPath);

        } catch (err) {
            showToast({ title: "Алдаа", description: "Сервертэй холбогдож чадсангүй." })
            setLoading(false)
        }
    }

    return (
        <>
            {loading && <Loading />}

            <section className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md items-center text-black 
            border border-black/5 shadow-md p-10 rounded-2xl transition-opacity bg-white ${loading ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>

                <h2 className="text-2xl font-semibold mb-6 text-center text-[#102B5A]">Нэвтрэх</h2>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <input
                            type="email"
                            placeholder="И-мэйл"
                            value={email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            className="w-full border border-gray-200 p-3 rounded-xl outline-none transition-all focus:border-[#102B5A] focus:ring-1 focus:ring-[#102B5A]/10"
                            disabled={loading}
                        />
                    </div>

                    <div className="relative">
                        <input
                            placeholder="Нууц үг"
                            type={showPassword ? "text" : "password"}
                            value={pass}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPass(e.target.value)}
                            className="w-full border border-gray-200 p-3 rounded-xl outline-none transition-all focus:border-[#102B5A] focus:ring-1 focus:ring-[#102B5A]/10"
                            disabled={loading}
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <div className="flex justify-end">
                        <Link href="/forgot-password" className="text-sm text-red-500 hover:underline">
                            Нууц үгээ мартсан?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="p-3 rounded-[14px] text-white w-full bg-[#102B5A] disabled:bg-gray-400 hover:shadow-lg transition-all"
                        disabled={loading}
                    >
                        {loading ? "Уншиж байна..." : "Нэвтрэх"}
                    </button>

                   {/* <div className="relative flex items-center py-2">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase">Эсвэл</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>
                        */ }
                    {/* Google Login Button
                    
                    <button
                        type="button"
                        onClick={() => signIn('google', { callbackUrl: '/home' })}
                        className="w-full flex items-center justify-center gap-3 border border-gray-300 p-2.5 rounded-lg hover:bg-gray-50 transition-all font-medium"
                    >
                        <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-5 h-5" alt="Google" />
                        Google-ээр нэвтрэх
                    </button>
                */}
                </form>

                <p className="mt-6 text-center text-sm">
                    Бүртгэлгүй юу? <Link href="/register" className="text-[#102B5A] font-bold hover:underline ml-1">Бүртгүүлэх</Link>
                </p>
            </section>
        </>
    )
}