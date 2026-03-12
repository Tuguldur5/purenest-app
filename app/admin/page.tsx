'use client';
import OrderCalendar from "./../components/OrderCalendar";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLayout() {
    const router = useRouter();
    const [serviceOrders, setServiceOrders] = useState([]); // Үйлчилгээний захиалгууд
    const [productOrders, setProductOrders] = useState([]); // Барааны захиалгууд
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const role = localStorage.getItem("userRole");
        if (role !== 'admin') {
            router.push('/');
        }
    }, [router]);

    useEffect(() => {
        async function loadAllData() {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/login");
                return;
            }

            try {
                // Хоёр API-г зэрэг дуудах (Хурдтай)
                const [serviceRes, productRes] = await Promise.all([
                    fetch("https://purenest-app.onrender.com/api/admin/orders", {
                        headers: { "Authorization": `Bearer ${token}` }
                    }),
                    fetch("https://purenest-app.onrender.com/api/admin/product-orders", { // Барааны захиалгын API хаяг
                        headers: { "Authorization": `Bearer ${token}` }
                    })
                ]);

                const serviceData = await serviceRes.json();
                const productData = await productRes.json();

                // Service orders set хийх
                if (serviceRes.ok) {
                    setServiceOrders(serviceData.orders || []);
                }

                // Product orders set хийх
                if (productRes.ok) {
                    setProductOrders(productData.orders || productData.productOrders || []);
                }

            } catch (e) {
                console.error("Data load error:", e);
            } finally {
                setLoading(false);
            }
        }
        loadAllData();
    }, [router]);

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Хяналтын самбар</h1>
                    <p className="text-slate-500 mt-1">Бүх захиалгын нэгдсэн календарь</p>
                </div>
            </header>

            {loading ? (
                <div className="flex flex-col items-center justify-center p-20 space-y-4">
                    <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-400 font-medium animate-pulse">Мэдээллийг шинэчилж байна...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {/* Календарь компонент руу хоёр массиваа дамжуулна */}
                    <OrderCalendar 
                        orders={serviceOrders} 
                        productOrders={productOrders} 
                    />
                </div>
            )}
        </div>
    );
}