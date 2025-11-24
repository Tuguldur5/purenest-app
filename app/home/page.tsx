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
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-12 gap-8">
                <div className="md:w-1/2">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Тавтай морилно уу — <span className="text-amber-400">Purenest</span>
                    </h1>
                    <p className="text-gray-700 text-lg md:text-xl mb-6">
                        Бидний найдвартай цэвэрлэгээ үйлчилгээ таны <strong>Оффис</strong>, <strong>СӨХ-ийн талбай</strong> болон <strong>Олон нийтийн талбай</strong>-г цэвэр, эрүүл болгоно.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link href="/booking" className="px-6 py-3 rounded-lg bg-emerald-400 hover:bg-emerald-500 text-white font-medium transition">
                            Захиалах
                        </Link>
                    </div>
                </div>
                <div className="md:w-1/2">
                    <img src="/clean.png" alt="Cleaning Service" className="rounded-lg shadow-lg w-full" />
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
        </section>
    )
}
