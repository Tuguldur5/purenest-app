'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext<any>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<any[]>([])
    const [isCartOpen, setIsCartOpen] = useState(false)

    // 1. Хуудас ачаалагдах үед localStorage-оос сагсыг унших
    useEffect(() => {
        const savedCart = localStorage.getItem('purenest_cart')
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart))
            } catch (err) {
                console.error("Сагсны өгөгдөл уншихад алдаа гарлаа")
            }
        }
    }, [])

    // 2. Сагсны өгөгдөл өөрчлөгдөх бүрт localStorage-д хадгалах
    useEffect(() => {
        localStorage.setItem('purenest_cart', JSON.stringify(cart))
    }, [cart])

    const addToCart = (product: any) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id)
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id 
                    ? { ...item, quantity: (item.quantity || 1) + 1 } 
                    : item
                )
            }
            return [...prev, { ...product, quantity: 1 }]
        })
    }

    const removeFromCart = (id: string | number) => {
        setCart((prev) => prev.filter((item) => item.id !== id))
    }

    const updateQuantity = (id: string | number, quantity: number) => {
        if (quantity < 1) return
        setCart((prev) =>
            prev.map((item) => (item.id === id ? { ...item, quantity } : item))
        )
    }

    const clearCart = () => {
        setCart([])
        localStorage.removeItem('purenest_cart')
    }

    return (
        <CartContext.Provider 
            value={{ 
                cart, 
                isCartOpen, 
                setIsCartOpen, 
                addToCart, 
                removeFromCart, 
                updateQuantity, 
                clearCart 
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    return useContext(CartContext)
}