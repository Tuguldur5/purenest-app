import Link from 'next/link'

export default function PublicSpaceService() {
    const title = 'Олон нийтийн талбай'
    return (
        <section className="container mx-auto px-4 py-10 text-black">
            <h1 className="text-3xl font-semibold mb-4">{title}</h1>

            <p className="mb-6 text-sm">
                Арга хэмжээний дараах цэвэрлэгээ, сургууль, оффисын их талбай эсвэл нийтлэг олон нийтийн хэсгүүдийн цэвэрлэгээ.
            </p>

            <ul className="list-disc list-inside space-y-2 text-sm mb-6">
                <li>Хаалтын дараах шалны цэвэрлэгээ</li>
                <li>Суудал, ширээ, тоног төхөөрөмжийн гадаргуу арчих</li>
                <li>Зөөвөрлөх боломжтой багийн зохион байгуулалт</li>
            </ul>

            <div className="mt-6">
                <Link
                    href={`/booking?service=${encodeURIComponent(title)}`}
                    className="inline-block px-6 py-3 rounded-lg border bg-black text-white hover:text-[#E3BE72] transition-colors duration-200"
                >
                    {title} захиалах
                </Link>
            </div>
        </section>
    )
}
