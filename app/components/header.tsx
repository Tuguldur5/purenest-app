'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // useRouter-ийг импортлох
import { FaUserCircle } from 'react-icons/fa';

export default function Header() {
    // 💡 Header функцийг дотор нь тодорхойлсныг устгаж, шууд Header функцийг ашиглаж байна.

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
        <header className="bg-white border border-black/5 shadow-md text-black z-50">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between" style={{fontFamily:"arial"}}>
                <Link href="/home" className=" flex text-xl font-semibold ">
                    <img src="./nest.jpg" alt="Logo" width={70} height={70} className='rounded-lg' />
                    <span className="ml-4 mt-3 text-3xl text-[#e2bd6e] "
                        style={{ fontFamily: 'Montserrat' }}
                    >Purenest Service</span>
                </Link>

                <nav className="hidden md:flex items-center gap-10">
                    <Link
                        href="/home"
                        className="hover:text-amber-400 px-3 py-2 rounded-md transition-colors duration-300 flex items-center"
                    > Нүүр
                    </Link>

                    {/* Үйлчилгээ Dropdown */}
                    <div className="relative group z-50">
                        <button className="block px-4 py-2 hover:text-amber-400 rounded-lg transition-colors duration-300">Үйлчилгээ</button>
                        <div className="absolute left-0 bg-white rounded-lg w-45 shadow-lg hidden group-hover:block">
                            <Link className="block px-4 py-2 hover:text-amber-400 rounded-lg transition-colors duration-300" href="/service/office">Оффис</Link>
                            <Link className="block px-4 py-2 hover:text-amber-400 rounded-lg transition-colors duration-300" href="/service/suh">СӨХ</Link>
                            <Link className="block px-4 py-2 hover:text-amber-400 rounded-lg transition-colors duration-300" href="/service/public-space">Олон нийтийн талбай</Link>
                        </div>
                    </div>

                    <Link href="/booking" className="hover-mustard block px-4 py-2 hover:text-amber-400 rounded-lg transition-colors duration-300">Захиалга</Link>

                    {/* Бусад Dropdown */}
                    <div className="relative group z-50 ">
                        <button className="hover-mustard items-center block px-4 py-2 hover:text-amber-400 rounded-lg transition-colors duration-300">Бусад</button>
                        <div className="absolute left-0 bg-white rounded-lg shadow-lg hidden group-hover:block w-52 py-2 transition-all duration-300">
                            <Link className="block px-4 py-2 rounded-lg block px-4 py-2 hover:text-amber-400 rounded-lg transition-colors duration-300 " href="/about">Бидний тухай</Link>
                            <Link className="block px-4 py-2 rounded-lg block px-4 py-2 hover:text-amber-400 rounded-lg transition-colors duration-300" href="/faq">Түгээмэл асуултууд</Link>
                        </div>
                    </div>

                    {/* Хэрэглэгчийн Төлөв (Login/Profile) */}
                    <div className="flex items-center">
                        {isLoggedIn ? (
                            // ✅ Нэвтэрсэн үед: Profile Icon болон Гарах товч
                            <div className="flex items-center space-x-4">
                                <Link href="/profile" className="text-[#102B5A] hover:text-amber-400 transition-colors duration-300">
                                    <FaUserCircle size={35} />
                                </Link>
                                
                            </div>
                        ) : (
                            // ❌ Нэвтрээгүй үед: Нэвтрэх товч
                            <Link href="/login" className="hover-mustard border text-white bg-[#102B5A] border-black p-2 ml-5 pl-4 pr-4
                                shadow-md rounded-md hover:bg-gray-700 rounded-lg transition-colors duration-300">
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