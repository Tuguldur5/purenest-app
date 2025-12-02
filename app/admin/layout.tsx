import React from 'react';

// Админы үндсэн Layout нь зөвхөн хүүхэд компонент (page.tsx) -ийг харуулна
// Ингэснээр app/layout.tsx-ээс ирдэг Header болон Footer автоматаар харагдахгүй.

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-container min-h-screen bg-gray-100">
      {/* 💡 Энд Header/Footer-ийг ДУУДАХГҮЙ! */}
      
      <main className="flex-1">
        {children} {/* Энэ бол app/admin/dashboard/page.tsx */}
      </main>
      
      {/* 💡 Шаардлагатай бол Admin Sidebar-ийг энд нэмж болно */}
    </div>
  );
}