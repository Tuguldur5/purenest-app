'use client'
import { useState } from 'react'

const frequencyOptions = [
    'Нэг удаа',
    'Долоо хоногт 1 удаа',
    '2 долоо хоногт 1 удаа',
    'Сард 1 удаа',
    'Өдөр бүр',
]

// 💡 1. Улаанбаатарын дүүрэг, хорооны жишээ мэдээлэл
const ULAANBAATAR_DISTRICTS = [
    { name: 'Сонгинохайрхан', khoroos: Array.from({ length: 43 }, (_, i) => `${i + 1}-р хороо`) },
    { name: 'Баянзүрх', khoroos: Array.from({ length: 43 }, (_, i) => `${i + 1}-р хороо`) },
    { name: 'Баянгол', khoroos: Array.from({ length: 34 }, (_, i) => `${i + 1}-р хороо`) },
    { name: 'Хан-Уул', khoroos: Array.from({ length: 25 }, (_, i) => `${i + 1}-р хороо`) },
    { name: 'Сүхбаатар', khoroos: Array.from({ length: 20 }, (_, i) => `${i + 1}-р хороо`) },
    { name: 'Чингэлтэй', khoroos: Array.from({ length: 24 }, (_, i) => `${i + 1}-р хороо`) },
    { name: 'Налайх', khoroos: Array.from({ length: 8 }, (_, i) => `${i + 1}-р хороо`) },
    { name: 'Багануур', khoroos: Array.from({ length: 5 }, (_, i) => `${i + 1}-р хороо`) },
    { name: 'Багахангай', khoroos: Array.from({ length: 2 }, (_, i) => `${i + 1}-р хороо`) },
];

// 💡 2. Аймаг, Хотын жагсаалт
const PROVINCES = [
    'Улаанбаатар',
];


const API_URL = "http://localhost:4000/api/booking";

