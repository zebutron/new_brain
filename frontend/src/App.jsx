import { useState } from 'react'
import StrudelEditor from './components/StrudelEditor'
import AudioVisualizer from './components/AudioVisualizer'
import { useStrudelDirect } from './hooks/useStrudelDirect'
import './App.css'

function App() {
  const [code, setCode] = useState(`stack(
  note("f2 ~ [f2 f2] ~, ~ ~ [f2 ab2] ~, f2 ~ f2 ~, ~ [f2 c3] ~ f2")
    .s("sawtooth")
    .lpf(1200)
    .resonance(8)
    .distort(0.6)
    .room(0.2)
    .decay(0.15)
    .gain(1.1),
  s("bd*4, ~ sd ~ sd, hh*8")
    .gain(1.3)
    .room(0.3),
  s("~ ~ cp ~")
    .gain(1.0)
    .delay(0.25)
    .delaytime(0.125),
  note("<[c5 eb5 f5] [f5 ab5 c6]>")
    .s("square")
    .lpf(6000)
    .decay(0.08)
    .gain(0.7)
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

