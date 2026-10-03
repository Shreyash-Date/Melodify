import { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react'
import {
  fetchChartAlbums,
  fetchChartPlaylists,
  fetchChartTracks,
  fetchAlbumTracks,
  fetchPlaylistTracks,
  searchTracks,
  searchAlbums,
} from '../services/deezerApi'
import fallbackSongs from '../data/songs'

const PlayerContext = createContext(null)

/** Format seconds → m:ss */
export function fmtTime(sec) {
  if (!sec || isNaN(sec)) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function PlayerProvider({ children }) {
  /* ===========================================
     BROWSE STATE
     =========================================== */
  const [view, setView] = useState('home')          // 'home' | 'detail' | 'search'
  const [albums, setAlbums] = useState([])           // browse cards
  const [playlists, setPlaylists] = useState([])     // browse cards
  const [isBrowseLoading, setIsBrowseLoading] = useState(true)

  // Detail view state
  const [detailInfo, setDetailInfo] = useState(null) // { title, artist, cover, ... }
  const [isDetailLoading, setIsDetailLoading] = useState(false)

  // Search state
  const [searchResults, setSearchResults] = useState({ tracks: [], albums: [] })
  const [isSearchLoading, setIsSearchLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  /* ===========================================
     PLAYER STATE
     =========================================== */
  const [songs, setSongs] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(70)
  const [isMuted, setIsMuted] = useState(false)

  const audioRef = useRef(null)
  const hasPlayedRef = useRef(false)

  const song = songs[currentIndex] || {
    id: 0, title: 'Melodify', artist: 'Select a song',
    album: '', cover: '/images/melodify-logo.jpg',
    coverLarge: '/images/melodify-logo.jpg', src: '', duration: '0:00',
  }

  /* ===========================================
     FETCH BROWSE DATA ON MOUNT
     =========================================== */
  useEffect(() => {
    let cancelled = false
    async function loadBrowse() {
      try {
        setIsBrowseLoading(true)
        const [albumsData, playlistsData] = await Promise.all([
          fetchChartAlbums(10),
          fetchChartPlaylists(10),
        ])
        if (!cancelled) {
          setAlbums(albumsData)
          setPlaylists(playlistsData)
        }
      } catch (err) {
        console.warn('Failed to load browse data:', err)
      } finally {
        if (!cancelled) setIsBrowseLoading(false)
      }
    }
    loadBrowse()
    return () => { cancelled = true }
  }, [])

  /* ===========================================
     NAVIGATION ACTIONS
     =========================================== */

  /** Open an album or playlist → fetch its tracks and show detail view */
  const openCollection = useCallback(async (item) => {
    try {
      setIsDetailLoading(true)
      setView('detail')

      let result
      if (item.type === 'album') {
        result = await fetchAlbumTracks(item.id)
      } else {
        result = await fetchPlaylistTracks(item.id)
      }

      setDetailInfo(result.info)
      setSongs(result.tracks)
      setCurrentIndex(0)
      setIsPlaying(false)
      setCurrentTime(0)
      hasPlayedRef.current = false
    } catch (err) {
      console.warn('Failed to load collection:', err)
      // Stay on detail view but show error state
      setDetailInfo({ title: 'Error', artist: '', cover: '/images/melodify-logo.jpg' })
      setSongs([])
    } finally {
      setIsDetailLoading(false)
    }
  }, [])

  /** Go back to the home browse view */
  const goHome = useCallback(() => {
    setView('home')
    setDetailInfo(null)
    setSearchQuery('')
  }, [])

  /** Search tracks and albums */
  const search = useCallback(async (query) => {
    if (!query.trim()) return
    try {
      setSearchQuery(query)
      setIsSearchLoading(true)
      setView('search')
      const [tracks, albumResults] = await Promise.all([
        searchTracks(query, 20),
        searchAlbums(query, 10),
      ])
      setSearchResults({ tracks, albums: albumResults })
    } catch (err) {
      console.warn('Search failed:', err)
    } finally {
      setIsSearchLoading(false)
    }
  }, [])

  /** Play search results as a collection */
  const playSearchResults = useCallback(() => {
    if (searchResults.tracks.length > 0) {
      setSongs(searchResults.tracks)
      setCurrentIndex(0)
      hasPlayedRef.current = true
    }
  }, [searchResults.tracks])

  /* ===========================================
     PLAYER CONTROLS
     =========================================== */
  const play = useCallback(() => {
    audioRef.current?.play().catch(() => {})
    setIsPlaying(true)
    hasPlayedRef.current = true
  }, [])

  const pause = useCallback(() => {
    audioRef.current?.pause()
    setIsPlaying(false)
  }, [])

  const togglePlay = useCallback(() => {
    isPlaying ? pause() : play()
  }, [isPlaying, play, pause])

  const playPrev = useCallback(() => {
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0
      return
    }
    setCurrentIndex((i) => (i === 0 ? songs.length - 1 : i - 1))
  }, [songs.length])

  const playNext = useCallback(() => {
    setCurrentIndex((i) => (i === songs.length - 1 ? 0 : i + 1))
  }, [songs.length])

  const playSong = useCallback((index) => {
    if (index < 0 || index >= songs.length) return
    if (index === currentIndex) {
      isPlaying ? pause() : play()
    } else {
      setCurrentIndex(index)
      hasPlayedRef.current = true
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, isPlaying, play, pause, songs.length])

  /** Play a specific track from search results (set songs + play) */
  const playTrackFromList = useCallback((tracks, index) => {
    setSongs(tracks)
    setCurrentIndex(index)
    hasPlayedRef.current = true
  }, [])

  /* ===========================================
     SIDE-EFFECTS
     =========================================== */
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !song.src) return
    audio.load()
    if (hasPlayedRef.current) {
      audio.play().catch(() => {})
      setIsPlaying(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, song.src])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100
    }
  }, [volume, isMuted])

  const onTimeUpdate = () => setCurrentTime(audioRef.current?.currentTime ?? 0)
  const onLoadedMetadata = () => setDuration(audioRef.current?.duration ?? 0)
  const onEnded = () => playNext()

  const onSeek = (val) => {
    if (audioRef.current && duration) {
      audioRef.current.currentTime = (val / 100) * duration
    }
    setCurrentTime((val / 100) * duration)
  }

  const onVolumeChange = (val) => {
    setVolume(val)
    if (isMuted && val > 0) setIsMuted(false)
  }

  const toggleMute = () => setIsMuted((m) => !m)

  /* ---- derived ---- */
  const seekPercent = duration ? (currentTime / duration) * 100 : 0
  const volPercent = isMuted ? 0 : volume

  const value = {
    // browse
    view, albums, playlists, isBrowseLoading,
    detailInfo, isDetailLoading,
    searchResults, isSearchLoading, searchQuery,
    // navigation
    openCollection, goHome, search, playSearchResults,
    // player state
    currentIndex, isPlaying, currentTime, duration,
    volume, isMuted, song, songs,
    seekPercent, volPercent,
    // player controls
    play, pause, togglePlay, playPrev, playNext,
    playSong, playTrackFromList,
    onSeek, onVolumeChange, toggleMute,
  }

  return (
    <PlayerContext.Provider value={value}>
      <audio
        ref={audioRef}
        src={song.src}
        preload="metadata"
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onEnded}
      />
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer must be used inside <PlayerProvider>')
  return ctx
}

export default PlayerContext
