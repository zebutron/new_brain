import { useEffect, useRef, useState, useCallback } from 'react'
import { evaluate, controls } from '@strudel/core'
import { getAudioContext, initAudioOnFirstClick, webaudioOutput } from '@strudel/webaudio'

export function useStrudel() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState(null)
  const stopRef = useRef(null)

  // Initialize audio context on first user interaction
  useEffect(() => {
    const init = async () => {
      try {
        await initAudioOnFirstClick()
        setIsInitialized(true)
        console.log('✅ Strudel audio initialized')
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

  const play = useCallback(async (code) => {
    if (!isInitialized) {
      setError('Audio not initialized. Click anywhere to start.')
      return
    }

    try {
      // Stop current pattern if playing
      if (stopRef.current) {
        stopRef.current()
        stopRef.current = null
      }

      if (!code || code.trim() === '' || code.trim().startsWith('//')) {
        setError('No executable code to play')
        return
      }

      console.log('🎵 Evaluating code:', code)

      // Evaluate the code using Strudel's evaluate function
      const { pattern, stop } = await evaluate(code, {
        getTime: () => getAudioContext().currentTime,
        onToggle: (playing) => {
          setIsPlaying(playing)
        }
      })

      if (!pattern) {
        setError('No pattern returned from evaluation')
        return
      }

      console.log('✅ Pattern evaluated, starting playback...')

      // Store stop function
      stopRef.current = stop

      // Start playing with webaudio output
      pattern.onTrigger(webaudioOutput, {
        nudge: 0,
        duration: 1,
      })

      setIsPlaying(true)
      setError(null)
    } catch (err) {
      console.error('❌ Play error:', err)
      setError(err.message || 'Failed to play pattern')
    }
  }, [isInitialized])

  const stop = useCallback(() => {
    if (stopRef.current) {
      stopRef.current()
      stopRef.current = null
    }
    setIsPlaying(false)
    console.log('⏸ Stopped playback')
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
      if (stopRef.current) {
        stopRef.current()
      }
    }
  }, [])

  return {
    isPlaying,
    isInitialized,
    error,
    play,
    stop,
    toggle,
  }
}

