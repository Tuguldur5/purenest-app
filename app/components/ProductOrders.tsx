'use client';
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Package, Calendar } from 'lucide-react';

interface ProductOrder {
    id: number;
    product_name: string;
    quantity: number;
    total_price: number;
    status: string;
    created_at: string;
    image_url?: string;
}

export default function ProductOrders() {
    const [orders, setOrders] = useState<ProductOrder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProductOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`https://purenest-app.onrender.com/api/product-orders/my-orders`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) setOrders(await res.json());
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProductOrders();
    }, []);

    if (loading) return <div className="p-10 text-center text-slate-400">Ачаалж байна...</div>;

    if (orders.length === 0) return (
        <div className="flex flex-col items-center justify-center p-20 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
            <ShoppingCart size={48} className="text-slate-200 mb-4" />
            <p className="text-slate-400 font-medium">Барааны захиалга олдсонгүй</p>
        </div>
    );

    return (
        <div className="grid grid-cols-1 gap-4">
            {orders.map((order) => (
                <div key={order.id} className="bg-white p-5 rounded-2xl border border-gray-100 hover:shadow-md transition-all flex items-center gap-6">
                    <div className="w-16 h-16 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                        <Package size={24} />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-slate-800">{order.product_name}</h4>
                        <div className="flex gap-4 mt-1 text-xs text-slate-400 font-medium">
                            <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(order.created_at).toLocaleDateString()}</span>
                            <span>Тоо: {order.quantity}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="font-extrabold text-slate-900">{Number(order.total_price).toLocaleString()}₮</p>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-lg uppercase ${
                            order.status === 'Дууссан' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                        }`}>
                            {order.status}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}