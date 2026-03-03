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

    const handleEventClick = (info: any) => {
        const props = info.event.extendedProps;
        const color = info.event.backgroundColor;

        Swal.fire({
            title: `<div style="color: ${color}; font-size: 1.3rem; font-weight: bold;">${info.event.title}</div>`,
            html: `
                <div style="text-align: left; padding: 10px; font-family: sans-serif; line-height: 1.6;">
                    <div style="background: #f8fafc; padding: 12px; border-radius: 12px; margin-bottom: 12px; border: 1px solid #e2e8f0;">
                        <b>👤 Захиалагч:</b> ${props.full_name}<br/>
                        <b>📞 Утас:</b> ${props.phone_number || 'Мэдээлэлгүй'}<br/>
                        <b>✉️ И-мэйл:</b> ${props.email || 'Мэдээлэлгүй'}
                    </div>
                    <div style="padding-left: 5px;">
                        <b>🔄 Давтамж:</b> ${props.frequency}<br/>
                        ${props.service === 'СӨХ цэвэрлэгээ' ? `
                            <div style="margin: 8px 0; font-size: 0.9rem; color: #64748b;">
                                🏢 ${props.apartments} орц | 🪜 ${props.floors} давхар | 🛗 ${props.lifts} лифт
                            </div>
                        ` : `
                            <b>📐 Хэмжээ:</b> ${props.public_area_size} м²<br/>
                        `}
                        <b>📍 Хаяг:</b> ${props.district}, ${props.address}
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
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={orders}
                eventClick={handleEventClick}
                locale="mn"
                height="auto"
                stickyHeaderDates={true}
                dayMaxEvents={2}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,listWeek,listMonth' // Жагсаалт харагдацууд
                }}
                buttonText={{
                    today: 'Өнөөдөр',
                    month: 'Хуанли',
                    listWeek: 'Долоо хоногоор',
                    listMonth: 'Сараар (Жагсаалт)'
                }}
                eventDisplay="block"
            />

            <style jsx global>{`
                .admin-calendar-wrapper {
                    padding: 15px;
                    background: #fff;
                    border-radius: 20px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
                }

                /* Календарийн ерөнхий загвар */
                .fc { --fc-border-color: #f1f5f9; }
                .fc-toolbar-title { font-size: 1.1rem !important; font-weight: 700 !important; color: #1e293b; }
                
                /* Товчлуурууд */
                .fc-button { 
                    border-radius: 8px !important; 
                    font-size: 0.85rem !important; 
                    text-transform: capitalize !important;
                    transition: all 0.2s !important;
                }
                .fc-button-primary { background: #fff !important; border-color: #e2e8f0 !important; color: #475569 !important; }
                .fc-button-primary:hover { background: #f8fafc !important; }
                .fc-button-active { background: #3b82f6 !important; border-color: #3b82f6 !important; color: white !important; }

                /* List View (Жагсаалт) загвар - Mobile-д зориулав */
                .fc-list-event { cursor: pointer !important; }
                .fc-list-event:hover td { background: #f8fafc !important; }
                .fc-list-day-cushion { background: #f1f5f9 !important; padding: 12px 15px !important; }
                .fc-list-event-title { font-weight: 600 !important; color: #1e293b; }
                .fc-list-event-dot { border-width: 5px !important; }

                /* Календарь дээрх үйл явдал */
                .fc-event { 
                    border: none !important; 
                    padding: 3px 6px !important; 
                    margin: 1px 0 !important; 
                    border-radius: 6px !important; 
                    font-size: 0.75rem !important; 
                }

                /* Гар утсан дээрх тохиргоо */
                @media (max-width: 768px) {
                    .fc-header-toolbar { 
                        display: flex; 
                        flex-direction: column; 
                        gap: 12px; 
                        align-items: center; 
                    }
                    .fc-toolbar-chunk { display: flex; gap: 4px; }
                    .admin-calendar-wrapper { padding: 10px; border-radius: 0; }
                }
            `}</style>
        </div>
    );
}