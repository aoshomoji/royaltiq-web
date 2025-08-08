'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import CatalogCard from '../../components/CatalogCard'


export default function CatalogsPage() {
  const [catalogs, setCatalogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [summaries, setSummaries] = useState<Record<string, string>>({})
  const [explanations, setExplanations] = useState<Record<string, string>>({})
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter()

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
        setCatalogs([])
      } else {
        setCatalogs(data || [])
      }
      setLoading(false)
    };
    fetchCatalogs()
  }, [])

  const handleGenerate = async (
    type: 'summary' | 'explanation',
    catalog: any
  ) => {
    const setFn = type === 'summary' ? setSummaries : setExplanations
    const key = catalog.catalog_id

    setFn((prev) => ({ ...prev, [key]: 'Loading...' }))

    const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/${type}`

    const payload = {
      id: catalog.track_id,
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
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

  if (!loading && catalogs.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">No catalogs yet</h1>
        <p className="text-slate-600 mb-6 text-center max-w-sm">
          Import an artist’s top tracks to start valuing music royalties.
        </p>
  
        <a
          href="/admin/import"
          className="inline-block rounded-lg bg-emerald-600 px-6 py-3 text-white font-medium hover:bg-emerald-700 transition"
        >
          Import from Spotify
        </a>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="h-2 bg-emerald-600 mb-4 rounded"></div>
      <h1 className="text-3xl font-bold text-slate-800 mb-6">🎵 Your Catalogs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {catalogs.map((catalog) => (
          <CatalogCard
            key={catalog.catalog_id}
            catalog={catalog}
            summary={summaries[catalog.catalog_id]}
            explanation={explanations[catalog.catalog_id]}
            onGenerate={handleGenerate}
          />
        ))}
      </div>
    </div>
  )
}
