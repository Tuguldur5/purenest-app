'use client';

import { useState, useEffect } from 'react';
import { Package, Search, Calendar, User, Phone, MapPin, ShoppingBag } from 'lucide-react';
import { useSiteToast } from '@/app/hooks/useSiteToast';

const API_URL = "https://purenest-app.onrender.com/api/admin/product-orders";

export default function ProductOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const { showToast } = useSiteToast();

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(API_URL, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            const sortedOrders = (data.orders || []).sort((a: any, b: any) => 
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
            setOrders(sortedOrders);
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
            const res = await fetch(`${API_URL}/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
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

    if (loading) return <div className="p-10 text-center font-sans text-gray-500">Уншиж байна...</div>;

    return (
        <div className="p-6 bg-[#fcfcfd] min-h-screen font-sans">
            <div className="max-w-7xl mx-auto">
                
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Package size={24} className="text-blue-600" /> Барааны захиалгууд
                    </h1>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input 
                            type="text"
                            placeholder="Хайх..."
                            className="bg-white border border-gray-200 py-2 pl-10 pr-4 rounded-xl text-sm outline-none focus:border-blue-500 w-full md:w-64 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr className="text-xs font-semibold text-gray-500">
                                    <th className="p-4">ID</th>
                                    <th className="p-4">Захиалагч</th>
                                    <th className="p-4">Бараанууд</th>
                                    <th className="p-4">Нийт дүн</th>
                                    <th className="p-4">Төлөв</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors text-[13px]">
                                        <td className="p-4">
                                            <span className="font-medium text-gray-400">#{order.id}</span>
                                            <p className="text-[11px] text-gray-400 mt-1">{new Date(order.created_at).toLocaleDateString()}</p>
                                        </td>
                                        
                                        <td className="p-4">
                                            <p className="font-semibold text-gray-800">{order.full_name}</p>
                                            <p className="text-gray-500 text-xs mt-0.5">{order.phone_number}</p>
                                            <p className="text-gray-400 text-[11px] truncate max-w-[180px] mt-0.5">{order.address}</p>
                                        </td>

                                        <td className="p-4">
                                            <div className="flex flex-col gap-1">
                                                {order.items?.map((item: any, i: number) => (
                                                    <div key={i} className="text-[12px] text-gray-600 flex items-center gap-1">
                                                        <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                                                        {item.name} <span className="font-bold text-blue-600">x{item.quantity}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>

                                        <td className="p-4 font-bold text-gray-900">
                                            {Number(order.total_amount).toLocaleString()}₮
                                        </td>

                                        <td className="p-4">
                                            <select
                                                value={order.status}
                                                onChange={(e) => updateStatus(order.id, e.target.value)}
                                                className={`text-[12px] font-medium border rounded-lg px-2 py-1.5 outline-none cursor-pointer
                                                    ${order.status === 'Хүргэгдсэн' ? 'bg-green-50 text-green-700 border-green-200' : 
                                                      order.status === 'Цуцлагдсан' ? 'bg-red-50 text-red-700 border-red-200' : 
                                                      'bg-blue-50 text-blue-700 border-blue-200'}`}
                                            >
                                                <option value="Хүлээгдэж байна">Хүлээгдэж байна</option>
                                                <option value="Баталгаажсан">Баталгаажсан</option>
                                                <option value="Хүргэлтэнд гарсан">Хүргэлтэнд гарсан</option>
                                                <option value="Хүргэгдсэн">Хүргэгдсэн</option>
                                                <option value="Цуцлагдсан">Цуцлагдсан</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}