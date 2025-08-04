"use client"

import { useState } from "react"

export default function CatalogCard({ catalog }: { catalog: any }) {
  const [showSummary, setShowSummary] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [isLoadingSummary, setIsLoadingSummary] = useState(false)
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false)
  const [errorSummary, setErrorSummary] = useState("")
  const [errorExplanation, setErrorExplanation] = useState("")

  const handleGenerate = async (type: "summary" | "explanation") => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/${type}`
    const payload: any = {
      id: catalog.id,
      title: catalog.title,
      artist: catalog.artist,
      genre: catalog.genre ?? "",
      spotify_streams: catalog.spotify_streams ?? 0,
      youtube_views: catalog.youtube_views ?? 0,
      earnings_last_12mo: catalog.estimated_earnings ?? 0,
    }
    if (type === "explanation") {
      payload.valuation_score = catalog.valuation_score ?? 0
    }

    try {
      type === "summary" ? setIsLoadingSummary(true) : setIsLoadingExplanation(true)
      type === "summary" ? setErrorSummary("") : setErrorExplanation("")

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error(`Request failed with status ${res.status}`)

      type === "summary" ? setShowSummary(true) : setShowExplanation(true)
    } catch (error) {
      type === "summary"
        ? setErrorSummary("Failed to generate summary.")
        : setErrorExplanation("Failed to generate explanation.")
    } finally {
      type === "summary" ? setIsLoadingSummary(false) : setIsLoadingExplanation(false)
    }
  }

  return (
    <div className="bg-white shadow-md rounded-md p-4 mb-4">
      <h2 className="text-xl font-semibold">{catalog.title}</h2>
      <p className="text-gray-600">By {catalog.artist}</p>
      <p className="text-sm">Genre: {catalog.genre || "N/A"}</p>
      <p>Spotify Streams: {catalog.spotify_streams}</p>
      <p>YouTube Views: {catalog.youtube_views}</p>
      <p>Estimated Earnings: ${catalog.estimated_earnings}</p>
      <p>Valuation Score: {catalog.valuation_score}</p>

      {showSummary ? (
        <p className="mt-2 text-sm text-gray-700">{catalog.summary}</p>
      ) : isLoadingSummary ? (
        <p className="mt-2 text-sm text-blue-500">Generating summary...</p>
      ) : (
        <button
          onClick={() => handleGenerate("summary")}
          className="mt-2 mr-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Generate Summary
        </button>
      )}
      {errorSummary && <p className="text-red-500 text-sm mt-1">{errorSummary}</p>}

      {showExplanation ? (
        <p className="mt-2 text-sm text-gray-700">{catalog.explanation}</p>
      ) : isLoadingExplanation ? (
        <p className="mt-2 text-sm text-blue-500">Generating explanation...</p>
      ) : (
        <button
          onClick={() => handleGenerate("explanation")}
          className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Generate Explanation
        </button>
      )}
      {errorExplanation && <p className="text-red-500 text-sm mt-1">{errorExplanation}</p>}
    </div>
  )
}

