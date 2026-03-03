"use client"
import { useWishlist } from "../context/wishlistContext"
import { Heart } from "lucide-react"
import Link from "next/link"
import ProductCard from "../components/ProductCard" // Таны ProductCard-ын зам

export default function WishlistPage() {
  const { wishlist } = useWishlist()

  if (wishlist.length === 0)
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <Heart size={64} className="text-gray-200 mb-4" />
        <p className="text-gray-500 font-medium">Хадгалсан бараа байхгүй байна.</p>
        <Link href="/products" className="mt-4 text-[#102B5A] font-bold border-b border-[#102B5A]">
          Дэлгүүр хэсэх
        </Link>
      </div>
    )

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 font-sans">Миний хүсэлт ({wishlist.length})</h1>
        <Link href="/products" className="text-sm text-blue-600 font-medium hover:underline">
          + Бараа нэмэх
        </Link>
      </div>
      
      {/* grid-cols-6 хүртэл ихэсгэж, gap-г багасгаж барааг жижиг харагдуулна */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
        {wishlist.map(p => (
          <div key={p.id} className="relative group">
            {/* ProductCard-ийг жижиг хэлбэрээр дуудах */}
            <ProductCard product={p} isSmall={true} />
            
            {/* Устгах товчийг картын гадна эсвэл дээр нь overlay байдлаар тавьж болно */}
          </div>
        ))}
      </div>
    </div>
  )
}