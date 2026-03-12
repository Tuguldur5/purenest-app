'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
    ClipboardList, Calendar, ArrowLeft, MapPin,
    Layout, Image as ImageIcon, MessageSquare, Download, X, ChevronRight, Clock, Filter, Search
} from 'lucide-react';

interface Order {
    id: number;
    service: string;
    total_price: number;
    status: string;
    date: string;
    address?: string;
}

interface Report {
    description: string;
    images: string[];
}

export default function OrderHistory() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [report, setReport] = useState<Report | null>(null);
    const [loading, setLoading] = useState(true);
    const [reportLoading, setReportLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

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

    const handleSelectOrder = async (order: Order) => {
        setSelectedOrder(order);
        setReport(null);
        setReportLoading(true);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`https://purenest-app.onrender.com/api/report/${order.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
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

    // Хайлт болон Шүүлтүүрийн логик
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesSearch = order.id.toString().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || order.status.toLowerCase().includes(statusFilter.toLowerCase());
            return matchesSearch && matchesStatus;
        });
    }, [orders, searchTerm, statusFilter]);

    const getStatusStyle = (status: string) => {
        const s = status.toLowerCase();
        if (s.includes('дууссан') || s.includes('success')) return 'bg-green-100 text-green-700 border-green-200';
        if (s.includes('хүлээгдэж') || s.includes('pending')) return 'bg-orange-100 text-orange-700 border-orange-200';
        return 'bg-blue-100 text-blue-700 border-blue-200';
    };

    if (loading) return <div className="p-10 text-center text-slate-500 font-medium">Ачаалж байна...</div>;

    return (
        <div className="max-w-5xl mx-auto px-4 py-4 sm:py-6">

            {/* Image Modal */}
            {selectedImage && (
                <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
                    <button onClick={() => setSelectedImage(null)} className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full">
                        <X size={24} />
                    </button>
                    <img src={selectedImage} className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" alt="Full view" />
                </div>
            )}

            {selectedOrder ? (
                <div className="animate-in fade-in duration-300">
                    <button
                        onClick={() => setSelectedOrder(null)}
                        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-6 font-bold text-sm sm:text-base"
                    >
                        <ArrowLeft size={18} /> Буцах
                    </button>

                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                        <div className="p-5 sm:p-8 bg-slate-50/50 border-b border-slate-100">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                                <div className="space-y-1">
                                    <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Захиалга #{selectedOrder.id}</div>
                                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800">{selectedOrder.service}</h2>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 mt-3 text-sm text-slate-500">
                                        <span className="flex items-center gap-1.5 font-medium"><Calendar size={16} /> {new Date(selectedOrder.date).toLocaleDateString('mn-MN')}</span>
                                        <span className="flex items-center gap-1.5 font-medium"><MapPin size={16} /> {selectedOrder.address || "Хаяг байхгүй"}</span>
                                    </div>
                                </div>
                                <div className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold border self-start ${getStatusStyle(selectedOrder.status)}`}>
                                    {selectedOrder.status}
                                </div>
                            </div>
                        </div>

                        <div className="p-5 sm:p-8">
                            <h4 className="flex items-center gap-2 font-bold text-slate-800 mb-5 uppercase text-[11px] tracking-wider">
                                <Layout size={16} className="text-indigo-500" /> Ажлын гүйцэтгэл
                            </h4>

                            {reportLoading ? (
                                <div className="py-10 text-center text-slate-400 font-medium">Уншиж байна...</div>
                            ) : report ? (
                                <div className="space-y-6">
                                    <div className="p-4 sm:p-5 bg-slate-50 rounded-xl border border-slate-100 text-slate-600 leading-relaxed text-sm sm:text-base font-medium italic">
                                        "{report.description}"
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                                        {report.images.map((img, idx) => (
                                            <div
                                                key={idx}
                                                onClick={() => setSelectedImage(img)}
                                                className="aspect-square rounded-xl overflow-hidden border border-slate-200 cursor-pointer hover:opacity-90 transition-opacity"
                                            >
                                                <img src={img} className="w-full h-full object-cover" alt="Баримт" />
                                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                                    <a
                                                        href={img}
                                                        download={`report-image-${idx}.jpg`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        onClick={(e) => e.stopPropagation()} // Томруулах event-ийг дарахаас сэргийлнэ
                                                        className="pointer-events-auto p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center text-slate-700"
                                                        title="Татах"
                                                    >
                                                        <Download size={18} />
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="p-10 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-sm font-medium">
                                    Тайлан ороогүй байна.
                                </div>
                            )}
                        </div>

                        <div className="p-5 sm:p-8 bg-slate-50/30 border-t border-slate-100 flex justify-between items-center">
                            <span className="text-slate-500 font-bold uppercase text-xs tracking-wider">Нийт төлбөр</span>
                            <span className="text-xl sm:text-2xl font-bold text-slate-900">{Number(selectedOrder.total_price).toLocaleString()}₮</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Миний захиалгууд</h1>
                        <p className="text-slate-500 text-sm font-medium">Нийт үйлчилгээний түүх</p>
                    </div>

                    {/* Search & Filter Controls */}
                    <div className="flex flex-col sm:flex-row gap-3">
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
                                <option value="баталгаажсан">Баталгаажсан</option>
                                <option value="дууссан">Дууссан</option>
                                <option value="цуцлагдсан">Цуцлагдсан</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:gap-4 font-sans">
                        {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                            <div
                                key={order.id}
                                onClick={() => handleSelectOrder(order)}
                                className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:shadow-md transition-all flex items-center gap-3 sm:gap-6 cursor-pointer group"
                            >
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors flex-shrink-0">
                                    <ClipboardList size={20} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h4 className="text-base sm:text-lg font-bold text-slate-800 truncate">{order.service}</h4>
                                    <div className="flex items-center gap-3 mt-1 text-[11px] sm:text-xs text-slate-400 font-bold uppercase tracking-wide">
                                        <span className="flex items-center gap-1 font-bold"><Calendar size={12} /> {new Date(order.date).toLocaleDateString('mn-MN')}</span>
                                        <span className="text-indigo-500 font-bold">#{order.id}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-6">
                                    <div className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-bold border tracking-wide uppercase ${getStatusStyle(order.status)}`}>
                                        {order.status}
                                    </div>
                                    <div className="text-right sm:min-w-[100px]">
                                        <p className="font-bold text-base sm:text-lg text-slate-900">{Number(order.total_price).toLocaleString()}₮</p>
                                    </div>
                                    <ChevronRight size={18} className="text-slate-300 hidden sm:block" />
                                </div>
                            </div>
                        )) : (
                            <div className="py-20 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                <p className="text-slate-400 text-sm font-medium">Захиалга олдсонгүй</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}