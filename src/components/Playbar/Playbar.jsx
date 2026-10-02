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
import { usePlayer, fmtTime } from '../../context/PlayerContext'
import './Playbar.css'

function Playbar() {
  const {
    song,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    seekPercent,
    volPercent,
    togglePlay,
    playPrev,
    playNext,
    onSeek,
    onVolumeChange,
    toggleMute,
  } = usePlayer()

  /* ---- render ---- */
  return (
    <div className="playbar" id="playbar">
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
            type="range"
            className="playbar__seekbar"
            id="seekbar"
            min="0"
            max="100"
            step="0.1"
            value={seekPercent}
            onChange={(e) => onSeek(Number(e.target.value))}
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
          type="range"
          className="playbar__volume-slider"
          id="volume-slider"
          min="0"
          max="100"
          value={isMuted ? 0 : volume}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          style={{ '--fill': `${volPercent}%` }}
        />
      </div>
    </div>
  )
}

export default Playbar
