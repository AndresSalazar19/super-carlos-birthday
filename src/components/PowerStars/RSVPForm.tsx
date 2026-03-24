'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { sounds } from '@/lib/sounds'

export default function RSVPForm({ onSuccess }: { onSuccess?: () => void }) {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [swimsuit, setSwimssuit] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    setError('')

    try {
      const { error: dbError } = await supabase.from('rsvps').insert({
        name: name.trim(),
        message: message.trim() || null,
        bringing_swimsuit: swimsuit,
      })
      if (dbError) throw dbError
      sounds.rsvpSuccess()
      setDone(true)
      onSuccess?.()
    } catch {
      setError('Error al guardar. Intenta de nuevo.')
      sounds.menuBack()
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="dialog-box p-6 text-center">
        <div
          style={{
            fontFamily: "'Press Start 2P', cursive",
            fontSize: 'clamp(14px, 3vw, 20px)',
            color: '#22c55e',
            textShadow: '0 0 20px rgba(34,197,94,0.8)',
            marginBottom: '12px',
            animation: 'floatAnimation 1s ease-in-out infinite',
          }}
        >
          ★ CONFIRMADO! ★
        </div>
        <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '10px', color: '#1a1a2e', lineHeight: '2' }}>
          ¡{name} se une a la<br />galaxia de Carlos!
        </p>
        <div className="mt-4 text-2xl">🎉🌟🎂</div>
      </div>
    )
  }

  const inputStyle: React.CSSProperties = {
    fontFamily: "'Press Start 2P', cursive",
    fontSize: '10px',
    background: 'rgba(255,255,255,0.95)',
    border: '3px solid #1a1a2e',
    borderRadius: '8px',
    padding: '10px 12px',
    width: '100%',
    color: '#1a1a2e',
    outline: 'none',
    boxSizing: 'border-box',
  }

  return (
    <div className="dialog-box p-6">
      <div
        className="absolute -top-4 left-4 px-3 py-1 rounded font-bold"
        style={{
          fontFamily: "'Press Start 2P', cursive",
          fontSize: '9px',
          background: '#22c55e',
          color: '#fff',
          border: '2px solid #1a1a2e',
          boxShadow: '2px 2px 0 #1a1a2e',
        }}
      >
        CONFIRMAR ASISTENCIA
      </div>

      <form onSubmit={submit} className="pt-4 space-y-4">
        <div>
          <label style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '8px', color: '#1a1a2e', display: 'block', marginBottom: '6px' }}>
            TU NOMBRE:
          </label>
          <input
            style={inputStyle}
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Jugador 1..."
            required
            onFocus={() => sounds.menuSelect()}
          />
        </div>

        <div>
          <label style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '8px', color: '#1a1a2e', display: 'block', marginBottom: '6px' }}>
            MENSAJE (opcional):
          </label>
          <textarea
            style={{ ...inputStyle, minHeight: '70px', resize: 'none' }}
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="¡Feliz cumple Carlos!..."
            onFocus={() => sounds.menuSelect()}
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="swimsuit"
            checked={swimsuit}
            onChange={e => { setSwimssuit(e.target.checked); sounds.menuSelect() }}
            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
          />
          <label
            htmlFor="swimsuit"
            style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '8px', color: '#1a1a2e', cursor: 'pointer', lineHeight: '1.6' }}
          >
            🩱 Llevaré traje de baño
          </label>
        </div>

        {error && (
          <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '8px', color: '#ef4444' }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="star-btn w-full py-3 disabled:opacity-50"
          style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '10px' }}
        >
          {loading ? 'GUARDANDO...' : '★ CONFIRMAR ★'}
        </button>
      </form>

      <div className="absolute bottom-3 right-3 a-button">A</div>
    </div>
  )
}
