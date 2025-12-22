import Link from 'next/link'

export default function PublicSpaceService() {
    const title = 'Олон нийтийн талбай'
    return (
        <section className="container mx-auto px-4 py-10 text-black">
            <div className='container mx-auto  p-4 rounded-lg'>
                <h1 className="text-3xl font-semibold mb-4 text-center">{title} цэвэрлэгээнд юу багтдаг вэ?</h1>

                <p className="mb-6 text-sm text-center">
                    Арга хэмжээний дараах цэвэрлэгээ, сургууль, оффисын их талбай эсвэл нийтлэг олон нийтийн хэсгүүдийн цэвэрлэгээ.
                </p>

                <div className="grid gap-8 md:grid-cols-2">
                    {/* LEFT */}
                    <div className="border border-black/5 shadow-md p-3 rounded-lg">
                        <h4 className=" font-medium mb-3 p-3 text-white bg-[#102B5A]">
                            Нийтийн талбайн бүх хэсэг
                        </h4>
                        <ul className="list-disc list-inside space-y-2 text-sm mb-6">
                            <li>Шал угаах / шүүрдэх / вакуумдах</li>
                            <li>Суудал, ширээ, сандал, тоног төхөөрөмж арчих</li>
                            <li>Ханын булан, хаалганы хүрээ тоос арчих</li>
                            <li>Тоглоомын талбай, тавцангийн гадаргуу цэвэрлэх</li>
                            <li>Гэрлийн унтраалга, хаалганы бариул ариутгах</li>
                            <li>Хог хаягдал гаргах</li>
                        </ul>

                        <h4 className=" font-medium mb-2 p-3 text-white bg-[#102B5A]">
                            Гал тогоо / Зооглох хэсэг
                        </h4>
                        <ul className="list-disc list-inside space-y-2 text-sm mb-6">
                            <li>Хог гаргах</li>
                            <li>Шал цэвэрлэх</li>
                            <li>Хоолны ширээ, угаалтуур, тавцан арчих</li>
                            <li>Гадна талын тавилга, шкаф арчих</li>
                        </ul>

                        <h4 className="font-medium mb-3 p-3 text-white bg-[#102B5A]">
                            Нэмэлт (хүсэлтээр)
                        </h4>
                        <ul className="list-disc list-inside space-y-2 text-sm mb-6">
                            <li>Шүүгээний дотор цэвэрлэгээ</li>
                            <li>Хөргөгч дотор цэвэрлэх</li>
                            <li>Шалны гүн цэвэрлэгээ</li>
                            <li>Томоохон арга хэмжээний дараах цэвэрлэгээ</li>
                        </ul>
                    </div>

                    {/* RIGHT */}
                    <div className="p-3 border border-black/5 shadow-md rounded-lg">
                        <h4 className="font-medium mb-2 p-3 text-white bg-[#102B5A]">
                            Хөдөлгөөн ихтэй талбай
                        </h4>
                        <ul className="list-disc list-inside space-y-2 text-sm mb-6">
                            <li>Коридор, хүлээлгийн өрөө, нээлттэй талбай</li>
                            <li>Ширээ, сандал, төхөөрөмжийн гадаргуу арчих</li>
                            <li>Ханын булан, хаалганы хүрээ, тоос арчих</li>
                        </ul>

                        <h4 className="font-medium mb-2 p-3 text-white bg-[#102B5A]">
                            Ариун цэврийн өрөө
                        </h4>
                        <ul className="list-disc list-inside space-y-2 text-sm mb-6">
                            <li>Суултуур, угаалтуур, шүршүүр</li>
                            <li>Шал угаах</li>
                            <li>Толбо, хүрээ арилгах</li>
                            <li>Саван, хогийн сав цэвэрлэх</li>
                        </ul>

                        <h4 className="font-medium mb-2 p-3 text-white bg-[#102B5A]">
                            Нэмэлт үйлчилгээний өрөө
                        </h4>
                        <ul className="list-disc list-inside space-y-2 text-sm">
                            <li>Ширээ, тавилга гялгар болтол арчих</li>
                            <li>Шургуулга, тавиур арчих</li>
                            <li>Хүндрэлийнгүй хүрэх боломжтой гадаргуу, тавцан цэвэрлэх</li>
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
                <div className="mt-10 w-full border border-red-200 rounded-lg shadow-md p-6 bg-red-50">
                    {/* Гарчиг */}
                    <h3 className="text-3xl font-bold text-red-700 text-center mb-10 tracking-wide">
                        🛑 Хамаарахгүй үйлчилгээнүүд
                    </h3>

                    {/* 6 баганатай Grid загвар (Урт, хөндлөн карт) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {[
                            {
                                title: 'Хүнд ачаа зөөвөрлөлт',
                                description: '25кг-аас дээш жинтэй тавилга, тоног төхөөрөмжийг зөөж, байршлыг нь өөрчлөхгүй.',
                                icon: (
                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-3.197m0 0l-3.197 3.197m3.197-3.197v4.524m7.341 4.525a1 1 0 01-1.414 0l-4.243-4.243a1 1 0 010-1.414l4.243-4.243a1 1 0 011.414 0l4.243 4.243a1 1 0 010 1.414l-4.243 4.243z"></path></svg>
                                )
                            },
                            {
                                title: 'Аюултай өндрийн цэвэрлэгээ',
                                description: 'Барилгын гадна талын болон хүрч үл болох өндөр цонх, ханын цэвэрлэгээг хийхгүй.',
                                icon: (
                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.368 18c-.77 1.333.192 3 1.732 3z"></path></svg>
                                )
                            },
                            {
                                title: 'Биологийн болон химийн бохирдол',
                                description: 'Хортой, био-аюултай, эрүүл мэндэд аюул учруулах бохирдол, хаягдлыг цэвэрлэхгүй.',
                                icon: (
                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                )
                            },
                            {
                                title: 'Барилгын дараах хог хаягдал',
                                description: 'Хүнд даацын, барилгын ажлын дараах тоос, шороо, хатуу хог хаягдлыг зайлуулах үйлчилгээнд хамаарахгүй.',
                                icon: (
                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                                )
                            },
                            {
                                title: 'Тусгай химийн бодис',
                                description: 'Хэвийн цэвэрлэгээнд хэрэглэдэггүй, онцгой толбо арилгах зориулалттай тусгай химийн бодис шаардах.',
                                icon: (
                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                )
                            },
                            {
                                title: 'Хэт их хог хаягдал',
                                description: 'Хэвийн хэмжээнээс хэтэрсэн, зориулалтын хогийн саванд багтахгүй хэмжээний хог хаягдлыг зөөхгүй.',
                                icon: (
                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                )
                            }
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="flex rounded-xl overflow-hidden shadow-xl transition duration-300 ease-in-out cursor-default 
                           hover:shadow-red-500/30 hover:scale-[1.02] bg-white border border-gray-200"
                            >
                                {/* Зүүн талын Хориглох тэмдэг */}
                                <div className="flex-shrink-0 w-20 flex items-center justify-center bg-red-600/90">
                                    {/* Хориглох тэмдэгний SVG */}
                                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>
                                </div>

                                {/* Баруун талын Мэдээлэл */}
                                <div className="p-4 flex flex-col justify-center">
                                    <h4 className="text-lg font-bold text-gray-800 mb-1 flex items-center">
                                        <span className="mr-2 text-red-600">{item.icon}</span>
                                        {item.title}
                                    </h4>
                                    <p className="text-sm text-gray-600 leading-snug">
                                        {item.description}
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
