import { useState, useRef, useEffect } from 'react'
import './ChatInterface.css'

function ChatInterface({ isPlaying, onPlayToggle, onFeedback }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Ready to make music! I\'ll compose in Strudel, you provide feedback. Hit play when you want to hear what I\'ve created.' }
  ])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    
    // Send feedback to parent/backend
    onFeedback(input)
    
    setInput('')
  }

  const addAssistantMessage = (content) => {
    setMessages(prev => [...prev, { role: 'assistant', content }])
  }

  // Expose method for parent to add AI responses
  useEffect(() => {
    window.addAIMessage = addAssistantMessage
  }, [])

  return (
    <div className="chat-interface">
      <div className="chat-controls">
        <button
          className={`play-button ${isPlaying ? 'playing' : ''}`}
          onClick={onPlayToggle}
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>
        
        <div className="control-group">
          <label className="control-label">
            Volume
            <input type="range" min="0" max="100" defaultValue="70" className="control-slider" />
          </label>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message message-${msg.role}`}>
            <div className="message-avatar">
              {msg.role === 'user' ? '🎧' : '🤖'}
            </div>
            <div className="message-content">
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-form" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Give me feedback on the music..."
        />
        <button type="submit" className="chat-submit">
          Send
        </button>
      </form>
    </div>
  )
}

export default ChatInterface

