'use client'
import { useState, useMemo, useEffect } from 'react' // useMemo-г нэмэв
import { useRouter } from 'next/navigation'; // Чиглүүлэгч нэмэх
import { useSiteToast } from '../hooks/useSiteToast';
import { describe } from 'node:test';
import { DessertIcon } from 'lucide-react';

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


const API_URL = "https://purenest-app.onrender.com/api/booking";

export default function Booking() {
    const today = new Date().toISOString().split('T')[0];
    const [loading, setLoading] = useState<boolean>(false)
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true); // Анхны утга
    const { showToast } = useSiteToast();
    const [form, setForm] = useState({
        name: '',
        phone_number: '',
        service: 'Оффис цэвэрлэгээ',
        date: '',
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
    // Booking.tsx дотор
    const [dbPricing, setDbPricing] = useState<any>(null);

    useEffect(() => {
        // URL нь дээрх нээлттэй API-тай ижил байх ёстой
        fetch('https://purenest-app.onrender.com/api/pricing-settings')
            .then(res => res.json())
            .then(data => setDbPricing(data))
            .catch(err => console.error("Үнэ татаж чадсангүй:", err));
    }, []);


    // Нийт үнийг тооцоолох функц
    const totalPrice = useMemo(() => {
        if (!dbPricing) return 0; // Үнэ татаж дуустал 0 харуулна

        let base = 0;
        const publicAreaSizeNum = Number(form.publicAreaSize || 0);

        // --- Оффис цэвэрлэгээ ---
        if (form.service === "Оффис цэвэрлэгээ") {
            base = publicAreaSizeNum * Number(dbPricing.office_price_per_sqm);
        }

        // --- Олон нийтийн талбай ---
        if (form.service === "Олон нийтийн талбай") {
            base = publicAreaSizeNum * Number(dbPricing.public_area_price_per_sqm);
        }

        // --- СӨХ цэвэрлэгээ ---
        if (form.service === "СӨХ цэвэрлэгээ") {
            const { apartments, floors, lifts, rooms } = form;
            base =
                apartments * Number(dbPricing.suh_apartment_base) +
                floors * Number(dbPricing.suh_floor_price) +
                lifts * Number(dbPricing.suh_lift_price) +
                rooms * Number(dbPricing.suh_room_price);
        }

        // --- Давтамжийн хөнгөлөлт ---
        let factor = 1;
        switch (form.frequency) {
            case "Өдөр бүр":
                factor = Number(dbPricing.daily_discount); break;
            case "Долоо хоногт 1 удаа":
                factor = Number(dbPricing.weekly_discount); break;
            case "2 долоо хоногт 1 удаа":
                factor = Number(dbPricing.biweekly_discount); break;
            case "Сард 1 удаа":
                factor = Number(dbPricing.monthly_discount); break; // Шинэ давтамж нэмэв
            default:
                factor = 1; // "Нэг удаа" бол хөнгөлөлтгүй
        }

        return Math.max(0, Math.round(base * factor));
    }, [form, dbPricing]); // dbPricing өөрчлөгдөх бүрт үнэ шинэчлэгдэнэ 


    // Хүсэлт илгээх функц
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Токен шалгах
        const token = localStorage.getItem('token');
        if (!token) {
            showToast({title:"Алдаа", description:"Захиалга хийхийн тулд эхлээд нэвтрэх шаардлагатай!"})
            return;
        }

        // 2. Шаардлагатай талбаруудыг шалгах
        if (!form.phone_number || !form.city || !form.district || !form.address || !form.date) {
            showToast({title:"Анхаар!", description:"Утас, Огноо, Хаягийн мэдээллийг бүрэн бөглөнө үү."})
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
            public_area_size: form.service !== "СӨХ цэвэрлэгээ" ? Number(form.publicAreaSize) : 0,
            frequency: form.frequency || "Нэг удаа",
            city: form.city,
            district: form.district,
            khoroo: form.khoroo,
            address: form.address,
            total_price: totalPrice, // 
            phone_number: form.phone_number,
            full_name: form.name,

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
                showToast({title:"Амжилттай", description:"Захиалга амжилттай илгээгдлээ!"})
                let errorData: { error?: string } = {};
                try {
                    errorData = await res.json();
                } catch (parseErr) {
                    console.warn("JSON parse failed, likely empty or non-JSON response:", parseErr);
                }
                const errorMessage = errorData.error || `Алдаа гарлаа: ${res.status} ${res.statusText}`;
                showToast({title:"Алдаа",description:"Захиалга хийхэд алдаа гарлаа:", errorMessage})
            }
        } catch (err) {
            console.error("Fetch failed:", err);
            
            showToast({title:"Алдаа", description:"Сервертэй холбогдож чадсангүй. Та дараа дахин оролдоно уу"})
        }
    };

    // Сонгосон дүүрэгт хамаарах хороог шүүж авах
    const availableKhoroos = useMemo(() => {
        return ULAANBAATAR_DISTRICTS.find(d => d.name === form.district)?.khoroos || [];
    }, [form.district]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsLoggedIn(false); 
            return;
        }

        // Хэрэглэгчийн мэдээллийг татах
        fetch("https://purenest-app.onrender.com/api/booking/user-info", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                // 💡 Backend-ээс ирсэн data.full_name болон data.phone-г form-д оноох
                setForm(prev => ({
                    ...prev,
                    name: data.full_name || '',        // full_name гэж ирж байгаа
                    phone_number: data.phone || ''     // phone гэж ирж байгааг phone_number-т оноов
                }));
            })
            .catch(err => {
                console.error("User info fetch failed:", err);
            });
    }, []);

    if (!isLoggedIn) {
        return (
            <section className="flex flex-col items-center justify-center min-h-[60vh] px-4 my-10 ">
                <div className="bg-white p-10 rounded-2xl shadow-2xl border border-gray-100 text-center max-w-md">
                    <div className="bg-amber-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Нэвтрэх шаардлагатай</h2>
                    <p className="text-gray-600 mb-8">Захиалга өгөхийн тулд та өөрийн бүртгэлээрээ нэвтэрсэн байх шаардлагатай.</p>
                    <button 
                        onClick={() => router.push('/login')} 
                        className="w-full bg-[#102B5A] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#1a3f7a] transition-all shadow-lg"
                    >
                        Нэвтрэх хуудас руу очих
                    </button>
                    <p className="mt-4 text-sm text-gray-500">Бүртгэлгүй бол <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => router.push('/register')}>Бүртгүүлэх</span></p>
                </div>
            </section>
        );
    }

    return (
        <section className="flex flex-col items-center mt-10 mb-20 px-4 text-black bg-gray-50/50">
            {/* 1. ГАРЧИГ ХЭСЭГ */}
            <div className="w-full max-w-7xl text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
                    Захиалга өгөх
                </h1>
                <div className="h-1 w-20 bg-amber-400 mx-auto mt-4 rounded-full"></div>
            </div>

            {/* 2. ҮНДСЭН КОНТЕНТ */}
            <div className="flex flex-col md:flex-row justify-center items-start gap-8 w-full max-w-7xl">

                {/* ЗҮҮН ТАЛ: Захиалгын Форм */}
                <div className="w-full md:flex-1 p-6 md:p-10 bg-white border border-gray-100 shadow-xl rounded-2xl space-y-6">
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-600 ml-1">Нэр</label>
                                <input
                                    required // Нэмэгдсэн
                                    value={form.name}
                                    onChange={(e) => handleFormChange('name', e.target.value)}
                                    className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 outline-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-600 ml-1">Утас</label>
                                <input
                                    required // Нэмэгдсэн
                                    type="tel" // Утасны дугаар тул төрлийг нь зааж өгвөл зүгээр
                                    value={form.phone_number}
                                    onChange={(e) => handleFormChange('phone_number', e.target.value)}
                                    className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-[#102B5A] outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-600 ml-1">Үйлчилгээ</label>
                            <select
                                required // Нэмэгдсэн
                                value={form.service}
                                onChange={(e) => handleFormChange('service', e.target.value)}
                                className="w-full border border-gray-200 p-3 rounded-xl bg-white outline-none cursor-pointer"
                            >
                                <option>Оффис цэвэрлэгээ</option>
                                <option>СӨХ цэвэрлэгээ</option>
                                <option>Олон нийтийн талбай</option>
                            </select>
                        </div>

                        {/* Динамик талбарууд - Үйлчилгээ сонгосон үед гарч ирнэ */}
                        {(form.service === 'Оффис цэвэрлэгээ' || form.service === 'Олон нийтийн талбай') && (
                            <div className="p-4 bg-gray-50 rounded-xl space-y-2">
                                <label className="text-sm font-semibold text-gray-600">Талбайн хэмжээ (м²)</label>
                                <input
                                    required // Нэмэгдсэн
                                    type="number"
                                    min={1}
                                    value={form.publicAreaSize}
                                    onChange={(e) => handleFormChange('publicAreaSize', e.target.value)}
                                    className="w-full border border-gray-200 p-3 rounded-xl outline-none bg-white"
                                />
                            </div>
                        )}

                        {form.service === 'СӨХ цэвэрлэгээ' && (
                            <div className="p-5 bg-gray-50 rounded-xl space-y-4">
                                <h2 className="font-bold text-gray-700">Барилгын мэдээлэл</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[
                                        { label: "Байрны тоо", key: "apartments" },
                                        { label: "Давхарын тоо", key: "floors" },
                                        { label: "Lift-ийн тоо", key: "lifts" },
                                        { label: "Айлын тоо", key: "rooms" }
                                    ].map((item) => (
                                        <div key={item.key}>
                                            <label className="text-xs font-medium text-gray-500">{item.label}</label>
                                            <input
                                                required
                                                type="number"
                                                min={0}
                                                // Энд keyof typeof form ашиглан TypeScript алдааг засна
                                                value={form[item.key as keyof typeof form]}
                                                onChange={(e) => handleFormChange(item.key, e.target.value)}
                                                className="w-full border border-gray-200 p-2 rounded-lg mt-1 outline-none"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-600 ml-1">Огноо</label>
                                <input
                                    required // Нэмэгдсэн
                                    type="date"
                                    min={today}
                                    value={form.date}
                                    onChange={(e) => handleFormChange('date', e.target.value)}
                                    className="w-full border border-gray-200 p-2.5 rounded-xl outline-none cursor-pointer"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-600 ml-1">Давтамж</label>
                                <select
                                    required // Нэмэгдсэн
                                    value={form.frequency}
                                    onChange={(e) => handleFormChange('frequency', e.target.value)}
                                    className="w-full border border-gray-200 p-3 rounded-xl bg-white outline-none cursor-pointer"
                                >
                                    <option value="">Сонгоно уу</option>
                                    {frequencyOptions.map((f) => (
                                        <option key={f}>{f}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-6 mt-6">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">Хот / Аймаг</label>
                                <select
                                    required // Нэмэгдсэн
                                    value={form.city}
                                    onChange={(e) => handleFormChange('city', e.target.value)}
                                    className="w-full border border-gray-200 p-3 rounded-xl bg-white mt-1"
                                >
                                    <option value="">Сонгох</option>
                                    {PROVINCES.map(p => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">
                                    {form.city === 'Улаанбаатар' ? 'Дүүрэг' : 'Сум'}
                                </label>
                                <select
                                    required // Нэмэгдсэн
                                    disabled={!form.city}
                                    value={form.district}
                                    onChange={(e) => handleFormChange('district', e.target.value)}
                                    className="w-full border border-gray-200 p-3 rounded-xl bg-white mt-1 disabled:bg-gray-100"
                                >
                                    <option value="">Сонгоно уу</option>
                                    {form.city === 'Улаанбаатар' && ULAANBAATAR_DISTRICTS.map(d => (
                                        <option key={d.name} value={d.name}>{d.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">
                                    {form.city === 'Улаанбаатар' ? 'Хороо' : 'Баг'}
                                </label>
                                <select
                                    required // Нэмэгдсэн
                                    disabled={!form.district}
                                    value={form.khoroo}
                                    onChange={(e) => handleFormChange('khoroo', e.target.value)}
                                    className="w-full border border-gray-200 p-3 rounded-xl bg-white mt-1 disabled:bg-gray-100"
                                >
                                    <option value="">Сонгоно уу</option>
                                    {availableKhoroos.map(k => (
                                        <option key={k} value={k}>{k}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-600 ml-1">Байршил / Гудамж</label>
                            <input
                                required // Нэмэгдсэн
                                value={form.address}
                                onChange={(e) => handleFormChange('address', e.target.value)}
                                className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-[#102B5A]"
                                placeholder="Дэлгэрэнгүй хаяг..."
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#102B5A] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-[#1a3f7a] transition-all duration-300 mt-4"
                        >
                          {loading ? "Мэдээллийг илгээж байна..." : "Захиалах"} 
                        </button>
                    </form>
                </div>

                {/* БАРУУН ТАЛ: Үнийн хэсэг (Sticky) */}
                <div className="w-full md:w-80 lg:sticky lg:top-10">
                    <div className="bg-white border border-gray-100 shadow-xl rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b">Таны захиалга</h2>
                        <div className="space-y-4">
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-gray-400 uppercase">Үйлчилгээ</span>
                                <span className="text-gray-700 font-medium">{form.service}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-gray-400 uppercase">Давтамж</span>
                                <span className="text-gray-700 font-medium">{form.frequency}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-gray-400 uppercase">Огноо</span>
                                <span className="text-gray-700 font-medium">{form.date || "Сонгоогүй"}</span>
                            </div>
                            <div className="pt-6 mt-6 border-t">
                                <p className="text-sm font-bold text-gray-400 uppercase">Нийт төлөх дүн</p>
                                <p className="text-3xl font-black text-emerald-600">
                                    {totalPrice.toLocaleString()} ₮
                                </p>
                            </div>
                            <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                <p className="text-xs text-emerald-800 text-center font-medium">
                                    Таны захиалгыг баталгаажуулахаар манай ажилтан тантай холбогдох болно.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
)
}
