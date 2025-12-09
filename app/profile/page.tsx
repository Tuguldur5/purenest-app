'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// ===========================================
// 1. МЭДЭЭЛЛИЙН ТӨРЛҮҮД (INTERFACES)
// ===========================================
interface UserDetail {
    full_name: string;
    email: string;
    phone: string;
    address: string;
}

interface Order {
    id: number;
    created_at: string;
    total_price: number;
    service: string; // Service type
    status: string;
    date: string;// Order status
}

interface UserDetailsProps {
    details: UserDetail | null;
}

interface OrderHistoryProps {
    orders: Order[];
}

// ===========================================
// 2. USER DETAILS COMPONENT
// ===========================================
function UserDetails({ details }: UserDetailsProps) {
    if (!details)
        return <div className="text-center py-10">Мэдээлэл олдсонгүй.</div>;

    return (
        <div className="p-6 rounded-xl border border-gray-200 bg-white shadow-md h-full">
            <div className="flex justify-between items-center mb-6 border-b pb-3">
                <h2 className="text-xl font-bold text-gray-800">Хувийн Мэдээлэл</h2>
                <button className="flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition duration-150">
                    Засах
                </button>
            </div>

            <div className="space-y-3 text-base">
                <DetailRow label="Нэр" value={details.full_name || 'Нэр олдсонгүй'} />
                <DetailRow label="И-мэйл" value={details.email} />
                <DetailRow label="Утас" value={details.phone || 'Утас олдсонгүй'} />
                <DetailRow label="Хаяг" value={details.address || 'Хаяг байхгүй'} />
            </div>
        </div>
    );
}

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="flex flex-col">
        <span className="font-medium text-gray-500 text-sm">{label}</span>
        <span className="text-gray-900 font-semibold">{value}</span>
    </div>
);

// ===========================================
// 3. STATUS BADGE COMPONENT
// ===========================================
const StatusBadge: React.FC<{ status: string; type?: 'service' | 'order' }> = ({ status, type = 'order' }) => {
    let style = '';
    let displayText = status;

    if (type === 'service') {
        const serviceMap: Record<string, { text: string; className: string }> = {
            'Office Clean': { text: 'Оффис цэвэрлэгээ', className: 'bg-yellow-300 text-blue-700' },
            'Sukh Clean Service': { text: 'Сүх цэвэрлэгээ', className: 'bg-green-100 text-green-700' },
            'Public Space': { text: 'Нийтийн орон зай', className: 'bg-yellow-100 text-yellow-700' },
        };
        const service = serviceMap[status] || { text: status, className: 'bg-yellow-100 text-gray-700' };
        displayText = service.text;
        style = service.className;
    } else {
        const orderMap: Record<string, { text: string; className: string }> = {
            PENDING: { text: 'Төлөгдөөгүй', className: 'bg-yellow-100 text-yellow-700' },
            CONFIRMED: { text: 'Батлагдсан', className: 'bg-blue-100 text-blue-700' },
            COMPLETED: { text: 'Хүргэгдсэн', className: 'bg-green-100 text-green-700' },
            CANCELED: { text: 'Цуцлагдсан', className: 'bg-red-100 text-red-700' },
        };
        const orderStatus = orderMap[status.toUpperCase()] || { text: status, className: 'bg-red-100 text-gray-700' };
        displayText = orderStatus.text;
        style = orderStatus.className;
    }

    return (
        <span className={`px-3 py-1 text-xs font-bold rounded-full ${style} whitespace-nowrap`}>
            {displayText}
        </span>
    );
};

// ===========================================
// 4. ORDER HISTORY COMPONENT
// ===========================================
function OrderHistory({ orders }: OrderHistoryProps) {
    if (orders.length === 0)
        return (
            <div className="p-6 rounded-xl border border-gray-200 bg-white shadow-md h-full">
                <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-3">Захиалгын Түүх</h2>
                <p className="text-gray-500 py-4">Та одоогоор захиалга хийгээгүй байна.</p>
            </div>
        );

    return (
        <div className="p-6 rounded-xl border border-gray-200 bg-white shadow-md h-full">
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-3">Захиалгын Түүх</h2>
            <div className="space-y-3">
                {orders.map((order) => (
                    <div
                        key={order.id}
                        className="p-3 bg-gray-50 rounded-lg transition duration-150 hover:bg-gray-100 cursor-pointer"
                    >
                        {/* 1-р мөр: Order № + Date */}
                        < div className="flex flex-wrap items-center space-x-2">
                            <span className="text-base font-bold text-indigo-700">№{order.id}</span>
                            <StatusBadge status={order.service} type="service" />

                            <StatusBadge status={order.status} type="order" />
                        </div>
                        <div className="flex justify-end items-center mb-1">
                            <span className="text-lg font-bold text-gray-800 pr-4">{order.total_price}₮</span>
                            <span className="text-sm text-gray-500">Огноо: {new Date(order.date).toLocaleDateString('mn-MN')}</span>
                        </div>
                        {/* 2-р мөр: Service + Total Price + Status */}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ===========================================
// 5. MAIN PROFILE COMPONENT
// ===========================================
export default function Profile() {
    const [userDetails, setUserDetails] = useState<UserDetail | null>(null);
    const [orderHistory, setOrderHistory] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const API_BASE_URL = 'http://localhost:4000';

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        const fetchProfileData = async () => {
            try {
                const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    const user = JSON.parse(storedUser);
                    setUserDetails({
                        full_name: user.full_name || user.email.split('@')[0],
                        email: user.email,
                        phone: user.phone || '',
                        address: user.address || '',
                    });
                }

                const ordersResponse = await fetch(`${API_BASE_URL}/api/orders/history`, { headers });
                if (ordersResponse.status === 403 || ordersResponse.status === 401) {
                    localStorage.removeItem('token');
                    router.push('/login');
                    return;
                }

                if (ordersResponse.ok) {
                    const ordersData: Order[] = await ordersResponse.json();
                    setOrderHistory(ordersData);
                } else {
                    console.error('Захиалгын түүх татахад алдаа:', ordersResponse.statusText);
                    setOrderHistory([]);
                }
            } catch (err) {
                console.error('API-тай холбогдоход алдаа гарлаа:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-xl text-indigo-600">Мэдээлэл татаж байна...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen font-arial bg-gray-50 p-4 sm:p-8">
            <div className="container flex flex-col mx-auto">
                <header className="container flex flex-col mx-auto mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Миний Профайл</h1>
                    <p className="text-gray-500 mt-1">Хувийн мэдээлэл болон захиалгын түүхийн тойм.</p>
                </header>

                <div className="sm:space-y-6 lg:grid lg:grid-cols-3 lg:gap-6">
                    <div className="lg:col-span-1 mr-4">
                        <UserDetails details={userDetails} />
                        <div className="text-center">
                            <button
                            onClick={handleLogout}
                            className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 mx-auto mt-3 py-3 px-6 bg-[#102B5A] text-white text-lg rounded-2xl shadow-lg hover:bg-[#0D1F42] hover:text-amber-400 transition duration-300"
                            >
                            Гарах
                        </button>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <OrderHistory orders={orderHistory} />
                    </div>
                </div>
            </div>
        </div>
    );
}
