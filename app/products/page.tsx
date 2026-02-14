'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { ShoppingCart, Info, Tag, Filter, X, Minus, Plus } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useSiteToast } from '../hooks/useSiteToast'
import Loading from '../loading'

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('Бүгд')
    const [sort, setSort] = useState('default')
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
    const { showToast } = useSiteToast()
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
                showToast({ title: "Алдаа", description: "Бараа татахад алдаа гарлаа." })
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [showToast])

    // Бүх төрлүүдийг авах
    const types = ['Бүгд', ...new Set(products.map(p => p.type || 'Бусад'))]

    // Шүүх болон эрэмбэлэх логик
    const processedProducts = useMemo(() => {
        let result = filter === 'Бүгд'
            ? products
            : products.filter(p => p.type === filter);

        if (sort === 'price-asc') result = [...result].sort((a, b) => a.price - b.price);
        if (sort === 'price-desc') result = [...result].sort((a, b) => b.price - a.price);

        return result;
    }, [products, filter, sort]);

    // Шүүгдсэн барааг төрлөөр нь бүлэглэх
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
        <section className="bg-[#FAFAFA] min-h-screen pb-20 pt-[64px]">
            <div className=" top-[64px] z-40 bg-[#FAFAFA]/80  py-6 mt-10  mb-8">
                <div className="w-full max-w-8xl text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
                        Бүтээгдэхүүн
                    </h1>
                    <div className="h-1 w-20 bg-amber-400 mx-auto mt-4 rounded-full"></div>
                </div>
                <div className="container mx-auto px-4 flex flex-wrap justify-between items-center gap-4">
                    <button
                        onClick={() => setMobileFilterOpen(true)}
                        className="flex items-center gap-2 text-sm font-bold bg-[#102B5A] text-white px-6 py-3 rounded-xl shadow-lg shadow-blue-900/10 hover:bg-amber-500 transition-all"
                    >
                        <Filter size={18} />
                        Ангилал: <span className="text-amber-300 ml-1">{filter}</span>
                    </button>

                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-gray-400 uppercase hidden sm:inline"></span>
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
                </div>
            </div>

            {/* PRODUCTS LIST */}
            <div className="container mx-auto px-4 space-y-20">
                {categories.length > 0 ? (
                    categories.map((category) => (
                        <div key={category} id={category} className="scroll-mt-48">
                            <div className="flex items-center gap-4 mb-8 justify-between">
                                <h2 className="text-2xl font-bold text-black ">{category}</h2>
                                <span className="bg-white border border-gray-100 px-3 py-1 rounded-lg text-sm font-bold text-gray-400">
                                    {groupedProducts[category].length} бараа
                                </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
                                {groupedProducts[category].map((product: any) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        addToCart={addToCart}
                                        setIsCartOpen={setIsCartOpen}
                                        showToast={showToast}
                                    />
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20">
                        <p className="text-gray-400 font-bold italic">Уучлаарай, энэ ангилалд бараа олдсонгүй.</p>
                    </div>
                )}
            </div>

            {/* MOBILE FILTER SIDEBAR */}
            {mobileFilterOpen && (
                <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm transition-all" onClick={() => setMobileFilterOpen(false)}>
                    <div className="absolute left-0 top-0 h-full w-[300px] bg-white p-8 shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="font-black text-2xl text-[#102B5A]">Ангилал</h3>
                            <button onClick={() => setMobileFilterOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={24} className="text-gray-400" />
                            </button>
                        </div>
                        <div className="flex-grow overflow-y-auto no-scrollbar">
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
                </div>
            )}
        </section>
    )
}

function ProductCard({ product, addToCart, setIsCartOpen, showToast }: any) {
    const [quantity, setQuantity] = useState(1);

    // Тоог гараар бичихэд шалгах
    const handleQuantityChange = (val: string) => {
        const num = parseInt(val);
        if (isNaN(num) || num < 1) {
            setQuantity(1);
        } else {
            setQuantity(num);
        }
    };

    return (
        <div className="group bg-white rounded-[24px] overflow-hidden border border-gray-100 flex flex-col h-full hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500">
            {/* IMAGE - Зургийг нэг хэмжээнд барих */}
            <Link
                href={`/products/${product.id}`}
                className="relative block w-full overflow-hidden bg-[#F9F9F9]"
                style={{ aspectRatio: '1 / 1' }} // Яг квадрат байлгахыг баталгаажуулна
            >
                <div className="flex h-full w-full items-center justify-center p-4">
                    <img
                        src={product.image_url || '/placeholder.png'}
                        alt={product.name}
                        className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-700"
                    />
                </div>
            </Link>

            {/* INFO */}
            <div className="p-5 flex-grow flex flex-col">
                <div className="mb-3">
                    <span className="text-[11px] font-black text-amber-400 tracking-widest block mb-1">
                        #{product.code}
                    </span>
                    <Link href={`/products/${product.id}`}>
                        <h3 className="text-[14px] font-bold text-gray-800 line-clamp-2 leading-tight hover:text-[#102B5A] transition-colors min-h-[2.5rem]">
                            {product.name}
                        </h3>
                    </Link>
                </div>

                <div className="mt-auto">
                    <div className="flex items-baseline gap-1.5 mb-2">
                        <span className="text-xl font-black text-[#102B5A]">
                            {Number(product.price).toLocaleString()}₮
                        </span>
                        <span className="text-xs text-gray-400 font-medium lowercase mt-2">/ {product.unit}</span>
                    </div>

                    <p className="text-[12px] text-red-500 font-bold flex items-center gap-1 opacity-80 mb-4">
                        <Info size={12} strokeWidth={3} /> НӨАТ-гүй
                    </p>

                    {/* QUANTITY SELECTOR (+ -) */}
                    <div className="grid grid-cols-3 bg-gray-50 rounded-2xl border border-gray-100 p-1.5 mb-3">
                        <button
                            onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                            className="h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:text-amber-500 transition-all active:scale-95"
                        >
                            <Minus size={14} strokeWidth={3} className="text-black" />
                        </button>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => handleQuantityChange(e.target.value)}
                            className="bg-transparent text-center text-sm font-black text-[#102B5A] outline-none"
                        />
                        <button
                            onClick={() => setQuantity(prev => prev + 1)}
                            className="h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:text-amber-500 transition-all active:scale-95"
                        >
                            <Plus size={14} strokeWidth={3} className="text-black" />
                        </button>
                    </div>

                    {/* ACTION BUTTON */}
                    <button
                        onClick={() => {
                            // addToCart руу бүтээгдэхүүн болон тоог дамжуулна
                            addToCart?.({ ...product, quantity: quantity });
                            setIsCartOpen?.(true);
                            showToast({
                                title: "Амжилттай",
                                description: `${product.name} (${quantity} ${product.unit}) сагслагдлаа.`
                            });
                        }}
                        className="w-full bg-[#102B5A] text-white text-[12px] font-black py-3.5 rounded-xl hover:bg-amber-500 hover:shadow-lg hover:shadow-amber-200 transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wider"
                    >
                        <ShoppingCart size={16} />
                        Сагслах
                    </button>
                </div>
            </div>
        </div>
    );
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