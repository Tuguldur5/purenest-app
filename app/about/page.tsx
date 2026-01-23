export default function AboutPage() {
    return (
        <section className="container mx-auto w-full py-10 md:py-20 px-6 md:px-10 text-gray-800">
            {/* Title Section */}
            <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-[#102B5A]">Бидний тухай</h2>
                <div className="w-20 h-1.5 bg-amber-400 mx-auto mt-4 rounded-full"></div> 
                <p className="text-base md:text-lg mt-6 text-gray-600 leading-relaxed">
                    Purenest Cleaning Services — Цэвэр, Тав тухтай, Эрүүл орчныг танд.
                </p>
            </div>

            {/* About Information Section */}
            <div className="grid lg:grid-cols-2 gap-10 items-center max-w-6xl mx-auto">
                {/* Image Wrapper */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-[#102B5A] rounded-2xl blur  group-hover:opacity-50 transition duration-1000"></div>
                    <img
                        src="/purenest.jpg"
                        alt="Purenest Cleaning Service"
                        className="relative w-full rounded-2xl shadow-1xl object-cover"
                    />
                </div>

                {/* Text Content */}
                <div className="space-y-6 text-base md:text-lg leading-relaxed ">
                    <div className="border-l-4 border-amber-400 pl-4">
                        <p className="text-gray-700">
        
                            

                            2025 онд үүсгэн байгуулагдсан бөгөөд гэр, албан байгууллага болон
                            олон нийтийн талбайд зориулсан мэргэжлийн цэвэрлэгээний үйлчилгээ үзүүлдэг.
                        </p>
                    </div>

                    <p className="text-gray-600">
                        Манай хамт олон туршлагатай, найдвартай, хариуцлагатай бөгөөд олон улсын
                        стандартын дагуу байгальд ээлтэй бодлого баримтлан үйлчилдэг. Бид үйлчлүүлэгч бүрийн
                        хэрэгцээнд нийцсэн чанартай гүйцэтгэлийг амлаж байна.
                    </p>
                </div>
            </div>

            {/* Values Section */}
            <div className="mt-20 md:mt-32 max-w-6xl mx-auto">
                <h3 className="text-2xl md:text-4xl font-bold text-center text-[#102B5A] mb-12">
                    Манай үнэт зүйлс
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { title: 'Найдвартай байдал', icon: '🛡️', desc: 'Бид таны итгэлийг эрхэмлэнэ' },
                        { title: 'Хэрэглэгч төвтэй', icon: '🤝', desc: 'Таны сэтгэл ханамж бидний зорилго' },
                        { title: 'Хурд ба Шаргуу байдал', icon: '⚡', desc: 'Чанарыг богино хугацаанд' },
                        { title: 'Экологийн хариуцлага', icon: '🌱', desc: 'Байгальд ээлтэй цэвэрлэгээ' },
                    ].map((item, index) => (
                        <div
                            key={index}
                            className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                        >
                            {/* Accent bar */}
                            <div className="absolute left-0 top-0 h-full w-1.5 bg-[#102B5A] opacity-20 group-hover:opacity-100 transition-all duration-300" />

                            <div className="mb-4 text-5xl transform group-hover:scale-110 transition-transform duration-300">
                                {item.icon}
                            </div>

                            <h4 className="text-lg font-bold text-gray-900 mb-2">
                                {item.title}
                            </h4>

                            <p className="text-sm text-gray-500">
                                {item.desc}
                            </p>

                            {/* Hover line effect */}
                            <div className="mt-4 h-1 w-0 bg-amber-400 transition-all duration-500 group-hover:w-full" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}