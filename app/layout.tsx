import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/header";
import Footer from "./components/footer";
import Loading from "./loading";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mn">
      <body>
        <div className="min-h-screen bg-white flex flex-col">
          <Header />

          <main className="flex-1 min-h-110">
            {children}
          </main>

          <Footer />
        </div>
      </body>
    </html>
  );
}
