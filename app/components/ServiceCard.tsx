"use client";
import { useRouter } from "next/navigation";

type Props = {
  title: string
  desc: string
  included: string[]
  extras: string[]
  excluded: string[]
}

export default function ServiceCard({ title, desc, included, extras, excluded }: Props) {

  const router = useRouter(); // ← ЭНД БАЙХ ЁСТОЙ

  const goToBooking = () => {
    router.push("/booking");
  };

  return (
    <div className="bg-white rounded-[14px] shadow-lg p-6 flex flex-col justify-between border border-black/5 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-4">
      <div>
        <h3 className="text-xl font-bold mb-2 text-[#102B5A]">{title}</h3>
        <p className="text-gray-700 mb-4">{desc}</p>

        {/* багцахууд */}
        <div className="mb-4">
          <h4 className="font-semibold text-gray-800 mb-1">Үүнд багтсан:</h4>
          <ul className="list-disc list-inside text-gray-600 text-sm">
            {included.map((item, idx) => <li key={idx}>{item}</li>)}
          </ul>
        </div>

        <div className="mb-4">
          <h4 className="font-semibold text-gray-800 mb-1">Нэмэлт үйлчилгээ:</h4>
          <ul className="list-disc list-inside text-gray-600 text-sm">
            {extras.map((item, idx) => <li key={idx}>{item}</li>)}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-1">Оролцоогүй зүйлс:</h4>
          <ul className="list-disc list-inside text-gray-600 text-sm">
            {excluded.map((item, idx) => <li key={idx}>{item}</li>)}
          </ul>
        </div>
      </div>

      <button
        onClick={goToBooking}
        className="mt-6 w-full py-2 rounded-[14px] bg-emerald-400 hover:bg-emerald-500 text-white font-semibold transition-all duration-300"
      >
        Захиалга өгөх
      </button>
    </div>
  );
}
