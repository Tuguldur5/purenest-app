'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation' 

export default function Login() {
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter() 

    const handleLogin = async () => {
        setError('')
        setLoading(true)

        try {
            // ✅ FETCH КОДЫГ НӨХӨЖ ОРУУЛАВ
            const res = await fetch("http://localhost:4000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email,
                    password: pass // 'pass' state-ийн утгыг илгээж байна
                })
            })

            const data = await res.json()

            if (!res.ok) {
                // Backend-ээс ирсэн алдааны мессежийг харуулна
                setError(data.error || "Нэвтрэхэд алдаа гарлаа. Мэдээллээ шалгана уу.") 
            } else {
                // 1. Токенг хадгалах
                localStorage.setItem("token", data.token)

                // 2. Хэрэглэгчийн мэдээллийг хадгалах
                if (data.user) {
                    localStorage.setItem("user", JSON.stringify(data.user))
                }
                
                // 3. Админ эрхийг шалгах
                const userRole = data.user?.role; 
                const redirectPath = (userRole === 'admin') ? '/admin/dashboard' : '/'; 

                console.log(`Нэвтрэлт амжилттай. Role: ${userRole}. Чиглүүлэх зам: ${redirectPath}`);

                // 4. Зохих хуудас руу шилжих (Admin бол хатуу шилжүүлэлт хийх нь илүү найдвартай)
                if (userRole === 'admin') {
                    // Хатуу шилжүүлэлт нь Next.js-ийн кэшийг алгасахад тусалдаг
                    window.location.href = redirectPath; 
                } else {
                    router.push(redirectPath);
                    setTimeout(() => {
                        router.refresh(); // Header зэргийг шинэчлэх
                    }, 100);
                }
            }
        } catch (err) {
            console.error("Login Fetch Error:", err);
            // 💡 4000 порт ажиллаж байсан ч холбогдохгүй бол Firewall/CORS-ийг шалгахыг сануулна.
            setError("Сервертэй холбогдож чадсангүй. (Холболт эсвэл CORS-ийн алдаа)")
        } finally {
            // ✅ Хүсэлт амжилттай эсвэл алдаатай байсан ч loading-ийг унтраана.
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
                <Link href="/forgot-password" className="text-sm text-red-500 hover-mustard">
                    Нууц үгээ мартсан?
                </Link>
            </div>

            <button 
                className="mt-3 p-2 border border-gray-300 shadow-md rounded-lg text-white w-full bg-[#102B5A]"
                onClick={handleLogin}
                disabled={loading}
            >
                {loading ? "Уншиж байна..." : "Нэвтрэх"}
            </button>

            <p className="mt-4 text-center">
                Бүртгэлгүй? <Link href="/register" className="hover-mustard text-[#102B5A] font-medium">Бүртгүүлэх</Link>
            </p>
        </section>
    )
}