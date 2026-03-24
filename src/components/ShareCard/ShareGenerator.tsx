'use client'
import { useState, useRef } from 'react'
import { sounds } from '@/lib/sounds'

export default function ShareGenerator() {
  const [name, setName] = useState('')
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const generate = async () => {
    if (!name.trim()) return
    sounds.powerStar()
    setGenerating(true)

    try {
      const { default: html2canvas } = await import('html2canvas')
      await new Promise(r => setTimeout(r, 300))
      if (!cardRef.current) return

      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#030014',
        scale: 2,
        useCORS: true,
      })

      const link = document.createElement('a')
      link.download = `invitacion-carlos-birthday-${name.replace(/\s+/g, '-')}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
      setGenerated(true)
    } catch (e) {
      console.error(e)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <section className="relative z-10 py-16 px-4" id="compartir">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '9px', color: '#facc15', letterSpacing: '0.2em' }}>
            ✦ COMPARTE LA INVITACIÓN ✦
          </p>
          <h2 className="text-white mt-2" style={{ fontFamily: "'Press Start 2P', cursive", fontSize: 'clamp(11px, 2.5vw, 16px)' }}>
            TU PASE GALÁCTICO
          </h2>
        </div>

        {/* Input */}
        <div className="hud-box mb-6">
          <label style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '8px', color: '#facc15', display: 'block', marginBottom: '8px' }}>
            INGRESA TU NOMBRE:
          </label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Jugador 1..."
            onFocus={() => sounds.menuSelect()}
            style={{
              fontFamily: "'Press Start 2P', cursive",
              fontSize: '10px',
              background: 'rgba(255,255,255,0.1)',
              border: '2px solid rgba(250,204,21,0.4)',
              borderRadius: '8px',
              padding: '10px 12px',
              width: '100%',
              color: '#fff',
              outline: 'none',
            }}
          />
        </div>

        {/* Preview card */}
        {name && (
          <div
            ref={cardRef}
            className="relative rounded-xl overflow-hidden mb-6 p-6 text-center"
            style={{
              background: 'linear-gradient(160deg, #1a0a3e 0%, #030014 50%, #0d1a3a 100%)',
              border: '3px solid rgba(250,204,21,0.4)',
              boxShadow: '0 0 40px rgba(250,204,21,0.2)',
            }}
          >
            {/* Stars BG */}
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${(i * 37 + 5) % 95}%`,
                  top: `${(i * 53 + 3) % 95}%`,
                  width: '2px', height: '2px',
                  background: 'rgba(255,255,255,0.6)',
                }}
              />
            ))}

            {/* Nintendo presents */}
            <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '7px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>
              NINTENDO PRESENTA
            </p>

            {/* Title */}
            <div style={{ fontSize: 'clamp(28px, 8vw, 48px)', fontFamily: "'Press Start 2P', cursive", lineHeight: '1.2', marginBottom: '8px' }}>
              <div style={{ color: '#fff', fontSize: 'clamp(14px, 4vw, 22px)', textShadow: '2px 2px 0 rgba(0,0,0,0.8)' }}>SUPER</div>
              <div style={{
                background: 'linear-gradient(90deg, #ef4444, #f97316, #facc15, #22c55e, #3b82f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: 'clamp(28px, 8vw, 52px)',
                textShadow: 'none',
              }}>CARLOS</div>
              <div style={{ color: '#a78bfa', fontSize: 'clamp(18px, 5vw, 32px)', textShadow: '2px 2px 0 rgba(0,0,0,0.8)' }}>BIRTHDAY</div>
            </div>

            {/* Invitee name */}
            <div
              className="my-4 py-2 px-4 rounded-lg inline-block"
              style={{
                background: 'rgba(250,204,21,0.15)',
                border: '2px solid rgba(250,204,21,0.4)',
              }}
            >
              <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '8px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>
                INVITADO ESPECIAL:
              </p>
              <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: 'clamp(12px, 3vw, 18px)', color: '#facc15', textShadow: '0 0 15px rgba(250,204,21,0.8)' }}>
                ★ {name.toUpperCase()} ★
              </p>
            </div>

            {/* Event details */}
            <div className="mt-2 space-y-1">
              <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '7px', color: 'rgba(255,255,255,0.7)' }}>
                📅 29 DE MARZO DE 2026
              </p>
              <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '7px', color: 'rgba(255,255,255,0.7)' }}>
                ⏰ 14H00
              </p>
              <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '6px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
                Club Urb. Bosques de los Ceibos
              </p>
            </div>

            {/* Bottom note */}
            <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '6px', color: '#facc15', marginTop: '12px' }}>
              🩱 TRAER TRAJE DE BAÑO 🔥 PARRILLADA
            </p>
          </div>
        )}

        {/* Generate button */}
        <div className="flex justify-center">
          <button
            className="star-btn px-8 py-4 disabled:opacity-50"
            style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '10px' }}
            onClick={generate}
            disabled={!name.trim() || generating}
          >
            {generating ? 'GENERANDO...' : generated ? '✓ DESCARGADO!' : '📥 DESCARGAR IMAGEN'}
          </button>
        </div>

        {generated && (
          <p className="text-center mt-3 text-white/50" style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '7px' }}>
            ¡Comparte en WhatsApp o Instagram!
          </p>
        )}
      </div>
    </section>
  )
}
