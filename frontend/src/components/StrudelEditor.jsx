import { useEffect, useRef } from 'react'
import './StrudelEditor.css'

function StrudelEditor({ code, onChange, isPlaying }) {
  const textareaRef = useRef(null)

  useEffect(() => {
    // Initialize Strudel editor integration here
    // This is a placeholder for now
  }, [])

  const handleChange = (e) => {
    onChange(e.target.value)
  }

  return (
    <div className="strudel-editor">
      <div className="editor-header">
        <span className="editor-title">Live Code Editor</span>
        <span className="editor-hint">Ctrl+Enter to evaluate</span>
      </div>
      <textarea
        ref={textareaRef}
        className="editor-textarea"
        value={code}
        onChange={handleChange}
        spellCheck="false"
        placeholder="Start coding your music..."
      />
    </div>
  )
}

export default StrudelEditor

