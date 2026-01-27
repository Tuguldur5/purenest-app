import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HeaderWrapper from "./components/HeaderWrapper";
import FooterWrapper from "./components/footerWrapper";
import AuthProvider from "./components/AuthProvider"; // Доор үүнийг үүсгэнэ
import { ToastProvider } from "./hooks/useSiteToast";

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
    default: "Purenest | Мэргэжлийн цэвэрлэгээний үйлчилгээ",
    template: "%s | Purenest"
  },
  description: "Оффис, СӨХ, айл гэр болон олон нийтийн талбайн мэргэжлийн цэвэрлэгээ. Purenest - Таны тав тухтай орчин.",
  keywords: [
    "цэвэрлэгээ", "цэвэрлэгээний үйлчилгээ", "айлын цэвэрлэгээ", 
    "оффис цэвэрлэгээ", "сөх цэвэрлэгээ", "purenest", "cleaning service mongolia"
  ],
  openGraph: {
    title: "Purenest - Цэвэрлэгээний үйлчилгээ",
    description: "Мэргэжлийн цэвэрлэгээний нэгдсэн үйлчилгээ. Найдвартай хамт олон.",
    url: 'https://purenest.mn',
    siteName: 'Purenest',
    // 2. СОШИАЛД ЗУРАГ ХАРАГДАХ ХЭСЭГ:
    images: [
      {
        url: '/nest.jpg', // Энэ зургийн замыг public/ дотор байгаа зөв зургаар солиорой
        width: 1200,
        height: 630,
      }
    ],
    locale: 'mn_MN',
    type: 'website',
  },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* NextAuth-ийн Provider-оор ороож байна */}
        <AuthProvider>
          <div className="min-h-screen bg-white flex flex-col">
            <HeaderWrapper />
            <ToastProvider>
            <main className="min-h-screen">{children}
            </main>
            </ToastProvider>
            <FooterWrapper />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}