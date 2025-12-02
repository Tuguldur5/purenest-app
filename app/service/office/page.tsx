import { RiH4 } from "react-icons/ri"

export default function ServiceCard() {
    const title = 'Оффис цэвэрлэгээ'
    return (
        <section className="container mx-auto  text-black px-4 py-10">
            <div className="container mx-auto border border-black/5 shadow-md p-4 rounded-lg">
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
                            <li>Шал угаах / шүүрдэх / вакуумдах</li>
                            <li>Ажлын ширээ, тавилгын гадаргуу арчих</li>
                            <li>Компьютер, монитор, тоног төхөөрөмжний гадаргууг аюулгүй арчих</li>
                            <li>Цонхны тавцан, хана, булангийн тоос арчих</li>
                            <li>Гэрлийн унтраалга, хаалганы бариул ариутгах</li>
                            <li>Хог хаягдал гаргах</li>
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
                            <li>Ширээ, тавилга, төхөөрөмжийн гадаргуу арчих</li>
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
                        className="inline-block px-6 py-3 pr-15 pl-15 rounded-lg border border-white/5 shadow-md bg-[#102B5A] text-white hover:text-amber-400 transition-colors duration-200"
                    >
                        Захиалах
                    </a>
                </div>

                <div className="flex flex-col mt-10 w-full items-center bg-[#C04A3A] border border-white/5shadow-md p-4 rounded-lg text-white">
                    <h3 className="text-xl font-medium text-center mb-3">
                       <strong> Хамаарахгүй үйлчилгээ</strong> 
                    </h3>
                    <p className="text-sm mb-3">
                        Аюулгүй байдал болон техникийн зааврын дагуу бид дараах ажлыг хийх боломжгүй:
                    </p>

                    <ul className="list-disc list-inside space-y-2 text-sm">
                        <li>25кг-аас дээш жинтэй тавилга өргөх, зөөх</li>
                        <li>Хүрэх боломжгүй өндөр талбай, гадна цонх угаах</li>
                        <li>Био-аюултай бохирдол (нүдэнд харагдах аюултай материал)</li>
                        <li>Барилгын дараах гүн цэвэрлэгээ</li>
                        <li>Гүн тогтсон, химийн тусгай бүтээгдэхүүн шаардсан толбо</li>
                        <li>Илүү их хог хуримтлагдсан, онцгой нөхцөлтэй аж ахуйн нэгж</li>
                    </ul>
                </div>
            </div>

           
        </section>
    )
}
