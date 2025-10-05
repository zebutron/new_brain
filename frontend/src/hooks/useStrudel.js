import { useEffect, useRef, useState, useCallback } from 'react'
import { repl } from '@strudel/core'
import { getAudioContext, initAudioOnFirstClick, webaudioOutput, initAudio } from '@strudel/webaudio'
import { transpiler } from '@strudel/transpiler'
import * as strudel from '@strudel/core'
import * as mini from '@strudel/mini'
import * as webaudio from '@strudel/webaudio'

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
        
        Object.assign(window, strudel, mini, webaudio)
        
        await initAudio()
        
        replInstanceRef.current = repl({
          transpiler,
          autodraw: false,
          getTime: () => getAudioContext().currentTime,
        })
        
        console.log('🔧 REPL object:', replInstanceRef.current)
        console.log('🔧 REPL keys:', Object.keys(replInstanceRef.current))
        console.log('🔧 evaluate:', replInstanceRef.current.evaluate)
        console.log('🔧 setCode:', replInstanceRef.current.setCode)
        
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
      
      await replInstanceRef.current.evaluate(code)
      replInstanceRef.current.start()
      
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
