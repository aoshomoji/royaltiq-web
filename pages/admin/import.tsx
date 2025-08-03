'use client'

import { useState } from 'react'
import { supabase } from '../utils/supabaseClient'

export default function ImportPage() {
  const [artistId, setArtistId] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleImport = async () => {
    if (!artistId) return

    setLoading(true)
    setMessage('')

    const res = await fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=GB`, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SPOTIFY_ACCESS_TOKEN}`,
      },
    })

    const json = await res.json()
    const tracks = json.tracks || []

    for (const track of tracks) {
      const popularity = track.popularity || 0
      const spotifyStreams = Math.round(popularity * 50000)
      const youtubeViews = Math.round(popularity * 100000)
      const estimatedEarnings = Math.round(popularity * 5000)
      const valuationScore = Math.min(100, Math.round((popularity / 100) * 80 + Math.random() * 20))

      const { error } = await supabase.from('catalogs').insert([
        {
          id: track.id,
          title: track.name,
          artist: track.artists.map((a: any) => a.name).join(', '),
          popularity,
          spotify_streams: spotifyStreams,
          youtube_views: youtubeViews,
          estimated_earnings: estimatedEarnings,
          valuation_score: valuationScore,
          summary: null,
          explanation: null,
        },
      ])

      if (error) {
        console.error('Insert error:', error)
        setMessage('Import failed.')
        setLoading(false)
        return
      }
    }

    setMessage(`Successfully imported ${tracks.length} tracks.`)
    setLoading(false)
  }

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Admin: Import from Spotify</h1>

      <input
        type="text"
        placeholder="Enter Spotify Artist ID"
        value={artistId}
        onChange={(e) => setArtistId(e.target.value)}
        className="w-full px-3 py-2 border rounded mb-4"
      />

      <button
        onClick={handleImport}
        disabled={loading || !artistId}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Importing...' : 'Import Top Tracks'}
      </button>

      {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
    </main>
  )
}

