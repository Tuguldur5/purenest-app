'use client'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/wishlistContext'
import { Trash2, Plus, Minus, ArrowLeft, CheckCircle, ArrowRight, ShoppingBag, Truck, Heart } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSiteToast } from "@/app/hooks/useSiteToast";
import { Product } from '../components/ProductCard'

// 1. Сагсанд зориулсан шинэ төрөл тодорхойлох (Product + quantity)
type CartItem = Product & {
    quantity: number;
};

export default function CartPage() {
    // useCart-аас ирж буй cart-ыг CartItem[] гэж үзнэ
    const { cart, removeFromCart, updateQuantity, clearCart } = useCart()
    const { toggleWishlist, isWishlisted } = useWishlist()
    const { showToast } = useSiteToast()
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    const [userInfo, setUserInfo] = useState({
        full_name: '',
        phone: '',
        address: ''
    })

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUserInfo({
                full_name: parsedUser.full_name || '',
                phone: parsedUser.phone || '',
                address: parsedUser.address || ''
            });
        }
    }, []);

    // subtotal тооцоолохдоо CartItem ашиглана
    const subtotal = cart.reduce((sum: number, item: CartItem) =>
        sum + (Number(item.price) * (item.quantity || 1)), 0
    )
    const deliveryFee = subtotal > 500000 ? 0 : 5000
    const totalPrice = subtotal + deliveryFee

    const handleBulkWishlist = async () => {
        const token = localStorage.getItem('token');
        const productIds = cart.map((item: CartItem) => item.id);

        if (token) {
            try {
                const response = await fetch(`https://purenest-app.onrender.com/api/wishlist/bulk-add`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ product_ids: productIds })
                });

                if (response.ok) {
                    showToast({ title: "Амжилттай", description: "Бүх барааг хадгаллаа." });
                    window.location.reload();
                }
            } catch (error) {
                showToast({ title: "Алдаа", description: "Хадгалахад алдаа гарлаа." });
            }
        } else {
            showToast({ title: "Анхааруулга", description: "Та нэвтэрсэн байх шаардлагатай." });
        }
    };

    const handleOrder = async () => {
        if (!userInfo.full_name || !userInfo.phone || !userInfo.address) {
            showToast({ title: "Мэдээлэл дутуу", description: "Хүргэлтийн мэдээллээ бүрэн бөглөнө үү." });
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('user') || '{}');

            const response = await fetch('https://purenest-app.onrender.com/api/product-orders/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    full_name: userInfo.full_name,
                    phone_number: userInfo.phone,
                    address: userInfo.address,
                    email: user.email || '',
                    total_amount: totalPrice,
                    items: cart.map((item: CartItem) => ({
                        id: item.id,
                        quantity: Number(item.quantity),
                        price: Number(item.price),
                        name: item.name
                    }))
                }),
            });

            if (response.ok) {
                setSent(true);
                clearCart();
                showToast({ title: "Амжилттай", description: "Таны захиалга бүртгэгдлээ." });
            } else {
                const result = await response.json();
                throw new Error(result.error || "Захиалга үүсгэхэд алдаа гарлаа.");
            }
        } catch (error: any) {
            showToast({ title: "Алдаа", description: error.message });
        } finally {
            setLoading(false);
        }
    };

    if (sent) return (
        <div className="min-h-[80vh] flex items-center justify-center bg-white px-4">
            <div className="text-center max-w-md animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} />
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
        <div className="bg-[#F8F9FB] min-h-screen pb-20 px-4">
            <div className="container max-w-6xl mx-auto mt-10">

                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b pb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-3xl font-bold text-gray-900">Миний сагс</h1>
                            <span className="bg-blue-50 text-[#102B5A] text-sm font-bold px-3 py-1 rounded-full">
                                {cart.length} бараа
                            </span>
                        </div>
                        <Link href="/products" className="text-gray-400 hover:text-[#102B5A] flex items-center gap-2 text-sm font-medium transition-all">
                            <ArrowLeft size={16} /> Дэлгүүр рүү буцах
                        </Link>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {cart.length > 0 && (
                            <>
                                <button
                                    onClick={handleBulkWishlist}
                                    className="flex items-center gap-2 text-[#102B5A] hover:bg-blue-50 px-4 py-2 rounded-xl transition-all text-sm font-bold border border-blue-100"
                                >
                                    <Heart size={16} /> Бүгдийг хадгалах
                                </button>
                                <button
                                    onClick={() => { if (confirm('Сагсаа хоослох уу?')) clearCart() }}
                                    className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition-all text-sm font-bold"
                                >
                                    <Trash2 size={16} /> Сагс хоослох
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {cart.length === 0 ? (
                    <div className="bg-white rounded-3xl py-20 text-center border border-dashed border-gray-200 shadow-sm">
                        <ShoppingBag size={48} className="mx-auto text-gray-200 mb-4" />
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Таны сагс хоосон байна</h2>
                        <Link href="/products" className="text-[#102B5A] font-bold hover:underline">Одоо дэлгүүр хэсэх</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-8 space-y-4">
                            {cart.map((item: CartItem) => (
                                <div key={item.id} className="bg-white p-5 rounded-3xl flex flex-col sm:flex-row items-center gap-6 shadow-sm border border-gray-50">
                                    <Link href={`/products/${item.id}`} className="w-28 h-28 bg-[#F9FAFB] rounded-2xl overflow-hidden flex-shrink-0 p-2 hover:opacity-80 transition-opacity">
                                        <img src={item.image_url} className="w-full h-full object-contain" alt={item.name} />
                                    </Link>
                                    <div className="flex-grow w-full">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">#{item.code}</p>

                                                {/* НЭР ДЭЭР ДАРАХАД ҮСРЭХ */}
                                                <Link href={`/products/${item.id}`} className="hover:text-blue-600 transition-colors">
                                                    <h3 className="font-bold text-[#102B5A] text-lg leading-tight mb-1">{item.name}</h3>
                                                </Link>
                                                <p className="text-xs text-gray-400">{(item as any).type}</p>
                                            </div>
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => toggleWishlist(item)}
                                                    className={`p-2 rounded-xl transition-all ${isWishlisted(item.id) ? 'text-red-500 bg-red-50' : 'text-gray-300 hover:bg-gray-50 hover:text-red-400'}`}
                                                >
                                                    <Heart size={20} fill={isWishlisted(item.id) ? "currentColor" : "none"} />
                                                </button>
                                                <button onClick={() => removeFromCart(item.id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center mt-6">
                                            <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                                                <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-500"><Minus size={14} /></button>
                                                <span className="px-4 font-bold text-gray-900 text-sm">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-500"><Plus size={14} /></button>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-[#102B5A]">{(Number(item.price) * item.quantity).toLocaleString()}₮</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="lg:col-span-4">
                            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm sticky top-28">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Захиалгын мэдээлэл</h2>
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-gray-500">
                                        <span>Нийт</span>
                                        <span className="font-bold font-sans text-gray-900">{subtotal.toLocaleString()}₮</span>
                                    </div>
                                    <div className="flex justify-between text-gray-500">
                                        <span className="flex items-center gap-2"><Truck size={16} /> Хүргэлт</span>
                                        <span className={deliveryFee === 0 ? "text-emerald-500 font-bold font-sans" : "text-gray-900 font-sans font-bold"}>
                                            {deliveryFee === 0 ? "Үнэгүй" : `${deliveryFee.toLocaleString()}₮`}
                                        </span>
                                    </div>
                                    <div className="h-px bg-gray-100 my-4" />
                                    <div className="flex justify-between items-end">
                                        <span className="font-bold text-gray-900">Нийт төлөх</span>
                                        <span className="text-2xl font-bold font-sans text-emerald-600">{totalPrice.toLocaleString()}₮</span>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-8 text-black">
                                    <input
                                        type="text" placeholder="Хүлээн авагчийн нэр"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-blue-600/5 focus:bg-white transition-all text-sm"
                                        value={userInfo.full_name}
                                        onChange={(e) => setUserInfo({ ...userInfo, full_name: e.target.value })}
                                    />
                                    <input
                                        type="text" placeholder="Утасны дугаар"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-blue-600/5 focus:bg-white transition-all text-sm"
                                        value={userInfo.phone}
                                        onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                                    />
                                    <textarea
                                        placeholder="Хүргэлтийн хаяг..."
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-blue-600/5 focus:bg-white transition-all text-sm min-h-[80px] resize-none"
                                        value={userInfo.address}
                                        onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
                                    />
                                </div>

                                <button
                                    onClick={handleOrder}
                                    disabled={loading || cart.length === 0}
                                    className="w-full bg-[#102B5A] text-white py-4 rounded-2xl font-bold hover:bg-[#1a3a7a] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {loading ? "Түр хүлээнэ үү..." : <>Захиалга өгөх <ArrowRight size={18} /></>}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}