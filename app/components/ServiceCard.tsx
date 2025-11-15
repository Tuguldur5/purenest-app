export default function ServiceCard({ title, desc }: { title: string; desc: string }) {
    return (
        <div className="border rounded-lg p-4 hover:shadow-lg transition">
            <h3 className="text-lg font-semibold hover-mustard">{title}</h3>
            <p className="mt-2 text-sm text-gray-600">{desc}</p>
            <button className="mt-4 btn-primary border-gray-200 hover:border-transparent hover:shadow">Book</button>
        </div>
    )
}