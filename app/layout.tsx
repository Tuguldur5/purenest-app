import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HeaderWrapper from "./components/HeaderWrapper";
import FooterWrapper from "./components/footerWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  icons: "./public/nest.jpg",
  title: "Purenest",
  description: "Purenest cleaning service",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn">
      <body>
        <div className="min-h-screen bg-white flex flex-col">
          <HeaderWrapper />
          <main className="min-h-screen">{children}</main>
          <FooterWrapper />
        </div>
      </body>
    </html>
  );
}
