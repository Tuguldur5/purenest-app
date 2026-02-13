'use client'
import { useState, useEffect } from 'react'
import { ImagePlus, Trash2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

// Төрлүүдийг тодорхойлох
interface Order {
    id: number;
    service: string;
    address: string;
    status: string;
}

interface Report {
    description: string;
    images: string[];
}

export default function OrderReportPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [description, setDescription] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    const API_BASE = 'https://purenest-app.onrender.com/api';

    // 1. Захиалгуудыг татаж ирэх
    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setFetchLoading(true);
        const token = localStorage.getItem('token');
        try {
            // Backend-ийн endpoint-оо /admin/orders эсвэл /orders алин болохыг нягтлаарай
            const res = await fetch(`${API_BASE}/admin/orders`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            
            if (Array.isArray(data)) {
                setOrders(data);
            } else if (data.orders && Array.isArray(data.orders)) {
                setOrders(data.orders);
            }
        } catch (err) {
            console.error("Orders татахад алдаа гарлаа:", err);
        } finally {
            setFetchLoading(false);
        }
    };

    // 2. Сонгосон захиалга дээр тайлан байгаа эсэхийг шалгах
    const handleOrderSelect = async (order: Order) => {
        setSelectedOrder(order);
        setLoading(true);
        const token = localStorage.getItem('token');

        try {
            const res = await fetch(`${API_BASE}/reports/${order.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (res.ok) {
                const data = await res.json();
                if (data && data.description) {
                    setDescription(data.description);
                    // Хэрэв images нь string хэлбэрээр ирвэл JSON.parse хийнэ
                    setImages(typeof data.images === 'string' ? JSON.parse(data.images) : data.images);
                    setIsEditing(true);
                }
            } else {
                // Тайлан олдохгүй бол шинээр үүсгэх горим
                setDescription('');
                setImages([]);
                setIsEditing(false);
            }
        } catch (error) {
            console.error("Report check error:", error);
            setDescription('');
            setImages([]);
            setIsEditing(false);
        } finally {
            setLoading(false);
        }
    };

    // 3. Зургийг Base64 формат руу хөрвүүлж хадгалах
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImages(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    }

    // 4. Тайлан илгээх (POST эсвэл PUT)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedOrder) return;
        if (images.length < 3) return alert("Заавал 3 болон түүнээс дээш зураг оруулна уу!");

        setLoading(true);
        const token = localStorage.getItem('token');
        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing 
            ? `${API_BASE}/reports/${selectedOrder.id}` 
            : `${API_BASE}/reports`;

        try {
            const res = await fetch(url, {
                method: method,
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    order_id: selectedOrder.id, 
                    description, 
                    images: images // Backend дээр JSON.stringify хийгдэх эсэхийг шалгаарай
                })
            });

            if (res.ok) {
                alert(isEditing ? "Тайлан амжилттай шинэчлэгдлээ!" : "Тайлан хадгалагдлаа! Захиалга дууссан төлөвт шилжлээ.");
                fetchOrders(); // Жагсаалтыг шинэчлэх
            } else {
                const errData = await res.json();
                alert(errData.message || "Алдаа гарлаа.");
            }
        } catch (error) {
            alert("Сервертэй холбогдоход алдаа гарлаа.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6 min-h-screen">
            
            {/* ЗҮҮН ТАЛ: Захиалгын жагсаалт */}
            <div className="md:col-span-1 bg-white p-4 rounded-xl border shadow-sm h-[800px] flex flex-col">
                <h3 className="font-bold mb-4 text-[#102B5A] flex items-center gap-2 border-b pb-2">
                    <AlertCircle size={20} className="text-blue-600" /> Идэвхтэй захиалгууд
                </h3>
                
                {fetchLoading ? (
                    <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-600" /></div>
                ) : (
                    <div className="space-y-3 overflow-y-auto pr-2">
                        {orders.length === 0 && <p className="text-gray-400 text-center py-10 text-sm">Одоогоор захиалга байхгүй байна.</p>}
                        {orders.map(order => (
                            <div
                                key={order.id}
                                onClick={() => handleOrderSelect(order)}
                                className={`p-4 rounded-lg cursor-pointer border transition-all duration-200 ${
                                    selectedOrder?.id === order.id 
                                    ? 'bg-[#102B5A] text-white border-[#102B5A] shadow-md' 
                                    : 'bg-gray-50 hover:bg-white hover:border-blue-400 border-transparent'
                                }`}
                            >
                                <div className="text-[10px] uppercase tracking-wider opacity-70">Захиалга #{order.id}</div>
                                <div className="font-bold text-sm truncate">{order.service}</div>
                                <div className="text-xs mt-1 opacity-80 truncate">{order.address}</div>
                                <div className={`text-[10px] mt-2 font-bold px-2 py-0.5 rounded-full w-fit ${
                                    order.status === 'Дууссан' ? 'bg-green-500/20 text-green-500' : 'bg-orange-500/20 text-orange-500'
                                }`}>
                                    {order.status}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* БАРУУН ТАЛ: Тайлан бичих */}
            <div className="md:col-span-2">
                {selectedOrder ? (
                    <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-100">
                        <div className="mb-6 border-b pb-4 flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-black text-[#102B5A] tracking-tight">
                                    {isEditing ? 'Тайлан засах' : 'Тайлан илгээх'}
                                </h2>
                                <p className="text-gray-500 text-sm mt-1">
                                    Захиалга: <span className="font-semibold text-gray-700">#{selectedOrder.id} - {selectedOrder.service}</span>
                                </p>
                            </div>
                            {loading && <Loader2 className="animate-spin text-blue-600" />}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                                    Гүйцэтгэлийн тайлбар
                                </label>
                                <textarea
                                    required
                                    placeholder="Гүйцэтгэсэн ажлын дэлгэрэнгүй тайлбарыг энд бичнэ үү..."
                                    className="w-full p-4 border border-gray-200 rounded-xl h-44 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none bg-gray-50"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                                    Зургийн баримтууд <span className="text-red-500 font-normal ml-2">(Багадаа 3 зураг: {images.length}/3)</span>
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {images.map((img, index) => (
                                        <div key={index} className="relative group aspect-square">
                                            <img src={img} className="w-full h-full object-cover rounded-xl border" alt="preview" />
                                            <button
                                                type="button"
                                                onClick={() => setImages(images.filter((_, i) => i !== index))}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    <label className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 hover:border-blue-400 transition-all aspect-square text-gray-400 hover:text-blue-500">
                                        <ImagePlus size={32} strokeWidth={1.5} />
                                        <span className="text-[10px] mt-2 font-medium">Зураг нэмэх</span>
                                        <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || images.length < 3}
                                className="w-full bg-[#102B5A] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-blue-900 transition-all disabled:bg-gray-300 disabled:shadow-none flex justify-center items-center gap-2"
                            >
                                {loading ? "Боловсруулж байна..." : isEditing ? "Өөрчлөлтийг хадгалах" : "Тайлан илгээж, захиалга дуусгах"}
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-gray-400 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center">
                        <div className="bg-white p-6 rounded-full shadow-sm mb-4 text-blue-100">
                             <CheckCircle2 size={64} strokeWidth={1} className="text-gray-200" />
                        </div>
                        <h3 className="text-gray-600 font-bold text-lg">Захиалга сонгоогүй байна</h3>
                        <p className="max-w-xs text-sm mt-2">Зүүн талын жагсаалтаас тайлан бичих захиалгаа сонгож ажлаа баталгаажуулна уу.</p>
                    </div>
                )}
            </div>
        </div>
    )
}