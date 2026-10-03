import { useState } from 'react'
import { IoPlay, IoPause } from 'react-icons/io5'
import { FiSearch } from 'react-icons/fi'
import { IoArrowBack } from 'react-icons/io5'
import { usePlayer } from '../../context/PlayerContext'
import './MainContent.css'

/* ============================================
   SKELETON COMPONENTS
   ============================================ */

function SkeletonCard() {
  return (
    <div className="browse-card browse-card--skeleton">
      <div className="skeleton browse-card__img-skeleton" />
      <div className="skeleton skeleton--text" style={{ width: '75%', marginTop: 10 }} />
      <div className="skeleton skeleton--text-sm" style={{ marginTop: 6 }} />
    </div>
  )
}

function SkeletonRow() {
  return (
    <div className="song-list__skeleton-row">
      <span className="skeleton song-list__skeleton-num" />
      <div className="song-list__skeleton-title-group">
        <span className="skeleton song-list__skeleton-cover" />
        <div className="song-list__skeleton-text-group">
          <span className="skeleton song-list__skeleton-title" />
          <span className="skeleton song-list__skeleton-artist" />
        </div>
      </div>
      <span className="skeleton song-list__skeleton-album" />
      <span className="skeleton song-list__skeleton-duration" />
    </div>
  )
}

/* ============================================
   HOME VIEW — Browse Albums & Playlists
   ============================================ */

function HomeView() {
  const { albums, playlists, isBrowseLoading, openCollection } = usePlayer()

  return (
    <div className="main-content__body">
      {/* ── Trending Albums ── */}
      <section className="browse-section">
        <h2 className="browse-section__title">Trending Albums</h2>
        <div className="browse-grid">
          {isBrowseLoading
            ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
            : albums.map((album) => (
                <button
                  key={album.id}
                  className="browse-card"
                  onClick={() => openCollection(album)}
                >
                  <div className="browse-card__img-wrapper">
                    <img src={album.cover} alt={album.title} className="browse-card__img" />
                    <div className="browse-card__play-overlay">
                      <span className="browse-card__play-btn">
                        <IoPlay size={22} />
                      </span>
                    </div>
                  </div>
                  <span className="browse-card__title">{album.title}</span>
                  <span className="browse-card__subtitle">{album.artist}</span>
                </button>
              ))
          }
        </div>
      </section>

      {/* ── Popular Playlists ── */}
      <section className="browse-section">
        <h2 className="browse-section__title">Popular Playlists</h2>
        <div className="browse-grid">
          {isBrowseLoading
            ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={`p-${i}`} />)
            : playlists.map((pl) => (
                <button
                  key={pl.id}
                  className="browse-card"
                  onClick={() => openCollection(pl)}
                >
                  <div className="browse-card__img-wrapper">
                    <img src={pl.cover} alt={pl.title} className="browse-card__img" />
                    <div className="browse-card__play-overlay">
                      <span className="browse-card__play-btn">
                        <IoPlay size={22} />
                      </span>
                    </div>
                  </div>
                  <span className="browse-card__title">{pl.title}</span>
                  <span className="browse-card__subtitle">
                    {pl.trackCount ? `${pl.trackCount} tracks` : pl.artist}
                  </span>
                </button>
              ))
          }
        </div>
      </section>

      {/* Deezer attribution */}
      <div className="main-content__attribution">
        Powered by <a href="https://www.deezer.com" target="_blank" rel="noopener noreferrer">Deezer</a>
      </div>

      <div className="main-content__spacer" />
    </div>
  )
}

/* ============================================
   SEARCH VIEW — Search Results
   ============================================ */

