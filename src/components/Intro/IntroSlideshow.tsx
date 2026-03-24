'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { sounds } from '@/lib/sounds'

// 1. Configuración de slides con tus rutas
const SLIDES = [
  {
    image: '/images/slides/slide1.png', 
    imageEmoji: '☄️',
    imageBg: '#000820', 
    text: 'Cada cierto tiempo, una estrella especial aparece en los cielos del universo...',
  },
  {
    image: '/images/slides/slide2.png',
    imageEmoji: '🌟',
    imageBg: '#000820',
    text: 'Era tan grande que llenó los cielos y envió incontables estrellas fugaces cayendo...',
  },
  {
    image: '/images/slides/slide3.png',
    imageEmoji: '✨',
    imageBg: '#000820',
    text: 'Esa fue la noche del Festival de las Estrellas, celebrado para honrar el cometa.',
  },
  {
    image: '/images/slides/slide4.png',
    imageEmoji: '🎂',
    imageBg: '#030014',
    text: '¡Y este año... ese Festival se celebra en honor a CARLOS!',
  },
]

// Constantes para la sincronización y transición
const TYPING_INTERVAL_MS = 38 // Velocidad de escritura
const MAX_EXPANSION_SCALE = 1.15 // Crece un 15% al final
const TRANSITION_DURATION_MS = 800 // Tiempo de fundido a amarillo

interface Props {
  onComplete: () => void
}

