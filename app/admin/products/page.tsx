'use client'
import { FormEvent, useState, useEffect } from 'react'
import { Search, Filter, X } from 'lucide-react' // Icon-ууд нэмэв

export default function AdminProductsPage() {
    const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<any[]>([]);
    
    // --- ХАЙЛТ БОЛОН ШҮҮЛТИЙН STATE ---
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('Бүгд');

    const [editId, setEditId] = useState<number | null>(null);
    const [stayOnPage, setStayOnPage] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        image_url: '',
        unit: 'ширхэг',
        price: '',
        type: 'Цэвэрлэгээний хэрэгсэл'
    });

    const fetchProducts = async () => {
        try {
            const res = await fetch('https://purenest-app.onrender.com/api/products');
            const data = await res.json();
            if (Array.isArray(data)) setProducts(data);
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    useEffect(() => {
        if (activeTab === 'list') fetchProducts();
    }, [activeTab]);

    // --- ХАЙЛТЫН ЛОГИК ---
    const filteredProducts = products.filter(p => {
        const matchesSearch = 
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            p.code.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'Бүгд' || p.type === filterType;
        
        return matchesSearch && matchesType;
    });

    // --- БУСАД ФУНКЦҮҮД (handleEdit, handleDelete, handleSubmit...) ХЭВЭЭРЭЭ ---
    const handleEdit = (product: any) => {
        setEditId(product.id);
        setFormData({
            code: product.code,
            name: product.name,
            image_url: product.image_url,
            unit: product.unit,
            price: product.price.toString(),
            type: product.type
        });
        setActiveTab('add');
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Энэ барааг устгахдаа итгэлтэй байна уу?')) return;
        try {
            const res = await fetch(`https://purenest-app.onrender.com/api/products/${id}`, { method: 'DELETE' });
            if (res.ok) setProducts(products.filter(p => p.id !== id));
        } catch (error) {
            alert("Устгахад алдаа гарлаа.");
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const url = editId ? `https://purenest-app.onrender.com/api/products/${editId}` : 'https://purenest-app.onrender.com/api/products';
        const method = editId ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, price: parseFloat(formData.price) }),
            });

            if (response.ok) {
                alert(editId ? "Амжилттай шинэчлэгдлээ!" : "Амжилттай бүртгэгдлээ!");
                setFormData({ code: '', name: '', image_url: '', unit: 'ширхэг', price: '', type: 'Цэвэрлэгээний хэрэгсэл' });
                setEditId(null);
                if (!stayOnPage) setActiveTab('list'); else fetchProducts();
            }
        } catch (error) {
            alert("Алдаа гарлаа.");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({ code: '', name: '', image_url: '', unit: 'ширхэг', price: '', type: 'Цэвэрлэгээний хэрэгсэл' });
        setEditId(null);
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex gap-4 mb-8 border-b">
                <button onClick={() => { setActiveTab('list'); resetForm(); }} className={`pb-2 px-4 ${activeTab === 'list' ? 'border-b-2 border-[#102B5A] text-[#102B5A] font-bold' : 'text-gray-500'}`}>
                    Барааны жагсаалт
                </button>
                <button onClick={() => setActiveTab('add')} className={`pb-2 px-4 ${activeTab === 'add' ? 'border-b-2 border-[#102B5A] text-[#102B5A] font-bold' : 'text-gray-500'}`}>
                    {editId ? 'Бараа засах' : 'Шинэ бараа нэмэх'}
                </button>
            </div>

            {activeTab === 'list' && (
                <div className="space-y-4">
                    {/* --- ХАЙЛТ БОЛОН FILTER ХЭСЭГ --- */}
                    <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-black/5">
                        <div className="relative flex-grow ">
                            <Search className="absolute left-3 mt-2 top-1 text-gray-400" size={18} />
                            <input 
                                type="text" 
                                placeholder="Барааны нэр эсвэл кодоор хайх..." 
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#102B5A] outline-none transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button onClick={() => setSearchTerm('')} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                                    <X size={18} />
                                </button>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter size={18} className="text-gray-400" />
                            <select 
                                className="border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#102B5A]"
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                            >
                                <option value="Бүгд">Бүх ангилал</option>
                                <option value="Цэвэрлэгээний хэрэгсэл">Цэвэрлэгээний хэрэгсэл</option>
                                <option value="Алчуур, сальфетка">Алчуур, сальфетка</option>
                                <option value="Цэвэрлэгээний бодис">Цэвэрлэгээний бодис</option>
                                <option value="Хогны сав">Хогны сав</option>
                                <option value="Шал арчигч, шүүр">Шал арчигч, шүүр</option>
                                <option value="Цэвэрлэгээний машин">Цэвэрлэгээний машин</option>
                            </select>
                        </div>
                    </div>

                    {/* --- ЖАГСААЛТ --- */}
                    <div className="bg-white shadow-md rounded-xl overflow-hidden border border-black/5">
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
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((p) => (
                                        <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-4">
                                                {p.image_url ? (
                                                    <img src={p.image_url} alt={p.name} className="w-12 h-12 object-cover rounded-md border border-black/5 shadow-md " />
                                                ) : (
                                                    <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center text-[10px] text-gray-400">Зураггүй</div>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <div className="text-xs text-gray-400 font-mono">{p.code}</div>
                                                <div className="font-medium text-gray-800">{p.name}</div>
                                            </td>
                                            <td className="p-4 text-sm text-gray-500">{p.type}</td>
                                            <td className="p-4 font-bold text-[#102B5A]">{Number(p.price).toLocaleString()}₮</td>
                                            <td className="p-4 text-center flex justify-center gap-2">
                                                <button onClick={() => handleEdit(p)} className="text-blue-500 hover:bg-blue-50 px-3 py-1 mt-1 border border-blue shadow-md rounded-md transition-colors">Засах</button>
                                                <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:bg-red-50 px-3 py-1 mt-1 border border-black/5 shadow-md rounded-md transition-colors">Устгах</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="p-10 text-center text-gray-400">Бараа олдсонгүй.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'add' && (
                <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl border border-gray-100">
                    <h2 className="text-xl font-bold mb-6">{editId ? 'Бараа засварлах' : 'Шинэ бараа бүртгэх'}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols gap-4">
                            <div>
                                <label className="block text-sm font-medium">Барааны код</label>
                                <input type="text" required value={formData.code} className="w-full mt-1 p-2 border rounded-md outline-none focus:ring-1 focus:ring-blue-500" onChange={(e) => setFormData({ ...formData, code: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Барааны нэр</label>
                                <input type="text" required value={formData.name} className="w-full mt-1 p-2 border rounded-md outline-none focus:ring-1 focus:ring-blue-500" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Зураг</label>
                            <input
                                type="file"
                                accept=".png,.jpg,.jpeg"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => setFormData({ ...formData, image_url: reader.result as string });
                                        reader.readAsDataURL(file);
                                    }
                                }}
                                className="w-full mt-1 p-2 border border-dashed rounded-md cursor-pointer"
                            />
                            {formData.image_url && <img src={formData.image_url} className="w-20 h-20 mt-2 object-cover rounded border" alt="Preview" />}
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block  text-sm font-medium">Төрөл</label>
                                <select value={formData.type} className="w-full mt-1 p-2 border rounded-md" onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                                    <option value="Цэвэрлэгээний хэрэгсэл">Цэвэрлэгээний хэрэгсэл</option>
                                    <option value="Алчуур, сальфетка">Алчуур, сальфетка</option>
                                    <option value="Цэвэрлэгээний бодис">Цэвэрлэгээний бодис</option>
                                    <option value="Хогны сав">Хогны сав</option>
                                    <option value="Шал арчигч, шүүр">Шал арчигч, шүүр</option>
                                    <option value="Цэвэрлэгээний машин">Цэвэрлэгээний машин</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Нэгж</label>
                                <input type="text" value={formData.unit} className="w-full mt-1 p-2 border rounded-md" onChange={(e) => setFormData({ ...formData, unit: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Үнэ</label>
                                <input type="number" required value={formData.price} className="w-full mt-1 p-2 border rounded-md" onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                            </div>
                        </div>

                        {!editId && (
                            <div className="flex items-center gap-2 py-2">
                                <input
                                    type="checkbox"
                                    id="stayOnPage"
                                    checked={stayOnPage}
                                    onChange={(e) => setStayOnPage(e.target.checked)}
                                    className="w-4 h-4 cursor-pointer accent-[#102B5A]"
                                />
                                <label htmlFor="stayOnPage" className="text-sm text-gray-600 cursor-pointer select-none">
                                    Бараа нэмсний дараа энэ хуудсанд үлдэх
                                </label>
                            </div>
                        )}
                        <button type="submit" disabled={loading} className="w-full bg-[#102B5A] text-white py-3 rounded-lg font-semibold mt-4 hover:bg-blue-900 transition-all">
                            {loading ? 'Хадгалж байна...' : editId ? 'Өөрчлөлтийг хадгалах' : 'Бараа хадгалах'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    )
}