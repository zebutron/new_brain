import { useState, useEffect } from 'react'
import StrudelEditor from './components/StrudelEditor'
import AudioVisualizer from './components/AudioVisualizer'
import ControlPanel from './components/ControlPanel'
import { useWebSocket } from './hooks/useWebSocket'
import './App.css'

function App() {
  const [code, setCode] = useState('// Welcome to New Brain\n// AI + Human Musical Symbiosis\n\n// Try this:\n// sound("bd sd")')
  const [isPlaying, setIsPlaying] = useState(false)
  const { connected, sendMessage } = useWebSocket()

  useEffect(() => {
    // Sync code changes with backend
    if (connected) {
      sendMessage({ type: 'code_update', code })
    }
  }, [code, connected, sendMessage])

  const handleCodeChange = (newCode) => {
    setCode(newCode)
  }

  const handlePlayToggle = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎵 New Brain</h1>
        <div className="connection-status">
          <span className={`status-indicator ${connected ? 'connected' : 'disconnected'}`} />
          {connected ? 'Connected' : 'Disconnected'}
        </div>
      </header>

      <main className="app-main">
        <div className="editor-section">
          <StrudelEditor
            code={code}
            onChange={handleCodeChange}
            isPlaying={isPlaying}
          />
        </div>

        <div className="visualizer-section">
          <AudioVisualizer isPlaying={isPlaying} />
        </div>

        <div className="control-section">
          <ControlPanel
            isPlaying={isPlaying}
            onPlayToggle={handlePlayToggle}
          />
        </div>
      </main>
    </div>
  )
}

export default App

