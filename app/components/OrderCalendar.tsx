'use client';
import React from 'react';
import FullCalendar from '@fullcalendar/react';
import daygridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import Swal from 'sweetalert2';

interface CalendarProps {
    orders: any[];        // Үйлчилгээний захиалгууд
    productOrders: any[]; // Барааны захиалгууд
}

export default function OrderCalendar({ orders, productOrders }: CalendarProps) {

    // Хоёр массивыг нэгтгэж FullCalendar-т зориулсан events үүсгэх
    const allEvents = [
        ...(orders || []).map(order => ({
            id: `service-${order.id}`,
            title: `🛠️ ${order.service}`,
            start: order.date,
            backgroundColor: '#4f46e5',
            extendedProps: { ...order, orderType: 'service' }
        })),
        ...(productOrders || []).map(order => ({
            id: `product-${order.id}`,
            title: `📦 ${order.product_name}`,
            start: order.delivery_date || order.date,
            backgroundColor: '#10b981',
            extendedProps: { ...order, orderType: 'product' }
        }))
    ];

    const handleEventClick = (info: any) => {
        const props = info.event.extendedProps;
        const color = info.event.backgroundColor;
        const isService = props.orderType === 'service';

        Swal.fire({
            title: `<div style="color: ${color}; font-size: 1.2rem; font-weight: bold;">${info.event.title}</div>`,
            html: `
                <div style="text-align: left; padding: 10px; line-height: 1.6; font-family: sans-serif;">
                    <div style="background: #f8fafc; padding: 12px; border-radius: 12px; margin-bottom: 12px; border: 1px solid #e2e8f0;">
                        <b>👤 Захиалагч:</b> ${props.full_name || props.customer_name}<br/>
                        <b>📞 Утас:</b> ${props.phone_number || 'Мэдээлэлгүй'}
                    </div>
                    
                    <div style="padding-left: 5px;">
                        ${isService ? `
                            <b>🔄 Давтамж:</b> ${props.frequency}<br/>
                            <b>📍 Хаяг:</b> ${props.district || ''}, ${props.address || ''}
                        ` : `
                            <b>🔢 Тоо ширхэг:</b> ${props.quantity} ш<br/>
                            <b>📍 Хүргэлтийн хаяг:</b> ${props.address || 'Мэдээлэлгүй'}
                        `}
                    </div>

                    <div style="margin-top: 15px; padding: 12px; background: ${color}10; border-radius: 10px; text-align: center; font-size: 1.2rem; color: ${color}; font-weight: bold;">
                        ${Number(props.total_price).toLocaleString()} ₮
                    </div>
                </div>
            `,
            confirmButtonText: 'Хаах',
            confirmButtonColor: color,
            customClass: { popup: 'rounded-3xl' }
        });
    };

    return (
        <div className="admin-calendar-wrapper">
            <FullCalendar
                plugins={[daygridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={allEvents}
                eventClick={handleEventClick}
                locale="mn"
                height="auto"
                dayMaxEvents={3}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth'
                }}
                buttonText={{
                    today: 'Өнөөдөр',
                    month: 'Хуанли'
                }}
            />

            <style jsx global>{`
                .admin-calendar-wrapper {
                    padding: 15px;
                    background: #fff;
                    border-radius: 20px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
                }
                .fc-event { 
                    border: none !important; 
                    padding: 4px 8px !important; 
                    border-radius: 8px !important; 
                    font-size: 0.8rem !important;
                    cursor: pointer;
                    margin-bottom: 2px !important;
                }
                .fc-toolbar-title { font-size: 1.2rem !important; font-weight: 700 !important; color: #1e293b; }
                .fc-col-header-cell-cushion { color: #64748b; font-size: 0.9rem; text-decoration: none !important; }
                .fc-daygrid-day-number { color: #1e293b; font-weight: 500; text-decoration: none !important; padding: 8px !important; }
                .fc-day-today { background: #f0f7ff !important; }
            `}</style>
        </div>
    );
}