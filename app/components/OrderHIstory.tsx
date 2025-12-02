// components/OrderHistory.jsx
interface Order {
    id: string;
    date: string;
    total: number; // Эсвэл string хэрэв та мөнгөн дүн болгоод string-ээр хадгалдаг бол
    status: string;
}

interface OrderHistoryProps {
    orders: Order[]; // Orders нь Order interface-ээр тодорхойлогдсон обьектуудын массив байна
}
function OrderHistory({ orders }: OrderHistoryProps) {
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">🛍️ Захиалгын Түүх</h2>
            
            {orders.length === 0 ? (
                <p className="text-gray-500">Та одоогоор захиалга хийгээгүй байна.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-4 border-b text-left">Захиалгын Дугаар</th>
                                <th className="py-2 px-4 border-b text-left">Огноо</th>
                                <th className="py-2 px-4 border-b text-left">Нийт Дүн</th>
                                <th className="py-2 px-4 border-b text-left">Төлөв</th>
                                <th className="py-2 px-4 border-b text-left"></th> {/* Дэлгэрэнгүй товчлуур */}
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="py-2 px-4 border-b font-medium text-indigo-600">{order.id}</td>
                                    <td className="py-2 px-4 border-b">{order.date}</td>
                                    <td className="py-2 px-4 border-b">{order.total.toLocaleString()}₮</td>
                                    <td className="py-2 px-4 border-b">
                                        <span className={`px-3 py-1 text-sm font-semibold rounded-full 
                                            ${order.status === 'Хүргэгдсэн' ? 'bg-green-100 text-green-800' :
                                              order.status === 'Төлөгдсөн' ? 'bg-yellow-100 text-yellow-800' :
                                              'bg-red-100 text-red-800'}`
                                        }>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        {/* Энэ товчлуур нь захиалгын дэлгэрэнгүй хуудас руу шилжүүлэх үүрэгтэй */}
                                        <button className="text-sm text-indigo-500 hover:text-indigo-700">Дэлгэрэнгүй</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}