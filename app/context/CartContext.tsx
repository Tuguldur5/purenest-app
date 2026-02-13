'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext<any>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<any[]>([])
    const [isCartOpen, setIsCartOpen] = useState(false)

    useEffect(() => {
        const handleStorageChange = () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setCart([]); // Системээс гарсан бол сагсыг шууд хоослох
                localStorage.removeItem('purenest_cart');
            }
        };

        // Эхний удаа шалгах
        handleStorageChange();

        // Бусад таб дээр Logout хийхийг сонсох
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // 2. Хэрэглэгч бүрт өөр өөр сагс хадгалах (Сонголтоор)
    // Сагсаа хадгалахдаа 'purenest_cart' гэхийн оронд хэрэглэгчийн ID-г ашиглавал 
    // дараа нэвтрэхэд нь сагс нь хэвээрээ байх боломжтой.
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const storageKey = user.id ? `cart_${user.id}` : 'guest_cart';
        
        // Хадгалах
        if (cart.length > 0) {
            localStorage.setItem(storageKey, JSON.stringify(cart));
        }
    }, [cart]);
    
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
        
        // Хэрэв бараа сагсанд нэмэгдэхдээ өөрийн гэсэн quantity-тай ирвэл түүнийг авна, 
        // байхгүй бол 1-ийг авна.
        const amountToAdd = product.quantity ? Number(product.quantity) : 1;

        if (existing) {
            return prev.map((item) =>
                item.id === product.id 
                    ? { ...item, quantity: (item.quantity || 0) + amountToAdd } 
                    : item
            )
        }
        
        // Шинээр нэмэхдээ мөн сонгосон тоог нь оноож өгнө
        return [...prev, { ...product, quantity: amountToAdd }]
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