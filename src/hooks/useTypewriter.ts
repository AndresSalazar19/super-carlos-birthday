import { useState, useEffect, useCallback } from 'react'
import { sounds } from '@/lib/sounds'

export function useTypewriter(text: string, speed = 40, started = true) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  const reset = useCallback(() => {
    setDisplayed('')
    setDone(false)
  }, [])

  useEffect(() => {
    if (!started) return
    setDisplayed('')
    setDone(false)
    let i = 0
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1))
        if (i % 2 === 0) sounds.typewriter()
        i++
      } else {
        setDone(true)
        clearInterval(interval)
      }
    }, speed)
    return () => clearInterval(interval)
  }, [text, speed, started])

  return { displayed, done, reset }
}
