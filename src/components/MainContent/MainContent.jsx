import './MainContent.css'

function MainContent() {
  return (
    <main className="main-content">
      {/* Header */}
      <header className="main-content__header">
        <div className="main-content__header-actions">
          <button className="btn btn--outline">Sign Up</button>
          <button className="btn btn--solid">Log In</button>
        </div>
      </header>

      {/* Content Area */}
      <div className="main-content__body">
        <section className="main-content__section">
          <h2 className="main-content__title">Playlist</h2>

          {/* Playlist cards will be built in Commit 4 */}
          <div className="main-content__grid">
            <div className="main-content__card">
              <div className="main-content__card-image">
                <img src="/images/top50.png" alt="Top 50 Songs" />
              </div>
              <p className="main-content__card-title">Top 50 Songs</p>
              <p className="main-content__card-subtitle">Your top tracks</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default MainContent
