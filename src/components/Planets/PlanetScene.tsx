'use client'
import { useState } from 'react'
import { sounds } from '@/lib/sounds'

type PlanetInfo = {
  id: string
  title: string
  emoji: string
  color: string
  glow: string
  details: string[]
  decoration: string
}

const PLANETS: PlanetInfo[] = [
  {
    id: 'grill',
    title: 'PLANETA PARRILLADA',
    emoji: '🍖',
    color: 'radial-gradient(circle at 35% 30%, #86efac, #16a34a 60%, #14532d)',
    glow: 'rgba(34,197,94,0.4)',
    details: [
      '🔥 Parrillada Galáctica',
      '🍔 Burgers & Skewers',
      '🌽 Choclos Espaciales',
      '👨‍🍳 Chef Toad al mando',
    ],
    decoration: '🧑‍🍳',
  },
  {
    id: 'pool',
    title: 'PLANETA PISCINA',
    emoji: '🏊',
    color: 'radial-gradient(circle at 35% 30%, #7dd3fc, #0284c7 60%, #0c4a6e)',
    glow: 'rgba(14,165,233,0.4)',
    details: [
      '💧 Piscina Cósmica',
      '👙 Traje de baño requerido',
      '🌴 Palmeras Galácticas',
      '☀️ Sol Interestelar',
    ],
    decoration: '🏖️',
  },
]

function Planet({ planet, onClick }: { planet: PlanetInfo; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="flex flex-col items-center gap-4 cursor-pointer group"
      onClick={onClick}
      onMouseEnter={() => { setHovered(true); sounds.menuSelect() }}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Planet */}
      <div
        className="relative transition-all duration-300"
        style={{
          width: 'clamp(140px, 25vw, 200px)',
          height: 'clamp(140px, 25vw, 200px)',
          animation: 'floatAnimation 4s ease-in-out infinite',
          transform: hovered ? 'scale(1.1)' : 'scale(1)',
        }}
      >
        {/* Glow ring */}
        <div
          className="absolute inset-0 rounded-full transition-all duration-300"
          style={{
            background: planet.color,
            boxShadow: `inset -15px -10px 30px rgba(0,0,0,0.4), inset 10px 10px 20px rgba(255,255,255,0.1), 0 0 ${hovered ? 60 : 30}px ${planet.glow}`,
            transform: 'scale(1.0)',
          }}
        />

        {/* Surface texture lines */}
        <div
          className="absolute inset-0 rounded-full overflow-hidden opacity-20"
          style={{
            background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.2) 10px, rgba(0,0,0,0.2) 11px)',
          }}
        />

        {/* Decoration on top */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ fontSize: 'clamp(40px, 8vw, 60px)', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))' }}
        >
          {planet.decoration}
        </div>

        {/* Shine */}
        <div
          className="absolute rounded-full"
          style={{
            top: '12%', left: '18%',
            width: '30%', height: '20%',
            background: 'rgba(255,255,255,0.25)',
            filter: 'blur(4px)',
            transform: 'rotate(-30deg)',
          }}
        />
      </div>

      {/* Label */}
      <div
        className="text-center transition-all duration-300"
        style={{
          fontFamily: "'Press Start 2P', cursive",
          fontSize: 'clamp(8px, 1.5vw, 11px)',
          color: hovered ? '#facc15' : 'rgba(255,255,255,0.7)',
          textShadow: hovered ? '0 0 15px rgba(250,204,21,0.8)' : 'none',
        }}
      >
        {planet.title}
        <br />
        <span style={{ fontSize: '7px', color: 'rgba(255,255,255,0.4)' }}>
          {hovered ? '[ CLICK PARA VER ]' : planet.emoji}
        </span>
      </div>
    </div>
  )
}

export default function PlanetScene() {
  const [selected, setSelected] = useState<PlanetInfo | null>(null)

  const open = (planet: PlanetInfo) => {
    sounds.dialogOpen()
    setSelected(planet)
  }

  const close = () => {
    sounds.menuBack()
    setSelected(null)
  }

  return (
    <section className="relative z-10 py-16 px-4" id="planetas">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '9px', color: '#facc15', letterSpacing: '0.2em' }}>
            ✦ EXPLORA LAS GALAXIAS ✦
          </p>
          <h2
            className="text-white mt-3"
            style={{ fontFamily: "'Press Start 2P', cursive", fontSize: 'clamp(14px, 3vw, 22px)' }}
          >
            MUNDOS DE LA FIESTA
          </h2>
        </div>

        {/* Planets row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-12 md:gap-24">
          {PLANETS.map(p => (
            <Planet key={p.id} planet={p} onClick={() => open(p)} />
          ))}
        </div>

        {/* Detail overlay */}
        {selected && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
            onClick={close}
          >
            <div
              className="dialog-box max-w-sm w-full p-6 relative"
              onClick={e => e.stopPropagation()}
              style={{ animation: 'dialogAppear 0.3s ease-out' }}
            >
              {/* Speaker */}
              <div
                className="absolute -top-4 left-4 px-3 py-1 rounded font-bold"
                style={{
                  fontFamily: "'Press Start 2P', cursive",
                  fontSize: '9px',
                  background: selected.color,
                  color: '#fff',
                  border: '2px solid #1a1a2e',
                  boxShadow: '2px 2px 0 #1a1a2e',
                }}
              >
                {selected.title}
              </div>

              <div className="pt-4 space-y-3">
                {selected.details.map((d, i) => (
                  <p
                    key={i}
                    style={{
                      fontFamily: "'Press Start 2P', cursive",
                      fontSize: 'clamp(9px, 2vw, 11px)',
                      lineHeight: '1.8',
                      color: '#1a1a2e',
                    }}
                  >
                    {d}
                  </p>
                ))}
              </div>

              <button
                className="mt-6 star-btn w-full py-2"
                style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '9px' }}
                onClick={close}
              >
                ✓ ENTENDIDO
              </button>

              <div className="absolute bottom-3 right-3 a-button">A</div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
