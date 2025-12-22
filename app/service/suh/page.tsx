import Link from 'next/link'

export default function PublicSpaceService() {
    const title = 'СӨХ'
    return (
        <section className="container mx-auto px-4 py-10 text-black">
            <div className='container mx-auto  p-4 rounded-lg'>
                <h1 className="text-3xl font-semibold mb-4 text-center">{title} цэвэрлэгээнд юу багтдаг вэ?</h1>

                <p className="mb-6 text-sm text-center">
                    Орон сууцны байр, СӨХ-ийн нийтийн эзэмшлийн талбай, шатны хонгил, коридор, лифт болон үйлчилгээний талбайд зориулсан өдөр тутмын болон гүн цэвэрлэгээний үйлчилгээ.
                </p>

                <div className="grid gap-8 md:grid-cols-2">
                    {/* LEFT */}
                    <div className="border border-black/5 shadow-md p-3 rounded-lg">
                        <h4 className=" font-medium mb-3 p-3 text-white bg-[#102B5A]">
                            Нийтийн эзэмшлийн талбай
                        </h4>
                        <ul className="list-disc list-inside space-y-2 text-sm mb-6">
                            <li>Шатны хонгил шал угаах / шүүрдэх</li>
                            <li>Коридор, лифт цэвэрлэх</li>
                            <li>Ханын булан, хаалганы хүрээ арчих</li>
                            <li>Гэрлийн унтраалга, бариул ариутгах</li>
                            <li>Хог ангилж гаргах</li>
                        </ul>

                        <h4 className=" font-medium mb-2 p-3 text-white bg-[#102B5A]">
                            Нийтийн гал тогоо / амралтын хэсэг
                        </h4>
                        <ul className="list-disc list-inside space-y-2 text-sm mb-6">
                            <li>Хог гаргах</li>
                            <li>Шал цэвэрлэх</li>
                            <li>Ширээ, тавцан арчих</li>
                            <li>Гадна тавилга арчих</li>
                        </ul>

                        <h4 className="font-medium mb-3 p-3 text-white bg-[#102B5A]">
                            Нэмэлт (захиалгаар)
                        </h4>
                        <ul className="list-disc list-inside space-y-2 text-sm mb-6">
                            <li>Шүүгээ дотор цэвэрлэгээ</li>
                            <li>Хөргөгч дотор цэвэрлэх</li>
                            <li>Шалны гүн цэвэрлэгээ</li>
                            <li>Арга хэмжээний дараах гүн цэвэрлэгээ</li>
                        </ul>
                    </div>

                    {/* RIGHT */}
                    <div className="p-3 border border-black/5 shadow-md rounded-lg">
                        <h4 className="font-medium mb-2 p-3 text-white bg-[#102B5A]">
                            Хөдөлгөөн ихтэй бүсүүд
                        </h4>
                        <ul className="list-disc list-inside space-y-2 text-sm mb-6">
                            <li>Шат, коридор, лифт орчим</li>
                            <li>Тавилга, тоног төхөөрөмж арчих</li>
                            <li>Ханын булан, бариул арчих</li>
                        </ul>

                        <h4 className="font-medium mb-2 p-3 text-white bg-[#102B5A]">
                            Ариун цэврийн өрөө
                        </h4>
                        <ul className="list-disc list-inside space-y-2 text-sm mb-6">
                            <li>Суултуур, угаалтуур цэвэрлэх</li>
                            <li>Шал угаах</li>
                            <li>Толбо арилгах</li>
                            <li>Саван, хогийн сав цэвэрлэх</li>
                        </ul>

                        <h4 className="font-medium mb-2 p-3 text-white bg-[#102B5A]">
                            Тусгай өрөө
                        </h4>
                        <ul className="list-disc list-inside space-y-2 text-sm">
                            <li>Тавилга, тавцан гялгар болтол арчих</li>
                            <li>Шургуулга, тавиур арчих</li>
                            <li>Хүрэх боломжтой бүх гадаргууг цэвэрлэх</li>
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

                <div className="mt-10 w-full p-6 bg-red-50 border border-red-200 rounded-lg shadow-md">
                    {/* Гарчиг */}
                    <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">
                        ❌ Үйлчилгээнд Хамаарахгүй Зүйлс
                    </h3>

                    {/* 6 баганатай Grid загвар */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">

                        {/* Карт 1: 25кг-аас дээш жинтэй тавилга зөөх */}
                        <div className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-lg shadow-lg text-gray-700 
                        transition duration-300 ease-in-out hover:bg-red-50 hover:shadow-xl hover:border-red-400 cursor-default">
                            <svg className="w-8 h-8 text-red-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                            <p className="text-xs font-semibold text-center leading-tight">25кг-аас дээш жинтэй тавилга зөөх</p>
                        </div>

                        {/* Карт 2: Гадна өндөр цонх цэвэрлэгээ */}
                        <div className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-lg shadow-lg text-gray-700
                        transition duration-300 ease-in-out hover:bg-red-50 hover:shadow-xl hover:border-red-400 cursor-default">
                            {/* Icon: Өндөрлөг/Аюул (Exclamation mark in Triangle) */}
                            <svg className="w-8 h-8 text-red-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.368 18c-.77 1.333.192 3 1.732 3z"></path></svg>
                            <p className="text-xs font-semibold text-center leading-tight">Гадна өндөр цонх цэвэрлэгээ</p>
                        </div>

                        {/* Карт 3: Био-аюултай бохирдол */}
                        <div className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-lg shadow-lg text-gray-700
                        transition duration-300 ease-in-out hover:bg-red-50 hover:shadow-xl hover:border-red-400 cursor-default">
                            {/* Icon: Аюулын тэмдэг (Biohazard/Radiation symbol) */}
                            <svg className="w-8 h-8 text-red-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <p className="text-xs font-semibold text-center leading-tight">Био-аюултай бохирдол</p>
                        </div>

                        {/* Карт 4: Барилгын дараах цэвэрлэгээ */}
                        <div className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-lg shadow-lg text-gray-700
                        transition duration-300 ease-in-out hover:bg-red-50 hover:shadow-xl hover:border-red-400 cursor-default">
                            {/* Icon: Хүрз (Shovel/Construction) */}
                            <svg className="w-8 h-8 text-red-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <p className="text-xs font-semibold text-center leading-tight">Барилгын дараах цэвэрлэгээ</p>
                        </div>

                        {/* Карт 5: Онцгой толбо арилгах тусгай бодис */}
                        <div className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-lg shadow-lg text-gray-700
                        transition duration-300 ease-in-out hover:bg-red-50 hover:shadow-xl hover:border-red-400 cursor-default">
                            {/* Icon: Титэм (Special/Crown) эсвэл химийн шингэн */}
                            <svg className="w-8 h-8 text-red-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 21h4V3h-4v18zm8-18h4v18h-4V3zM2 3h4v18H2V3z"></path></svg>
                            <p className="text-xs font-semibold text-center leading-tight">Онцгой толбо арилгах тусгай бодис</p>
                        </div>

                        {/* Карт 6: Хэт их хогтой талбай */}
                        <div className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-lg shadow-lg text-gray-700
                        transition duration-300 ease-in-out hover:bg-red-50 hover:shadow-xl hover:border-red-400 cursor-default">
                            {/* Icon: Хогийн сав (Trash Bin) */}
                            <svg className="w-8 h-8 text-red-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            <p className="text-xs font-semibold text-center leading-tight">Хэт их хогтой талбай</p>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    )
}
