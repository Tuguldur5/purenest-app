

type Props = {
  title: string
  desc: string
  included: string[]
  extras: string[]
  excluded: string[]
}
const services = [
        {
            title: 'Оффис цэвэрлэгээ',
            desc: 'Бидний найдвартай оффис цэвэрлэгээ таны ажлын орчинг цэвэр, эрүүл болгоно.',
            included: [
                "Шал угаах / шүүрдэх",
                "Ширээ, тавилга цэвэрлэх",
                "Компьютер, тоног төхөөрөмж цэвэрлэх",
            ],
            extras: [
                "Хөргөгч, шүүгээ дотор цэвэрлэх",
                "Нүүж орох / гарах цэвэрлэгээ",
            ],
            excluded: [
                "11.3 кг-аас хүнд зүйл өргөх",
                "Гадаах экстерьер цэвэрлэгээ",
            ],
        },
        {
            title: 'СӨХ цэвэрлэгээ',
            desc: 'Орон сууцны СӨХ-ийн нийтлэг талбайн цэвэрлэгээ.',
            included: [
                "Коридор, шатны шал цэвэрлэх",
                "Суудал, тавилга тоос арчих",
                "Ширээ, сандал арчих",
            ],
            extras: ["Хивс / шалыг нэмэлт цэвэрлэх"],
            excluded: [
                "Био-аюултай бохирдол",
                "Том арга хэмжээний дараах их цэвэрлэгээ",
            ],
        },
        {
            title: 'Олон нийтийн талбай',
            desc: 'Олон нийтийн талбайн цэвэрлэгээ, ажилбар, гадаргуу.',
            included: [
                "Шал, гадаргуу цэвэрлэх",
                "Тоног төхөөрөмж арчих",
                "Цонх, хаалга арчих",
            ],
            extras: ["Нэмэлт тоног төхөөрөмж цэвэрлэх"],
            excluded: [
                "Барилгын дараах их цэвэрлэгээ",
                "Hoarding нөхцөлтэй байшин",
            ],
        },
    ]

export default function ServiceCard({ title, desc, included, extras, excluded }: Props) {
  return (
    <div className="border border-black/5 shadow-md rounded-lg p-4 hover:shadow-lg transition">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{desc}</p>

      <h4 className="font-medium mt-4">Included</h4>
      <ul className="list-disc list-inside text-sm">{included.map((item, i) => <li key={i}>{item}</li>)}</ul>

      <h4 className="font-medium mt-4">Extras</h4>
      <ul className="list-disc list-inside text-sm">{extras.map((item, i) => <li key={i}>{item}</li>)}</ul>

      <h4 className="font-medium mt-4">Excluded</h4>
      <ul className="list-disc list-inside text-sm">{excluded.map((item, i) => <li key={i}>{item}</li>)}</ul>
    </div>
  )
}
