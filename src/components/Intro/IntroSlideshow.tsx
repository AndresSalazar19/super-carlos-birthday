'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { sounds } from '@/lib/sounds'

const SLIDES = [
  {
    image: null,
    imageEmoji: '☄️',
    imageBg: 'radial-gradient(ellipse at 30% 40%, #00bcd4 0%, #003060 40%, #000820 100%)',
    text: 'Cada cierto tiempo, una estrella especial aparece en los cielos del universo...',
    hasComet: true,
  },
  {
    image: null,
    imageEmoji: '🌟',
    imageBg: 'radial-gradient(ellipse at 50% 30%, #1a237e 0%, #000820 60%)',
    text: 'Era tan grande que llenó los cielos y envió incontables estrellas fugaces cayendo...',
    hasShootingStars: true,
  },
  {
    image: null,
    imageEmoji: '✨',
    imageBg: 'radial-gradient(ellipse at 50% 50%, #ffd54f 0%, #ff8f00 30%, #1a237e 60%, #000820 100%)',
    text: 'Esa fue la noche del Festival de las Estrellas, celebrado para honrar el cometa.',
    hasMoon: true,
  },
  {
    image: null,
    imageEmoji: '🎂',
    imageBg: 'radial-gradient(ellipse at 50% 50%, #4a148c 0%, #1a0a3e 50%, #030014 100%)',
    text: '¡Y este año... ese Festival se celebra en honor a CARLOS!',
    isFinal: true,
  },
]

interface Props {
  onComplete: () => void
}

// Comet SVG animation
function CometScene() {
  return (
    <svg viewBox="0 0 400 220" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="cometGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1"/>
          <stop offset="40%" stopColor="#00e5ff" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#00e5ff" stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="tail" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00e5ff" stopOpacity="0"/>
          <stop offset="100%" stopColor="#00e5ff" stopOpacity="0.6"/>
        </linearGradient>
      </defs>
      {/* Stars grid like Mario Galaxy */}
      {Array.from({length: 24}).map((_, i) => (
        <g key={i} transform={`translate(${220 + (i%6)*28}, ${30 + Math.floor(i/6)*35})`}>
          <line x1="-6" y1="0" x2="6" y2="0" stroke="rgba(200,230,255,0.5)" strokeWidth="1"/>
          <line x1="0" y1="-6" x2="0" y2="6" stroke="rgba(200,230,255,0.5)" strokeWidth="1"/>
          <line x1="-4" y1="-4" x2="4" y2="4" stroke="rgba(200,230,255,0.3)" strokeWidth="0.5"/>
          <line x1="4" y1="-4" x2="-4" y2="4" stroke="rgba(200,230,255,0.3)" strokeWidth="0.5"/>
          <circle cx="0" cy="0" r="2" fill="rgba(200,230,255,0.8)"/>
        </g>
      ))}
      {/* Comet tail */}
      <ellipse cx="160" cy="110" rx="140" ry="8" fill="url(#tail)" opacity="0.7" transform="rotate(-25, 160, 110)"/>
      <ellipse cx="160" cy="110" rx="100" ry="5" fill="url(#tail)" opacity="0.5" transform="rotate(-22, 160, 110)"/>
      {/* Comet head */}
      <circle cx="105" cy="125" r="14" fill="url(#cometGlow)"/>
      <circle cx="105" cy="125" r="6" fill="white"/>
      {/* Sparkles around comet */}
      {[[-20,-15],[20,-20],[30,5],[10,20],[-10,25]].map(([dx,dy],i) => (
        <circle key={i} cx={105+dx} cy={125+dy} r="1.5" fill="#00e5ff" opacity="0.6"/>
      ))}
    </svg>
  )
}

