'use client'

import { supabase } from '../../../lib/supabase'

export default function Header() {
  async function signOut() {
    await supabase.auth.signOut()
    location.href = '/login'
  }

  return (
    <header className="bg-emerald-600 text-white px-6 py-3 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <a href="/catalogs" className="text-lg font-bold">RoyaltIQ Dashboard</a>
        <nav className="flex gap-6 text-sm font-medium">
          <a href="/catalogs" className="hover:text-emerald-200">Catalogs</a>
          <a href="/admin/import" className="hover:text-emerald-200">Import</a>
          <button onClick={signOut} className="hover:text-emerald-200">Sign out</button>
        </nav>
      </div>
    </header>
  )
}
