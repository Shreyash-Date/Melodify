import { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react'
import songs from '../data/songs'

const PlayerContext = createContext(null)

/** Format seconds → m:ss */
export function fmtTime(sec) {
  if (!sec || isNaN(sec)) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function PlayerProvider({ children }) {
  /* ---- state ---- */
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(70)
  const [isMuted, setIsMuted] = useState(false)

  const audioRef = useRef(null)
  // Track whether user has ever initiated playback (for auto-play on track change)
  const hasPlayedRef = useRef(false)

  const song = songs[currentIndex]

  /* ---- control functions ---- */
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
    // If more than 3s into the song, restart it; otherwise go previous
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0
      return
    }
    setCurrentIndex((i) => (i === 0 ? songs.length - 1 : i - 1))
  }, [])

  const playNext = useCallback(() => {
    setCurrentIndex((i) => (i === songs.length - 1 ? 0 : i + 1))
  }, [])

  /** Play a specific song by its index in the songs array */
  const playSong = useCallback((index) => {
    if (index < 0 || index >= songs.length) return
    if (index === currentIndex) {
      // Same song — just toggle
      isPlaying ? pause() : play()
    } else {
      setCurrentIndex(index)
      hasPlayedRef.current = true // ensure auto-play on load
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, isPlaying, play, pause])

  /* ---- side-effects ---- */

  // When currentIndex changes, load & play the new song
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.load()
    if (hasPlayedRef.current) {
      audio.play().catch(() => {})
      setIsPlaying(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex])

  // Keep volume in sync
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100
    }
  }, [volume, isMuted])

  /* ---- audio event handlers ---- */
  const onTimeUpdate = () => {
    setCurrentTime(audioRef.current?.currentTime ?? 0)
  }

  const onLoadedMetadata = () => {
    setDuration(audioRef.current?.duration ?? 0)
  }

  const onEnded = () => {
    playNext()
  }

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

  const toggleMute = () => {
    setIsMuted((m) => !m)
  }

  /* ---- derived values ---- */
  const seekPercent = duration ? (currentTime / duration) * 100 : 0
  const volPercent = isMuted ? 0 : volume

  const value = {
    // state
    currentIndex,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    song,
    songs,
    seekPercent,
    volPercent,
    // controls
    play,
    pause,
    togglePlay,
    playPrev,
    playNext,
    playSong,
    onSeek,
    onVolumeChange,
    toggleMute,
  }

  return (
    <PlayerContext.Provider value={value}>
      {/* Hidden audio element — lives at the provider level */}
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
