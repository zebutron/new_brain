import { useState } from 'react'
import StrudelEditor from './components/StrudelEditor'
import AudioVisualizer from './components/AudioVisualizer'
import { useStrudelDirect } from './hooks/useStrudelDirect'
import './App.css'

function App() {
  const [code, setCode] = useState(`slowcat(
  stack(
    note("a1 bb1 a1 ab1")
      .s("sawtooth")
      .lpf(800)
      .resonance(15)
      .distort(0.8)
      .room(0.7)
      .decay(0.8)
      .gain(1.3),
    note("a0 bb0 a0 ab0")
      .s("sine")
      .lpf(200)
      .distort(0.3)
      .gain(1.0),
    s("bd ~ ~ bd, ~ ~ sd ~")
      .gain(1.4)
      .room(0.8),
    s("~ ~ ~ ~, [~ ~ hh ~]*2")
      .gain(0.6),
    note("[~ ~ a4 ~] [~ c5 ~ ~] [~ ~ eb5 ~] [d5 ~ ~ ~]")
      .s("sawtooth")
      .lpf(sine.range(800, 2000).slow(4))
      .distort(sine.range(0.3, 0.7).slow(3))
      .gain(sine.range(0.6, 0.9).slow(2.5))
      .decay(0.6)
      .room(0.8)
  ),
  stack(
    note("e1 f1 e1 eb1")
      .s("sawtooth")
      .lpf(600)
      .resonance(18)
      .distort(0.9)
      .room(0.8)
      .decay(0.9)
      .gain(1.5),
    note("e0 f0 e0 eb0")
      .s("sine")
      .lpf(150)
      .distort(0.4)
      .gain(1.2),
    note("e-1 f-1 e-1 eb-1")
      .s("sine")
      .lpf(80)
      .gain(0.8),
    s("bd ~ ~ bd, ~ ~ sd ~")
      .gain(1.5)
      .room(0.9),
    s("~ ~ ~ ~, [~ ~ hh ~]*2")
      .gain(0.5),
    note("[e4 f4 ~ gb4] [~ ab4 f4 ~] [e4 ~ eb4 db4] [c4 ~ db4 eb4]")
      .s("sawtooth")
      .lpf(sine.range(600, 1800).slow(3))
      .distort(sine.range(0.5, 0.9).slow(2.5))
      .gain(sine.range(0.7, 1.0).slow(2))
      .decay(0.4)
      .room(0.9)
  )
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

