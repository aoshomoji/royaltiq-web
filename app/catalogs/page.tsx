import CatalogCard from "./CatalogCard"

export default async function CatalogsPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/catalogs`)
  const catalogs = await res.json()

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-6">Catalogs</h1>
      {catalogs.map((catalog: any) => (
        <CatalogCard key={catalog.id} catalog={catalog} />
      ))}
    </div>
  )
}
