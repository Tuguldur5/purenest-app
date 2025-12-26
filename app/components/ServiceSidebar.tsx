'use client'
import React, { useMemo, useState } from 'react'
import Link from 'next/link'

type ServiceType = 'office' | 'public' | 'sokh'

type OrderItem = {
  id: string
  serviceType: ServiceType
  area: number
  floors: number
  rooms: number
  extras: string[]
  frequency: 'one-time' | 'weekly' | 'biweekly' | 'monthly'
  sessions: number
  unitPrice: number
  totalPrice: number
  notes?: string
}

export default function ServiceSidebar() {
  const [serviceType, setServiceType] = useState<ServiceType>('office')
  const [area, setArea] = useState<number>(50)
  const [floors, setFloors] = useState<number>(1) // байр/барилгын давхар
  const [rooms, setRooms] = useState<number>(1)
  const [extras, setExtras] = useState<Record<string, boolean>>({
    deepClean: false,
    fridge: false,
    windows: false,
  })
  const [frequency, setFrequency] = useState<OrderItem['frequency']>('one-time')
  const [sessions, setSessions] = useState<number>(1)
  const [notes, setNotes] = useState<string>('')
  const [cart, setCart] = useState<OrderItem[]>([])

  // Base rates (₮ per m²) — өөрчлөх боломжтой
  const baseRateByService: Record<ServiceType, number> = {
    office: 5000, // жишээ ₮/м²
    public: 6500,
    sokh: 4500,
  }

  // Extras fixed prices
  const extrasPrices: Record<string, number> = {
    deepClean: 80000,
    fridge: 25000,
    windows: 60000,
  }

  // Frequency discount (positive = discount fraction)
  const frequencyDiscount: Record<OrderItem['frequency'], number> = {
    'one-time': 0,
    weekly: 0.15,    // 15% discount for weekly recurring
    biweekly: 0.10,
    monthly: 0.05,
  }

  // Floors surcharge: 5% per extra floor above 1 (can adjust)
  const floorSurchargePercent = (floors: number) => {
    if (floors <= 1) return 0
    return Math.min(0.20, 0.05 * (floors - 1)) // cap 20%
  }

  // Rooms extra flat fee per room
  const roomExtraFee = (rooms: number) => {
    if (rooms <= 1) return 0
    return (rooms - 1) * 5000 // ₮ per extra room (adjust)
  }

  const extraSelectedList = useMemo(
    () => Object.entries(extras).filter(([, v]) => v).map(([k]) => k),
    [extras]
  )

  // Compute unit price for one session (before sessions multiplication)
  const unitPrice = useMemo(() => {
    const baseRate = baseRateByService[serviceType]
    const base = baseRate * Math.max(0, area) // area * rate

    // floor surcharge (percentage)
    const floorPct = floorSurchargePercent(floors)
    const floorAdd = base * floorPct

    // rooms flat add
    const roomsAdd = roomExtraFee(rooms)

    // extras fixed sum
    const extrasAdd = extraSelectedList.reduce((sum, key) => sum + (extrasPrices[key] || 0), 0)

    // subtotal before discount
    const subtotal = base + floorAdd + roomsAdd + extrasAdd

    // frequency discount
    const discount = frequencyDiscount[frequency] || 0
    const discounted = subtotal * (1 - discount)

    // unit price rounded
    return Math.max(0, Math.round(discounted))
  }, [serviceType, area, floors, rooms, extras, frequency])

  const totalForLine = useMemo(() => {
    return unitPrice * Math.max(1, sessions)
  }, [unitPrice, sessions])

  function toggleExtra(key: string) {
    setExtras(prev => ({ ...prev, [key]: !prev[key] }))
  }

  function addToCart() {
    const item: OrderItem = {
      id: String(Date.now()),
      serviceType,
      area,
      floors,
      rooms,
      extras: extraSelectedList,
      frequency,
      sessions: Math.max(1, sessions),
      unitPrice,
      totalPrice: totalForLine,
      notes,
    }
    setCart(prev => [item, ...prev])
    // reset notes/sessions if wanted
    setNotes('')
    setSessions(1)
  }

  function removeItem(id: string) {
    setCart(prev => prev.filter(it => it.id !== id))
  }

  const grandTotal = cart.reduce((s, it) => s + it.totalPrice, 0)

  return (
    <aside className="w-full md:w-96 bg-white border border-gray-100 rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-2">Үнийн тооцоолол</h3>
      <p className="text-sm text-gray-500 mb-4">Үйлчилгээ, талбай, давхар, өрөө, нэмэлт сонгон үнэ бодно.</p>

      <div className="space-y-3">
        <label className="block text-sm">Үйлчилгээ</label>
        <select
          value={serviceType}
          onChange={e => setServiceType(e.target.value as ServiceType)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="office">Office (Оффис)</option>
          <option value="public">Public space (Олон нийтийн талбай)</option>
          <option value="sokh">СӨХ (Condo common areas)</option>
        </select>

        <label className="block text-sm">Талбай (м²)</label>
        <input
          type="number"
          min={1}
          value={area}
          onChange={e => setArea(Number(e.target.value))}
          className="w-full border rounded px-3 py-2"
        />

        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-sm">Давхар</label>
            <input
              type="number"
              min={1}
              value={floors}
              onChange={e => setFloors(Math.max(1, Number(e.target.value)))}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm">Өрөө (тоо)</label>
            <input
              type="number"
              min={1}
              value={rooms}
              onChange={e => setRooms(Math.max(1, Number(e.target.value)))}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Нэмэлт үйлчилгээ</label>
          <div className="flex flex-col gap-2">
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={extras.deepClean} onChange={() => toggleExtra('deepClean')} />
              <span>Гүн цэвэрлэгээ (Deep clean) — ₮{extrasPrices.deepClean.toLocaleString()}</span>
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={extras.fridge} onChange={() => toggleExtra('fridge')} />
              <span>Хөргөгч/шинэхэн (Fridge) — ₮{extrasPrices.fridge.toLocaleString()}</span>
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={extras.windows} onChange={() => toggleExtra('windows')} />
              <span>Цонх угаах (Windows) — ₮{extrasPrices.windows.toLocaleString()}</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm">Давтамж</label>
          <select value={frequency} onChange={e => setFrequency(e.target.value as OrderItem['frequency'])} className="w-full border rounded px-3 py-2">
            <option value="one-time">Нэг удаа</option>
            <option value="weekly">Долоо хоног бүр (Weekly) — 15% хөнгөлөлт</option>
            <option value="biweekly">2 долоо хоног тутам (Biweekly) — 10% хөнгөлөлт</option>
            <option value="monthly">Сараар (Monthly) — 5% хөнгөлөлт</option>
          </select>
        </div>

        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <label className="block text-sm">Хэд удаа (sessions)</label>
            <input type="number" min={1} value={sessions} onChange={e => setSessions(Math.max(1, Number(e.target.value)))} className="w-full border rounded px-3 py-2" />
          </div>

          <div className="flex-1">
            <label className="block text-sm">Тооцоолсон нэг удаагийн үнэ</label>
            <div className="px-3 py-2 bg-gray-50 rounded text-right font-medium">₮ {unitPrice.toLocaleString()}</div>
          </div>
        </div>

        <div>
          <label className="block text-sm">Нэмэлт тэмдэглэл (сонголт)</label>
          <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Жишээ: Байршил, тусгай шаардлага..." className="w-full border rounded px-3 py-2" />
        </div>

        <div className="flex gap-2">
          <button onClick={addToCart} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded">
            Сагсанд нэмэх — ₮ {totalForLine.toLocaleString()}
          </button>
          <button onClick={() => { setArea(50); setFloors(1); setRooms(1); setExtras({ deepClean: false, fridge: false, windows: false }); setFrequency('one-time'); setSessions(1); setNotes('') }} className="px-4 py-2 border rounded">
            Reset
          </button>
        </div>
      </div>

      {/* CART */}
      <div className="mt-4">
        <h4 className="text-sm font-semibold">Захиалгын хураангуй</h4>
        {cart.length === 0 ? (
          <p className="text-xs text-gray-500 mt-2">Сагсанд мөр байхгүй</p>
        ) : (
          <div className="space-y-3 mt-3">
            {cart.map(item => (
              <div key={item.id} className="border rounded p-3 bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm font-medium">{item.serviceType.toUpperCase()} — {item.area} м²</div>
                    <div className="text-xs text-gray-600">{item.floors} давхар · {item.rooms} өрөө · {item.sessions} удаа</div>
                    {item.extras.length > 0 && <div className="text-xs text-gray-600">Нэмэлт: {item.extras.join(', ')}</div>}
                  </div>
                  <div className="text-sm font-semibold">₮ {item.totalPrice.toLocaleString()}</div>
                </div>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => removeItem(item.id)} className="text-xs text-red-600">Устгах</button>
                </div>
              </div>
            ))}

            <div className="pt-2 border-t flex items-center justify-between">
              <div className="text-sm font-medium">Нийт</div>
              <div className="text-lg font-bold">₮ {grandTotal.toLocaleString()}</div>
            </div>

            <div className="mt-3">
              <Link href="/booking" className="block text-center bg-[#102B5A] text-white py-2 rounded">Үргэлжлүүлэх — Захиалах</Link>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
