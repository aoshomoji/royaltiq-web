export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-6">
      <h1 className="text-4xl font-bold text-slate-800 text-center mb-4">
        Discover hidden gems in music royalties
      </h1>

      <p className="text-slate-600 text-lg text-center max-w-xl mb-8">
        RoyaltIQ lets everyday investors explore streaming catalogs, view AI-powered valuations,
        and spot opportunities in the booming royalty market.
      </p>

      <a
        href="/login"
        className="rounded-lg bg-emerald-600 px-6 py-3 text-white font-medium hover:bg-emerald-700"
      >
        Get early access →
      </a>
    </main>
  )
}
