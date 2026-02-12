'use client'
import { RiWindyLine } from "react-icons/ri" // Жишээ дүрс
import Partner from "../../components/partner"

export default function DuctServiceCard() {
    const title = 'Агааржуулалтын хоолой цэвэрлэгээ'
    
    return (
        <section className="container mx-auto text-black px-4 py-10">
            <div className="container mx-auto p-4 rounded-lg">
                <h2 className="text-3xl font-semibold mb-4 text-center">
                    Агааржуулалтын хоолой цэвэрлэгээнд юу багтдаг вэ?
                </h2>
                <p className="text-center text-sm mb-8 max-w-2xl mx-auto">
                    Манай агааржуулалтын хоолой (duct) цэвэрлэгээний үйлчилгээ нь агаарын чанарыг сайжруулах, тоос шороо болон бактер устгах зорилготой. 
                    Хэрэв танд тусгай шаардлага байгаа бол бидэнтэй холбогдоорой.
                </p>

                <div className="grid gap-8 md:grid-cols-2">
                    {/* LEFT */}
                    <div className="border border-black/5 shadow-md p-3 rounded-lg">
                        <h3 className="font-medium mb-3 p-3 text-white bg-[#102B5A]">
                            Үндсэн систем цэвэрлэгээ
                        </h3>
                        <ul className="list-disc list-inside space-y-2 text-sm mb-6">
                            <li>Агаар дамжуулах хоолойн дотор талын тоос соруулах</li>
                            <li>Агаар гаргах болон оруулах амсрууд (Grills/Vents)</li>
                            <li>Сэнс болон хөдөлгүүрийн хэсгийн тоос арчих</li>
                            <li>Шүүлтүүр (Filter) солих эсвэл угаах</li>
                            <li>Системийн гадна их биеийг арчиж цэвэрлэх</li>
                        </ul>

                        <h4 className="font-medium mb-2 p-3 text-white bg-[#102B5A]">
                            Ариутгал ба Хаалт
                        </h4>
                        <ul className="list-disc list-inside space-y-2 text-sm mb-6">
                            <li>Хоолойн холболтын хэсгүүдийн нягтшил шалгах</li>
                            <li>Үнэр дарах ариутгалын бодис шүрших</li>
                            <li>Агаарын урсгалын хаалтуудыг (Dampers) шалгаж цэвэрлэх</li>
                        </ul>

                        <h4 className="font-medium mb-3 p-3 text-white bg-[#102B5A]">
                            Нэмэлт (хүсэлтээр)
                        </h4>
                        <ul className="list-disc list-inside space-y-2 text-sm mb-6">
                            
                            <li>Дулаан солилцуур (Coil) цэвэрлэгээ</li>
                            <li>Гүн бохирдолтой хоолойн химийн угаалга</li>
                            
                        </ul>
                    </div>

                    {/* RIGHT */}
                    <div className="p-3 border border-black/5 shadow-md rounded-lg">
                        <h4 className="font-medium mb-2 p-3 text-white bg-[#102B5A]">
                            Төв агааржуулалтын төхөөрөмж (AHU)
                        </h4>
                        <ul className="list-disc list-inside space-y-2 text-sm mb-6">
                            <li>Төхөөрөмжийн дотор талын камерууд</li>
                            <li>Ус зайлуулах тэвш (Drain pan) цэвэрлэгээ</li>
                            <li>Дамжуулах сэнсний хүрдний бохирдол арилгах</li>
                        </ul>

                        <h4 className="text-lg font-medium mb-2 p-3 text-white bg-[#102B5A]">
                            Гал тогооны сорох систем
                        </h4>
                        <ul className="list-disc list-inside space-y-2 text-sm mb-6">
                            <li>Тосны шүүлтүүрүүдийг гүн цэвэрлэх</li>
                            <li>Сорох бүрээс (Hood) дотор талын цэвэрлэгээ</li>
                            <li>Тосны хуримтлал арилгах зориулалтын угаалга</li>
                            <li>Галын аюулгүй байдлын үзлэг</li>
                        </ul>

                        <h4 className="font-medium mb-2 p-3 text-white bg-[#102B5A]">
                            Хяналт ба Тайлан
                        </h4>
                        <ul className="list-disc list-inside space-y-2 text-sm">
                            <li>Цэвэрлэгээний өмнөх болон дараах зураг</li>
                            <li>Гүйцэтгэлийн дараах техникийн зөвлөмж</li>
                            
                        </ul>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <a
                        href="/booking"
                        className="inline-block px-6 py-3 pr-15 pl-15 hover:shadow-md rounded-lg border border-white/5 bg-[#102B5A] text-white hover:text-amber-400 transition-colors duration-200"
                    >
                        Захиалах
                    </a>
                </div>

                <div className="mt-12 w-full max-w-8xl mx-auto px-4 border border-black/5 p-8 rounded-2xl shadow-xl">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                            Үйлчилгээнд хамаарахгүй зүйлс
                        </h3>
                        <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base">
                            Аюулгүй байдал болон инженерийн зааврын дагуу дараах ажлуудыг гүйцэтгэх боломжгүйг анхаарна уу.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                        {[
                            {
                                title: 'Системийн засвар үйлчилгээ',
                                desc: 'Цахилгаан хөдөлгүүр болон удирдлагын хавтангийн гэмтэл, засварын ажлыг хийхгүй.',
                                icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
                            },
                            {
                                title: 'Барилгын гадна талбай',
                                desc: 'Барилгын гадна фасадад байрлах агааржуулалтын нүх, өндөр өргөгч шаардсан хэсэг.',
                                icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.368 18c-.77 1.333.192 3 1.732 3z'
                            },
                            {
                                title: 'Асбест болон аюултай бодис',
                                desc: 'Хуучин барилгын асбест агуулсан тусгаарлагч материалтай хоолойг цэвэрлэхгүй.',
                                icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                            },
                            {
                                title: 'Нийт систем солих',
                                desc: 'Хуучирч муудсан хоолойг бүхэлд нь солих эсвэл шинээр угсралт хийхгүй.',
                                icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                            },
                            {
                                title: 'Мэргэжлийн инженерчлэл',
                                desc: 'Агааржуулалтын системийн зураг төсөл, тооцоолол дахин хийх үйлчилгээ орохгүй.',
                                icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                            },
                            {
                                title: 'Хог хаягдал зайлуулах',
                                desc: 'Хоолойноос гарсан аюултай химийн бохирдолтой хогийг хотын төвлөрсөн цэгт хаяхгүй.',
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
                                        <h4 className="font-bold text-gray-800 text-lg">{item.title}</h4>
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