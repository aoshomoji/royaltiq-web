// app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'RoyaltIQ Dashboard',
  description: 'Discover hidden gems in music royalties',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900 min-h-screen`}>
        <header className="bg-emerald-600 text-white px-6 py-4 shadow-md">
          <h1 className="text-2xl font-bold">💽 RoyaltIQ Dashboard</h1>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  )
}

