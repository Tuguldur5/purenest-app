'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const role = localStorage.getItem("userRole")
        if (role !== 'admin') {
            router.push('/')
        }
    }, [])

    const menuItems = [
        { name: 'Хяналтын самбар', href: '/admin/dashboard' },
        
        { name: 'Хэрэглэгчид', href: '/admin/users' },
        { name: 'Үнэ тохиргоо', href: '/admin/pricing' },
    ]

    return (
        <div className="flex min-h-screen bg-gray-100 text-black">
            <aside className="w-64 bg-white shadow-lg border-r fixed top-0 left-0 h-screen p-5 overflow-y-auto">
              
                    <Link href="/admin" className="block mb-5 rounded flex hover:text-blue-600 transition-colors">
                    <img src="/nest.jpg" alt="Logo" className="w-16 h-auto mr-2 rounded-xl" />
                       <h2 className="text-xl font-bold mt-3">Admin Panel  </h2>
                    </Link>
              

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
                    <Link
                    href="/home"
                    className="absolute bottom-5 text-center text-sm text-white hover:text-gray-500  border border-black/5 shadow-md rounded-lg p-2 w-50 bg-red-500"
                >
                    Гарах
                </Link>
            
                
            </aside>

            <main className="flex-1 ml-64 p-10 min-h-screen overflow-y-auto">
                {children}
            </main>
        </div>
    )
}
