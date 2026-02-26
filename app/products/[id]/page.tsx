import ProductClient from "../[id]/ProductClinet"

export const revalidate = 60

export default async function ProductPage({ params }: any) {
    const { id } = await params

    const res = await fetch(
        `https://purenest-app.onrender.com/api/products/${id}`,
        
        { next: { revalidate: 60 } }
    )

    if (!res.ok) {
        return <div className="text-center py-40">Бараа олдсонгүй</div>
    }

    const product = await res.json()

    // RELATED — backend дээр хийвэл бүр сайн
    const relatedRes = await fetch(
        `https://purenest-app.onrender.com/api/products?type=${product.type}`,
        { next: { revalidate: 60 } }
    )

    const related = await relatedRes.json()

    const relatedProducts = related
        .filter((p: any) => p.id !== product.id)
        .slice(0, 6)

    return (
        <ProductClient
            product={product}
            relatedProducts={relatedProducts}
        />
    )
}