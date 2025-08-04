'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const [email, setEmail] = useState('')
  const [session, setSession] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  const handleLogin = async () => {
    await supabase.auth.signInWithOtp({ email })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  if (session) {
    return (
      <div>
        <p>Logged in as: {session.user.email}</p>
        <button onClick={handleLogout} className="mt-2 bg-red-500 text-white px-3 py-1 rounded">
          Sign Out
        </button>
        <button onClick={() => router.push('/catalogs')} className="ml-2 bg-blue-600 text-white px-3 py-1 rounded">
          Go to Catalogs
        </button>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Login to RoyaltIQ</h1>
      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border px-2 py-1 mr-2 rounded"
      />
      <button onClick={handleLogin} className="bg-blue-600 text-white px-3 py-1 rounded">
        Send Magic Link
      </button>
    </div>
  )
}
