'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useParallax } from '@/hooks/useParallax'

const LUMAS = [
  { color: '#fde68a', x: 15, y: 20, size: 40, delay: 0, orbitR: 0 },
  { color: '#f9a8d4', x: 80, y: 15, size: 30, delay: 0.5, orbitR: 0 },
  { color: '#93c5fd', x: 88, y: 55, size: 25, delay: 1, orbitR: 0 },
  { color: '#fde68a', x: 10, y: 65, size: 35, delay: 1.5, orbitR: 0 },
  { color: '#a78bfa', x: 75, y: 80, size: 28, delay: 0.8, orbitR: 0 },
  { color: '#fde68a', x: 50, y: 88, size: 20, delay: 1.2, orbitR: 0 },
  { color: '#f9a8d4', x: 5, y: 40, size: 22, delay: 0.3, orbitR: 0 },
  { color: '#93c5fd', x: 92, y: 30, size: 32, delay: 1.8, orbitR: 0 },
]

function LumaStar({ color, size, delay }: { color: string; size: number; delay: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ filter: `drop-shadow(0 0 8px ${color})` }}>
      <polygon
        points="20,2 24,14 38,14 27,22 31,36 20,28 9,36 13,22 2,14 16,14"
        fill={color}
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="1"
      />
      <circle cx="20" cy="18" r="4" fill="rgba(255,255,255,0.6)" />
    </svg>
  )
}

