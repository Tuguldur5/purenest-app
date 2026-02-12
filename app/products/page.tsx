'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingCart, Filter, X, Info } from 'lucide-react' // SortAscIcon-ийг Info-гоор солив
import { useCart } from '../context/CartContext'
import { useSiteToast } from '../hooks/useSiteToast' // Toast нэмэв
import Loading from '../loading' // Loading component байгаа гэж үзэв

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [filter, setFilter] = useState('Бүгд')
    const [sort, setSort] = useState('default')
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

    const { showToast } = useSiteToast() // Toast hook
    const cartContext = useCart()
    const addToCart = cartContext?.addToCart
    const setIsCartOpen = cartContext?.setIsCartOpen

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true)
            try {
                const res = await fetch('https://purenest-app.onrender.com/api/products')
                if (!res.ok) throw new Error('Өгөгдөл татахад алдаа гарлаа')
                const data = await res.json()
                setProducts(data)
            } catch (err: any) {
                setError(err.message)
                showToast({ title: "Алдаа", description: "Бараа татахад алдаа гарлаа." })
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [showToast])

    const types = ['Бүгд', ...new Set(products.map(p => p.type))]

    const filteredProducts =
        filter === 'Бүгд'
            ? products
            : products.filter(p => p.type === filter)

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sort === 'price-asc') return a.price - b.price
        if (sort === 'price-desc') return b.price - a.price
        return 0
    })

    if (loading) return <Loading />

    return (
        <section className="container mx-auto py-24 px-4 bg-[#FDFEFE] min-h-screen">
            {/* TITLE */}
            <div className="text-center mb-10 mt-6">
                <h1 className="text-4xl font-bold text-[#102B5A]">Манай бүтээгдэхүүн</h1>
                <div className="h-1.5 w-20 bg-amber-400 mx-auto mt-4 rounded-full" />
            </div>

            {/* CONTROLS */}
            <div className="flex justify-between items-center mb-8 gap-4">
                <button
                    onClick={() => setMobileFilterOpen(true)}
                    className="flex items-center gap-2 text-sm font-semibold bg-white border border-gray-200 text-[#102B5A] px-5 py-2.5 rounded-xl shadow-sm hover:bg-gray-50 transition-all"
                >
                    <Filter size={18} />
                    Ангилал харах
                </button>

                <select
                    value={sort}
                    onChange={e => setSort(e.target.value)}
                    className="border border-gray-200 shadow-sm rounded-xl text-gray-700 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#102B5A]/20"
                >
                    <option value="default">Эрэмбэлэх</option>
                    <option value="price-asc">Үнэ: Багаас их рүү</option>
                    <option value="price-desc">Үнэ: Ихээс бага руу</option>
                </select>
            </div>

            {/* PRODUCTS GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {sortedProducts.map((product, index) => (
                    <div
                        key={product.id || index}
                        className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
                    >
                        {/* IMAGE */}
                           <Link href={`/products/${product.id}`} className="relative h-40 w-full bg-gray-100 block">
                                <img
                                    src={product.image_url || '/placeholder.png'}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            <div className="absolute top-2 left-2 bg-white backdrop-blur-sm text-black text-[10px] font-bold px-2 py-1 rounded-lg">
                                {product.type}
                            </div>
                        </Link>

                        {/* INFO */}
                        <div className="p-4 flex-grow flex flex-col">
                            <span className="text-[10px] text-gray-400 font-mono font-bold tracking-wider uppercase mb-1">
                                #{product.code}
                            </span>

                            <Link href={`/products/${product.id}`}>
                                <h3 className="text-sm font-bold text-gray-800 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                                    {product.name}
                                </h3>
                            </Link>

                            <div className="mt-auto">
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-lg font-black text-[#102B5A]">
                                        {Number(product.price).toLocaleString()}₮
                                    </span>
                                    <span className="text-[11px] text-gray-500 p-1 font-medium">/ {product.unit}</span>
                                </div>
                                <p className="text-[10px] text-red-500 font-bold mt-1 flex items-center gap-1">
                                    <Info size={12} /> НӨАТ-гүй
                                </p>
                            </div>
                        </div>

                        {/* ACTION BUTTON */}
                        <div className="p-4 pt-0">
                            <button
                                onClick={() => {
                                    addToCart?.(product);
                                    setIsCartOpen?.(true);
                                    showToast({ 
                                        title: "Сагсанд амжилттай нэмэгдлээ.", 
                                        description: `${product.name} сагсанд нэмэгдлээ.` 
                                    });
                                }}
                                className="w-full bg-[#102B5A] text-white text-[11px] font-bold py-3 rounded-xl hover:bg-amber-500 transition-all duration-300 shadow-sm flex items-center justify-center gap-2"
                            >
                                <ShoppingCart size={14} />
                                САГСЛАХ
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* MOBILE/DESKTOP FILTER DRAWER */}
            {mobileFilterOpen && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity "
                onClick={() => setMobileFilterOpen(false)}>
                    <div className="absolute left-0 top-0 h-full w-[280px] bg-white p-6 shadow-2xl animate-in slide-in-from-left duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="font-black text-xl text-[#102B5A]">Ангилал</h3>
                            <button 
                                onClick={() => setMobileFilterOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={24} className="text-gray-400 group-hover:text-gray-600 transition-colors"/>
                            </button>
                        </div>

                        <FilterContent
                            types={types}
                            filter={filter}
                            setFilter={(t: string) => {
                                setFilter(t)
                                setMobileFilterOpen(false)
                            }}
                        />
                    </div>
                </div>
            )}
        </section>
    )
}

function FilterContent({ types, filter, setFilter }: any) {
    return (
        <div className="flex flex-col gap-2">
            {types.map((type: string) => (
                <button
                    key={type}
                    onClick={() => setFilter(type)}
                    className={`px-5 py-3.5 text-sm font-bold rounded-2xl text-left transition-all
                        ${filter === type
                            ? 'bg-[#102B5A] text-white shadow-lg shadow-blue-100 translate-x-2'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-[#102B5A]'
                        }`}
                >
                    {type}
                </button>
            ))}
        </div>
    )
}