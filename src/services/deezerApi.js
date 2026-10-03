/**
 * Deezer API service for Melodify
 *
 * Uses the free Deezer API to fetch real music data:
 *   - Chart albums & playlists for the browse home page
 *   - Album / playlist track listings
 *   - Search with 30-sec previews & cover art
 *
 * In development, requests are proxied through Vite's dev server
 * (see vite.config.js) to avoid CORS issues.
 */

const DEEZER_BASE = '/api/deezer'

/**
 * Helper — fetch JSON from Deezer via Vite proxy
 */
async function deezerFetch(endpoint) {
  const res = await fetch(`${DEEZER_BASE}${endpoint}`)
  if (!res.ok) throw new Error(`Deezer API error: ${res.status}`)
  return res.json()
}

/* ============================================
   BROWSE — Albums, Playlists, Genres
   ============================================ */

/**
 * Get chart / trending albums
 */
export async function fetchChartAlbums(limit = 10) {
  const data = await deezerFetch(`/chart/0/albums?limit=${limit}`)
  return (data.data || []).map(normalizeAlbum)
}

/**
 * Get chart / trending playlists
 */
export async function fetchChartPlaylists(limit = 10) {
  const data = await deezerFetch(`/chart/0/playlists?limit=${limit}`)
  return (data.data || []).map(normalizePlaylist)
}

/**
 * Get trending / chart tracks
 */
export async function fetchChartTracks(limit = 20) {
  const data = await deezerFetch(`/chart/0/tracks?limit=${limit}`)
  return normalizeTracks(data.data || [])
}

/* ============================================
   DETAIL — Fetch tracks for an album or playlist
   ============================================ */

/**
 * Get tracks for a specific album
 */
export async function fetchAlbumTracks(albumId) {
  const [albumData, tracksData] = await Promise.all([
    deezerFetch(`/album/${albumId}`),
    deezerFetch(`/album/${albumId}/tracks?limit=50`),
  ])
  const tracks = (tracksData.data || [])
    .filter((t) => t.preview)
    .map((t) => ({
      id: t.id,
      title: t.title_short || t.title,
      artist: t.artist?.name ?? albumData.artist?.name ?? 'Unknown',
      album: albumData.title || 'Album',
      cover: albumData.cover_medium ?? albumData.cover_small ?? '/images/melodify-logo.jpg',
      coverLarge: albumData.cover_big ?? albumData.cover_medium ?? '/images/melodify-logo.jpg',
      src: t.preview,
      duration: formatDuration(t.duration),
      durationSec: t.duration,
      deezerLink: t.link,
    }))

  return {
    info: {
      id: albumData.id,
      type: 'album',
      title: albumData.title,
      artist: albumData.artist?.name ?? 'Unknown',
      cover: albumData.cover_medium ?? '/images/melodify-logo.jpg',
      coverLarge: albumData.cover_big ?? albumData.cover_xl ?? '/images/melodify-logo.jpg',
      trackCount: tracks.length,
      fans: albumData.fans,
      releaseDate: albumData.release_date,
      deezerLink: albumData.link,
    },
    tracks,
  }
}

/**
 * Get tracks for a specific playlist
 */
export async function fetchPlaylistTracks(playlistId) {
  const data = await deezerFetch(`/playlist/${playlistId}?limit=50`)
  const tracks = (data.tracks?.data || [])
    .filter((t) => t.preview)
    .map((t) => ({
      id: t.id,
      title: t.title_short || t.title,
      artist: t.artist?.name ?? 'Unknown',
      album: t.album?.title ?? 'Single',
      cover: t.album?.cover_medium ?? t.album?.cover_small ?? '/images/melodify-logo.jpg',
      coverLarge: t.album?.cover_big ?? t.album?.cover_medium ?? '/images/melodify-logo.jpg',
      src: t.preview,
      duration: formatDuration(t.duration),
      durationSec: t.duration,
      deezerLink: t.link,
    }))

  return {
    info: {
      id: data.id,
      type: 'playlist',
      title: data.title,
      artist: data.creator?.name ?? 'Deezer',
      description: data.description || '',
      cover: data.picture_medium ?? '/images/melodify-logo.jpg',
      coverLarge: data.picture_big ?? data.picture_xl ?? '/images/melodify-logo.jpg',
      trackCount: tracks.length,
      fans: data.fans,
      deezerLink: data.link,
    },
    tracks,
  }
}

/* ============================================
   SEARCH
   ============================================ */

/**
 * Search for tracks
 */
export async function searchTracks(query, limit = 20) {
  const data = await deezerFetch(`/search?q=${encodeURIComponent(query)}&limit=${limit}`)
  return normalizeTracks(data.data || [])
}

/**
 * Search for albums
 */
export async function searchAlbums(query, limit = 10) {
  const data = await deezerFetch(`/search/album?q=${encodeURIComponent(query)}&limit=${limit}`)
  return (data.data || []).map(normalizeAlbum)
}

/* ============================================
   NORMALIZERS
   ============================================ */

function normalizeAlbum(a) {
  return {
    id: a.id,
    type: 'album',
    title: a.title,
    artist: a.artist?.name ?? 'Unknown',
    cover: a.cover_medium ?? a.cover_small ?? '/images/melodify-logo.jpg',
    coverLarge: a.cover_big ?? a.cover_xl ?? '/images/melodify-logo.jpg',
    trackCount: a.nb_tracks,
    deezerLink: a.link,
  }
}

function normalizePlaylist(p) {
  return {
    id: p.id,
    type: 'playlist',
    title: p.title,
    artist: p.user?.name ?? 'Deezer',
    cover: p.picture_medium ?? p.picture_small ?? '/images/melodify-logo.jpg',
    coverLarge: p.picture_big ?? p.picture_xl ?? '/images/melodify-logo.jpg',
    trackCount: p.nb_tracks,
    deezerLink: p.link,
  }
}

function normalizeTracks(tracks) {
  return tracks
    .filter((t) => t.preview)
    .map((t) => ({
      id: t.id,
      title: t.title_short || t.title,
      artist: t.artist?.name ?? 'Unknown Artist',
      album: t.album?.title ?? 'Single',
      cover: t.album?.cover_medium ?? t.album?.cover_small ?? '/images/melodify-logo.jpg',
      coverLarge: t.album?.cover_big ?? t.album?.cover_medium ?? '/images/melodify-logo.jpg',
      src: t.preview,
      duration: formatDuration(t.duration),
      durationSec: t.duration,
      deezerLink: t.link,
    }))
}

function formatDuration(sec) {
  if (!sec) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}
