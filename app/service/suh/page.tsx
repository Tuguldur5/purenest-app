import Link from "next/link";

export default function SokhService() {
  return (
    <section className="container mx-auto px-4 py-12 text-black">
      {/* TOP CARD */}
      <div className="bg-white border border-black/5 shadow-lg p-8 rounded-2xl">

        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-[#102B5A]">
          СӨХ-ийн цэвэрлэгээний үйлчилгээ
        </h2>

        <p className="text-center text-gray-600 text-sm md:text-base mb-10 max-w-2xl mx-auto">
          Манай үйлчилгээ нийтлэг талбай, шат, коридор болон бусад өндөр хэрэглээтэй
          орчинд зориулагдсан. Хэрэв шаардлагатай нэмэлт ажил байвал бидэнтэй холбогдон тохиролцоно.
        </p>

        {/* GRID */}
        <div className="grid gap-10 md:grid-cols-2">

          {/* LEFT CARD */}
          <div className="bg-gradient-to-b from-white to-gray-50 border border-gray-200 shadow-lg p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4 bg-[#102B5A] text-white p-3 rounded-lg">
              🏢 Нийтлэг талбай
            </h3>

            <ul className="space-y-3 text-gray-700 text-sm">
              <li>• Коридор, шат, үүдний талбай цэвэрлэх</li>
              <li>• Нийтийн тоног төхөөрөмж арчих</li>
              <li>• Ханын булан, хаалганы хүрээ тоос арчих</li>
              <li>• Лифт болон хүлээлгийн хэсэг</li>
              <li>• Хог ангилан гаргах</li>
            </ul>

            <h4 className="text-lg font-semibold mt-6 mb-3 bg-[#102B5A] text-white p-3 rounded-lg">
              🍽 Гал тогоо / Цайны хэсэг
            </h4>

            <ul className="space-y-3 text-gray-700 text-sm">
              <li>• Шал шүүрдэх / угаах</li>
              <li>• Ширээ, тавцан, угаалтуур</li>
              <li>• Ширээ, сандал арчих</li>
            </ul>

            <h4 className="text-lg font-semibold mt-6 mb-3 bg-[#102B5A] text-white p-3 rounded-lg">
              ➕ Нэмэлт (хүсэлтээр)
            </h4>

            <ul className="space-y-3 text-gray-700 text-sm">
              <li>• Шүүгээний дотор</li>
              <li>• Хөргөгч дотор</li>
              <li>• Шалны гүн цэвэрлэгээ</li>
              <li>• Их цэвэрлэгээ</li>
            </ul>
          </div>

          {/* RIGHT CARD */}
          <div className="bg-gradient-to-b from-white to-gray-50 border border-gray-200 shadow-lg p-6 rounded-xl">
            <h4 className="text-lg font-semibold mb-3 bg-[#102B5A] text-white p-3 rounded-lg">
              🚶 Хөдөлгөөн ихтэй талбай
            </h4>

            <ul className="space-y-3 text-gray-700 text-sm">
              <li>• Коридор, шат, хүлээлгийн хэсэг</li>
              <li>• Тоног төхөөрөмж арчих</li>
              <li>• Ханын булан, хаалганы хүрээ</li>
            </ul>

            <h4 className="text-lg font-semibold mt-6 mb-3 bg-[#102B5A] text-white p-3 rounded-lg">
              🚻 Ариун цэврийн өрөө
            </h4>

            <ul className="space-y-3 text-gray-700 text-sm">
              <li>• Суултуур, угаалтуур</li>
              <li>• Шал угаах</li>
              <li>• Толбо, хүрээ арилгах</li>
              <li>• Хогийн сав цэвэрлэх</li>
            </ul>

            <h4 className="text-lg font-semibold mt-6 mb-3 bg-[#102B5A] text-white p-3 rounded-lg">
              🪑 Удирдлагын өрөө / Тусгай өрөө
            </h4>

            <ul className="space-y-3 text-gray-700 text-sm">
              <li>• Ширээ, тавилга арчих</li>
              <li>• Шургуулга, тавиур</li>
              <li>• Тавцан, гадаргуу</li>
            </ul>
          </div>
        </div>

        {/* BUTTON */}
        <div className="mt-10 text-center">
          <Link
            href="/booking"
            className="inline-block px-8 py-3 rounded-lg shadow-md bg-[#102B5A] text-white font-medium hover:bg-[#0d2247] hover:text-amber-400 transition"
          >
            Захиалах
          </Link>
        </div>

        {/* EXCLUDED */}
        <div className="mt-12 p-6 rounded-xl bg-[#C04A3A] text-white shadow-lg">
          <h3 className="text-xl font-semibold text-center mb-3">🚫 Хамаарахгүй үйлчилгээ</h3>

          <p className="text-center text-sm mb-4 opacity-90">
            Аюулгүй байдал болон стандартын үүднээс дараах үйлчилгээг үзүүлэх боломжгүй:
          </p>

          <ul className="space-y-2 text-sm max-w-lg mx-auto">
            <li>• 25кг-аас дээш жинтэй тавилга зөөх</li>
            <li>• Хүрэх боломжгүй өндөр тааз</li>
            <li>• Био-аюултай бохирдол</li>
            <li>• Барилгын дараах цэвэрлэгээ</li>
            <li>• Онцгой нөхцөлтэй, хэт бохир байр</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
