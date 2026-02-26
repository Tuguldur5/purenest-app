import ProductsClient from "./ProductsClient"

export const revalidate = 60 // 1 минут cache

export default async function ProductsPage() {
  const res = await fetch(
    "https://purenest-app.onrender.com/api/products",
    { next: { revalidate: 60 } }
  )

  if (!res.ok) {
    throw new Error("Бараа татахад алдаа гарлаа")
  }

  const products = await res.json()

  return <ProductsClient products={products} />
}