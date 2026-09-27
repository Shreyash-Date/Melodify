import {
  IoPlaySkipBack,
  IoPlaySkipForward,
  IoPlay,
} from 'react-icons/io5'
import { HiSpeakerWave } from 'react-icons/hi2'
import './Playbar.css'

function Playbar() {
  return (
    <div className="playbar">
      {/* Left: Song Info */}
      <div className="playbar__song-info">
        <div className="playbar__song-thumb">
          {/* Thumbnail will show when a song is playing */}
        </div>
        <div className="playbar__song-details">
          <span className="playbar__song-name">No song playing</span>
          <span className="playbar__song-artist">—</span>
        </div>
      </div>

      {/* Center: Controls + Seekbar */}
      <div className="playbar__controls">
        <div className="playbar__buttons">
          <button className="playbar__btn" id="previous-btn">
            <IoPlaySkipBack />
          </button>
          <button className="playbar__btn playbar__btn--play" id="play-btn">
            <IoPlay />
          </button>
          <button className="playbar__btn" id="next-btn">
            <IoPlaySkipForward />
          </button>
        </div>
        <div className="playbar__seekbar-container">
          <span className="playbar__time">0:00</span>
          <input
            type="range"
            className="playbar__seekbar"
            id="seekbar"
            min="0"
            max="100"
            defaultValue="0"
          />
          <span className="playbar__time">0:00</span>
        </div>
      </div>

      {/* Right: Volume */}
      <div className="playbar__volume">
        <HiSpeakerWave className="playbar__volume-icon" />
        <input
          type="range"
          className="playbar__volume-slider"
          id="volume-slider"
          min="0"
          max="100"
          defaultValue="70"
        />
      </div>
    </div>
  )
}

export default Playbar
