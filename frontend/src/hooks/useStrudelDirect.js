import { useEffect, useRef, useState, useCallback } from 'react'
import { getAudioContext, initAudioOnFirstClick, webaudioOutput } from '@strudel/webaudio'
import { repl } from '@strudel/core'
import { transpiler } from '@strudel/transpiler'

export function useStrudelDirect() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState(null)
  const replRef = useRef(null)

  useEffect(() => {
    const init = async () => {
      try {
        console.log('🎵 Init audio...')
        await initAudioOnFirstClick()
        
        const ctx = getAudioContext()
        if (ctx.state === 'suspended') {
          await ctx.resume()
        }
        
        console.log('🔊 AudioContext:', ctx.state)
        
        // Create REPL with webaudioOutput
        replRef.current = repl({
          transpiler,
          onTrigger: webaudioOutput,
        })
        
        console.log('✅ Ready')
      } catch (err) {
        console.error('❌ Init error:', err)
        setError(err.message)
      }
    }
    
    document.addEventListener('click', init, { once: true })
    
    return () => {
      if (replRef.current?.stop) {
        replRef.current.stop()
      }
    }
  }, [])

  const play = useCallback(async (code) => {
    if (!replRef.current) {
      setError('Not ready')
      return
    }

    try {
      console.log('🎵 Play:', code)
      await replRef.current.evaluate(code)
      replRef.current.start()
      setIsPlaying(true)
      setError(null)
      console.log('✅ Playing')
    } catch (err) {
      console.error('❌ Error:', err)
      setError(err.message)
      setIsPlaying(false)
    }
  }, [])

  const stop = useCallback(() => {
    if (replRef.current) {
      replRef.current.stop()
      setIsPlaying(false)
    }
  }, [])

  const toggle = useCallback((code) => {
    if (isPlaying) {
      stop()
    } else {
      play(code)
    }
  }, [isPlaying, play, stop])

  return { isPlaying, error, play, stop, toggle }
}

