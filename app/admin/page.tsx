'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()

    useEffect(() => {
        const role = localStorage.getItem("userRole")
        if (role !== 'admin') {
            router.push('/') // Admin биш бол homepage руу
        }
    }, [])

    return (
        <div className="flex min-h-screen bg-gray-100 text-black">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-lg p-5 border-r">
                <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
                <nav className="space-y-2">
                    <Link href="/admin/dashboard" className="block p-3 rounded hover:bg-gray-200">Dashboard</Link>
                    <Link href="/admin/orders" className="block p-3 rounded hover:bg-gray-200">Orders</Link>
                    <Link href="/admin/users" className="block p-3 rounded hover:bg-gray-200">Users</Link>
                    <Link href="/admin/pricing" className="block p-3 rounded hover:bg-gray-200">Pricing</Link>
                </nav>
                <Link href="/home" className="absolute bottom-5 text-sm text-red-600 hover:text-red-800">🏠 Гарах</Link>
            </aside>

            {/* Main content */}
            <main className="flex-1 p-10">
                {children}
            </main>
        </div>
    )
}
