'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, Heart, ShoppingBag, LogOut, ChevronRight, ClipboardList } from 'lucide-react';

// Компонентуудаа зөв замаар импортлох
import UserDetails from '../components/UserDetails';
import Wishlist from '../components/wishlist';
import OrderHistory from '../components/OrderHIstory';
import ProductOrders from '../components/ProductOrders';

// Төрлүүдийг тодорхойлох
export interface UserDetail {
    full_name: string;
    email: string;
    phone: string;
}

export default function ProfilePage() {
    return (
        <Suspense fallback={<div>Ачаалж байна...</div>}>
            <ProfileContent />
        </Suspense>
    );
}

function ProfileContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
    const [subTab, setSubTab] = useState<'service' | 'product'>('service');
    const [userDetails, setUserDetails] = useState<UserDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        const fetchUser = async () => {
            try {
                const res = await fetch('https://purenest-app.onrender.com/api/users/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setUserDetails(data.user || data);
                }
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [router]);

    const handleUserUpdate = (newData: UserDetail) => {
        setUserDetails(newData);
    };

    const handleLogout = () => {
        localStorage.clear();
        router.push('/');
    };

    if (loading) return <div className="flex justify-center items-center h-screen">Уншиж байна...</div>;

    return (
        <div className="min-h-screen bg-[#F8FAFC] conatainer mx-auto px-4 max-w-8xl">
            {/* Header */}
            <div className="bg-[#102B5A] items-center px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-7xl mx-auto w-full ">
                    <header className="text-center">
                        <h1 className="text-3xl font-semibold text-white tracking-tight mb-2">Миний Профайл</h1>
                        <p className="text-sm text-slate-400">Хувийн мэдээлэл болон захиалгын түүх</p>
                    </header>
                </div>
            </div>

            <div className="container max-w-8xl mx-auto px-4 -mt-20 pb-20 text-black mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-3 pt-4 sticky -mt-10">
                            <MenuButton
                                id="profile"
                                active={activeTab === 'profile'}
                                onClick={setActiveTab}
                                label="Хувийн мэдээлэл"
                                icon={<User size={18} />}
                            />
                            <MenuButton
                                id="wishlist"
                                active={activeTab === 'wishlist'}
                                onClick={setActiveTab}
                                label="Хадгалсан бараа"
                                icon={<Heart size={18} />}
                            />
                            <MenuButton
                                id="orders"
                                active={activeTab === 'orders'}
                                onClick={setActiveTab}
                                label="Миний захиалга"
                                icon={<ShoppingBag size={18} />}
                            />

                            <div className="h-px bg-gray-50 my-3 mx-4" />

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 p-4 rounded-2xl text-rose-500 hover:bg-rose-50 transition-all font-bold text-sm"
                            >
                                <LogOut size={18} /> Системээс гарах
                            </button>
                        </div>
                    </div>

                    {/* 3. БАРУУН АГУУЛГА: 12-оос 8-ыг нь эзэлнэ (2/3 зай) */}
                    <div className="lg:col-span-8 bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 min-h-[600px]">
                        {activeTab === 'profile' && (
                            <UserDetails details={userDetails} onUpdate={handleUserUpdate} />
                        )}

                        {activeTab === 'wishlist' && (
                            <Wishlist />
                        )}

                        {activeTab === 'orders' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <div className="flex gap-2 p-1 bg-gray-50 w-fit rounded-2xl">
                                    <button
                                        onClick={() => setSubTab('service')}
                                        className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${subTab === 'service' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}`}
                                    >
                                        ҮЙЛЧИЛГЭЭ
                                    </button>
                                    <button
                                        onClick={() => setSubTab('product')}
                                        className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${subTab === 'product' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}`}
                                    >
                                        БАРАА БҮТЭЭГДЭХҮҮН
                                    </button>
                                </div>

                                <div className="mt-6">
                                    {subTab === 'service' ? <OrderHistory orders={[]} /> : <ProductOrders />}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Туслах компонент: Цэсний товчлуур
function MenuButton({ id, active, onClick, label, icon }: any) {
    return (
        <button
            onClick={() => onClick(id)}
            className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 translate-x-1' : 'text-gray-400 hover:bg-gray-50'
                }`}
        >
            <div className="flex items-center gap-3">
                {icon}
                <span className="text-sm font-bold">{label}</span>
            </div>
            <ChevronRight size={16} className={active ? 'opacity-100' : 'opacity-0'} />
        </button>
    );
}