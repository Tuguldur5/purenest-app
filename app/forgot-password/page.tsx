'use client'
import Link from 'next/link'
import { useState } from 'react'


export default function ForgotPassword() {
    const [email, setEmail] = useState('')
    return (
        <section className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-md items-center text-black 
        border border-black/5 shadow-md p-10 rounded-2xl">
            <h2 className="text-2xl font-semibold mb-4 text-center text-[#102B5A]">Нууц үгээ мартсан</h2>
            <input placeholder="И-мэйл" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border p-2 rounded mb-3" />
            <button className="btn-primary border border-black/5 shadow-md p-2 rounded-lg mt-3 mb-3  text-white w-full bg-[#102B5A] text-white  border-gray-300" onClick={() => alert('Password reset demo')}>Нууц үгээ мартсан</button>
            <p className="mt-3">   <Link href="/login" className="hover-mustard text-[#102B5A]">Нэвтрэх</Link></p>
        </section>
    )
}