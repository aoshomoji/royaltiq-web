import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'RoyaltIQ',
  description: 'Explore music royalty investment opportunities',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="p-4 shadow">RoyaltIQ Dashboard</header>
        <main className="p-4">{children}</main>
      </body>
    </html>
  )
}
