'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../utils/supabaseClient'

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sessionChecked, setSessionChecked] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth')
      } else {
        setUserEmail(session.user.email)
        setSessionChecked(true)
      }
    }

    checkSession()
  }, [router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  if (!sessionChecked) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 bg-white border-b shadow-sm">
        <h1 className="text-lg font-semibold">RoyaltIQ</h1>
        <div className="flex items-center gap-4">
          {userEmail && <span className="text-sm text-gray-700">{userEmail}</span>}
          <button
            onClick={handleSignOut}
            className="text-sm px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
    </div>
  )
}

