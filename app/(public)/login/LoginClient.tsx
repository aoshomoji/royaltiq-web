'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function LoginClient() {
  const [email, setEmail] = useState('')
  const [msg,   setMsg]   = useState('')
  const router  = useRouter()
  const params  = useSearchParams()

  /* ── 1. Handle redirect once on mount ─────────────────────────────── */
  useEffect(() => {
    /* A) New v2 flow: ?code=...&type=magiclink */
    const code = params.get('code')
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) setMsg(error.message)
        else router.replace('/catalogs')
      })
      return
    }

    /* B) Hash-fragment flow: #access_token=…&refresh_token=… */
    if (window.location.hash.includes('access_token')) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const access_token  = hashParams.get('access_token')
      const refresh_token = hashParams.get('refresh_token')
      if (access_token && refresh_token) {
        supabase.auth.setSession({ access_token, refresh_token })
          .then(() => router.replace('/catalogs'))
      }
    }
  }, [params, router])

  /* ── 2. Send magic link ──────────────────────────────────────────── */
  async function sendLink() {
    setMsg('Sending link…')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/login` },
    })
    setMsg(error ? error.message : 'Check your inbox for the sign-in link!')
  }

  /* ── 3. UI ───────────────────────────────────────────────────────── */
  return (
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
  )
}
