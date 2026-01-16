import Link from "next/link";
import { FaFacebook, FaInstagram, FaViber } from "react-icons/fa";

interface SocialIconsProps {
size?: number; 
  color?: string; // өнгө
}
export default function Footer({ size = 28, color = "white" }: SocialIconsProps) {
    return (
        <footer className="w-full bg-[#102B5A] text-white py-10 px-6 mt-10">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

                <div>
                    <h3 className="text-xl font-semibold mb-3">Холбоо барих</h3>
                    <p  className="hover:text-amber-400">Утас: +976 12345678</p>
                    <p  className="hover:text-amber-400">Email: Sales@purenest.mn</p>
                    <p  className="hover:text-amber-400">Хаяг: Улаанбаатар, Монгол</p>
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-3">Хурдан Холбоос</h3>
                    <ul className="space-y-2">
                        <li><Link className="hover:text-amber-400" href="/">Нүүр</Link></li>
                        <li><Link className="hover:text-amber-400" href="/booking">Захиалга</Link></li>
                        <li><Link className="hover:text-amber-400" href="/about">Бидний тухай</Link></li>
                        <li><Link className="hover:text-amber-400" href="/faq">Түгээмэл асуултууд</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-3">Сошиал</h3>
                    <div className="flex items-center gap-4">
                        <a href="#" className="hover:text-amber-400 transition duration-200">
                            <FaFacebook size={size}  />
                        </a>
                        <a href="#" className="hover:text-[#E3BE72] transition duration-200">
                            <FaInstagram size={size} />
                        </a>
                        <a href="#" className="hover:text-[#E3BE72] transition duration-200">
                            <FaViber size={size} />
                        </a>
                        </div>
                    </div>
            </div>

            <p className="text-center text-sm mt-8 -mb-5">
                © {new Date().getFullYear()} Purenest — Бүх эрх хуулиар хамгаалагдсан.
            </p>
        </footer>
    );
}
