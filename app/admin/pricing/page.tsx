'use client';

export default function PricingPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Үнийн тохиргоо</h1>
            <p>Энд та үнийн тохиргоог хийх боломжтой.</p>
            <div className="space-y-4 mt-4">
                <div className="p-4 border rounded-lg bg-yellow-50">
                    <h3 className="font-semibold">Оффис үнэ / м²:</h3>
                </div>
                <div className="p-4 border rounded-lg bg-yellow-50">
                    <h3 className="font-semibold">СӨХ-ийн үнийн параметрүүд:</h3>
                </div>
                <div className="p-4 border rounded-lg bg-yellow-50">
                    <h3 className="font-semibold">Давтамжийн хөнгөлөлт:</h3>
                </div>
                <button className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Хадгалах</button>
            </div>
        </div>
    );
}
