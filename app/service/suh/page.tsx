import Link from 'next/link'

export default function PublicSpaceService() {
    const title = 'СӨХ'
    return (
        <section className="container mx-auto px-4 py-10 text-black">
            <div className='container mx-auto border border-black/5 shadow-md p-4 rounded-lg'>
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

                <div className="flex flex-col mt-10 w-full items-center bg-[#C04A3A] border border-white/5 shadow-md p-4 rounded-lg text-white">
                    <h3 className="text-xl font-medium text-center mb-3">
                        <strong>Хамаарахгүй үйлчилгээ</strong>
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                        <li>25кг-аас дээш жинтэй тавилга зөөх</li>
                        <li>Гадна өндөр цонх цэвэрлэгээ</li>
                        <li>Био-аюултай бохирдол</li>
                        <li>Барилгын дараах цэвэрлэгээ</li>
                        <li>Онцгой толбо арилгах тусгай бодис</li>
                        <li>Хэт их хогтой талбай</li>
                    </ul>
                </div>
            </div>
        </section>
    )
}
