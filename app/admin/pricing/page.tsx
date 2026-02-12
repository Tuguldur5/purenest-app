'use client'

import { useEffect, useState } from 'react'
import { text } from 'stream/consumers';
import { useSiteToast } from '../../hooks/useSiteToast'
import { Warehouse } from 'lucide-react';
const API_URL = "https://purenest-app.onrender.com/api/admin/pricing";

export default function PricingAdmin() {
    const [pricing, setPricing] = useState({
        officePrice: 20000,
        publicPrice: 25000,
        warehousePrice: 15000,
        ductPrice: 10000,
        suh: { apartment: 100000, floor: 20000, lift: 10000, room: 5000 },
        frequency: { once: 1, weekly: 0.9, biweekly: 0.95, monthly: 0.97, daily: 0.8 }
    });

    const [loading, setLoading] = useState(false);
    const { showToast } = useSiteToast()

    const handleSave = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                showToast({ title: "Алдаа", description: "Админ эрхээр нэвтэрч байж үнэ засварлана!" })
                setLoading(false);
                return;
            }

            const res = await fetch(API_URL, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    office_price_per_sqm: pricing.officePrice,
                    public_area_price_per_sqm: pricing.publicPrice,
                    suh: { ...pricing.suh },
                    frequency: { ...pricing.frequency }
                })
            });

            if (res.ok) {
                showToast({ title: "Амжилттай!", description: "Үнэ амжилттай шинэчлэгдлээ." })

            } else {
                const err = await res.json();
                showToast({ title: "Алдаа", description: "Алдаа гарлаа!" })
            }

        } catch (err) {
            console.error(err);
            showToast({ title: "Алдаа", description: "Сервертэй холбогдож чадсангүй!" })
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            showToast({ title: "Алдаа", description: "Нэвтрэх шаардлагатай!" });
            setLoading(false);
            return;
        }

        fetch(API_URL, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data && !data.error) {
                    // Backend-ээс ирж буй data.office_price_per_sqm-ийг 
                    // таны Frontend-ийн officePrice-тай яг тааруулж оноож байна
                    setPricing({
                        officePrice: data.office_price_per_sqm,
                        publicPrice: data.public_area_price_per_sqm,
                        warehousePrice: data.warehouse_price_per_sqm,
                        ductPrice: data.duct_price_pre_sqm,
                        suh: {
                            apartment: data.suh_apartment_base,
                            floor: data.suh_floor_price,
                            lift: data.suh_lift_price,
                            room: data.suh_room_price
                        },
                        frequency: {
                            once: 1,
                            daily: data.daily_discount,
                            weekly: data.weekly_discount,
                            biweekly: data.biweekly_discount,
                            monthly: data.monthly_discount || 1.0
                        }
                    });
                }
            })
            .catch(err => console.error("Fetch error:", err))
            .finally(() => setLoading(false)); // Ачаалж дууссаныг мэдэгдэнэ
    }, []);

    // 2. Хэрэвмэдээлэл татаж амжаагүй бол "Уншиж байна" гэж харуулна
    // Энэ нь Default (20,000 гэх мэт) үнэ харагдахаас сэргийлнэ
    if (loading) return <div className="p-10 text-center text-white">Мэдээллийг татаж байна...</div>;
    if (!pricing) return <div className="p-10 text-center text-red-500">Мэдээлэл олдсонгүй.</div>;

    return (
        <section className="p-10 max-w-3xl mx-auto bg-white text-black rounded-xl shadow">
            <div className="flex container text-center  mb-2">
                <h1 className="text-3xl font-bold p-2">Үнийн тохиргоо</h1>

            </div>

            {/* 1. Үндсэн үйлчилгээний үнэ */}
            <div className="bg-gray-50 p-6 rounded-xl mb-6">
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">Үндсэн үнэ (1м²)</h2>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 1. Оффис цэвэрлэгээ */}
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Оффис цэвэрлэгээ</label>
                            <input
                                type="number"
                                className="border p-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                                value={pricing.officePrice}
                                onChange={e => setPricing({ ...pricing, officePrice: Number(e.target.value) })}
                            />
                            <p className="text-xs text-gray-500 mt-1.5">Оффисын талбайн 1 метр квадрат тутмын суурь үнэ.</p>
                        </div>

                        {/* 2. Олон нийтийн талбай */}
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Олон нийтийн талбай</label>
                            <input
                                type="number"
                                className="border p-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                                value={pricing.publicPrice}
                                onChange={e => setPricing({ ...pricing, publicPrice: Number(e.target.value) })}
                            />
                            <p className="text-xs text-gray-500 mt-1.5">Гадна болон нийтийн эзэмшлийн талбайн 1м² үнэ.</p>
                        </div>

                        {/* 3. Агуулах цэвэрлэгээ */}
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Агуулах цэвэрлэгээ</label>
                            <input
                                type="number"
                                className="border p-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                                // Хэрэв pricing.warehousePrice байхгүй бол 0-ийг ашиглана
                                value={pricing.warehousePrice}
                                onChange={e => setPricing({ ...pricing, warehousePrice: Number(e.target.value) })}
                            />
                            <p className="text-xs text-gray-500 mt-1.5">Агуулахын талбайн 1 метр квадрат тутмын суурь үнэ.</p>
                        </div>

                        {/* 4. Агааржуулалтын хоолой */}
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Агааржуулалт хоолой цэвэрлэгээ</label>
                            <input
                                type="number"
                                className="border p-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                                value={pricing.ductPrice}
                                onChange={e => setPricing({ ...pricing, ductPrice: Number(e.target.value) })}
                            />
                            <p className="text-xs text-gray-500 mt-1.5">Агааржуулалтын хоолойн 1 метр квадрат тутмын суурь үнэ.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. СӨХ Цэвэрлэгээ */}
            <div className="bg-gray-50 p-6 rounded-xl mb-6">
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">СӨХ цэвэрлэгээний үнэ</h2>
                <p className="text-xs text-gray-500 mb-4 italic">Доорх утгуудыг нэмж нийт үнэ бодогдоно.</p>
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { key: "apartment", label: "Орцны тоо" },
                        { key: "floor", label: "Давхрын тоо" },
                        { key: "lift", label: "Лифтний тоо" },
                        { key: "room", label: "Айл бүрээс" }
                    ].map((item) => (
                        <div key={item.key}>
                            <label className="block text-sm font-medium mb-1">{item.label}</label>
                            <input type="number" className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-500"
                                value={pricing.suh[item.key as keyof typeof pricing.suh]}
                                onChange={e => setPricing({
                                    ...pricing,
                                    suh: { ...pricing.suh, [item.key]: Number(e.target.value) }
                                })}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. Давтамжийн хөнгөлөлт */}
            <div className="bg-gray-50 p-6 rounded-xl mb-6">
                <h2 className="text-xl font-semibold mb-2 border-b pb-2">Давтамжийн коэффициент</h2>
                <div className="bg-blue-50 p-3 rounded text-xs text-blue-700 mb-4">
                    💡 <b>Тайлбар:</b> Утга 1-ээс бага байвал хөнгөлөлт болно. (Жишээ нь: 0.9 гэвэл 10% хямдарна. 1.0 гэвэл хямдрахгүй).
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { key: "once", label: "Ганц удаа" },
                        { key: "daily", label: "Өдөр бүр" },
                        { key: "weekly", label: "7 хоногт 1" },
                        { key: "biweekly", label: "14 хоногт 1" },
                        { key: "monthly", label: "Сар бүр" }
                    ].map((item) => (
                        <div key={item.key}>
                            <label className="block text-sm font-medium mb-1">{item.label}</label>
                            <input type="number" step="0.01" className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-500"
                                value={pricing.frequency[item.key as keyof typeof pricing.frequency]}
                                onChange={e => setPricing({
                                    ...pricing,
                                    frequency: { ...pricing.frequency, [item.key]: Number(e.target.value) }
                                })}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <button
                disabled={loading}
                onClick={handleSave}
                className="mt-4 w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all disabled:bg-gray-400"
            >
                {loading ? "Хадгалж байна..." : "ӨӨРЧЛӨЛТИЙГ ХАДГАЛАХ"}
            </button>
        </section>
    );
}
