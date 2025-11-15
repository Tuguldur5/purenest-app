'use client'
import { useState } from 'react'

export default function Booking() {
    const [form, setForm] = useState({ name: '', phone: '', service: 'Гэр цэвэрлэгээ', date: '' })

    return (
        <section className="flex justify-center items-start text-black w-full mt-10">
            <div className="w-full max-w-xl">
                <h2 className="text-2xl font-semibold mb-6 text-center">Захиалах</h2>

                <form className="w-full">
                    <label className="block mb-2">Нэр</label>
                    <input
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full border p-2 rounded mb-4"
                    />

                    <label className="block mb-2">Утас</label>
                    <input
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full border p-2 rounded mb-4"
                    />

                    <label className="block mb-2">Үйлчилгээ</label>
                    <select
                        value={form.service}
                        onChange={(e) => setForm({ ...form, service: e.target.value })}
                        className="w-full border p-2 rounded mb-4"
                    >
                        <option>Гэр цэвэрлэгээ</option>
                        <option>СӨХ цэвэрлэгээ</option>
                        <option>Олон нийтийн талбай</option>
                    </select>

                    <label className="block mb-2">Огноо</label>
                    <input
                        type="date"
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                        className="w-full border p-2 rounded mb-4"
                    />

                    <button
                        type="button"
                        className="w-full border p-2 rounded bg-black text-white hover:text-[#E3BE72] duration-300"
                        onClick={() => alert('Захиалга илгээгдлээ (demo)')}
                    >
                        Илгээх
                    </button>
                </form>
            </div>
        </section>
    )
}
