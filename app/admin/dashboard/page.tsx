'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import Loading from '../../loading';
import { useSiteToast } from '../../hooks/useSiteToast'

const API_BASE_URL = "https://purenest-app.onrender.com/api/admin";

interface Order {
    id: number;
    service: string;
    city: string;
    district: string;
    khoroo: string;
    full_name: string;
    email: string;
    phone_number: string;
    address: string;
    frequency: string;
    total_price: number;
    status: string;
    date: string;
    created_at: string;
}
interface User {
    full_name: string,
}

// Үйлчилгээний нэр биш, захиалгын явцын статусуудыг энд бичнэ
const STATUS_OPTIONS = ['Хүлээгдэж байна', 'Баталгаажсан', 'Дууссан', 'Цуцлагдсан'];
const STATUS_STYLES: Record<string, string> = {
    "Дууссан": "bg-green-100 text-green-700",
    "Баталгаажсан": "bg-blue-100 text-blue-700",
    "Хүлээгдэж байна": "bg-amber-100 text-amber-700",
    "Цуцлагдсан": "bg-red-100 text-red-700",
};
const COLORS = ['#102B5A', '#FFBB28', '#00C49F']; // Төлөвт тохирох өнгөнүүд

export default function AdminDashboardPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'analytics'>('dashboard');
    const { showToast } = useSiteToast();
    const fetchAdminData = async () => {
        const token = localStorage.getItem('token');
        if (!token) { router.push('/login'); return; }

        try {
            const res = await fetch(`${API_BASE_URL}/orders`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Алдаа гарлаа");
            const data = await res.json();
            setOrders(data.orders || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAdminData(); }, []);

    // Статус шинэчлэх функц
    const handleStatusUpdate = async (id: number, newStatus: string) => {
        // ХУУЧИН: const url = `https://purenest-app.onrender.com/api/admin/orders/:id/status`;

        // ШИНЭ: Жинхэнэ id-г нь url дотор нь ингэж хийнэ
        const url = `https://purenest-app.onrender.com/api/admin/orders/${id}/status`;

        console.log("Хүсэлт илгээж буй URL:", url); // Шалгах зорилгоор

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            const data = await res.json();

            if (res.ok) {
                setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
            } else {
                showToast({ title: "Алдаа", description: "Шинэчилж чадсангүй." })
            }
        } catch (error) {
            console.error("Хүсэлт илгээхэд алдаа гарлаа:", error);
            showToast({ title: "Алдаа", description: "Сервертэй холбогдож чадсангүй." })
        }
    };
    const statsData = useMemo(() => {
        // 1. Нийт орлого (Дууссан захиалгууд дээр)
        const totalRevenue = orders.reduce((sum, o) =>
            sum + (o.status === "Дууссан" ? Number(o.total_price) : 0), 0
        );

        // 2. Үйлчилгээний төрлөөр тоолох (PieChart-д зориулсан)
        const SERVICE_TYPES = ["Оффис цэвэрлэгээ", "СӨХ цэвэрлэгээ", "Олон нийтийн талбай"];

        const serviceCounts = SERVICE_TYPES.map(serviceName => ({
            name: serviceName.replace(" цэвэрлэгээ", ""), // График дээр богино харагдуулахын тулд
            value: orders.filter(o => o.service === serviceName).length
        }));

        // 3. Сүүлийн 7 хоногийн орлогын дата (LineChart-д зориулсан)
        const revenueByDate = orders
            .filter(o => o.status === "Дууссан")
            .reduce((acc: any, o) => {
                const day = new Date(o.created_at).toLocaleDateString('mn-MN', { month: 'numeric', day: 'numeric' });
                acc[day] = (acc[day] || 0) + Number(o.total_price);
                return acc;
            }, {});

        const chartData = Object.keys(revenueByDate).map(date => ({
            date,
            amount: revenueByDate[date]
        })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(-7);

        return { totalRevenue, serviceCounts, chartData };
    }, [orders]);

    if (loading) return <Loading />;

    return (
        <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen text-slate-800">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Админ Удирдах Хэсэг
                </h1>
                <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-black/5">
                    {['dashboard', 'orders', 'analytics'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-6 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === tab ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
                                }`}
                        >
                            {tab === 'dashboard' ? 'Статистик' : tab === 'orders' ? 'Захиалгууд' : 'Шинжилгээ'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Tabs */}
            {activeTab === 'dashboard' && (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-center">
                        <StatCard title="Нийт Орлого" value={`${statsData.totalRevenue.toLocaleString()} ₮`} color="text-emerald-600 text-xl" bg="bg-emerald-50" />
                        <StatCard title="Шинэ Захиалга" value={orders.filter(o => o.status === "Хүлээгдэж байна").length} color="text-amber-600" bg="bg-amber-50" />
                        <StatCard title="Баталгаажсан" value={orders.filter(o => o.status === "Баталгаажсан").length} color="text-blue-600" bg="bg-blue-50" />
                        <StatCard title="Цуцлагдсан" value={orders.filter(o => o.status === "Цуцлагдсан").length} color="text-red-600" bg="bg-red-50" />
                        <StatCard title="Дууссан" value={orders.filter(o => o.status === "Дууссан").length} color="text-emerald-600" bg="bg-emerald-100" />
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow-sm border">
                        <h3 className="text-xl font-bold mb-4">Сүүлийн 10 захиалга</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="text-slate-400 text-xs uppercase tracking-wider border-b">
                                    <tr>
                                        <th className="pb-4 px-2">Хэрэглэгч</th>
                                        <th className="pb-4 px-2">И-мэйл</th>
                                        <th className='pb-4 px-2'>Утас</th>
                                        <th className="pb-4 px-2">Хэзээ</th>
                                        <th className="pb-4 px-2">Үйлчилгээ</th>
                                        <th className="pb-4 px-2">Нийт үнэ</th>
                                        <th className="pb-4 px-2">Төлөв</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {orders.slice(0, 10).map((o, idx) => (
                                        // order_id байхгүй бол индекс ашиглах, эсвэл хослуулах нь аюулгүй
                                        <tr key={`recent-${o.id || idx}`} className="text-sm hover:bg-slate-50 transition-colors">
                                            <td className="py-4 px-2 font-medium">{o.full_name}</td>
                                            <td className="py-4 px-2 text-blue-600 underline">{o.email}</td>
                                            <td className="py-4 px-2">{o.phone_number}</td>
                                            <td className="py-4 px-2 font-medium">
                                                {new Date(o.date).toLocaleString('mn-MN', {
                                                    year: 'numeric',
                                                    month: '2-digit',
                                                    day: '2-digit'
                                                })}
                                            </td>
                                            <td className="py-4 px-2">{o.service}</td>
                                            <td className="py-4 px-2 font-bold">{Number(o.total_price).toLocaleString()} ₮</td>
                                            <td className="py-4 px-2">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${STATUS_STYLES[o.status] || "bg-slate-100 text-slate-700"
                                                    }`}>
                                                    {o.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'orders' && (
                <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b">
                                <tr className="text-xs font-bold text-slate-500">
                                    <th className="p-4">ID</th>
                                    <th className="p-4">Нэр</th>
                                    <th className="p-4">Утас</th>
                                    <th className="p-4">Үйлчилгээ</th>
                                    <th className="p-4">Хаяг</th>
                                    <th className="p-4">Он сар</th>
                                    <th className="p-4">Төлбөр</th>
                                    <th className="p-4">Төлөв</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {orders.map((o) => (
                                    <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 text-xs">#{o.id}</td>
                                        <td className="p-4 text-xm">{o.full_name}</td>
                                        <td className="p-4 text-xm">{o.phone_number}</td>
                                        <td className="p-4">
                                            <p className="font-bold text-sm">{o.service}</p>

                                        </td>
                                        <td className="p-4 text-sm text-black truncate max-w-[200px]">{o.district},{o.khoroo},{o.address}</td>
                                        <td className="p-4 text-sm text-black truncate max-w-[200px]">{new Date(o.date).toLocaleString('mn-MN', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit'
                                            })} </td>
                                        <td className="p-4 font-bold text-blue-600">{Number(o.total_price).toLocaleString()} ₮</td>
                                        <td className="p-4">
                                            <select
                                                value={o.status}
                                                onChange={(e) => handleStatusUpdate(o.id, e.target.value)}
                                                className="text-xs border border-black/5 rounded-lg p-2 bg-white shadow-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            >
                                                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'analytics' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold">Орлогын өсөлт</h3>
                            <span className="text-xs text-slate-400">Сүүлийн 7 хоног</span>
                        </div>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={statsData.chartData}>
                                    {/* Сүлжээний шугамыг бүдгэрүүлэх */}
                                    <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#f1f5f9" />

                                    <XAxis
                                        dataKey="date"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        dy={10}
                                        stroke="#94a3b8"
                                    />

                                    <YAxis
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        stroke="#94a3b8"
                                        tickFormatter={(value) => `${(value / 1000000).toLocaleString()} сая`} // 10,000 -> 10k
                                    />

                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '12px',
                                            border: 'none',
                                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                                        }}
                                        // value-г optional (number | undefined) байж болно гэж зааж өгнө
                                        formatter={(value: any) => [`${Number(value).toLocaleString()} ₮`, "Орлого"]}
                                    />

                                    {/* Илүү гоё харагдуулахын тулд Line-ийг smooth (monotone) болгох */}
                                    <Line
                                        type="monotone"
                                        dataKey="amount"
                                        stroke="#3B82F6"
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: "#3B82F6", strokeWidth: 2, stroke: "#fff" }}
                                        activeDot={{ r: 6, strokeWidth: 0 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>


                    <div className="bg-white p-6 rounded-3xl shadow-sm border">
                        <h3 className="text-lg font-bold mb-6">Үйлчилгээний төрөл</h3>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statsData.serviceCounts} // Service-ийн датаг энд холбоно
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {statsData.serviceCounts.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Тайлбар хэсэг (Legend) */}
                        <div className="flex flex-col gap-3 mt-4">
                            {statsData.serviceCounts.map((s, i) => (
                                <div key={s.name} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                        <span className="text-slate-600 font-medium">{s.name}</span>
                                    </div>
                                    <span className="text-slate-400 font-bold">{s.value} захиалга</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Туслах компонент: Карт
function StatCard({ title, value, color, bg }: { title: string, value: string | number, color: string, bg: string }) {
    return (
        <div className={`p-6 rounded-3xl border border-white shadow-sm ${bg} transition-transform hover:scale-[1.02]`}>
            <p className="text-slate-500 text-xs font-medium mb-1 uppercase tracking-wider">{title}</p>
            <p className={`text-2xl font-black ${color}`}>{value}</p>
        </div>
    );
}