'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Register() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleRegister = async () => {
        setError('')
        setLoading(true)

        try {
            const res = await fetch("http://localhost:4000/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    full_name: form.name,
                    email: form.email,
                    password: form.password
                })
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || "Бүртгэх үед алдаа гарлаа")
            } else {
                alert("Бүртгэл амжилттай!")
                // Хүсвэл шууд login руу үсрүүлж болно:
                // window.location.href = "/login"
            }

        } catch (err) {
            setError("Сервертэй холбогдож чадсангүй.")
        }

        setLoading(false)
    }

    return (
        <section className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-md items-center text-black 
        border border-black/5 shadow-md p-10 rounded-2xl">
            
            <h2 className="text-2xl font-semibold mb-4 text-center text-[#102B5A]">Бүртгүүлэх</h2>

            {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

            <input 
                placeholder="Нэр" 
                value={form.name} 
                onChange={(e) => setForm({ ...form, name: e.target.value })} 
                className="w-full border p-2 rounded mb-3" 
            />

            <input 
                placeholder="И-мэйл" 
                value={form.email} 
                onChange={(e) => setForm({ ...form, email: e.target.value })} 
                className="w-full border p-2 rounded mb-3" 
            />

            <input 
                placeholder="Нууц үг" 
                type="password"
                value={form.password} 
                onChange={(e) => setForm({ ...form, password: e.target.value })} 
                className="w-full border p-2 rounded mb-3" 
            />

            <button 
                className="btn-primary w-full mt-3 mb-3 text-white border-gray-300 p-3 border border-black/5 shadow-md rounded-lg bg-[#102B5A]"
                onClick={handleRegister}
                disabled={loading}
            >
                {loading ? "Уншиж байна..." : "Бүртгүүлэх"}
            </button>

            <p className="mt-3">
                Бүртгэлтэй? 
                <Link href="/login" className="hover-mustard text-[#102B5A] ml-1">
                        Нэвтрэх
                </Link>
            </p>
        </section>
    )
}
