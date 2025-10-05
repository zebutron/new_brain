import { useEffect, useRef, useState, useCallback } from 'react'
import { getAudioContext, initAudioOnFirstClick, webaudioRepl, registerSynthSounds, registerSound } from '@strudel/webaudio'
import { transpiler } from '@strudel/transpiler'
import * as strudel from '@strudel/core'
import * as mini from '@strudel/mini'
import * as tonal from '@strudel/tonal'

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
        
        // Make all Strudel functions global
        Object.assign(window, strudel, mini, tonal)
        console.log('📚 Loaded functions:', Object.keys(strudel).length + Object.keys(mini).length + Object.keys(tonal).length)
        
        // Register synth sounds
        registerSynthSounds()
        console.log('🎹 Synths registered')
        
        // Register drum samples manually
        const drums = ['bd', 'sd', 'hh', 'cp', 'oh']
        for (const drum of drums) {
          registerSound(drum, async (t, value, onended) => {
            const ctx = getAudioContext()
            const n = value.n || 0
            const sampleUrl = `/samples/${drum}/BT0A0A7.wav`
            
            try {
              const response = await fetch(sampleUrl)
              const arrayBuffer = await response.arrayBuffer()
              const buffer = await ctx.decodeAudioData(arrayBuffer)
              
              const source = ctx.createBufferSource()
              source.buffer = buffer
              const gain = ctx.createGain()
              gain.gain.value = value.gain || 1
              source.connect(gain)
              source.start(t)
              source.onended = onended
              
              return { node: gain, stop: () => source.stop() }
            } catch (err) {
              console.log(`Sample error:`, err.message)
              return { node: ctx.createGain(), stop: () => {} }
            }
          }, { type: 'sample' })
        }
        console.log('🥁 Drums registered')
        
        // Use webaudioRepl - pre-configured with audio output
        replRef.current = webaudioRepl({
          transpiler,
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

