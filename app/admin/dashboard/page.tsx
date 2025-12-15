'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE_URL = "http://localhost:4000/api/admin";

interface Order {
    order_id: number;
    service: string;
    city: string;
    district: string;
    khoroo: string;
    full_name: string;
    email: string;
    phone: string;
    address: string;
    frequency: string;
    total_price: number;
    status: string;
    date: string;

    created_at: string;
}

const STATUS_OPTIONS = [
    'Хүлээгдэж байна',
    'Баталгаажсан',
    'Дууссан',
    'Цуцлагдсан'
];

const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ status: newStatus })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.error || "Алдаа гарлаа");
            return;
        }

        alert("Статус амжилттай шинэчлэгдлээ");

    } catch (error) {
        console.error(error);
        alert("Сервертэй холбогдож чадсангүй");
    }
};

export default function AdminDashboardPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'dashboard' | 'orders'>('dashboard');

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

    const totalOrders = orders.length;
    const pending = orders.filter(o => o.status === "Хүлээгдэж байна").length;
    const confirmed = orders.filter(o => o.status === "Баталгаажсан").length;
    const completed = orders.filter(o => o.status === "Дууссан").length;
    const canceled = orders.filter(o => o.status === "Цуцлагдсан").length;

    const recentOrders = orders.slice(0, 5);

    const Dashboard = () => (
        <div className="space-y-8">
            <h2 className="text-3xl font-semibold mb-4">Статистик</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="p-6 bg-white shadow rounded-xl border">
                    <p className="text-gray-500">Нийт захиалга</p>
                    <p className="text-3xl font-bold">{totalOrders}</p>
                </div>

                <div className="p-6 bg-yellow-50 shadow rounded-xl border">
                    <p className="text-gray-600">Шинэ (Pending)</p>
                    <p className="text-3xl font-bold text-yellow-700">{pending}</p>
                </div>

                <div className="p-6 bg-blue-50 shadow rounded-xl border">
                    <p className="text-gray-600">Баталгаажсан</p>
                    <p className="text-3xl font-bold text-blue-700">{confirmed}</p>
                </div>

                <div className="p-6 bg-green-50 shadow rounded-xl border">
                    <p className="text-gray-600">Гүйцэтгэсэн</p>
                    <p className="text-3xl font-bold text-green-700">{completed}</p>
                </div>
            </div>

            <div className="mt-10">
                <h3 className="text-2xl font-semibold mb-4">Сүүлийн 5 захиалга</h3>
                <div className="bg-white rounded-xl shadow border overflow-hidden">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-300">
                            <tr>

                                <th className="p-3 border-b">Нэр</th>
                                <th className="p-3 border-b">Email</th>
                                <th className="p-3 border-b">Үйлчилгээ</th>
                                <th className="p-3 border-b">Хаяг</th>
                                <th className="p-3 border-b">Үнэ</th>
                                <th className="p-3 border-b">Төлөв</th>
                                <th className="p-3 border-b">Үүссэн хугацаа</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((order, idx) => (
                                <tr key={order.order_id ?? idx} className="hover:bg-gray-100">
                                    <td className="pl-5 border-b">{order.full_name}</td>
                                    <td className="pl-5 border-b">{order.email}</td>
                                    <td className="pl-5 border-b">{order.service}</td>
                                    <td className="p-3 border-b"><strong>{order.district}, {order.khoroo}, {order.address}</strong></td>
                                    <td className="p-3 border-b text-emerald-500 font-bold">
                                        {order.total_price} ₮
                                    </td>
                                    <td className="p-3 border-b">{order.status}</td>
                                    <td className="p-3 border-b">{new Date(order.created_at).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const OrdersList = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold pb-2">
                Бүх захиалга ({orders.length})
            </h2>

            <div className="bg-white rounded-xl shadow border overflow-hidden">
                <table className="min-w-full bg-white">
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
                        {orders.map((order, idx) => (
                            <tr key={order.order_id ?? idx} className=" m-3 hover:bg-gray-50">
                                <td className="p-2 border-b">{order.order_id ?? idx}</td>
                                <td className="p-2 border-b">
                                    {order.service}
                                    <div className="text-xs text-gray-500">{order.date}</div>
                                </td>
                                <td className="p-2 border-b text-sm">{order.district}, {order.address}</td>
                                <td className="p-2 border-b text-emerald-700 font-bold">
                                    {order.total_price} ₮
                                </td>
                                <td className="p-2 border-b">{order.status}</td>
                                <td className="p-2 border-b">
                                    <select
                                        value={order.status}
                                        onChange={e => handleStatusChange(order.order_id, e.target.value)}
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

    return (
        <div className="p-8 bg-gray-50 min-h-screen rounded-[14px]">
            <div className="flex space-x-4 border-b mb-6">
                <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`pb-2 ${activeTab === 'dashboard' ? 'border-b-4 border-blue-600 font-bold text-xl' : ''}`}
                >
                    Dashboard
                </button>
                <button
                    onClick={() => setActiveTab('orders')}
                    className={`pb-2 ${activeTab === 'orders' ? 'border-b-4 border-blue-600 font-bold text-xl' : ''}`}
                >
                    Захиалгууд
                </button>
            </div>

            {activeTab === 'dashboard' ? <Dashboard /> : <OrdersList />}
        </div>
    );
}
