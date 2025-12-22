'use client'

import { useEffect, useState } from 'react'
import { text } from 'stream/consumers';

const API_URL = "http://localhost:4000/api/admin/pricing";

export default function PricingAdmin() {
    const [pricing, setPricing] = useState({
        officePrice: 20000,
        publicPrice: 25000,
        suh: { apartment: 100000, floor: 20000, lift: 10000, room: 5000 },
        frequency: { once: 1, weekly: 0.9, biweekly: 0.95, monthly: 0.97, daily: 0.8 }
    });

    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("Админ эрхээр нэвтэрч байж үнэ засварлана!");
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
                alert("Үнэ амжилттай шинэчлэгдлээ!");
            } else {
                const err = await res.json();
                alert(err.error || "Алдаа гарлаа");
            }

        } catch (err) {
            console.error(err);
            alert("Сервертэй холбогдож чадсангүй");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Нэвтрэх шаардлагатай!");
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
            <h1 className="text-3xl font-bold mb-6">Үнийн тохиргоо (Admin)</h1>

            {/* Office price */}
            <div className="mb-4">
                <label>Оффис цэвэрлэгээ — 1м² үнэ</label>
                <input type="number" className="border p-2 w-full rounded"
                    value={pricing.officePrice}
                    onChange={e => setPricing({ ...pricing, officePrice: Number(e.target.value) })}
                />
            </div>

            {/* Public Area */}
            <div className="mb-4">
                <label>Олон нийтийн талбай — 1м² үнэ</label>
                <input type="number" className="border p-2 w-full rounded"
                    value={pricing.publicPrice}
                    onChange={e => setPricing({ ...pricing, publicPrice: Number(e.target.value) })}
                />
            </div>

            {/* SUH */}
            <h2 className="text-xl font-semibold mt-6 mb-2">СӨХ цэвэрлэгээний үнэ</h2>
            <div className="grid grid-cols-2 gap-4">
                {["apartment", "floor", "lift", "room"].map((k) => (
                    <div key={k}>
                        <label>{k.charAt(0).toUpperCase() + k.slice(1)}</label>
                        <input type="number" className="border p-2 w-full rounded"
                            value={pricing.suh[k as keyof typeof pricing.suh]}
                            onChange={e => setPricing({
                                ...pricing,
                                suh: { ...pricing.suh, [k]: Number(e.target.value) }
                            })}
                        />
                    </div>
                ))}
            </div>

            {/* Frequency */}
            <h2 className="text-xl font-semibold mt-6 mb-2">Давтамжийн хөнгөлөлт</h2>
            <div className="grid grid-cols-2 gap-4">
                {["once", "daily", "weekly", "biweekly", "monthly"].map((k) => (
                    <div key={k}>
                        <label>{k}</label>
                        <input type="number" step="0.01" className="border p-2 w-full rounded"
                            value={pricing.frequency[k as keyof typeof pricing.frequency]}
                            onChange={e => setPricing({
                                ...pricing,
                                frequency: { ...pricing.frequency, [k]: Number(e.target.value) }
                            })}
                        />
                    </div>
                ))}
            </div>

            <button
                disabled={loading}
                onClick={handleSave}
                className="mt-6 w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                {loading ? "Хадгалж байна..." : "Хадгалах"}
            </button>
        </section>
    );
}
