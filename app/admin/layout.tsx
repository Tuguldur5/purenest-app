'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  Briefcase,
  ChevronRight
} from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const role = localStorage.getItem("userRole")
        if (role !== 'admin') {
            router.push('/')
        }
    }, [router])

    const menuItems = [
        { name: 'Хяналтын самбар', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Хэрэглэгчид', href: '/admin/users', icon: Users },
        { name: 'Үнэ тохиргоо', href: '/admin/pricing', icon: Settings },
    ]

    return (
        <div className="flex min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-slate-200 fixed top-0 left-0 h-screen p-6 flex flex-col transition-all duration-300">
                
                {/* Logo Section */}
                <Link href="/admin" className="flex items-center space-x-3 mb-10 px-2 group">
                    <div className="relative">
                        <img src="/nest1.png" alt="Logo" className="w-12 h-12 rounded-full object-cover shadow-md group-hover:scale-105 transition-transform" />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold leading-tight">Admin</h2>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Management</p>
                    </div>
                </Link>

                {/* Navigation Menu */}
                <nav className="flex-1 space-y-1.5">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href
                        const Icon = item.icon
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`
                                    group flex items-center justify-between p-3 rounded-xl transition-all duration-200
                                    ${isActive 
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 ring-1 ring-blue-600' 
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                                `}
                            >
                                <div className="flex items-center">
                                    <Icon size={20} className={`mr-3 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'}`} />
                                    <span className="text-[15px] font-medium">{item.name}</span>
                                </div>
                                {isActive && <ChevronRight size={16} className="text-blue-100" />}
                            </Link>
                        )
                    })}
                </nav>

                {/* Logout Button */}
                <div className="pt-6 border-t border-slate-100">
                    <Link
                        href="/home"
                        className="flex items-center justify-center space-x-2 w-full p-3 rounded-xl bg-slate-900 text-white hover:bg-red-600 transition-colors duration-300 shadow-sm"
                    >
                        <LogOut size={18} />
                        <span className="font-semibold text-sm">Системээс гарах</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 ml-72 min-h-screen">
                {/* Header (Optional but recommended) */}
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10 px-10 flex items-center justify-between">
                    <h1 className="text-sm font-medium text-slate-400 uppercase tracking-widest">
                        {menuItems.find(item => item.href === pathname)?.name || 'Үндсэн'}
                    </h1>
                    <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                            AD
                        </div>
                    </div>
                </header>

                <div className="p-10">
                    {/* Content Wrapper */}
                    <div className="animate-in fade-in duration-500">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}