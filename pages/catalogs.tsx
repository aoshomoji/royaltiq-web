'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabaseClient'
import { useRouter } from 'next/router'

export default function CatalogsPage() {
  const [catalogs, setCatalogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [expandedSummary, setExpandedSummary] = useState<{ [id: string]: boolean }>({})
  const [expandedExplanation, setExpandedExplanation] = useState<{ [id: string]: boolean }>({})

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data?.user)
    }

    const fetchCatalogs = async () => {
      const { data, error } = await supabase.from('catalogs').select('*')
      if (error) console.error('Error fetching catalogs:', error)
      else setCatalogs(data || [])
      setLoading(false)
    }

    fetchUser()
    fetchCatalogs()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/auth'
  }

  const toggleSummary = (id: string) => {
    setExpandedSummary((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const toggleExplanation = (id: string) => {
    setExpandedExplanation((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">RoyaltiQ</h1>
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{user.email}</span>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>

      <h2 className="text-xl font-semibold mb-4">Your Catalogs</h2>

      {loading ? (
        <p>Loading...</p>
      ) : catalogs.length === 0 ? (
        <p>No catalogs found.</p>
      ) : (
        <div className="space-y-6">
          {catalogs.map((catalog) => (
            <div key={catalog.id} className="p-4 border rounded bg-white">
              <h3 className="text-lg font-semibold">{catalog.title}</h3>
              <p className="text-sm text-gray-600 mb-1">by {catalog.artist}</p>

              {typeof catalog.earnings_last_12mo === 'number' && (
                <p className="font-semibold">
                  12-Month Earnings: ${catalog.earnings_last_12mo.toLocaleString()}
                </p>
              )}

              {typeof catalog.estimated_earnings === 'number' && (
                <p className="text-sm text-gray-600 mb-1">
                  Estimated Earnings (based on popularity):
                  <span className="font-medium">
                    {' '}
                    ${catalog.estimated_earnings.toLocaleString()}
                  </span>
                  <span
                    title="This is a placeholder estimate using Spotify's popularity score, not actual royalty data."
                    className="ml-1 cursor-help text-gray-400"
                  >
                    ⓘ
                  </span>
                </p>
              )}

              {typeof catalog.popularity === 'number' && (
                <p className="text-sm text-gray-600 mb-1">
                  Popularity: <span className="font-medium">{catalog.popularity}</span>
                </p>
              )}

              {typeof catalog.spotify_streams === 'number' && (
                <p className="text-sm text-gray-600 mb-1">
                  Spotify Streams: <span className="font-medium">{catalog.spotify_streams.toLocaleString()}</span>
                </p>
              )}

              {typeof catalog.youtube_views === 'number' && (
                <p className="text-sm text-gray-600 mb-1">
                  YouTube Views: <span className="font-medium">{catalog.youtube_views.toLocaleString()}</span>
                </p>
              )}

              {typeof catalog.valuation_score === 'number' && (
                <p className="text-sm text-gray-600 mb-1">
                  Valuation Score: <span className="font-medium">{catalog.valuation_score.toFixed(1)}</span>
                </p>
              )}

              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => toggleSummary(catalog.id)}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {expandedSummary[catalog.id] ? 'Hide Summary' : 'Generate Summary'}
                </button>
                <button
                  onClick={() => toggleExplanation(catalog.id)}
                  className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  {expandedExplanation[catalog.id] ? 'Hide Explanation' : 'Explain'}
                </button>
              </div>

              {expandedSummary[catalog.id] && catalog.summary && (
                <div className="mt-3">
                  <p className="font-medium mb-1">Summary:</p>
                  <p className="text-sm whitespace-pre-line text-gray-800">{catalog.summary}</p>
                </div>
              )}

              {expandedExplanation[catalog.id] && catalog.explanation && (
                <div className="mt-3">
                  <p className="font-medium mb-1">Explanation:</p>
                  <p className="text-sm whitespace-pre-line text-gray-800">{catalog.explanation}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

