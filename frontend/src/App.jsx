import { useState } from 'react'
import StrudelEditor from './components/StrudelEditor'
import AudioVisualizer from './components/AudioVisualizer'
import { useStrudelDirect } from './hooks/useStrudelDirect'
import './App.css'

function App() {
  const [code, setCode] = useState(`stack(
  note("c1 e1 g1 c2 e1 g1 c2 e1")
    .s("sawtooth")
    .lpf(400)
    .room(0.5)
    .gain(0.7)
    .sometimes(x => x.add(note(12))),
  s("bd*4, ~ sd ~ <sd sd sd [sd ~ ~ sd]>")
    .gain(1.2),
  s("<[hh ~ hh ~] [~ [hh hh] ~ hh] [hh ~ ~ [hh ~ hh ~]] [~ hh [hh ~ hh] ~]>")
    .gain(0.7),
  s("~ ~ ~ cp")
    .gain(0.9)
    .delay(0.4)
    .delayfeedback(0.3),
  note("<[e5 ~ ~ e5] [g5 ~ a5 ~] [~ c6 ~ b5] [a5 ~ g5 e5]>")
    .s("square")
    .lpf(5000)
    .decay(0.15)
    .gain(0.7)
    .delay(0.4)
    .delaytime(0.0833)
    .delayfeedback(0.25)
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

