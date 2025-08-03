'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../utils/supabaseClient'
import toast, { Toaster } from 'react-hot-toast'
import Layout from './layout'

export default function CatalogsPage() {
  const [catalogs, setCatalogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchCatalogs = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth')
        return
      }

      const { data, error } = await supabase.from('catalogs').select('*')
      if (error) console.error('Error fetching catalogs:', error)
      else setCatalogs(data || [])
      setLoading(false)
    }

    fetchCatalogs()
  }, [router])

  const refreshCatalogs = async () => {
    const { data, error } = await supabase.from('catalogs').select('*')
    if (!error && data) setCatalogs(data)
  }

  const handleAction = async (catalogId: string, type: 'summarize' | 'explain') => {
    setLoadingId(catalogId)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ catalog_id: catalogId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || `Failed to ${type}`)
      toast.success(`${type === 'summarize' ? 'Summary' : 'Explanation'} generated!`)
      await refreshCatalogs()
    } catch (err) {
      console.error(err)
      toast.error(`Error generating ${type}`)
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <Layout>
      <main className="p-6 bg-gray-50 min-h-screen">
        <Toaster position="top-right" />
        <h1 className="text-2xl font-bold mb-6">Your Catalogs</h1>

        {loading ? (
          <p>Loading catalogs...</p>
        ) : catalogs.length === 0 ? (
          <p>No catalogs found.</p>
        ) : (
          <div className="space-y-6">
            {catalogs.map((catalog) => (
              <div key={catalog.id} className="bg-white p-6 rounded-xl shadow-sm border">
                <h2 className="text-xl font-semibold">{catalog.title}</h2>
                <p className="text-sm text-gray-500 mb-1">by {catalog.artist}</p>

                {catalog.estimated_earnings && (
                  <p className="text-sm text-gray-600 mb-2">
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

                {catalog.earnings_last_12mo && (
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>12-Month Earnings:</strong> ${catalog.earnings_last_12mo.toLocaleString()}
                  </p>
                )}

                {catalog.streams && (
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Spotify Streams:</strong> {catalog.streams.toLocaleString()}
                  </p>
                )}

                {catalog.views && (
                  <p className="text-sm text-gray-600 mb-3">
                    <strong>YouTube Views:</strong> {catalog.views.toLocaleString()}
                  </p>
                )}

                <div className="flex gap-3 mb-4">
                  <button
                    onClick={() => handleAction(catalog.id, 'summarize')}
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
                    onClick={() => handleAction(catalog.id, 'explain')}
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

                {catalog.summary && (
                  <div className="bg-gray-100 p-4 rounded-xl text-sm text-gray-700 whitespace-pre-wrap">
                    <strong>Summary:</strong>
                    <br />
                    {catalog.summary}
                  </div>
                )}

                {catalog.explanation && (
                  <div className="bg-gray-100 mt-3 p-4 rounded-xl text-sm text-gray-700 whitespace-pre-wrap">
                    <strong>Explanation:</strong>
                    <br />
                    {catalog.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </Layout>
  )
}

