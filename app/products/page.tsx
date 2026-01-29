'use client'
import { useState, useEffect } from 'react'

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]); // API-аас ирэх бараанууд
    const [loading, setLoading] = useState(true); // Уншиж байх үеийн төлөв
    const [filter, setFilter] = useState('Бүгд');
    const [error, setError] = useState<string | null>(null);

    // 1. API-аас өгөгдөл татах
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await fetch('https://purenest-app.onrender.com/api/products');
                if (!response.ok) throw new Error('Өгөгдөл татахад алдаа гарлаа');
                
                const data = await response.json();
                setProducts(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // 2. Төрлүүдийг (Types) API-аас ирсэн өгөгдлөөс динамикаар гаргаж авах
    const types = ['Бүгд', ...new Set(products.map(p => p.type))];

    // 3. Шүүлтүүр хийх логик
    const filteredProducts = filter === 'Бүгд' 
        ? products 
        : products.filter(p => p.type === filter);

    if (loading) return <div className="text-center py-20 text-gray-500">Уншиж байна...</div>;
    if (error) return <div className="text-center py-20 text-red-500">Алдаа: {error}</div>;

    return (
        <section className="bg-gray-50 min-h-screen py-8">
            <div className="container mx-auto px-2">
                
                {/* Гарчиг */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[#102B5A] mb-2">Бүтээгдэхүүн</h1>
                    <p className="text-gray-500 text-sm">Мэргэжлийн цэвэрлэгээний шийдлүүд</p>
                </div>

                {/* Шүүлтүүр - Динамик төрлүүд */}
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {types.map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            className={`px-4 py-1.5 text-xs rounded-full border transition-all ${
                                filter === type 
                                ? 'bg-[#102B5A] text-white border-[#102B5A]' 
                                : 'bg-white text-gray-600 border-gray-200 hover:border-amber-400'
                            }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                {/* Барааны Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                    {filteredProducts.map((product, index) => (
                        <div 
                            key={product.id || index} 
                            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col"
                        >
                            {/* Зураг */}
                            <div className="relative h-40 w-full bg-gray-100">
                                <img
                                    src={product.image_url || '/placeholder.png'}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 left-2 bg-[#102B5A]/90 text-white text-[10px] px-2 py-0.5 rounded">
                                    {product.type}
                                </div>
                            </div>

                            {/* Мэдээлэл */}
                            <div className="p-3 flex-grow">
                                <span className="text-[10px] text-gray-400 font-mono uppercase">{product.code}</span>
                                <h3 className="text-sm font-semibold text-gray-800 mt-0.5 mb-1 line-clamp-2 h-10">
                                    {product.name}
                                </h3>
                                
                                <div className="flex flex-col">
                                    <span className="text-md font-bold text-[#102B5A]">
                                        {Number(product.price).toLocaleString()}₮
                                    </span>
                                    <span className="text-[11px] text-gray-500">{product.unit}</span>
                                </div>
                            </div>

                            {/* Товчлуур */}
                            <div className="p-3 pt-0">
                                <button className="w-full bg-[#102B5A] text-white text-xs font-medium py-2 rounded-lg hover:bg-amber-500 transition-colors shadow-sm">
                                    Захиалах
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-20 text-gray-400 text-sm">
                        Энэ ангилалд бараа олдсонгүй.
                    </div>
                )}
            </div>
        </section>
    );
}