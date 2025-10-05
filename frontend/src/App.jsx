import { useState, useEffect } from 'react'
import StrudelEditor from './components/StrudelEditor'
import AudioVisualizer from './components/AudioVisualizer'
import ChatInterface from './components/ChatInterface'
import { useWebSocket } from './hooks/useWebSocket'
import { useStrudel } from './hooks/useStrudel'
import './App.css'

function App() {
  const [code, setCode] = useState('// AI-generated Strudel pattern\n// Click play to hear it!\n\nsound("bd sd, hh*4")\n  .gain(0.8)')
  const { connected, sendMessage, socket } = useWebSocket()
  const { isPlaying, error, toggle } = useStrudel()

  useEffect(() => {
    // Sync code changes with backend
    if (connected) {
      sendMessage({ type: 'code_update', code })
    }
  }, [code, connected, sendMessage])

  // Listen for code updates from AI/backend
  useEffect(() => {
    if (socket) {
      socket.on('code_update', (data) => {
        if (data.code) {
          setCode(data.code)
        }
      })
      
      socket.on('ai_message', (data) => {
        if (data.message && window.addAIMessage) {
          window.addAIMessage(data.message)
        }
      })
    }
  }, [socket])

  const handleCodeChange = (newCode) => {
    setCode(newCode)
  }

  const handlePlayToggle = () => {
    toggle(code)
  }

  const handleFeedback = (feedback) => {
    // Send feedback to backend where AI can process it
    if (connected) {
      sendMessage({ type: 'feedback', feedback, currentCode: code })
    }
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
            error={error}
          />
        </div>

        <div className="visualizer-section">
          <AudioVisualizer isPlaying={isPlaying} />
        </div>

        <div className="control-section">
          <ChatInterface
            isPlaying={isPlaying}
            onPlayToggle={handlePlayToggle}
            onFeedback={handleFeedback}
          />
        </div>
      </main>
    </div>
  )
}

export default App