// Shooting stars scene
function ShootingStarsScene() {
  const starsData = [
    {x1:20,y1:0,x2:60,y2:80,d:0},
    {x1:80,y1:0,x2:110,y2:90,d:0.2},
    {x1:150,y1:0,x2:175,y2:75,d:0.1},
    {x1:230,y1:0,x2:255,y2:85,d:0.3},
    {x1:310,y1:0,x2:330,y2:70,d:0.15},
    {x1:370,y1:0,x2:390,y2:80,d:0.25},
    {x1:50,y1:10,x2:70,y2:85,d:0.4},
  ]
  return (
    <svg viewBox="0 0 400 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shootGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffd700" stopOpacity="0"/>
          <stop offset="80%" stopColor="#ffd700" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="white" stopOpacity="1"/>
        </linearGradient>
      </defs>
      {/* Blue comet streak */}
      <line x1="60" y1="20" x2="160" y2="60" stroke="#00e5ff" strokeWidth="3" opacity="0.7"/>
      <circle cx="60" cy="20" r="5" fill="#00e5ff" opacity="0.9"/>
      {/* Shooting stars */}
      {starsData.map((s,i) => (
        <g key={i}>
          <line x1={s.x1} y1={s.y1} x2={s.x2-6} y2={s.y2-6} stroke="#ffd700" strokeWidth="2.5" opacity="0.7"
            style={{animation:`shootDown 1.2s ease-in infinite`, animationDelay:`${s.d}s`}}/>
          <polygon points={`${s.x2},${s.y2} ${s.x2-4},${s.y2-8} ${s.x2},${s.y2-3} ${s.x2+4},${s.y2-8}`}
            fill="white" opacity="0.9"/>
        </g>
      ))}
      {/* Ground silhouette */}
      <rect x="0" y="170" width="400" height="30" fill="#1a237e" opacity="0.8"/>
      {/* Two toad silhouettes */}
      <circle cx="175" cy="162" r="12" fill="#8B0000" opacity="0.9"/>
      <circle cx="175" cy="152" r="9" fill="#c62828" opacity="0.9"/>
      <circle cx="190" cy="162" r="12" fill="#8B0000" opacity="0.9"/>
      <circle cx="190" cy="152" r="9" fill="#c62828" opacity="0.9"/>
      {/* Grass */}
      <rect x="0" y="168" width="400" height="4" fill="#2e7d32" opacity="0.7"/>
    </svg>
  )
}

// Moon scene
function MoonScene() {
  return (
    <svg viewBox="0 0 400 220" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff"/>
          <stop offset="40%" stopColor="#fff9c4"/>
          <stop offset="70%" stopColor="#ffd54f" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="#ff8f00" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="moonSurf" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fffde7"/>
          <stop offset="100%" stopColor="#fff9c4"/>
        </radialGradient>
      </defs>
      {/* Stars */}
      {Array.from({length:8}).map((_,i) => (
        <circle key={i} cx={30+i*45} cy={20+((i*37)%60)} r="1.5" fill="rgba(255,255,255,0.6)"/>
      ))}
      {/* Blue comet in corner */}
      <line x1="0" y1="30" x2="80" y2="70" stroke="#00bcd4" strokeWidth="4" opacity="0.8"/>
      <circle cx="0" cy="30" r="8" fill="#00e5ff" opacity="0.9"/>
      {/* Moon glow */}
      <circle cx="200" cy="110" r="90" fill="url(#moonGlow)"/>
      {/* Moon surface */}
      <circle cx="200" cy="110" r="58" fill="url(#moonSurf)"/>
      {/* Ground dark */}
      <rect x="0" y="195" width="400" height="25" fill="#0d0d30" opacity="0.9"/>
      <rect x="0" y="193" width="400" height="4" fill="#1a237e" opacity="0.7"/>
    </svg>
  )
}

// Final slide
function FinalScene() {
  return (
    <svg viewBox="0 0 400 220" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="galaxyGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7c4dff" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="transparent"/>
        </radialGradient>
      </defs>
      <circle cx="200" cy="110" r="150" fill="url(#galaxyGlow)"/>
      {/* Stars scattered */}
      {Array.from({length:30}).map((_,i) => (
        <circle key={i} cx={(i*137+20)%380} cy={(i*97+10)%200} r={i%3===0?2:1} fill="white" opacity={0.4+((i%3)*0.2)}/>
      ))}
      {/* Big star */}
      <polygon points="200,60 210,90 240,90 218,108 226,138 200,122 174,138 182,108 160,90 190,90"
        fill="#ffd54f" opacity="0.9"/>
      <polygon points="200,70 208,92 228,92 213,105 219,127 200,115 181,127 187,105 172,92 192,92"
        fill="#fff9c4"/>
      <circle cx="200" cy="100" r="10" fill="white"/>
      {/* Lumas */}
      {[[80,80],[320,70],[100,150],[300,155],[200,180]].map(([x,y],i) => (
        <polygon key={i} points={`${x},${y-8} ${x+3},${y-2} ${x+9},${y-2} ${x+4},${y+2} ${x+6},${y+8} ${x},${y+4} ${x-6},${y+8} ${x-4},${y+2} ${x-9},${y-2} ${x-3},${y-2}`}
          fill={['#fde68a','#f9a8d4','#93c5fd','#86efac','#fde68a'][i]} opacity="0.8"/>
      ))}
    </svg>
  )
}

