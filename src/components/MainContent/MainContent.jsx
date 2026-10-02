import { useState } from 'react'
import { IoPlay, IoPause } from 'react-icons/io5'
import songs from '../../data/songs'
import { usePlayer } from '../../context/PlayerContext'
import './MainContent.css'

function MainContent() {
  const [hoveredSong, setHoveredSong] = useState(null)
  const { currentIndex, isPlaying, playSong, play } = usePlayer()

  const totalDuration = songs.reduce((acc, song) => {
    const [min, sec] = song.duration.split(':').map(Number)
    return acc + min * 60 + sec
  }, 0)
  const totalMin = Math.floor(totalDuration / 60)

  /** Play-all: start from the first song */
  const handlePlayAll = () => {
    if (currentIndex === 0 && isPlaying) {
      // Already playing from the start — do nothing (or could pause)
      return
    }
    playSong(0)
    // If the first song is already selected but paused, just play
    if (currentIndex === 0) play()
  }

  return (
    <main className="main-content">
      {/* Sticky Nav Header */}
      <header className="main-content__header">
        <div className="main-content__header-actions">
          <button className="btn btn--outline">Sign Up</button>
          <button className="btn btn--solid">Log In</button>
        </div>
      </header>

      {/* Scrollable Body */}
      <div className="main-content__body">

        {/* ── Playlist Hero ── */}
        <section className="playlist-hero">
          <div className="playlist-hero__gradient" />
          <div className="playlist-hero__inner">
            <div className="playlist-hero__cover">
              <img src="/images/top50.png" alt="Top 50 Songs" />
              <div className="playlist-hero__cover-glow" />
            </div>
            <div className="playlist-hero__info">
              <span className="playlist-hero__tag">Playlist</span>
              <h1 className="playlist-hero__title">Top 50 Songs</h1>
              <p className="playlist-hero__description">
                Your most‑played tracks, refreshed daily. A curated mix of the songs you can't stop listening to.
              </p>
              <div className="playlist-hero__meta">
                <span className="playlist-hero__meta-item">
                  <img src="/images/melodify-logo.jpg" alt="Melodify" className="playlist-hero__meta-avatar" />
                  Melodify
                </span>
                <span className="playlist-hero__meta-dot">•</span>
                <span className="playlist-hero__meta-item">{songs.length} songs</span>
                <span className="playlist-hero__meta-dot">•</span>
                <span className="playlist-hero__meta-item playlist-hero__meta-item--muted">
                  about {totalMin} min
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Action Bar ── */}
        <div className="action-bar">
          <button className="action-bar__play" aria-label="Play all" onClick={handlePlayAll}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
              <path d="M8 5.14v14l11-7-11-7z" />
            </svg>
          </button>
          <button className="action-bar__btn" aria-label="Shuffle">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
              <polyline points="16 3 21 3 21 8" />
              <line x1="4" y1="20" x2="21" y2="3" />
              <polyline points="21 16 21 21 16 21" />
              <line x1="15" y1="15" x2="21" y2="21" />
              <line x1="4" y1="4" x2="9" y2="9" />
            </svg>
          </button>
          <button className="action-bar__btn" aria-label="Add to library">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          </button>
          <button className="action-bar__btn" aria-label="More options">
            <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
              <circle cx="5" cy="12" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="19" cy="12" r="1.5" />
            </svg>
          </button>
        </div>

        {/* ── Song List ── */}
        <section className="song-list">
          {/* Column headers */}
          <div className="song-list__header">
            <span className="song-list__col song-list__col--num">#</span>
            <span className="song-list__col song-list__col--title">Title</span>
            <span className="song-list__col song-list__col--album">Album</span>
            <span className="song-list__col song-list__col--duration">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
              </svg>
            </span>
          </div>

          <div className="song-list__divider" />

          {/* Song rows */}
          {songs.map((song, index) => {
            const isActive = currentIndex === index
            const isActiveAndPlaying = isActive && isPlaying
            const isHovered = hoveredSong === song.id

            return (
              <div
                key={song.id}
                className={[
                  'song-list__row',
                  isHovered ? 'song-list__row--hovered' : '',
                  isActive ? 'song-list__row--active' : '',
                ].join(' ')}
                onMouseEnter={() => setHoveredSong(song.id)}
                onMouseLeave={() => setHoveredSong(null)}
                onClick={() => playSong(index)}
              >
                {/* Row number / play indicator */}
                <span className="song-list__col song-list__col--num">
                  {isHovered ? (
                    isActiveAndPlaying ? (
                      <IoPause className="song-list__play-icon" />
                    ) : (
                      <IoPlay className="song-list__play-icon" />
                    )
                  ) : isActiveAndPlaying ? (
                    <span className="song-list__equalizer" aria-label="Now playing">
                      <span className="song-list__eq-bar" />
                      <span className="song-list__eq-bar" />
                      <span className="song-list__eq-bar" />
                    </span>
                  ) : (
                    <span className={`song-list__row-number ${isActive ? 'song-list__row-number--active' : ''}`}>
                      {index + 1}
                    </span>
                  )}
                </span>

                {/* Cover + Title + Artist */}
                <div className="song-list__col song-list__col--title">
                  <div className="song-list__cover">
                    <img src={song.cover} alt={song.title} />
                    <div className="song-list__cover-overlay">
                      {isActiveAndPlaying ? (
                        <IoPause size={18} />
                      ) : (
                        <IoPlay size={18} />
                      )}
                    </div>
                  </div>
                  <div className="song-list__info">
                    <span className={`song-list__song-title ${isActive ? 'song-list__song-title--active' : ''}`}>
                      {song.title}
                    </span>
                    <span className="song-list__artist">{song.artist}</span>
                  </div>
                </div>

                {/* Album (uses title as placeholder) */}
                <span className="song-list__col song-list__col--album">
                  {song.title} — Single
                </span>

                {/* Duration */}
                <span className="song-list__col song-list__col--duration">
                  {song.duration}
                </span>
              </div>
            )
          })}
        </section>

        {/* Bottom spacer so last row isn't hidden by playbar */}
        <div className="main-content__spacer" />
      </div>
    </main>
  )
}

export default MainContent
