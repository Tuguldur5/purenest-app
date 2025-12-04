'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation' 

export default function Login() {
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    // const [role, setRole] = useState('') // 💡 Role-ийг хэрэглэгч сонгох шаардлагагүй бол устгаж болно. Backend өөрөө шалгана.
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter() 

    // 💡 Тэмдэглэл: Таны API URL 'http://localhost:4000/auth/login' байна.
    const handleLogin = async () => {
        setError('')
        setLoading(true)

        try {
            // Role-ийг Backend-д илгээхгүй бол state-ийг body-оос хасна.
            const res = await fetch("http://localhost:4000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email,
                    password: pass,
                    // role: role, // Backend role-ийг шалгадаггүй бол хэрэггүй
                })
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || "Нэвтрэхэд алдаа гарлаа. Мэдээллээ шалгана уу.") 
                return // Алдаа гарвал цааш үргэлжлүүлэхгүй
            }
            
            // Нэвтрэлт амжилттай
            // -----------------------------------------------------
            
            // 1. Токенг хадгалах
            localStorage.setItem("token", data.token)

            // 2. Хэрэглэгчийн мэдээллийг хадгалах (role-ийг агуулсан)
            if (data.user) {
                // 💡 Хэрэглэгчийн role-ийг local storage-д тусад нь хадгалах нь хурдан шалгалт хийхэд тустай
                localStorage.setItem("userRole", data.user.role || 'user');
                localStorage.setItem("user", JSON.stringify(data.user))
            }
            
            // 3. Админ эрхийг шалгах ба Чиглүүлэх Замыг Тодорхойлох
            const userRole = data.user?.role; 
            const redirectPath = (userRole === 'admin') ? '/admin' : '/'; // 💡 /admin руу чиглүүлнэ (Таны page.tsx-ийн root)
            router.push(redirectPath);
            console.log(`Нэвтрэлт амжилттай. Role: ${userRole}. Чиглүүлэх зам: ${redirectPath}`);

            // 4. Зохих хуудас руу шилжих
            if (userRole === 'admin') {
                // 💡 Хатуу шилжүүлэлт: Admin Panel-ийн UI-ийг зөв ачаалахад тусална
                window.location.href = redirectPath; 
            } else {
                router.push(redirectPath);
                // Зарим үед Header component-ийг шинэчлэхийн тулд refresh хийх шаардлагатай болдог
                setTimeout(() => {
                    router.refresh(); 
                }, 100);
            }
            
        } catch (err) {
            console.error("Login Fetch Error:", err);
            setError("Сервертэй холбогдож чадсангүй. (Холболт эсвэл CORS-ийн алдаа)")
        } finally {
            setLoading(false) 
        }
    }

    return (
        <section className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-md items-center text-black 
        border border-black/5 shadow-md p-10 rounded-2xl">
            <h2 className="text-2xl font-semibold mb-4 text-center text-[#102B5A]">Нэвтрэх</h2>

            {error && <p className="text-red-600 text-sm mb-2 text-center">{error}</p>}

            <input 
                placeholder="И-мэйл" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full border p-2 rounded mb-3" 
            />

            <input 
                placeholder="Нууц үг" 
                type="password" 
                value={pass} 
                onChange={(e) => setPass(e.target.value)} 
                className="w-full border p-2 rounded mb-3" 
            />

            <div className="flex items-center justify-between"><br />
                <Link href="/forgot-password" className="text-sm text-red-500 hover:text-red-700">
                    Нууц үгээ мартсан?
                </Link>
            </div>

            <button 
                className="mt-3 p-2 border border-gray-300 shadow-md rounded-lg text-white w-full bg-[#102B5A] disabled:opacity-50"
                onClick={handleLogin}
                disabled={loading}
            >
                {loading ? "Уншиж байна..." : "Нэвтрэх"}
            </button>

            <p className="mt-4 text-center">
                Бүртгэлгүй? <Link href="/register" className="text-[#102B5A] font-medium hover:text-blue-700">Бүртгүүлэх</Link>
            </p>
        </section>
    )
}