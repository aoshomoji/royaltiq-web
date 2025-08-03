'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function CatalogsPage() {
  const [catalogs, setCatalogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCatalogs = async () => {
      const { data, error } = await supabase.from('catalogs').select('*')
      if (error) console.error('Error fetching catalogs:', error)
      else setCatalogs(data || [])
      setLoading(false)
    }

    fetchCatalogs()
  }, [])

  if (loading) return <p>Loading...</p>

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
          </div>
        ))}
      </div>
    </div>
  )
}

