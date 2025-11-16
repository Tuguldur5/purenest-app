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

                {/* Contact */}
                <div>
                    <h3 className="text-xl font-semibold mb-3">Холбоо барих</h3>
                    <p>Утас: +976 9900-0000</p>
                    <p>Email: contact@purenest.mn</p>
                    <p>Хаяг: Улаанбаатар, Монгол</p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-xl font-semibold mb-3">Хурдан Холбоос</h3>
                    <ul className="space-y-2">
                        <li><Link className="hover:text-[#E3BE72]" href="/">Нүүр</Link></li>
                        <li><Link className="hover:text-[#E3BE72]" href="/service">Үйлчилгээ</Link></li>
                        <li><Link className="hover:text-[#E3BE72]" href="/booking">Захиалах</Link></li>
                        <li><Link className="hover:text-[#E3BE72]" href="/faq">FAQ</Link></li>
                    </ul>
                </div>

                {/* Social icons */}
                <div>
                    <h3 className="text-xl font-semibold mb-3">Сошиал</h3>
                    <div className="flex items-center gap-4">
                        <a href="#" className="hover:text-[#E3BE72] transition duration-200">
                            <FaFacebook size={size} color={color} />
                        </a>
                        <a href="#" className="hover:text-[#E3BE72] transition duration-200">
                            <FaInstagram size={size} color={color} />
                        </a>
                        <a href="#" className="hover:text-[#E3BE72] transition duration-200">
                            <FaViber size={size} color={color} />
                        </a>
                        </div>
                    </div>
            </div>

            <p className="text-center text-sm mt-8 opacity-70">
                © {new Date().getFullYear()} Purenest — All rights reserved.
            </p>
        </footer>
    );
}
