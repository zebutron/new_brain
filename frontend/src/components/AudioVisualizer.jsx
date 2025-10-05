import { useEffect, useRef } from 'react'
import './AudioVisualizer.css'

function AudioVisualizer({ isPlaying }) {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Placeholder visualization
    const animate = () => {
      const width = canvas.offsetWidth
      const height = canvas.offsetHeight

      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(0, 0, width, height)

      if (isPlaying) {
        // Simple wave visualization
        ctx.strokeStyle = '#00d4ff'
        ctx.lineWidth = 2
        ctx.beginPath()

        const time = Date.now() / 1000
        for (let x = 0; x < width; x += 5) {
          const y = height / 2 + Math.sin((x + time * 50) / 50) * 50
          if (x === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.stroke()
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying])

  return (
    <div className="audio-visualizer">
      <div className="visualizer-header">
        <span className="visualizer-title">Audio Visualizer</span>
      </div>
      <canvas ref={canvasRef} className="visualizer-canvas" />
    </div>
  )
}

export default AudioVisualizer

