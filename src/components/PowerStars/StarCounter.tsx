'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { EVENT } from '@/constants/event'
import { sounds } from '@/lib/sounds'
import type { RSVP } from '@/lib/supabase'

export default function StarCounter() {
  const [rsvps, setRsvps] = useState<RSVP[]>([])
  const [loading, setLoading] = useState(true)
  const [secretUnlocked, setSecretUnlocked] = useState(false)

  useEffect(() => {
    const fetchRsvps = async () => {
      const { data } = await supabase.from('rsvps').select('*').order('confirmed_at', { ascending: false })
      if (data) setRsvps(data as RSVP[])
      setLoading(false)
    }
    fetchRsvps()

    const channel = supabase.channel('rsvps-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'rsvps' }, (payload) => {
        setRsvps(prev => [payload.new as RSVP, ...prev])
        sounds.starCollect()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const count = rsvps.length
  const goal = EVENT.totalStarsGoal
  const percent = Math.min(100, (count / goal) * 100)
  const swimsuitCount = rsvps.filter(r => r.bringing_swimsuit).length

  useEffect(() => {
    if (count >= goal && !secretUnlocked) {
      setSecretUnlocked(true)
      sounds.powerStar()
    }
  }, [count, goal, secretUnlocked])

  return (
    <section className="relative z-10 py-12 px-4" id="rsvp-counter">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '9px', color: '#facc15', letterSpacing: '0.2em' }}>
            ✦ POWER STARS RECOLECTADAS ✦
          </p>
        </div>

        <div className="hud-box">
          {/* Main star count */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '8px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>
                INVITADOS CONFIRMADOS
              </p>
              <div className="flex items-center gap-2">
                <span style={{ fontSize: '32px' }}>⭐</span>
                <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: 'clamp(24px, 5vw, 36px)', color: '#facc15', textShadow: '0 0 20px rgba(250,204,21,0.8)' }}>
                  {loading ? '...' : count}
                </span>
                <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>
                  / {goal}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '8px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>
                🩱 CON TRAJE
              </p>
              <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '24px', color: '#93c5fd' }}>
                {loading ? '...' : swimsuitCount}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="h-6 rounded-full overflow-hidden relative" style={{ background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(250,204,21,0.2)' }}>
              <div
                className="h-full rounded-full transition-all duration-1000 relative"
                style={{
                  width: `${percent}%`,
                  background: 'linear-gradient(90deg, #22c55e, #facc15)',
                  boxShadow: '0 0 15px rgba(250,204,21,0.6)',
                  minWidth: count > 0 ? '20px' : '0',
                }}
              >
                {count > 0 && (
                  <div
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                    style={{ fontSize: '12px' }}
                  >
                    ★
                  </div>
                )}
              </div>
              {/* Segment markers */}
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute top-0 bottom-0 w-px"
                  style={{
                    left: `${(i + 1) * 10}%`,
                    background: 'rgba(0,0,0,0.3)',
                  }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-1">
              <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '7px', color: 'rgba(255,255,255,0.3)' }}>0</span>
              <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '7px', color: 'rgba(255,255,255,0.3)' }}>{goal}</span>
            </div>
          </div>

          {/* Secret unlock */}
          {secretUnlocked && (
            <div
              className="text-center p-3 rounded-lg mb-4"
              style={{
                background: 'rgba(250,204,21,0.1)',
                border: '2px solid rgba(250,204,21,0.4)',
                animation: 'floatAnimation 1s ease-in-out infinite',
              }}
            >
              <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '9px', color: '#facc15' }}>
                🌟 MISIÓN COMPLETA 🌟
              </p>
              <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '8px', color: 'white', marginTop: '4px' }}>
                ¡Todas las estrellas reunidas!
              </p>
            </div>
          )}

          {/* Recent RSVPs */}
          {rsvps.length > 0 && (
            <div className="mt-4">
              <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '8px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>
                ÚLTIMOS JUGADORES:
              </p>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {rsvps.slice(0, 5).map(r => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between py-1 px-2 rounded"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '8px', color: '#facc15' }}>
                      ★ {r.name}
                    </span>
                    {r.bringing_swimsuit && <span style={{ fontSize: '14px' }}>🩱</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {loading && (
            <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '8px', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
              CARGANDO GALAXIA...
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
