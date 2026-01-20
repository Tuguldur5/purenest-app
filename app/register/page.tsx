"use client"
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation' // window.location-ийн оронд ашиглах
import { useSiteToast } from '../hooks/useSiteToast'
import { Eye, EyeOff } from 'lucide-react' // Нүдний дүрс

export default function Register() {
    const router = useRouter()
    const { showToast } = useSiteToast()

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        password: ''
    })

    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false) // Нууц үг харах төлөв
    const [errors, setErrors] = useState<{ password?: string }>({});
    // И-мэйл формат шалгах функц
    const validateEmail = (email: string) => {
        return String(email)
            .toLowerCase()
            .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    }

    const handleRegister = async (e: React.FormEvent) => {

        e.preventDefault();

        // Алдааг цэвэрлэх
        setErrors({});

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!passwordRegex.test(form.password)) {
            setErrors(prev => ({
                ...prev,
                password: "Нууц үг багадаа 8 тэмдэгт, 1 том үсэг, 1 тоо болон 1 тусгай тэмдэгт агуулсан байх ёстой."
            }));
            // Toast-оо давхар харуулж болно, эсвэл болиулсан ч болно
            return;
        }
        if (!form.name || !form.email || !form.phone || !form.password) {
            showToast({ title: "Алдаа", description: "Бүх талбарыг бөглөнө үү." })
            return
        }

        // 2. И-мэйл формат шалгах
        if (!validateEmail(form.email)) {
            showToast({ title: "Алдаа", description: "И-мэйл хаяг буруу байна (@ болон домэйн оруулна уу)." })
            return
        }
        setLoading(true)

        try {
            const res = await fetch("https://purenest-app.onrender.com/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    full_name: form.name,
                    email: form.email,
                    phone: form.phone,
                    password: form.password
                })
            })

            const data = await res.json()

            if (!res.ok) {
                // Backend-ээс ирж буй алдааны мессежийг оновчтой харуулах
                const errorMsg = data.message || data.error || "Бүртгэх үед алдаа гарлаа"
                showToast({ title: "Алдаа", description: errorMsg })
            } else {
                showToast({ title: "Амжилттай!", description: "Бүртгэл амжилттай боллоо. Нэвтрэх хэсэг рүү шилжиж байна." })
                setTimeout(() => {
                    router.push("/login") // Next.js-ийн router ашиглах нь илүү хурдан
                }, 1500)
            }
        } catch (err) {
            showToast({ title: "Алдаа", description: "Сервертэй холбогдож чадсангүй." })
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md items-center text-black 
        border border-black/5 shadow-md p-10 rounded-2xl bg-white">

            <h2 className="text-2xl font-semibold mb-6 text-center text-[#102B5A]">Бүртгүүлэх</h2>
            <div className="space-y-4">
                {/* Нэр */}
                <input
                    placeholder="Нэр"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-gray-200 p-3 rounded-xl outline-none transition-all focus:border-[#102B5A] focus:ring-1 focus:ring-[#102B5A]/10"
                />

                {/* И-мэйл */}
                <input
                    placeholder="И-мэйл (жишээ: example@mail.com)"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-gray-200 p-3 rounded-xl outline-none transition-all focus:border-[#102B5A] focus:ring-1 focus:ring-[#102B5A]/10"
                />

                {/* Утасны дугаар */}
                <input
                    placeholder="Утасны дугаар"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full border border-gray-200 p-3 rounded-xl outline-none transition-all focus:border-[#102B5A] focus:ring-1 focus:ring-[#102B5A]/10"
                />

                <div className="relative">
                    <input
                        placeholder="Нууц үг"
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={(e) => {
                            setForm({ ...form, password: e.target.value });
                            if (errors.password) setErrors({ ...errors, password: "" });
                        }}
                        className={`w-full border p-3 pr-12 rounded-xl outline-none transition-all ${errors.password ? 'border-red-500 bg-red-50/30' : 'border-gray-200 focus:border-[#102B5A] focus:ring-1 focus:ring-[#102B5A]/10'
                            }`}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#102B5A] transition-colors"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                {errors.password && (
                    <p className="text-[11px] text-red-500 font-medium ml-1 leading-tight animate-in fade-in slide-in-from-top-1">
                        {errors.password}
                    </p>
                )}

                <button
                    className="w-full mt-2 text-white p-3 shadow-md rounded-[14px] bg-[#102B5A] hover:bg-[#1a3d7a] transition-colors disabled:bg-gray-400"
                    onClick={handleRegister}
                    disabled={loading}
                >
                    {loading ? "Уншиж байна..." : "Бүртгүүлэх"}
                </button>
            </div>

            <p className="mt-5 text-center text-sm">
                Бүртгэлтэй юу?
                <Link href="/login" className="text-[#102B5A] font-bold hover:underline ml-1">
                    Нэвтрэх
                </Link>
            </p>
        </section>
    )
}