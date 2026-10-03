import { useState } from 'react'
import { GoHome, GoHomeFill } from 'react-icons/go'
import { FiSearch } from 'react-icons/fi'
import { BiLibrary } from 'react-icons/bi'
import { HiPlus } from 'react-icons/hi2'
import { usePlayer } from '../../context/PlayerContext'
import './Sidebar.css'

function Sidebar() {
  const {
    view, songs, currentIndex, isPlaying, playSong,
    goHome, detailInfo, isDetailLoading,
  } = usePlayer()

  const isHome = view === 'home'

  return (
    <aside className="sidebar" id="sidebar">
      {/* Logo */}
      <div className="sidebar__logo" id="sidebar-logo" onClick={goHome}>
        <img
          src="/images/melodify-logo.jpg"
          alt="Melodify Logo"
          className="sidebar__logo-icon"
        />
        <h1>Melodify</h1>
      </div>

      {/* Navigation */}
      <nav className="sidebar__nav" id="sidebar-nav">
        <ul>
          <li
            className={`sidebar__nav-item ${isHome ? 'active' : ''}`}
            id="nav-home"
            onClick={goHome}
          >
            {isHome ? (
              <GoHomeFill className="sidebar__nav-icon" />
            ) : (
              <GoHome className="sidebar__nav-icon" />
            )}
            <span>Home</span>
          </li>
          <li
            className={`sidebar__nav-item ${view === 'search' ? 'active' : ''}`}
            id="nav-search"
          >
            <FiSearch className="sidebar__nav-icon" />
            <span>Search</span>
          </li>
        </ul>
      </nav>

      {/* Library */}
      <div className="sidebar__library" id="sidebar-library">
        <div className="sidebar__library-header">
          <div className="sidebar__library-header-left">
            <BiLibrary className="sidebar__library-icon" />
            <span>
              {detailInfo ? detailInfo.title : 'Your Library'}
            </span>
          </div>
          <button className="sidebar__library-add-btn" id="library-add-btn" title="Create playlist">
            <HiPlus />
          </button>
        </div>

        {/* Song List — shows current playlist/album tracks */}
        <div className="sidebar__library-content" id="library-song-list">
          {isDetailLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="sidebar__song-item">
                <div className="skeleton sidebar__song-cover-skeleton" />
                <div className="sidebar__song-info">
                  <span className="skeleton skeleton--text" style={{ width: '70%' }} />
                  <span className="skeleton skeleton--text-sm" />
                </div>
              </div>
            ))
          ) : songs.length === 0 ? (
            <div className="sidebar__empty-message">
              <p>Pick an album or playlist to start listening</p>
            </div>
          ) : (
            songs.map((song, index) => (
              <div
                key={song.id}
                className={`sidebar__song-item ${currentIndex === index ? 'active' : ''}`}
                id={`song-item-${song.id}`}
                onClick={() => playSong(index)}
              >
                <img
                  src={song.cover}
                  alt={song.title}
                  className="sidebar__song-cover"
                />
                <div className="sidebar__song-info">
                  <span className={`sidebar__song-title ${currentIndex === index ? 'active' : ''}`}>
                    {song.title}
                  </span>
                  <span className="sidebar__song-artist">{song.artist}</span>
                </div>
                <span className="sidebar__song-duration">{song.duration}</span>
                {currentIndex === index && isPlaying && (
                  <div className="sidebar__song-playing-indicator" id="playing-indicator">
                    <span className="sidebar__bar"></span>
                    <span className="sidebar__bar"></span>
                    <span className="sidebar__bar"></span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="sidebar__footer" id="sidebar-footer">
        <div className="sidebar__footer-links">
          <a href="#">Legal</a>
          <a href="#">Privacy</a>
          <a href="#">Cookies</a>
          <a href="#">About</a>
        </div>
      </footer>
    </aside>
  )
}

export default Sidebar
