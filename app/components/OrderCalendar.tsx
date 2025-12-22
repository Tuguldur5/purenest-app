'use client';
import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import Swal from 'sweetalert2';

interface CalendarProps {
    orders: any[];
}

export default function OrderCalendar({ orders }: CalendarProps) {
    
    // Захиалга дээр дарахад ажиллах функц
    const handleEventClick = (info: any) => {
        const props = info.event.extendedProps;
        const color = info.event.backgroundColor;

        Swal.fire({
            title: `<div style="color: ${color}; font-size: 1.5rem; font-weight: bold;">${info.event.title}</div>`,
            html: `
                <div style="text-align: left; padding: 10px; font-family: sans-serif; line-height: 1.8;">
                    <div style="margin-bottom: 8px;"><b>👤 Захиалагч:</b> ${props.full_name}</div>
                    <div style="margin-bottom: 8px;"><b>📞 Утас:</b> ${props.phone_number || 'Мэдээлэлгүй'}</div>
                    <div style="margin-bottom: 8px;"><b>📏 Хэмжээ:</b> ${props.size} м²</div>
                    <div style="margin-bottom: 8px;"><b>🔄 Давтамж:</b> ${props.frequency}</div>
                    <div style="margin-bottom: 8px;"><b>📍 Хаяг:</b> ${props.district,props.khoroo,props.address}</div>
                    <div style="margin-top: 15px; padding-top: 10px; border-top: 1px dashed #ddd; font-size: 1.2rem; color: #e11d48;">
                        <b>💰 Нийт үнэ:</b> ${Number(props.total_price).toLocaleString()} ₮
                    </div>
                </div>
            `,
            confirmButtonText: 'Хаах',
            confirmButtonColor: color,
            showCloseButton: true,
            buttonsStyling: true,
            customClass: {
                popup: 'rounded-3xl'
            }
        });
    };

    return (
        <div className="admin-calendar">
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={orders}
                eventClick={handleEventClick}
                locale="mn" // Монгол хэлний тохиргоо
                height="auto"
                stickyHeaderDates={true}
                dayMaxEvents={3} // Өдөрт 3-аас олон бол '+more' гэж харуулна
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,dayGridWeek'
                }}
                eventDisplay="block"
            />

            <style jsx global>{`
                /* Календарийн загварыг сайжруулах */
                .fc-event {
                    cursor: pointer;
                    border: none !important;
                    padding: 4px 8px !important;
                    margin: 2px 0 !important;
                    border-radius: 6px !important;
                    font-size: 0.85rem !important;
                    transition: transform 0.1s ease;
                }
                .fc-event:hover {
                    transform: scale(1.02);
                    filter: brightness(0.9);
                }
                .fc-toolbar-title {
                    font-size: 1.25rem !important;
                    font-weight: 700;
                    color: #1f2937;
                }
                .fc-col-header-cell-cushion {
                    color: #4b5563;
                    text-decoration: none !important;
                    font-weight: 600;
                }
                .fc-daygrid-day-number {
                    color: #374151;
                    text-decoration: none !important;
                    padding: 8px !important;
                }
                .fc-button-primary {
                    background-color: #ffffff !important;
                    border-color: #d1d5db !important;
                    color: #374151 !important;
                    text-transform: capitalize !important;
                }
                .fc-button-primary:hover {
                    background-color: #f3f4f6 !important;
                }
                .fc-button-active {
                    background-color: #3b82f6 !important;
                    color: white !important;
                }
            `}</style>
        </div>
    );
}