'use client';

import { useState, useEffect } from 'react';
import { Package, Search, Eye, X, ChevronRight, ShoppingCart } from 'lucide-react';
import { useSiteToast } from '@/app/hooks/useSiteToast';

const API_BASE_URL = "https://purenest-app.onrender.com/api/product-orders";

export default function ProductOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null); // Сонгосон захиалга
    const { showToast } = useSiteToast();

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/admin/all`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.orders) setOrders(data.orders);
        } catch (error) {
            showToast({ title: "Алдаа", description: "Захиалга уншиж чадсангүй." });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    const updateStatus = async (id: number, newStatus: string) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/admin/update-status/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
                // Хэрэв модал нээлттэй байвал модал доторх статусыг мөн шинэчилнэ
                if (selectedOrder?.id === id) {
                    setSelectedOrder({ ...selectedOrder, status: newStatus });
                }
                showToast({ title: "Амжилттай", description: "Төлөв шинэчлэгдлээ." });
            }
        } catch (error) {
            showToast({ title: "Алдаа", description: "Хүсэлт амжилтгүй боллоо." });
        }
    };

    const filteredOrders = orders.filter(order =>
        order.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.phone_number?.includes(searchTerm) ||
        order.id.toString().includes(searchTerm)
    );

    // Статусын өнгө тодорхойлох функц
    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'Хүргэгдсэн': return 'bg-green-50 text-green-700 border-green-200';
            case 'Цуцлагдсан': return 'bg-red-50 text-red-700 border-red-200';
            case 'Баталгаажсан': return 'bg-blue-50 text-blue-700 border-blue-200';
            default: return 'bg-orange-50 text-orange-700 border-orange-200';
        }
    };

    if (loading) return <div className="p-10 text-center text-gray-500">Уншиж байна...</div>;

    return (
        <div className="p-6 bg-[#fcfcfd] min-h-screen font-sans text-black">
            <div className="max-w-7xl mx-auto">
                {/* Header & Search */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Package size={24} className="text-blue-600" /> Барааны захиалгууд
                    </h1>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Захиалга хайх..."
                            className="bg-white border border-gray-200 py-2.5 pl-10 pr-4 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 w-full md:w-80 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    <th className="p-4">ID & Огноо</th>
                                    <th className="p-4">Захиалагч</th>
                                    <th className="p-4">Барааны тоо</th>
                                    <th className="p-4">Нийт дүн</th>
                                    <th className="p-4">Төлөв</th>
                                    <th className="p-4">Үйлдэл</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4">
                                            <span className="font-bold text-blue-600">#{order.id}</span>
                                            <p className="text-[11px] text-gray-400 mt-1">{new Date(order.created_at).toLocaleDateString()}</p>
                                        </td>
                                        <td className="p-4">
                                            <p className="font-semibold text-gray-800">{order.full_name}</p>
                                            <p className="text-gray-500 text-xs">{order.phone_number}</p>
                                        </td>
                                        <td className="p-4">
                                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs font-medium">
                                                {order.items?.length || 0} төрлийн бараа
                                            </span>
                                        </td>
                                        <td className="p-4 font-bold text-gray-900">
                                            {Number(order.total_amount).toLocaleString()}₮
                                        </td>
                                        <td className="p-4">
                                            <StatusSelect 
                                                status={order.status} 
                                                onChange={(val) => updateStatus(order.id, val)} 
                                                styles={getStatusStyles(order.status)}
                                            />
                                        </td>
                                        <td className="p-4">
                                            <button 
                                                onClick={() => setSelectedOrder(order)}
                                                className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium"
                                            >
                                                <Eye size={16} /> Харах
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* View Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
                        {/* Modal Header */}
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Захиалгын дэлгэрэнгүй</h2>
                                <p className="text-sm text-gray-500">ID: #{selectedOrder.id} | {new Date(selectedOrder.created_at).toLocaleString()}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 overflow-y-auto flex-1 space-y-6">
                            {/* Customer & Status */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <h3 className="text-xs font-bold uppercase text-gray-400 tracking-widest">Хэрэглэгчийн мэдээлэл</h3>
                                    <div className="bg-gray-50 p-4 rounded-2xl">
                                        <p className="font-bold text-gray-800">{selectedOrder.full_name}</p>
                                        <p className="text-sm text-gray-600 mt-1">{selectedOrder.phone_number}</p>
                                        <p className="text-sm text-gray-500 mt-2 leading-relaxed">{selectedOrder.address}</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-xs font-bold uppercase text-gray-400 tracking-widest">Захиалгын төлөв</h3>
                                    <div className="pt-1">
                                        <StatusSelect 
                                            status={selectedOrder.status} 
                                            onChange={(val) => updateStatus(selectedOrder.id, val)} 
                                            styles={`${getStatusStyles(selectedOrder.status)} w-full py-3 text-sm`}
                                        />
                                        <p className="text-[11px] text-gray-400 mt-2 text-center italic">Статус өөрчлөхөд системд шууд хадгалагдана</p>
                                    </div>
                                </div>
                            </div>

                            {/* Items List */}
                            <div className="space-y-3">
                                <h3 className="text-xs font-bold uppercase text-black tracking-widest flex items-center gap-2">
                                    <ShoppingCart size={14} /> Захиалсан бараанууд ({selectedOrder.items?.length})
                                </h3>
                                <div className="border border-black/5 rounded-xl overflow-hidden">
                                    {selectedOrder.items?.map((item: any, i: number) => (
                                        <div key={i} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-bold text-xs">
                                                    {i + 1}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-800">{item.name}</p>
                                                    <p className="text-xs text-gray-500">Нэгж үнэ: {Number(item.unit_price).toLocaleString()}₮</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-blue-600">x{item.quantity}</p>
                                                <p className="text-sm font-bold text-gray-800">{(item.unit_price * item.quantity).toLocaleString()}₮</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t bg-gray-50/50 flex justify-between items-center">
                            <div className="text-gray-500 text-sm">Нийт төлөх дүн:</div>
                            <div className="text-2xl font-black text-gray-900">{Number(selectedOrder.total_amount).toLocaleString()}₮</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Туслах компонент: Status Select
function StatusSelect({ status, onChange, styles }: { status: string, onChange: (val: string) => void, styles: string }) {
    return (
        <select
            value={status}
            onChange={(e) => onChange(e.target.value)}
            className={`text-[12px] font-bold border rounded-xl px-3 py-1.5 outline-none cursor-pointer transition-all hover:shadow-sm ${styles}`}
        >
            <option value="Хүлээгдэж байна">Хүлээгдэж байна</option>
            <option value="Баталгаажсан">Баталгаажсан</option>
            <option value="Хүргэлтэнд гарсан">Хүргэлтэнд гарсан</option>
            <option value="Хүргэгдсэн">Хүргэгдсэн</option>
            <option value="Цуцлагдсан">Цуцлагдсан</option>
        </select>
    );
}