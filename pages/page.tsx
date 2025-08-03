'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        setIsAuthenticated(true)
      }

      setLoading(false)
    }

    checkSession()
  }, [])

  if (loading) return null

  if (isAuthenticated) {
    router.push('/catalogs')
    return null
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-md text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to RoyaltIQ 🎧</h1>
        <p className="mb-6 text-gray-600">
          Discover and evaluate music catalogs worth investing in.
        </p>
        <a
          href="/auth"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition"
        >
          Get Started
        </a>
      </div>
    </main>
  )
}
