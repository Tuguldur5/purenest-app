import React, { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, HeartOff, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Wishlist() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('https://purenest-app.onrender.com/api/wishlist', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) setItems(await res.json());
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchWishlist();
    }, []);

    const removeItem = async (id: number) => {
        // Устгах API дуудах логик
        setItems(prev => prev.filter((item: any) => item.id !== id));
    };

    if (loading) return <div className="text-center py-10">Ачаалж байна...</div>;

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                    <HeartOff size={40} />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Хадгалсан бараа байхгүй</h3>
                <p className="text-gray-400 text-sm mb-6">Та өөрт таалагдсан бараагаа хадгалж, дараа нь харах боломжтой.</p>
                <Link href="/products" className="flex items-center gap-2 text-indigo-600 font-semibold text-sm hover:underline">
                    Дэлгүүр хэсэх <ArrowRight size={16} />
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map((item: any) => (
                <div key={item.id} className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all">
                    <div className="aspect-square bg-gray-50 relative">
                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                        <button 
                            onClick={() => removeItem(item.id)}
                            className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-md text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                    <div className="p-4">
                        <h4 className="font-bold text-slate-800 truncate">{item.name}</h4>
                        <p className="text-indigo-600 font-extrabold mt-1">{Number(item.price).toLocaleString()}₮</p>
                        <button className="w-full mt-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-indigo-600 hover:text-white transition-colors">
                            <ShoppingCart size={14} /> Сагсанд хийх
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}