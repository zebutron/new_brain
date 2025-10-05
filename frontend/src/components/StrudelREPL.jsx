import { useEffect, useRef } from 'react'
import './StrudelREPL.css'

function StrudelREPL({ code, onChange, isPlaying }) {
  const replRef = useRef(null)

  useEffect(() => {
    const repl = replRef.current
    if (!repl) return

    // Wait for component to be ready
    const initEditor = () => {
      if (code && repl.code !== code) {
        repl.code = code
      }
      
      // Force evaluation on mount
      setTimeout(() => {
        if (repl.editor?.repl?.evaluate) {
          repl.editor.repl.evaluate(code).catch(err => {
            console.log('Initial eval error (ok if samples loading):', err.message)
          })
        }
      }, 1000)
    }

    if (repl.editor) {
      initEditor()
    } else {
      setTimeout(initEditor, 500)
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
      <strudel-editor 
        ref={replRef}
        lazy
        punchcard
        embedded
      >
        {code}
      </strudel-editor>
    </div>
  )
}

export default StrudelREPL

