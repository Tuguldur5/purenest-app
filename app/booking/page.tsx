'use client'
import { useState } from 'react'
import Image from 'next/image'

const roomOptions = [
    { key: 'bathrooms', label: 'Bathroom', img: '/bathroom.png' },
    { key: 'bedrooms', label: 'Bedroom', img: '/bedroom.png' },
    { key: 'kitchen', label: 'Kitchen', img: '/kitchen.png' },
    { key: 'livingRoom', label: 'Living Room', img: '/livingroom.png' },
    { key: 'hallway', label: 'Hallway / Stairs', img: '/hallway.png' },
]

const extrasOptions = [
    { key: 'tv', label: 'TV', img: '/tv.png' },
    { key: 'computer', label: 'Computer', img: '/computer.png' },
    { key: 'furniture', label: 'Furniture', img: '/furniture.png' },
]

const frequencyOptions = [
    'Нэг удаа',
    'Долоо хоногт 1 удаа',
    '2 долоо хоногт 1 удаа',
    'Сард 1 удаа',
    'Өдөр бүр',
]



export default function Booking() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [service, setService] = useState("");   // ← энэ заавал байх ёстой
    const [area, setArea] = useState("");
    const [frequency, setFrequency] = useState("");

    const [form, setForm] = useState({
        name: '',
        phone: '',
        service: 'Гэр цэвэрлэгээ',
        date: '',
        roomsCount: { bathrooms: 0, bedrooms: 0, kitchen: 0, livingRoom: 0, hallway: 0 },
        extrasCount: { tv: 0, computer: 0, furniture: 0 },
        suhInfo: { apartments: 0, floors: 0, lifts: 0, toilets: 0, rooms: 0 },
        publicAreaSize: '',
        frequency: 'Нэг удаа',
        city: '',
        district: '',
        khoroo: '',
        address: '',
    })

    const incrementRoom = (key: string) => {
        setForm({
            ...form,
            roomsCount: { ...form.roomsCount, [key]: form.roomsCount[key as keyof typeof form.roomsCount] + 1 },
        })
    }

    const decrementRoom = (key: string) => {
        setForm({
            ...form,
            roomsCount: {
                ...form.roomsCount,
                [key]: Math.max(0, form.roomsCount[key as keyof typeof form.roomsCount]),
            },
        })
    }

    const incrementExtra = (key: string) => {
        setForm({
            ...form,
            extrasCount: { ...form.extrasCount, [key]: form.extrasCount[key as keyof typeof form.extrasCount] + 1 },
        })
    }

    const decrementExtra = (key: string) => {
        setForm({
            ...form,
            extrasCount: {
                ...form.extrasCount,
                [key]: Math.max(0, form.extrasCount[key as keyof typeof form.extrasCount]),
            },
        })
    }

    const handleSuhChange = (key: string, value: number) => {
        setForm({
            ...form,
            suhInfo: { ...form.suhInfo, [key]: value },
        })
    }
    // PRICE CALCULATION LOGIC
    const calculatePrice = () => {
        let base = 0;

        // --- Оффис цэвэрлэгээ ---
        if (form.service === "Оффис цэвэрлэгээ") {
            const size = Number(form.publicAreaSize || 0);
            base = size * 35000;
        }

        // --- Олон нийтийн талбай ---
        if (form.service === "Олон нийтийн талбай") {
            const size = Number(form.publicAreaSize || 0);
            base = size * 25000;
        }

        // --- СӨХ цэвэрлэгээ ---
        if (form.service === "СӨХ цэвэрлэгээ") {
            const { apartments, floors, lifts, rooms } = form.suhInfo;
            base =
                apartments * 100000 +
                floors * 40000 +
                lifts * 20000 +
                rooms * 5000;            // айлын тоо
        }

        // --- Давтамжийн нэмэлт/хасалт ---
        let factor = 1;
        switch (form.frequency) {
            case "Долоо хоногт 1 удаа": factor = 0.9; break; // 10% хөнгөлөлт
            case "2 долоо хоногт 1 удаа": factor = 0.95; break;
            case "Сард 1 удаа": factor = 1; break;
            case "Өдөр бүр": factor = 0.80; break; // их ажил тул бууруулахгүй бас болно
        }

        return Math.max(0, Math.round(base * factor));
    };
    const handleSubmit = () => {
        fetch("/api/send-mail", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, phone, service, area, frequency }),
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                alert("Захиалга илгээгдлээ (demo)");
            })
            .catch(err => {
                console.error(err);
                alert("Алдаа гарлаа, дахин оролдоно уу");
            });
    };



    return (
        <section className="flex justify-center mt-10 mb-10 text-black">
            <div className="w-full max-w-3xl p-10 border border-black/5 shadow-md rounded-2xl space-y-6">
                <h1 className="text-2xl font-semibold text-center mb-6">Захиалах</h1>

                <form className="space-y-4">

                    {/* Basic info */}
                    <div>
                        <label className="block mb-2">Нэр</label>
                        <input
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full border p-2 rounded"
                        />
                    </div>

                    <div>
                        <label className="block mb-2">Утас</label>
                        <input
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            className="w-full border p-2 rounded"
                        />
                    </div>

                    <div>
                        <label className="block mb-2">Үйлчилгээ</label>
                        <select
                            value={form.service}
                            onChange={(e) => setForm({ ...form, service: e.target.value })}
                            className="w-full border p-2 rounded"
                        >
                            <option>Оффис цэвэрлэгээ</option>
                            <option>СӨХ цэвэрлэгээ</option>
                            <option>Олон нийтийн талбай</option>
                        </select>
                    </div>



                    {/* House cleaning */}
                    {(form.service === 'Оффис цэвэрлэгээ') && (
                        <div>
                            <label className="block mb-2">Талбайн хэмжээ (м²)</label>
                            <input
                                type="number"
                                min={1}
                                value={form.publicAreaSize}
                                onChange={(e) => setForm({ ...form, publicAreaSize: e.target.value })}
                                className="w-full border p-2 rounded"
                            />
                        </div>
                    )}

                    {/* SUH cleaning */}
                    {form.service === 'СӨХ цэвэрлэгээ' && (
                        <div className="space-y-4">
                            <h2 className="font-semibold text-lg">Барилгын мэдээлэл</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div>
                                    <label>Байрны тоо</label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={form.suhInfo.apartments}
                                        onChange={(e) => handleSuhChange('apartments', Number(e.target.value))}
                                        className="w-full border p-2 rounded"
                                    />
                                </div>
                                <div>
                                    <label>Давхарын тоо</label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={form.suhInfo.floors}
                                        onChange={(e) => handleSuhChange('floors', Number(e.target.value))}
                                        className="w-full border p-2 rounded"
                                    />
                                </div>
                                <div>
                                    <label>Lift-ийн тоо</label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={form.suhInfo.lifts}
                                        onChange={(e) => handleSuhChange('lifts', Number(e.target.value))}
                                        className="w-full border p-2 rounded"
                                    />
                                </div>

                                <div>
                                    <label>Айлын тоо</label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={form.suhInfo.rooms}
                                        onChange={(e) => handleSuhChange('rooms', Number(e.target.value))}
                                        className="w-full border p-2 rounded"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Public area */}
                    {form.service === 'Олон нийтийн талбай' && (
                        <div>
                            <label className="block mb-2">Талбайн хэмжээ (м²)</label>
                            <input
                                type="number"
                                min={1}
                                value={form.publicAreaSize}
                                onChange={(e) => setForm({ ...form, publicAreaSize: e.target.value })}
                                className="w-full border p-2 rounded"
                            />
                        </div>
                    )}
                    <div>
                        <label className="block mb-2">Огноо</label>
                        <input
                            type="date"
                            value={form.date}
                            onChange={(e) => setForm({ ...form, date: e.target.value })}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    {/* Frequency */}
                    <div>
                        <label className="block mb-2">Давтамж</label>
                        <select
                            value={form.frequency}
                            onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                            className="w-full border p-2 rounded"
                        >
                            {frequencyOptions.map((f) => (
                                <option key={f}>{f}</option>
                            ))}
                        </select>
                    </div>

                    {/* Address */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2">Хот / Аймаг</label>
                            <input
                                value={form.city}
                                onChange={(e) => setForm({ ...form, city: e.target.value })}
                                className="w-full border p-2 rounded"
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Дүүрэг</label>
                            <input
                                value={form.district}
                                onChange={(e) => setForm({ ...form, district: e.target.value })}
                                className="w-full border p-2 rounded"
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Хороо</label>
                            <input
                                value={form.khoroo}
                                onChange={(e) => setForm({ ...form, khoroo: e.target.value })}
                                className="w-full border p-2 rounded"
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Байршил / Гудамж</label>
                            <input
                                value={form.address}
                                onChange={(e) => setForm({ ...form, address: e.target.value })}
                                className="w-full border p-2 rounded"
                            />
                        </div>
                    </div>
                    <button
                        type="button"
                        className="w-full border mt-4 border-white/5 shadow-md p-2 rounded bg-[#102B5A] text-white hover:text-amber-400 duration-300"
                        onClick={handleSubmit   }
                    >
                        Илгээх
                    </button>
                </form>
            </div>
            <div className=''>
                <div></div>
                <div></div>
            </div>
            <div className="w-96 ml-8 sticky top-10 h-fit p-6 border border-black/5 shadow-lg rounded-2xl bg-white">
                <h2 className="text-xl font-semibold mb-4">Таны захиалга</h2>

                <p className="text-gray-700 mb-2">
                    <strong>Үйлчилгээ:</strong> {form.service}
                </p>

                {form.service !== "СӨХ цэвэрлэгээ" && (
                    <p className="text-gray-700 mb-2">
                        <strong>Талбай:</strong> {form.publicAreaSize || 0} м²
                    </p>
                )}

                {form.service === "СӨХ цэвэрлэгээ" && (
                    <div className="text-gray-700 mb-2 space-y-1">
                        <p><strong>Байр:</strong> {form.suhInfo.apartments}</p>
                        <p><strong>Давхар:</strong> {form.suhInfo.floors}</p>
                        <p><strong>Лифт:</strong> {form.suhInfo.lifts}</p>
                        <p><strong>Айлын тоо:</strong> {form.suhInfo.rooms}</p>
                    </div>
                )}

                <p className="text-gray-700 mb-2">
                    <strong>Давтамж:</strong> {form.frequency}
                </p>

                <div className="border-t pt-4 mt-4">
                    <p className="text-lg font-bold">Нийт үнэ:</p>
                    <p className="text-3xl font-bold text-emerald-600">
                        {calculatePrice().toLocaleString()} ₮
                    </p>
                </div>
            </div>

        </section>
    )
}
