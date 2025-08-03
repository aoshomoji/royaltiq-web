// pages/api/spotify-search.ts

import type { NextApiRequest, NextApiResponse } from 'next'

let accessToken = ''
let tokenExpiresAt = 0

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const query = req.query.q as string

  if (!query) {
    return res.status(400).json({ error: 'Missing query parameter' })
  }

  try {
    // If token expired or missing, refresh it
    if (!accessToken || Date.now() >= tokenExpiresAt) {
      const clientId = process.env.SPOTIFY_CLIENT_ID!
      const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!
      const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

      const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${authString}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
      })

      const tokenData = await tokenRes.json()
      accessToken = tokenData.access_token
      tokenExpiresAt = Date.now() + tokenData.expires_in * 1000 - 5000 // Refresh slightly early
    }

    const searchRes = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    const searchData = await searchRes.json()
    return res.status(200).json({ tracks: searchData.tracks.items })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to fetch from Spotify' })
  }
}

