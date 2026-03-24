'use client'
import { useEffect, useRef, useState } from 'react'

interface Props {
  phase: 'intro' | 'main'
  musicMuted: boolean
}

export default function AudioManager({ phase, musicMuted }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [interacted, setInteracted] = useState(false)
  const phaseRef = useRef(phase)
  const isFading = useRef(false) // Para evitar conflictos durante el crossfade

  // 1. Desbloqueo de audio
  useEffect(() => {
    const unlock = () => { if (!interacted) setInteracted(true) }
    window.addEventListener('click', unlock, { once: true })
    window.addEventListener('touchstart', unlock, { once: true })
    return () => {
      window.removeEventListener('click', unlock)
      window.removeEventListener('touchstart', unlock)
    }
  }, [interacted])

  // 2. Sincronización de PAUSA/PLAY y VOLUMEN (Capa de Control)
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (musicMuted) {
      audio.pause()
      audio.volume = 0
    } else {
      // Solo play si el usuario ya interactuó y la pestaña está visible
      if (interacted && !document.hidden) {
        audio.play().catch(() => {})
        // Si no estamos en medio de un fade, ponemos el volumen normal
        if (!isFading.current) audio.volume = 0.55
      }
    }
  }, [musicMuted, interacted])

  // 3. Manejo de visibilidad del navegador
  useEffect(() => {
    const handleVisibility = () => {
      const audio = audioRef.current
      if (!audio) return
      if (document.hidden) {
        audio.pause()
      } else if (!musicMuted && interacted) {
        audio.play().catch(() => {})
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [musicMuted, interacted])

  // 4. Lógica de Carga y Crossfade
  useEffect(() => {
    if (!interacted) return

    const getSrc = (p: 'intro' | 'main') => 
      p === 'intro' ? '/sounds/luma.mp3' : '/sounds/mariogalaxy.mp3'

    // PRIMERA CARGA
    if (!audioRef.current) {
      const audio = new Audio(getSrc(phase))
      audio.loop = true
      audio.volume = musicMuted ? 0 : 0.55
      if (!musicMuted) audio.play().catch(() => {})
      audioRef.current = audio
      phaseRef.current = phase
      return
    }

    // CAMBIO DE FASE (CROSSFADE)
    if (phaseRef.current !== phase) {
      isFading.current = true
      const oldAudio = audioRef.current
      const newAudio = new Audio(getSrc(phase))
      newAudio.loop = true
      newAudio.volume = 0
      
      newAudio.play().then(() => {
        let vol = 0
        const targetVol = 0.55
        const fadeInterval = setInterval(() => {
          vol = Math.min(targetVol, vol + 0.02)
          
          // Aplicamos el volumen respetando SIEMPRE el mute actual
          newAudio.volume = musicMuted ? 0 : vol
          if (oldAudio) oldAudio.volume = Math.max(0, oldAudio.volume - 0.02)

          if (vol >= targetVol) {
            clearInterval(fadeInterval)
            isFading.current = false
            oldAudio?.pause()
            audioRef.current = newAudio
            // Aseguramos estado final
            if (musicMuted) newAudio.pause()
          }
        }, 50)
      }).catch(() => {
        isFading.current = false
      })
      phaseRef.current = phase
    }
  }, [phase, interacted, musicMuted])

  return null
}