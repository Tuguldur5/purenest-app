'use client';
import { useEffect, useState } from "react";

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/users')
            .then(res => res.json())
            .then(data => setUsers(data.users))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Хэрэглэгчид</h1>
            {loading ? <p>Татаж байна...</p> :
                <table className="w-full text-sm bg-white p-6 rounded-xl shadow-lg border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-3 border">ID</th>
                            <th className="p-3 border">Нэр</th>
                            <th className="p-3 border">И-мэйл</th>
                            <th className="p-3 border">Захиалгын тоо</th>
                            <th className="p-3 border">Нийт үнийн дүн</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.user_id} className="hover:bg-gray-50">
                                <td className="p-3 border">{u.user_id}</td>
                                <td className="p-3 border">{u.name}</td>
                                <td className="p-3 border">{u.email}</td>
                                <td className="p-3 border">{u.orders_count}</td>
                                <td className="p-3 border text-green-700 font-bold">{u.total_spent.toLocaleString()} ₮</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            }
        </div>
    );
}
