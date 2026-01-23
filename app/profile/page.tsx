'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loading from '../loading';
import { useSiteToast } from '../hooks/useSiteToast';

interface UserDetail {
    full_name: string;
    email: string;
    phone: string;
}

interface Order {
    id: number;
    created_at: string;
    total_price: number;
    service: string;
    status: string;
    date: string;
}

function UserDetails({ details, onUpdate }: { details: UserDetail | null, onUpdate: (newData: UserDetail) => void }) {
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState<UserDetail>({
        full_name: '',
        email: '',
        phone: ''
    });
    const [loading, setLoading] = useState(false);
    const { showToast } = useSiteToast();

    useEffect(() => {
        if (details) {
            setForm({
                full_name: details.full_name || '',
                email: details.email || '',
                phone: details.phone ? String(details.phone) : ''
            });
        }
    }, [details]);

    if (!details) return <div className="animate-pulse bg-gray-200 h-64 rounded-2xl"></div>;

    const handleSave = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');

            // Backend-ийн хүлээж авах боломжтой хувилбарууд
            const payload = {
                ...form,
                // Хэрэв сервер заавал тоо нэхээд байвал:
                // phone: Number(form.phone.replace(/\D/g, '')) 
            };

            const res = await fetch(`https://purenest-app.onrender.com/api/users/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (res.ok) {
                onUpdate(form);
                localStorage.setItem('user', JSON.stringify(form));
                setIsEditing(false);
                showToast({ title: "Амжилттай", description: "Мэдээлэл шинэчлэгдлээ." });
            } else {
                // Энд консол дээр датаг бүрэн харах
                console.error("Серверээс ирсэн алдааны дэлгэрэнгүй:", data);
                throw new Error(data.message || data.error || "Сервер мэдээллийг хүлээж авсангүй.");
            }
        } catch (error: any) {
            showToast({ title: "Алдаа гарлаа", description: error.message });
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="bg-white rounded-[14px] shadow-sm border border-gray-100 -mt-10 overflow-hidden transition-all duration-300 hover:shadow-md">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800 tracking-tight">Хувийн мэдээлэл</h2>
                </div>

                <div className="space-y-5">
                    <EditableField
                        label="Бүтэн нэр"
                        value={form.full_name}
                        isEditing={isEditing}
                        onChange={(val) => setForm({ ...form, full_name: val })}
                        placeholder="Нэр оруулах"

                    />
                    <EditableField
                        label="И-мэйл хаяг"
                        value={form.email}
                        isEditing={isEditing}
                        onChange={(val) => setForm({ ...form, email: val })}
                        placeholder="example@mail.com"
                    />
                    <EditableField
                        label="Утасны дугаар"
                        value={form.phone}
                        isEditing={isEditing}
                        onChange={(val) => setForm({ ...form, phone: val })}
                        placeholder="Дугаар оруулах"
                    />
                </div>
            </div>
            <div className="p-4 flex justify-center border-t border-gray-50">
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-[14px] hover:bg-indigo-100 transition-colors"
                    >
                        Засах
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-[14px] hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                        >
                            {loading ? "Хадгалж байна..." : "Хадгалах"}
                        </button>
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                setForm(details); // Болих үед хуучин утгыг нь буцааж оноох
                            }}
                            className="px-6 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-[14px] hover:bg-gray-200 transition-colors"
                        >
                            Болих
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// Төрлүүдийг нь тодорхойлж өгөх (Interfaces)
interface EditableFieldProps {
    label: string;
    value: string;
    isEditing: boolean;
    onChange: (val: string) => void; // Энд 'val' нь string байхыг зааж өгч байна
    placeholder?: string;
}

function EditableField({ label, value, isEditing, onChange, placeholder }: EditableFieldProps) {
    return (
        <div className="group">
            <label className="text-md font-medium text-gray-400  mb-1 block">
                {label}
            </label>
            {isEditing ? (
                <input
                    type="text"
                    value={value || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-[14px] focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-gray-800"
                />
            ) : (
                <p className="text-gray-700 font-medium px-1">{value}</p>
            )}
        </div>
    );
}
const handleDeleteOrder = async (orderId: number, status: string) => {
    const { showToast } = useSiteToast();
    // Зөвхөн хүлээгдэж буй захиалгыг устгахыг зөвшөөрөх (Сонголтоор)
    if (status !== "Хүлээгдэж байна") {
        showToast({ title: "Алдаа", description: "Энэ захиалгыг цуцлах боломжгүй. Баталгаажсан эсвэл дууссан байна." });
        return;
    }

    if (!window.confirm("Та энэ захиалгыг устгахдаа итгэлтэй байна уу?")) return;

    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`https://purenest-app.onrender.com/api/booking/${orderId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (res.ok) {
            showToast({ title: "Амжилттай", description: "Захиалга амжилттай устгагдлаа." });
            // Жагсаалтыг шинэчлэх (State-ээс хасах)
            // setOrders(prev => prev.filter(o => o.id !== orderId));
            window.location.reload(); // Эсвэл state-ээ шинэчлэх
        } else {

            showToast({ title: "Алдаа гарлаа", description: "Устгахад алдаа гарлаа." });
        }
    } catch (err) {
        console.error("Delete error:", err);
    }
};
// ===========================================
// 3. STATUS BADGE COMPONENT
// ===========================================
const StatusBadge: React.FC<{ status: string; type?: 'service' | 'order' }> = ({ status, type = 'order' }) => {
    const config: any = {
        service: {
            'Оффис цэвэрлэгээ': { text: 'Оффис цэвэрлэгээ', bg: 'bg-amber-50 text-amber-700 border-amber-100' },
            'СӨХ цэвэрлэгээ': { text: 'Сөх цэвэрлэгээ', bg: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
            'Олон нийтийн талбай': { text: 'Олон нийтийн талбай', bg: 'bg-blue-50 text-blue-700 border-blue-100' },
        },
        order: {
            'Хүлээгдэж байна': { text: 'Хүлээгдэж байна', bg: 'bg-orange-50 text-orange-600 border-orange-100' },
            'Баталгаажсан': { text: 'Баталгаажсан', bg: 'bg-blue-50 text-blue-600 border-blue-100' },
            'Дууссан': { text: 'Дууссан', bg: 'bg-green-50 text-green-600 border-green-100' },
            'Цуцлагдсан': { text: 'Цуцлагдсан', bg: 'bg-red-50 text-red-600 border-red-100' },
        }
    };

    const item = config[type][status.toUpperCase()] || config[type][status] || { text: status, bg: 'bg-gray-50 text-gray-600' };

    return (
        <span className={`px-3 py-1 text-[11px] font-bold rounded-[14px] border ${item.bg} whitespace-nowrap uppercase tracking-tight`}>
            {item.text}
        </span>
    );
};


function OrderHistory({ orders }: { orders: Order[] }) {
    const [filterService, setFilterService] = useState('Бүгд');
    const [filterStatus, setFilterStatus] = useState('Бүгд');

    const totalSpent = orders.reduce((sum, order) => sum + Number(order.total_price), 0);

    const filteredOrders = orders.filter(order => {
        const matchesService = filterService === 'Бүгд' || order.service === filterService;
        const matchesStatus = filterStatus === 'Бүгд' || order.status === filterStatus;
        return matchesService && matchesStatus;
    });

    return (
        <div className="space-y-6">
            {/* 1. СТАТИК КАРТУУД */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-[14px] border border-gray-100 shadow-sm">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Нийт захиалга</p>
                    <p className="text-3xl font-semibold text-slate-900">{orders.length}</p>
                </div>
                <div className="bg-white p-6 rounded-[14px] border border-gray-100 shadow-sm">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Нийт төлбөр</p>
                    <p className="text-3xl font-semibold text-indigo-600">{totalSpent.toLocaleString()}₮</p>
                </div>
            </div>

            {/* 2. ЗАХИАЛГЫН ТҮҮХ ХҮСНЭГТ */}
            <div className="bg-white rounded-[14px] border border-black/5 shadow-sm overflow-hidden">
                {/* Header & Filters */}
                <div className="px-8 py-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Захиалгын түүх</h2>
                        <span className="px-2 py-0.5 bg-slate-50 text-[10px] font-bold text-slate-400 rounded-md border border-slate-100">
                            {filteredOrders.length}
                        </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <select
                            value={filterService}
                            onChange={(e) => setFilterService(e.target.value)}
                            className="bg-slate-50 border border-black/5 shadow-md  rounded-[14px] text-slate-600 text-[11px] font-bold px-3 py-2 outline-none hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                            <option value="Бүгд">Бүх үйлчилгээ</option>
                            <option value="Оффис цэвэрлэгээ">Оффис</option>
                            <option value="СӨХ цэвэрлэгээ">СӨХ</option>
                            <option value="Олон нийтийн талбай">Олон нийтийн</option>
                        </select>

                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="bg-slate-50 border border-black/5 shadow-md rounded-[14px] text-slate-600 text-[11px] font-bold px-3 py-2 outline-none hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                            <option value="Бүгд">Бүх төлөв</option>
                            <option value="Хүлээгдэж байна">Хүлээгдэж буй</option>
                            <option value="Баталгаажсан">Баталгаажсан</option>
                            <option value="Дууссан">Дууссан</option>
                            <option value="Цуцлагдсан">Цуцлагдсан</option>
                        </select>
                    </div>
                </div>

                {/* --- ХҮСНЭГТИЙН БАГАНЫ НЭРҮҮД (Зөвхөн Desktop дээр харагдана) --- */}
                {/* Жагсаалтын толгой (Header) */}
                {/* Жагсаалтын толгой (Header) */}
                <div className="hidden md:grid grid-cols-12 px-8 py-4 bg-slate-50/50 border-b border-gray-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {/* ID & Огноо - 2 багана */}
                    <div className="md:col-span-2 text-left">Захиалга № / Огноо</div>
                    {/* Үйлчилгээ - 3 багана */}
                    <div className="md:col-span-3 text-left">Үйлчилгээний төрөл</div>
                    {/* Төлөв - 3 багана */}
                    <div className="md:col-span-3 text-left">Төлөв</div>
                    {/* Нийт төлбөр - 3 багана (Баруун тийш шахсан) */}
                    <div className="md:col-span-3 text-right pr-12">Нийт төлбөр</div>
                    {/* Үйлдэл - 1 багана */}
                    <div className="md:col-span-1 text-right">Үйлдэл</div>
                </div>

                {/* Жагсаалтын их бие (Body) */}
                <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto custom-scrollbar bg-white">
                    {filteredOrders.length === 0 ? (
                        <div className="py-24 text-center">
                            <p className="text-slate-400 text-sm font-medium">Тохирох захиалга олдсонгүй.</p>
                        </div>
                    ) : (
                        filteredOrders.map((order) => (
                            <div key={order.id} className="px-8 py-5 hover:bg-slate-50/80 transition-all group">
                                {/* Энд grid-cols-12 нь толгойтойгоо яг ижил байна */}
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">

                                    {/* 1. ID & Огноо (col-span-2) */}
                                    <div className="md:col-span-2 flex flex-row md:flex-col justify-between items-center md:items-start text-left">
                                        <span className="text-sm font-bold text-slate-900 group-hover:text-[#102B5A] transition-colors">
                                            #{order.id}
                                        </span>
                                        <span className="text-[11px] text-slate-500 font-medium">
                                            {new Date(order.date).toLocaleDateString()}
                                        </span>
                                    </div>

                                    {/* 2. Төрөл (col-span-3) */}
                                    <div className="md:col-span-3 flex justify-between items-center md:block text-left">
                                        <p className="md:hidden text-[10px] font-bold text-slate-400 uppercase tracking-wider">Төрөл</p>
                                        <StatusBadge status={order.service} type="service" />
                                    </div>

                                    {/* 3. Төлөв (col-span-3) */}
                                    <div className="md:col-span-3 flex justify-between items-center md:block text-left">
                                        <p className="md:hidden text-[10px] font-bold text-slate-400 uppercase tracking-wider">Төлөв</p>
                                        <StatusBadge status={order.status} type="order" />
                                    </div>

                                    {/* 4. Нийт Үнэ (col-span-3) - Толгойн 'Нийт төлбөр'-тэй яг ижил text-right */}
                                    <div className="md:col-span-3 flex justify-between items-center md:text-right pr-12">
                                        <p className="md:hidden text-[10px] font-bold text-slate-400 uppercase tracking-wider">Нийт</p>
                                        <p className="text-sm font-extrabold text-slate-900 w-full">
                                            {Number(order.total_price).toLocaleString()}₮
                                        </p>
                                    </div>

                                    {/* 5. Үйлдэл (col-span-1) */}
                                    <div className="md:col-span-1 flex justify-end items-center">
                                        {order.status === "Хүлээгдэж байна" ? (
                                            <button
                                                onClick={() => handleDeleteOrder(order.id, order.status)}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        ) : (
                                            <div className="w-9" />
                                        )}
                                    </div>

                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}


export default function Profile() {
    const [userDetails, setUserDetails] = useState<UserDetail | null>(null);
    const [orderHistory, setOrderHistory] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { router.push('/login'); return; }

        const fetchProfileData = async () => {
            try {
                const storedUser = localStorage.getItem('user');
                if (storedUser) setUserDetails(JSON.parse(storedUser));

                const ordersResponse = await fetch(`https://purenest-app.onrender.com/api/orders/history`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (ordersResponse.ok) setOrderHistory(await ordersResponse.json());
                else if (ordersResponse.status === 401) { localStorage.clear(); router.push('/login'); }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfileData();
    }, [router]);

    const handleLogout = () => {
        localStorage.clear();
        router.push('/');
    };

    if (loading) return (
        <Loading />
    );

    return (
        <div className="min-h-screen flex flex-col bg-[#FDFEFE]">
            <div className="bg-[#102B5A] items-center px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-7xl mx-auto w-full ">
                    <header className="text-center">
                        <h1 className="text-3xl font-semibold text-white tracking-tight mb-2">Миний Профайл</h1>
                        <p className="text-sm text-slate-400">Хувийн мэдээлэл болон захиалгын түүх</p>
                    </header>
                </div>
            </div>

            <div className="w-full  max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start -mt-10">
                    <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8 h-fit">
                        <UserDetails details={userDetails} onUpdate={(data) => setUserDetails(data)} />
                        <button
                            onClick={handleLogout}
                            className="w-full py-3.5 px-6 border border-gray-200 text-white text-sm font-medium rounded-[14px] bg-[#102B5A] hover:bg-white hover:text-red-500 transition-all duration-300 flex items-center justify-center gap-2 group"
                        >
                            <span>Системээс гарах</span>
                            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 25 25">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>

                    {/* Right Column (Order History) */}
                    <div className="lg:col-span-8 w-full overflow-hidden mt-4">
                        <OrderHistory orders={orderHistory} />
                    </div>
                </div>


            </div>
        </div>
    );
}