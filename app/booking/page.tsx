'use client'
import { useState, useMemo } from 'react' // useMemo-г нэмэв

// Давтамж
const frequencyOptions = [
    'Нэг удаа',
    'Долоо хоногт 1 удаа',
    '2 долоо хоногт 1 удаа',
    'Сард 1 удаа',
    'Өдөр бүр',
]

// 💡 Улаанбаатарын дүүрэг, хорооны мэдээлэл
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

// 💡 Аймаг, Хотын жагсаалт (Одоогоор зөвхөн УБ)
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
        
        // ❌ roomsCount, extrasCount, suhInfo object-г устгав.
        // 💡 DB-ийн INT баганууд:
        apartments: 0, // Байрны тоо
        floors: 0,     // Давхарын тоо
        lifts: 0,      // Лифтийн тоо
        rooms: 0,      // Айлын тоо

        publicAreaSize: '',
        frequency: 'Нэг удаа',
        city: 'Улаанбаатар',
        district: '',
        khoroo: '',
        address: '',
    })

    // Үндсэн form өөрчлөх функц
    const handleFormChange = (key: string, value: any) => {
        setForm(prevForm => {
            // Дүүрэг солигдоход хороог цэвэрлэнэ
            if (key === 'district') {
                 return { ...prevForm, district: value, khoroo: '' };
            }
            // Хот солигдоход дүүрэг, хороог цэвэрлэнэ
            if (key === 'city') {
                 return { ...prevForm, city: value, district: '', khoroo: '' };
            }
            return { ...prevForm, [key]: value };
        });
    };


    // PRICE CALCULATION LOGIC (Үнийн тооцооллын логик) - useMemo ашиглаж сайжруулав
    const totalPrice = useMemo(() => {
        let base = 0;

        const publicAreaSizeNum = Number(form.publicAreaSize || 0);

        // --- Оффис цэвэрлэгээ ---
        if (form.service === "Оффис цэвэрлэгээ") {
            base = publicAreaSizeNum * 20000;
        }

        // --- Олон нийтийн талбай ---
        if (form.service === "Олон нийтийн талбай") {
            base = publicAreaSizeNum * 25000;
        }

        // --- СӨХ цэвэрлэгээ ---
        if (form.service === "СӨХ цэвэрлэгээ") {
            // ⚠️ form-оос шууд утгыг авлаа
            const { apartments, floors, lifts, rooms } = form; 
            
            // Үнийн томьёо: Байр * 100k + Давхар * 20k + Лифт * 10k + Айлын тоо * 5k
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
            default: factor = 1; 
        }

        return Math.max(0, Math.round(base * factor));
    }, [form]); // form state өөрчлөгдөхөд дахин тооцоолно


    // Хүсэлт илгээх функц
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

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

        // 3. Payload бэлтгэх (DB-ийн баганын нэрээр)
        const payload = {
            service: form.service,
            date: form.date, 

            // 💡 DB-д байгаа СӨХ-ийн INT талбарууд:
            apartments: form.apartments || 0,
            floors: form.floors || 0,
            lifts: form.lifts || 0,
            rooms: form.rooms || 0, // Айлын тоо

            // Оффис / Олон нийтийн талбайн хэмжээ
            public_area_size: form.service !== "СӨХ цэвэрлэгээ" ? Number(form.publicAreaSize) : 0, 

            frequency: form.frequency || "Нэг удаа",
            city: form.city,
            district: form.district,
            khoroo: form.khoroo,
            address: form.address,
            total_price: totalPrice, // ⚠️ DB-д price гэж байгаа тул totalPrice-ийг price болгов
            
            // ❌ roomsCount, extrasCount, suhInfo object-ууд байхгүй
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
                alert(`Захиалга амжилттай илгээгдлээ! Дугаар: ${data.order?.id ?? 'N/A'}`); // DB-ийн id-г ашиглав
            } else {
                let errorData: { error?: string } = {};
                try {
                    errorData = await res.json();
                } catch (parseErr) {
                    console.warn("JSON parse failed, likely empty or non-JSON response:", parseErr);
                }
                const errorMessage = errorData.error || `Алдаа гарлаа: ${res.status} ${res.statusText}`;
                alert(`Захиалга хийхэд алдаа гарлаа: ${errorMessage}`);
            }
        } catch (err) {
            console.error("Fetch failed:", err);
            alert("Сервертэй холбогдож чадсангүй. Та дараа дахин оролдоно уу.");
        }
    };


    // Сонгосон дүүрэгт хамаарах хороог шүүж авах
    const availableKhoroos = useMemo(() => {
        return ULAANBAATAR_DISTRICTS.find(d => d.name === form.district)?.khoroos || [];
    }, [form.district]);


    return (
        <section className="flex justify-center mt-10 mb-10 text-black">
            <div className="w-full max-w-3xl p-10 bg-gray-50 border border-black/5 shadow-md rounded-xl space-y-6">
                <h1 className="text-2xl font-semibold text-center mb-6">Захиалах</h1>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block mb-2">Нэр</label>
                        <input
                            value={form.name}
                            onChange={(e) => handleFormChange('name', e.target.value)}
                            className="w-full border p-2 rounded"
                        />
                    </div>

                    <div>
                        <label className="block mb-2">Утас</label>
                        <input
                            value={form.phone}
                            onChange={(e) => handleFormChange('phone', e.target.value)}
                            className="w-full border p-2 rounded"
                        />
                    </div>

                    <div>
                        <label className="block mb-2">Үйлчилгээ</label>
                        <select
                            value={form.service}
                            onChange={(e) => handleFormChange('service', e.target.value)}
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
                                onChange={(e) => handleFormChange('publicAreaSize', e.target.value)}
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
                                        value={form.apartments}
                                        onChange={(e) => handleFormChange('apartments', Number(e.target.value))} // ⚠️ Шууд setForm-ийг ашиглав
                                        className="w-full border p-2 rounded"
                                    />
                                </div>
                                <div>
                                    <label>Давхарын тоо</label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={form.floors}
                                        onChange={(e) => handleFormChange('floors', Number(e.target.value))} // ⚠️ Шууд setForm-ийг ашиглав
                                        className="w-full border p-2 rounded"
                                    />
                                </div>
                                <div>
                                    <label>Lift-ийн тоо</label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={form.lifts}
                                        onChange={(e) => handleFormChange('lifts', Number(e.target.value))} // ⚠️ Шууд setForm-ийг ашиглав
                                        className="w-full border p-2 rounded"
                                    />
                                </div>

                                <div>
                                    <label>Айлын тоо</label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={form.rooms}
                                        onChange={(e) => handleFormChange('rooms', Number(e.target.value))} // ⚠️ Шууд setForm-ийг ашиглав
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
                            onChange={(e) => handleFormChange('date', e.target.value)}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    {/* Frequency */}
                    <div>
                        <label className="block mb-2">Давтамж</label>
                        <select
                            value={form.frequency}
                            onChange={(e) => handleFormChange('frequency', e.target.value)}
                            className="w-full border p-2 rounded"
                        >
                            {frequencyOptions.map((f) => (
                                <option key={f}>{f}</option>
                            ))}
                        </select>
                    </div>


                    {/* Address Dropdowns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2">Хот / Аймаг</label>
                            <select
                                value={form.city}
                                onChange={(e) => handleFormChange('city', e.target.value)} // 💡 handleFormChange нь дотроо reset хийнэ
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
                                disabled={!form.city} 
                                value={form.district}
                                onChange={(e) => handleFormChange('district', e.target.value)} // 💡 handleFormChange нь дотроо reset хийнэ
                                className="w-full border p-2 rounded"
                            >
                                <option value="" disabled>Сонгоно уу</option>
                                {form.city === 'Улаанбаатар' && ULAANBAATAR_DISTRICTS.map(d => (
                                    <option key={d.name} value={d.name}>{d.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Хороо / Баг */}
                        <div>
                            <label className="block mb-2">{form.city === 'Улаанбаатар' ? 'Хороо' : 'Баг'}</label>
                            <select
                                disabled={!form.district} 
                                value={form.khoroo}
                                onChange={(e) => handleFormChange('khoroo', e.target.value)}
                                className="w-full border p-2 rounded"
                            >
                                <option value="" disabled>Сонгоно уу</option>
                                {availableKhoroos.map(k => (
                                    <option key={k} value={k}>{k}</option>
                                ))}
                            </select>
                        </div>

                        {/* Үлдсэн Байршил / Гудамж - Input хэвээр үлдэнэ */}
                        <div>
                            <label className="block mb-2">Байршил / Гудамж</label>
                            <input
                                value={form.address}
                                onChange={(e) => handleFormChange('address', e.target.value)}
                                className="w-full border p-2 rounded"
                            />
                        </div>
                    </div>
                    
                    {/* type="button" -ийн оронд type="submit" байвал зөв */}
                    <button
                        type="submit"
                        className="w-full border mt-4 border-white/5 shadow-md p-2 rounded bg-[#102B5A] text-white hover:text-amber-400 duration-300"
                    >
                        Захиалах
                    </button>
                </form>
            </div>

            {/* Price Summary (Үнийн хураангуй) */}
            <div className="w-96 ml-8 sticky bg-gray-100 top-10 h-fit p-6 border border-black/5  shadow-lg rounded-xl bg-white">
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
                        {totalPrice.toLocaleString()} ₮
                    </p>
                </div>
            </div>
        </section>
    )
}