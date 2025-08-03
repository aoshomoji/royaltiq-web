'use client'
import { useState } from 'react'

export default function AdminImportPage() {
  const [artistId, setArtistId] = useState('')

  const handleImport = async () => {
    alert('Simulating import for Artist ID: ' + artistId)
    // Replace with actual Supabase insert call
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Admin: Import Top Tracks</h1>
      <input
        type="text"
        className="border p-2 mr-2 rounded"
        placeholder="Enter Spotify Artist ID"
        value={artistId}
        onChange={(e) => setArtistId(e.target.value)}
      />
      <button onClick={handleImport} className="bg-blue-500 text-white px-4 py-2 rounded">
        Import
      </button>
    </div>
  )
}
