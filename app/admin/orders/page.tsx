'use client';
import { useEffect, useState } from "react";
import OrderCalendar from "./../../components/OrderCalendar";

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/orders')
            .then(res => res.json())
            .then(data => setOrders(data.orders))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Захиалгууд</h1>
            {loading ? <p>Татаж байна...</p> : <OrderCalendar orders={orders} />}
        </div>
    );
}