export default function Booking() {

    const [form, setForm] = useState({
        name: '',
        phone: '',
        service: 'Оффис цэвэрлэгээ',
        date: '',
        roomsCount: { bathrooms: 0, bedrooms: 0, kitchen: 0, livingRoom: 0, hallway: 0 },
        extrasCount: { tv: 0, computer: 0, furniture: 0 },
        suhInfo: { apartments: 0, floors: 0, lifts: 0, rooms: 0 },
        publicAreaSize: '',
        frequency: 'Нэг удаа',
        city: 'Улаанбаатар', // 💡 Default-ийг УБ болгож өөрчлөв
        district: '', // 💡 Дүүрэг/Хороог сонголттой болгохын тулд эхлээд хоосон байна
        khoroo: '',
        total_price: 0,
        address: '',
    })

    const handleSuhChange = (key: string, value: number) => {
        setForm({
            ...form,
            suhInfo: { ...form.suhInfo, [key]: value },
        })
    }

    // PRICE CALCULATION LOGIC (Үнийн тооцооллын логик)
    const calculatePrice = () => {
        let base = 0;

        // --- Оффис цэвэрлэгээ ---
        if (form.service === "Оффис цэвэрлэгээ") {
            const size = Number(form.publicAreaSize || 0);
            base = size * 20000;
        }

        // --- Олон нийтийн талбай ---
        if (form.service === "Олон нийтийн талбай") {
            const size = Number(form.publicAreaSize || 0);
            base = size * 25000;
        }

        // --- СӨХ цэвэрлэгээ ---
        if (form.service === "СӨХ цэвэрлэгээ") {
            const { apartments, floors, lifts, rooms } = form.suhInfo;
            // Үнийн томьёо: Байр * 100k + Давхар * 40k + Лифт * 20k + Айлын тоо * 5k
            base =
                apartments * 100000 +
                floors * 20000 +
                lifts * 10000 +
                rooms * 5000;
        }

        // --- Давтамжийн хөнгөлөлт ---
        let factor = 1;
        switch (form.frequency) {
            case "Долоо хоногт 1 удаа": factor = 0.9; break; // 10% хөнгөлөлт
            case "2 долоо хоногт 1 удаа": factor = 0.95; break; // 5% хөнгөлөлт
            case "Өдөр бүр": factor = 0.80; break; // 20% хөнгөлөлт
            default: factor = 1; // 'Нэг удаа' эсвэл 'Сард 1 удаа'
        }

        return Math.max(0, Math.round(base * factor));
    };

    // Хүсэлт илгээх функц
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const totalPrice = calculatePrice();

    // 1. Токен шалгах
    const token = localStorage.getItem('token');
    if (!token) {
        alert("Захиалга хийхийн тулд эхлээд нэвтрэх шаардлагатай!");
        return;
    }


    
    // 2. Шаардлагатай талбаруудыг шалгах
    if (!form.name || !form.phone || !form.city || !form.district || !form.address || !form.date) {
        alert("Нэр, утас, огноо, хаягийн мэдээллийг бүрэн бөглөнө үү.");
        return;
    }

    // 3. Payload бэлтгэх
    const payload = {
        service: form.service,
        public_area_size: form.service !== "СӨХ цэвэрлэгээ" ? Number(form.publicAreaSize) : 0,
        roomsCount: form.roomsCount || {},
        extrasCount: form.extrasCount || {},
        suhInfo: form.suhInfo || {},
        frequency: form.frequency || "Нэг удаа",
        city: form.city,
        district: form.district,
        khoroo: form.khoroo,
        address: form.address,
        totalPrice: totalPrice || 0,
    };

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            const data = await res.json();
            console.log("Backend response:", data);
            alert(`Захиалга амжилттай илгээгдлээ! Дугаар: ${data.order?.order_id ?? 'N/A'}`);
        } else {
            // JSON parse-д алдаа гарахыг catch хийх
            let errorData: { error?: string } = {};
            try {
                errorData = await res.json();
            } catch (parseErr) {
                console.warn("JSON parse failed, likely empty or non-JSON response:", parseErr);
            }

            // Type-safe алдаа message
            const errorMessage = errorData?.error ?? res.statusText ?? 'Unknown error';
            console.error("Server Error:", errorMessage);
            alert(`Захиалга илгээхэд алдаа гарлаа: ${errorMessage}`);
        }
    } catch (err) {
        console.error("Fetch failed:", err);
        alert("Сервертэй холбогдож чадсангүй. Та дараа дахин оролдоно уу.");
    }
};


    // 💡 4. Сонгосон дүүрэгт хамаарах хороог шүүж авах
    const availableKhoroos = ULAANBAATAR_DISTRICTS.find(d => d.name === form.district)?.khoroos || [];


    return (
        <section className="flex justify-center mt-10 mb-10 text-black">
            <div className="w-full max-w-3xl p-10 bg-gray-50 border border-black/5 shadow-md rounded-xl space-y-6">
                <h1 className="text-2xl font-semibold text-center mb-6">Захиалах</h1>

                <form className="space-y-4" onSubmit={handleSubmit}>
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

                    {/* House cleaning / Public Area: Area size input */}
                    {(form.service === 'Оффис цэвэрлэгээ' || form.service === 'Олон нийтийн талбай') && (
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

                    {/* SUH cleaning: Building details */}
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


                    {/* 💡 Address Dropdowns - ШИНЭЧИЛСЭН ХЭСЭГ */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2">Хот / Аймаг</label>
                            <select
                                value={form.city}
                                onChange={(e) => {
                                    // Хот солигдоход Дүүрэг/Хороог цэвэрлэх
                                    setForm({ ...form, city: e.target.value, district: '', khoroo: '' });
                                }}
                                className="w-full border p-2 rounded"
                            >

                                {PROVINCES.map(p => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>

                        {/* Дүүрэг / Сум */}
                        <div>
                            <label className="block mb-2">{form.city === 'Улаанбаатар' ? 'Дүүрэг' : 'Сум'}</label>
                            <select
                                disabled={!form.city} // Хот сонгоогүй бол идэвхгүй
                                value={form.district}
                                onChange={(e) => setForm({ ...form, district: e.target.value, khoroo: '' })}
                                className="w-full border p-2 rounded"
                            >
                                <option value="" disabled>Сонгоно уу</option>
                                {/* УБ-ын дүүргүүдийг харуулна */}
                                {form.city === 'Улаанбаатар' && ULAANBAATAR_DISTRICTS.map(d => (
                                    <option key={d.name} value={d.name}>{d.name}</option>
                                ))}
                                {/* 💡 Бусад аймгийн сумдыг энд нэмэх шаардлагатай */}
                            </select>
                        </div>

                        {/* Хороо / Баг */}
                        <div>
                            <label className="block mb-2">{form.city === 'Улаанбаатар' ? 'Хороо' : 'Баг'}</label>
                            <select
                                disabled={!form.district} // Дүүрэг/Сум сонгоогүй бол идэвхгүй
                                value={form.khoroo}
                                onChange={(e) => setForm({ ...form, khoroo: e.target.value })}
                                className="w-full border p-2 rounded"
                            >
                                <option value="" disabled>Сонгоно уу</option>
                                {availableKhoroos.map(k => (
                                    <option key={k} value={k}>{k}</option>
                                ))}
                                {/* 💡 Бусад аймгийн багуудыг энд нэмэх шаардлагатай */}
                            </select>
                        </div>

                        {/* Үлдсэн Байршил / Гудамж - Input хэвээр үлдэнэ */}
                        <div>
                            <label className="block mb-2">Байршил / Гудамж</label>
                            <input
                                value={form.address}
                                onChange={(e) => setForm({ ...form, address: e.target.value })}
                                className="w-full border p-2 rounded"
                            />
                        </div>
                    </div>
                    {/* 💡 type="submit" -ийн оронд type="button" байсан тул onClick={handleSubmit}-ийг хэвээр үлдээв */}
                    <button
                        type="button"
                        className="w-full border mt-4 border-white/5 shadow-md p-2 rounded bg-[#102B5A] text-white hover:text-amber-400 duration-300"
                        onClick={handleSubmit}
                    >
                        Захиалах
                    </button>
                </form>
            </div>

            {/* Price Summary (Үнийн хураангуй) */}
            <div className="w-96 ml-8 sticky bg-gray-100 top-10 h-fit p-6 border border-black/5  shadow-lg rounded-xl bg-white">
                <h2 className="text-xl font-semibold mb-4">Таны захиалга</h2>
                <p className="text-gray-700 mb-2">
                    <strong>Үйлчилгээ:</strong> {form.service}
                </p>
                <p className="text-gray-700 mb-2">
                    <strong>Давтамж:</strong> {form.frequency}
                </p>
                <p className="text-gray-700 mb-2">
                    <strong>Огноо:</strong> {form.date}
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