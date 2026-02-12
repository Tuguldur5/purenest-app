'use client'
import { useCart } from '../context/CartContext'
import { Trash2, Plus, Minus, ArrowLeft, CheckCircle, ArrowRight, ShoppingBag, Truck, MapPin, User, Phone } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSiteToast } from "@/app/hooks/useSiteToast";

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, clearCart } = useCart()
    const { showToast } = useSiteToast()
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    const [userInfo, setUserInfo] = useState({
        full_name: '',
        phone_number: '',
        address: ''
    })

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUserInfo({
                full_name: parsedUser.full_name || '',
                phone_number: parsedUser.phone || '',
                address: parsedUser.address || ''
            });
        }
    }, []);

    const subtotal = cart.reduce((sum: number, item: any) => sum + (Number(item.price) * (item.quantity || 1)), 0)
    const deliveryFee = subtotal > 500000 ? 0 : 5000
    const totalPrice = subtotal + deliveryFee

    const handleOrder = async () => {
        if (!userInfo.full_name || !userInfo.phone_number || !userInfo.address) {
            showToast({ title: "Мэдээлэл дутуу", description: "Хүргэлтийн мэдээллээ бүрэн бөглөнө үү." });
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('user') || '{}'); // Хэрэглэгчийн мэйлийг авах

            const response = await fetch('https://purenest-app.onrender.com/api/product-orders/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    full_name: userInfo.full_name,
                    phone_number: userInfo.phone_number,
                    address: userInfo.address,
                    email: user.email || '', // Бэкэнд email хүлээж авч байгаа тул заавал өгөх
                    total_amount: totalPrice,
                    items: cart.map((item: any) => ({
                        id: item.id,
                        quantity: item.quantity,
                        price: Number(item.price), // Бэкэнд үүнийг item.price-оор авч байгаа
                        name: item.name // Мэйл илгээхэд 'i.name' гэж ашигласан байгаа
                    }))
                }),
            });

            // 1. Хариулт JSON мөн эсэхийг шалгах
            const contentType = response.headers.get("content-type");

            if (contentType && contentType.includes("application/json")) {
                const result = await response.json();

                if (response.ok) {
                    setSent(true);
                    clearCart();
                    showToast({ title: "Амжилттай", description: "Таны захиалга бүртгэгдлээ." });
                } else {
                    throw new Error(result.error || "Сервер алдаа заалаа.");
                }
            } else {
                // 2. Хэрэв HTML ирвэл текстийг нь уншиж консол дээр хэвлэх (Энэ нь жинхэнэ алдааг харуулна)
                const errorHtml = await response.text();
                console.error("Серверийн хариу (HTML):", errorHtml);
                throw new Error(`Серверээс JSON биш хариу ирлээ (${response.status}). URL буруу эсвэл сервер унасан байна.`);
            }

        } catch (error: any) {
            console.error("Захиалгын алдаа:", error);
            showToast({ title: "Алдаа", description: error.message });
        } finally {
            setLoading(false);
        }
    };
    if (sent) return (
        <div className="min-h-[80vh] flex items-center justify-center bg-white px-4">
            <div className="text-center max-w-7xl animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Захиалга баталгаажлаа</h2>
                <p className="text-gray-500 mb-8">Тун удахгүй бид тантай холбогдох болно.</p>
                <Link href="/products" className="inline-flex items-center justify-center px-8 py-3 bg-[#102B5A] text-white rounded-xl font-bold hover:shadow-lg transition-all">
                    Буцах
                </Link>
            </div>
        </div>
    )

    return (
        <div className="bg-[#FBFCFD] min-h-screen pt-28 pb-20 px-4">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                    <div className="mt-10 flex flex-cols container justify-between">

                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Миний сагс</h1>
                        <Link href="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-black transition-colors mb-2">
                            <ArrowLeft size={16} /> Үргэлжлүүлэн үзэх
                        </Link>
                    </div>

                </div>

                {cart.length === 0 ? (
                    <div className="bg-white rounded-3xl py-24 text-center border border-gray-100 shadow-sm">
                        <ShoppingBag size={48} className="mx-auto text-gray-200 mb-4" />
                        <p className="text-gray-400 font-medium text-lg">Таны сагс одоогоор хоосон байна.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                        {/* LEFT: PRODUCTS */}
                        <div className="lg:col-span-8 xl:col-span-8 space-y-4 mb-5">
                            {cart.map((item: any) => (
                                <div key={item.id} className="relative bg-white p-2 pr-4 md:p-6 rounded-[14px] flex items-center gap-6 group hover:shadow-xl hover:border-gray-300 transition-all duration-300">

                                    <div className="w-24 h-24 md:w-28 md:h-28 bg-[#F9FAFB] rounded-xl overflow-hidden flex-shrink-0 p-3">
                                        <img src={item.image_url} className="w-full h-full object-contain rounded-sm mix-blend-multiply group-hover:scale-110 transition-transform duration-500" alt="" />
                                    </div>

                                    <div className="flex-grow flex flex-col justify-between h-24 md:h-28 py-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{item.type}</h4>
                                                <h3 className="font-bold text-gray-800 text-base md:text-lg leading-tight line-clamp-1">{item.name}</h3>
                                                <span className="text-[11px] font-bold text-gray-300 uppercase mt-0.5 inline-block tracking-tight">ID: {item.code}</span>
                                            </div>
                                            <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-lg transition-all">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>

                                        <div className="flex justify-between items-end">
                                            <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-100">
                                                <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md transition-all text-gray-500"><Minus size={14} /></button>
                                                <span className="w-8 text-center font-bold text-sm text-gray-900">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md transition-all text-gray-500"><Plus size={14} /></button>
                                            </div>
                                            <p className="text-lg md:text-xl font-extrabold text-[#102B5A]">{(Number(item.price) * item.quantity).toLocaleString()}₮</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* RIGHT: CHECKOUT */}
                        <div className="lg:col-span-4 xl:col-span-4 lg:sticky lg:top-28 text-black">
                            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-8">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 mb-6">Захиалгын хураангуй</h2>
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-sm text-gray-500">
                                            <span>Барааны дэд дүн</span>
                                            <span className="font-bold text-gray-900">{subtotal.toLocaleString()}₮</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-500">
                                            <span className="flex items-center gap-2"><Truck size={16} /> Хүргэлт</span>
                                            <span className={deliveryFee === 0 ? "text-green-500 font-bold" : "text-gray-900 font-bold"}>
                                                {deliveryFee === 0 ? "Үнэгүй" : `${deliveryFee.toLocaleString()}₮`}
                                            </span>
                                        </div>
                                        <div className="h-px bg-gray-100 my-2" />
                                        <div className="flex justify-between items-end">
                                            <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Нийт төлөх</span>
                                            <span className="text-2xl font-black text-[#102B5A] tracking-tight">{totalPrice.toLocaleString()}₮</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Хүргэлтийн мэдээлэл</h3>
                                    <div className="space-y-2">
                                        <input
                                            type="text" placeholder="Хүлээн авагчийн нэр"
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 px-4 outline-none focus:ring-2 focus:ring-blue-600/5 focus:bg-white transition-all text-sm font-medium"
                                            value={userInfo.full_name}
                                            onChange={(e) => setUserInfo({ ...userInfo, full_name: e.target.value })}
                                        />
                                        <input
                                            type="text" placeholder="Утасны дугаар"
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 px-4 outline-none focus:ring-2 focus:ring-blue-600/5 focus:bg-white transition-all text-sm font-medium"
                                            value={userInfo.phone_number}
                                            onChange={(e) => setUserInfo({ ...userInfo, phone_number: e.target.value })}
                                        />
                                        <textarea
                                            placeholder="Хүргэлтийн дэлгэрэнгүй хаяг..."
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 px-4 outline-none focus:ring-2 focus:ring-blue-600/5 focus:bg-white transition-all text-sm font-medium min-h-[100px] resize-none"
                                            value={userInfo.address}
                                            onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleOrder}
                                    disabled={loading}
                                    className="w-full bg-[#102B5A] text-white py-4 rounded-xl font-bold text-sm  hover:bg-blue-900 hover:text-emerald-00 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-blue-900/10"
                                >
                                    {loading ? "Түр хүлээнэ үү..." : <>Захиалга баталгаажуулах <ArrowRight size={18} /></>}
                                </button>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    )
}