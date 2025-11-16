
export default function ServiceCard({ title, desc }: { title: string; desc: string }) {

    return (
        <section className="bg-white text-black py-5">

            <div className="container mx-auto border border-black/5 shadow-md p-4 rounded-lg">
                <h2 className="text-3xl font-semibold mb-4 text-center">Юу багтдаг вэ?</h2>
                <p className="text-center text-sm mb-8 max-w-2xl mx-auto">
                    Бидний цэвэрлэгээнд доорх үндсэн зүйлс багтдаг. Танд жагсаалтанд орогдоогүй тусгай хүсэлт байгаа бол бидэнтэй утсаар эсвэл имэйлээр холбогдоно уу.
                </p>

                <div className="grid gap-8 md:grid-cols-2">
                    {/* Included services (left) */}
                    <div className="border border-black/5 shadow-md p-3 rounded-lg">
                        <h3 className="text-xl font-medium mb-3 p-3 text-white bg-[#102B5A]">Гэрийн бүх өрөөнд</h3>
                        <ul className="list-disc list-inside space-y-2 text-sm mb-6">
                            <li>Хог хаягдал, дахин боловсруулахыг гаргана</li>
                            <li>Шал угаах, шүүрдэх / вакуумдах</li>
                            <li>Харагдах бүх гадаргууг тоосонцор арчиж цэвэрлэл</li>
                            <li>Гэрлийн унтраалга, хаалганы бариул</li>
                            <li>Цонхны жимсний тавцан, хөшиг/савх анхаарах</li>
                            <li>Тааз, агааржуулах өргөний хүрэх боломжтой хэсгүүдийн доорх самбар, базборд</li>
                        </ul>

                        <h4 className="text-lg font-medium mb-2 p-3 text-white bg-[#102B5A]">Гал тогоо</h4>
                        <ul className="list-disc list-inside space-y-2 text-sm mb-6">
                            <li>Хог гаргах</li>
                            <li>Шал шүүрдэх / вакуумдах</li>
                            <li>Гадна харагдах бүх гадаргууг арчиж цэвэрлэх</li>
                            <li>Гэрлийн унтраалга, хаалганы бариул</li>
                            <li>Цонхны тавцан, базбордыг цэвэрлэх</li>
                        </ul>
                        <h3 className="text-xl font-medium mb-3 p-3 text-white bg-[#102B5A]">Нэмэлт (хүсэлтээр)</h3>

                        <ul className="list-disc list-inside space-y-2 text-sm mb-6">
                            <li>Плита/ шарах шүүгээ дотороос цэвэрлэх</li>
                            <li>Хөргөгч дотороос цэвэрлэх</li>
                            <li>Шүүгээний дотор хийгдэх цэвэрлэгээ</li>
                            <li>Нүүж орох / нүүх гарах цэвэрлэгээ</li>
                            <li>Угаалга (улаан/цагаан уу?) - тусад нь ярилцна</li>
                        </ul>



                    </div>

                    {/* Extras and Excluded (right) */}
                    <div className="p-3 border border-black/5 shadow-md rounded-lg">
                        <h4 className="text-lg font-medium mb-2 p-3 text-white bg-[#102B5A]">Бусад амьдрах талбай</h4>
                        <ul className="list-disc list-inside space-y-2 text-sm mb-6">
                            <li>Телевиз болон холбогдсон төхөөрөмжүүдийг цэвэрлэх</li>
                            <li>Суудлууд, тавилга тоос арчина</li>
                            <li>Коридор, шат, ширээний гадаргууг цэвэрлэнэ</li>
                            <li>Шүүгээ, ширээ, сандал арчина</li>
                        </ul>

                        <h4 className="text-lg font-medium mb-2 p-3 text-white bg-[#102B5A]">Ариун цэврийн өрөө</h4>
                        <ul className="list-disc list-inside space-y-2 text-sm mb-6">
                            <li>Жорлон, суултуур</li>
                            <li>Угаалтуур</li>
                            <li>Шүршүүр, ванн</li>
                            <li>Шал</li>
                            <li>Гадаргуу, ширээ, хураагч</li>
                        </ul>

                        <h4 className="text-lg font-medium mb-2 p-3 text-white bg-[#102B5A]">Унтлагын өрөө</h4>
                        <ul className="list-disc list-inside space-y-2 text-sm">
                            <li>Ор гаргаж, хэрэв та хуудас өгсөн бол сольж өгөх</li>
                            <li>Толь арчина</li>
                            <li>Хувцас эвтэйхэн эвлүүлэх, цэгцлэх</li>
                            <li>Ширээ, гэрэл, хувцасны тавиур цэвэрлэх</li>
                        </ul>

                    </div>

                </div>
                <div className="mt-8 text-center">
                    <a
                        href="/booking"
                        className="inline-block px-6 py-3 pr-15 pl-15  rounded-lg border border-white/5 shadow-md bg-[#102B5A] text-white hover:text-[#f4a687]  transition-colors duration-200"
                    >
                        Захиалах
                    </a>
                </div>
                <div className="flex flex-col  mt-10 w-full items-center bg-[#C04A3A] border border-white/5shadow-md p-4 rounded-lg text-white">
                    <h3 className="text-xl font-medium text-center mb-3">Хамаарахгүй үйлчилгээ (Excluded)</h3>
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
            <div className="p-10">
                <h2 className="text-2xl font-bold text-center mb-5">Хамтран ажилладаг байгууллагууд</h2>

                <div className="w-full overflow-hidden py-3 bg-white">
                    <div className="flex items-center gap-15 animate-scroll will-change-transform">

                        <img src="/purenest.jpg" alt="Logo1" className="h-12 object-contain" />
                        <img src="/window.svg" alt="Logo2" className="h-12 object-contain" />
                        <img src="/next.svg" alt="Logo3" className="h-12 object-contain" />
                        <img src="/globe.svg" alt="Logo4" className="h-12 object-contain" />
                        <img src="/file.svg" alt="Logo5" className="h-12 object-contain" />

                        {/* Давтах хэсэг */}
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