import Link from 'next/link'

export default function SokhService() {
    const title = 'СӨХ цэвэрлэгээ'
    return (
        <section className="container mx-auto px-4 py-10 text-black">
            <h1 className="text-3xl font-semibold mb-4">{title}</h1>

            <p className="mb-6 text-sm">
                Орон сууцны нийтлэг талбай, коридор, шат, лифт танхим зэрэг нийтлэг хэсгүүдийг цэвэрлэх үйлчилгээ.
            </p>

            <ul className="list-disc list-inside space-y-2 text-sm mb-6">
                <li>Коридор, шат, лифтүүдийн шал цэвэрлэх</li>
                <li>Хаалганы бариул, гар сунгах хэсгүүдийг арчих</li>
                <li>Их хэмжээний тоос шороо цуглуулах</li>
                <li>Багаар тохируулсан багийн зохион байгуулалт</li>
            </ul>

            <div className="mt-6">
                <Link
                    href={`/booking?service=${encodeURIComponent(title)}`}
                    className="inline-block px-6 py-3 rounded-lg border bg-black text-white hover:text-[#E3BE72] transition-colors duration-200"
                >
                    {title} Захиалах
                </Link>
            </div>
        </section>
    )
}
