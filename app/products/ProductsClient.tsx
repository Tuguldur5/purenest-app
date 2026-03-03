'use client'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { ShoppingCart, Info, Filter, Minus, Plus, Heart } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useSiteToast } from '../hooks/useSiteToast'
import Loading from '../loading'
import { useWishlist } from '../context/wishlistContext'
import ProductCard from '../components/ProductCard'
type Product = {
    id: string
    name: string
    price: number
    type?: string
    image_url?: string
    unit?: string
    code?: string
}

type Props = {
    products: Product[]
}

export default function ProductsClient({ products }: Props) {
    const [filter, setFilter] = useState("Бүгд")
    const [sort, setSort] = useState("default")
    const [loading, setLoading] = useState(false)

    // Ангиллууд
    const types = ["Бүгд", ...new Set(products.map(p => p.type || "Бусад"))]

    // Шүүх + эрэмбэлэх
    const processedProducts = useMemo(() => {
        let result = filter === "Бүгд"
            ? products
            : products.filter(p => p.type === filter)

        if (sort === "price-asc") result = [...result].sort((a, b) => a.price - b.price)
        if (sort === "price-desc") result = [...result].sort((a, b) => b.price - a.price)

        return result
    }, [products, filter, sort])

    useEffect(() => {
        setLoading(products.length === 0)
    }, [products])

    const groupedProducts = useMemo(() => {
        return processedProducts.reduce((acc: any, product) => {
            const type = product.type || 'Бусад';
            if (!acc[type]) acc[type] = [];
            acc[type].push(product);
            return acc;
        }, {});
    }, [processedProducts]);

    const categories = Object.keys(groupedProducts);

    if (loading) return <Loading />

    return (
        <section className="bg-[#FAFAFA] min-h-screen pt-32 pb-20">
            <div className="container mx-auto px-4">
                <div className="w-full text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 tracking-tight">Бүтээгдэхүүн</h1>
                    <div className="h-1.5 w-20 bg-amber-400 mx-auto mt-4 rounded-full"></div>
                </div>

                <div className="flex justify-end mb-6">
                    <select
                        value={sort}
                        onChange={e => setSort(e.target.value)}
                        className="bg-white border border-gray-200 shadow-sm rounded-xl text-gray-700 px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-[#102B5A]/10 min-w-[180px]"
                    >
                        <option value="default">Сүүлд нэмэгдсэн</option>
                        <option value="price-asc">Үнэ: Багаас их</option>
                        <option value="price-desc">Үнэ: Ихээс бага</option>
                    </select>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* SIDEBAR */}
                    <aside className="w-full lg:w-1/4 flex-shrink-0 -mt-24 hidden lg:block">
                        <div className="sticky top-28 space-y-8">
                            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                                <h3 className="font-bold text-lg text-[#102B5A] mb-5 flex items-center gap-2">
                                    <Filter size={18} /> Ангилал
                                </h3>
                                <div className="flex flex-col gap-1">
                                    {types.map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => setFilter(type)}
                                            className={`px-4 py-3 text-sm font-bold rounded-xl text-left transition-all
                                                ${filter === type
                                                    ? 'bg-[#102B5A] text-white shadow-md translate-x-1'
                                                    : 'text-gray-500 hover:bg-gray-50'}`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* PRODUCT LIST */}
                    <main className="flex-grow">
                        <div className="space-y-16">
                            {categories.map((category) => (
                                <div key={category} className="scroll-mt-32">
                                    <div className="flex items-center justify-between mb-6 border-b pb-4">
                                        <h2 className="text-xl font-bold text-gray-800">{category}</h2>
                                        <span className="text-xs font-bold text-gray-400 bg-white border px-3 py-1 rounded-full">
                                            {groupedProducts[category].length} бараа
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                                        {groupedProducts[category].map((product: Product) => (
                                            <ProductCard key={product.id} product={product} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </main>
                </div>
            </div>
        </section>
    )
}

