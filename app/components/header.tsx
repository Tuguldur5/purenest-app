'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // useRouter-ийг импортлох
import { FaUserCircle } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import { Home, MoreHorizontal } from "lucide-react";
export default function Header() {
    // 💡 Header функцийг дотор нь тодорхойлсныг устгаж, шууд Header функцийг ашиглаж байна.
    const [scrolled, setScrolled] = useState(false)
    const pathname = usePathname() // Одоо байгаа page-г авах

    useEffect(() => {
        // Зөвхөн Home page-д scroll event нэмэх
        if (pathname === '/' || '/home') {
            const handleScroll = () => {
                if (window.scrollY > 50) setScrolled(true)
                else setScrolled(false)
            }
            window.addEventListener('scroll', handleScroll)
            return () => window.removeEventListener('scroll', handleScroll)
        }
    }, [pathname])
const isHome = pathname === '/' || pathname === '/home';
    // Home page-д scroll шалгаж классыг өөрчлөх
    const headerClasses = isHome
            ? `fixed w-full top-0 z-50 transition-colors duration-300 ${scrolled ? 'bg-white border border-black/5 shadow-md text-black' : 'bg-transparent text-white'
            }`
            : 'w-full top-0 z-50 bg-white text-black shadow-md'



            
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [open, setOpen] = useState(false);
    const router = useRouter(); // useRouter-ийг дуудах

    useEffect(() => {
        // 💡 Токенг шалгах
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }

        // Хэрэглэгч нэвтэрсний дараа Header-ийг шууд шинэчлэх сонсогчийг энд нэмж болно.
        // Гэхдээ `router.push()` хийхэд useEffect дахин ажиллах тул энэ нь ихэвчлэн шаардлагагүй.
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        // ✅ Гарсны дараа нүүр хуудас руу шилжих
        router.push('/');
    };

    return (
        <header className={headerClasses}>
            <div className="container mx-auto px-4 py-4 flex items-center justify-between" style={{ fontFamily: "arial" }}>
                <Link href="/home" className="flex items-center">
                    <img
                        src="./nest.jpg"
                        alt="Logo"
                        className="w-16 h-16 rounded-full object-cover"
                    />
                    <span
                        className="ml-4 text-3xl text-[#e2bd6e]"
                        style={{ fontFamily: 'Montserrat' }}
                    >
                        Purenest Service
                    </span>
                </Link>


                <nav className="hidden md:flex items-center space-x-4 ">
                    {/* Нүүр */}
                    <Link href="/home" className="flex items-center gap-2 px-3 py-2 hover:text-amber-400  transition-colors duration-0">
                        <Home size={20} /> Нүүр
                    </Link>


                    {/* Үйлчилгээ */}
                    <div className="relative group z-50">
                        <button className="flex items-center gap-2 px-4 py-2 hover:text-amber-400  transition-colors">

                            {/* Layers / Categories Icon */}
                            <svg xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 24 24"
                                strokeWidth="1.5" stroke="currentColor"
                                className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M3 7.5l9-4.5 9 4.5-9 4.5-9-4.5z" />
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M3 12l9 4.5 9-4.5" />
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M3 16.5l9 4.5 9-4.5" />
                            </svg>

                            Үйлчилгээ
                        </button>

                        <div className="absolute left-0 bg-white rounded-lg w-45 shadow-lg hidden group-hover:block">
                            <Link className="block px-4 py-2 text-black hover:text-amber-400" href="/service/office">Оффис</Link>
                            <Link className="block px-4 py-2 text-black hover:text-amber-400" href="/service/suh">СӨХ</Link>
                            <Link className="block px-4 py-2 text-black hover:text-amber-400" href="/service/public-space">Олон нийтийн талбай</Link>
                        </div>
                    </div>


                    {/* Захиалга */}
                    <Link
                        href="/booking"
                        className="flex items-center gap-2 hover:text-amber-400 px-3 py-2  transition-colors duration-0"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
                            className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M3 7h18M6 12h12M9 17h6" />
                        </svg>
                        <span className="text-[17px]">Захиалга</span>
                    </Link>



                    {/* Бусад */}
                    <div className="relative group z-50">
                        <button className="flex items-center gap-2 px-4 py-2 hover:text-amber-400  transition-colors">
                            <MoreHorizontal size={20} /> Бусад
                        </button>
                        <div className="absolute left-0 bg-white rounded-lg w-52 shadow-lg hidden group-hover:block py-2">
                            <Link href="/about" className="block px-4 text-black py-2 hover:text-amber-400">Бидний тухай</Link>
                            <Link href="/faq" className="block px-4 text-black py-2 hover:text-amber-400">Түгээмэл асуултууд</Link>
                            <Link href="/contact" className="block px-4 text-black py-2 hover:text-amber-400">Холбоо барих</Link>
                        </div>
                    </div>

                    {/* Хэрэглэгчийн Төлөв (Login/Profile) */}
                    <div className="flex ml-4 items-center">
                        {isLoggedIn ? (
                            // ✅ Нэвтэрсэн үед: Profile Icon болон Гарах товч
                            <div className="flex items-center space-x-4">
                                <Link href="/profile" className="text-[#102B5A] hover:text-amber-400 transition-colors duration-300">
                                    <FaUserCircle size={35} />
                                </Link>

                            </div>
                        ) : (
                            // ❌ Нэвтрээгүй үед: Нэвтрэх товч
                            <Link href="/login" className="hover-mustard border text-white bg-[#102B5A] border-black/5 p-2 ml-5 pl-4 pr-4
                                shadow-md rounded-md  rounded-lg transition-colors duration-300 hover:text-amber-400">
                                Нэвтрэх
                            </Link>
                        )}
                    </div>
                </nav>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden">
                    <button onClick={() => setOpen(!open)} aria-label="menu">☰</button>
                </div>
            </div>

            {/* Mobile Menu Links */}
            {open && (
                <div className="md:hidden border-t">
                    <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
                        <Link href="/home">Нүүр</Link>
                        <Link href="/service">Үйлчилгээ</Link>
                        <Link href="/booking">Захиалга</Link>
                        <Link href="/about">Бидний тухай</Link>
                        <Link href="/faq">Түгээмэл асуултууд</Link>
                        <Link href={isLoggedIn ? "/profile" : "/login"}>
                            {isLoggedIn ? "Профайл" : "Нэвтрэх"}
                        </Link>
                        {isLoggedIn && (
                            <button onClick={handleLogout} className="text-left">
                                Гарах
                            </button>
                        )}
                    </div>
                </div>
            )}
        </header>
    )
}