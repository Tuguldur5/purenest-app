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
                    <p className="font-text-gray-300">
                        <strong>Утас:</strong>
                        <a
                            href="tel:+97699069162"
                            className="ml-1 hover:text-amber-400 transition"
                        >
                            +976 9906 9162
                        </a>
                        <span className="mx-2 text-gray-500">|</span>
                        <a
                            href="tel:+97690504700"
                            className="hover:text-amber-400 transition"
                        >
                            +976 9050 4700
                        </a>
                    </p>

                    <p className="mt-2">
                        <span className="font-semibold">Email:</span>{" "}
                        <span
                            onClick={() => navigator.clipboard.writeText("Sales@purenest.mn")}
                            className="cursor-pointer hover:text-amber-400 transition-colors"
                        >
                            Sales@purenest.mn
                        </span>
                    </p>

                    <p className="mt-2">
                        <span className="font-semibold">Хаяг:</span>{" "}
                        <span
                            onClick={() =>
                                navigator.clipboard.writeText(
                                    "Хан-Уул дүүрэг, 3-р хороо, Чингисийн өргөн чөлөө, Анун төв"
                                )
                            }
                            className="cursor-pointer hover:text-amber-400 transition-colors"
                        >
                            Хан-Уул дүүрэг, 3-р хороо, Чингисийн өргөн чөлөө, Анун төв
                        </span>
                    </p>


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
                        <a
                            href="https://www.facebook.com/profile.php?id=61586191476127"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-amber-400 transition duration-200"
                        >
                            <FaFacebook size={size} />
                        </a>

                        <a
                            href="viber://chat?number=%2B97699069162"
                            className="hover:text-[#E3BE72] transition duration-200"
                        >
                            <FaViber size={size} />
                        </a>

                    </div>
                </div>
            </div>

            <p className="text-center text-sm mt-8 -mb-5">
                © {new Date().getFullYear()} Purenest.mn
            </p>
        </footer>
    );
}
