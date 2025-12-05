'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE_URL = "http://localhost:4000/api/admin"; // ✔ Backend-той таарсан

const STATUS_OPTIONS = ['Pending', 'Confirmed', 'Completed', 'Canceled'];

interface Order {
    order_id: number;
    service: string;
    city: string;
    district: string;
    address: string;
    frequency: string;
    total_price: number;
    status: string;
    date: string;
    full_name?: string;
    phone_number?: string;
}

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
        daily_discount: 0.2
    });

    const [activeTab, setActiveTab] = useState<'orders' | 'pricing'>('orders');
    const [loading, setLoading] = useState(true);

    // ------------------ ⚡ Fetch Admin Data ------------------
    const fetchAdminData = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/orders`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.status === 403) {
                alert("Админ эрх шаардлагатай.");
                router.push('/');
                return;
            }

            if (!res.ok) {
                alert("Захиалга татахад алдаа гарлаа.");
                return;
            }

            const data = await res.json();
            setOrders(data.orders || []);

        } catch (error) {
            console.error("Fetch error:", error);
            alert("Сервертэй холбогдож чадсангүй.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdminData();
    }, []);

    if (loading) {
        return <div className="p-10 text-center text-xl">Уншиж байна...</div>;
    }

    // ------------------ ⚡ Status Update ------------------
    const handleStatusChange = async (orderId: number, newStatus: string) => {
        const token = localStorage.getItem('token');

        try {
            const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            const data = await res.json();

            if (!res.ok) {
                alert("Алдаа: " + data.error);
                return;
            }

            setOrders(prev =>
                prev.map(o =>
                    o.order_id === orderId ? { ...o, status: newStatus } : o
                )
            );

        } catch (error) {
            console.error(error);
            alert("Сүлжээний алдаа.");
        }
    };

    // ------------------ ⚡ Pricing Save ------------------
    const handlePricingSave = async (e: any) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            const res = await fetch(`${API_BASE_URL}/pricing`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(pricing)
            });

            const data = await res.json();

            if (!res.ok) {
                alert("Алдаа: " + data.error);
                return;
            }

            alert("Үнийн тохиргоо амжилттай хадгаллаа!");

        } catch (error) {
            alert("Сүлжээний алдаа.");
        }
    };

    // ------------------ ⚡ Orders List Component ------------------
    const OrdersList = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold border-b pb-2">
                Захиалгууд ({orders.length})
            </h2>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 border-b">ID</th>
                            <th className="p-2 border-b">Үйлчилгээ</th>
                            <th className="p-2 border-b">Хаяг</th>
                            <th className="p-2 border-b">Үнэ</th>
                            <th className="p-2 border-b">Төлөв</th>
                            <th className="p-2 border-b">Өөрчлөх</th>
                        </tr>
                    </thead>

                    <tbody>
                        {orders.map(order => (
                            <tr key={order.order_id} className="hover:bg-gray-50">
                                <td className="p-2 border-b">{order.order_id}</td>

                                <td className="p-2 border-b">
                                    {order.service}
                                    <div className="text-xs text-gray-500">{order.date}</div>
                                </td>

                                <td className="p-2 border-b text-sm">
                                    {order.district}, {order.address}
                                </td>

                                <td className="p-2 border-b text-emerald-700 font-bold">
                                    {order.total_price.toLocaleString()} ₮
                                </td>

                                <td className="p-2 border-b">
                                    <span className={`px-2 py-1 rounded text-xs ${
                                        order.status === 'Confirmed'
                                            ? 'bg-green-100 text-green-800'
                                            : order.status === 'Completed'
                                            ? 'bg-blue-100 text-blue-800'
                                            : order.status === 'Canceled'
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {order.status}
                                    </span>
                                </td>

                                <td className="p-2 border-b">
                                    <select
                                        value={order.status}
                                        onChange={e =>
                                            handleStatusChange(order.order_id, e.target.value)
                                        }
                                        className="border p-1 rounded bg-white text-sm"
                                    >
                                        {STATUS_OPTIONS.map(s => (
                                            <option key={s}>{s}</option>
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

    // ------------------ ⚡ Pricing Component ------------------
    const PricingSettings = () => (
        <form
            onSubmit={handlePricingSave}
            className="space-y-6 max-w-xl mx-auto p-6 border rounded-lg shadow"
        >
            <h2 className="text-2xl font-semibold border-b pb-2">
                Үнийн тохиргоо
            </h2>

            {/* Оффис */}
            <label className="block">Оффис цэвэрлэгээ (₮/м²)</label>
            <input
                type="number"
                value={pricing.office_price_per_sqm}
                onChange={e => setPricing({ ...pricing, office_price_per_sqm: +e.target.value })}
                className="border p-2 w-full rounded"
            />

            {/* СӨХ: Суурь */}
            <label className="block">СӨХ — Байрны суурь үнэ (₮)</label>
            <input
                type="number"
                value={pricing.suh_apartment_base}
                onChange={e => setPricing({ ...pricing, suh_apartment_base: +e.target.value })}
                className="border p-2 w-full rounded"
            />

            {/* СӨХ: Давхар */}
            <label className="block">СӨХ — Давхарын үнэ (₮)</label>
            <input
                type="number"
                value={pricing.suh_floor_price}
                onChange={e => setPricing({ ...pricing, suh_floor_price: +e.target.value })}
                className="border p-2 w-full rounded"
            />

            {/* Хөнгөлөлт */}
            <label className="block">Хөнгөлөлт (%)</label>
            <input
                type="number"
                value={pricing.daily_discount * 100}
                onChange={e => setPricing({ ...pricing, daily_discount: +e.target.value / 100 })}
                className="border p-2 w-full rounded"
            />

            <button className="bg-blue-600 text-white p-3 w-full rounded">
                Хадгалах
            </button>
        </form>
    );

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-4xl font-bold mb-8">Админ дашбоард</h1>

            {/* Tabs */}
            <div className="flex space-x-4 border-b mb-6">
                <button
                    onClick={() => setActiveTab('orders')}
                    className={`pb-2 ${activeTab === 'orders' ? 'border-b-4 border-blue-600 font-bold' : ''}`}
                >
                    Захиалгууд
                </button>

                <button
                    onClick={() => setActiveTab('pricing')}
                    className={`pb-2 ${activeTab === 'pricing' ? 'border-b-4 border-blue-600 font-bold' : ''}`}
                >
                    Үнийн тохиргоо
                </button>
            </div>

            {activeTab === 'orders' ? <OrdersList /> : <PricingSettings />}
        </div>
    );
}
