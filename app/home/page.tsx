import Link from 'next/link'
import ServiceCard from '../components/ServiceCard'


export default function Home() {
    const services = [
        { title: 'Гэр цэвэрлэгээ', desc: 'Шинэ, найдвартай гэр цэвэрлэгээ үйлчилгээ.' },
        { title: 'СӨХ цэвэрлэгээ', desc: 'Орон сууцны СӨХ, нийтлэг талбайн үйлчилгээ.' },
        { title: 'Олон нийтийн талбай', desc: 'Ажилбар, талбай цэвэрлэх тусгай баг.' },
    ]


    return (
        <section className="bg-white">
                <div>
                    <img  className='rounded-lg mb-7' src="./image.png" alt="Logo" width={1500} />
                </div>
            <div className="grid md:grid-cols-2 gap-8 items-center  text-black">
                
                <div>
                    <h1 className="text-4xl items-center font-bold">Тавтай морилно уу — Tseverlegee</h1>
                    <p className="mt-4 text-lg text-gray-700">Бидний найдвартай цэвэрлэгээ үйлчилгээ таны гэр болон талбайг цэвэр, эрүүл болгоно.</p>
                    <div className="mt-6 flex gap-4">
                        <Link href="/service" className="btn-primary bg-amber-300 border-gray-300 border p-3 rounded-lg">Үйлчилгээ</Link>
                        <Link href="/booking" className="btn-primary bg-emerald-200 border-gray-300 border p-3 rounded-lg">Захиалах</Link>
                    </div>
                </div>
                <div>
                    
                </div>
            </div>
        </section>
    )
}
