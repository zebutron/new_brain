import './ControlPanel.css'

function ControlPanel({ isPlaying, onPlayToggle }) {
  return (
    <div className="control-panel">
      <div className="control-group">
        <button
          className={`play-button ${isPlaying ? 'playing' : ''}`}
          onClick={onPlayToggle}
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>
      </div>

      <div className="control-group">
        <label className="control-label">
          Master Volume
          <input type="range" min="0" max="100" defaultValue="70" className="control-slider" />
        </label>
      </div>

      <div className="control-group">
        <label className="control-label">
          BPM
          <input type="number" min="60" max="200" defaultValue="120" className="control-input" />
        </label>
      </div>

      <div className="feedback-section">
        <span className="feedback-label">Quality Feedback:</span>
        <div className="feedback-buttons">
          <button className="feedback-btn" title="Needs work">😐</button>
          <button className="feedback-btn" title="Good">🙂</button>
          <button className="feedback-btn" title="Great">😊</button>
          <button className="feedback-btn" title="Exceptional">🤩</button>
        </div>
      </div>
    </div>
  )
}

export default ControlPanel

