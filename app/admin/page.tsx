'use client';
import OrderCalendar from "./../components/OrderCalendar";
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
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
export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const role = localStorage.getItem("userRole")
        if (role !== 'admin') {
            router.push('/') // Admin биш бол homepage руу
        }
    }, [])
    useEffect(() => {
        async function loadData() {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/login");
                return;
            }

            try {
                const res = await fetch("http://localhost:4000/api/admin/orders", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                const data = await res.json();
                if (!res.ok) {
                    alert(data.error || "Server error");
                    return;
                }


                setOrders(data.orders || []);
            } catch (e) {
                console.error("Fetch error:", e);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [router]);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Захиалгууд</h1>
            {loading ? <p>Татаж байна...</p> : <OrderCalendar orders={orders} />}
        </div>
    );
}