function SearchView() {
  const {
    searchResults, isSearchLoading, searchQuery,
    openCollection, playTrackFromList,
    songs, currentIndex, isPlaying,
  } = usePlayer()
  const [hoveredSong, setHoveredSong] = useState(null)

  if (isSearchLoading) {
    return (
      <div className="main-content__body">
        <h2 className="browse-section__title" style={{ marginBottom: 16 }}>Searching…</h2>
        <div className="browse-grid">
          {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
        {Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)}
      </div>
    )
  }

  const { tracks, albums } = searchResults

  return (
    <div className="main-content__body">
      <h2 className="browse-section__title">Results for "{searchQuery}"</h2>

      {/* Albums found */}
      {albums.length > 0 && (
        <section className="browse-section">
          <h3 className="browse-section__subtitle">Albums</h3>
          <div className="browse-grid">
            {albums.map((album) => (
              <button
                key={album.id}
                className="browse-card"
                onClick={() => openCollection(album)}
              >
                <div className="browse-card__img-wrapper">
                  <img src={album.cover} alt={album.title} className="browse-card__img" />
                  <div className="browse-card__play-overlay">
                    <span className="browse-card__play-btn">
                      <IoPlay size={22} />
                    </span>
                  </div>
                </div>
                <span className="browse-card__title">{album.title}</span>
                <span className="browse-card__subtitle">{album.artist}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Tracks found */}
      {tracks.length > 0 && (
        <section className="browse-section">
          <h3 className="browse-section__subtitle">Songs</h3>
          <div className="song-list">
            {tracks.map((track, index) => {
              const isCurrent = songs[currentIndex]?.id === track.id
              const isCurrentPlaying = isCurrent && isPlaying
              const isHovered = hoveredSong === track.id

              return (
                <div
                  key={track.id}
                  className={[
                    'song-list__row',
                    isCurrent ? 'song-list__row--active' : '',
                  ].join(' ')}
                  onMouseEnter={() => setHoveredSong(track.id)}
                  onMouseLeave={() => setHoveredSong(null)}
                  onClick={() => playTrackFromList(tracks, index)}
                >
                  <span className="song-list__col song-list__col--num">
                    {isHovered ? (
                      isCurrentPlaying
                        ? <IoPause className="song-list__play-icon" />
                        : <IoPlay className="song-list__play-icon" />
                    ) : isCurrentPlaying ? (
                      <span className="song-list__equalizer">
                        <span className="song-list__eq-bar" />
                        <span className="song-list__eq-bar" />
                        <span className="song-list__eq-bar" />
                      </span>
                    ) : (
                      <span className="song-list__row-number">{index + 1}</span>
                    )}
                  </span>
                  <div className="song-list__col song-list__col--title">
                    <div className="song-list__cover">
                      <img src={track.cover} alt={track.title} />
                      <div className="song-list__cover-overlay">
                        {isCurrentPlaying ? <IoPause size={18} /> : <IoPlay size={18} />}
                      </div>
                    </div>
                    <div className="song-list__info">
                      <span className={`song-list__song-title ${isCurrent ? 'song-list__song-title--active' : ''}`}>
                        {track.title}
                      </span>
                      <span className="song-list__artist">{track.artist}</span>
                    </div>
                  </div>
                  <span className="song-list__col song-list__col--album">{track.album}</span>
                  <span className="song-list__col song-list__col--duration">{track.duration}</span>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {tracks.length === 0 && albums.length === 0 && (
        <div className="song-list__empty">
          <p>No results found. Try a different search!</p>
        </div>
      )}

      <div className="main-content__attribution">
        Powered by <a href="https://www.deezer.com" target="_blank" rel="noopener noreferrer">Deezer</a>
      </div>
      <div className="main-content__spacer" />
    </div>
  )
}

/* ============================================
   DETAIL VIEW — Album / Playlist Track List
   ============================================ */

function DetailView() {
  const {
    songs, currentIndex, isPlaying,
    playSong, play, goHome,
    detailInfo, isDetailLoading,
  } = usePlayer()
  const [hoveredSong, setHoveredSong] = useState(null)

  const totalDuration = songs.reduce((acc, s) => acc + (s.durationSec || 0), 0)
  const totalMin = Math.floor(totalDuration / 60)

  const handlePlayAll = () => {
    if (songs.length === 0) return
    if (currentIndex === 0 && isPlaying) return
    playSong(0)
    if (currentIndex === 0) play()
  }

  return (
    <div className="main-content__body">
      {/* Back button */}
      <button className="detail-back-btn" onClick={goHome}>
        <IoArrowBack size={18} />
        <span>Back</span>
      </button>

      {/* ── Hero ── */}
      {isDetailLoading ? (
        <section className="playlist-hero">
          <div className="playlist-hero__gradient" />
          <div className="playlist-hero__inner">
            <div className="skeleton" style={{ width: 232, height: 232, borderRadius: 12 }} />
            <div className="playlist-hero__info" style={{ gap: 12, flex: 1 }}>
              <div className="skeleton skeleton--text" style={{ width: 60 }} />
              <div className="skeleton" style={{ width: '70%', height: 40, borderRadius: 8 }} />
              <div className="skeleton skeleton--text" style={{ width: '50%' }} />
              <div className="skeleton skeleton--text-sm" />
            </div>
          </div>
        </section>
      ) : detailInfo && (
        <section className="playlist-hero">
          <div className="playlist-hero__gradient" />
          <div className="playlist-hero__inner">
            <div className="playlist-hero__cover">
              <img src={detailInfo.coverLarge || detailInfo.cover} alt={detailInfo.title} />
              <div className="playlist-hero__cover-glow" />
            </div>
            <div className="playlist-hero__info">
              <span className="playlist-hero__tag">
                {detailInfo.type === 'album' ? 'Album' : 'Playlist'}
              </span>
              <h1 className="playlist-hero__title">{detailInfo.title}</h1>
              {detailInfo.description && (
                <p className="playlist-hero__description">{detailInfo.description}</p>
              )}
              <div className="playlist-hero__meta">
                <span className="playlist-hero__meta-item">
                  <img src="/images/melodify-logo.jpg" alt="Melodify" className="playlist-hero__meta-avatar" />
                  {detailInfo.artist}
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
      )}

      {/* ── Action Bar ── */}
      <div className="action-bar">
        <button className="action-bar__play" aria-label="Play all" onClick={handlePlayAll}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
            <path d="M8 5.14v14l11-7-11-7z" />
          </svg>
        </button>
        <button className="action-bar__btn" aria-label="Shuffle">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
            <polyline points="16 3 21 3 21 8" /><line x1="4" y1="20" x2="21" y2="3" />
            <polyline points="21 16 21 21 16 21" /><line x1="15" y1="15" x2="21" y2="21" />
            <line x1="4" y1="4" x2="9" y2="9" />
          </svg>
        </button>
        <button className="action-bar__btn" aria-label="Add to library">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
          </svg>
        </button>
        <button className="action-bar__btn" aria-label="More options">
          <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
            <circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" />
          </svg>
        </button>
      </div>

      {/* ── Song List ── */}
      <section className="song-list">
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

        {isDetailLoading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
        ) : songs.length === 0 ? (
          <div className="song-list__empty"><p>No playable tracks found.</p></div>
        ) : (
          songs.map((track, index) => {
            const isActive = currentIndex === index
            const isActiveAndPlaying = isActive && isPlaying
            const isHovered = hoveredSong === track.id

            return (
              <div
                key={track.id}
                className={[
                  'song-list__row',
                  isHovered ? 'song-list__row--hovered' : '',
                  isActive ? 'song-list__row--active' : '',
                ].join(' ')}
                onMouseEnter={() => setHoveredSong(track.id)}
                onMouseLeave={() => setHoveredSong(null)}
                onClick={() => playSong(index)}
              >
                <span className="song-list__col song-list__col--num">
                  {isHovered ? (
                    isActiveAndPlaying
                      ? <IoPause className="song-list__play-icon" />
                      : <IoPlay className="song-list__play-icon" />
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
                <div className="song-list__col song-list__col--title">
                  <div className="song-list__cover">
                    <img src={track.cover} alt={track.title} />
                    <div className="song-list__cover-overlay">
                      {isActiveAndPlaying ? <IoPause size={18} /> : <IoPlay size={18} />}
                    </div>
                  </div>
                  <div className="song-list__info">
                    <span className={`song-list__song-title ${isActive ? 'song-list__song-title--active' : ''}`}>
                      {track.title}
                    </span>
                    <span className="song-list__artist">{track.artist}</span>
                  </div>
                </div>
                <span className="song-list__col song-list__col--album">{track.album}</span>
                <span className="song-list__col song-list__col--duration">{track.duration}</span>
              </div>
            )
          })
        )}
      </section>

      <div className="main-content__attribution">
        Previews powered by <a href="https://www.deezer.com" target="_blank" rel="noopener noreferrer">Deezer</a>
      </div>
      <div className="main-content__spacer" />
    </div>
  )
}

/* ============================================
   MAIN CONTENT — View Router
   ============================================ */

function MainContent() {
  const { view, search, goHome } = usePlayer()
  const [localQuery, setLocalQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (!localQuery.trim()) return
    search(localQuery)
  }

  const handleClearSearch = () => {
    setLocalQuery('')
    goHome()
  }

  return (
    <main className="main-content">
      {/* Sticky Nav Header */}
      <header className="main-content__header">
        {/* Back to home */}
        {view !== 'home' && (
          <button className="main-content__home-btn" onClick={goHome} aria-label="Home">
            <IoArrowBack size={18} />
          </button>
        )}

        {/* Search bar */}
        <form className="main-content__search" onSubmit={handleSearch}>
          <FiSearch className="main-content__search-icon" />
          <input
            type="text"
            className="main-content__search-input"
            placeholder="Search songs, albums, artists…"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            id="search-input"
          />
          {localQuery && (
            <button
              type="button"
              className="main-content__search-clear"
              onClick={handleClearSearch}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </form>

        <div className="main-content__header-actions">
          <button className="btn btn--outline">Sign Up</button>
          <button className="btn btn--solid">Log In</button>
        </div>
      </header>

      {/* View Router */}
      {view === 'home' && <HomeView />}
      {view === 'detail' && <DetailView />}
      {view === 'search' && <SearchView />}
    </main>
  )
}

export default MainContent
