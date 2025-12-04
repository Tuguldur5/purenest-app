'use client'; // Next.js App Router-т client side ашиглахыг зааж өгөх
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Routing хийхэд хэрэгтэй

// ===========================================
// 1. МЭДЭЭЛЛИЙН ТӨРЛҮҮД (INTERFACES)
// ===========================================
interface UserDetail {
    full_name: string; // DB-тэй тааруулж 'name'-ийг 'full_name' болгосон
    email: string;
    phone_number: string; // DB-тэй тааруулж 'phone'-ийг 'phone_number' болгосон
    // address: string; // Хэрэглэгчийн хүснэгтэд ихэвчлэн байдаггүй тул түр хадгалав
}

interface Order {
    id: number; // DB-ээс ирэх id нь number байх магадлалтай
    created_at: string; // DB-ээс ирэх огноо
    // total: number; // Order-ийн хүснэгтээс хамаарна
    // status: string; // Order-ийн хүснэгтээс хамаарна
    service_type: string; // Жишээ: Нэмсэн
    status: string;
}

interface UserDetailsProps {
    details: UserDetail | null; // null байж болно
}

interface OrderHistoryProps {
    orders: Order[];
}

// ===========================================
// 2. USER DETAILS COMPONENT
// ===========================================
function UserDetails({ details }: UserDetailsProps) {
    if (!details) return <div className="text-center text-gray-500 py-10">Мэдээлэл олдсонгүй.</div>;

    return (
        <div className="p-6 rounded-xl border border-gray-200 bg-white shadow-md h-full">
            <div className="flex justify-between items-center mb-6 border-b pb-3">
                <h2 className="text-xl font-bold text-gray-800"> Хувийн Мэдээлэл</h2>
                <button className="flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition duration-150">
                    Засах
                </button>
            </div>

            <div className="space-y-3 text-base">
                <DetailRow label="Нэр" value={details.full_name || 'Нэр олдсонгүй'} />
                <DetailRow label="И-мэйл" value={details.email} />
                <DetailRow label="Утас" value={details.phone_number || 'Утас олдсонгүй'} />
                <DetailRow label="Хаяг" value={'Одоогоор хаяг байхгүй'} /> {/* Түр зуурын хаяг */}
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
// 3. ORDER HISTORY COMPONENT
// ===========================================
function OrderHistory({ orders }: OrderHistoryProps) {
    return (
        <div className="p-6 rounded-xl border border-gray-200 bg-white shadow-md h-full">
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-3"> Захиалгын Түүх</h2>

            {orders.length === 0 ? (
                <p className="text-gray-500 py-4">Та одоогоор захиалга хийгээгүй байна.</p>
            ) : (
                <div className="space-y-3">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg transition duration-150 hover:bg-gray-100 cursor-pointer"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center space-x-0 sm:space-x-4">
                                <span className="text-base font-bold text-indigo-700">№{order.id}</span>
                                <span className="text-sm text-gray-500">Огноо: {new Date(order.created_at).toLocaleDateString()}</span>
                            </div>

                            <div className="flex items-center space-x-3">
                                <span className="text-lg font-bold text-gray-800">{order.service_type || 'Үнэ тодорхойгүй'}</span>

                                <StatusBadge status={order.status} />

                                <button className="text-sm font-semibold text-gray-500 hover:text-indigo-600 hidden md:block">
                                    Дэлгэрэнгүй
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    let style = '';
    const statusText = status.toUpperCase();

    if (statusText === 'ХҮРГЭГДСЭН' || statusText === 'COMPLETED') {
        style = 'bg-green-100 text-green-700';
    } else if (statusText === 'ТӨЛӨГДСӨН' || statusText === 'PENDING') {
        style = 'bg-yellow-100 text-yellow-700';
    } else {
        style = 'bg-red-100 text-red-700';
    }

    return (
        <span className={`px-2 py-1 text-xs font-bold rounded ${style} whitespace-nowrap`}>
            {status}
        </span>
    );
};


// ===========================================
// 4. MAIN PROFILE COMPONENT
// ===========================================
export default function Profile() {
    const [userDetails, setUserDetails] = useState<UserDetail | null>(null);
    const [orderHistory, setOrderHistory] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // 💡 API-ийн үндсэн хаяг (Таны Backend)
    const API_BASE_URL = 'http://localhost:4000';

    useEffect(() => {
        const token = localStorage.getItem('token');

        // 1. Хэрэглэгч нэвтэрсэн эсэхийг шалгах
        if (!token) {
            router.push('/login');
            return;
        }

        const fetchProfileData = async () => {
            try {
                // 2. JWT Токенийг Header-т нэмж илгээх
                const headers = {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                };

                // --- Хэрэглэгчийн мэдээлэл татах (Таны Backend-д энэ руут байхгүй тул түр алгасаж, LocalStorage ашиглав)
                // Хэрэглэгчийн мэдээллийг хялбар байх үүднээс LocalStorage-аас авлаа.
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    const user = JSON.parse(storedUser);
                    // DB-ээс авсан мэдээллийг UserDetail interface-д хувиргах
                    setUserDetails({
                        full_name: user.full_name || user.email.split('@')[0],
                        email: user.email,  
                        phone_number: user.phone || '',
                       
                    });
                }


                // --- Захиалгын түүхийг татах (Backend-д байгаа руут)
                const ordersResponse = await fetch(`${API_BASE_URL}/api/orders/history`, { headers });

                if (ordersResponse.status === 403 || ordersResponse.status === 401) {
                    // Токен хүчингүй бол нэвтрэх хуудас руу буцаах
                    localStorage.removeItem('token');
                    router.push('/login');
                    return;
                }

                if (ordersResponse.ok) {
                    const ordersData: Order[] = await ordersResponse.json();
                    setOrderHistory(ordersData);
                } else {
                    console.error("Захиалгын түүх татахад алдаа:", ordersResponse.statusText);
                    setOrderHistory([]);
                }

            } catch (err) {
                console.error("API-тай холбогдоход алдаа гарлаа:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [router]);
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        // ✅ Гарсны дараа нүүр хуудас руу шилжих
        router.push('/');
    };

    // 💡 Loading төлөв
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-xl text-indigo-600">Мэдээлэл татаж байна...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen font-arial bg-gray-50 p-4 sm:p-8">
            <div className="container flex flex-col mx-auto ">
                <header className=" container flex flex-col mx-auto mb-8">
                    <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "Arial" }}>Миний Профайл</h1>
                    <p className="text-gray-500 mt-1">Хувийн мэдээлэл болон захиалгын түүхийн тойм.</p>
                </header>

                {/* ХОЁР БАГАНА (GRID) ХЭСЭГ */}
                <div className="sm:space-y-6 lg:grid lg:grid-cols-3 lg:gap-6">

                    {/* 1. Зүүн тал: Хувийн Мэдээлэл (1/3) */}
                    <div className="lg:col-span-1 mr-4 ">
                        <UserDetails details={userDetails} />
                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 mx-auto mt-4  py-3 px-6 bg-[#102B5A] text-white text-lg rounded-2xl shadow-lg hover:bg-[#0D1F42] hover:text-amber-400 transition duration-300"
                        >
                            Гарах
                        </button>

                    </div>


                    {/* 2. Баруун тал: Захиалгын Түүх (2/3) */}
                    <div className="lg:col-span-2 ">
                        <OrderHistory orders={orderHistory} />
                    </div>
                </div>
            </div>
        </div>
    );
}