'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// API-ийн үндсэн хаяг
const API_BASE_URL = "http://localhost:4000/api/admin";

// Захиалгын төрлүүд
const STATUS_OPTIONS = ['Pending', 'Confirmed', 'Completed', 'Canceled'];

// Жишээ захиалгын мэдээлэл (Backend-ээс ирэх ёстой)
interface Order {
    order_id: number;
    service: string;
    city: string;
    district: string;
    address: string;
    frequency: string;
    total_price: number;
    status: string; // 'Pending' | 'Confirmed' | 'Completed' | 'Canceled'
    date: string;
}

// Жишээ Үнийн Тохиргоо (Backend-ээс ирэх ёстой)
interface Pricing {
    office_price_per_sqm: number;
    suh_apartment_base: number;
    suh_floor_price: number;
    daily_discount: number;
}


export default function AdminDashboardPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [pricing, setPricing] = useState<Pricing>({ 
        office_price_per_sqm: 20000, 
        suh_apartment_base: 100000, 
        suh_floor_price: 20000, 
        daily_discount: 0.20 // 20%
    });
    const [activeTab, setActiveTab] = useState<'orders' | 'pricing'>('orders');
    const [loading, setLoading] = useState(true);

    // --- 1. Дата Татаж Авах Функц ---
    const fetchAdminData = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Нэвтрэх шаардлагатай.");
            router.push('/login');
            return;
        }

        try {
            // ✅ Backend-д isAdmin middleware шалгана
            const res = await fetch(`${API_BASE_URL}/orders`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (res.status === 403) {
                alert("Админ эрхээр нэвтэрнэ үү.");
                router.push('/');
                return;
            }

            if (res.ok) {
                const data = await res.json();
                // ✅ Энд жинхэнэ захиалгын мэдээлэл ирэх ёстой
                setOrders(data.orders || []); 
                // ✅ Үнийн тохиргоог татаж авч болно.
                // setPricing(data.pricing || pricing); 
            } else {
                alert("Захиалгын мэдээлэл татахад алдаа гарлаа.");
            }
        } catch (error) {
            console.error("Fetch Error:", error);
            alert("Сервертэй холбогдоход алдаа гарлаа.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdminData();
    }, []);

    if (loading) {
        return <div className="p-10 text-center text-xl">Админ мэдээлэл ачаалж байна...</div>;
    }

    // --- 2. Захиалгын Төлөв Өөрчлөх Функц ---
    const handleStatusChange = async (orderId: number, newStatus: string) => {
        const token = localStorage.getItem('token');
        
        try {
            const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                // UI-д шууд өөрчлөлтийг хийх
                setOrders(prev => 
                    prev.map(order => 
                        order.order_id === orderId ? { ...order, status: newStatus } : order
                    )
                );
                alert(`Захиалга #${orderId} төлөв: ${newStatus} болж өөрчлөгдлөө.`);
            } else {
                const errorData = await res.json();
                alert(`Төлөв өөрчлөхөд алдаа гарлаа: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Update Error:", error);
            alert("Сүлжээний алдаа.");
        }
    };

    // --- 3. Үнийн Тохиргоог Хадгалах Функц ---
    const handlePricingSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        
        try {
            const res = await fetch(`${API_BASE_URL}/pricing`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(pricing),
            });

            if (res.ok) {
                alert("Үнийн тохиргоо амжилттай хадгалагдлаа!");
            } else {
                const errorData = await res.json();
                alert(`Үнийн тохиргоо хадгалахад алдаа гарлаа: ${errorData.error}`);
            }
        } catch (error) {
            alert("Сүлжээний алдаа.");
        }
    };
    
    // --- 4. Захиалгын Жагсаалт (Orders List Component) ---
    const OrdersList = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold border-b pb-2">Бүх Захиалга ({orders.length})</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-2 px-4 border-b">ID</th>
                            <th className="py-2 px-4 border-b">Үйлчилгээ</th>
                            <th className="py-2 px-4 border-b">Хаяг</th>
                            <th className="py-2 px-4 border-b">Үнэ (₮)</th>
                            <th className="py-2 px-4 border-b">Төлөв</th>
                            <th className="py-2 px-4 border-b">Үйлдэл</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.order_id} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b">{order.order_id}</td>
                                <td className="py-2 px-4 border-b">{order.service} ({order.date})</td>
                                <td className="py-2 px-4 border-b text-sm">{order.district}, {order.address}</td>
                                <td className="py-2 px-4 border-b font-bold text-emerald-600">{order.total_price.toLocaleString()}</td>
                                <td className="py-2 px-4 border-b">
                                    <span className={`px-2 py-1 text-xs rounded-full 
                                        ${order.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 
                                        order.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                                        order.status === 'Canceled' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="py-2 px-4 border-b">
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
                                        className="border p-1 rounded text-sm bg-white"
                                    >
                                        {STATUS_OPTIONS.map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    // --- 5. Үнийн Тохиргооны Хэсэг (Pricing Settings Component) ---
    const PricingSettings = () => (
        <form onSubmit={handlePricingSave} className="space-y-6 max-w-2xl mx-auto p-6 border rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold border-b pb-2 text-blue-600">💸 Үнийн Тохиргоо</h2>
            <p className="text-sm text-gray-500">Үйлчилгээний суурь үнэ болон хөнгөлөлтийн хувийг тохируулна.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Оффис цэвэрлэгээ */}
                <div>
                    <label className="block text-sm font-medium mb-1">Оффис цэвэрлэгээ (1м²-т ₮)</label>
                    <input
                        type="number"
                        min={100}
                        value={pricing.office_price_per_sqm}
                        onChange={(e) => setPricing({...pricing, office_price_per_sqm: Number(e.target.value)})}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>

                {/* 2. СӨХ: Байрны суурь үнэ */}
                <div>
                    <label className="block text-sm font-medium mb-1">СӨХ: Байрны суурь үнэ (₮)</label>
                    <input
                        type="number"
                        min={10000}
                        value={pricing.suh_apartment_base}
                        onChange={(e) => setPricing({...pricing, suh_apartment_base: Number(e.target.value)})}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>
                
                {/* 3. СӨХ: Давхарын үнэ */}
                <div>
                    <label className="block text-sm font-medium mb-1">СӨХ: Давхарын цэвэрлэгээний үнэ (₮)</label>
                    <input
                        type="number"
                        min={1000}
                        value={pricing.suh_floor_price}
                        onChange={(e) => setPricing({...pricing, suh_floor_price: Number(e.target.value)})}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>

                {/* 4. Өдөр тутмын хөнгөлөлт */}
                <div>
                    <label className="block text-sm font-medium mb-1">Өдөр тутмын давтамжийн хөнгөлөлт (%)</label>
                    <input
                        type="number"
                        min={0}
                        max={100}
                        step={0.01}
                        value={pricing.daily_discount * 100}
                        onChange={(e) => setPricing({...pricing, daily_discount: Number(e.target.value) / 100})}
                        className="w-full border p-2 rounded"
                        required
                    />
                    <p className="text-xs text-gray-500 mt-1">Одоогийн хөнгөлөлт: {(pricing.daily_discount * 100).toFixed(0)}%</p>
                </div>
            </div>

            <button type="submit" className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700 duration-200 font-medium">
                Үнийн Тохиргоог Хадгалах
            </button>
        </form>
    );

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-4xl font-bold mb-8 text-[#102B5A]">Админ Дашбоард</h1>
            
            <div className="flex space-x-2 mb-8 border-b">
                <button 
                    onClick={() => setActiveTab('orders')}
                    className={`py-2 px-4 font-medium ${activeTab === 'orders' ? 'border-b-4 border-[#102B5A] text-[#102B5A]' : 'text-gray-500'}`}
                >
                    🗓️ Захиалгууд
                </button>
                <button 
                    onClick={() => setActiveTab('pricing')}
                    className={`py-2 px-4 font-medium ${activeTab === 'pricing' ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-500'}`}
                >
                    💰 Үнийн Тохиргоо
                </button>
            </div>
            
            {/* Таб-уудыг харуулах */}
            {activeTab === 'orders' && <OrdersList />}
            {activeTab === 'pricing' && <PricingSettings />}
        </div>
    );
}