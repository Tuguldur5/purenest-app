'use client'
import { useCart } from '../context/CartContext'
import { Trash2, Plus, Minus, ArrowLeft, CheckCircle, ArrowRight, ShoppingBag, Truck, Heart, Trash } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSiteToast } from "@/app/hooks/useSiteToast";

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, clearCart, addToWishlist, } = useCart()
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

    const saveAllToWishlist = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            showToast({ title: "Нэвтрэнэ үү", description: "Хадгалахын тулд нэвтрэх хэрэгтэй." });
            return;
        }

        const productIds = cart.map((item: any) => item.id);

        try {
            setLoading(true);
            const res = await fetch('https://purenest-app.onrender.com/api/wishlist/bulk-add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ product_ids: productIds })
            });

            if (res.ok) {
                showToast({
                    title: "Амжилттай",
                    description: "Сагсанд байсан бүх барааг Wishlist-д хадгаллаа."
                });
                // Хэрэв хүсвэл хадгалсных нь дараа сагсыг нь хоосолж болно:
                // clearCart(); 
            }
        } catch (err) {
            showToast({ title: "Алдаа", description: "Хадгалж чадсангүй." });
        } finally {
            setLoading(false);
        }
    };

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
        <div className="bg-[#F8F9FB] min-h-screen pb-20 px-4 text-black">
            <div className="container max-w-8xl px-4 mx-auto mt-10">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-gray-100 pb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Миний сагс</h1>
                            <span className="text-[#102B5A] mt-2 text-md font-bold p-1 px-2">{cart.length}  Бараа </span>
                        </div>
                        <Link href="/products" className="text-gray-400 hover:text-[#102B5A] flex items-center gap-2 text-sm font-medium transition-all">
                            <ArrowLeft size={16} /> Дэлгүүр рүү буцах
                        </Link>
                    </div>
                  <div className="flex flex-wrap gap-3">
                        {cart.length > 0 && (  <button
                            onClick={saveAllToWishlist}
                            className="flex items-center gap-2 text-[#102B5A] hover:bg-blue-50 px-4 py-2 rounded-xl transition-all text-sm font-bold border border-blue-100"
                        >
                            <Heart size={16} className="fill-current" /> Бүгдийг хадгалах
                        </button>
                        )}

                    {cart.length > 0 && (
                        <button
                            onClick={() => { if (confirm('Сагсаа хоослох уу?')) clearCart() }}
                            className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition-all text-sm font-bold"
                        >
                            <Trash size={16} /> Сагс хоослох
                        </button>
                    )}
                </div>
                </div>

                {cart.length === 0 ? (
                    <div className="bg-white rounded-[32px] py-20 text-center rounded-lg border border-dashed border-gray-200 shadow-sm">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                            <ShoppingBag size={40} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Таны сагс хоосон байна</h2>
                        <Link href="/products" className="text-[#102B5A] font-bold hover:underline">Одоо дэлгүүр хэсэх</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                        {/* LEFT: PRODUCTS LIST */}
                        <div className="lg:col-span-8 space-y-4">
                            {cart.map((item: any) => (
                                <div key={item.id} className="bg-white p-4 rounded-3xl flex flex-col sm:flex-row items-center gap-6  transition-all">
                                    {/* Image Container - Fixed Aspect Ratio */}
                                    <div className="w-32 h-32 bg-[#F9FAFB] rounded-2xl overflow-hidden flex-shrink-0 p-2">
                                        <img src={item.image_url} className="w-full h-full object-contain mix-blend-multiply" alt={item.name} />
                                    </div>

                                    <div className="flex-grow w-full">
                                        <div className="flex justify-between items-start mb-2">
                                           
                                            <div>
                                                 <p className="text-sm font-sanserif text-black font-bold">{item.type}</p>
                                                <h3 className="font-bold text-[#102b5a] text-lg leading-tight mb-1">{item.name}</h3>
                                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">ID: {item.code}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        addToWishlist?.(item); // Хадгалах функц
                                                        showToast({ title: "Хадгалагдлаа", description: "Хүслийн жагсаалтанд нэмэгдлээ" });
                                                    }}
                                                    className="p-2.5 text-gray-300 hover:text-pink-500 hover:bg-pink-50 rounded-xl transition-all"
                                                    title="Хадгалах"
                                                >
                                                    <Heart size={20} />
                                                </button>
                                                <button onClick={() => removeFromCart(item.id)} className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center mt-4">
                                            <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                                                <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="w-9 h-9 flex items-center justify-center hover:bg-white rounded-lg transition-all text-gray-500"><Minus size={16} /></button>
                                                <span className="w-10 text-center font-bold text-gray-900">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-9 h-9 flex items-center justify-center hover:bg-white rounded-lg transition-all text-gray-500"><Plus size={16} /></button>
                                            </div>
                                            <p className="text-xl font-black text-[#102B5A]">{(Number(item.price) * item.quantity).toLocaleString()}₮</p>
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