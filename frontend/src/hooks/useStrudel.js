import { useEffect, useRef, useState, useCallback } from 'react'
import { transpiler } from '@strudel/transpiler'
import { repl } from '@strudel/core'
import { getAudioContext, initAudioOnFirstClick } from '@strudel/webaudio'

export function useStrudel() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState(null)
  const replInstanceRef = useRef(null)

  useEffect(() => {
    const initStrudel = async () => {
      try {
        console.log('🎵 Initializing Strudel...')
        await initAudioOnFirstClick()
        
        const audioContext = getAudioContext()
        console.log('🔊 AudioContext state:', audioContext.state)
        
        if (audioContext.state === 'suspended') {
          await audioContext.resume()
          console.log('▶️ AudioContext resumed')
        }
        
        replInstanceRef.current = repl({
          autodraw: false,
          getTime: () => getAudioContext().currentTime,
        })
        
        setIsInitialized(true)
        console.log('✅ Strudel ready')
      } catch (err) {
        console.error('❌ Init failed:', err)
        setError(err.message)
      }
    }

    const handleClick = () => {
      if (!isInitialized && !replInstanceRef.current) {
        initStrudel()
      }
    }

    document.addEventListener('click', handleClick, { once: true })
    
    return () => {
      document.removeEventListener('click', handleClick)
      if (replInstanceRef.current?.stop) {
        replInstanceRef.current.stop()
      }
    }
  }, [isInitialized])

  const play = useCallback(async (code) => {
    if (!replInstanceRef.current) {
      setError('Not initialized')
      return
    }

    try {
      if (!code || code.trim() === '') {
        setError('No code')
        return
      }

      const audioContext = getAudioContext()
      if (audioContext.state === 'suspended') {
        await audioContext.resume()
      }

      console.log('🎵 Code:', code)

      const transpiledCode = transpiler(code)
      console.log('📝 Transpiled:', transpiledCode)

      await replInstanceRef.current.evaluate(transpiledCode)
      
      setIsPlaying(true)
      setError(null)
      console.log('✅ Playing')
    } catch (err) {
      console.error('❌ Error:', err)
      setError(err.message || 'Failed')
      setIsPlaying(false)
    }
  }, [])

  const stop = useCallback(() => {
    if (replInstanceRef.current?.stop) {
      replInstanceRef.current.stop()
    }
    setIsPlaying(false)
  }, [])

  const toggle = useCallback(async (code) => {
    if (isPlaying) {
      stop()
    } else {
      await play(code)
    }
  }, [isPlaying, play, stop])

  return {
    isPlaying,
    isInitialized,
    error,
    play,
    stop,
    toggle,
  }
}
