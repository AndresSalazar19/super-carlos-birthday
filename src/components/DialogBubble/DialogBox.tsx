'use client'
import { useState, useEffect } from 'react'
import { useTypewriter } from '@/hooks/useTypewriter'
import { EVENT } from '@/constants/event'
import { sounds } from '@/lib/sounds'

const DIALOG_STEPS = [
  {
    speaker: 'ROSALINA',
    text: '¡Viajero galáctico! Una celebración épica se acerca en la Galaxia Bosques de los Ceibos...',
    color: '#93c5fd',
  },
  {
    speaker: 'TOAD',
    text: `¡La fiesta de Carlos será el ${EVENT.location}!`,
    color: '#f9a8d4',
  },
  {
    speaker: 'TOAD',
    text: '📅 Fecha: 29 de marzo de 2026\n⏰ Hora: 14h00',
    color: '#f9a8d4',
  },
  {
    speaker: 'CARLOS',
    text: 'No olvides llevar TRAJE DE BAÑO para el Power-Up acuático... ¡y prepárate para mi PARRILLADA intergaláctica! 🔥',
    color: '#facc15',
    highlights: ['TRAJE DE BAÑO', 'PARRILLADA'],
  },
  {
    speaker: '★ BONUS ★',
    text: 'Mención Especial: ¡Estreno de la película el 1 de abril! 🎬',
    color: '#a78bfa',
  },
]

function highlightText(text: string, highlights: string[] = []) {
  if (!highlights.length) return <span>{text}</span>
  const parts = text.split(new RegExp(`(${highlights.join('|')})`, 'g'))
  return (
    <>
      {parts.map((part, i) =>
        highlights.includes(part) ? (
          <span key={i} className="text-mario-yellow" style={{ textShadow: '0 0 10px rgba(250,204,21,0.8)' }}>
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  )
}

export default function DialogBox() {
  const [step, setStep] = useState(0)
  const [started, setStarted] = useState(false)
  const current = DIALOG_STEPS[step]
  const { displayed, done } = useTypewriter(current.text, 35, started)

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), 300)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    setStarted(false)
    const t = setTimeout(() => {
      sounds.dialogOpen()
      setStarted(true)
    }, 100)
    return () => clearTimeout(t)
  }, [step])

  const advance = () => {
    if (!done) return
    if (step < DIALOG_STEPS.length - 1) {
      sounds.menuSelect()
      setStep(s => s + 1)
    }
  }

  return (
    <section className="relative z-10 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-6">
          <span
            style={{
              fontFamily: "'Press Start 2P', cursive",
              fontSize: '9px',
              color: '#facc15',
              letterSpacing: '0.2em',
            }}
          >
            ✦ DETALLES DEL EVENTO ✦
          </span>
        </div>

        {/* Step indicators */}
        <div className="flex justify-center gap-2 mb-4">
          {DIALOG_STEPS.map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full transition-all duration-300"
              style={{
                background: i === step ? current.color : i < step ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.1)',
                boxShadow: i === step ? `0 0 8px ${current.color}` : 'none',
              }}
            />
          ))}
        </div>

        {/* Dialog box */}
        <div
          className="dialog-box p-5 cursor-pointer relative"
          onClick={advance}
          style={{ animation: 'dialogAppear 0.3s ease-out' }}
        >
          {/* Speaker name */}
          <div
            className="absolute -top-4 left-4 px-3 py-1 rounded text-xs font-bold"
            style={{
              fontFamily: "'Press Start 2P', cursive",
              fontSize: '9px',
              background: current.color,
              color: '#1a1a2e',
              border: '2px solid #1a1a2e',
              boxShadow: '2px 2px 0 #1a1a2e',
            }}
          >
            {current.speaker}
          </div>

          {/* Text content */}
          <div className="pt-2 min-h-[80px]">
            <p
              style={{
                fontFamily: "'Press Start 2P', cursive",
                fontSize: 'clamp(9px, 2vw, 12px)',
                lineHeight: '2',
                color: '#1a1a2e',
                whiteSpace: 'pre-line',
              }}
            >
              {highlightText(displayed, current.highlights)}
              {!done && (
                <span
                  className="inline-block ml-1 w-2 h-4 bg-gray-800 align-middle"
                  style={{ animation: 'twinkleAnimation 0.8s ease-in-out infinite' }}
                />
              )}
            </p>
          </div>

          {/* A button */}
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            {done && step < DIALOG_STEPS.length - 1 && (
              <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '8px', color: '#888' }}>
                SIGUIENTE
              </span>
            )}
            {done && step === DIALOG_STEPS.length - 1 && (
              <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '8px', color: '#888' }}>
                FIN
              </span>
            )}
            <div className="a-button">A</div>
          </div>
        </div>

        {/* Hint */}
        <p
          className="text-center mt-3 text-white/30"
          style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '7px' }}
        >
          {done ? 'CLICK PARA CONTINUAR' : '...'}
        </p>

        {/* Restart button when done */}
        {done && step === DIALOG_STEPS.length - 1 && (
          <div className="flex justify-center mt-4">
            <button
              className="star-btn px-4 py-2 text-space-dark"
              style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '9px' }}
              onClick={() => { sounds.menuSelect(); setStep(0) }}
            >
              ↺ RELEER
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
