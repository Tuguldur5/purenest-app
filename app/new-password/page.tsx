'use client'
import { useState, Suspense } from 'react' // Suspense нэмэв
import { useRouter, useSearchParams } from 'next/navigation'

function ResetPasswordForm() {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    
    const email = searchParams.get('email')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email) {
            alert('И-мэйл хаяг олдсонгүй. Процессыг дахин эхлүүлнэ үү.')
            return
        }

        if (password !== confirmPassword) {
            alert('Нууц үг хоорондоо таарахгүй байна!')
            return
        }

        setLoading(true)
        try {
            const res = await fetch('https://purenest-app.onrender.com/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email: decodeURIComponent(email), 
                    password: password 
                })
            })

            const data = await res.json()

            if (res.ok) {
                alert('Нууц үг амжилттай шинэчлэгдлээ!')
                router.push('/login')
            } else {
                alert(data.message || 'Алдаа гарлаа. Дахин оролдоно уу.')
            }
        } catch (err) {
            console.error("Fetch error:", err)
            alert('Сервертэй холбогдож чадсангүй.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-md w-full border border-black/5 shadow-md p-10 rounded-2xl text-black bg-white">
            <h2 className="text-2xl font-semibold mb-6 text-center text-[#102B5A]">Шинэ нууц үг тохируулах</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-sm text-gray-500">Шинэ нууц үг</label>
                    <input 
                        type="password" 
                        required
                        minLength={6}
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        className="w-full border p-2 rounded mt-1 focus:outline-[#102B5A]" 
                        placeholder="********"
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-500">Шинэ нууц үг давтах</label>
                    <input 
                        type="password" 
                        required
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        className="w-full border p-2 rounded mt-1 focus:outline-[#102B5A]" 
                        placeholder="********"
                    />
                </div>

                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#102B5A] text-white p-2 rounded-lg hover:opacity-90 transition shadow-md mt-4 disabled:bg-gray-400"
                >
                    {loading ? 'Хадгалж байна...' : 'Нууц үг шинэчлэх'}
                </button>
            </form>
        </section>
    )
}

// Next.js useSearchParams ашиглах үед Suspense-ээр ороох шаардлагатай байдаг
export default function NewPassword() {
    return (
        <Suspense fallback={<div>Ачаалж байна...</div>}>
            <ResetPasswordForm />
        </Suspense>
    )
}