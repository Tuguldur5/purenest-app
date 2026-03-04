"use client"
import React, { createContext, useContext, useState, useEffect } from "react"
import { Product } from "../components/ProductCard" // Product төрлөө эндээс авна

type WishlistContextType = {
  wishlist: Product[]
  toggleWishlist: (product: Product) => void
  isWishlisted: (id: string | number) => boolean
  isLoading: boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [wishlist, setWishlist] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // API-ийн үндсэн URL (Та өөрийнхөөрөө солиорой)
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchWishlist = async () => {
    const token = localStorage.getItem('token');
    setIsLoading(true);
    
    if (token) {
      try {
        const res = await fetch(`${API_URL}/wishlist`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setWishlist(data);
        }
      } catch (err) {
        console.error("DB Fetch Error:", err);
      }
    } else {
      const saved = localStorage.getItem("wishlist");
      if (saved) setWishlist(JSON.parse(saved));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const toggleWishlist = async (product: Product) => {
    const token = localStorage.getItem('token');
    const exists = wishlist.find(p => String(p.id) === String(product.id));

    if (token) {
      try {
        if (exists) {
          // Устгах
          await fetch(`${API_URL}/wishlist/${product.id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          setWishlist(prev => prev.filter(p => String(p.id) !== String(product.id)));
        } else {
          // Нэмэх
          await fetch(`${API_URL}/wishlist/add`, {
            method: 'POST',
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ product_id: product.id })
          });
          setWishlist(prev => [...prev, product]);
        }
      } catch (err) {
        console.error("DB Toggle Error:", err);
      }
    } else {
      // Нэвтрээгүй үед LocalStorage
      const newWishlist = exists 
        ? wishlist.filter(p => String(p.id) !== String(product.id))
        : [...wishlist, product];
      setWishlist(newWishlist);
      localStorage.setItem("wishlist", JSON.stringify(newWishlist));
    }
  };

  const isWishlisted = (id: string | number) => 
    wishlist.some(p => String(p.id) === String(id));

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted, isLoading }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
}