'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname() // Одоогийн замыг авах

    useEffect(() => {
        const role = localStorage.getItem("userRole")
        if (role !== 'admin') {
            router.push('/') // Admin биш бол homepage руу
        }
    }, [])

    const menuItems = [
        { name: 'Dashboard', href: '/admin/dashboard' },
        { name: 'Orders', href: '/admin/orders' },
        { name: 'Users', href: '/admin/users' },
        { name: 'Pricing', href: '/admin/pricing' },
    ]

    return (
        <div className="flex min-h-screen bg-gray-100 text-black">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-lg p-5 border-r relative">
                <h2 className="text-2xl font-bold mb-8"><Link href="/admin" className="block rounded ">Admin Panel</Link></h2>
                <nav className="space-y-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`block p-3 rounded transition
                                    ${isActive ? 'bg-blue-500 text-white font-semibold' : 'hover:bg-gray-200'}
                                `}
                            >
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>
                <Link href="/home" className="absolute bottom-5 text-sm text-red-600 hover:text-red-800">Гарах</Link>
            </aside>

            {/* Main content */}
            <main className="flex-1 p-10">
                {children}
            </main>
        </div>
    )
}
