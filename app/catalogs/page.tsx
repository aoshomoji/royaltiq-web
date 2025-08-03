'use client'
import { useEffect, useState } from 'react'

export default function CatalogsPage() {
  const [catalogs, setCatalogs] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/mockCatalogs')  // Replace with Supabase or real API
      .then((res) => res.json())
      .then(setCatalogs)
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-semibold">Your Catalogs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {catalogs.map((catalog) => (
          <div key={catalog.id} className="p-4 border rounded shadow">
            <h2 className="font-bold">{catalog.title} - {catalog.artist}</h2>
            <p>Popularity: {catalog.popularity}</p>
            <p>Spotify Streams: {catalog.spotify_streams}</p>
            <p>YouTube Views: {catalog.youtube_views}</p>
            <p>Est. Earnings: ${catalog.estimated_earnings}</p>
            <p>Valuation Score: {catalog.valuation_score}</p>
            <div className="flex gap-2 mt-2">
              <button className="border px-2 py-1 rounded bg-blue-100">Generate Summary</button>
              <button className="border px-2 py-1 rounded bg-green-100">Generate Explanation</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
