'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

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
    if (!artistId) {
      setMessage('Please enter an artist ID.')
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
        setMessage('Import successful! Tracks added to Supabase.')
      } else {
        setMessage(`Import failed: ${data.error || 'Unknown error'}`)
      }
    } catch (err) {
      setMessage('Network error while importing.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin: Import Top Tracks</h1>
      <input
        type="text"
        className="border p-2 mr-2 rounded"
        placeholder="Enter Spotify Artist ID"
        value={artistId}
        onChange={(e) => setArtistId(e.target.value)}
      />
      <button
        onClick={handleImport}
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? 'Importing...' : 'Import'}
      </button>

      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  )
}
