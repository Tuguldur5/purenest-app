'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  LayoutDashboard, Users, Settings, LogOut, ChevronRight, Menu, X, 
  PlusCircle,
  ListOrderedIcon,
  Paperclip
} from 'lucide-react'
import AddProductForm from './products/page'
import { ReportChartSize } from 'recharts/types/context/chartLayoutContext'
import { FaRegHandPointRight } from 'react-icons/fa'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    useEffect(() => {
        const role = localStorage.getItem("userRole")
        if (role !== 'admin') { router.push('/') }
    }, [router])

    const menuItems = [
    { name: 'Хяналтын самбар', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Бүтээгдэхүүн захиалга', href: '/admin/product_order', icon: ListOrderedIcon }, 
    { name: 'Бараа нэмэх / Удирдах', href: '/admin/products', icon: PlusCircle },
    { name: 'Хэрэглэгчид', href: '/admin/users', icon: Users },
    { name: 'Үнэ тохиргоо', href: '/admin/pricing', icon: Settings },
    { name: 'Тайлан оруулах', href: '/admin/report', icon: Paperclip },

    ]

    return (
        <div className="flex min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden" 
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                w-72 bg-white border-r border-slate-200 fixed top-0 left-0 h-screen p-6 flex flex-col z-50 transition-transform duration-300
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="flex justify-between items-center mb-10 px-2 group">
                    <Link href="/admin" className="flex items-center space-x-3">
                        <img src="/nest1.png" alt="Logo" className="w-12 h-12 rounded-full object-cover shadow-md" />
                        <div>
                            <h2 className="text-lg font-bold leading-tight">Admin</h2>
                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Management</p>
                        </div>
                    </Link>
                    <button className="md:hidden p-2" onClick={() => setIsSidebarOpen(false)}>
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 space-y-1.5">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href
                        const Icon = item.icon
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`group flex items-center justify-between p-3 rounded-xl transition-all duration-200
                                    ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-500 hover:bg-slate-50'}`}
                            >
                                <div className="flex items-center">
                                    <Icon size={20} className={`mr-3 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                                    <span className="text-[15px] font-medium">{item.name}</span>
                                </div>
                                {isActive && <ChevronRight size={16} />}
                            </Link>
                        )
                    })}
                </nav>

                <div className="pt-6 border-t border-slate-100">
                    <Link href="/home" className="flex items-center justify-center space-x-2 w-full p-3 rounded-xl bg-slate-900 text-white hover:bg-red-600 transition-colors">
                        <LogOut size={18} />
                        <span className="font-semibold text-sm">Гарах</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 md:ml-72 min-h-screen w-full overflow-x-hidden">
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-4 md:px-10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button className="md:hidden p-2 hover:bg-slate-100 rounded-lg" onClick={() => setIsSidebarOpen(true)}>
                            <Menu size={24} />
                        </button>
                        <h1 className="text-xs md:text-sm font-medium text-slate-400 uppercase tracking-widest">
                            {menuItems.find(item => item.href === pathname)?.name || 'Үндсэн'}
                        </h1>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">AD</div>
                </header>

                <div className="p-4 md:p-10">
                    <div className="animate-in fade-in duration-500">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}