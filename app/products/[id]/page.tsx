'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useCart } from '../../context/page'
import Link from 'next/link'
import { useSiteToast } from '../../hooks/useSiteToast'
import { ShoppingCart, ChevronLeft, Info } from 'lucide-react'

export default function ProductDetail() {
    const { id } = useParams()
    const router = useRouter()
    const [product, setProduct] = useState<any>(null)
    const [relatedProducts, setRelatedProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const { addToCart, setIsCartOpen } = useCart()
    const { showToast } = useSiteToast()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`https://purenest-app.onrender.com/api/products/${id}`)
                const data = await res.json()
                setProduct(data)

                const allRes = await fetch(`https://purenest-app.onrender.com/api/products`)
                const allData = await allRes.json()
                // Ижил төрлийн барааг шүүх
                setRelatedProducts(allData.filter((p: any) => p.type === data.type && p.id !== data.id).slice(0, 6))
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        if (id) fetchData()
    }, [id])

    if (loading) return <div className="flex justify-center py-40 text-gray-400">Уншиж байна...</div>
    if (!product) return <div className="text-center py-40">Бараа олдсонгүй.</div>

    return (
        <div className="container mx-auto px-4 bg-white min-h-screen py-14">
            <div className="max-w-8xl mx-auto px-4">

                {/* ҮНДСЭН БАРААНЫ МЭДЭЭЛЭЛ */}
                <div className="flex flex-col md:flex-row gap-12 mb-20">
                    {/* ЗҮҮН ТАЛ: ЗУРАГ */}
                    <div className="w-[600px] md:w-[1500px] flex-shrink-0">
                        <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm h-[450px] md:h-full mr-4 flex items-center justify-center overflow-hidden">
                            <img
                                src={product.image_url || '/placeholder.png'}
                                alt={product.name}
                                className="max-w-full h-full object-contain"
                            />
                        </div>
                    </div>

                    {/* БАРУУН ТАЛ: МЭДЭЭЛЭЛ */}
                    <div className="flex-grow">
                        <div className="border-b border-gray-100 pb-6 mb-6">
                            <p className="text-blue-600 text-xs font-bold uppercase mb-2">{product.type}</p>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 leading-tight">
                                {product.name}
                            </h1>
                            <p className="text-sm text-gray-400 font-mono">Барааны код: {product.code}</p>
                        </div>

                        <div className="mb-8">
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-3xl font-bold text-[#102B5A]">
                                    {Number(product.price).toLocaleString()}₮
                                </span>
                                <span className="text-gray-500 font-medium">/ {product.unit}</span>
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

                {/* --- ИЖИЛ ТӨСТЭЙ БАРАА ХЭСЭГ --- */}
                <div className="mt-20">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-8">
                        <h2 className="text-xl font-bold text-gray-900">Ижил төрлийн бүтээгдэхүүн</h2>
                        <span className="text-sm text-gray-400">{product.type}</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4">
                        {relatedProducts.map((p, index) => (
                            <div
                                key={p.id || index}
                                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
                            >
                                {/* IMAGE */}
                                <Link href={`/products/${p.id}`} className="relative h-40 w-full bg-gray-50 block overflow-hidden">
                                    <img
                                        src={p.image_url || '/placeholder.png'}
                                        alt={p.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-2 left-2 bg-[#102b5a] backdrop-blur-sm text-white font-bold px-2 py-0.5 rounded-md">
                                        {p.type}
                                    </div>
                                </Link>

                                {/* INFO */}
                                <div className="p-3 flex-grow flex flex-col">
                                    <span className="text-[10px] text-gray-400 font-mono font-bold uppercase mb-1">
                                        #{p.code}
                                    </span>

                                    <Link href={`/products/${p.id}`}>
                                        <h3 className="text-xs font-bold text-gray-800 mb-2 line-clamp-2 hover:text-blue-600 h-8">
                                            {p.name}
                                        </h3>
                                    </Link>

                                    <div className="mt-auto">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-md font-black text-[#102B5A]">
                                                {Number(p.price).toLocaleString()}₮
                                            </span>
                                            <span className="text-[10px] text-gray-500 font-medium">/ {p.unit}</span>

                                        </div>
                                        <p className="text-[10px] text-red-500 font-bold mt-1 flex items-center gap-1">
                                            <Info size={12} /> НӨАТ-гүй
                                        </p>
                                    </div>
                                </div>

                                {/* ACTION BUTTON */}
                                <div className="p-3 pt-0">
                                    <button
                                        onClick={() => {
                                            addToCart?.(p);
                                            setIsCartOpen?.(true);
                                            showToast({
                                                title: "Сагслагдлаа",
                                                description: `${p.name} сагсанд нэмэгдлээ.`
                                            });
                                        }}
                                        className="w-full bg-[#102B5A] text-white text-[10px] font-bold py-2.5 rounded-xl hover:bg-amber-500 transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <ShoppingCart size={12} />
                                        САГСЛАХ
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* --- ХЭСЭГ ТӨГСӨВ --- */}

            </div>
        </div>
    )
}