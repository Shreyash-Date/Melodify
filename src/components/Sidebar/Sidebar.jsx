import { useState } from 'react'
import { GoHome, GoHomeFill } from 'react-icons/go'
import { FiSearch } from 'react-icons/fi'
import { BiLibrary } from 'react-icons/bi'
import { IoMusicalNotes } from 'react-icons/io5'
import { HiPlus } from 'react-icons/hi2'
import songs from '../../data/songs'
import './Sidebar.css'

function Sidebar() {
  const [activeNav, setActiveNav] = useState('home')
  const [activeSongId, setActiveSongId] = useState(null)

  return (
    <aside className="sidebar" id="sidebar">
      {/* Logo */}
      <div className="sidebar__logo" id="sidebar-logo">
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
            className={`sidebar__nav-item ${activeNav === 'home' ? 'active' : ''}`}
            id="nav-home"
            onClick={() => setActiveNav('home')}
          >
            {activeNav === 'home' ? (
              <GoHomeFill className="sidebar__nav-icon" />
            ) : (
              <GoHome className="sidebar__nav-icon" />
            )}
            <span>Home</span>
          </li>
          <li
            className={`sidebar__nav-item ${activeNav === 'search' ? 'active' : ''}`}
            id="nav-search"
            onClick={() => setActiveNav('search')}
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
            <span>Your Library</span>
          </div>
          <button className="sidebar__library-add-btn" id="library-add-btn" title="Create playlist">
            <HiPlus />
          </button>
        </div>

        {/* Song List */}
        <div className="sidebar__library-content" id="library-song-list">
          {songs.map((song) => (
            <div
              key={song.id}
              className={`sidebar__song-item ${activeSongId === song.id ? 'active' : ''}`}
              id={`song-item-${song.id}`}
              onClick={() => setActiveSongId(song.id)}
            >
              <img
                src={song.cover}
                alt={song.title}
                className="sidebar__song-cover"
              />
              <div className="sidebar__song-info">
                <span className={`sidebar__song-title ${activeSongId === song.id ? 'active' : ''}`}>
                  {song.title}
                </span>
                <span className="sidebar__song-artist">{song.artist}</span>
              </div>
              <span className="sidebar__song-duration">{song.duration}</span>
              {activeSongId === song.id && (
                <div className="sidebar__song-playing-indicator" id="playing-indicator">
                  <span className="sidebar__bar"></span>
                  <span className="sidebar__bar"></span>
                  <span className="sidebar__bar"></span>
                </div>
              )}
            </div>
          ))}
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
