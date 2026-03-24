'use client'
import { useState } from 'react'
import { sounds } from '@/lib/sounds'

type Room = {
  id: string
  label: string
  emoji: string
  color: string
  href: string
  description: string
  x: number
  y: number
}

const ROOMS: Room[] = [
  { id: 'hero',      label: 'Entrada',    emoji: '🚀', color: '#facc15', href: '#top',       description: 'Inicio galáctico',         x: 50, y: 12 },
  { id: 'countdown', label: 'Tiempo',     emoji: '⏱',  color: '#93c5fd', href: '#countdown', description: 'Cuenta regresiva',         x: 20, y: 35 },
  { id: 'dialog',    label: 'Detalles',   emoji: '💬', color: '#f9a8d4', href: '#detalles',  description: 'Info del evento',          x: 80, y: 35 },
  { id: 'planets',   label: 'Planetas',   emoji: '🌍', color: '#86efac', href: '#planetas',  description: 'Parrillada & Piscina',    x: 20, y: 60 },
  { id: 'game',      label: 'Mini-Juego', emoji: '⭐', color: '#fde68a', href: '#minijuego', description: 'Atrapa estrellas',         x: 80, y: 60 },
  { id: 'rsvp',      label: 'RSVP',       emoji: '📝', color: '#a78bfa', href: '#rsvp',      description: 'Confirma asistencia',      x: 50, y: 82 },
]

export default function ObservatoryMap() {
  const [hovered, setHovered] = useState<string | null>(null)

  const handleClick = (room: Room) => {
    sounds.menuSelect()
    const el = document.querySelector(room.href)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="relative z-10 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '9px', color: '#facc15', letterSpacing: '0.2em' }}>
            ✦ OBSERVATORIO DE ROSALINA ✦
          </p>
          <h2 className="text-white mt-2" style={{ fontFamily: "'Press Start 2P', cursive", fontSize: 'clamp(11px, 2.5vw, 16px)' }}>
            MAPA DE LA GALAXIA
          </h2>
        </div>

        {/* Map area */}
        <div
          className="relative rounded-xl overflow-hidden"
          style={{
            paddingBottom: '80%',
            background: 'rgba(0,0,0,0.5)',
            border: '2px solid rgba(250,204,21,0.2)',
          }}
        >
          <div className="absolute inset-0">
            {/* Connection lines */}
            <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
              {[
                [ROOMS[0], ROOMS[1]], [ROOMS[0], ROOMS[2]],
                [ROOMS[1], ROOMS[3]], [ROOMS[2], ROOMS[4]],
                [ROOMS[3], ROOMS[5]], [ROOMS[4], ROOMS[5]],
              ].map(([a, b], i) => (
                <line
                  key={i}
                  x1={`${a.x}%`} y1={`${a.y}%`}
                  x2={`${b.x}%`} y2={`${b.y}%`}
                  stroke="rgba(250,204,21,0.15)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              ))}
            </svg>

            {/* Background stars */}
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${(i * 37 + 5) % 95}%`,
                  top: `${(i * 53 + 3) % 95}%`,
                  width: `${1 + (i % 2)}px`,
                  height: `${1 + (i % 2)}px`,
                  background: 'rgba(255,255,255,0.4)',
                  animation: `twinkleAnimation ${1.5 + (i % 3)}s ease-in-out infinite`,
                  animationDelay: `${(i * 0.15) % 3}s`,
                }}
              />
            ))}

            {/* Room nodes */}
            {ROOMS.map(room => {
              const isHovered = hovered === room.id
              return (
                <button
                  key={room.id}
                  className="absolute"
                  style={{
                    left: `${room.x}%`,
                    top: `${room.y}%`,
                    transform: 'translate(-50%, -50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    zIndex: 10,
                    padding: 0,
                  }}
                  onMouseEnter={() => { setHovered(room.id); sounds.menuSelect() }}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => handleClick(room)}
                >
                  <div
                    className="transition-all duration-200 flex flex-col items-center gap-1"
                    style={{ transform: isHovered ? 'scale(1.3)' : 'scale(1)' }}
                  >
                    {/* Glow circle */}
                    <div
                      className="rounded-full flex items-center justify-center"
                      style={{
                        width: isHovered ? '52px' : '44px',
                        height: isHovered ? '52px' : '44px',
                        background: `radial-gradient(circle, ${room.color}33, ${room.color}11)`,
                        border: `2px solid ${room.color}${isHovered ? 'ff' : '66'}`,
                        boxShadow: isHovered ? `0 0 20px ${room.color}88` : 'none',
                        transition: 'all 0.2s',
                        fontSize: isHovered ? '22px' : '18px',
                      }}
                    >
                      {room.emoji}
                    </div>
                    <span
                      style={{
                        fontFamily: "'Press Start 2P', cursive",
                        fontSize: '6px',
                        color: isHovered ? room.color : 'rgba(255,255,255,0.5)',
                        textShadow: isHovered ? `0 0 8px ${room.color}` : 'none',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.2s',
                      }}
                    >
                      {room.label}
                    </span>
                  </div>
                </button>
              )
            })}

            {/* Tooltip */}
            {hovered && (
              <div
                className="absolute bottom-3 left-1/2 -translate-x-1/2 dialog-box px-3 py-2 pointer-events-none"
                style={{ animation: 'dialogAppear 0.2s ease-out', whiteSpace: 'nowrap' }}
              >
                <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '8px', color: '#1a1a2e' }}>
                  {ROOMS.find(r => r.id === hovered)?.description}
                </p>
              </div>
            )}
          </div>
        </div>

        <p
          className="text-center mt-3 text-white/30"
          style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '7px' }}
        >
          CLICK EN UN MUNDO PARA NAVEGAR
        </p>
      </div>
    </section>
  )
}
