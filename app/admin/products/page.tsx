'use client'
import { FormEvent, useState, useEffect } from 'react'

export default function AdminProductsPage() {
    const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        image_url: '',
        unit: 'ш',
        price: '',
        type: 'cleaning_tool'
    });

    // --- БАРААНЫ ЖАГСААЛТ ТАТАХ ---
   const fetchProducts = async () => {
    try {
        const res = await fetch('https://purenest-app.onrender.com/api/products');
        const data = await res.json();
        
        // Хэрэв дата массив байвал set хийнэ, үгүй бол хоосон массив өгнө
        if (Array.isArray(data)) {
            setProducts(data);
        } else {
            console.error("Дата массив биш байна:", data);
            setProducts([]); // Алдаанаас сэргийлж хоосон массив болгоно
        }
    } catch (error) {
        console.error("Fetch error:", error);
        setProducts([]);
    }
};

    useEffect(() => {
        if (activeTab === 'list') fetchProducts();
    }, [activeTab]);

    // --- БАРАА УСТГАХ ---
    const handleDelete = async (id: number) => {
        if (!confirm('Энэ барааг устгахдаа итгэлтэй байна уу?')) return;
        try {
            const res = await fetch(`https://purenest-app.onrender.com/api/products/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setProducts(products.filter(p => p.id !== id));
            }
        } catch (error) {
            alert("Устгахад алдаа гарлаа.");
        }
    };

    // --- БАРАА НЭМЭХ ---
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('https://purenest-app.onrender.com/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price)
                }),
            });
            if (response.ok) {
                alert("Бараа амжилттай бүртгэгдлээ!");
                setFormData({ code: '', name: '', image_url: '', unit: 'ш', price: '', type: 'cleaning_tool' });
                setActiveTab('list'); // Нэмсний дараа жагсаалт руу шилжих
            }
        } catch (error) {
            alert("Сервертэй холбогдоход алдаа гарлаа.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* ТАБ СОЛИХ ХЭСЭГ */}
            <div className="flex gap-4 mb-8 border-b">
                <button
                    onClick={() => setActiveTab('list')}
                    className={`pb-2 px-4 transition-all ${activeTab === 'list' ? 'border-b-2 border-[#102B5A] text-[#102B5A] font-bold' : 'text-gray-500'}`}
                >
                    Барааны жагсаалт
                </button>
                <button
                    onClick={() => setActiveTab('add')}
                    className={`pb-2 px-4 transition-all ${activeTab === 'add' ? 'border-b-2 border-[#102B5A] text-[#102B5A] font-bold' : 'text-gray-500'}`}
                >
                    Шинэ бараа нэмэх
                </button>
            </div>

            {/* ЖАГСААЛТ ХЭСЭГ */}
            {activeTab === 'list' && (
                <div className="bg-white shadow-md rounded-xl overflow-hidden border">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
                            <tr>
                                <th className="p-4">Зураг</th>
                                <th className="p-4">Код / Нэр</th>
                                <th className="p-4">Төрөл</th>
                                <th className="p-4">Үнэ</th>
                                <th className="p-4 text-center">Үйлдэл</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {products.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4">
                                        <img src={p.image_url} alt="" className="w-12 h-12 object-cover rounded-md border" />
                                    </td>
                                    <td className="p-4">
                                        <div className="text-xs text-gray-400 font-mono">{p.code}</div>
                                        <div className="font-medium text-gray-800">{p.name}</div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-500">{p.type}</td>
                                    <td className="p-4 font-bold text-[#102B5A]">{Number(p.price).toLocaleString()}₮</td>
                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => handleDelete(p.id)}
                                            className="text-red-500 hover:bg-red-50 px-3 py-1 rounded-md transition-all"
                                        >
                                            Устгах
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {products.length === 0 && <div className="p-10 text-center text-gray-400">Бараа байхгүй байна.</div>}
                </div>
            )}

            {/* ФОРМ ХЭСЭГ */}
            {activeTab === 'add' && (
                <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl border border-gray-100">
                    <h2 className="text-xl font-bold mb-6">Шинэ бараа бүртгэх</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Барааны код</label>
                                <input type="text" required value={formData.code} className="w-full mt-1 p-2 border rounded-md outline-none focus:ring-2 focus:ring-[#102B5A]" onChange={(e) => setFormData({ ...formData, code: e.target.value })} placeholder="P-001" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Барааны нэр</label>
                                <input type="text" required value={formData.name} className="w-full mt-1 p-2 border rounded-md outline-none focus:ring-2 focus:ring-[#102B5A]" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Зураг оруулах (PNG, JPG)</label>
                            <div className="mt-1 flex items-center gap-4">
                                {/* Зураг урьдчилан харах хэсэг */}
                                {formData.image_url && (
                                    <img
                                        src={formData.image_url}
                                        className="w-16 h-16 object-cover rounded-lg border border-black/10"
                                        alt="Preview"
                                    />
                                )}

                                <label className="flex-1 cursor-pointer">
                                    <div className="w-full p-2 border-2 border-dashed border-gray-300 rounded-md text-center hover:border-blue-500 transition-colors text-sm text-gray-500">
                                        {formData.image_url ? 'Зураг солих' : 'Файл сонгох (.jpg, .png)'}
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/png, image/jpeg, image/jpg"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                // Файлыг Base64 текст рүү хөрвүүлэх
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setFormData({ ...formData, image_url: reader.result as string });
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                </label>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Төрөл</label>
                                <select value={formData.type} className="w-full mt-1 p-2 border text-base rounded-md outline-none" onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                                    <option value="cleaning_tool">Цэвэрлэгээний хэрэгсэл</option>
                                    <option value="Towels, napkins">Алчуур, сальфетка</option>
                                    <option value="Cleaning agent">Цэвэрлэгээний бодис</option>
                                    <option value="Trash can">Хогны сав</option>
                                    <option value="Floor cleaner, broom">Шал арчигч, шүүр</option>
                                    <option value="Cleaning machine">Цэвэрлэгээний машин</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Нэгж</label>
                                <input type="text" value={formData.unit} className="w-full mt-1 p-2 border rounded-md outline-none" onChange={(e) => setFormData({ ...formData, unit: e.target.value })} placeholder="ш, кг, л" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Үнэ ₮</label>
                                <input type="number" required value={formData.price} className="w-full mt-1 p-2 border rounded-md outline-none" onChange={(e) => setFormData({ ...formData, price: e.target.value + "НӨАТ-гүй"})} />
                            </div>
                        </div>
                        <button type="submit" disabled={loading} className={`w-full text-white py-3 rounded-lg font-semibold mt-4 transition-all ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#102B5A] hover:bg-[#1a438a]'}`}>
                            {loading ? 'Хадгалж байна...' : 'Бараа хадгалах'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    )
}