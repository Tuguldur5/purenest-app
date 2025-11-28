

export default function AboutPage() {
    return (
        <section className="container mx-auto w-full py-16 px-6 md:px-20 mt-10 bg-gray-50 text-gray-800 rounded-lg border border-black/5 shadow-lg">
            {/* Title Section */}
            <div className="max-w-5xl mx-auto text-center mb-12">
                <h2 className="text-4xl font-bold text-[#102B5A]">Бидний тухай</h2>
                <p className="text-lg mt-4 text-gray-600">
                    Purenest Cleaning Services — Цэвэр, Тав тухтай, Эрүүл орчныг танд.
                </p>
            </div>

            {/* About Information */}
            <div className="grid md:grid-cols-2 gap-10 items-center max-w-5xl mx-auto">
                <img
                    src="/purenest.jpg"
                    alt="Purenest Cleaning Service"
                    className="w-full rounded-xl shadow-lg object-cover"
                />

                <div className="space-y-4 text-lg leading-relaxed">
                    <p>
                        <strong className="text-[#102B5A] text-bold">Purenest</strong> нь 2025 онд
                        үүсгэн байгуулагдсан бөгөөд гэр, албан байгууллага болон олон нийтийн
                        талбайд зориулсан мэргэжлийн цэвэрлэгээний үйлчилгээ үзүүлдэг.
                    </p>
                
                    <p>
                        Манай хамт олон туршлагатай, найдвартай, хариуцлагатай бөгөөд олон улсын
                        стандартын дагуу байгальд ээлтэй бодлого баримтлан үйлчилдэг.
                    </p>
                </div>
            </div>

            {/* Values */}
            <div className="mt-14 max-w-5xl mx-auto">
                <h3 className="text-3xl font-semibold text-center text-[#102B5A] mb-6">
                    Манай үнэт зүйлс
                </h3>

                <div className="grid md:grid-cols-4 gap-6 text-center">
                    {[
                        "Найдвартай байдал",
                        "Хэрэглэгч төвтэй",
                        "Хурд ба Шургуу байдал",
                        "Экологийн хариуцлага",
                    ].map((item, index) => (
                        <div
                            key={index}
                            className="bg-white shadow-md rounded-lg p-5 font-medium hover:shadow-xl duration-200"
                        >
                            {item}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
