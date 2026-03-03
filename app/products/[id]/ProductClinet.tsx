'use client'
import { useCart } from "../../context/CartContext"
import { useSiteToast } from "../../hooks/useSiteToast"
import { useRouter } from "next/navigation"
import { ShoppingCart, Info, Heart } from 'lucide-react'
import { useWishlist } from "./../../context/wishlistContext"
// ProductCard болон Product төрлийг импортлох
import ProductCard, { Product } from '../../components/ProductCard' 

type Props = {
    product: Product
    relatedProducts: Product[]
}

export default function ProductClient({ product, relatedProducts }: Props) {
    const { addToCart, setIsCartOpen } = useCart()
    const { showToast } = useSiteToast()
    const router = useRouter()
    const { toggleWishlist, isWishlisted } = useWishlist()
    const wishlisted = isWishlisted(product.id)

    return (
        <div className="container max-8xl mx-auto px-4 bg-white min-h-screen py-14">
            <div className="max-w-8xl mx-auto px-4">

                {/* ҮНДСЭН БАРААНЫ МЭДЭЭЛЭЛ */}
                <div className="flex flex-col md:flex-row gap-12 mb-20">
                    {/* ЗҮҮН ТАЛ: ЗУРАГ */}
                    <div className="w-full md:w-1/2 flex-shrink-0 relative">
                        <div className="border border-gray-100 rounded-3xl p-8 bg-[#F9F9F9] h-[450px] md:h-[600px] flex items-center justify-center overflow-hidden relative">
                            <img
                                src={product.image_url || '/placeholder.png'}
                                alt={product.name}
                                className="max-w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                            />
                            <button
                                onClick={() => toggleWishlist(product)}
                                className="absolute top-6 right-6 p-3 bg-white rounded-full shadow-sm transition-all duration-300 hover:scale-110 active:scale-90 group"
                            >
                                <Heart
                                    size={24}
                                    className={`transition-colors duration-300 ${wishlisted
                                            ? "fill-red-500 text-red-500"
                                            : "fill-none text-gray-400 group-hover:text-red-400"
                                        }`}
                                />
                            </button>
                        </div>
                    </div>

                    {/* БАРУУН ТАЛ: МЭДЭЭЛЭЛ */}
                    <div className="flex-grow py-4">
                        <div className="border-b border-gray-100 pb-6 mb-6">
                            <p className="text-amber-500 text-xs font-black uppercase tracking-widest mb-3">#{product.code}</p>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                                {product.name}
                            </h1>
                            <div className="inline-block px-3 py-1 bg-blue-50 text-[#102B5A] text-xs font-bold rounded-full">
                                {product.type}
                            </div>
                        </div>

                        <div className="mb-10">
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-4xl font-bold text-[#102B5A]">
                                    {Number(product.price).toLocaleString()}₮
                                </span>
                                <span className="text-gray-400 text-lg font-medium">/{product.unit}</span>
                            </div>
                            <p className="text-sm flex items-center gap-1.5 text-red-500 font-semibold">
                                <Info size={16} /> НӨАТ ороогүй үнэ
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 max-w-xl">
                            <button
                                onClick={() => {
                                    addToCart?.({ ...product, quantity: 1 });
                                    router.push('/cart');
                                }}
                                className="flex-1 bg-emerald-500 text-white py-4 rounded-2xl font-bold text-sm hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100"
                            >
                                ШУУД ХУДАЛДАН АВАХ
                            </button>

                            <button
                                onClick={() => {
                                    addToCart?.({ ...product, quantity: 1 });
                                    setIsCartOpen?.(true);
                                    showToast({ title: "Амжилттай", description: "Сагсанд нэмэгдлээ." });
                                }}
                                className="flex-1 bg-[#102B5A] text-white py-4 rounded-2xl font-bold text-sm hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100"
                            >
                                <ShoppingCart size={18} /> САГСАНД НЭМЭХ
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- ИЖИЛ ТӨСТЭЙ БАРАА (ШИНЭЧЛЭГДСЭН) --- */}
                <div className="mt-20">
                    <div className="flex items-center justify-between mb-8 border-b pb-4">
                        <h2 className="text-2xl font-bold text-gray-800">Ижил төрлийн бүтээгдэхүүн</h2>
                        <span className="px-4 py-1 bg-gray-100 rounded-full text-sm font-bold text-gray-500">
                            {relatedProducts.length} бараа
                        </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {relatedProducts.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}