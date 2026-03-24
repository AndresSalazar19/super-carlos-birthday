'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useParallax } from '@/hooks/useParallax'

const LUMA_POSITIONS = [
  { x: 8,  y: 18, color: '#fde68a', size: 36, delay: 0 },
  { x: 85, y: 12, color: '#f9a8d4', size: 28, delay: 0.4 },
  { x: 90, y: 52, color: '#93c5fd', size: 22, delay: 0.9 },
  { x: 6,  y: 62, color: '#fde68a', size: 32, delay: 1.3 },
  { x: 78, y: 78, color: '#a78bfa', size: 26, delay: 0.6 },
  { x: 15, y: 85, color: '#86efac', size: 20, delay: 1.1 },
  { x: 50, y: 5,  color: '#f9a8d4', size: 18, delay: 0.2 },
  { x: 92, y: 82, color: '#fde68a', size: 30, delay: 1.7 },
]

function LumaStar({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ filter: `drop-shadow(0 0 8px ${color})` }}>
      <polygon points="20,2 24,14 38,14 27,22 31,36 20,28 9,36 13,22 2,14 16,14" fill={color} stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
      <circle cx="20" cy="17" r="4" fill="rgba(255,255,255,0.7)"/>
    </svg>
  )
}

export default function HeroPoster() {
  const mouse = useParallax()
  const [visible, setVisible] = useState(false)

  useEffect(() => { setTimeout(() => setVisible(true), 100) }, [])

  const titleLetters = [
    { l: 'S', c: '#fff' },
    { l: 'U', c: '#fff' },
    { l: 'P', c: '#fff' },
    { l: 'E', c: '#fff' },
    { l: 'R', c: '#fff' },
  ]
  const carlosColors = ['#ef4444','#f97316','#facc15','#22c55e','#3b82f6','#a855f7']
  const bdColors    = ['#ec4899','#f97316','#facc15','#22c55e','#3b82f6','#a855f7','#ef4444','#fde68a']

  return (
    <section
      id="top"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ scrollSnapAlign: 'start' }}
    >
      {/* Nebula layers with parallax */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 70% 50% at 25% 50%, rgba(88,28,135,0.4) 0%, transparent 70%)',
          transform: `translate(${mouse.x * -18}px, ${mouse.y * -12}px)`,
          transition: 'transform 0.12s ease-out',
        }}/>
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 55% 40% at 75% 45%, rgba(30,64,175,0.3) 0%, transparent 70%)',
          transform: `translate(${mouse.x * -9}px, ${mouse.y * -7}px)`,
          transition: 'transform 0.18s ease-out',
        }}/>
      </div>

      {/* Floating Lumas */}
      {LUMA_POSITIONS.map((l, i) => (
        <div
          key={i}
          className="absolute pointer-events-none"
          style={{
            left: `${l.x}%`, top: `${l.y}%`,
            transform: `translate(${mouse.x * (i % 3 + 1) * 9}px, ${mouse.y * (i % 3 + 1) * 9}px)`,
            transition: 'transform 0.22s ease-out',
            animation: `floatAnimation ${3 + l.delay}s ease-in-out infinite`,
            animationDelay: `${l.delay}s`,
            opacity: visible ? 1 : 0,
            transitionProperty: 'opacity, transform',
            transitionDuration: `${0.5 + i * 0.1}s`,
          }}
        >
          <LumaStar color={l.color} size={l.size} />
        </div>
      ))}

      {/* Content */}
      <div
        className="relative z-10 flex flex-col items-center text-center px-4 py-8"
        style={{
          transform: `translate(${mouse.x * -4}px, ${mouse.y * -3}px)`,
          transition: 'transform 0.3s ease-out',
          opacity: visible ? 1 : 0,
          transitionProperty: 'opacity, transform',
          transitionDuration: '0.8s',
        }}
      >
        {/* Nintendo badge */}
        <div style={{
          fontFamily: "'Press Start 2P', cursive",
          fontSize: 'clamp(7px, 1.5vw, 10px)',
          color: 'rgba(255,255,255,0.5)',
          letterSpacing: '0.25em',
          marginBottom: '8px',
          border: '1px solid rgba(255,255,255,0.2)',
          padding: '4px 12px',
          borderRadius: '20px',
        }}>
          NINTENDO PRESENTA
        </div>

        {/* SUPER */}
        <div className="flex gap-1 mb-1">
          {titleLetters.map(({ l }, i) => (
            <span key={i} style={{
              fontFamily: "'Press Start 2P', cursive",
              fontSize: 'clamp(16px, 3.5vw, 28px)',
              color: '#e2e8f0',
              textShadow: '3px 3px 0 rgba(0,0,0,0.9)',
              display: 'inline-block',
              animation: `floatAnimation ${2.2+i*0.1}s ease-in-out infinite`,
              animationDelay: `${i*0.06}s`,
            }}>{l}</span>
          ))}
        </div>

        {/* CARLOS */}
        <div className="flex gap-1 md:gap-2 mb-1">
          {'CARLOS'.split('').map((l, i) => (
            <span key={i} style={{
              fontFamily: "'Press Start 2P', cursive",
              fontSize: 'clamp(38px, 11vw, 88px)',
              color: carlosColors[i],
              textShadow: `5px 5px 0 rgba(0,0,0,0.9), -2px -2px 0 rgba(255,255,255,0.08), 0 0 35px ${carlosColors[i]}55`,
              display: 'inline-block',
              animation: `floatAnimation ${2.8+i*0.15}s ease-in-out infinite`,
              animationDelay: `${i*0.09}s`,
              WebkitTextStroke: '1px rgba(255,255,255,0.15)',
            }}>{l}</span>
          ))}
        </div>

        {/* BIRTHDAY */}
        <div className="flex gap-1 mb-6">
          {'BIRTHDAY'.split('').map((l, i) => (
            <span key={i} style={{
              fontFamily: "'Press Start 2P', cursive",
              fontSize: 'clamp(20px, 5.5vw, 50px)',
              color: bdColors[i % bdColors.length],
              textShadow: `3px 3px 0 rgba(0,0,0,0.9), 0 0 20px ${bdColors[i%bdColors.length]}55`,
              display: 'inline-block',
              animation: `floatAnimation ${2.2+i*0.12}s ease-in-out infinite`,
              animationDelay: `${i*0.07+0.3}s`,
            }}>{l}</span>
          ))}
        </div>

        {/* Subtitle */}
        <div style={{
          fontFamily: "'Press Start 2P', cursive",
          fontSize: 'clamp(8px, 1.8vw, 12px)',
          color: 'rgba(255,255,255,0.7)',
          letterSpacing: '0.18em',
          textShadow: '2px 2px 0 rgba(0,0,0,0.7)',
          marginBottom: '24px',
        }}>
          ✦ A GALACTIC CELEBRATION AWAITS! ✦
        </div>

        {/* Hero image area */}
        <div style={{
          width: 'clamp(180px, 38vw, 300px)',
          height: 'clamp(180px, 38vw, 300px)',
          position: 'relative',
          animation: 'floatAnimation 4s ease-in-out infinite',
          marginBottom: '16px',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(circle, rgba(250,204,21,0.18) 0%, transparent 70%)',
          }}/>
          <div style={{
            width: '100%', height: '100%',
            borderRadius: '50%',
            border: '3px solid rgba(250,204,21,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column',
            background: 'radial-gradient(circle at 35% 30%, rgba(250,204,21,0.1), rgba(96,165,250,0.08))',
            backdropFilter: 'blur(4px)',
          }}>
            {/* Replace this div with <Image src="/images/carlos-hero.png" ... /> */}
            <Image src="/images/carlos-hero2.png" alt="Carlos" fill className="object-cover rounded-full" />
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{
          fontFamily: "'Press Start 2P', cursive",
          fontSize: 'clamp(7px, 1.5vw, 10px)',
          color: 'rgba(255,255,255,0.35)',
          animation: 'floatAnimation 2s ease-in-out infinite',
          letterSpacing: '0.1em',
        }}>
          ▼ SCROLL PARA CONTINUAR ▼
        </div>
      </div>
    </section>
  )
}