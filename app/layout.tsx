import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HeaderWrapper from "./components/HeaderWrapper";
import FooterWrapper from "./components/footerWrapper";
import AuthProvider from "./components/AuthProvider"; // Доор үүнийг үүсгэнэ
import { ToastProvider } from "./hooks/useSiteToast";
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from "../app/context/wishlistContext";
//  Замаа зөв заагаарай
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const baseUrl = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3000'
  : 'https://purenest.mn';

export const metadata: Metadata = {
  // 1. АНХААРУУЛГЫГ АРИЛГАХ ЧУХАЛ ХЭСЭГ:
  metadataBase: new URL(baseUrl),

  icons: {
    icon: [
      { url: '/nest1.jpg' }, // Ерөнхий icon
      { url: '/nest1.jpg', sizes: '32x32', type: 'image/jpeg' }, // Хэмжээ зааж өгөх
    ],
    shortcut: '/nest1.jpg',
    apple: '/nest1.jpg',
  },

  title: {
    default: "Purenest | Мэргэжлийн цэвэрлэгээний үйлчилгээ (Cleaning Service)",
    template: "%s | Purenest"
  },
  description: "Purenest: Мэргэжлийн цэвэрлэгээний нэгдсэн үйлчилгээ. Оффис, СӨХ, айл гэр, засварын дараах цэвэрлэгээг чанартай гүйцэтгэнэ. Professional cleaning services in Ulaanbaatar.",

  keywords: [
    "цэвэрлэгээ", "tseverlegee", "tsewerlegee", "цэвэрлэгээний үйлчилгээ", "tseverlegeenii uilchilgee", "оффис цэвэрлэгээ", "office cleaning mongolia",
    "СӨХ цэвэрлэгээ", "SOH tseverlegee", "агуулах цэвэрлэгээ", "agualah tseverlegee", "агааржуулалтын хоолой цэвэрлэгээ", "agaarjuulaltiin hooloi tseverlegee",
    "duct cleaning mongolia", "purenest cleaning mongolia", "duct tseverlegee", "purenest tseverlegee", "purenest cleaning service", "warehouse cleaning mongolia", "агуулахын цэвэрлэгээ", "agualahiin tseverlegee",
    "purenest", "пюренест", "pure nest", "cleaning service ulaanbaatar"
  ],

  openGraph: {
    title: "Purenest - Мэргэжлийн цэвэрлэгээний үйлчилгээ",
    description: "Таны тав тухтай орчныг бид бүтээнэ. Найдвартай, түргэн шуурхай цэвэрлэгээ.",
    url: 'https://purenest.mn',
    siteName: 'Purenest Cleaning',
    images: [
      {
        url: '/og-image.jpg', // 1200x630 хэмжээтэй зураг байвал хамгийн сайн
        width: 1200,
        height: 630,
        alt: 'Purenest Cleaning Service Mongolia',
      }
    ],
    locale: 'mn_MN',
    type: 'website',
  },

  // Роботуудад сайтыг индексжүүлэхийг зөвшөөрөх
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* NextAuth-ийн Provider-оор ороож байна */}
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <div className="min-h-screen bg-white flex flex-col">
                <HeaderWrapper />
                <ToastProvider>
                  <main className="min-h-screen">
                    {children}
                  </main>
                </ToastProvider>
                <FooterWrapper />
              </div>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}