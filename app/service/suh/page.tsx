import Link from 'next/link'

export default function SokhService() {
    const title = 'СӨХ цэвэрлэгээ'
    return (
        <section className="container mx-auto px-4 py-10 text-black">
            <div className='container mx-auto border border-black/5 shadow-md p-4 rounded-lg'>
                <h2 className="text-3xl font-semibold mb-4 text-center">
                    СӨХ-ийн цэвэрлэгээнд юу багтдаг вэ?
                </h2>
                <p className="text-center text-sm mb-8 max-w-2xl mx-auto">
                    Манай СӨХ цэвэрлэгээний үйлчилгээ нийтлэг талбай, коридор, шатны хэсгүүдийг цэвэрлэнэ.
                    Хэрэв жагсаалтад байхгүй зүйл байгаа бол бидэнтэй холбогдон тохиролцоно.
                </p>
                <div className='grid gap-8 md:grid-cols-2'>
                <div className="border border-black/5 shadow-md p-3 rounded-lg">
                    <h3 className="text-xl font-medium mb-3 p-3 text-white bg-[#102B5A]">
                        СӨХ-ийн нийтлэг талбай
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-sm mb-6">
                        <li>Коридор, шат, үүдний талбайг цэвэрлэх</li>
                        <li>Ширээ, сандал, нийтийн төхөөрөмжүүдийг арчиж цэвэрлэх</li>
                        <li>Ханын булан, хаалганы хүрээ, самбар тоос арчих</li>
                        <li>Лифт, хүлээлгийн хэсэг, нийтийн суудлуудыг цэвэрлэх</li>
                        <li>Хог хаягдал гаргах, дахин боловсруулахыг ангилах</li>
                    </ul>

                    <h4 className="text-lg font-medium mb-2 p-3 text-white bg-[#102B5A]">
                        Гал тогоо / Цайны хэсэг
                    </h4>
                    <ul className="list-disc list-inside space-y-2 text-sm mb-6">
                        <li>Шал шүүрдэх / вакуумдах</li>
                        <li>Хоолны ширээ, тавцан, угаалтуур цэвэрлэх</li>
                        <li>Ширээ, сандал, шкафны гадаргууг арчих</li>
                    </ul>

                    <h3 className="text-xl font-medium mb-3 p-3 text-white bg-[#102B5A]">
                        Нэмэлт (хүсэлтээр)
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-sm mb-6">
                        <li>Шүүгээний дотор цэвэрлэгээ</li>
                        <li>Хөргөгч доторх цэвэрлэгээ</li>
                        <li>Шалны гүн цэвэрлэгээ</li>
                        <li>Их цэвэрлэгээ (тогтмол засвар, тохижилт гэх мэт)</li>
                    </ul>
                </div>

                {/* RIGHT */}
                <div className="p-3 border border-black/5 shadow-md rounded-lg">
                    <h4 className="text-lg font-medium mb-2 p-3 text-white bg-[#102B5A]">
                        Хөдөлгөөн ихтэй талбай
                    </h4>
                    <ul className="list-disc list-inside space-y-2 text-sm mb-6">
                        <li>Коридор, шат, хүлээлгийн өрөө</li>
                        <li>Ширээ, сандал, тоног төхөөрөмжийн гадаргуу арчих</li>
                        <li>Ханын булан, хаалганы хүрээ, самбар арчих</li>
                    </ul>

                    <h4 className="text-lg font-medium mb-2 p-3 text-white bg-[#102B5A]">
                        Ариун цэврийн өрөө
                    </h4>
                    <ul className="list-disc list-inside space-y-2 text-sm mb-6">
                        <li>Суултуур, угаалтуур, шүршүүр</li>
                        <li>Шал цэвэрлэх</li>
                        <li>Толбо, хүрээ арилгах</li>
                        <li>Саван, хогийн сав цэвэрлэх</li>
                    </ul>

                    <h4 className="text-lg font-medium mb-2 p-3 text-white bg-[#102B5A]">
                        Удирдлагын өрөө / Тусгай өрөө
                    </h4>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                        <li>Ширээ, тавилга гялгар болтол арчих</li>
                        <li>Шургуулга, тавиур арчих</li>
                        <li>Хүндрэлийнгүй хүрэх боломжтой гадаргуу, тавцан цэвэрлэх</li>
                    </ul>
                </div>
            </div>

                <div className="mt-6 text-center ">
                    <Link
                        href={`/booking?service=${encodeURIComponent(title)}`}
                        className="inline-block px-6 py-3 rounded-lg border bg-black text-white hover:text-[#E3BE72] transition-colors duration-200"
                    >
                        Захиалах
                    </Link>
                </div>
                <div className="flex flex-col mt-10 w-full items-center bg-[#C04A3A] border border-white/5 shadow-md p-4 rounded-lg text-white">
                    <h3 className="text-xl font-medium text-center mb-3">
                        <strong>Хамаарахгүй үйлчилгээ</strong>
                    </h3>
                    <p className="text-sm mb-3">
                        СӨХ-ийн нийтлэг талбайн аюулгүй байдлыг хангах үүднээс дараах ажлыг хийх боломжгүй:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                        <li>25кг-аас дээш жинтэй тавилга зөөх</li>
                        <li>Хүрэх боломжгүй өндөр тааз, гадна цонх угаах</li>
                        <li>Био-аюултай бохирдол</li>
                        <li>Барилгын дараах гүн цэвэрлэгээ</li>
                        <li>Илүү их хог хуримтлагдсан, онцгой нөхцөлтэй байр</li>
                    </ul>
                </div>
            </div>
        </section>
    )
}
