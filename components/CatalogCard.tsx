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
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-800">{catalog.title}</h2>
        <p className="text-slate-500 text-sm mb-1">by {catalog.artist}</p>
        {catalog.genre && <p className="text-slate-400 text-xs">Genre: {catalog.genre}</p>}
      </div>

      <div className="grid grid-cols-2 gap-x-4 text-sm text-slate-700">
        <p>🎯 Popularity: <span className="font-semibold">{catalog.popularity}</span></p>
        <p>💵 Est. Earnings: <span className="font-semibold">${catalog.estimated_earnings.toLocaleString()}</span></p>
        <p>🎧 Spotify Streams: <span className="font-semibold">{catalog.spotify_streams.toLocaleString()}</span></p>
        <p>📺 YouTube Views: <span className="font-semibold">{catalog.youtube_views.toLocaleString()}</span></p>
        <p>📊 Valuation Score: <span className="font-semibold">{catalog.valuation_score}</span></p>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onGenerate('summary', catalog)}
          className="bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
        >
          Generate Summary
        </button>
        <button
          onClick={() => onGenerate('explanation', catalog)}
          className="bg-slate-700 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-800 transition"
        >
          Generate Explanation
        </button>
      </div>

      {summary && (
        <div className="bg-emerald-50 text-emerald-900 p-3 rounded-lg text-sm">
          <strong>Summary:</strong> {summary}
        </div>
      )}
      {explanation && (
        <div className="bg-slate-100 text-slate-800 p-3 rounded-lg text-sm mt-2">
          <strong>Explanation:</strong> {explanation}
        </div>
      )}
    </div>
  )
}
