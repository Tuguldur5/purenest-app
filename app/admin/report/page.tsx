'use client'
import { useState, useEffect, useRef, useMemo } from 'react'
import { 
    Trash2, CheckCircle2, AlertCircle, Loader2, Save, XCircle, 
    ImagePlus, Maximize2, Search, FileCheck2, FileWarning 
} from 'lucide-react'

interface Order {
    id: number;
    service: string;
    address: string;
    status: string;
    hasReport?: boolean; // Backend-ээс ирэх утга
}

export default function OrderReportPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const [description, setDescription] = useState('')
    const [images, setImages] = useState<string[]>([])
    const [zoomImage, setZoomImage] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [fetchLoading, setFetchLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const API_BASE = 'https://purenest-app.onrender.com/api'

    // Анх удаа ачаалахад захиалгууд татах
    useEffect(() => { fetchOrders() }, [])

    const fetchOrders = async () => {
        setFetchLoading(true)
        const token = localStorage.getItem('token')
        try {
            const res = await fetch(`${API_BASE}/admin/orders`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            const data = await res.json()
            
            // Backend-ээс ирж буй бүтцээс хамаарч датаг авах
            let allOrders = Array.isArray(data) ? data : (data.orders || [])
            
            // Зөвхөн "Дууссан" төлөвтэй захиалгуудыг шүүх
            const completed = allOrders.filter((o: any) => o.status === 'Дууссан')
            setOrders(completed)
        } catch (err) {
            console.error("Orders татахад алдаа:", err)
        } finally { setFetchLoading(false) }
    }

    // Хайлтаар шүүгдсэн жагсаалт
    const filteredOrders = useMemo(() => {
        return orders.filter(order => 
            order.id.toString().includes(searchTerm) || 
            order.service.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [searchTerm, orders])

    // Зураг оруулах (Preview үүсгэх)
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        files.forEach(file => {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImages(prev => [...prev, reader.result as string])
            }
            reader.readAsDataURL(file)
        })
    }

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index))
    }

    // Захиалга сонгох үед тухайн захиалгын тайлан байгаа эсэхийг шалгах
    const handleOrderSelect = async (order: Order) => {
        setSelectedOrder(order)
        setLoading(true)
        setImages([])
        setDescription('')
        
        const token = localStorage.getItem('token')
        try {
            const res = await fetch(`${API_BASE}/report/${order.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.ok) {
                const data = await res.json()
                if (data && data.description) {
                    setDescription(data.description || '')
                    setImages(data.images || [])
                    setIsEditing(true)
                } else {
                    setIsEditing(false)
                }
            } else { 
                setIsEditing(false) 
            }
        } catch (error) { 
            setIsEditing(false) 
        } finally { setLoading(false) }
    }

    // Тайлан хадгалах (POST)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedOrder) return
        if (images.length < 3) return alert("Багадаа 3 зураг оруулна уу!")

        setLoading(true)
        const token = localStorage.getItem("token")

        try {
            const res = await fetch(`${API_BASE}/report`, {
                method: 'POST', 
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify({
                    order_id: selectedOrder.id,
                    description,
                    images: images
                })
            })

            if (res.ok) {
                alert("Амжилттай хадгалагдлаа!")
                // Орон нутгийн (State) жагсаалтыг шинэчлэх - Дахин API дуудахгүйгээр
                setOrders(prev => prev.map(o => 
                    o.id === selectedOrder.id ? { ...o, hasReport: true } : o
                ))
                setIsEditing(true)
            }
        } catch (error) {
            alert("Алдаа гарлаа.")
        } finally { setLoading(false) }
    }

    return (
        <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 md:grid-cols-10 gap-6 min-h-screen font-sans bg-slate-50/50">
            
            {/* ЗҮҮН ТАЛ: Захиалгын жагсаалт */}
            <div className="md:col-span-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm h-[800px] flex flex-col">
                <div className="mb-4">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2 border-b pb-3 px-2 text-lg">
                        <CheckCircle2 size={20} className="text-emerald-500" /> Дууссан захиалгууд
                    </h3>
                    
                    <div className="relative mt-4 px-2">
                        <Search className="absolute left-5 top-1/2 ml-2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text"
                            placeholder="Захиалгын ID..."
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {fetchLoading ? (
                    <div className="flex flex-col items-center justify-center flex-1 gap-3">
                        <Loader2 className="animate-spin text-indigo-600" size={32} />
                        <span className="text-xs text-slate-400 font-medium italic">Ачаалж байна...</span>
                    </div>
                ) : (
                    <div className="space-y-2 overflow-y-auto pr-2 custom-scrollbar flex-1">
                        {filteredOrders.length > 0 ? filteredOrders.map(order => {
                            const isSelected = selectedOrder?.id === order.id;
                            return (
                                <div
                                    key={order.id}
                                    onClick={() => handleOrderSelect(order)}
                                    className={`p-4 rounded-xl cursor-pointer border transition-all duration-200 relative ${
                                        isSelected
                                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100'
                                        : 'bg-white hover:bg-slate-50 border-slate-100 text-slate-700'
                                    }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className={`text-[10px] font-bold uppercase tracking-tighter ${isSelected ? 'text-indigo-100' : 'text-emerald-500'}`}>
                                            Захиалга #{order.id}
                                        </div>
                                        
                                        {/* HAS REPORT LOGIC */}
                                        {order.hasReport ? (
                                            <div className={`${isSelected ? 'bg-white/20' : 'bg-emerald-100'} p-1 rounded-md text-emerald-500`} title="Тайлан орсон">
                                                <FileCheck2 size={16} className={isSelected ? 'text-white' : ''} />
                                            </div>
                                        ) : (
                                            <div className={`${isSelected ? 'bg-white/10' : 'bg-amber-100'} p-1 rounded-md text-amber-600`} title="Тайлан дутуу">
                                                <FileWarning size={16} className={isSelected ? 'text-white animate-pulse' : ''} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="font-bold text-sm truncate mt-1">{order.service}</div>
                                    <div className={`text-[11px] mt-1 truncate ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                                        {order.address}
                                    </div>
                                </div>
                            )
                        }) : (
                            <div className="text-center py-20 text-slate-400 text-sm italic">Илэрц олдсонгүй</div>
                        )}
                    </div>
                )}
            </div>

            {/* БАРУУН ТАЛ: Тайлан бичих талбар */}
            <div className="md:col-span-7">
                {selectedOrder ? (
                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 min-h-[800px]">
                        {loading && !isEditing ? (
                             <div className="flex flex-col items-center justify-center h-full py-40 gap-4">
                                <Loader2 className="animate-spin text-indigo-600" size={48} />
                                <p className="text-slate-500 font-medium">Тайлангийн мэдээллийг шалгаж байна...</p>
                             </div>
                        ) : (
                            <>
                                <div className="mb-8 flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                                                {isEditing ? 'Тайлан засах' : 'Тайлан үүсгэх'}
                                            </h2>
                                            {isEditing && (
                                                <span className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-black rounded-full ">
                                                    Илгээсэн
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-slate-500 font-semibold mt-1">
                                            Захиалга #{selectedOrder.id} • {selectedOrder.service}
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => setSelectedOrder(null)}
                                        className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                                    >
                                        <XCircle size={24} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-slate-400  px-1">Гүйцэтгэлийн дэлгэрэнгүй тайлбар</label>
                                        <textarea
                                            required
                                            className="w-full p-6 bg-slate-50 border border-slate-200 rounded-2xl h-48 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none text-slate-700 font-medium text-lg leading-relaxed"
                                            placeholder="Ажлын үр дүнг энд дэлгэрэнгүй бичнэ үү..."
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center px-1">
                                            <label className="text-xs font-bold text-slate-400 u">Гүйцэтгэлийн зургууд</label>
                                            <span className={`text-xs font-bold ${images.length < 3 ? 'text-rose-500' : 'text-emerald-500'}`}>
                                                {images.length}/10 зураг
                                            </span>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                            {/* Зураг нэмэх товч */}
                                            <div 
                                                onClick={() => fileInputRef.current?.click()}
                                                className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-400 hover:text-indigo-500 cursor-pointer transition-all bg-slate-50 group"
                                            >
                                                <ImagePlus size={32} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                                                <span className="text-[10px] font-bold mt-2 r">Зураг нэмэх</span>
                                                <input 
                                                    type="file" 
                                                    hidden 
                                                    multiple 
                                                    accept="image/*" 
                                                    ref={fileInputRef} 
                                                    onChange={handleFileChange} 
                                                />
                                            </div>

                                            {/* Зургийн жагсаалт */}
                                            {images.map((img, idx) => (
                                                <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden group border border-slate-100 shadow-sm shadow-slate-200">
                                                    <img src={img} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="Report Preview" />
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                        <button type="button" onClick={() => setZoomImage(img)} className="p-2 bg-white rounded-full text-slate-900 shadow-lg hover:scale-110 transition-transform"><Maximize2 size={16} /></button>
                                                        <button type="button" onClick={() => removeImage(idx)} className="p-2 bg-rose-500 rounded-full text-white shadow-lg hover:scale-110 transition-transform"><Trash2 size={16} /></button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {images.length < 3 && (
                                            <p className="text-rose-500 text-[11px] font-bold flex items-center gap-1 mt-2">
                                                <AlertCircle size={12} /> Хамгийн багадаа 3 зураг оруулах шаардлагатай.
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading || images.length < 3}
                                        className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-bold text-xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 active:translate-y-0 transition-all disabled:bg-slate-200 disabled:shadow-none disabled:translate-y-0 flex justify-center items-center gap-3"
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : <Save size={24} />}
                                        {isEditing ? "Тайланг шинэчлэх" : "Тайлан илгээх"}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="h-full min-h-[700px] flex flex-col items-center justify-center bg-white border-2 border-dashed border-slate-200 rounded-[40px] p-12 text-center shadow-inner">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                            <FileCheck2 size={48} strokeWidth={1} className="text-slate-300" />
                        </div>
                        <h3 className="text-slate-800 font-black text-2xl tracking-tight">Захиалга сонгоно уу</h3>
                        <p className="text-slate-400 mt-2 max-w-xs font-medium leading-relaxed">
                            Тайлан илгээх эсвэл засахын тулд зүүн талын жагсаалтаас нэг захиалга дээр дарна уу.
                        </p>
                    </div>
                )}
            </div>

            {/* Зураг Zoom Modal */}
            {zoomImage && (
                <div 
                    className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
                    onClick={() => setZoomImage(null)}
                >
                    <img 
                        src={zoomImage} 
                        className="max-w-[95vw] max-h-[95vh] rounded-xl shadow-2xl animate-in zoom-in-95 duration-300 object-contain" 
                        alt="Zoomed" 
                    />
                    <button className="absolute top-10 right-10 text-white/50 hover:text-white transition-colors">
                        <XCircle size={48} strokeWidth={1} />
                    </button>
                </div>
            )}
        </div>
    )
}