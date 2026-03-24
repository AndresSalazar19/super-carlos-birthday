'use client'
import { useEffect, useRef } from 'react'

interface Star { x: number; y: number; r: number; speed: number; opacity: number; twinkleSpeed: number }

export default function ParallaxStars() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: 0, y: 0 })
  const stars = useRef<Star[]>([])
  const raf = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      stars.current = Array.from({ length: 200 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random(),
        twinkleSpeed: Math.random() * 0.02 + 0.005,
      }))
    }

    const onMouse = (e: MouseEvent) => {
      mouse.current = { x: e.clientX / window.innerWidth - 0.5, y: e.clientY / window.innerHeight - 0.5 }
    }

    let t = 0
    const draw = () => {
      t += 0.01
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      stars.current.forEach(s => {
        s.opacity = 0.3 + Math.abs(Math.sin(t * s.twinkleSpeed * 100)) * 0.7
        const px = s.x + mouse.current.x * s.speed * 30
        const py = s.y + mouse.current.y * s.speed * 30
        ctx.beginPath()
        ctx.arc(px, py, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${s.opacity})`
        ctx.fill()
      })
      raf.current = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouse)
    return () => {
      cancelAnimationFrame(raf.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.8 }}
    />
  )
}
