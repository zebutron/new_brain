import { useState } from 'react'
import StrudelEditor from './components/StrudelEditor'
import AudioVisualizer from './components/AudioVisualizer'
import { useStrudelDirect } from './hooks/useStrudelDirect'
import './App.css'

function App() {
  const [code, setCode] = useState(`stack(
  note("<[a1 bb1 a1 ab1]*4 [e1 f1 e1 eb1]*4>")
    .s("sawtooth")
    .lpf("<800!4 600!4>")
    .resonance("<15!4 18!4>")
    .distort("<0.8!4 0.9!4>")
    .room("<0.7!4 0.8!4>")
    .decay("<0.8!4 0.9!4>")
    .gain("<1.3!4 1.5!4>"),
  note("<[a0 bb0 a0 ab0]*4 [e0 f0 e0 eb0]*4>")
    .s("sine")
    .lpf("<200!4 150!4>")
    .distort("<0.3!4 0.4!4>")
    .gain("<1.0!4 1.2!4>"),
  note("<~!4 [e-1 f-1 e-1 eb-1]*4>")
    .s("sine")
    .lpf(80)
    .gain(0.8),
  s("bd ~ ~ bd, ~ ~ sd ~")
    .gain("<1.4!4 1.5!4>")
    .room("<0.8!4 0.9!4>"),
  s("~ ~ ~ ~, [~ ~ hh ~]*2")
    .gain("<0.6!4 0.5!4>"),
  note("<<[~ ~ a4 ~] [~ c5 ~ ~] [~ ~ eb5 ~] [d5 ~ ~ ~]> <[e4 f4 ~ gb4] [~ ab4 f4 ~] [e4 ~ eb4 db4] [c4 ~ db4 eb4]>>")
    .s("sawtooth")
    .lpf(sine.range(800, 2000).slow(8))
    .distort(sine.range(0.3, 0.7).slow(6))
    .gain(sine.range(0.6, 0.9).slow(5))
    .decay("<0.6!4 0.4!4>")
    .room("<0.8!4 0.9!4>")
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

