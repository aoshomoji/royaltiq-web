'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

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

  const handleGenerate = async (
    type: 'summary' | 'explanation',
    catalog: any,
    setState: (msg: string) => void
  ) => {
    setState('Loading...')

    const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/${type}`

    const payload =
      type === 'summary'
        ? {
            id: catalog.id,
            title: catalog.title,
            artist: catalog.artist,
            genre: catalog.genre,
            spotify_streams: catalog.spotify_streams,
            youtube_views: catalog.youtube_views,
            earnings_last_12mo: catalog.estimated_earnings,
          }
        : {
            id: catalog.id,
            title: catalog.title,
            artist: catalog.artist,
            genre: catalog.genre,
            spotify_streams: catalog.spotify_streams,
            youtube_views: catalog.youtube_views,
            earnings_last_12mo: catalog.estimated_earnings,
            valuation_score: catalog.valuation_score,
          }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await res.json()
    if (data.error) setState('Error: ' + data.error)
    else setState(data.summary || data.explanation || 'No content returned.')
  }

  if (loading) return <p>Loading...</p>

  return (
    <div>
      <h1 className="text-2xl font-semibold">Your Catalogs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {catalogs.map((catalog) => {
          const [summary, setSummary] = useState('')
          const [explanation, setExplanation] = useState('')

          return (
            <div key={catalog.id} className="p-4 border rounded shadow">
              <h2 className="font-bold">{catalog.title} - {catalog.artist}</h2>
              <p>Popularity: {catalog.popularity}</p>
              <p>Spotify Streams: {catalog.spotify_streams}</p>
              <p>YouTube Views: {catalog.youtube_views}</p>
              <p>Est. Earnings: ${catalog.estimated_earnings}</p>
              <p>Valuation Score: {catalog.valuation_score}</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleGenerate('summary', catalog, setSummary)}
                  className="border px-2 py-1 rounded bg-blue-100"
                >
                  Generate Summary
                </button>
                <button
                  onClick={() => handleGenerate('explanation', catalog, setExplanation)}
                  className="border px-2 py-1 rounded bg-green-100"
                >
                  Generate Explanation
                </button>
              </div>
              {summary && (
                <div className="mt-2 text-sm bg-blue-50 p-2 rounded">
                  <strong>Summary:</strong> {summary}
                </div>
              )}
              {explanation && (
                <div className="mt-2 text-sm bg-green-50 p-2 rounded">
                  <strong>Explanation:</strong> {explanation}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
