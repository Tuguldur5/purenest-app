'use client';
import React from 'react';
import { Package, Calendar, CreditCard, ChevronRight, ShoppingBag, Clock, CheckCircle2, AlertCircle ,ClipboardList} from 'lucide-react';

// 1. Төрлүүдийг (Types) тодорхойлох
export interface OrderItem {
    id: string | number;
    product_name: string;
    quantity: number;
    price: number;
    image_url?: string;
}

export interface Order {
    id: string | number;
    date: string;
    total: number;
    status: 'Хүлээгдэж буй' | 'Төлөгдсөн' | 'Хүргэгдсэн' | 'Цуцлагдсан' | string;
    items?: OrderItem[];
}

interface OrderHistoryProps {
    orders: Order[];
}

// 2. Үндсэн компонент
export default function OrderHistory({ orders }: OrderHistoryProps) {
    
    // Төлөвийн өнгийг тодорхойлох функц
    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'Хүргэгдсэн':
                return { color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: <CheckCircle2 size={12} /> };
            case 'Төлөгдсөн':
                return { color: 'bg-blue-50 text-blue-600 border-blue-100', icon: <CreditCard size={12} /> };
            case 'Хүлээгдэж буй':
                return { color: 'bg-amber-50 text-amber-600 border-amber-100', icon: <Clock size={12} /> };
            case 'Цуцлагдсан':
                return { color: 'bg-rose-50 text-rose-600 border-rose-100', icon: <AlertCircle size={12} /> };
            default:
                return { color: 'bg-slate-50 text-slate-500 border-slate-100', icon: <Package size={12} /> };
        }
    };

    // Хэрэв захиалга байхгүй бол
    if (!orders || orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-100">
                <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-6 text-slate-200">
                    <ShoppingBag size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Захиалгын түүх хоосон байна</h3>
                <p className="text-slate-400 text-sm mt-2 max-w-xs text-center">
                    Та одоогоор ямар нэгэн захиалга хийгээгүй байна. Манай үйлчилгээнүүдээс сонгож захиалга өгөөрэй.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Гарчиг хэсэг */}
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-600 rounded-xl text-white">
                        <Package size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">Үйлчилгээний захиалга</h2>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Нийт {orders.length} бичилт</p>
                    </div>
                </div>
            </div>

            {/* Захиалгын жагсаалт */}
            <div className="grid gap-4">
                {orders.map((order) => {
                    const status = getStatusConfig(order.status);
                    return (
                        <div 
                            key={order.id} 
                            className="group bg-white border border-slate-100 rounded-3xl p-5 hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-100 transition-all duration-300 relative overflow-hidden"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                
                                {/* Зүүн тал: Мэдээлэл */}
                                <div className="flex items-start gap-5">
                                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-inner">
                                        <ClipboardList size={24} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-black text-slate-800 uppercase tracking-tighter">ID: #{order.id}</span>
                                            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider ${status.color}`}>
                                                {status.icon}
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-slate-500">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={14} className="text-slate-300" />
                                                <span className="text-xs font-semibold">{new Date(order.date).toLocaleDateString('mn-MN')}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={14} className="text-slate-300" />
                                                <span className="text-xs font-semibold">14:20</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Баруун тал: Үнэ болон Үйлдэл */}
                                <div className="flex items-center justify-between md:justify-end gap-8 pt-4 md:pt-0 border-t md:border-t-0 border-slate-50">
                                    <div className="text-left md:text-right">
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Төлөх дүн</p>
                                        <p className="text-xl font-black text-indigo-600 tabular-nums">
                                            {Number(order.total).toLocaleString()}₮
                                        </p>
                                    </div>
                                    
                                    <button className="flex items-center justify-center w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all active:scale-95">
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Гоёлын декор (Subtle background accent) */}
                            <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 pointer-events-none">
                                <Package size={120} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Доод хэсэг */}
            <div className="flex justify-center pt-4">
                <button className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors py-2 px-4 rounded-xl hover:bg-indigo-50">
                    Өмнөх захиалгуудыг харах
                </button>
            </div>
        </div>
    );
}