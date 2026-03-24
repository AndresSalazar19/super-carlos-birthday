'use client'
import { sounds } from '@/lib/sounds'

interface Props {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  variant?: 'yellow' | 'red' | 'green' | 'blue'
}

const variants = {
  yellow: 'bg-mario-yellow border-amber-800 shadow-amber-900 text-space-dark hover:bg-amber-300',
  red:    'bg-mario-red border-red-900 shadow-red-900 text-white hover:bg-red-400',
  green:  'bg-mario-green border-green-900 shadow-green-900 text-white hover:bg-green-400',
  blue:   'bg-mario-blue border-blue-900 shadow-blue-900 text-white hover:bg-blue-400',
}

export default function MarioButton({ children, onClick, className = '', variant = 'yellow' }: Props) {
  const handleClick = () => {
    sounds.menuSelect()
    onClick?.()
  }

  return (
    <button
      onClick={handleClick}
      className={`star-btn px-6 py-3 text-xs font-bold tracking-wider transition-all active:translate-y-1 ${variants[variant]} ${className}`}
      style={{ fontFamily: "'Press Start 2P', cursive" }}
    >
      {children}
    </button>
  )
}
