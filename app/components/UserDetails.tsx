'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, Mail, Phone, ShieldCheck, Edit3, Check, X, KeyRound } from 'lucide-react';
import { useSiteToast } from '../hooks/useSiteToast';

export interface UserDetail {
    full_name: string;
    email: string;
    phone: string;
}

interface EditableFieldProps {
    label: string;
    value: string;
    icon: React.ReactNode;
    isEditing: boolean;
    onChange: (val: string) => void;
    placeholder?: string;
}

function EditableField({ label, value, icon, isEditing, onChange, placeholder }: EditableFieldProps) {
    return (
        <div className="group space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                {label}
            </label>
            <div className={`flex items-center gap-3 p-4 rounded-2xl border border-black/5 transition-all duration-200 ${isEditing
                    ? 'bg-white border-indigo-200 ring-4 ring-indigo-50'
                    : 'bg-slate-50 border-transparent hover:border-slate-200'
                }`}>
                <div className={`${isEditing ? 'opacity-100 text-indigo-500' : 'opacity-70 text-slate-400'}`}>
                    {icon}
                </div>
                {isEditing ? (
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        className="w-full bg-transparent outline-none text-sm font-medium text-slate-800 placeholder:text-slate-300"
                    />
                ) : (
                    <span className="text-sm font-semibold text-slate-700 truncate">
                        {value}
                    </span>
                )}
            </div>
        </div>
    );
}

export default function UserDetails({ details, onUpdate }: { details: UserDetail | null, onUpdate: (newData: UserDetail) => void }) {
    const [isEditing, setIsEditing] = useState(false);
    // ШИЙДЭЛ: LocalStorage-аас cache-лэгдсэн датаг шууд эхний утга болгож авах
    const [form, setForm] = useState<UserDetail>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('user');
            return saved ? JSON.parse(saved) : { full_name: '', email: '', phone: '' };
        }
        return { full_name: '', email: '', phone: '' };
    });

    const [loading, setLoading] = useState(false);
    const { showToast } = useSiteToast();

    useEffect(() => {
        if (details) {
            setForm({
                full_name: details.full_name || '',
                email: details.email || '',
                phone: details.phone ? String(details.phone) : ''
            });
        }
    }, [details]);

    const handleSave = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`https://purenest-app.onrender.com/api/users/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });

            if (res.ok) {
                const updatedData = await res.json();
                const newData = updatedData.user || form;
                onUpdate(newData);
                localStorage.setItem('user', JSON.stringify(newData)); // Cache шинэчлэх
                setIsEditing(false);
                showToast({ title: "Амжилттай", description: "Мэдээлэл шинэчлэгдлээ." });
            }
        } catch (error: any) {
            showToast({ title: "Алдаа", description: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Хувийн мэдээлэл</h2>
                    <p className="text-sm text-slate-400">Таны бүртгэлтэй мэдээлэл</p>
                </div>
                {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-all">
                        <Edit3 size={16} /> Засах
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button onClick={handleSave} disabled={loading} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all">
                            <Check size={16} /> {loading ? "..." : "Хадгалах"}
                        </button>
                        <button onClick={() => setIsEditing(false)} className="p-2 text-slate-400 bg-slate-100 rounded-xl hover:bg-slate-200">
                            <X size={18} />
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EditableField label="Бүтэн нэр" value={form.full_name} icon={<User size={18} />} isEditing={isEditing} onChange={(val) => setForm({ ...form, full_name: val })} />
                <EditableField label="И-мэйл хаяг" value={form.email} icon={<Mail size={18} />} isEditing={isEditing} onChange={(val) => setForm({ ...form, email: val })} />
                <EditableField label="Утасны дугаар" value={form.phone} icon={<Phone size={18} />} isEditing={isEditing} onChange={(val) => setForm({ ...form, phone: val })} />

                {/* НУУЦ ҮГ СОЛИХ ТОВЧ */}
                <Link
                    href="/forgot-password"
                    className="group p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex items-center justify-between hover:border-indigo-300 hover:bg-indigo-50/30 transition-all text-left"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-white rounded-lg shadow-sm group-hover:text-indigo-600 transition-colors">
                            <KeyRound size={20} className="text-slate-400 group-hover:text-indigo-500" />
                        </div>
                        <div>
                            <p className="text-[13px] font-bold text-slate-700">Нууц үг солих</p>
                            <p className="text-[11px] text-slate-400 font-medium">Нууц үг сэргээх хуудас руу шилжих</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-indigo-500 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                        <Edit3 size={14} />
                    </div>
                </Link>
            </div>
        </div>
    );
}