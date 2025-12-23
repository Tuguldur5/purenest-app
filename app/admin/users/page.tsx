'use client';
import { useEffect, useState, useMemo } from "react";
import { Users, ShoppingCart, DollarSign, Search } from "lucide-react";

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(""); // Хайлт хийхэд хэрэгтэй

    useEffect(() => {
        async function loadUsers() {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("http://localhost:4000/api/admin/users", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const data = await res.json();
                if (!res.ok || data.error) {
                    alert(data.error || "Server error");
                    return;
                }
                setUsers(data.users || []);
            } catch (err) {
                console.error("Fetch users error:", err);
                alert("Сервертэй холбогдож чадсангүй.");
            } finally {
                setLoading(false);
            }
        }
        loadUsers();
    }, []);

    // --- Нийт тооцооллыг энд хийж байна ---
    const stats = useMemo(() => {
        const totalUsers = users.length;
        const totalOrders = users.reduce((sum, user) => sum + (Number(user.orders_count) || 0), 0);
        const totalRevenue = users.reduce((sum, user) => sum + (Number(user.total_spent) || 0), 0);

        return { totalUsers, totalOrders, totalRevenue };
    }, [users]);

    // Хайлт шүүх хэсэг (Нэмэлтээр)
    const filteredUsers = users.filter(user =>
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">

                {/* 1. Stat Cards Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Users size={24} /></div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Нийт хэрэглэгчид</p>
                            <h3 className="text-2xl font-bold">{stats.totalUsers}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                        <div className="p-3 bg-orange-100 text-orange-600 rounded-xl"><ShoppingCart size={24} /></div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Нийт захиалга</p>
                            <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                        <div className="p-3 bg-green-100 text-green-600 rounded-xl"><DollarSign size={24} /></div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Нийт эргэлт</p>
                            <h3 className="text-2xl font-bold text-green-600">{stats.totalRevenue.toLocaleString()} ₮</h3>
                        </div>
                    </div>
                </div>

                {/* 2. Header & Search Area */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <h1 className="text-2xl font-bold text-gray-900">Хэрэглэгчид</h1>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Нэр эсвэл и-мэйлээр хайх..."
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full md:w-80 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* 3. Table Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    {loading ? (
                        <div className="p-20 text-center text-gray-500 animate-pulse font-medium">Уншиж байна...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Хэрэглэгч</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">И-мэйл</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-center">Захиалга</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Нийт зарцуулалт</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredUsers.map((user, i) => (
                                        <tr key={user.id || user.user_id || i} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 flex items-center space-x-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                                                    {user.full_name?.charAt(0)}
                                                </div>
                                                <span className="font-medium text-gray-900">{user.full_name}</span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 text-sm">{user.email}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-bold text-gray-700">
                                                    {user.orders_count}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-gray-900 tabular-nums">
                                                {Number(user.total_spent).toLocaleString()} ₮
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}