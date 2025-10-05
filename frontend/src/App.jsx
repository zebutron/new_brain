import { useState } from 'react'
import StrudelEditor from './components/StrudelEditor'
import AudioVisualizer from './components/AudioVisualizer'
import { useStrudelDirect } from './hooks/useStrudelDirect'
import './App.css'

function App() {
  const [code, setCode] = useState(`stack(
  note("g1 ~ g1 ~")
    .s("sawtooth")
    .lpf(800)
    .resonance(15)
    .distort(0.8)
    .room(0.7)
    .decay(0.8)
    .gain(1.3),
  note("g2 ~ ~ g2")
    .s("square")
    .lpf(400)
    .distort(0.5)
    .gain(0.9),
  s("bd ~ ~ bd, ~ ~ sd ~")
    .gain(1.4)
    .room(0.8),
  s("~ ~ ~ ~, [~ ~ hh ~]*2")
    .gain(0.6),
  note("[e6 g6 c7 e7]*4")
    .s("sine")
    .lpf(8000)
    .decay(0.3)
    .gain(0.4)
    .delay(0.6)
    .delaytime(0.1875)
    .delayfeedback(0.5)
    .room(0.9)
)`)
  const { isPlaying, error, toggle } = useStrudelDirect()

  const handleCodeChange = (newCode) => {
    setCode(newCode)
  }

  const handlePlayToggle = () => {
    toggle(code)
  }

  const handleEvaluate = async (newCode) => {
    // Save code to backend
    try {
      await fetch('http://localhost:3001/api/code/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: newCode })
      })
      console.log('💾 Code saved')
    } catch (err) {
      console.error('Save failed:', err)
    }
    
    // Re-evaluate if playing
    if (isPlaying) {
      toggle(code)
      setTimeout(() => toggle(newCode), 100)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎵 New Brain</h1>
        <button
          className={`play-button ${isPlaying ? 'playing' : ''}`}
          onClick={handlePlayToggle}
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>
      </header>

      <main className="app-main">
        <div className="editor-section">
          <StrudelEditor
            code={code}
            onChange={handleCodeChange}
            isPlaying={isPlaying}
            error={error}
            onEvaluate={handleEvaluate}
          />
        </div>

        <div className="visualizer-section">
          <AudioVisualizer isPlaying={isPlaying} />
        </div>
      </main>
    </div>
  )
}

export default App

