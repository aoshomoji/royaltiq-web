'use client'

import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'

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
  // Smooth fade/expand when content arrives
  const [showSummary, setShowSummary] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  // Derive loading states from the strings you already set in page.tsx
  const isLoadingSummary = summary === 'Loading...'
  const isLoadingExplanation = explanation === 'Loading...'

  useEffect(() => {
    if (summary && summary !== 'Loading...') setShowSummary(true)
    if (explanation && explanation !== 'Loading...') setShowExplanation(true)
  }, [summary, explanation])

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 space-y-4">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-800">{catalog.title}</h2>
        <p className="text-slate-500 text-sm">by {catalog.artist}</p>

        {catalog.genre && (
          <span className="inline-flex w-fit items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
            {catalog.genre}
          </span>
        )}
      </div>

      {/* Metrics */}
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

      {/* Actions */}
      <div className="flex flex-wrap gap-3 pt-1">
        <button
          onClick={() => onGenerate('summary', catalog)}
          disabled={isLoadingSummary}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoadingSummary && (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
          )}
          {isLoadingSummary ? 'Generating…' : 'Generate Summary'}
        </button>

        <button
          onClick={() => onGenerate('explanation', catalog)}
          disabled={isLoadingExplanation}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoadingExplanation && (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
          )}
          {isLoadingExplanation ? 'Generating…' : 'Generate Explanation'}
        </button>
      </div>

      {/* AI Results with fade/expand transitions */}
      <div className="space-y-2">
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            showSummary ? 'opacity-100 max-h-[32rem]' : 'opacity-0 max-h-0'
          }`}
        >
          {summary && summary !== 'Loading...' && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
              <ReactMarkdown
                components={{
                  h1: ({node, ...props}) => <h1 className="text-lg font-bold mt-2" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-base font-semibold mt-2" {...props} />,
                  p:  ({node, ...props}) => <p className="mb-2" {...props} />,
                  li: ({node, ...props}) => <li className="list-disc list-inside" {...props} />,
                }}
              >
                {summary}
              </ReactMarkdown>
            </div>
          )}
        </div>

        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            showExplanation ? 'opacity-100 max-h-[32rem]' : 'opacity-0 max-h-0'
          }`}
        >
          {explanation && explanation !== 'Loading...' && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800">
              <ReactMarkdown
                components={{
                  h1: ({node, ...props}) => <h1 className="text-lg font-bold mt-2" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-base font-semibold mt-2" {...props} />,
                  p:  ({node, ...props}) => <p className="mb-2" {...props} />,
                  li: ({node, ...props}) => <li className="list-disc list-inside" {...props} />,
                }}
              >
                {explanation}
              </ReactMarkdown>
            </div>
          )}        
        </div>
      </div>
    </div>
  )
}
