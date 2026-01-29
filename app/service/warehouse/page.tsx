'use client'
import Link from 'next/link'
import Partner from "../../components/partner"

export default function WarehouseService() {
    const title = 'Агуулах'
    return (
        <section className="container mx-auto px-4 py-10 text-black">
            <div className='container mx-auto p-4 rounded-lg'>
                <h1 className="text-3xl font-semibold mb-4 text-center">{title} цэвэрлэгээнд юу багтдаг вэ?</h1>

                <p className="mb-6 text-sm text-center">
                    Ложистик төв, үйлдвэрийн агуулах болон хадгалах байгууламжид зориулсан мэргэжлийн цэвэрлэгээний үйлчилгээ. Бид ажлын явцыг тасалдуулахгүйгээр цэвэр орчныг бүрдүүлнэ.
                </p>

                <div className="grid gap-8 md:grid-cols-2">
                    {/* LEFT */}
                    <div className="border border-black/5 shadow-md p-3 rounded-lg">
                        <h4 className="font-medium mb-3 p-3 text-white bg-[#102B5A]">
                            Үндсэн талбай ба хадгалах хэсэг
                        </h4>
                        <ul className="list-disc list-inside space-y-2 text-sm mb-6">
                            <li>Агуулахын шал угаах / үйлдвэрлэлийн тоос соруулах</li>
                            <li>Тавиур болон хадгалах хэсгийн гадна талыг арчих</li>
                            <li>Ачаа ачих, буулгах талбайн цэвэрлэгээ</li>
                            <li>Тэмдэг, тэмдэглэгээ болон зааварчилгааны самбар арчих</li>
                            <li>Том хэмжээний хог хаягдлыг ангилах</li>
                        </ul>

                        <h4 className="font-medium mb-2 p-3 text-white bg-[#102B5A]">
                            Оффис болон ажилчдын хэсэг
                        </h4>
                        <ul className="list-disc list-inside space-y-2 text-sm mb-6">
                            <li>Ажилчдын хувцас солих өрөө цэвэрлэх</li>
                            <li>Амралтын өрөөний ширээ, сандал арчих</li>
                            <li>Компьютер, хяналтын дэлгэцний тоос арчих</li>
                            <li>Шал арчих, хог гаргах</li>
                        </ul>

                        <h4 className="font-medium mb-3 p-3 text-white bg-[#102B5A]">
                            Нэмэлт (захиалгаар)
                        </h4>
                        <ul className="list-disc list-inside space-y-2 text-sm mb-6">
                            <li>Шалны машинаар гүн угаалга хийх (Scrubbing)</li>
                            <li>Өндөр таазны тоос соруулах / аалзны тор авах</li>
                            <li>Гадна талбайн цэвэрлэгээ</li>
                            <li>Барилгын ажил дууссаны дараах гүн цэвэрлэгээ</li>
                        </ul>
                    </div>

                    {/* RIGHT */}
                    <div className="p-3 border border-black/5 shadow-md rounded-lg">
                        <h4 className="font-medium mb-2 p-3 text-white bg-[#102B5A]">
                            Техник болон Хаалга
                        </h4>
                        <ul className="list-disc list-inside space-y-2 text-sm mb-6">
                            <li>Роллет болон автомат хаалга арчих</li>
                            <li>Гал унтраах хэрэгсэл, хайрцагны тоос арчих</li>
                            <li>Гэрлийн бүрхүүл, унтраалга цэвэрлэх</li>
                        </ul>

                        <h4 className="font-medium mb-2 p-3 text-white bg-[#102B5A]">
                            Ариун цэврийн өрөө / Шүршүүр
                        </h4>
                        <ul className="list-disc list-inside space-y-2 text-sm mb-6">
                            <li>Суултуур, угаалтуур ариутгах</li>
                            <li>Шүршүүрийн өрөөний чийгтэй цэвэрлэгээ</li>
                            <li>Толь болон шилэн гадаргуу арчих</li>
                            <li>Ариутгагч бодис, саван цэнэглэх</li>
                        </ul>

                        <h4 className="font-medium mb-2 p-3 text-white bg-[#102B5A]">
                            Шилэн гадаргуу
                        </h4>
                        <ul className="list-disc list-inside space-y-2 text-sm">
                            <li>Дотор талын шилэн хаалт, цонх арчих</li>
                            <li>Хаалганы бариул, хүрээ арчих</li>
                            <li>Тусгаарлах хана цэвэрлэх</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <a
                        href="/booking"
                        className="inline-block px-6 py-3 pr-15 pl-15 rounded-lg border border-white/5 shadow-md bg-[#102B5A] text-white hover:text-amber-400 transition-colors duration-200"
                    >
                        Захиалах
                    </a>
                </div>

                <div className="mt-12 w-full max-w-8xl mx-auto px-4 border border-black/5 p-8 rounded-2xl shadow-xl shadow-inner">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                             Үйлчилгээнд хамаарахгүй зүйлс
                        </h3>
                        <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base">
                            Агуулахын аюулгүй байдлын горимын дагуу манай ажилтнууд дараах ажлуудыг гүйцэтгэхгүй.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                        {[
                            {
                                title: 'Ачаа бараа зөөх',
                                desc: 'Палеттай бараа, хүнд ачааг өргөх эсвэл байршлыг нь өөрчлөхгүй.',
                                icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
                            },
                            {
                                title: 'Тусгай техник ажиллуулах',
                                desc: 'Сэрээт өргөгч (forklift) болон агуулахын бусад техникийг ажиллуулахгүй.',
                                icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
                            },
                            {
                                title: 'Химийн аюултай бодис',
                                desc: 'Агуулахад асгарсан химийн хортой бодис, цацраг идэвхт хаягдлыг цэвэрлэхгүй.',
                                icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.368 18c-.77 1.333.192 3 1.732 3z'
                            },
                            {
                                title: 'Гүний инженерийн хэсэг',
                                desc: 'Цахилгааны щит доторх болон агааржуулалтын хоолой доторх цэвэрлэгээ.',
                                icon: 'M13 10V3L4 14h7v7l9-11h-7z'
                            },
                            {
                                title: 'Өндөр эрсдэлтэй хэсэг',
                                desc: 'Хамгаалалтын бэхэлгээгүйгээр 2 метрээс дээш өндөрт гараас цэвэрлэгээ хийхгүй.',
                                icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                            },
                            {
                                title: 'Барааны тооллого',
                                desc: 'Бараа материалын бүрэн бүтэн байдлыг шалгах, тооллого хийх ажил хамаарахгүй.',
                                icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4'
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