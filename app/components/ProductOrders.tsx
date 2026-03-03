'use client';

import React, { useState, useEffect } from 'react';
import { 
    Package, Calendar, MapPin, Phone, 
    ChevronRight, Clock, CheckCircle2, 
    XCircle, ShoppingBag, Loader2, X, ShoppingCart 
} from 'lucide-react';

// Төрлүүдийг тодорхойлох
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
    products: OrderedProduct[]; 
}

export default function ProductOrderHistory() {
    const [orders, setOrders] = useState<ProductOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<ProductOrder | null>(null);

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

    // Төлөвөөс хамаарч икон болон өнгө буцаах функцууд
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
        if (status === 'Цуцлагдсан') return 'bg-red-50 text-red-600 border-red-100';
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

            {/* Захиалгуудын жагсаалт */}
            <div className="grid gap-3">
                {orders.map((order) => (
                    <div 
                        key={order.id} 
                        onClick={() => setSelectedOrder(order)}
                        className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center justify-between cursor-pointer hover:border-blue-200 hover:shadow-lg transition-all group active:scale-[0.98]"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-[#102B5A] group-hover:bg-blue-50 transition-colors">
                                <ShoppingBag size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">Захиалга #{order.id}</h4>
                                <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                                    <Calendar size={12} /> {new Date(order.created_at).toLocaleDateString('mn-MN')}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="text-right hidden sm:block">
                                <div className={`text-[11px] font-bold px-3 py-1 rounded-full border ${getStatusStyle(order.status)} flex items-center gap-1.5 mb-1`}>
                                    {getStatusIcon(order.status)} {order.status}
                                </div>
                                <p className="text-lg font-bold text-[#102B5A]">
                                    {Number(order.total_amount).toLocaleString()}₮
                                </p>
                            </div>
                            <ChevronRight size={20} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                        </div>
                    </div>
                ))}
            </div>

            {/* --- ДЭЛГЭРЭНГҮЙ POP-UP (MODAL) --- */}
            {selectedOrder && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-[14px] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
                        
                        {/* Modal Header */}
                        <div className="p-8 border-b flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Захиалгын дэлгэрэнгүй</h2>
                                <p className="text-sm text-gray-500 mt-1">ID: #{selectedOrder.id} | {new Date(selectedOrder.created_at).toLocaleString('mn-MN')}</p>
                            </div>
                            <button 
                                onClick={() => setSelectedOrder(null)} 
                                className="p-3 hover:bg-gray-200 rounded-full transition-colors bg-white shadow-sm"
                            >
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-8 overflow-y-auto flex-1 space-y-8">
                            {/* Хүргэлтийн хаяг болон Төлөв */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <h3 className="text-xs font-bold uppercase text-gray-400 tracking-[0.2em]">Хүргэлтийн мэдээлэл</h3>
                                    <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100">
                                        <p className="font-bold text-gray-800 text-lg">{selectedOrder.full_name}</p>
                                        <p className="text-sm text-gray-600 flex items-center gap-2 mt-2"><Phone size={14}/> {selectedOrder.phone_number}</p>
                                        <p className="text-sm text-gray-500 mt-3 leading-relaxed flex items-start gap-2">
                                            <MapPin size={16} className="mt-1 flex-shrink-0 text-gray-400" /> {selectedOrder.address}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-xs font-bold uppercase text-gray-400 tracking-[0.2em]">Одоогийн төлөв</h3>
                                    <div className={`p-6 rounded-3xl border flex flex-col items-center justify-center h-full min-h-[120px] ${getStatusStyle(selectedOrder.status)}`}>
                                        <div className="scale-150 mb-3">{getStatusIcon(selectedOrder.status)}</div>
                                        <span className="font-bold text-lg">{selectedOrder.status}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Барааны жагсаалт */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold uppercase text-black tracking-[0.2em] flex items-center gap-2">
                                    <ShoppingCart size={14} /> Захиалсан бараанууд ({selectedOrder.products?.length})
                                </h3>

                                <div className="border border-gray-100 rounded-[2rem] overflow-hidden bg-white shadow-sm">
                                    <div className="max-h-[300px] overflow-y-auto divide-y divide-gray-50">
                                        {selectedOrder.products?.map((item, i) => (
                                            <div key={i} className="p-5 flex justify-between items-center hover:bg-gray-50/50 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex-shrink-0 flex items-center justify-center text-[#102B5A] font-bold text-xs border border-blue-100">
                                                        {i + 1}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-bold text-gray-800 text-sm truncate max-w-[250px]">{item.name}</p>
                                                        <p className="text-xs text-gray-400 mt-1">
                                                            {Number(item.unit_price).toLocaleString()}₮ × {item.quantity}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-[#102B5A] text-md">
                                                        {(item.unit_price * item.quantity).toLocaleString()}₮
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-8 border-t bg-gray-50/50 flex justify-between items-center">
                            <div className="text-gray-500 font-medium">Нийт төлөх дүн:</div>
                            <div className="text-3xl font-black text-[#102B5A] tracking-tight">{Number(selectedOrder.total_amount).toLocaleString()}₮</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}