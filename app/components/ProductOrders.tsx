'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
    Package, Calendar, MapPin, Phone, 
    ChevronRight, Clock, CheckCircle2, 
    XCircle, ShoppingBag, Loader2, X, ShoppingCart, Search, Filter 
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
    products: OrderedProduct[]; 
}

export default function ProductOrderHistory() {
    const [orders, setOrders] = useState<ProductOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<ProductOrder | null>(null);
    
    // Хайлт болон Шүүлтүүрийн state-үүд
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

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

    // --- Хайлт болон Шүүлтүүрийн Логик ---
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesSearch = order.id.toString().includes(searchTerm);
            const matchesStatus = statusFilter === 'all' || 
                order.status.toLowerCase().includes(statusFilter.toLowerCase());
            
            return matchesSearch && matchesStatus;
        });
    }, [orders, searchTerm, statusFilter]);

    const getStatusStyle = (status: string) => {
        const s = status.toLowerCase();
        if (s.includes('хүргэгдсэн') || s.includes('success')) return 'bg-green-100 text-green-700 border-green-200';
        if (s.includes('хүлээгдэж') || s.includes('pending')) return 'bg-orange-100 text-orange-700 border-orange-200';
        if (s.includes('цуцлагдсан') || s.includes('cancel')) return 'bg-red-100 text-red-700 border-red-200';
        return 'bg-blue-100 text-blue-700 border-blue-200';
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 text-slate-400 font-medium">
            <Loader2 className="animate-spin mb-2" />
            <p className="text-sm">Захиалгын түүх уншиж байна...</p>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto px-4 py-4 sm:py-6 font-sans">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Package size={24} className="text-indigo-600" /> Бараа захиалгын түүх
            </h2>

            {/* --- Хайлт болон Шүүлтүүр хэсэг --- */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text"
                        placeholder="Захиалгын ID-аар хайх..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <select 
                        className="pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none appearance-none font-bold text-slate-700 w-full sm:w-auto cursor-pointer"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">Бүгд</option>
                        <option value="хүлээгдэж">Хүлээгдэж буй</option>
                        <option value="хүргэгдсэн">Хүргэгдсэн</option>
                        <option value="цуцлагдсан">Цуцлагдсан</option>
                    </select>
                </div>
            </div>

            {/* Захиалгуудын жагсаалт */}
            <div className="grid gap-3 sm:gap-4">
                {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                    <div 
                        key={order.id} 
                        onClick={() => setSelectedOrder(order)}
                        className="bg-white border border-slate-100 rounded-2xl p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:border-indigo-100 hover:shadow-md transition-all group"
                    >
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors flex-shrink-0">
                                <ShoppingBag size={20} />
                            </div>
                            <div className="min-w-0">
                                <h4 className="font-bold text-slate-800 text-sm sm:text-base truncate">Захиалга #{order.id}</h4>
                                <p className="text-[11px] sm:text-xs text-slate-400 flex items-center gap-1 mt-1 font-bold uppercase tracking-wide">
                                    <Calendar size={12} /> {new Date(order.created_at).toLocaleDateString('mn-MN')}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-6">
                            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1.5 sm:gap-6">
                                <div className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-bold border uppercase tracking-wide ${getStatusStyle(order.status)}`}>
                                    {order.status}
                                </div>
                                <p className="text-base sm:text-lg font-bold text-slate-900">
                                    {Number(order.total_amount).toLocaleString()}₮
                                </p>
                            </div>
                            <ChevronRight size={18} className="text-slate-300 hidden sm:block" />
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-20 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                         <ShoppingBag size={40} className="mx-auto text-slate-200 mb-3" />
                         <p className="text-slate-400 text-sm font-medium">Захиалга олдсонгүй</p>
                    </div>
                )}
            </div>

            {/* --- ДЭЛГЭРЭНГҮЙ MODAL --- */}
            {selectedOrder && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200 font-sans">
                        
                        {/* Modal Header */}
                        <div className="p-5 sm:p-7 border-b flex justify-between items-start bg-slate-50/50">
                            <div className="min-w-0">
                                <h2 className="text-lg sm:text-xl font-bold text-slate-800 truncate">Захиалгын дэлгэрэнгүй</h2>
                                <p className="text-[11px] sm:text-xs text-slate-500 mt-1 font-bold">
                                    ID: #{selectedOrder.id} • {new Date(selectedOrder.created_at).toLocaleString('mn-MN')}
                                </p>
                            </div>
                            <button 
                                onClick={() => setSelectedOrder(null)} 
                                className="p-2 hover:bg-slate-200 rounded-full transition-colors bg-white shadow-sm flex-shrink-0"
                            >
                                <X size={20} className="text-slate-500" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6 sm:space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                <div className="space-y-3">
                                    <h3 className="text-[10px] font-bold uppercase text-slate-400 tracking-widest px-1">Хүргэлтийн мэдээлэл</h3>
                                    <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-100">
                                        <p className="font-bold text-slate-800 text-base">{selectedOrder.full_name}</p>
                                        <p className="text-sm text-slate-600 flex items-center gap-2 mt-2 font-bold"><Phone size={14} className="text-slate-400"/> {selectedOrder.phone_number}</p>
                                        <p className="text-sm text-slate-500 mt-3 leading-relaxed flex items-start gap-2 font-bold">
                                            <MapPin size={16} className="mt-0.5 flex-shrink-0 text-slate-400" /> {selectedOrder.address}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-[10px] font-bold uppercase text-slate-400 tracking-widest px-1">Одоогийн төлөв</h3>
                                    <div className={`p-4 sm:p-6 rounded-2xl border flex flex-col items-center justify-center min-h-[100px] h-full ${getStatusStyle(selectedOrder.status)}`}>
                                        <div className="mb-2">
                                            {selectedOrder.status.includes('Хүлээгдэж') && <Clock size={24} />}
                                            {selectedOrder.status.includes('Хүргэгдсэн') && <CheckCircle2 size={24} />}
                                            {selectedOrder.status.includes('Цуцлагдсан') && <XCircle size={24} />}
                                        </div>
                                        <span className="font-bold text-base uppercase tracking-wide">{selectedOrder.status}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-[10px] font-bold uppercase text-slate-800 tracking-widest flex items-center gap-2 px-1">
                                    <ShoppingCart size={14} /> Захиалсан бараа ({selectedOrder.products?.length})
                                </h3>

                                <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm">
                                    <div className="max-h-[250px] overflow-y-auto divide-y divide-slate-50">
                                        {selectedOrder.products?.map((item, i) => (
                                            <div key={i} className="p-4 flex justify-between items-center hover:bg-slate-50/50 transition-colors">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="w-8 h-8 bg-slate-50 rounded-lg flex-shrink-0 flex items-center justify-center text-slate-400 font-bold text-[10px] border border-slate-100">
                                                        {i + 1}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-bold text-slate-800 text-sm truncate pr-2">{item.name}</p>
                                                        <p className="text-[11px] text-slate-400 mt-0.5 font-bold italic">
                                                            {Number(item.unit_price).toLocaleString()}₮ × {item.quantity}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <p className="font-bold text-slate-900 text-sm">
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
                        <div className="p-6 sm:p-8 border-t bg-slate-50/50 flex justify-between items-center">
                            <div className="text-slate-500 font-bold uppercase text-xs tracking-wider">Нийт дүн</div>
                            <div className="text-2xl sm:text-3xl font-bold text-slate-900">{Number(selectedOrder.total_amount).toLocaleString()}₮</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}