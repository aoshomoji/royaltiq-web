'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../../lib/supabase'

export default function AdminImportPage() {
  const [artistId, setArtistId] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // 🔐 Auth protection
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) router.push('/')
    }
    checkSession()
  }, [router])

  const handleImport = async () => {
    if (!artistId.trim()) {
      setMessage('Please enter an artist ID.')
      return
    }

    // 👉 get the current session (so 'session' is defined in this scope)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      setMessage('Not signed in.')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ artist_id: artistId }),
      })

      const data = await res.json()
      if (res.ok) {
        setMessage(`Import successful! Added ${data.inserted} tracks.`)
        setArtistId('')
      } else {
        setMessage(`Import failed: ${data.detail || data.error || 'Unknown error'}`)
      }
    } catch {
      setMessage('Network error while importing.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-xl shadow p-6 mt-10">
      <h1 className="text-xl font-bold text-slate-800 mb-4">Import Top Tracks</h1>

      <label className="block text-sm font-medium text-slate-700 mb-1">
        Spotify Artist ID
      </label>
      <input
        type="text"
        className="w-full rounded-lg border-slate-300 focus:ring-emerald-500 focus:border-emerald-500 px-3 py-2 mb-4"
        placeholder="e.g. 3TVXtAsR1Inumwj472S9r4"
        value={artistId}
        onChange={(e) => setArtistId(e.target.value)}
      />

      <button
        onClick={handleImport}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white font-medium hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        )}
        {loading ? 'Importing…' : 'Import'}
      </button>

      {message && <p className="mt-4 text-sm text-slate-700">{message}</p>}
    </div>
  )
}
