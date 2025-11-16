'use client'
import { useState } from 'react'
import Link from 'next/link'


export default function Login() {
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    return (
        <section className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-md items-center text-black 
        border border-black/5 shadow-md p-10 rounded-2xl">
            <h2 className="text-2xl font-semibold mb-4 text-center text-[#102B5A]">Нэвтрэх</h2>
            <input placeholder="И-мэйл" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border p-2 rounded mb-3" />
            <input placeholder="Нууц үг" type="password" value={pass} onChange={(e) => setPass(e.target.value)} className="w-full border p-2 rounded mb-3" />
            <div className="flex items-center justify-between"><br/>
                <Link href="/forgot-password" className="text-sm text-red-500 hover-mustard">Нууц үгээ мартсан?</Link>
            </div>
            <button className="btn-primary mt-3 mb-3 p-2 border justify-center border-gray-300 shadow-md p-1 pl-10 pr-10 rounded-lg text-white w-full bg-[#102B5A]" onClick={() => alert('Login demo')}>Нэвтрэх</button> <br/>
            <p className="mt-4">Бүртгэлгээгүй? <Link href="/register" className="hover-mustard text-[#102B5A]">Бүртгүүлэх</Link></p>
        </section>
    )
}