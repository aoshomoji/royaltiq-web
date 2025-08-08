'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import CatalogCard from '../../../components/CatalogCard'

type Catalog = {
  catalog_id: string
  track_id: string
  title: string
  artist: string
  genre?: string
  popularity: number
  spotify_streams: number
  youtube_views: number
  estimated_earnings: number
  valuation_score: number
}

export default function CatalogsPage() {
  const [catalogs, setCatalogs] = useState<Catalog[]>([])
  const [loading, setLoading] = useState(true)
  const [summaries,     setSummaries]     = useState<Record<string, string>>({})
  const [explanations,  setExplanations]  = useState<Record<string, string>>({})
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const router = useRouter()

  /* auth check */
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.replace('/login')
    })
  }, [router])

  /* load catalogs */
  useEffect(() => {
    supabase.from('catalogs').select('*')
      .then(({ data, error }) => {
        if (error) setErrorMsg(error.message)
        else setCatalogs(data as Catalog[])
        setLoading(false)
      })
  }, [])

  /* call backend */
  const handleGenerate = async (
    type: 'summary' | 'explanation',
    catalog: Catalog
  ) => {
    const key   = catalog.catalog_id
    const setFn = type === 'summary' ? setSummaries : setExplanations
    setFn(prev => ({ ...prev, [key]: 'Loading…' }))

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${type}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: catalog.track_id,
        title: catalog.title,
        artist: catalog.artist,
        genre: catalog.genre ?? '',
        spotify_streams: catalog.spotify_streams,
        youtube_views:  catalog.youtube_views,
        earnings_last_12mo: catalog.estimated_earnings,
        ...(type === 'explanation' && { valuation_score: catalog.valuation_score })
      }),
    })

    const json = await res.json()
    setFn(prev => ({
      ...prev,
      [key]: json.summary || json.explanation || 'No content returned.',
    }))
  }

  /* UI */
  if (loading)
    return <p className="py-20 text-center">Loading…</p>

  if (errorMsg)
    return <p className="py-20 text-center text-red-600">{errorMsg}</p>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {catalogs.map(c => (
        <CatalogCard
          key={c.catalog_id}
          catalog={c}
          summary={summaries[c.catalog_id]}
          explanation={explanations[c.catalog_id]}
          onGenerate={handleGenerate}
        />
      ))}
    </div>
  )
}
