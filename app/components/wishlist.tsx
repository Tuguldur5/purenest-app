"use client"
import { useWishlist } from "../context/wishlistContext"
import { ShoppingCart, Trash2 } from "lucide-react"
import { useCart } from "../context/CartContext"
import { useSiteToast } from "../hooks/useSiteToast"

export default function WishlistPage() {
  const { wishlist, toggleWishlist } = useWishlist()
  const { addToCart, setIsCartOpen } = useCart()
  const { showToast } = useSiteToast()

  if (wishlist.length === 0)
    return <div className="text-center py-20">Хадгалсан бараа байхгүй байна.</div>

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {wishlist.map(p => (
        <div key={p.id} className="border border-black/5  rounded-lg  p-4 relative">
          <img src={p.image_url} className="w-full h-40 rounded-lg object-cover" />
          
          <button
            onClick={() => toggleWishlist(p)}
            className="absolute top-2 right-2 p-2 bg-white rounded-full hover:bg-red-100"
          >
            <Trash2 size={16} />
          </button>

          <h3 className="mt-2 font-bold">{p.name}</h3>
          <p className="text-[#102B5A] font-bold">{Number(p.price).toLocaleString()}₮</p>
          <button
            onClick={() => {
              addToCart(p)
              setIsCartOpen(true)
              showToast({ title: "Сагсанд нэмэгдлээ", description: p.name })
            }}
            className="mt-2 w-full py-2 bg-[#102B5A] text-white rounded flex items-center justify-center gap-2"
          >
            <ShoppingCart size={16} /> Сагсанд хийх
          </button>
        </div>
      ))}
    </div>
  )
}