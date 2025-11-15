
import ServiceCard from '../components/ServiceCard'


export default function ServicePage() {
    const items = [
        { title: 'Гэр цэвэрлэгээ', desc: 'Зөв зохион байгуулалттай байшингийн цэвэрлэгээ.' },
        { title: 'СӨХ үйлчилгээ', desc: 'Орон сууцны нийтлэг талбайн цэвэрлэгээ.' },
        { title: 'Олон нийтийн талбай', desc: 'Сургалт, арга хэмжээний дараах цэвэрлэгээ.' },
    ]
    return (
        <section className='text-black'>
            <h2 className="text-2xl font-semibold mb-4 text-center text-black">Манай үйлчилгээ</h2>
            <div className="grid md:grid-cols-3 gap-6">
                {items.map(i => (
                    <ServiceCard key={i.title} title={i.title} desc={i.desc} />
                ))}
            </div>
        </section>
    )
}