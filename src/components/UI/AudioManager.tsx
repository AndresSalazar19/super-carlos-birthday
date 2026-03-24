'use client'
import { useEffect, useRef } from 'react'

interface Props {
  phase: 'intro' | 'main'
  musicMuted: boolean
}

export default function AudioManager({ phase, musicMuted }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const phaseRef = useRef(phase)

  // Handle music mute changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = musicMuted ? 0 : 0.5
    }
  }, [musicMuted])

  useEffect(() => {
    // On first interaction, start audio
    const startAudio = () => {
      if (audioRef.current) return
      const src = phase === 'intro' ? '/sounds/luma.mp3' : '/sounds/mariogalaxy.mp3'
      const audio = new Audio(src)
      audio.loop = true
      audio.volume = musicMuted ? 0 : 0.5
      audio.play().catch(() => {})
      audioRef.current = audio
      window.removeEventListener('click', startAudio)
      window.removeEventListener('keydown', startAudio)
      window.removeEventListener('touchstart', startAudio)
    }

    window.addEventListener('click', startAudio, { once: true })
    window.addEventListener('keydown', startAudio, { once: true })
    window.addEventListener('touchstart', startAudio, { once: true })

    return () => {
      window.removeEventListener('click', startAudio)
      window.removeEventListener('keydown', startAudio)
      window.removeEventListener('touchstart', startAudio)
    }
  }, [phase])

  // When phase changes, crossfade
  useEffect(() => {
    if (phaseRef.current === phase) return
    phaseRef.current = phase

    const oldAudio = audioRef.current
    const newSrc = phase === 'main' ? '/sounds/mariogalaxy.mp3' : '/sounds/luma.mp3'

    const newAudio = new Audio(newSrc)
    newAudio.loop = true
    newAudio.volume = musicMuted ? 0 : 0

    newAudio.play().then(() => {
      // Crossfade over 1.5s
      let vol = 0
      const targetVol = musicMuted ? 0 : 0.55
      const fadeIn = setInterval(() => {
        vol = Math.min(targetVol, vol + 0.03)
        newAudio.volume = vol
        if (oldAudio) oldAudio.volume = Math.max(0, oldAudio.volume - 0.03)
        if (vol >= targetVol) {
          clearInterval(fadeIn)
          oldAudio?.pause()
          audioRef.current = newAudio
        }
      }, 50)
    }).catch(() => {})
  }, [phase])

  return null
}