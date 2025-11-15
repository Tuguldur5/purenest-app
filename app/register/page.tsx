'use client'
import { useState } from 'react'
import Link from 'next/link'


export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '' })
    return (
        <section className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-md items-center text-black 
        border border-black/5 shadow-md p-10">
            <h2 className="text-2xl font-semibold mb-4 items-center">Register</h2>
            <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border p-2 rounded mb-3" />
            <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border p-2 rounded mb-3" />
            <input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full border p-2 rounded mb-3" />
            <button className="btn-primary border-gray-300" onClick={() => alert('Register demo')}>Register</button>
            <p className="mt-3">Have account? <Link href="/login" className="hover-mustard">Login</Link></p>
        </section>
    )
}