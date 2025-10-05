import { useState } from 'react'
import StrudelEditor from './components/StrudelEditor'
import AudioVisualizer from './components/AudioVisualizer'
import { useStrudelDirect } from './hooks/useStrudelDirect'
import './App.css'

function App() {
  const [code, setCode] = useState('stack(note("c1 e1 g1 c2 e1 g1 c2 e1").s("sawtooth").lpf(400).room(0.3).gain(0.6),note("c0!4").s("sine").decay(0.08).sustain(0).distort(0.3).lpf(80).gain(1.4),note("~ <60 [61 59]> ~ 60").s("sine").decay(0.06).sustain(0).hpf(200).lpf(800).gain(1.1),note("[~ ~ ~]*16").s("sine").freq(8000).decay(0.01).sustain(0).gain(0.3).sometimes(x=>x.gain(0.7)),note("<[c4 e4 g4] ~!3>").s("square").lpf(3000).decay(0.05).gain(0.5).sometimes(x=>x.add(note(12))).delay(0.4).delaytime(0.125))')
  const { isPlaying, error, toggle } = useStrudelDirect()

  const handleCodeChange = (newCode) => {
    setCode(newCode)
  }

  const handlePlayToggle = () => {
    toggle(code)
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

