'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../utils/supabaseClient'
import toast, { Toaster } from 'react-hot-toast'

interface Catalog {
  id: string
  title: string
  artist: string
  summary: string | null
  explanation: string | null
  estimated_earnings?: number
}

export default function Catalogs() {
  const [catalogs, setCatalogs] = useState<Catalog[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push('/auth')
        return
      }

      const { data, error } = await supabase.from('catalogs').select('*')
      if (error) {
        console.error(error)
      } else {
        setCatalogs(data as Catalog[])
      }
      setLoading(false)
    }

    fetchData()
  }, [router])

  const handleSummarize = async (catalogId: string) => {
    setLoadingId(catalogId)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/summarize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ catalog_id: catalogId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to summarize')
      toast.success('Summary generated!')
      refreshCatalogs()
    } catch (err) {
      toast.error('Error generating summary')
      console.error(err)
    } finally {
      setLoadingId(null)
    }
  }

  const handleExplain = async (catalogId: string) => {
    setLoadingId(catalogId)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/explain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ catalog_id: catalogId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to explain')
      toast.success('Explanation generated!')
      refreshCatalogs()
    } catch (err) {
      toast.error('Error generating explanation')
      console.error(err)
    } finally {
      setLoadingId(null)
    }
  }

  const refreshCatalogs = async () => {
    const { data, error } = await supabase.from('catalogs').select('*')
    if (!error && data) {
      setCatalogs(data as Catalog[])
    }
  }

  if (loading) return <p className="p-6">Loading catalogs...</p>

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <Toaster position="top-right" />
      <h1 className="text-2xl font-bold mb-4">Your Catalogs</h1>
      <div className="space-y-6">
        {catalogs.map((catalog) => (
          <div
            key={catalog.id}
            className="bg-white p-6 rounded-xl shadow-sm border"
          >
            <h2 className="text-lg font-semibold">{catalog.title}</h2>
            <p className="text-sm text-gray-500 mb-1">by {catalog.artist}</p>

            {catalog.estimated_earnings && (
              <p className="text-sm text-gray-600 mb-3">
                <strong>Estimated Earnings (based on popularity):</strong>{' '}
                ${catalog.estimated_earnings.toLocaleString()}
                <span
                  title="This is a placeholder estimate using Spotify's popularity score, not actual royalty data."
                  className="ml-1 cursor-help text-gray-400"
                >
                  ⓘ
                </span>
              </p>
            )}

            <div className="flex gap-3 mb-4">
              <button
                onClick={() => handleSummarize(catalog.id)}
                disabled={loadingId === catalog.id}
                className={`px-3 py-2 rounded-lg font-medium text-white transition ${
                  loadingId === catalog.id
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loadingId === catalog.id ? 'Loading...' : 'Generate Summary'}
              </button>
              <button
                onClick={() => handleExplain(catalog.id)}
                disabled={loadingId === catalog.id}
                className={`px-3 py-2 rounded-lg font-medium text-white transition ${
                  loadingId === catalog.id
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {loadingId === catalog.id ? 'Loading...' : 'Explain'}
              </button>
            </div>

            {catalog.summary ? (
              <div className="bg-gray-100 p-4 rounded-xl text-sm text-gray-700 whitespace-pre-wrap">
                <strong>Summary:</strong>
                <br />
                {catalog.summary}
              </div>
            ) : (
              <p className="text-sm italic text-gray-400">No summary yet.</p>
            )}

            {catalog.explanation ? (
              <div className="bg-gray-100 mt-3 p-4 rounded-xl text-sm text-gray-700 whitespace-pre-wrap">
                <strong>Explanation:</strong>
                <br />
                {catalog.explanation}
              </div>
            ) : (
              <p className="text-sm italic text-gray-400">No explanation yet.</p>
            )}
          </div>
        ))}
      </div>
    </main>
  )
}

