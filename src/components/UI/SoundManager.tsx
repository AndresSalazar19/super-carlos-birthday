'use client'
import { useState, useEffect } from 'react'
import { setMuted, getMuted } from '@/lib/sounds'

export default function SoundManager() {
  const [muted, setMutedState] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const toggle = () => {
    const next = !muted
    setMutedState(next)
    setMuted(next)
  }

  if (!mounted) return null

  return (
    <button
      onClick={toggle}
      className="fixed top-4 right-4 z-50 hud-box text-xs text-mario-yellow hover:scale-110 transition-transform"
      style={{ fontSize: '10px', padding: '8px 12px' }}
      title={muted ? 'Activar sonidos' : 'Silenciar'}
    >
      {muted ? '🔇 MUTE' : '🔊 SFX'}
    </button>
  )
}
