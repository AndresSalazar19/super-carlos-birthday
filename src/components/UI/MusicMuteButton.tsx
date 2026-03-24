'use client'
import { useState, useEffect } from 'react'

interface Props {
  musicMuted: boolean
  onToggle: (muted: boolean) => void
}

export default function MusicMuteButton({ musicMuted, onToggle }: Props) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const toggle = () => {
    onToggle(!musicMuted)
  }

  if (!mounted) return null

  return (
    <button
      onClick={toggle}
className="fixed top-4 right-24 z-50 hud-box text-xs text-mario-yellow hover:scale-110 transition-transform hidden md:flex"
      style={{ fontSize: '10px', padding: '8px 12px' }}
      title={musicMuted ? 'Activar música' : 'Silenciar música'}
    >
      {musicMuted ? '🔇 MUSIC' : '🎵 MUSIC'}
    </button>
  )
}