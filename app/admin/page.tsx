'use client';
import OrderCalendar from "./../components/OrderCalendar";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Order {
    order_id: number;
    service: string;
    date: string;
    full_name?: string;
    status: string;
}

export default function AdminLayout() {
    const router = useRouter();
    const [events, setEvents] = useState([]); // Календарийн event-үүд
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const role = localStorage.getItem("userRole");
        if (role !== 'admin') {
            router.push('/');
        }
    }, [router]);

    useEffect(() => {
        async function loadData() {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/login");
                return;
            }

            try {
                const res = await fetch("https://purenest-app.onrender.com/api/admin/orders", {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.error);

                // 🔥 ӨГӨГДЛИЙГ ФОРМАТЛАХ ХЭСЭГ (Маш чухал)
                const formattedEvents = data.orders.map((order: any) => ({
                    id: order.order_id,
                    title: `${order.service} - ${order.full_name || 'Нэргүй'}`,
                    start: order.date, // ISO форматтай огноо (2025-12-25)
                    backgroundColor: order.status === 'pending' ? '#f59e0b' : '#3b82f6', // Төлөвөөр өнгө ялгах
                    extendedProps: { ...order } // Бусад мэдээллийг хадгалах
                }));

                setEvents(formattedEvents);
            } catch (e) {
                console.error("Fetch error:", e);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [router]);

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Захиалгын Календарь</h1>
            {loading ? (
                <div className="flex justify-center p-10 italic">Татаж байна...</div>
            ) : (
                <div className="bg-white p-4 rounded-xl shadow-lg border">
                    <OrderCalendar orders={events} />
                </div>
            )}
        </div>
    );
}