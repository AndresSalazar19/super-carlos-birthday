'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { sounds } from '@/lib/sounds'

type StarObj = { id: number; x: number; y: number; color: string; size: number; speed: number; collected: boolean }

const COLORS = ['#fde68a', '#f9a8d4', '#93c5fd', '#a78bfa', '#86efac']
const NEEDED = 3

let nextId = 0

export default function CatchStars({ onComplete }: { onComplete?: () => void }) {
  const [stars, setStars] = useState<StarObj[]>([])
  const [collected, setCollected] = useState(0)
  const [done, setDone] = useState(false)
  const [started, setStarted] = useState(false)
  const rafRef = useRef<number>(0)
  const lastSpawn = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const spawnStar = useCallback(() => {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)]
    return {
      id: nextId++,
      x: 10 + Math.random() * 80,
      y: -10,
      color,
      size: 30 + Math.random() * 20,
      speed: 0.3 + Math.random() * 0.4,
      collected: false,
    }
  }, [])

  useEffect(() => {
    if (!started || done) return

    let lastTime = 0
    const tick = (time: number) => {
      const dt = time - lastTime
      lastTime = time

      if (time - lastSpawn.current > 1200) {
        lastSpawn.current = time
        setStars(prev => [...prev.filter(s => s.y < 115 && !s.collected), spawnStar()])
      }

      setStars(prev => prev.map(s => s.collected ? s : { ...s, y: s.y + s.speed }))
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [started, done, spawnStar])

  const collect = (id: number) => {
    sounds.starCollect()
    setStars(prev => prev.map(s => s.id === id ? { ...s, collected: true } : s))
    setCollected(prev => {
      const next = prev + 1
      if (next >= NEEDED) {
        sounds.powerStar()
        setDone(true)
        onComplete?.()
      }
      return next
    })
  }

  if (!started) {
    return (
      <div className="text-center py-12">
        <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '9px', color: '#facc15', marginBottom: '8px' }}>
          ✦ MINI-JUEGO ✦
        </p>
        <h3
          className="text-white mb-4"
          style={{ fontFamily: "'Press Start 2P', cursive", fontSize: 'clamp(12px, 3vw, 18px)' }}
        >
          ATRAPA {NEEDED} ESTRELLAS
        </h3>
        <p className="text-white/50 mb-8" style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '9px' }}>
          para desbloquear el RSVP
        </p>
        <button
          className="star-btn px-8 py-4"
          style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '11px' }}
          onClick={() => { sounds.menuSelect(); setStarted(true) }}
        >
          ▶ JUGAR
        </button>
      </div>
    )
  }

  if (done) {
    return (
      <div className="text-center py-12">
        <div
          style={{
            fontFamily: "'Press Start 2P', cursive",
            fontSize: 'clamp(16px, 4vw, 28px)',
            color: '#facc15',
            textShadow: '0 0 30px rgba(250,204,21,0.8)',
            animation: 'floatAnimation 1s ease-in-out infinite',
            marginBottom: '16px',
          }}
        >
          ★ POWER STAR! ★
        </div>
        <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '10px', color: '#fff', marginBottom: '8px' }}>
          ¡Desbloqueaste el RSVP!
        </p>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Score */}
      <div className="flex justify-between items-center mb-4 px-2">
        <div className="hud-box py-2 px-4">
          <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '10px', color: '#facc15' }}>
            ★ {collected}/{NEEDED}
          </span>
        </div>
        <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '8px', color: 'rgba(255,255,255,0.5)' }}>
          ¡TOCA LAS ESTRELLAS!
        </p>
      </div>

      {/* Game area */}
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-xl"
        style={{
          height: '300px',
          background: 'rgba(0,0,0,0.4)',
          border: '2px solid rgba(250,204,21,0.2)',
          cursor: 'crosshair',
        }}
      >
        {/* Stars */}
        {stars.filter(s => !s.collected && s.y < 110).map(star => (
          <button
            key={star.id}
            className="absolute transition-none"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              transform: 'translate(-50%, -50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              zIndex: 10,
            }}
            onClick={() => collect(star.id)}
          >
            <svg width={star.size} height={star.size} viewBox="0 0 40 40" style={{ filter: `drop-shadow(0 0 8px ${star.color})`, animation: 'twinkleAnimation 1s ease-in-out infinite' }}>
              <polygon
                points="20,2 24,14 38,14 27,22 31,36 20,28 9,36 13,22 2,14 16,14"
                fill={star.color}
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="1"
              />
              <circle cx="20" cy="18" r="4" fill="rgba(255,255,255,0.6)" />
            </svg>
          </button>
        ))}

        {/* Background dots */}
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 100}%`,
              width: `${1 + (i % 2)}px`,
              height: `${1 + (i % 2)}px`,
              background: 'rgba(255,255,255,0.3)',
              animation: `twinkleAnimation ${1 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${(i * 0.2) % 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
