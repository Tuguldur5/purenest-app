'use client';

import React, { useState, useEffect } from 'react';
import { 
    Package, Calendar, MapPin, Phone, 
    ChevronDown, ChevronUp, Clock, CheckCircle2, 
    XCircle, ShoppingBag, Loader2 
} from 'lucide-react';

interface OrderedProduct {
    name: string;
    quantity: number;
    unit_price: number;
}

interface ProductOrder {
    id: number;
    full_name: string;
    phone_number: string;
    address: string;
    total_amount: number;
    status: string;
    created_at: string;
    products: OrderedProduct[]; // Backend-ээс json_agg-ээр ирж буй бараанууд
}

export default function ProductOrderHistory() {
    const [orders, setOrders] = useState<ProductOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

    useEffect(() => {
        fetchMyOrders();
    }, []);

    const fetchMyOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`https://purenest-app.onrender.com/api/product-orders/my-orders`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (err) {
            console.error("Fetch orders error:", err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Хүлээгдэж байна': return <Clock size={16} className="text-orange-500" />;
            case 'Хүргэгдсэн': return <CheckCircle2 size={16} className="text-green-500" />;
            case 'Цуцлагдсан': return <XCircle size={16} className="text-red-500" />;
            default: return <Package size={16} className="text-blue-500" />;
        }
    };

    const getStatusStyle = (status: string) => {
        if (status === 'Хүлээгдэж байна') return 'bg-orange-50 text-orange-600 border-orange-100';
        if (status === 'Хүргэгдсэн') return 'bg-green-50 text-green-600 border-green-100';
        return 'bg-blue-50 text-blue-600 border-blue-100';
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 text-slate-400">
            <Loader2 className="animate-spin mb-2" />
            <p className="text-sm font-medium">Захиалгын түүх уншиж байна...</p>
        </div>
    );

    if (orders.length === 0) return (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <ShoppingBag size={48} className="mx-auto text-gray-200 mb-4" />
            <h3 className="text-lg font-bold text-gray-900">Захиалга олдсонгүй</h3>
            <p className="text-gray-400 text-sm mt-1">Та одоогоор ямар нэгэн бараа захиалаагүй байна.</p>
        </div>
    );

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#102B5A] mb-6 flex items-center gap-2">
                <Package size={24} /> Бараа захиалгын түүх
            </h2>

            {orders.map((order) => (
                <div key={order.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden transition-all hover:shadow-sm">
                    {/* Header: Захиалгын үндсэн мэдээлэл */}
                    <div 
                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                        className="p-5 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-[#102B5A]">
                                <ShoppingBag size={20} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-gray-900">Захиалга #{order.id}</span>
                                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${getStatusStyle(order.status)} flex items-center gap-1`}>
                                        {getStatusIcon(order.status)} {order.status}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-400 flex items-center gap-1 mt-1 font-medium">
                                    <Calendar size={12} /> {new Date(order.created_at).toLocaleDateString('mn-MN')}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-8">
                            <div className="text-right">
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Нийт дүн</p>
                                <p className="text-lg font-black text-[#102B5A]">{Number(order.total_amount).toLocaleString()}₮</p>
                            </div>
                            {expandedOrder === order.id ? <ChevronUp className="text-gray-300" /> : <ChevronDown className="text-gray-300" />}
                        </div>
                    </div>

                    {/* Дэлгэрэнгүй хэсэг (Expanded) */}
                    {expandedOrder === order.id && (
                        <div className="px-5 pb-5 pt-2 border-t border-gray-50 bg-slate-50/30 animate-in slide-in-from-top-2 duration-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                {/* Хүргэлтийн мэдээлэл */}
                                <div className="space-y-3">
                                    <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Хүргэлтийн хаяг</h4>
                                    <div className="bg-white p-4 rounded-xl border border-gray-100 space-y-2">
                                        <p className="text-sm font-bold text-gray-800">{order.full_name}</p>
                                        <p className="text-sm text-gray-600 flex items-center gap-2"><Phone size={14} className="text-gray-400"/> {order.phone_number}</p>
                                        <p className="text-sm text-gray-600 flex items-start gap-2"><MapPin size={14} className="text-gray-400 mt-0.5"/> {order.address}</p>
                                    </div>
                                </div>

                                {/* Барааны жагсаалт */}
                                <div className="space-y-3">
                                    <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Захиалсан бараанууд</h4>
                                    <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
                                        {order.products?.map((prod, idx) => (
                                            <div key={idx} className="p-3 flex justify-between items-center">
                                                <div>
                                                    <p className="text-sm font-bold text-gray-800">{prod.name}</p>
                                                    <p className="text-xs text-gray-400">{prod.quantity}ш × {Number(prod.unit_price).toLocaleString()}₮</p>
                                                </div>
                                                <p className="text-sm font-bold text-[#102B5A]">{(prod.quantity * prod.unit_price).toLocaleString()}₮</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}