'use client'

import { useState, useEffect } from 'react'

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
  const [showSummary, setShowSummary] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  useEffect(() => {
    if (summary) setShowSummary(true)
    if (explanation) setShowExplanation(true)
  }, [summary, explanation])

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-800">{catalog.title}</h2>
        <p className="text-slate-500 text-sm">by {catalog.artist}</p>
        {catalog.genre && <p className="text-slate-400 text-xs mt-1">Genre: {catalog.genre}</p>}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-y-2 gap-x-6 text-sm text-slate-700">
        <p>
          💵 <span className="font-medium">Est. Earnings:</span>{' '}
          <span className="font-semibold">
            {catalog.estimated_earnings != null ? `$${catalog.estimated_earnings.toLocaleString?.()}` : 'N/A'}
          </span>
        </p>
        <p>
          📊 <span className="font-medium">Valuation Score:</span>{' '}
          <span className="font-semibold">
            {catalog.valuation_score != null ? catalog.valuation_score : 'N/A'}
          </span>
        </p>
        <p>
          🎧 <span className="font-medium">Spotify Streams:</span>{' '}
          <span className="font-semibold">
            {catalog.spotify_streams != null ? catalog.spotify_streams.toLocaleString?.() : 'N/A'}
          </span>
        </p>
        <p>
          📺 <span className="font-medium">YouTube Views:</span>{' '}
          <span className="font-semibold">
            {catalog.youtube_views != null ? catalog.youtube_views.toLocaleString?.() : 'N/A'}
          </span>
        </p>
        <p>
          🎯 <span className="font-medium">Popularity:</span>{' '}
          <span className="font-semibold">
            {catalog.popularity != null ? catalog.popularity : 'N/A'}
          </span>
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-3 mt-4">
        <button
          onClick={() => onGenerate('summary', catalog)}
          className="bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Generate Summary
        </button>
        <button
          onClick={() => onGenerate('explanation', catalog)}
          className="bg-slate-700 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
        >
          Generate Explanation
        </button>
      </div>

      {/* AI Results with transitions */}
      <div className="space-y-2">
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            showSummary ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0'
          }`}
        >
          {summary && (
            <div className="bg-emerald-50 text-emerald-900 p-3 rounded-lg text-sm border border-emerald-200">
              <strong>Summary:</strong> {summary}
            </div>
          )}
        </div>

        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            showExplanation ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0'
          }`}
        >
          {explanation && (
            <div className="bg-slate-50 text-slate-800 p-3 rounded-lg text-sm border border-slate-200">
              <strong>Explanation:</strong> {explanation}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
