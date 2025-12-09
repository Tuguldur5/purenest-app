'use client'

import { useEffect, useState } from 'react'

const API_URL = "http://localhost:4000/api/admin/pricing";

export default function PricingAdmin() {
    const [pricing, setPricing] = useState({
        officePrice: 20000,
        publicPrice: 25000,
        suh: { apartment: 100000, floor: 20000, lift: 10000, room: 5000 },
        frequency: { once: 1, weekly: 0.9, biweekly: 0.95, daily: 0.8 }
    });

    const [loading, setLoading] = useState(false);

    // Fetch existing pricing from backend
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        fetch(API_URL, { headers: { "Authorization": `Bearer ${token}` } })
            .then(res => res.json())
            .then(data => {
                setPricing({
                    officePrice: data.office_price_per_sqm || 20000,
                    publicPrice: data.public_area_price_per_sqm || 25000,
                    suh: {
                        apartment: data.suh_apartment_base || 100000,
                        floor: data.suh_floor_price || 20000,
                        lift: data.suh_lift_price || 10000,
                        room: data.suh_room_price || 5000
                    },
                    frequency: {
                        once: 1,
                        daily: data.daily_discount || 0.8,
                        weekly: data.weekly_discount || 0.9,
                        biweekly: data.biweekly_discount || 0.95
                    }
                });
            })
            .catch(() => alert("Үнийн тохиргоо татаж чадсангүй."))
    }, []);

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
                {["apartment","floor","lift","room"].map((k) => (
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
                {["once","daily","weekly","biweekly"].map((k) => (
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