export default function HeroSection() {
  const mouse = useParallax()
  const [visible, setVisible] = useState(false)

  useEffect(() => { setTimeout(() => setVisible(true), 100) }, [])

  const titleLetters = ['S','U','P','E','R']
  const carlosLetters = ['C','A','R','L','O','S']
  const bdLetters = ['B','I','R','T','H','D','A','Y']
  const letterColors = ['#ef4444','#f97316','#facc15','#22c55e','#3b82f6','#a855f7','#ec4899','#14b8a6']

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pb-16">
      {/* Nebula layers */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 60% 40% at 30% 50%, rgba(88,28,135,0.35) 0%, transparent 70%)',
          transform: `translate(${mouse.x * -15}px, ${mouse.y * -10}px)`,
          transition: 'transform 0.1s ease-out',
        }} />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 50% 35% at 70% 45%, rgba(30,64,175,0.25) 0%, transparent 70%)',
          transform: `translate(${mouse.x * -8}px, ${mouse.y * -6}px)`,
          transition: 'transform 0.15s ease-out',
        }} />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 30% 20% at 50% 30%, rgba(167,139,250,0.15) 0%, transparent 60%)',
          transform: `translate(${mouse.x * -5}px, ${mouse.y * -4}px)`,
          transition: 'transform 0.2s ease-out',
        }} />
      </div>

      {/* Floating Lumas */}
      {LUMAS.map((luma, i) => (
        <div
          key={i}
          className="absolute pointer-events-none"
          style={{
            left: `${luma.x}%`,
            top: `${luma.y}%`,
            transform: `translate(${mouse.x * (i % 3 + 1) * 8}px, ${mouse.y * (i % 3 + 1) * 8}px)`,
            transition: 'transform 0.2s ease-out',
            animation: `floatAnimation ${3 + luma.delay}s ease-in-out infinite`,
            animationDelay: `${luma.delay}s`,
            opacity: visible ? 1 : 0,
            transitionProperty: 'opacity, transform',
            transitionDuration: `${0.5 + i * 0.1}s`,
          }}
        >
          <LumaStar color={luma.color} size={luma.size} delay={luma.delay} />
        </div>
      ))}

      {/* Main content */}
      <div
        className="relative z-10 flex flex-col items-center text-center px-4"
        style={{
          transform: `translate(${mouse.x * -5}px, ${mouse.y * -3}px)`,
          transition: 'transform 0.3s ease-out',
        }}
      >
        {/* Nintendo presents badge */}
        <div
          className="mb-4 px-4 py-1 rounded-full border border-white/20 text-white/60 text-xs tracking-widest"
          style={{
            fontFamily: "'Press Start 2P', cursive",
            fontSize: '8px',
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.8s ease',
          }}
        >
          NINTENDO PRESENTA
        </div>

        {/* SUPER */}
        <div
          className="flex gap-1 mb-1"
          style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease 0.2s' }}
        >
          {titleLetters.map((l, i) => (
            <span
              key={i}
              className="mario-title text-white"
              style={{
                fontFamily: "'Press Start 2P', cursive",
                fontSize: 'clamp(18px, 4vw, 32px)',
                textShadow: '3px 3px 0 rgba(0,0,0,0.8)',
                display: 'inline-block',
                animation: `floatAnimation ${2 + i * 0.1}s ease-in-out infinite`,
                animationDelay: `${i * 0.05}s`,
              }}
            >
              {l}
            </span>
          ))}
        </div>

        {/* CARLOS */}
        <div
          className="flex gap-1 mb-1"
          style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease 0.4s' }}
        >
          {carlosLetters.map((l, i) => (
            <span
              key={i}
              style={{
                fontFamily: "'Press Start 2P', cursive",
                fontSize: 'clamp(40px, 10vw, 80px)',
                color: letterColors[i % letterColors.length],
                textShadow: `4px 4px 0 rgba(0,0,0,0.9), -2px -2px 0 rgba(255,255,255,0.15), 0 0 30px ${letterColors[i % letterColors.length]}66`,
                display: 'inline-block',
                animation: `floatAnimation ${2.5 + i * 0.15}s ease-in-out infinite`,
                animationDelay: `${i * 0.08}s`,
              }}
            >
              {l}
            </span>
          ))}
        </div>

        {/* BIRTHDAY */}
        <div
          className="flex gap-1 mb-6"
          style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease 0.6s' }}
        >
          {bdLetters.map((l, i) => (
            <span
              key={i}
              style={{
                fontFamily: "'Press Start 2P', cursive",
                fontSize: 'clamp(22px, 6vw, 52px)',
                color: letterColors[(i + 2) % letterColors.length],
                textShadow: `3px 3px 0 rgba(0,0,0,0.9), 0 0 20px ${letterColors[(i + 2) % letterColors.length]}66`,
                display: 'inline-block',
                animation: `floatAnimation ${2 + i * 0.12}s ease-in-out infinite`,
                animationDelay: `${i * 0.06 + 0.3}s`,
              }}
            >
              {l}
            </span>
          ))}
        </div>

        {/* Subtitle */}
        <div
          className="text-white/80 tracking-widest mb-8"
          style={{
            fontFamily: "'Press Start 2P', cursive",
            fontSize: 'clamp(8px, 2vw, 13px)',
            textShadow: '2px 2px 0 rgba(0,0,0,0.8)',
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.8s ease 0.8s',
            letterSpacing: '0.2em',
          }}
        >
          ✦ A GALACTIC CELEBRATION AWAITS! ✦
        </div>

        {/* Carlos hero image placeholder */}
        <div
          className="relative"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 1s ease 0.5s',
          }}
        >
          <div
            className="relative mx-auto"
            style={{
              width: 'clamp(200px, 40vw, 320px)',
              height: 'clamp(200px, 40vw, 320px)',
              animation: 'floatAnimation 4s ease-in-out infinite',
            }}
          >
            {/* Glow ring */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(250,204,21,0.2) 0%, transparent 70%)',
                animation: 'floatAnimation 3s ease-in-out infinite',
              }}
            />
            <Image src="/images/carlos-hero.png" alt="Carlos" fill className="object-contain" />
          </div>
        </div>

        {/* Scroll hint */}
        <div
          className="mt-8 text-white/40 flex flex-col items-center gap-2"
          style={{
            fontFamily: "'Press Start 2P', cursive",
            fontSize: '8px',
            opacity: visible ? 1 : 0,
            transition: 'opacity 1s ease 1.5s',
            animation: 'floatAnimation 2s ease-in-out infinite',
          }}
        >
          <span>PRESIONA ▼ PARA CONTINUAR</span>
        </div>
      </div>

      {/* Planet orbit decoration */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '500px',
            height: '200px',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />
      </div>
    </section>
  )
}
