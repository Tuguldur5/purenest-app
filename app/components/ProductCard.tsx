'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, Minus, Plus, Heart } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useSiteToast } from '../hooks/useSiteToast'
import { useWishlist } from '../context/wishlistContext'

export type Product = {
    id: string | number
    name: string
    price: number
    type?: string
    image_url?: string
    unit?: string
    code?: string
}

interface ProductCardProps {
    product: Product;
    isSmall?: boolean; // Жижиг харуулах эсэхийг шийдэх prop
}

export default function ProductCard({ product, isSmall = false }: ProductCardProps) {
    const [quantity, setQuantity] = useState(1);
    const { showToast } = useSiteToast();
    const { toggleWishlist, isWishlisted } = useWishlist();
    const cartContext = useCart();

    const addToCart = cartContext?.addToCart;
    const setIsCartOpen = cartContext?.setIsCartOpen;
    const wishlisted = isWishlisted(product.id);

    const handleQuantityChange = (val: string) => {
        const num = parseInt(val);
        setQuantity(isNaN(num) || num < 1 ? 1 : num);
    };

    return (
        <div className={`group bg-white overflow-hidden border border-gray-100 flex flex-col h-full hover:shadow-md transition-all duration-500 relative ${isSmall ? 'rounded-[16px]' : 'rounded-[24px]'}`}>
            
            {/* HEART BUTTON */}
            <button
                onClick={(e) => {
                    e.preventDefault();
                    toggleWishlist(product);
                }}
                className={`absolute z-10 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 active:scale-90 transition-all ${isSmall ? 'top-2 right-2 p-1.5' : 'top-3 right-3 p-2'}`}
            >
                <Heart
                    size={isSmall ? 16 : 20}
                    className={`transition-colors duration-300 ${wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                />
            </button>

            {/* IMAGE */}
            <Link href={`/products/${product.id}`} className="block overflow-hidden bg-[#F9F9F9] aspect-square">
                <img
                    src={product.image_url || '/placeholder.png'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
            </Link>

            {/* INFO */}
            <div className={`flex-grow flex flex-col ${isSmall ? 'p-3' : 'p-4'}`}>
                {/* Кодыг зөвхөн том карт дээр харуулна */}
                {!isSmall && (
                    <span className="text-[10px] font-black text-amber-500 mb-1 uppercase tracking-widest">#{product.code}</span>
                )}
                
                <Link href={`/products/${product.id}`}>
                    <h3 className={`font-bold text-gray-800 line-clamp-2 mb-3 hover:text-[#102B5A] ${isSmall ? 'text-[12px] min-h-[32px]' : 'text-sm min-h-[40px]'}`}>
                        {product.name}
                    </h3>
                </Link>

                <div className="mt-auto">
                    <div className={`flex items-baseline gap-1 ${isSmall ? 'mb-1' : 'mb-2'}`}>
                        <span className={`font-bold text-[#102B5A] ${isSmall ? 'text-sm' : 'text-lg'}`}>
                            {Number(product.price).toLocaleString()}₮
                        </span>
                        <span className={`text-gray-400 ${isSmall ? 'text-[8px]' : 'text-[10px]'}`}>/ {product.unit}</span>
                    </div>

                    {/* Тоо хэмжээ сонгогчийг зөвхөн том карт дээр харуулна */}
                    {!isSmall && (
                        <div className="grid grid-cols-3 bg-gray-50 text-black rounded-xl p-1 mb-3">
                            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="h-8 flex items-center text-black justify-center bg-white rounded-lg shadow-sm">
                                <Minus size={12} />
                            </button>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => handleQuantityChange(e.target.value)}
                                className="bg-transparent text-center text-xs font-bold outline-none w-full"
                            />
                            <button onClick={() => setQuantity(q => q + 1)} className="h-8 flex items-center justify-center bg-white text-black rounded-lg shadow-sm">
                                <Plus size={12} />
                            </button>
                        </div>
                    )}

                    <button
                        onClick={() => {
                            addToCart?.({ ...product, quantity });
                            setIsCartOpen?.(true);
                            showToast({
                                title: "Амжилттай",
                                description: `${product.name} сагслагдлаа.`
                            });
                        }}
                        className={`w-full bg-[#102B5A] text-white font-bold rounded-xl hover:bg-amber-500 transition-all flex items-center justify-center gap-2 ${isSmall ? 'text-[10px] py-2' : 'text-[11px] py-3'}`}
                    >
                        <ShoppingCart size={isSmall ? 12 : 14} /> 
                        {isSmall ? 'НЭМЭХ' : 'САГСЛАХ'}
                    </button>
                </div>
            </div>
        </div>
    );
}