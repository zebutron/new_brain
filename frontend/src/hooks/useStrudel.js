import { useEffect, useRef, useState, useCallback } from 'react'
import { repl, controls } from '@strudel/core'
import { getAudioContext, initAudioOnFirstClick, webaudioOutput } from '@strudel/webaudio'

export function useStrudel() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState(null)
  const schedulerRef = useRef(null)
  const currentPatternRef = useRef(null)

  // Initialize audio context on first user interaction
  useEffect(() => {
    const init = async () => {
      try {
        await initAudioOnFirstClick()
        setIsInitialized(true)
        console.log('Strudel audio initialized')
      } catch (err) {
        console.error('Failed to initialize audio:', err)
        setError(err.message)
      }
    }
    
    // Set up click handler for audio context initialization
    const handleClick = () => {
      if (!isInitialized) {
        init()
      }
    }
    
    document.addEventListener('click', handleClick, { once: true })
    
    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [isInitialized])

  const evaluate = useCallback(async (code) => {
    if (!isInitialized) {
      setError('Audio not initialized. Click anywhere to start.')
      return
    }

    try {
      // Stop current pattern if playing
      if (schedulerRef.current) {
        schedulerRef.current.stop()
        schedulerRef.current = null
      }

      if (!code || code.trim() === '') {
        setError('No code to evaluate')
        return
      }

      // Evaluate the code using Strudel's REPL
      const pattern = await repl({
        code,
        transpiler: true,
      })

      currentPatternRef.current = pattern
      setError(null)
      return pattern
    } catch (err) {
      console.error('Evaluation error:', err)
      setError(err.message)
      throw err
    }
  }, [isInitialized])

  const play = useCallback(async (code) => {
    if (!isInitialized) {
      setError('Audio not initialized. Click anywhere to start.')
      return
    }

    try {
      const pattern = await evaluate(code)
      
      if (pattern) {
        // Start the scheduler with webaudio output
        const scheduler = pattern.scheduler()
        schedulerRef.current = scheduler
        
        scheduler.setPattern(pattern, true)
        scheduler.start()
        
        setIsPlaying(true)
        setError(null)
      }
    } catch (err) {
      console.error('Play error:', err)
      setError(err.message)
    }
  }, [evaluate, isInitialized])

  const stop = useCallback(() => {
    if (schedulerRef.current) {
      schedulerRef.current.stop()
      schedulerRef.current = null
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (schedulerRef.current) {
        schedulerRef.current.stop()
      }
    }
  }, [])

  return {
    isPlaying,
    isInitialized,
    error,
    evaluate,
    play,
    stop,
    toggle,
  }
}

