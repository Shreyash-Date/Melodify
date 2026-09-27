import { GoHome, GoHomeFill } from 'react-icons/go'
import { FiSearch } from 'react-icons/fi'
import { BiLibrary } from 'react-icons/bi'
import './Sidebar.css'

function Sidebar() {
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar__logo">
        <h1>Melodify</h1>
      </div>

      {/* Navigation */}
      <nav className="sidebar__nav">
        <ul>
          <li className="sidebar__nav-item active">
            <GoHomeFill className="sidebar__nav-icon" />
            <span>Home</span>
          </li>
          <li className="sidebar__nav-item">
            <FiSearch className="sidebar__nav-icon" />
            <span>Search</span>
          </li>
        </ul>
      </nav>

      {/* Library */}
      <div className="sidebar__library">
        <div className="sidebar__library-header">
          <BiLibrary className="sidebar__library-icon" />
          <span>Your Library</span>
        </div>

        <div className="sidebar__library-content">
          {/* Song list will be populated in Commit 3 */}
          <div className="sidebar__library-empty">
            <p>Your song library will appear here</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="sidebar__footer">
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
