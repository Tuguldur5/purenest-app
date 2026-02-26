"use client"
import React, { createContext, useContext, useState, useEffect } from "react"

type Product = {
  id: string
  name: string
  price: number
  image_url?: string
  code?: string
  unit?: string
  type?: string
}

type WishlistContextType = {
  wishlist: Product[]
  toggleWishlist: (product: Product) => void
  isWishlisted: (id: string) => boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [wishlist, setWishlist] = useState<Product[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("wishlist")
    if (saved) setWishlist(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist))
  }, [wishlist])

  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.find(p => p.id === product.id)
      if (exists) {
        return prev.filter(p => p.id !== product.id)
      } else {
        return [...prev, product]
      }
    })
  }

  const isWishlisted = (id: string) => wishlist.some(p => p.id === id)

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) throw new Error("useWishlist must be used within WishlistProvider")
  return context
}