import { useState, useRef, useEffect, useCallback } from 'react'
import {
  IoPlaySkipBack,
  IoPlaySkipForward,
  IoPlay,
  IoPause,
} from 'react-icons/io5'
import {
  HiSpeakerWave,
  HiSpeakerXMark,
} from 'react-icons/hi2'
import songs from '../../data/songs'
import './Playbar.css'

/** Format seconds → m:ss */
function fmtTime(sec) {
  if (!sec || isNaN(sec)) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function Playbar() {
  /* ---- state ---- */
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(70)
  const [isMuted, setIsMuted] = useState(false)

  const audioRef = useRef(null)
  const seekRef = useRef(null)
  const volRef = useRef(null)

  const song = songs[currentIndex]

  /* ---- helpers ---- */
  const play = useCallback(() => {
    audioRef.current?.play()
    setIsPlaying(true)
  }, [])

  const pause = useCallback(() => {
    audioRef.current?.pause()
    setIsPlaying(false)
  }, [])

  const togglePlay = useCallback(() => {
    isPlaying ? pause() : play()
  }, [isPlaying, play, pause])

  const playPrev = useCallback(() => {
    // If more than 3 s into the song, restart it; otherwise go previous
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0
      return
    }
    setCurrentIndex((i) => (i === 0 ? songs.length - 1 : i - 1))
  }, [])

  const playNext = useCallback(() => {
    setCurrentIndex((i) => (i === songs.length - 1 ? 0 : i + 1))
  }, [])

  /* ---- side-effects ---- */

  // When currentIndex changes, load & play the new song
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.load()
    // Only auto-play if user has already started playback at least once
    if (isPlaying) {
      audio.play().catch(() => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex])

  // Keep volume in sync
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100
    }
  }, [volume, isMuted])

  /* ---- seekbar fill (CSS variable driven) ---- */
  const seekPercent = duration ? (currentTime / duration) * 100 : 0
  const volPercent = isMuted ? 0 : volume

  /* ---- event handlers ---- */
  const onTimeUpdate = () => {
    setCurrentTime(audioRef.current?.currentTime ?? 0)
  }

  const onLoadedMetadata = () => {
    setDuration(audioRef.current?.duration ?? 0)
  }

  const onEnded = () => {
    playNext()
  }

  const onSeek = (e) => {
    const val = Number(e.target.value)
    if (audioRef.current && duration) {
      audioRef.current.currentTime = (val / 100) * duration
    }
    setCurrentTime((val / 100) * duration)
  }

  const onVolumeChange = (e) => {
    const val = Number(e.target.value)
    setVolume(val)
    if (isMuted && val > 0) setIsMuted(false)
  }

  const toggleMute = () => {
    setIsMuted((m) => !m)
  }

  /* ---- render ---- */
  return (
    <div className="playbar" id="playbar">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={song.src}
        preload="metadata"
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onEnded}
      />

      {/* Left: Song Info */}
      <div className="playbar__song-info" id="playbar-song-info">
        <div className="playbar__song-thumb">
          <img src={song.cover} alt={song.title} />
        </div>
        <div className="playbar__song-details">
          <span className="playbar__song-name">{song.title}</span>
          <span className="playbar__song-artist">{song.artist}</span>
        </div>
      </div>

      {/* Center: Controls + Seekbar */}
      <div className="playbar__controls">
        <div className="playbar__buttons">
          <button
            className="playbar__btn"
            id="previous-btn"
            aria-label="Previous"
            onClick={playPrev}
          >
            <IoPlaySkipBack />
          </button>
          <button
            className="playbar__btn playbar__btn--play"
            id="play-btn"
            aria-label={isPlaying ? 'Pause' : 'Play'}
            onClick={togglePlay}
          >
            {isPlaying ? <IoPause /> : <IoPlay />}
          </button>
          <button
            className="playbar__btn"
            id="next-btn"
            aria-label="Next"
            onClick={playNext}
          >
            <IoPlaySkipForward />
          </button>
        </div>

        <div className="playbar__seekbar-container">
          <span className="playbar__time" id="current-time">
            {fmtTime(currentTime)}
          </span>
          <input
            ref={seekRef}
            type="range"
            className="playbar__seekbar"
            id="seekbar"
            min="0"
            max="100"
            step="0.1"
            value={seekPercent}
            onChange={onSeek}
            style={{ '--fill': `${seekPercent}%` }}
          />
          <span className="playbar__time" id="total-duration">
            {fmtTime(duration)}
          </span>
        </div>
      </div>

      {/* Right: Volume */}
      <div className="playbar__volume" id="playbar-volume">
        <button
          className="playbar__volume-btn"
          id="mute-btn"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
          onClick={toggleMute}
        >
          {isMuted || volume === 0 ? (
            <HiSpeakerXMark className="playbar__volume-icon" />
          ) : (
            <HiSpeakerWave className="playbar__volume-icon" />
          )}
        </button>
        <input
          ref={volRef}
          type="range"
          className="playbar__volume-slider"
          id="volume-slider"
          min="0"
          max="100"
          value={isMuted ? 0 : volume}
          onChange={onVolumeChange}
          style={{ '--fill': `${volPercent}%` }}
        />
      </div>
    </div>
  )
}

export default Playbar
