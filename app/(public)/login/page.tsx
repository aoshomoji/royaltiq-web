import { Suspense } from 'react'
import LoginClient from './LoginClient'

export const metadata = { title: 'Sign in – RoyaltIQ' }

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      {/*  Suspense satisfies the build-time requirement */}
      <Suspense fallback={null}>
        <LoginClient />
      </Suspense>
    </main>
  )
}
