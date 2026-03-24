'use client'
import { useState, useEffect, useRef } from 'react'
import { useTypewriter } from '@/hooks/useTypewriter'
import { sounds } from '@/lib/sounds'
import { EVENT } from '@/constants/event'

const LINES = [
  { speaker: 'ROSALINA', color: '#93c5fd', text: '¡Viajero estelar! Una celebración galáctica te espera...' },
  { speaker: 'TOAD 🍄', color: '#f9a8d4', text: `📍 ${EVENT.location}` },
  { speaker: 'TOAD 🍄', color: '#f9a8d4', text: `📅 29 de marzo de 2026  ⏰ ${EVENT.time}` },
  { speaker: 'CARLOS ★', color: '#facc15', text: 'No olvides llevar TRAJE DE BAÑO para el Power-Up acuático... ¡y prepárate para la PARRILLADA intergaláctica!', highlights: ['TRAJE DE BAÑO', 'PARRILLADA'] },
]

function HighlightText({ text, highlights = [] }: { text: string; highlights?: string[] }) {
  if (!highlights.length) return <>{text}</>
  const parts = text.split(new RegExp(`(${highlights.join('|')})`, 'g'))
  return (
    <>
      {parts.map((p, i) =>
        highlights.includes(p)
          ? <span key={i} style={{ color: '#facc15', textShadow: '0 0 12px rgba(250,204,21,0.7)' }}>{p}</span>
          : <span key={i}>{p}</span>
      )}
    </>
  )
}

export default function EventDetails() {
  const [step, setStep] = useState(0)
  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const current = LINES[step]
  const { displayed, done } = useTypewriter(current.text, 32, inView)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); sounds.dialogOpen() }
    }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  // Re-trigger typewriter on step change
  const [key, setKey] = useState(0)
  const advance = () => {
    if (!done) return
    sounds.menuSelect()
    if (step < LINES.length - 1) {
      setStep(s => s + 1)
      setKey(k => k + 1)
    }
  }

  return (
    <section id="detalles" className="relative z-10 py-12 px-4 scroll-mt-8" ref={ref}>
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-6">
          <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '9px', color: '#facc15', letterSpacing: '0.2em' }}>
            ✦ DETALLES DEL EVENTO ✦
          </span>
        </div>

        {/* Step dots */}
        <div className="flex justify-center gap-2 mb-5">
          {LINES.map((_, i) => (
            <div key={i} style={{
              width: i === step ? '18px' : '8px', height: '8px',
              borderRadius: '4px', transition: 'all 0.3s',
              background: i === step ? current.color : i < step ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.1)',
              boxShadow: i === step ? `0 0 8px ${current.color}` : 'none',
            }}/>
          ))}
        </div>

        {/* Dialog box */}
        <div
          className="dialog-box p-5 cursor-pointer relative select-none"
          onClick={advance}
          style={{ animation: 'dialogAppear 0.3s ease-out' }}
        >
          {/* Speaker tag */}
          <div style={{
            position: 'absolute', top: '-16px', left: '16px',
            fontFamily: "'Press Start 2P', cursive", fontSize: '9px',
            background: current.color, color: '#1a1a2e',
            padding: '3px 10px', borderRadius: '6px',
            border: '2px solid #1a1a2e', boxShadow: '2px 2px 0 #1a1a2e',
          }}>
            {current.speaker}
          </div>

          <div style={{ paddingTop: '8px', minHeight: '80px' }}>
            <p style={{
              fontFamily: "'Press Start 2P', cursive",
              fontSize: 'clamp(9px, 2vw, 12px)',
              lineHeight: '2', color: '#1a1a2e',
            }}>
              <HighlightText text={displayed} highlights={(current as any).highlights} />
              {!done && <span style={{ display: 'inline-block', width: '2px', height: '1em', background: '#1a1a2e', verticalAlign: 'text-bottom', marginLeft: '2px', animation: 'blink 0.7s step-end infinite' }}/>}
            </p>
          </div>

          {/* A button */}
          <div style={{ position: 'absolute', bottom: '10px', right: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {done && step < LINES.length - 1 && (
              <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '7px', color: '#888' }}>SIGUIENTE</span>
            )}
            <div className="a-button">A</div>
          </div>
        </div>

        <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '7px', color: 'rgba(255,255,255,0.25)', textAlign: 'center', marginTop: '8px' }}>
          {done ? (step < LINES.length - 1 ? 'TOCA PARA CONTINUAR' : '★ FIN ★') : '...'}
        </p>
      </div>
      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </section>
  )
}