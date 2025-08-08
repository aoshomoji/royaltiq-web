import '../globals.css'
import { Inter } from 'next/font/google'
import Header from './_components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'RoyaltIQ Dashboard',
  description: 'Explore and value music royalty catalogs',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900 min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">{children}</main>
      </body>
    </html>
  )
}

