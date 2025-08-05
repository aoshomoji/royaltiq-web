'use client'

type Catalog = {
  id: string
  title: string
  artist: string
  genre?: string
  popularity: number
  spotify_streams: number
  youtube_views: number
  estimated_earnings: number
  valuation_score: number
}

type Props = {
  catalog: Catalog
  summary?: string
  explanation?: string
  onGenerate: (type: 'summary' | 'explanation', catalog: Catalog) => void
}

export default function CatalogCard({ catalog, summary, explanation, onGenerate }: Props) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow hover:shadow-md transition-shadow">
      <h2 className="text-xl font-semibold text-slate-900 mb-1">
        {catalog.title} — {catalog.artist}
      </h2>
      <p className="text-slate-600 text-sm mb-1">Genre: {catalog.genre}</p>
      <p className="text-slate-600 text-sm">Popularity: {catalog.popularity}</p>
      <p className="text-slate-600 text-sm">Spotify Streams: {catalog.spotify_streams}</p>
      <p className="text-slate-600 text-sm">YouTube Views: {catalog.youtube_views}</p>
      <p className="text-slate-600 text-sm">Est. Earnings: ${catalog.estimated_earnings}</p>
      <p className="text-slate-600 text-sm mb-4">Valuation Score: {catalog.valuation_score}</p>

      <div className="flex gap-2">
        <button
          onClick={() => onGenerate('summary', catalog)}
          className="bg-emerald-600 text-white px-3 py-1.5 rounded hover:bg-emerald-700 transition"
        >
          Generate Summary
        </button>
        <button
          onClick={() => onGenerate('explanation', catalog)}
          className="bg-slate-700 text-white px-3 py-1.5 rounded hover:bg-slate-800 transition"
        >
          Generate Explanation
        </button>
      </div>

      {summary && (
        <div className="mt-4 text-sm bg-emerald-50 text-emerald-900 p-3 rounded">
          <strong>Summary:</strong> {summary}
        </div>
      )}
      {explanation && (
        <div className="mt-2 text-sm bg-slate-100 text-slate-800 p-3 rounded">
          <strong>Explanation:</strong> {explanation}
        </div>
      )}
    </div>
  )
}
