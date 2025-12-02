import Link from 'next/link'

export default function PublicSpaceService() {
    const title = 'Олон нийтийн талбай'
    return (
        <section className="container mx-auto px-4 py-10 text-black">
            <div className='container mx-auto border border-black/5 shadow-md p-4 rounded-lg'>
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
                <div className="flex flex-col mt-10 w-full items-center bg-[#C04A3A] border border-white/5 shadow-md p-4 rounded-lg text-white">
                    <h3 className="text-xl font-medium text-center mb-3">
                        <strong>Хамаарахгүй үйлчилгээ</strong>
                    </h3>
                    <p className="text-sm mb-3">
                        Олон нийтийн талбайн аюулгүй байдал болон техник шаардлагын улмаас дараах үйлчилгээг үзүүлэх боломжгүй:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                        <li>25кг-аас дээш жинтэй тавилга зөөх</li>
                        <li>Хүрэх боломжгүй өндөр цонх, гадна талбайн цэвэрлэгээ</li>
                        <li>Био-аюултай бохирдол</li>
                        <li>Барилгын дараах гүн цэвэрлэгээ</li>
                        <li>Гүн тогтсон толбо, химийн тусгай бүтээгдэхүүн шаардсан цэвэрлэгээ</li>
                        <li>Илүү их хог хуримтлагдсан онцгой нөхцөлтэй талбай</li>
                    </ul>
                </div>
            </div>
        </section>
    )
}
