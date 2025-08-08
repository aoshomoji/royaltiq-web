/* app/(dashboard)/layout.tsx */
import '../globals.css'
import { Inter } from 'next/font/google'
import { supabase } from '../../lib/supabase'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'RoyaltIQ Dashboard',
  description: 'Explore and value music royalty catalogs',
}

/* helper so we can call it from the header button */
async function signOut() {
  await supabase.auth.signOut()
  // hard redirect so state resets
  location.href = '/login'
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-slate-50 text-slate-900 min-h-screen flex flex-col`}
      >
        {/* --- global nav bar --- */}
        <header className="bg-emerald-600 text-white px-6 py-3 shadow-md">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            {/* logo → always back to /catalogs */}
            <a href="/catalogs" className="text-lg font-bold">
              RoyaltIQ Dashboard
            </a>

            <nav className="flex items-center gap-6 text-sm font-medium">
              <a
                href="/catalogs"
                className="hover:text-emerald-200 transition-colors"
              >
                Catalogs
              </a>
              <a
                href="/admin/import"
                className="hover:text-emerald-200 transition-colors"
              >
                Import
              </a>
              <button
                onClick={signOut}
                className="hover:text-emerald-200 transition-colors"
              >
                Sign out
              </button>
            </nav>
          </div>
        </header>

        {/* dashboard content */}
        <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  )
}