export default function IntroSlideshow({ onComplete }: Props) {
  const [slide, setSlide] = useState(0)
  const [textIndex, setTextIndex] = useState(0)
  const [textDone, setTextDone] = useState(false)
  
  // 👇 1. CAMBIO: Cambia useState(false) por useState(true)
  const [visible, setVisible] = useState(true) 
  
  const [transitioning, setTransitioning] = useState(false)
  const typeRef = useRef<ReturnType<typeof setInterval> | null>(null)
  
  const imageRef = useRef<HTMLImageElement>(null)

  const currentSlide = SLIDES[slide]
  const currentText = currentSlide.text

  // Bloqueo de Scroll al montar/desmontar
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    // 👇 2. CAMBIO: Borra la línea del setTimeout. 
    // Ya no necesitamos esperar para hacerlo visible.

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [])

  // Lógica principal: Escritura + Sincronización de expansión de imagen + Solución de reinicio
  useEffect(() => {
    // Reset base de estados
    setTextIndex(0)
    setTextDone(false)
    if (typeRef.current) clearInterval(typeRef.current)

    // Sincronización de la imagen
    if (imageRef.current) {
      // 1. Quitamos la transición y reseteamos el tamaño al instante
      imageRef.current.style.transition = 'none'
      imageRef.current.style.transform = 'scale(1.0)'

      // 2. EL TRUCO (Re-flow forzado): Forzamos al navegador a aplicar el reset inmediatamente
      void imageRef.current.offsetHeight

      // 3. Calculamos la duración y aplicamos la nueva transición lineal
      const totalDurationMs = currentText.length * TYPING_INTERVAL_MS
      imageRef.current.style.transition = `transform ${totalDurationMs}ms linear`
      imageRef.current.style.transform = `scale(${MAX_EXPANSION_SCALE})`
    }

    // Lógica de máquina de escribir
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
    }, TYPING_INTERVAL_MS)

    return () => { if (typeRef.current) clearInterval(typeRef.current) }
  }, [slide, currentText])

  // 2. CARACTERÍSTICA: Transición Intermedia (Fade a amarillo)
  const advance = useCallback(() => {
    if (!textDone) {
      // Saltar texto: Si el usuario pulsa antes de que acabe, la expansión se completa instantáneamente
      if (typeRef.current) clearInterval(typeRef.current)
      
      // Aseguramos que la imagen llegue a su escala final inmediatamente al saltar
      if (imageRef.current) {
        imageRef.current.style.transition = 'none'
        imageRef.current.style.transform = `scale(${MAX_EXPANSION_SCALE})`
      }
      
      setTextIndex(currentText.length - 1)
      setTextDone(true)
      return
    }
    sounds.menuSelect()

    // Lógica de transición intermedia: Fundido suave a amarillo
    if (slide < SLIDES.length - 1) {
      setTransitioning(true) // Desvanecer contenido (imagen y texto)
      
      // Esperar a que el fundido termine
      setTimeout(() => {
        setSlide(s => s + 1) // Cambiar al siguiente slide (imagen y texto nuevos)
        setTransitioning(false) // Aparecer el nuevo contenido
      }, TRANSITION_DURATION_MS)

    } else {
      // Final — fade out total de la pantalla entera
      // Usamos el estado 'visible' para el fade out total final
      setVisible(false)
      setTimeout(() => onComplete(), 600)
    }
  }, [textDone, slide, currentText.length, onComplete])

  // Soporte de teclado/A tap
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') advance()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [advance])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: '#e8e0c8', // Fondo crema claro (MG style)
        // Controlamos la opacidad total solo al montar y al FINAL
        opacity: visible ? 1 : 0,
        transition: `opacity ${visible ? '0.4s' : '0.6s'} ease`,
        cursor: 'pointer',
      }}
      onClick={advance}
    >
      {/* Contenedor del contenido (Imagen y Texto). 
         Aquí aplicamos la transición intermedia (Fade a amarillo).
      */}
      <div 
        className="w-full max-w-2xl mx-auto px-4 flex flex-col items-center justify-center min-h-screen"
        style={{
          // Controlamos la opacidad del contenido durante la transición intermedia
          opacity: transitioning ? 0 : 1,
          transition: `opacity ${TRANSITION_DURATION_MS / 1000}s ease`,
        }}
      >

        {/* Panel de Imagen — Estilo Mario Galaxy: borde oscuro rústico redondeado */}
        <div
          className="relative w-full mb-8"
          style={{
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: 'inset 0 0 0 6px #2a3a5c, 0 4px 20px rgba(0,0,0,0.3)',
            aspectRatio: '16/9',
            maxHeight: '40vh',
            backgroundColor: currentSlide.imageBg,
          }}
        >
          {/* Aquí renderizamos la imagen con la ref, key y estilos base */}
          {currentSlide.image && (
            <img 
              key={slide} // <- Clave de slide para reinicio total
              ref={imageRef} 
              src={currentSlide.image} 
              alt={`Slide ${slide + 1}`}
              className="absolute inset-0 w-full h-full object-cover z-0"
              style={{
                transform: 'scale(1.0)', // Estado inicial por defecto
                transformOrigin: 'center center', // Expansión centrada
              }}
            />
          )}

          {/* Viñeteado oscuro radial (MG style) */}
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(ellipse at center, transparent 50%, rgba(15,20,50,0.7) 100%)',
            zIndex: 2,
            pointerEvents: 'none',
          }}/>
          {/* Superposición de borde rústico (tipo acuarela) */}
          <div className="absolute inset-0" style={{
            boxShadow: 'inset 0 0 25px rgba(15,25,60,0.8)',
            zIndex: 3,
            pointerEvents: 'none',
            borderRadius: '12px',
          }}/>
        </div>

        {/* Área de texto — Estilo MG: fondo crema con texto oscuro redondeado */}
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

        {/* Botón A — abajo a la derecha, solo cuando el texto termina */}
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
            // El botón también se desvanece durante la transición intermedia
            animation: textDone && !transitioning ? 'blink 1.2s ease-in-out infinite' : 'none',
          }}>
            A
          </div>
        </div>

        {/* Puntos indicadores de slide */}
        <div className="flex gap-2 mt-4">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === slide ? '20px' : '8px',
                height: '8px',
                borderRadius: '4px',
                // Los puntos también se desvanecen durante la transición intermedia
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
          // El texto de pista también se desvanece durante la transición intermedia
        }}>
          toca o presiona A para continuar
        </p>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}