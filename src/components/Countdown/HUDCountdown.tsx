'use client'
import { useCountdown } from '@/hooks/useCountdown'
import { EVENT } from '@/constants/event'
import { useEffect, useRef } from 'react'
import { sounds } from '@/lib/sounds'

function Digit({ value, label }: { value: number; label: string }) {
  const str = String(value).padStart(2, '0')
  const isUrgent = label === 'DIAS' && value <= 3

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="hud-box flex items-center justify-center relative overflow-hidden"
        style={{
          width: 'clamp(60px, 15vw, 90px)',
          height: 'clamp(60px, 15vw, 90px)',
          borderColor: isUrgent ? '#ef4444' : '#facc15',
          boxShadow: isUrgent
            ? '0 0 20px rgba(239,68,68,0.5), inset 0 0 20px rgba(239,68,68,0.05)'
            : '0 0 20px rgba(250,204,21,0.3), inset 0 0 20px rgba(250,204,21,0.05)',
        }}
      >
        <span
          style={{
            fontFamily: "'Press Start 2P', cursive",
            fontSize: 'clamp(20px, 5vw, 32px)',
            color: isUrgent ? '#ef4444' : '#facc15',
            textShadow: isUrgent
              ? '0 0 15px rgba(239,68,68,0.8)'
              : '0 0 15px rgba(250,204,21,0.8)',
          }}
        >
          {str}
        </span>
        {/* scanline */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
        }} />
      </div>
      <span
        className="text-white/50"
        style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '7px', letterSpacing: '0.1em' }}
      >
        {label}
      </span>
    </div>
  )
}

export default function HUDCountdown() {
  const { timeLeft, expired } = useCountdown(EVENT.date)
  const prevSec = useRef(timeLeft.seconds)

  useEffect(() => {
    if (timeLeft.seconds !== prevSec.current) {
      prevSec.current = timeLeft.seconds
    }
  }, [timeLeft.seconds])

  return (
    <section className="relative z-10 py-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="inline-block px-4 py-1 rounded mb-3"
            style={{
              background: 'rgba(250,204,21,0.1)',
              border: '2px solid rgba(250,204,21,0.3)',
              fontFamily: "'Press Start 2P', cursive",
              fontSize: '9px',
              color: '#facc15',
              letterSpacing: '0.2em',
            }}
          >
            ⏱ TIME REMAINING
          </div>
          <h2
            className="text-white"
            style={{ fontFamily: "'Press Start 2P', cursive", fontSize: 'clamp(12px, 3vw, 18px)' }}
          >
            {expired ? '🎉 ¡LA FIESTA ES HOY!' : 'CUENTA REGRESIVA'}
          </h2>
        </div>

        {expired ? (
          <div
            className="text-center text-mario-yellow"
            style={{
              fontFamily: "'Press Start 2P', cursive",
              fontSize: 'clamp(16px, 4vw, 28px)',
              animation: 'floatAnimation 1s ease-in-out infinite',
              textShadow: '0 0 30px rgba(250,204,21,0.8)',
            }}
          >
            ★ HAPPY BIRTHDAY CARLOS! ★
          </div>
        ) : (
          <>
            <div className="flex items-center justify-center gap-3 md:gap-6">
              <Digit value={timeLeft.days}    label="DIAS" />
              <span className="text-mario-yellow text-2xl font-bold mb-4" style={{ fontFamily: "'Press Start 2P', cursive" }}>:</span>
              <Digit value={timeLeft.hours}   label="HORAS" />
              <span className="text-mario-yellow text-2xl font-bold mb-4" style={{ fontFamily: "'Press Start 2P', cursive" }}>:</span>
              <Digit value={timeLeft.minutes} label="MIN" />
              <span className="text-mario-yellow text-2xl font-bold mb-4" style={{ fontFamily: "'Press Start 2P', cursive" }}>:</span>
              <Digit value={timeLeft.seconds} label="SEG" />
            </div>

            <div className="mt-6 text-center">
              <p
                className="text-white/40"
                style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '8px' }}
              >
                29 DE MARZO DE 2026 — 14H00
              </p>
            </div>

            {/* Progress bar */}
            <div className="mt-6 hud-box">
              <div className="flex justify-between mb-2">
                <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '8px', color: '#facc15' }}>
                  FIESTA LEVEL
                </span>
                <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '8px', color: '#fff' }}>
                  MAX ★
                </span>
              </div>
              <div className="h-4 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${Math.min(100, Math.max(5, (1 - timeLeft.days / 90) * 100))}%`,
                    background: 'linear-gradient(90deg, #22c55e, #facc15, #ef4444)',
                    boxShadow: '0 0 10px rgba(250,204,21,0.6)',
                  }}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
