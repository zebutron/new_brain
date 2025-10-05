import { useRef } from 'react'
import './StrudelEditor.css'

function StrudelEditor({ code, onChange, isPlaying, error }) {
  const textareaRef = useRef(null)

  const handleChange = (e) => {
    onChange(e.target.value)
  }

  return (
    <div className="strudel-editor">
      <div className="editor-header">
        <span className="editor-title">Strudel Live Code</span>
        <div className="editor-status">
          {isPlaying && <span className="status-badge playing">▶ Playing</span>}
          {error && <span className="status-badge error">⚠ {error}</span>}
        </div>
      </div>
      <textarea
        ref={textareaRef}
        className="editor-textarea"
        value={code}
        onChange={handleChange}
        spellCheck="false"
        placeholder="// Strudel pattern code here..."
      />
    </div>
  )
}

export default StrudelEditor

