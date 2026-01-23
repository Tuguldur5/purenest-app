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

// SEO тохиргоо энд байна
export const metadata: Metadata = {
  icons: "/nest.jpg", // Энэ нь хөтчийн tab дээрх жижиг зураг (favicon)
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
    images: [
      {
        url: '/purenest.jpg', // Хайлт болон сошиалд харагдах зураг
        width: 500,
        height: 300,
        alt: 'Purenest Cleaning Service',
      },
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