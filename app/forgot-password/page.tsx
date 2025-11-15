'use client'
import { useState } from 'react'


export default function ForgotPassword() {
    const [email, setEmail] = useState('')
    return (
        <section className="max-w-md">
            <h2 className="text-2xl font-semibold mb-4">Forgot Password</h2>
            <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border p-2 rounded mb-3" />
            <button className="btn-primary border-gray-300" onClick={() => alert('Password reset demo')}>Send reset link</button>
        </section>
    )
}