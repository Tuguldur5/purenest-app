'use client'
import { RiH4 } from "react-icons/ri"
import Partner from "../../components/partner"

export default function ServiceCard() {
    const title = 'Оффис цэвэрлэгээ'
    return (
        <section className="container mx-auto  text-black px-4 py-10">
            <div className="container mx-auto  p-4 rounded-lg">
                <h2 className="text-3xl font-semibold mb-4 text-center">
                    Оффис цэвэрлэгээнд юу багтдаг вэ?</h2>
                <p className="text-center text-sm mb-8 max-w-2xl mx-auto">
                    Манай оффис цэвэрлэгээний үйлчилгээ дараах үндсэн ажлуудыг агуулна.
                    Хэрэв жагсаалтад байхгүй хүчин зүйл байгаа бол бидэнтэй холбогдон шийдүүлэх боломжтой. </p>

                <div className="grid gap-8 md:grid-cols-2">
                    {/* LEFT */}
                    <div className="border border-black/5 shadow-md p-3 rounded-lg">
                        <h3 className="font-medium mb-3 p-3 text-white bg-[#102B5A]">
                            Ажлын өрөөнүүд
                        </h3>
                        <ul className="list-disc list-inside space-y-2 text-sm mb-6">
                            <li> Шал угаах / шүүрдэх / вакуумдах</li>
                            <li> Ажлын ширээ, тавилгын гадаргуу арчих</li>
                            <li> Цонхны тавцан, хана, булангийн тоос арчих</li>
                            <li> Гэрлийн унтраалга, хаалганы бариул ариутгах</li>
                            <li> Хог хаягдал гаргах</li>
                        </ul>

                        <h4 className="font-medium mb-2 p-3 text-white bg-[#102B5A]">
                            Гал тогоо / Амралтын хэсэг
                        </h4>
                        <ul className="list-disc list-inside space-y-2 text-sm mb-6">
                            <li>Хог хаягдал гаргах</li>
                            <li>Шал цэвэрлэх</li>
                            <li>Хоолны ширээ, угаалтуур, тавцан цэвэрлэх</li>
                            <li>Гадна талын шкаф болон тавилгууд арчих</li>
                        </ul>

                        <h4 className="font-medium mb-3 p-3 text-white bg-[#102B5A]">
                            Нэмэлт (хүсэлтээр)
                        </h4>

                        <ul className="list-disc list-inside space-y-2 text-sm mb-6">
                            <li>Шүүгээний дотор цэвэрлэгээ</li>
                            <li>Хөргөгч доторх цэвэрлэгээ</li>
                            <li>Шалын гүн цэвэрлэгээ</li>
                            <li>Их цэвэрлэгээ (нүүх, тохижуулах үеэр)</li>
                        </ul>
                    </div>

                    {/* RIGHT */}
                    <div className="p-3 border border-black/5 shadow-md rounded-lg">
                        <h4 className="font-medium mb-2 p-3 text-white bg-[#102B5A]">
                            Хөдөлгөөн ихтэй талбай
                        </h4>
                        <ul className="list-disc list-inside space-y-2 text-sm mb-6">
                            <li>Коридор, шат, хүлээлгийн өрөө</li>
                            <li>Ширээ, тавилга гадаргуу арчих</li>
                            <li>Ханын булан, хэл эн зэрэгт гарсан тоос цэвэрлэх</li>
                        </ul>

                        <h4 className="text-lg font-medium mb-2 p-3 text-white bg-[#102B5A]">
                            Ариун цэврийн өрөө
                        </h4>
                        <ul className="list-disc list-inside space-y-2 text-sm mb-6">
                            <li>Суултуур, угаалтуур, шүршүүр</li>
                            <li>Шал угаах</li>
                            <li>Толбо, хүрээ арилгах</li>
                            <li>Саван, хогийн сав цэвэрлэх</li>
                        </ul>

                        <h4 className="font-medium mb-2 p-3 text-white bg-[#102B5A]">
                            Удирдлагын өрөө
                        </h4>
                        <ul className="list-disc list-inside space-y-2 text-sm">
                            <li>Ширээ, тавилга гялгар болтол арчих</li>
                            <li>Шургуулга гадна талаас арчих</li>
                            <li>Хүндрэлгүй хүрэх боломжтой тавиур, тавцан</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <a
                        href="/booking"
                        className="inline-block px-6 py-3 pr-15 pl-15 rounded-lg border border-white/5 hover:shadow-md bg-[#102B5A] text-white hover:text-amber-400 transition-colors duration-200"
                    >
                        Захиалах
                    </a>
                </div>
                <div className="mt-12 w-full max-w-8xl mx-auto px-4 border border-black/5 p-8 rounded-2xl shadow-xl shadow-inner">
                    {/* Гарчиг хэсэг */}
                    <div className="text-center mb-8">
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                             Үйлчилгээнд хамаарахгүй зүйлс
                        </h3>
                        <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base">
                            Аюулгүй байдал болон техникийн зааврын дагуу манай хамт олон дараах ажлуудыг гүйцэтгэх боломжгүйг анхаарна уу.
                        </p>
                    </div>

                    {/* Картнуудын Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                        {[
                            {
                                title: 'Хүнд ачаа зөөвөрлөлт',
                                desc: '25кг-аас дээш жинтэй тавилга, тоног төхөөрөмжийг зөөж байршлыг өөрчлөхгүй.',
                                icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
                            },
                            {
                                title: 'Аюултай өндрийн цэвэрлэгээ',
                                desc: 'Барилгын гадна талын болон хүрч үл болох өндөр цонх, ханын цэвэрлэгээ хийхгүй.',
                                icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.368 18c-.77 1.333.192 3 1.732 3z'
                            },
                            {
                                title: 'Биологийн болон химийн бохирдол',
                                desc: 'Хортой, био-аюултай, эрүүл мэндэд аюул учруулах бохирдол, хаягдлыг цэвэрлэхгүй.',
                                icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                            },
                            {
                                title: 'Барилгын дараах хог хаягдал',
                                desc: 'Хүнд даацын барилгын хог, хатуу хаягдлыг зайлуулах үйлчилгээнд хамаарахгүй.',
                                icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                            },
                            {
                                title: 'Тусгай химийн бодис',
                                desc: 'Хэвийн цэвэрлэгээнд хэрэглэдэггүй, тусгай химийн бодис шаардсан толбо арилгах.',
                                icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                            },
                            {
                                title: 'Хэт их хог хаягдал',
                                desc: 'Зориулалтын хогийн саванд багтахгүй хэмжээний хэт их хуримтлагдсан хог зөөхгүй.',
                                icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                            }
                        ].map((item, i) => (
                            <div key={i} className="group flex bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-red-500/10 transition-all duration-300 overflow-hidden">
                                <div className="w-2 bg-red-500 group-hover:w-3 transition-all duration-300"></div>
                                <div className="p-6">
                                    <div className="flex items-center mb-3">
                                        <div className="p-2 bg-red-50 rounded-lg mr-4 text-red-600">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                                            </svg>
                                        </div>
                                        <h4 className="font-bold text-gray-800 text-lg leading-tight">{item.title}</h4>
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
               
            </div>


        </section>
    )
}
