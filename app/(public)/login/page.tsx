'use client'
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [msg,   setMsg]   = useState('')
  const router  = useRouter()
  const params  = useSearchParams()

  /* ───── handle magic-link redirect ───── */
  useEffect(() => {
    const code = params.get('code')          // Present on v2 magic-link
    if (!code) return

    supabase.auth.exchangeCodeForSession(code)
      .then(({ error }) => {
        if (error) setMsg(error.message)
        else router.replace('/catalogs')
      })
  }, [params, router])

  /* ───── send link ───── */
  async function sendLink() {
    setMsg('Sending link…')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/login` },
    })
    setMsg(error ? error.message : 'Check your inbox for the sign-in link!')
  }

  /* ───── UI ───── */
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-sm w-full bg-white rounded-xl shadow p-6 space-y-4">
        <h1 className="text-xl font-bold text-slate-800">Sign in</h1>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full border rounded-lg p-2"
        />

        <button
          onClick={sendLink}
          className="w-full bg-emerald-600 text-white rounded-lg py-2 font-medium hover:bg-emerald-700"
        >
          Email me a login link
        </button>

        {msg && <p className="text-sm">{msg}</p>}
      </div>
    </main>
  )
}
