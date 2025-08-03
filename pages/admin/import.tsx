'use client'

import { useState } from 'react'
import { supabase } from '../../utils/supabaseClient'

export default function ImportPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [importingId, setImportingId] = useState<string | null>(null)

  const searchSpotify = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/spotify-search?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      setResults(data.tracks || [])
    } catch (err) {
      console.error('Search error:', err)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleImport = async (track: any) => {
    setImportingId(track.id)
    try {
      const estimatedEarnings = Math.round(track.popularity * 5000) // Placeholder earnings logic
      const { error } = await supabase.from('catalogs').insert([
        {
          id: track.id,
          title: track.name,
          artist: track.artists.map((a: any) => a.name).join(', '),
          summary: null,
          explanation: null,
          earnings: estimatedEarnings,
        },
      ])
      if (error) throw error
      alert('Imported successfully')
    } catch (err) {
      console.error('Import error:', err)
      alert('Failed to import track')
    } finally {
      setImportingId(null)
    }
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Import from Spotify</h1>
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by artist or track title"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border px-4 py-2 rounded-lg flex-grow"
        />
        <button
          onClick={searchSpotify}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
      {results.length > 0 && (
        <div className="space-y-4">
          {results.map((track) => (
            <div key={track.id} className="p-4 border rounded-lg bg-white">
              <div className="font-semibold">{track.name}</div>
              <div className="text-sm text-gray-500">{track.artists.map((a: any) => a.name).join(', ')}</div>
              <div className="text-xs text-gray-400">Popularity: {track.popularity}</div>
              <div className="text-xs text-gray-500 mb-2">
                Estimated Earnings (based on popularity): ${Math.round(track.popularity * 5000).toLocaleString()}
                <span title="This is a placeholder estimate using Spotify's popularity score, not actual royalty data." className="ml-1 cursor-help text-gray-400">ⓘ</span>
              </div>
              <button
                onClick={() => handleImport(track)}
                disabled={importingId === track.id}
                className="text-sm px-3 py-1 bg-green-600 text-white rounded-lg"
              >
                {importingId === track.id ? 'Importing...' : 'Import to Supabase'}
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
