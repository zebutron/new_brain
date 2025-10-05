import { useEffect, useRef } from 'react'
import '@strudel/repl'
import './StrudelREPL.css'

function StrudelREPL({ code, onChange, isPlaying }) {
  const replRef = useRef(null)

  useEffect(() => {
    const repl = replRef.current
    if (!repl) return

    // Set code on the component
    if (code && repl.code !== code) {
      repl.code = code
    }

    // Listen for code changes from the editor
    const handleChange = (e) => {
      if (onChange && e.detail?.code) {
        onChange(e.detail.code)
      }
    }

    repl.addEventListener('code-changed', handleChange)

    return () => {
      repl.removeEventListener('code-changed', handleChange)
    }
  }, [code, onChange])

  return (
    <div className="strudel-repl-container">
      <strudel-editor ref={replRef}>
        {code}
      </strudel-editor>
    </div>
  )
}

export default StrudelREPL

