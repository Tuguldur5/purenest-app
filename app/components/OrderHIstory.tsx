'use client';

import React, { useState, useEffect } from 'react';
import { 
    ClipboardList, Calendar, ArrowLeft, MapPin, 
    CreditCard, Layout, Image as ImageIcon, MessageSquare 
} from 'lucide-react';

interface Order {
    id: number;
    service: string;
    total_price: number;
    status: string;
    date: string;
    address?: string;
}

// Тайлангийн төрөл
interface Report {
    description: string;
    images: string[];
}

export default function OrderHistory() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [report, setReport] = useState<Report | null>(null); // Тайлан хадгалах
    const [loading, setLoading] = useState(true);
    const [reportLoading, setReportLoading] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`https://purenest-app.onrender.com/api/orders/history`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setOrders(Array.isArray(data) ? data : data.orders || []);
            }
        } catch (err) {
            console.error("Orders fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    // Захиалга сонгоход тайланг давхар татах
    const handleSelectOrder = async (order: Order) => {
        setSelectedOrder(order);
        setReport(null);
        setReportLoading(true);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`https://purenest-app.onrender.com/api/reports/${order.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                // Images-ийг JSON parse хийх шаардлагатай эсэхийг шалгана
                const reportData = {
                    description: data.description,
                    images: typeof data.images === 'string' ? JSON.parse(data.images) : data.images
                };
                setReport(reportData);
            }
        } catch (err) {
            console.error("Report fetch error:", err);
        } finally {
            setReportLoading(false);
        }
    };

    const getStatusStyle = (status: string) => {
        const s = status.toLowerCase();
        if (s.includes('дууссан') || s.includes('success')) return 'bg-green-50 text-green-600';
        if (s.includes('хүлээгдэж') || s.includes('pending')) return 'bg-orange-50 text-orange-600';
        return 'bg-blue-50 text-blue-600';
    };

    if (loading) return <div className="p-10 text-center text-slate-400">Ачаалж байна...</div>;

    // --- 1. ДЭЛГЭРЭНГҮЙ ХАРАГДАЦ (View State) ---
    if (selectedOrder) {
        return (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <button 
                    onClick={() => setSelectedOrder(null)}
                    className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-6 group font-semibold"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Буцах
                </button>

                <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm space-y-px">
                    {/* Үндсэн мэдээлэл */}
                    <div className="p-6 bg-slate-50/30 border-b border-gray-50">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-[10px] font-bold text-amber-500 italic uppercase tracking-wider">Захиалга #{selectedOrder.id}</span>
                                <h3 className="text-xl font-bold text-slate-800 mt-1">{selectedOrder.service}</h3>
                                <div className="flex items-center gap-4 mt-2">
                                    <p className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                                        <Calendar size={14} />
                                        {new Date(selectedOrder.date).toLocaleDateString('mn-MN')}
                                    </p>
                                    <p className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                                        <MapPin size={14} />
                                        {selectedOrder.address || "Хаяг тодорхойгүй"}
                                    </p>
                                </div>
                            </div>
                            <span className={`px-4 py-1.5 rounded-xl text-sm font-bold ${getStatusStyle(selectedOrder.status)}`}>
                                {selectedOrder.status}
                            </span>
                        </div>
                    </div>

                    {/* ГҮЙЦЭТГЭЛИЙН ТАЙЛАН ХЭСЭГ (Админаас оруулсан бол харагдана) */}
                    {reportLoading ? (
                        <div className="p-8 text-center"><span className="animate-pulse text-slate-400 text-sm">Тайлан уншиж байна...</span></div>
                    ) : report ? (
                        <div className="p-6 space-y-6 bg-white">
                            <div className="flex items-center gap-2 border-l-4 border-indigo-500 pl-4 py-1">
                                <Layout size={18} className="text-indigo-500" />
                                <h4 className="font-bold text-slate-800">Гүйцэтгэлийн тайлан</h4>
                            </div>

                            <div className="space-y-4">
                                {/* Тайлбар */}
                                <div className="bg-slate-50 p-4 rounded-2xl flex gap-3">
                                    <MessageSquare size={18} className="text-slate-400 flex-shrink-0 mt-1" />
                                    <p className="text-slate-600 text-[14px] leading-relaxed italic">
                                        "{report.description}"
                                    </p>
                                </div>

                                {/* Зургууд */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold uppercase tracking-widest px-1">
                                        <ImageIcon size={14} /> Баримт зургууд
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {report.images.map((img, idx) => (
                                            <div key={idx} className="aspect-square rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                                                <img 
                                                    src={img} 
                                                    alt={`баримт-${idx}`} 
                                                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500 cursor-zoom-in"
                                                    onClick={() => window.open(img, '_blank')}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-8 text-center text-slate-400 border-b border-gray-50">
                            <p className="text-xs font-medium">Гүйцэтгэлийн тайлан хараахан ороогүй байна.</p>
                        </div>
                    )}

                    {/* Төлбөр */}
                    <div className="p-6 flex justify-between items-center bg-white">
                        <span className="font-bold text-slate-400 text-sm uppercase tracking-wide">Нийт төлбөр</span>
                        <span className="text-2xl font-black text-slate-900">
                            {Number(selectedOrder.total_price).toLocaleString()}₮
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    // --- 2. ҮНДСЭН ЖАГСААЛТ ---
    return (
        <div className="grid grid-cols-1 gap-4 animate-in fade-in duration-500">
            {orders.map((order) => (
                <div
                    key={order.id}
                    onClick={() => handleSelectOrder(order)}
                    className="bg-white p-5 rounded-2xl border border-gray-100 hover:shadow-md transition-all flex items-center gap-6 group cursor-pointer"
                >
                    <div className="w-16 h-16 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <ClipboardList size={24} />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-lg font-bold text-slate-800">{order.service}</h4>
                        <div className="flex gap-4 mt-1 text-xs text-slate-400 font-medium">
                            <span className="flex items-center text-[14px] gap-1"><Calendar size={12} /> {new Date(order.date).toLocaleDateString('mn-MN')}</span>
                            <span className="text-amber-400">#{order.id}</span>
                        </div>
                    </div>
                    <div className="text-right flex gap-6 items-center">
                        <span className={`text-[13px] font-bold px-3 py-1 rounded-lg ${getStatusStyle(order.status)}`}>
                            {order.status}
                        </span>
                        <p className="font-extrabold text-lg text-slate-900">
                            {Number(order.total_price).toLocaleString()}₮
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}