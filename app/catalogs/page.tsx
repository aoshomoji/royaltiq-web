'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function CatalogsPage() {
  const [catalogs, setCatalogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [summaries, setSummaries] = useState<Record<string, string>>({})
  const [explanations, setExplanations] = useState<Record<string, string>>({})
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter()

  // 🔐 Auth protection
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) router.push('/')
    }
    checkSession()
  }, [router])

  useEffect(() => {
    const fetchCatalogs = async () => {
      const { data, error } = await supabase.from('catalogs').select('*');
      if (error) {
        console.error('Error fetching catalogs:', error);
        setErrorMsg('Failed to load catalogs. Please try again later.');
        setCatalogs([]); // Optionally clear any stale data
      } else {
        setCatalogs(data || []);
      }
      setLoading(false);
    };
    fetchCatalogs();
  }, []);

  const handleGenerate = async (
    type: 'summary' | 'explanation',
    catalog: any
  ) => {
    const setFn = type === 'summary' ? setSummaries : setExplanations
    const key = catalog.id

    setFn((prev) => ({ ...prev, [key]: 'Loading...' }))

    const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/${type}`

    const payload = {
      id: catalog.id,
      title: catalog.title,
      artist: catalog.artist,
      genre: catalog.genre ?? '',
      spotify_streams: parseInt(catalog.spotify_streams) || 0,
      youtube_views: parseInt(catalog.youtube_views) || 0,
      earnings_last_12mo: parseFloat(catalog.estimated_earnings) || 0,
      ...(type === 'explanation' && {
        valuation_score: parseFloat(catalog.valuation_score) || 0,
      }),
    }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await res.json()
    setFn((prev) => ({
      ...prev,
      [key]: data.summary || data.explanation || 'No content returned.',
    }))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="text-red-600 text-center mt-4">
        Error loading catalogs: {errorMsg}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Your Catalogs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {catalogs.map((catalog) => (
          <div key={catalog.id} className="p-4 border rounded shadow">
            <h2 className="font-bold">{catalog.title} - {catalog.artist}</h2>
            <p>Genre: {catalog.genre}</p>
            <p>Popularity: {catalog.popularity}</p>
            <p>Spotify Streams: {catalog.spotify_streams}</p>
            <p>YouTube Views: {catalog.youtube_views}</p>
            <p>Est. Earnings: ${catalog.estimated_earnings}</p>
            <p>Valuation Score: {catalog.valuation_score}</p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleGenerate('summary', catalog)}
                className="border px-2 py-1 rounded bg-blue-100"
              >
                Generate Summary
              </button>
              <button
                onClick={() => handleGenerate('explanation', catalog)}
                className="border px-2 py-1 rounded bg-green-100"
              >
                Generate Explanation
              </button>
            </div>
            {summaries[catalog.id] && (
              <div className="mt-2 text-sm bg-blue-50 p-2 rounded">
                <strong>Summary:</strong> {summaries[catalog.id]}
              </div>
            )}
            {explanations[catalog.id] && (
              <div className="mt-2 text-sm bg-green-50 p-2 rounded">
                <strong>Explanation:</strong> {explanations[catalog.id]}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
