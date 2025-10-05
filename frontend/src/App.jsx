import { useState } from 'react'
import StrudelEditor from './components/StrudelEditor'
import AudioVisualizer from './components/AudioVisualizer'
import { useStrudelDirect } from './hooks/useStrudelDirect'
import './App.css'

function App() {
  const [code, setCode] = useState('stack(note("c1 e1 g1 c2 e1 g1 c2 e1").s("sawtooth").lpf(400).room(0.5).gain(0.7),note("c0!4").s("sine").decay(0.08).sustain(0).distort(0.4).lpf(80).gain(1.5),note("~ <60 [61 59 60]> ~ 60").s("triangle").decay(0.08).sustain(0).hpf(150).lpf(1200).gain(1.2).sometimes(x=>x.distort(0.2)),note("~ ~ ~ ~, [~ ~ ~ ~]*4").s("sine").freq(rand.range(6000,10000)).decay(0.008).sustain(0).gain(0.4),note("<[c4 e4 g4] [~ ~ c5] ~!2>").s("square").lpf(4000).decay(0.06).gain(0.6).delay(0.5).delaytime(0.125).delayfeedback(0.4).sometimes(x=>x.add(note(rand.range(-12,12)))))')
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