export default function IntroSlideshow({ onComplete }: Props) {
  const [slide, setSlide] = useState(0)
  const [textIndex, setTextIndex] = useState(0)
  const [textDone, setTextDone] = useState(false)
  const [visible, setVisible] = useState(false)
  const [transitioning, setTransitioning] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const typeRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const currentSlide = SLIDES[slide]
  const currentText = currentSlide.text

  // Start visible after mount
  useEffect(() => {
    setTimeout(() => setVisible(true), 100)
  }, [])

  // Typewriter per slide
  useEffect(() => {
    setTextIndex(0)
    setTextDone(false)
    if (typeRef.current) clearInterval(typeRef.current)

    typeRef.current = setInterval(() => {
      setTextIndex(prev => {
        if (prev >= currentText.length - 1) {
          clearInterval(typeRef.current!)
          setTextDone(true)
          return prev
        }
        sounds.typewriter()
        return prev + 1
      })
    }, 38)

    return () => { if (typeRef.current) clearInterval(typeRef.current) }
  }, [slide, currentText])

  const advance = useCallback(() => {
    if (!textDone) {
      // Skip to end
      if (typeRef.current) clearInterval(typeRef.current)
      setTextIndex(currentText.length - 1)
      setTextDone(true)
      return
    }
    sounds.menuSelect()
    if (slide < SLIDES.length - 1) {
      setTransitioning(true)
      setTimeout(() => {
        setSlide(s => s + 1)
        setTransitioning(false)
      }, 400)
    } else {
      // Done — fade out and call onComplete
      setTransitioning(true)
      setTimeout(() => onComplete(), 600)
    }
  }, [textDone, slide, currentText.length, onComplete])

  // Keyboard / tap support
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') advance()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [advance])

  const renderScene = () => {
    switch(slide) {
      case 0: return <CometScene />
      case 1: return <ShootingStarsScene />
      case 2: return <MoonScene />
      case 3: return <FinalScene />
      default: return null
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: '#e8e0c8',
        opacity: transitioning ? 0 : visible ? 1 : 0,
        transition: 'opacity 0.4s ease',
        cursor: 'pointer',
      }}
      onClick={advance}
    >
      <div className="w-full max-w-2xl mx-auto px-4 flex flex-col items-center justify-center min-h-screen">

        {/* Image panel — exact Mario Galaxy style: dark rounded watercolor border */}
        <div
          className="relative w-full mb-8"
          style={{
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: 'inset 0 0 0 6px #2a3a5c, 0 4px 20px rgba(0,0,0,0.3)',
            aspectRatio: '16/9',
            maxHeight: '40vh',
          }}
        >
          {/* Watercolor dark vignette border like MG */}
          <div className="absolute inset-0" style={{
            background: currentSlide.imageBg,
            zIndex: 0,
          }}/>
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(ellipse at center, transparent 50%, rgba(15,20,50,0.7) 100%)',
            zIndex: 2,
            pointerEvents: 'none',
          }}/>
          {/* Rough edge overlay like watercolor */}
          <div className="absolute inset-0" style={{
            boxShadow: 'inset 0 0 25px rgba(15,25,60,0.8)',
            zIndex: 3,
            pointerEvents: 'none',
            borderRadius: '12px',
          }}/>

          {/* Scene content */}
          <div className="absolute inset-0 flex items-center justify-center z-1" style={{zIndex:1}}>
            {renderScene()}
          </div>
        </div>

        {/* Text area — exact MG cream background with dark rounded text */}
        <div className="w-full text-left" style={{ minHeight: '120px' }}>
          <p style={{
            fontFamily: "'Chewy', 'Fredoka One', 'Arial Rounded MT Bold', sans-serif",
            fontSize: 'clamp(16px, 3.5vw, 22px)',
            color: '#1a1a2e',
            lineHeight: 1.55,
            fontWeight: '600',
            letterSpacing: '0.01em',
          }}>
            {currentText.slice(0, textIndex + 1)}
            {!textDone && (
              <span style={{
                display: 'inline-block',
                width: '2px',
                height: '1.1em',
                background: '#1a1a2e',
                verticalAlign: 'text-bottom',
                marginLeft: '2px',
                animation: 'blink 0.7s step-end infinite',
              }}/>
            )}
          </p>
        </div>

        {/* A button — bottom right, only when text done */}
        <div
          className="w-full flex justify-end mt-4"
          style={{
            opacity: textDone ? 1 : 0.2,
            transition: 'opacity 0.3s',
          }}
        >
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #9e9e9e, #616161)',
            border: '3px solid #424242',
            boxShadow: '2px 2px 0 #212121',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Press Start 2P', cursive",
            fontSize: '13px',
            color: 'white',
            fontWeight: 'bold',
            animation: textDone ? 'blink 1.2s ease-in-out infinite' : 'none',
          }}>
            A
          </div>
        </div>

        {/* Slide dots */}
        <div className="flex gap-2 mt-4">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === slide ? '20px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: i === slide ? '#1a1a2e' : 'rgba(26,26,46,0.3)',
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>

        {/* Skip hint */}
        <p style={{
          fontFamily: 'sans-serif',
          fontSize: '11px',
          color: 'rgba(26,26,46,0.35)',
          marginTop: '12px',
        }}>
          toca o presiona A para continuar
        </p>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes shootDown {
          0% { opacity: 0; transform: translateY(-10px); }
          30% { opacity: 1; }
          100% { opacity: 0.6; transform: translateY(0px); }
        }
      `}</style>
    </div>
  )
}