'use client'
import { useCart } from "../../context/CartContext"
import { useSiteToast } from "../../hooks/useSiteToast"
import { useRouter } from "next/navigation"
import { ShoppingCart, Info, Heart } from 'lucide-react'
import Link from 'next/link'
import { useWishlist } from "./../../context/wishlistContext"

type Props = {
    product: any
    relatedProducts: any[]
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
                    <div className="w-[600px] md:w-[1000px] flex-shrink-0 relative">
                        <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm h-[450px] md:h-full flex items-center justify-center overflow-hidden relative">
                            <img
                                src={product.image_url || '/placeholder.png'}
                                alt={product.name}
                                className="max-w-full h-full object-contain"
                            />
                            {/* ❤️ Wishlist Button */}
                            <button
                                onClick={() => toggleWishlist(product)}
                                className="absolute top-4 right-4 p-2 transition-all duration-300 hover:scale-125 active:scale-95 group"
                            >
                                <Heart
                                    size={24}
                                    className={`transition-colors duration-300 ${wishlisted
                                            ? "fill-red-500 text-red-500" // Хадгалсан үед дотор нь улаанаар дүүрч, хүрээ нь улаан болно
                                            : "fill-none text-black group-hover:text-red-400" // Хадгалаагүй үед зөвхөн хүрээ харагдана
                                        }`}
                                />
                            </button>
                        </div>
                    </div>

                    {/* БАРУУН ТАЛ: МЭДЭЭЛЭЛ */}
                    <div className="flex-grow">
                        <div className="border-b border-gray-100 pb-6 mb-6">
                            <p className="text-blue-600 text-xs font-bold uppercase mb-2">{product.type}</p>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 leading-tight">
                                {product.name}
                            </h1>
                            <p className="text-sm text-gray-400 font-sans">Барааны код: {product.code}</p>
                        </div>

                        <div className="mb-8">
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-3xl font-bold font-sans text-[#102B5A]">
                                    {Number(product.price).toLocaleString()}₮
                                </span>
                                <span className="text-gray-500 mt-2 font-medium">/{product.unit}</span>
                            </div>
                            <p className="text-xs flex items-center gap-1 text-red-500 font-medium">
                                <Info size={14} /> НӨАТ ороогүй болно
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 max-w-lg">
                            <button
                                onClick={() => {
                                    addToCart(product);
                                    router.push('/cart');
                                }}
                                className="flex-1 bg-emerald-500 text-white py-4 rounded-md font-bold text-sm hover:bg-emerald-600 transition shadow-lg"
                            >
                                ШУУД ЗАХИАЛАХ
                            </button>

                            <button
                                onClick={() => {
                                    addToCart(product);
                                    setIsCartOpen(true);
                                    showToast({ title: "Сагслагдлаа", description: "Бараа амжилттай нэмэгдлээ." });
                                }}
                                className="flex-1 bg-[#102B5A] text-white py-4 rounded-md font-bold text-sm hover:bg-[#1a3d7a] transition flex items-center justify-center gap-2 shadow-md"
                            >
                                <ShoppingCart size={18} />
                                САГСАНД НЭМЭХ
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- ИЖИЛ ТӨСТЭЙ БАРАА --- */}
                <div className="mt-20">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-8">
                        <h2 className="text-xl font-bold text-gray-900">Ижил төрлийн бүтээгдэхүүн</h2>
                        <span className="text-md font-sans font-bold text-black">{product.type}</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4">
                        {relatedProducts.map((p, index) => (
                            <div
                                key={p.id || index}
                                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
                            >
                                <Link href={`/products/${p.id}`} className="relative h-40 w-full bg-gray-50 block overflow-hidden">
                                    <img
                                        src={p.image_url || '/placeholder.png'}
                                        alt={p.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </Link>

                                <div className="p-3 flex-grow flex flex-col">
                                    <span className="text-[10px] text-gray-400 font-mono font-bold uppercase mb-1">
                                        #{p.code}
                                    </span>

                                    <Link href={`/products/${p.id}`}>
                                        <h3 className="text-xm font-sans font-bold text-gray-800 mb-2 line-clamp-2 hover:text-blue-600 h-8">
                                            {p.name}
                                        </h3>
                                    </Link>

                                    <div className="mt-auto">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-md font-sans font-bold text-[#102B5A]">
                                                {Number(p.price).toLocaleString()}₮
                                            </span>
                                            <span className="text-[10px] mt-1 font-sans text-gray-500 font-medium">/{p.unit}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}