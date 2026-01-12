import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HeaderWrapper from "./components/HeaderWrapper";
import FooterWrapper from "./components/footerWrapper";
import AuthProvider from "./components/AuthProvider"; // Доор үүнийг үүсгэнэ

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
  icons: "/nest.jpg", // public-оос авахдаа / гэж эхэлнэ
  title: {
    default: "Purenest - Цэвэрлэгээ үйлчилгээ",
    template: "%s | Purenest"
  },
  description: "Purenest: Мэргэжлийн цэвэрлэгээ, айл гэр, албан байгууллагын цэвэрлэгээний үйлчилгээ",
  keywords: ["цэвэрлэгээ", "cleaning service mongolia", "purenest", "айлын цэвэрлэгээ"],
  openGraph: {
    title: "Purenest Cleaning Service",
    description: "Мэргэжлийн цэвэрлэгээний нэгдсэн үйлчилгээ",
    url: 'https://purenest.mn', // Таны домэйн
    siteName: 'Purenest',
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
            <main className="min-h-screen">{children}</main>
            <FooterWrapper />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}