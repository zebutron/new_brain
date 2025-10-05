import { useEffect, useRef } from 'react'
import './StrudelREPL.css'

function StrudelREPL({ code, onChange, isPlaying }) {
  const replRef = useRef(null)

  useEffect(() => {
    const repl = replRef.current
    if (!repl) return

    // Override sample loading to use local samples
    const initEditor = () => {
      if (window.strudel && window.strudel.registerSamplesPrefix) {
        window.strudel.registerSamplesPrefix('/samples')
      }
      
      if (code && repl.code !== code) {
        repl.code = code
      }
      
      // Try to force synth-only evaluation (no samples needed)
      setTimeout(() => {
        if (repl.editor?.repl) {
          // Use simple synth sound instead
          const synthCode = 'note("c3 e3 g3 c4").s("sawtooth").gain(0.5)'
          repl.editor.repl.evaluate(synthCode).catch(err => {
            console.log('Eval error:', err.message)
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

