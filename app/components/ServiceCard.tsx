export default function ServiceCard({ title, desc }: { title: string; desc: string }) {
    return (
        <section className="bg-white text-black py-12">
            <div className="border rounded-lg p-4 hover:shadow-lg transition">
                <h3 className="text-lg font-semibold hover-mustard">{title}</h3>
                <p className="mt-2 text-sm text-gray-600">{desc}</p>
                <button className="mt-4 btn-primary border-gray-200 hover:border-transparent hover:shadow">Book</button>
            </div>

            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-semibold mb-4 text-center">Юу багтдаг вэ</h2>
                <p className="text-center text-sm mb-8 max-w-2xl mx-auto">
                    Бидний цэвэрлэгээнд доорх үндсэн зүйлс багтдаг. Танд жагсаалтанд орогдоогүй тусгай хүсэлт байгаа бол бидэнтэй утсаар эсвэл имэйлээр холбогдоно уу.
                </p>

                <div className="grid gap-8 md:grid-cols-2">
                    {/* Included services (left) */}
                    <div>
                        <h3 className="text-xl font-medium mb-3">Гэрийн бүх өрөөнд</h3>
                        <ul className="list-disc list-inside space-y-2 text-sm mb-6">
                            <li>Хог хаягдал, дахин боловсруулахыг гаргана</li>
                            <li>Шал угаах, шүүрдэх / вакуумдах</li>
                            <li>Харагдах бүх гадаргууг тоосонцор арчиж цэвэрлэл</li>
                            <li>Гэрлийн унтраалга, хаалганы бариул</li>
                            <li>Цонхны жимсний тавцан, хөшиг/савх анхаарах</li>
                            <li>Тааз, агааржуулах өргөний хүрэх боломжтой хэсгүүдийн доорх самбар, базборд</li>
                        </ul>

                        <h4 className="text-lg font-medium mb-2">Гал тогоо</h4>
                        <ul className="list-disc list-inside space-y-2 text-sm mb-6">
                            <li>Хог гаргах</li>
                            <li>Шал шүүрдэх / вакуумдах</li>
                            <li>Гадна харагдах бүх гадаргууг арчиж цэвэрлэх</li>
                            <li>Гэрлийн унтраалга, хаалганы бариул</li>
                            <li>Цонхны тавцан, базбордыг цэвэрлэх</li>
                        </ul>

                        <h4 className="text-lg font-medium mb-2">Бусад амьдрах талбай</h4>
                        <ul className="list-disc list-inside space-y-2 text-sm mb-6">
                            <li>Телевиз болон холбогдсон төхөөрөмжүүдийг цэвэрлэх</li>
                            <li>Суудлууд, тавилга тоос арчина</li>
                            <li>Коридор, шат, ширээний гадаргууг цэвэрлэнэ</li>
                            <li>Шүүгээ, ширээ, сандал арчина</li>
                        </ul>

                        <h4 className="text-lg font-medium mb-2">Ариун цэврийн өрөө</h4>
                        <ul className="list-disc list-inside space-y-2 text-sm mb-6">
                            <li>Жорлон, суултуур</li>
                            <li>Угаалтуур</li>
                            <li>Шүршүүр, ванн</li>
                            <li>Шал</li>
                            <li>Гадаргуу, ширээ, хураагч</li>
                        </ul>

                        <h4 className="text-lg font-medium mb-2">Унтлагын өрөө</h4>
                        <ul className="list-disc list-inside space-y-2 text-sm">
                            <li>Ор гаргаж, хэрэв та хуудас өгсөн бол сольж өгөх</li>
                            <li>Толь арчина</li>
                            <li>Хувцас эвтэйхэн эвлүүлэх, цэгцлэх</li>
                            <li>Ширээ, гэрэл, хувцасны тавиур цэвэрлэх</li>
                        </ul>
                    </div>

                    {/* Extras and Excluded (right) */}
                    <div>
                        <h3 className="text-xl font-medium mb-3">Нэмэлт (хүсэлтээр)</h3>

                        <ul className="list-disc list-inside space-y-2 text-sm mb-6">
                            <li>Плита/ шарах шүүгээ дотороос цэвэрлэх</li>
                            <li>Хөргөгч дотороос цэвэрлэх</li>
                            <li>Шүүгээний дотор хийгдэх цэвэрлэгээ</li>
                            <li>Нүүж орох / нүүх гарах цэвэрлэгээ</li>
                            <li>Угаалга (улаан/цагаан уу?) - тусад нь ярилцна</li>
                        </ul>

                        <h3 className="text-xl font-medium mt-6 mb-3">Хамаарахгүй үйлчилгээ (Excluded)</h3>
                        <p className="text-sm mb-3">
                            Баталгааны шаардлага, аюулгүй байдал болон бусад шалтгаанаар бид дараах үйлчилгээ үзүүлэх боломжгүй:
                        </p>

                        <ul className="list-disc list-inside space-y-2 text-sm">
                            <li>25 фунт (≈11.3 кг)-аас хүнд зүйлсийг өргөх (том тавилга зэрэг)</li>
                            <li>Хүрэхийн аргагүй тааз, цонх, гадаргууг тоос арчих</li>
                            <li>Биеийн шингэн, мөөгөнцөр, био-аюултай бохирдолын цэвэрлэгээ</li>
                            <li>Гадаах цонхны гадна тал болон экстерьер цэвэрлэгээ</li>
                            <li>Гүн толбо арилгах (deep stain removal)</li>
                            <li>Барилгын дараах цэвэрлэгээ (post-construction)</li>
                            <li>Хог хураасан/hoarding байдалтай гэрүүд</li>
                            <li>Том арга хэмжээний дараах их хэмжээний цэвэрлэгээ</li>
                            <li>Фрат орон сууц зэрэг тусгай нөхцөлтэй байрууд</li>
                            <li>Чийгтэй арчилгаагаар булцуу арчих (wet wiping bulbs?)</li>
                        </ul>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-8 text-center">
                    <a
                        href="/booking"
                        className="inline-block px-6 py-3 rounded-lg border bg-black text-white hover:text-[#E3BE72] transition-colors duration-200"
                    >
                        Захиалах
                    </a>
                </div>

            </div>
        </section>

    )
}