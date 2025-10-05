import { useRef } from 'react'
import './StrudelEditor.css'

function StrudelEditor({ code, onChange, isPlaying, error, onEvaluate }) {
  const textareaRef = useRef(null)

  const handleChange = (e) => {
    onChange(e.target.value)
  }

  const handleKeyDown = (e) => {
    // Ctrl+Enter or Cmd+Enter to evaluate
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      if (onEvaluate) {
        onEvaluate(code)
      }
    }
    
    // Tab inserts spaces instead of changing focus
    if (e.key === 'Tab') {
      e.preventDefault()
      const start = e.target.selectionStart
      const end = e.target.selectionEnd
      const newValue = code.substring(0, start) + '  ' + code.substring(end)
      onChange(newValue)
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2
      }, 0)
    }
  }

  return (
    <div className="strudel-editor">
      <div className="editor-header">
        <span className="editor-title">Strudel Live Code</span>
        <div className="editor-status">
          <span className="editor-hint">⌘+Enter to evaluate</span>
          {isPlaying && <span className="status-badge playing">▶ Playing</span>}
          {error && <span className="status-badge error">⚠ {error}</span>}
        </div>
      </div>
      <textarea
        ref={textareaRef}
        className="editor-textarea"
        value={code}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        spellCheck="false"
        placeholder="// Strudel pattern code here..."
      />
    </div>
  )
}

export default StrudelEditor

