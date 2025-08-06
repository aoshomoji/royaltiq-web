'use client'

import { useEffect, useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import ExpandableMarkdown from './ExpandableMarkdown'

const fmtUSD = (n: number) =>
  Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

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

/** Convert leading bullet characters `•` to Markdown `- ` so lists render nicely. */
function normalizeMarkdown(md?: string) {
  if (!md) return ''
  // Convert lines beginning with optional spaces + bullet char into dash list items
  return md
    .replace(/^\s*•\s+/gm, '- ')
    // If the model emits `•` on its own line before the sentence,
    // join it to the next line as a list item.
    .replace(/\n•\s*$/gm, '\n- ')
}

export default function CatalogCard({ catalog, summary, explanation, onGenerate }: Props) {
  const [showSummary, setShowSummary] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  const isLoadingSummary = summary === 'Loading...'
  const isLoadingExplanation = explanation === 'Loading...'

  const normalizedSummary = useMemo(() => normalizeMarkdown(summary), [summary])
  const normalizedExplanation = useMemo(() => normalizeMarkdown(explanation), [explanation])

  useEffect(() => {
    if (summary && summary !== 'Loading...') setShowSummary(true)
    if (explanation && explanation !== 'Loading...') setShowExplanation(true)
  }, [summary, explanation])

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md
                hover:-translate-y-1 transition-shadow transition-transform p-6 space-y-4">
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
            {catalog.estimated_earnings != null ? fmtUSD(catalog.estimated_earnings) : 'N/A'}
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
          {/* SUMMARY wrapper with Show more */}
          {normalizedSummary && summary !== 'Loading...' && (
            <ExpandableMarkdown
              text={normalizedSummary}
              accent="emerald"
          />
          )}
        </div>

        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            showExplanation ? 'opacity-100 max-h-[32rem]' : 'opacity-0 max-h-0'
          }`}
        >
          {normalizedExplanation && explanation !== 'Loading...' && (
            <ExpandableMarkdown text={normalizedExplanation} accent="slate" />
          )}
        </div>
      </div>
    </div>
  )
}
