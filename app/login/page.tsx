'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
// 💡 Өөрийн лоудер компонентыг импортлох (Замыг нь зөв зааж өгөөрэй)
import Loading from '../loading' ;

export default function Login() {
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false) // 💡 Энэ state лоудерыг удирдана
    const router = useRouter()

    const handleLogin = async () => {
        setError('')
        setLoading(true) // 💡 Лоудерыг эхлүүлэх

        try {
            const res = await fetch("http://localhost:4000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email,
                    password: pass,
                })
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || "Нэвтрэхэд алдаа гарлаа.")
                setLoading(false) // ❌ Алдаа гарвал лоудерыг зогсоох
                return 
            }

            localStorage.setItem("token", data.token)
            if (data.user) {
                localStorage.setItem("userRole", data.user.role || 'user');
                localStorage.setItem("user", JSON.stringify(data.user))
            }

            const userRole = data.user?.role;
            const redirectPath = (userRole === 'admin') ? '/admin' : '/home';

            // Амжилттай болсон үед лоудер хаагдалгүйгээр шилжилт хийгдэх нь гоё харагддаг
            if (userRole === 'admin') {
                window.location.href = redirectPath;
            } else {
                router.push(redirectPath);
            }

        } catch (err) {
            console.error("Login Error:", err);
            setError("Сервертэй холбогдож чадсангүй.")
            setLoading(false) // ❌ Алдаа гарвал лоудерыг зогсоох
        }
    }

    return (
        <>
            {/* 💡 Loading state үнэн байх үед лоудер харагдана */}
            {loading && <Loading />}

            <section className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-md items-center text-black 
            border border-black/5 shadow-md p-10 rounded-2xl transition-opacity ${loading ? 'opacity-20' : 'opacity-100'}`}>
                
                <h2 className="text-2xl font-semibold mb-4 text-center text-[#102B5A]">Нэвтрэх</h2>

                {error && <p className="text-red-600 text-sm mb-2 text-center">{error}</p>}
                
                <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                    <input
                        placeholder="И-мэйл"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border p-2 rounded mb-3"
                        disabled={loading} // 💡 Уншиж байх үед оролтыг хаах
                    />

                    <input
                        placeholder="Нууц үг"
                        type="password"
                        value={pass}
                        onChange={(e) => setPass(e.target.value)}
                        className="w-full border p-2 rounded mb-3"
                        disabled={loading}
                    />

                    <button
                        type="submit"
                        className="mt-3 p-2 border border-gray-300 shadow-md rounded-lg text-white w-full bg-[#102B5A] disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? "Уншиж байна..." : "Нэвтрэх"}
                    </button>
                </form>

                <p className="mt-4 text-center">
                    Бүртгэлгүй? <Link href="/register" className="text-[#102B5A] font-medium hover:text-blue-700">Бүртгүүлэх</Link>
                </p>
            </section>
        </>
    )
}