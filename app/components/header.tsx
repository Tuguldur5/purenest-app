'use client'
import Link from 'next/link'
import { useState } from 'react'


export default function Header() {
    const [open, setOpen] = useState(false)
    return (
        <header className="bg-white border border-black/5 shadow-md text-black z-50"
                style={{
                    borderRadius: '0 0 100px'
                    }}>
             <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <Link href="/home" className=" flex text-xl font-semibold ">
                <img src="./nest.jpg" alt="Logo" width={70} height={70} className='rounded-lg'/>
                 <span className="ml-4 text-2xl mt-4 text-[#e2bd6e] font-bold">Purenest Service</span>
                </Link>
                
                <nav className="hidden md:flex items-center gap-10 group-hover:text-[#E3BE72] transform duration-300">
                    <Link 
                        href="/home" 
                        className="hover:text-amber-400 hover:bg-[#102B5A] px-3 py-2 rounded-md transition-colors duration-300 flex items-center"
                        > Нүүр
                    </Link>

                    <div className="relative group z-50">
                        <button className="block px-4 py-2 hover:bg-[#102B5A] hover:text-amber-400 rounded-lg transition-colors duration-300">Үйлчилгээ</button>
                        <div className="absolute left-0 bg-white rounded-lg w-45 shadow-lg hidden group-hover:block">
                            <Link className="block px-4 py-2  hover:text-amber-400 rounded-lg transition-colors duration-300" href="/service/office">Оффис</Link>
                            <Link className="block px-4 py-2  hover:text-amber-400 rounded-lg transition-colors duration-300" href="/service/suh">СӨХ</Link>
                            <Link className="block px-4 py-2  hover:text-amber-400 rounded-lg transition-colors duration-300" href="/service/public-space">Олон нийтийн талбай</Link>
                        </div>

                    </div>

                    <Link href="/booking" className="hover-mustard block px-4 py-2 hover:bg-[#102B5A] hover:text-amber-400 rounded-lg transition-colors duration-300">Захиалга</Link>

                    <div className="relative group z-50 ">
                        <button className="hover-mustard items-center block px-4 py-2 hover:bg-[#102B5A] hover:text-amber-400 rounded-lg transition-colors duration-300">Бусад</button>

                        <div className="absolute left-0 bg-white rounded-lg shadow-lg hidden group-hover:block w-52 py-2 transition-all duration-300">
                            <Link className="block px-4 py-2  rounded-lg block px-4 py-2 hover:text-amber-400 rounded-lg transition-colors duration-300 " href="/about">Бидний тухай</Link>
                            <Link className="block px-4 py-2  rounded-lg block px-4 py-2 hover:text-amber-400 rounded-lg transition-colors duration-300" href="/faq">Түгээмэл асуултууд</Link>
                        </div>
                        </div>

                    <Link href="/login" className="hover-mustard border text-white bg-[#102B5A] border-black p-2 ml-5 pl-4 pr-4 shadow-md rounded-md hover:text-amber-400 rounded-lg transition-colors duration-300">Нэвтрэх</Link>
                </nav>

                {/* Mobile */}
                <div className="md:hidden">
                    <button onClick={() => setOpen(!open)} aria-label="menu">☰</button>
                </div>
            </div>

            {open && (
                <div className="md:hidden border-t">
                    <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
                        <Link href="/home">Нүүр</Link>
                        <Link href="/service">ҮЙлчилгээ</Link>
                        <Link href="/booking">Захиалга</Link>
                        <Link href="/about">Бидний тухай</Link>
                        <Link href="/faq">Түгээмэл асуултууд</Link>
                        <Link href="/login">Нэвтрэх</Link>
                    </div>
                </div>
            )}
        </header>
    )
}