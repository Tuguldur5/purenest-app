import Link from 'next/link'
import ServiceCard from '../components/ServiceCard'

export default function Home() {
    const services = [
        {
            title: 'Оффис цэвэрлэгээ',
            desc: 'Бидний найдвартай оффис цэвэрлэгээ таны ажлын орчинг цэвэр, эрүүл болгоно.',
            included: [
                "Шал угаах / шүүрдэх",
                "Ширээ, тавилга цэвэрлэх",
                "Компьютер, тоног төхөөрөмж цэвэрлэх",
            ],
            extras: [
                "Хөргөгч, шүүгээ дотор цэвэрлэх",
                "Нүүж орох / гарах цэвэрлэгээ",
            ],
            excluded: [
                "11.3 кг-аас хүнд зүйл өргөх",
                "Гадаах экстерьер цэвэрлэгээ",
            ],
        },
        {
            title: 'СӨХ цэвэрлэгээ',
            desc: 'Орон сууцны СӨХ-ийн нийтлэг талбайн цэвэрлэгээ.',
            included: [
                "Коридор, шатны шал цэвэрлэх",
                "Суудал, тавилга тоос арчих",
                "Ширээ, сандал арчих",
            ],
            extras: ["Хивс / шалыг нэмэлт цэвэрлэх"],
            excluded: [
                "Био-аюултай бохирдол",
                "Том арга хэмжээний дараах их цэвэрлэгээ",
            ],
        },
        {
            title: 'Олон нийтийн талбай',
            desc: 'Олон нийтийн талбайн цэвэрлэгээ, ажилбар, гадаргуу.',
            included: [
                "Шал, гадаргуу цэвэрлэх",
                "Тоног төхөөрөмж арчих",
                "Цонх, хаалга арчих",
            ],
            extras: ["Нэмэлт тоног төхөөрөмж цэвэрлэх"],
            excluded: [
                "Барилгын дараах их цэвэрлэгээ",
                "Hoarding нөхцөлтэй байшин",
            ],
        },
    ]

    return (
        <section className="bg-gray-50 min-h-screen text-black">
            {/* Hero Section */}
            <div className="relative  w-full h-[600px] md:h-[700px] flex items-center justify-center">
                {/* Background Image */}
                <img
                    src="/clean.png"
                    alt="Cleaning Service"
                    className="absolute inset-0 w-full h-full object-cover brightness-75"
                />

                {/* Overlay Content */}
                <div className="relative z-10 text-center max-w-2xl px-6">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                        Тавтай морилно уу — <span className="text-amber-300">Purenest</span>
                    </h1>

                    <p className="text-white text-lg md:text-xl mb-6 drop-shadow-md">
                        Бидний найдвартай цэвэрлэгээ үйлчилгээ таны
                        <strong> Оффис</strong>,
                        <strong> СӨХ</strong> болон
                        <strong> Олон нийтийн талбай</strong>-г цэвэр, эрүүл болгоно.
                    </p>

                    <Link
                        href="/booking"
                        className="px-8 py-4 rounded-lg bg-emerald-400 hover:bg-emerald-500 text-white font-semibold transition shadow-md"
                    >
                        Захиалах
                    </Link>
                </div>
            </div>


            {/* Services Section */}
            <div className="container mx-auto px-6 py-12 ">
                <h2 className="text-3xl font-semibold text-center mb-10 text-gray-900">Бидний үйлчилгээ</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {services.map((service, idx) => (
                        <ServiceCard
                            key={idx}
                            title={service.title}
                            desc={service.desc}
                            included={service.included}
                            extras={service.extras}
                            excluded={service.excluded}
                        />
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-amber-100 py-12">
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl text-[#102b5a] font-bold mb-4">Цэвэрлэгээгээ одоо захиалаарай</h2>
                    <p className="text-gray-700 mb-6">Таны цагийг хэмнэх орчноо цэвэр байлгах хамгийн хялбар арга</p>
                    <Link href="/booking" className="px-8 py-4 rounded-lg bg-emerald-400 hover:bg-emerald-500 text-white font-medium transition">
                        Захиалах
                    </Link>
                </div>
            </div>
             <div className="p-10">
                <h2 className="text-2xl font-bold text-center mb-5">
                    Хамтран ажилладаг байгууллагууд
                </h2>

                <div className="w-full overflow-hidden py-3 bg-white">
                    <div className="flex items-center gap-15 animate-scroll will-change-transform">
                        <img src="/purenest.jpg" alt="Logo1" className="h-12 object-contain" />
                        <img src="/window.svg" alt="Logo2" className="h-12 object-contain" />
                        <img src="/next.svg" alt="Logo3" className="h-12 object-contain" />
                        <img src="/globe.svg" alt="Logo4" className="h-12 object-contain" />
                        <img src="/file.svg" alt="Logo5" className="h-12 object-contain" />

                        {/* дахин гүйлгэх */}
                        <img src="/purenest.jpg" alt="Logo1" className="h-12 object-contain" />
                        <img src="/window.svg" alt="Logo2" className="h-12 object-contain" />
                        <img src="/next.svg" alt="Logo3" className="h-12 object-contain" />
                        <img src="/globe.svg" alt="Logo4" className="h-12 object-contain" />
                        <img src="/file.svg" alt="Logo5" className="h-12 object-contain" />
                    </div>
                </div>
            </div>
        </section>
    )
}
