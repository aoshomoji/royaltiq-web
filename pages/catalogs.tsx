'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabaseClient'
import { useRouter } from 'next/router'

export default function CatalogsPage() {
  const [catalogs, setCatalogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [showSummary, setShowSummary] = useState<{ [key: string]: boolean }>({})
  const [showExplanation, setShowExplanation] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    const fetchCatalogs = async () => {
      const { data, error } = await supabase.from('catalogs').select('*')
      if (error) console.error('Error fetching catalogs:', error)
      else setCatalogs(data || [])
      setLoading(false)
    }

    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user || null)
    }

    fetchCatalogs()
    getUser()
  }, [])

  const generateSummary = async (id: number) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/summarize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ catalog_id: id }),
    })
    if (res.ok) {
      setShowSummary((prev) => ({ ...prev, [id]: true }))
    }
  }

  const generateExplanation = async (id: number) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/explain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ catalog_id: id }),
    })
    if (res.ok) {
      setShowExplanation((prev) => ({ ...prev, [id]: true }))
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/auth'
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">RoyaltiQ</h1>
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">{user.email}</span>
            <button
              onClick={handleSignOut}
              className="text-sm px-3 py-1 bg-gray-100 border rounded hover:bg-gray-200"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>

      <h2 className="text-xl font-bold mb-4">Your Catalogs</h2>
      {loading ? (
        <p>Loading...</p>
      ) : catalogs.length === 0 ? (
        <p>No catalogs found.</p>
      ) : (
        <div className="space-y-6">
          {catalogs.map((catalog) => (
            <div key={catalog.id} className="p-4 border rounded-lg bg-white shadow-sm">
              <h3 className="text-lg font-semibold">{catalog.title}</h3>
              <p className="text-sm text-gray-500 mb-2">by {catalog.artist}</p>

              {catalog.estimated_earnings !== undefined && (
                <p className="text-sm text-gray-600 mb-1">
                  Estimated Earnings (based on popularity):
                  <span className="font-medium"> ${catalog.estimated_earnings.toLocaleString()}</span>
                  <span
                    title="This is a placeholder estimate using Spotify's popularity score, not actual royalty data."
                    className="ml-1 cursor-help text-gray-400"
                  >
                    ⓘ
                  </span>
                </p>
              )}

              {catalog.valuation_score !== undefined && (
                <p className="text-sm text-gray-700">
                  Valuation Score: <span className="font-medium">{catalog.valuation_score}</span>
                </p>
              )}
              {catalog.popularity !== undefined && (
                <p className="text-sm text-gray-700">
                  Spotify Popularity: <span className="font-medium">{catalog.popularity}</span>
                </p>
              )}
              {catalog.spotify_streams !== undefined && (
                <p className="text-sm text-gray-700">
                  Spotify Streams: <span className="font-medium">{catalog.spotify_streams.toLocaleString()}</span>
                </p>
              )}
              {catalog.youtube_views !== undefined && (
                <p className="text-sm text-gray-700">
                  YouTube Views: <span className="font-medium">{catalog.youtube_views.toLocaleString()}</span>
                </p>
              )}

              <div className="mt-3 space-x-2">
                <button
                  onClick={() => generateSummary(catalog.id)}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Generate Summary
                </button>
                <button
                  onClick={() => generateExplanation(catalog.id)}
                  className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Explain
                </button>
              </div>

              {showSummary[catalog.id] && catalog.summary && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-800 mb-1">Summary:</p>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{catalog.summary}</p>
                </div>
              )}

              {showExplanation[catalog.id] && catalog.explanation && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-800 mb-1">Explanation:</p>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{catalog.explanation}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

