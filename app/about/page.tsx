

export default function AboutPage() {
    return (
        <section className="container mx-auto w-full py-14 px-6 md:px-20 text-gray-800 ">
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
            <div className="mt-16 max-w-6xl mx-auto px-4">
                <h3 className="text-3xl md:text-4xl font-semibold text-center text-[#102B5A] mb-12">
                    Манай үнэт зүйлс
                </h3>

                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4 text-center">
                    {[
                        { title: 'Найдвартай байдал', icon: '🛡️' },
                        { title: 'Хэрэглэгч төвтэй', icon: '🤝' },
                        { title: 'Хурд ба Шаргуу байдал', icon: '⚡' },
                        { title: 'Экологийн хариуцлага', icon: '🌱' },
                    ].map((item, index) => (
                        <div
                            key={index}
                            className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                        >
                            {/* Accent bar */}
                            <div className="absolute left-0 top-0 h-full w-1 bg-[#102B5A] opacity-70 group-hover:opacity-100 transition" />

                            {/* Icon */}
                            <div className="mb-4 text-4xl">
                                {item.icon}
                            </div>

                            {/* Title */}
                            <h4 className="text-lg font-semibold text-gray-800 leading-snug">
                                {item.title}
                            </h4>

                            {/* Hover underline */}
                            <div className="mt-3 h-0.5 w-0 bg-[#102B5A] transition-all duration-300 group-hover:w-10" />
                        </div>
                    ))}
                </div>
            </div>

        </section>
    );
}
