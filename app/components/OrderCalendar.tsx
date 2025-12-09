'use client';
import { useEffect, useState } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import type { EventInput } from '@fullcalendar/core';

const STATUS_COLORS: { [key: string]: string } = {
  'Хүлээгдэж буй': 'orange',
  'Батлагдсан': 'green',
  'Дууссан': 'gray',
  'Цуцлагдсан': 'red',
};

export default function OrderCalendar({ orders }: { orders: any[] }) {
    const [events, setEvents] = useState<EventInput[]>([]);

    useEffect(() => {
        const ev = orders.map(o => ({
            id: o.order_id,
            title: `${o.service} (${o.total_price}₮)`,
            date: o.service_date,
            color: STATUS_COLORS[o.status] || 'blue'
        }));
        setEvents(ev);
    }, [orders]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border mb-6">
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={events}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: ''
                }}
            />
        </div>
    );
}
