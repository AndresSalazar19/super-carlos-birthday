'use client'

let audioCtx: AudioContext | null = null
let muted = false
let musicMuted = false

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext()
  return audioCtx
}

export function setMuted(val: boolean) { muted = val }
export function getMuted() { return muted }

export function setMusicMuted(val: boolean) { musicMuted = val }
export function getMusicMuted() { return musicMuted }

function beep(freq: number, duration: number, type: OscillatorType = 'sine', vol = 0.3) {
  if (muted || typeof window === 'undefined') return
  try {
    const ctx = getCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = type
    osc.frequency.value = freq
    gain.gain.setValueAtTime(vol, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + duration)
  } catch {}
}

export const sounds = {
  typewriter: () => beep(800, 0.05, 'square', 0.1),
  starCollect: () => {
    beep(523, 0.1, 'sine', 0.4)
    setTimeout(() => beep(659, 0.1, 'sine', 0.4), 80)
    setTimeout(() => beep(784, 0.15, 'sine', 0.4), 160)
    setTimeout(() => beep(1047, 0.3, 'sine', 0.4), 240)
  },
  powerStar: () => {
    const notes = [523, 659, 784, 1047, 1319, 1568]
    notes.forEach((n, i) => setTimeout(() => beep(n, 0.15, 'sine', 0.35), i * 80))
  },
  menuSelect: () => {
    beep(440, 0.08, 'square', 0.2)
    setTimeout(() => beep(880, 0.12, 'square', 0.2), 60)
  },
  menuBack: () => beep(220, 0.15, 'square', 0.2),
  dialogOpen: () => {
    beep(660, 0.08, 'sine', 0.3)
    setTimeout(() => beep(880, 0.15, 'sine', 0.3), 60)
  },
  countdownTick: () => beep(440, 0.05, 'square', 0.15),
  rsvpSuccess: () => {
    const melody = [523, 659, 784, 659, 784, 1047]
    melody.forEach((n, i) => setTimeout(() => beep(n, 0.12, 'sine', 0.4), i * 100))
  },
}
