'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // useRouter-ийг импортлох
import { FaUserCircle } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import { ChevronDown, Home, MoreHorizontal, ShoppingCart, Trash2 } from 'lucide-react';
import { useCart } from '../context/page'; // Сагсны тоог харуулахын тулд
export default function Header() {
    // 💡 Header функцийг дотор нь тодорхойлсныг устгаж, шууд Header функцийг ашиглаж байна.
    const [scrolled, setScrolled] = useState(false)
    const pathname = usePathname() // Одоо байгаа page-г авах
    const [isOpen, setIsOpen] = useState(false); // Mobile menu toggle
    const [isServiceOpen, setIsServiceOpen] = useState(false); // Dropdown toggle
    const { cart, removeFromCart, clearCart } = useCart();
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
    const isProducts = pathname === '/products';

    // Header-ийн классыг тодорхойлох logic
    let headerClasses = '';

    if (isHome) {
        // Home page: Scroll хийхэд өнгө нь солигдоно
        headerClasses = `fixed w-full top-0 z-50 transition-colors duration-300 ${scrolled ? 'bg-white border border-black/5 shadow-md text-black' : 'bg-transparent text-white'
            }`;
    } else if (isProducts) {
        // Products page: Зөвхөн энэ хуудсанд зориулсан стиль (Жишээ нь: арай өөр shadow эсвэл өнгө)
        headerClasses = 'fixed w-full top-0 z-50 bg-gray-50 text-black border-b border-gray-200';
    } else {
        // Бусад хуудсууд: Ерөнхий цагаан header
        headerClasses = 'w-full top-0 z-50 bg-white text-black shadow-md';
    }

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [open, setOpen] = useState(false);
    const router = useRouter(); // useRouter-ийг дуудах

    useEffect(() => {
        // 💡 pathname өөрчлөгдөх болгонд токен байгаа эсэхийг дахин шалгана
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, [pathname]); // 💡 pathname-г энд нэмж өгснөөр хуудас солигдох бүрт ажиллана

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        window.location.href = '/';
    };

    return (
        <header className={headerClasses}>
            <div className="container mx-auto px-4 py-4 flex items-center justify-between" style={{ fontFamily: "arial" }}>
                <Link href="/home" className="flex items-center">
                    <img
                        src="./nest1.png"
                        alt="Logo"
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    <span
                        className="ml-4 text-3xl text-[#"
                        style={{ fontFamily: 'Montserrat' }}
                    >
                    </span>
                </Link>

                <nav className="hidden md:flex items-center space-x-4 ">
                    {/* Нүүр */}
                    <nav className="flex items-center gap-2">
                        {/* 1. Нүүр */}
                        <Link
                            href="/home"
                            className="group relative flex items-center gap-2 px-3 py-2 transition-colors duration-0 hover:text-amber-400"
                        >
                            {/* Underline-ийг icon болон текст доор бүтэн харуулахын тулд wrapper span ашиглана */}
                            <span className="relative flex items-center gap-2">
                                <Home size={17} />
                                <span className="text-sm">Нүүр</span>

                                {/* Underline элемент - Энэ нь яг icon + текст доор гарна */}
                                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
                            </span>
                        </Link>

                        {/* 2. Үйлчилгээ (Dropdown) */}
                        <div className="relative group z-50">
                            <button className="flex items-center gap-2 px-4 py-2 hover:text-amber-400 transition-colors">
                                <span className="relative flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5l9-4.5 9 4.5-9 4.5-9-4.5z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9 4.5 9-4.5" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5l9 4.5 9-4.5" />
                                    </svg>
                                    <span className="text-sm">Үйлчилгээ</span>
                                    <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
                                </span>
                            </button>
                            <div className="absolute left-0 top-full  bg-white rounded-lg w-48 shadow-xl hidden group-hover:block border border-gray-100 overflow-hidden">
                                <Link className="block px-4 py-2 text-black text-sm hover:bg-gray-50 hover:text-amber-400" href="/service/office">Оффис</Link>
                                <Link className="block px-4 py-2 text-black text-sm hover:bg-gray-50 hover:text-amber-400" href="/service/suh">СӨХ</Link>
                                <Link className="block px-4 py-2 text-black text-sm hover:bg-gray-50 hover:text-amber-400" href="/service/public-space">Олон нийтийн талбай</Link>
                                <Link className="block px-4 py-2 text-black text-sm hover:bg-gray-50 hover:text-amber-400" href="/service/warehouse">Агуулах</Link>
                                <Link className="block px-4 py-2 text-black text-sm hover:bg-gray-50 hover:text-amber-400" href="/service/duct">Агааржуулалтын хоолой</Link>
                            </div>
                        </div>

                        <Link
                            href="/products"
                            className="group relative flex items-center gap-2 px-3 py-2 transition-colors duration-0 hover:text-amber-400"
                        >
                            <span className="relative flex items-center gap-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9.25v9" />
                                </svg>

                                <span className="text-sm">Бүтээгдэхүүн</span>

                                {/* Hover хийхэд доогуур нь зурагдах зураас */}
                                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
                            </span>
                        </Link>
                        <Link
                            href="/booking"
                            className="group relative flex items-center gap-2 px-3 py-2 transition-colors duration-0 hover:text-amber-400"
                        >
                            <span className="relative flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M6 12h12M9 17h6" />
                                </svg>
                                <span className="text-sm">Захиалга</span>
                                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
                            </span>
                        </Link>

                        {/* 4. Бусад (Dropdown) */}
                        <div className="relative group z-50">
                            <button className="flex items-center gap-2 px-4 py-2 hover:text-amber-400 transition-colors">
                                <span className="relative flex items-center gap-2">
                                    <MoreHorizontal size={17} />
                                    <span className="text-sm">Бусад</span>
                                    <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
                                </span>
                            </button>
                            <div className="absolute left-0 top-full bg-white rounded-lg w-52 shadow-xl hidden group-hover:block py-2 border border-gray-100">
                                <Link href="/about" className="block text-sm px-4 py-2 text-black hover:bg-gray-50 hover:text-amber-400">Бидний тухай</Link>
                                <Link href="/faq" className="block text-sm px-4 py-2 text-black hover:bg-gray-50 hover:text-amber-400">Түгээмэл асуултууд</Link>
                                <Link href="/contact" className="block text-sm px-4 py-2 text-black hover:bg-gray-50 hover:text-amber-400">Холбоо барих</Link>
                            </div>
                        </div>
                    </nav>

                    {/* Хэрэглэгчийн Төлөв (Login/Profile) */}
                    <div className="flex items-center">
                        <Link
                            href={isLoggedIn ? "/cart" : "/login"}
                            className="relative p-2 mr-4 hover:text-amber-400 transition-colors"
                            onClick={(e) => {
                                if (!isLoggedIn) {
                                    alert("Та эхлээд нэвтэрнэ үү!");
                                }
                            }}
                        >
                            {/* 1. 'group' классыг зөвхөн сагс бараатай үед нэмнэ */}
                            <div className={`relative ${cart.length > 0 ? 'group' : ''}`}>

                                {/* Сагсны Icon болон Badge */}
                                <div className="p-2 cursor-pointer">
                                    <ShoppingCart
                                        size={24}
                                        className={`transition-all duration-300 ${isHome && !scrolled ? 'text-white' : 'text-black'}`}
                                    />
                                    {cart.length > 0 && (
                                        <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                                            {cart.length}
                                        </span>
                                    )}
                                </div>

                                {/* 2. Dropdown Цэс - Сагс хоосон биш үед л render хийнэ */}
                                {cart.length > 0 && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] transform origin-top-right group-hover:scale-100 scale-95">

                                        {/* Толгой хэсэг: Гарчиг болон Хоослох товч */}
                                        <div className="p-4 border-b flex justify-between items-center">
                                            <h3 className="font-bold text-gray-800">Миний сагс</h3>
                                            <button
                                                onClick={() => {
                                                    if (window.confirm("Та сагсаа бүрэн хоослохдоо итгэлтэй байна уу?")) {
                                                        clearCart();
                                                    }
                                                }}
                                                className="text-[11px] text-red-500 hover:text-red-700 font-medium underline"
                                            >
                                                Хоослох
                                            </button>
                                        </div>

                                        {/* Барааны жагсаалт: Max-height тохируулсан хэсэг */}
                                        <div className="max-h-[400px] overflow-y-auto p-2 space-y-1 custom-scrollbar">
                                            {cart.map((item: any) => (
                                                <div key={item.id} className="flex gap-3 p-2 hover:bg-gray-50 rounded-xl transition-colors items-center group/item">
                                                    <div className="w-12 h-12 bg-white border border-gray-100 rounded-lg flex-shrink-0 p-1">
                                                        <img src={item.image_url} alt={item.name} className="w-full h-full object-contain" />
                                                    </div>

                                                    <div className="flex-grow min-w-0">
                                                        <h4 className="text-[11px] font-bold text-gray-800 truncate leading-tight">{item.name}</h4>
                                                        <p className="text-[10px] text-gray-500 mt-0.5">{item.quantity}ш × <span className="text-[#102B5A] font-medium">{Number(item.price).toLocaleString()}₮</span></p>
                                                    </div>

                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeFromCart(item.id);
                                                        }}
                                                        className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-all opacity-0 group-hover/item:opacity-100"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Доод хэсэг: Нийт дүн болон Захиалах */}
                                        <div className="p-4 border-t bg-gray-50 rounded-b-2xl">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-sm text-gray-600">Нийт:</span>
                                                <span className="text-sm font-bold text-[#102B5A]">
                                                    {cart.reduce((total: number, item: any) => total + (item.price * item.quantity), 0).toLocaleString()}₮
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => window.location.href = '/cart'}
                                                className="w-full py-2.5 bg-[#102B5A] text-white rounded-xl text-sm font-bold hover:bg-blue-900 transition-colors shadow-lg shadow-blue-900/20"
                                            >
                                                Захиалах
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                        </Link>
                        {isLoggedIn ? (
                            // ✅ Нэвтэрсэн үед: Profile Icon болон Гарах товч
                            <div className="flex items-center space-x-4">
                                <Link href="/profile" className="hover:text-amber-400 text-gray-500 transition-colors duration-300">
                                    <FaUserCircle size={35} />
                                </Link>

                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="px-6 py-2.5 bg-[#102B5A]/90 backdrop-blur-sm
                                            text-white font-semibold text-sm tracking-wide
                                                border border-white/20
                                                rounded-[14px]
                                                shadow-[0_4px_10px_rgba(0,0,0,0.3)]
                                               
                                                transition-all duration-300 ease-out
                                                hover:scale-105 
                                                hover:bg-[#102B5A] 
                                                hover:text-amber-400
                                                hover:border-amber-400/50
                                                hover:shadow-amber-400/20
                                                active:scale-95
                                                flex items-center justify-center"
                            >
                                <span className="relative text-base">
                                    Нэвтрэх
                                    {/* Доорх жижиг зураас hover хийхэд гарч ирнэ */}
                                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
                                </span>
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
                <div className="md:hidden bg-white border-t border-gray-50 px-4 pt-2 pb-6 space-y-1">
                    <Link href="/home" className="block py-2 text-black hover:text-amber-400">Нүүр</Link>

                    {/* Mobile Dropdown */}
                    <div>
                        <button
                            onClick={() => setIsServiceOpen(!isServiceOpen)}
                            className="flex items-center justify-between w-full py-2 text-black hover:text-amber-400"
                        >
                            Үйлчилгээ <ChevronDown className={`w-4 h-4 transform ${isServiceOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isServiceOpen && (
                            <div className="pl-4 bg-gray-50 rounded-lg mt-1 border-l-2 border-amber-400">
                                <Link href="/service/office" className="block py-2 px-2 text-sm text-gray-600">Оффис цэвэрлэгээ</Link>
                                <Link href="/service/suh" className="block py-2 px-2 text-sm text-gray-600">СӨХ цэвэрлэгээ</Link>
                                <Link href="/service/public-space" className="block py-2 px-2 text-sm text-gray-600">Олон нийтийн талбай цэвэрлэгээ</Link>
                                <Link href="/service/warehouse" className="block py-2 px-2 text-sm text-gray-600">Агуулах</Link>
                                <Link href="/service/duct" className="block py-2 px-2 text-sm text-gray-600">Агааржуулалт</Link>
                            </div>
                        )}
                    </div>

                    <Link href="/booking" className="block py-2 text-black hover:text-amber-400">Захиалга</Link>
                    <Link href="/about" className="block py-2 text-black hover:text-amber-400">Бидний тухай</Link>
                    <Link className="text-black hover:text-amber-400" href={isLoggedIn ? "/profile" : "/login"}>
                        {isLoggedIn ? "Профайл" : "Нэвтрэх"}
                    </Link>
                </div>
            )}
        </header>
    )
}