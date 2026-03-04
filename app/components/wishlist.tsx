"use client"
import { useWishlist } from "../context/wishlistContext"
import { Heart, Trash2 } from "lucide-react"
import Link from "next/link"
import ProductCard from "../components/ProductCard"

export default function WishlistPage() {
  const { wishlist, toggleWishlist, isLoading } = useWishlist()

  if (isLoading) return <div className="py-40 text-center">Уншиж байна...</div>

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
      <h1 className="text-2xl font-bold mb-8">Миний хүсэлт ({wishlist.length})</h1>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {wishlist.map(p => (
          <div key={p.id} className="relative group">
            <ProductCard product={p} isSmall={true} />
            {/* Устгах товч */}
            <button 
              onClick={() => toggleWishlist(p)}
              className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}