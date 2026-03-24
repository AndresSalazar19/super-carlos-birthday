'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom' // 👈 AÑADE ESTA LÍNEA
import { supabase } from '@/lib/supabase'
import { sounds } from '@/lib/sounds'
import { EVENT } from '@/constants/event'
import html2canvas from 'html2canvas' // 👈 NUEVA IMPORTACIÓN

// ── Mini game ──────────────────────────────────────────────────────────────
type StarObj = { id: number; x: number; y: number; vy: number; color: string; size: number; caught: boolean }
const STAR_COLORS = ['#fde68a','#f9a8d4','#93c5fd','#a78bfa','#86efac']
let uid = 0

function MiniGame({ onDone }: { onDone: () => void }) {
  const [stars, setStars] = useState<StarObj[]>([])
  const [caught, setCaught] = useState(0)
  const NEEDED = 3
  const rafRef = useRef<number>(0)
  const lastSpawn = useRef(0)

  const spawn = (): StarObj => ({
    id: uid++,
    x: 10 + Math.random() * 80,
    y: -8,
    vy: 0.25 + Math.random() * 0.35,
    color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
    size: 28 + Math.random() * 18,
    caught: false,
  })

  useEffect(() => {
    let prev = 0
    const tick = (t: number) => {
      if (t - lastSpawn.current > 1100) {
        lastSpawn.current = t
        setStars(s => [...s.filter(x => x.y < 115 && !x.caught), spawn()])
      }
      setStars(s => s.map(x => x.caught ? x : { ...x, y: x.y + x.vy }))
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const catchStar = (id: number) => {
    sounds.starCollect()
    setStars(s => s.map(x => x.id === id ? { ...x, caught: true } : x))
    setCaught(n => {
      const next = n + 1
      if (next >= NEEDED) { sounds.powerStar(); setTimeout(onDone, 500) }
      return next
    })
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-3 px-1">
        <div className="hud-box py-2 px-4">
          <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '11px', color: '#facc15' }}>
            ★ {caught}/{NEEDED}
          </span>
        </div>
        <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '8px', color: 'rgba(255,255,255,0.4)' }}>
          ¡TOCA LAS ESTRELLAS!
        </span>
      </div>

      <div style={{
        position: 'relative', height: '260px', overflow: 'hidden',
        borderRadius: '16px', background: 'rgba(0,0,0,0.45)',
        border: '2px solid rgba(250,204,21,0.2)', cursor: 'crosshair',
      }}>
        {/* Bg dots */}
        {Array.from({length:25}).map((_,i) => (
          <div key={i} style={{
            position:'absolute', borderRadius:'50%',
            left:`${(i*41+5)%95}%`, top:`${(i*59+5)%90}%`,
            width:`${1+(i%2)}px`, height:`${1+(i%2)}px`,
            background:'rgba(255,255,255,0.25)',
            animation:`twinkleAnimation ${1.5+(i%3)}s ease-in-out infinite`,
            animationDelay:`${(i*0.18)%3}s`,
          }}/>
        ))}
        {/* Stars */}
        {stars.filter(s => !s.caught && s.y < 110).map(s => (
          <button key={s.id} onClick={() => catchStar(s.id)} style={{
            position:'absolute', left:`${s.x}%`, top:`${s.y}%`,
            transform:'translate(-50%,-50%)', background:'none', border:'none', cursor:'pointer', padding:0, zIndex:10,
          }}>
            <svg width={s.size} height={s.size} viewBox="0 0 40 40" style={{ filter:`drop-shadow(0 0 8px ${s.color})`, animation:'twinkleAnimation 0.9s ease-in-out infinite' }}>
              <polygon points="20,2 24,14 38,14 27,22 31,36 20,28 9,36 13,22 2,14 16,14" fill={s.color} stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
              <circle cx="20" cy="17" r="4" fill="rgba(255,255,255,0.65)"/>
            </svg>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── RSVP Form ──────────────────────────────────────────────────────────────
// ── RSVP Form ──────────────────────────────────────────────────────────────
function RSVPForm() {
  const [name, setName] = useState('')
  const [swimsuit, setSwimsuit] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const [done, setDone] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [error, setError] = useState('')

  // 👇 NUEVOS ESTADOS PARA COMPARTIR
  const cardRef = useRef<HTMLDivElement>(null)
  const [isSharing, setIsSharing] = useState(false)

  useEffect(() => {
    if (showCelebration) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [showCelebration])

  const inputStyle: React.CSSProperties = {
    fontFamily: "'Press Start 2P', cursive", fontSize: '10px',
    background: 'rgba(255,255,255,0.95)', border: '3px solid #1a1a2e',
    borderRadius: '8px', padding: '10px 12px', width: '100%', color: '#1a1a2e', outline: 'none',
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true); setError('')
    try {
      const { error: err } = await supabase.from('rsvps').insert({ name: name.trim(), bringing_swimsuit: swimsuit })
      if (err) throw err
      
      setDone(true)
      setShowCelebration(true)
      
      window.dispatchEvent(new Event('victory-start'))
      
      const winSound = new Audio('/sounds/win.mp3')
      winSound.volume = 0.8
      winSound.play().catch(e => console.log('Error:', e))

    } catch { 
      setError('Error al guardar. Intenta de nuevo.'); 
      sounds.menuBack() 
    }
    finally { setLoading(false) }
  }

  const handleCloseCelebration = () => {
    setShowCelebration(false)
    window.dispatchEvent(new Event('victory-end'))
  }

  // 👇 LA MAGIA PARA COMPARTIR EN WHATSAPP
  const handleShare = async () => {
    if (!cardRef.current) return;
    setIsSharing(true);
    sounds.menuSelect(); // Sonidito al presionar
    
    try {
      // 1. Tomamos la "foto" del elemento
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#000820', // Fondo galáctico
        scale: 2, // Alta calidad
        useCORS: true, // Importante para las imágenes
      });

      // 2. Convertimos a archivo
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `Pase_VIP_${name.trim()}.png`, { type: 'image/png' });
        
        // 3. Preparamos el mensaje de WhatsApp
        const shareData = {
          title: '¡Voy al Super Carlos Birthday!',
          files: [file]
        };

        // 4. Intentamos abrir el menú nativo del celular (Web Share API)
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share(shareData);
        } else {
          // 5. Fallback para PC: Descargamos la imagen automáticamente
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `Pase_VIP_${name.trim()}.png`;
          a.click();
          alert('¡Pase VIP descargado! 🎟️ Ahora puedes enviarlo por WhatsApp a tus amigos.');
        }
        setIsSharing(false);
      });
    } catch (err) {
      console.error('Error al generar la imagen', err);
      setIsSharing(false);
    }
  }

  if (done) return (
    <>
      <div className="dialog-box p-6 text-center" style={{ animation: 'dialogAppear 0.3s ease-out' }}>
        <div style={{ fontFamily:"'Press Start 2P', cursive", fontSize:'clamp(14px,3.5vw,22px)', color:'#22c55e', textShadow:'0 0 20px rgba(34,197,94,0.8)', animation:'floatAnimation 1s ease-in-out infinite', marginBottom:'10px' }}>
          ★ CONFIRMADO ★
        </div>
        <p style={{ fontFamily:"'Press Start 2P', cursive", fontSize:'10px', color:'#1a1a2e', lineHeight:2 }}>
          ¡{name} se une a la<br/>galaxia de Carlos! 🎉
        </p>
      </div>

      {showCelebration && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm"
          style={{ animation: 'fadeInPoster 0.8s ease-out forwards' }}
        >
          <div className="absolute inset-0 opacity-40" style={{ background: 'radial-gradient(ellipse at center, transparent 0%, #000 100%), url("/images/slides/slide1.png") center/cover' }} />

          <div 
            className="relative flex flex-col items-center z-10 w-full px-4"
            style={{ animation: 'starPop 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards' }}
          >
            {/* 👇 ESTA ES LA "TARJETA" QUE SE VA A CAPTURAR Y ENVIAR 👇 */}
            <div 
              ref={cardRef} 
              className="relative flex flex-col items-center bg-[#000820] p-4 rounded-xl border-4 border-[#facc15] shadow-[0_0_40px_rgba(250,204,21,0.6)]"
            >
              <img
                src="/images/poster.png"
                alt="Póster"
                className="relative z-10 w-auto h-auto max-w-full max-h-[50vh] object-contain rounded-lg border-2 border-[#1a1a2e]"
              />
              
              {/* Etiqueta VIP personalizada con el nombre */}
              <div className="mt-4 bg-[#1a1a2e] border-2 border-[#22c55e] px-4 py-3 rounded-lg w-full text-center shadow-[0_0_15px_rgba(34,197,94,0.4)]">
                <p style={{ fontFamily: "'Press Start 2P', cursive", color: '#22c55e', fontSize: '10px', lineHeight: 1.5 }}>
                  PASE VIP:<br/><span className="text-[#facc15] text-xs mt-2 inline-block">{name.toUpperCase()}</span>
                </p>
              </div>
            </div>

            <h3 
              className="relative z-10 mt-6 text-center animate-pulse"
              style={{ fontFamily: "'Press Start 2P', cursive", color: '#facc15', fontSize: 'clamp(14px, 5vw, 22px)', textShadow: '0 0 10px rgba(250,204,21,0.8)' }}
            >
              ¡Invitación Desbloqueada!
            </h3>

            {/* 👇 BOTONES DE ACCIÓN (Estos no salen en la foto) 👇 */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <button 
                onClick={handleShare}
                disabled={isSharing}
                className="relative z-10 px-6 py-4 bg-[#25D366] text-white border-2 border-[#128C7E] rounded-full hover:scale-110 transition-all shadow-[0_4px_20px_rgba(37,211,102,0.4)] flex items-center gap-2"
                style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '10px' }}
              >
                {isSharing ? 'GENERANDO...' : '📱 COMPARTIR'}
              </button>

              <button 
                onClick={handleCloseCelebration}
                className="relative z-10 px-6 py-4 bg-[#1a1a2e] text-[#facc15] border-2 border-[#facc15] rounded-full hover:scale-110 hover:bg-[#facc15] hover:text-[#1a1a2e] transition-all shadow-[0_4px_20px_rgba(250,204,21,0.3)]"
                style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '10px' }}
              >
                CERRAR
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      <style>{`
        @keyframes fadeInPoster {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes starPop {
          0% { transform: scale(0.2) translateY(50px); opacity: 0; }
          60% { transform: scale(1.05) translateY(-10px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
      `}</style>
    </>
  )

  return (
    <div className="dialog-box p-6 relative">
      <div style={{
        position:'absolute', top:'-16px', left:'16px',
        fontFamily:"'Press Start 2P', cursive", fontSize:'9px',
        background:'#22c55e', color:'#fff',
        padding:'3px 10px', borderRadius:'6px',
        border:'2px solid #1a1a2e', boxShadow:'2px 2px 0 #1a1a2e',
      }}>
        CONFIRMAR ASISTENCIA
      </div>
      <form onSubmit={submit} style={{ paddingTop:'12px', display:'flex', flexDirection:'column', gap:'14px' }}>
        <div>
          <label style={{ fontFamily:"'Press Start 2P', cursive", fontSize:'8px', color:'#1a1a2e', display:'block', marginBottom:'6px' }}>TU NOMBRE:</label>
          <input style={inputStyle} value={name} onChange={e=>setName(e.target.value)} placeholder="Jugador 1..." required onFocus={()=>sounds.menuSelect()}/>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <input type="checkbox" id="swim" checked={swimsuit} onChange={e=>{setSwimsuit(e.target.checked);sounds.menuSelect()}} style={{ width:'20px', height:'20px', cursor:'pointer' }}/>
          <label htmlFor="swim" style={{ fontFamily:"'Press Start 2P', cursive", fontSize:'8px', color:'#1a1a2e', cursor:'pointer', lineHeight:1.6 }}>
            🩱 Llevaré traje de baño
          </label>
        </div>
        {error && <p style={{ fontFamily:"'Press Start 2P', cursive", fontSize:'8px', color:'#ef4444' }}>{error}</p>}
        <button type="submit" disabled={loading || !name.trim()} className="star-btn py-3 w-full disabled:opacity-50" style={{ fontFamily:"'Press Start 2P', cursive", fontSize:'10px' }}>
          {loading ? 'GUARDANDO...' : '★ CONFIRMAR ★'}
        </button>
      </form>
      <div className="a-button" style={{ position:'absolute', bottom:'10px', right:'10px' }}>A</div>
    </div>
  )
}

// ── Star counter strip ─────────────────────────────────────────────────────
function StarCounter() {
  const [count, setCount] = useState<number|null>(null)
  const [swimCount, setSwimCount] = useState(0)

  useEffect(() => {
    supabase.from('rsvps').select('id, bringing_swimsuit').then(({ data }) => {
      if (data) { setCount(data.length); setSwimCount(data.filter((r:any)=>r.bringing_swimsuit).length) }
    })
    const ch = supabase.channel('rsvps-rt')
      .on('postgres_changes', { event:'INSERT', schema:'public', table:'rsvps' }, payload => {
        setCount(n => (n ?? 0) + 1)
        if ((payload.new as any).bringing_swimsuit) setSwimCount(n => n + 1)
        sounds.starCollect()
      })
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [])

  const goal = EVENT.totalStarsGoal
  const pct = count !== null ? Math.min(100, (count / goal) * 100) : 0

  return (
    <div className="hud-box mt-6">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px' }}>
        <span style={{ fontFamily:"'Press Start 2P', cursive", fontSize:'8px', color:'rgba(255,255,255,0.5)' }}>INVITADOS CONFIRMADOS</span>
        <span style={{ fontFamily:"'Press Start 2P', cursive", fontSize:'8px', color:'#93c5fd' }}>🩱 {swimCount}</span>
      </div>
      <div style={{ display:'flex', alignItems:'baseline', gap:'8px', marginBottom:'10px' }}>
        <span style={{ fontSize:'28px' }}>⭐</span>
        <span style={{ fontFamily:"'Press Start 2P', cursive", fontSize:'clamp(22px,5vw,32px)', color:'#facc15', textShadow:'0 0 18px rgba(250,204,21,0.8)' }}>
          {count ?? '...'}
        </span>
        <span style={{ fontFamily:"'Press Start 2P', cursive", fontSize:'13px', color:'rgba(255,255,255,0.35)' }}>/ {goal}</span>
      </div>
      <div style={{ height:'16px', borderRadius:'8px', overflow:'hidden', background:'rgba(255,255,255,0.08)', border:'2px solid rgba(250,204,21,0.15)' }}>
        <div style={{
          height:'100%', borderRadius:'8px', transition:'width 1s ease',
          width:`${pct}%`,
          background:'linear-gradient(90deg, #22c55e, #facc15)',
          boxShadow:'0 0 12px rgba(250,204,21,0.5)',
          minWidth: count && count > 0 ? '20px' : '0',
        }}/>
      </div>
    </div>
  )
}

// ── Main export ────────────────────────────────────────────────────────────
export default function RSVPSection() {
  const [phase, setPhase] = useState<'intro'|'game'|'form'>('intro')

  return (
    <section id="rsvp" className="relative z-10 py-14 px-4 scroll-mt-8">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <p style={{ fontFamily:"'Press Start 2P', cursive", fontSize:'9px', color:'#facc15', letterSpacing:'0.2em' }}>✦ CONFIRMA TU ASISTENCIA ✦</p>
          {phase === 'intro' && (
            <h2 className="text-white mt-3" style={{ fontFamily:"'Press Start 2P', cursive", fontSize:'clamp(12px,3vw,18px)' }}>
              RECOLECTA ESTRELLAS
            </h2>
          )}
        </div>

        {phase === 'intro' && (
          <div className="text-center">
            <p style={{ fontFamily:"'Press Start 2P', cursive", fontSize:'9px', color:'rgba(255,255,255,0.5)', marginBottom:'24px', lineHeight:1.8 }}>
              Atrapa 3 estrellas para<br/>desbloquear el RSVP
            </p>
            <button
              className="star-btn px-10 py-4"
              style={{ fontFamily:"'Press Start 2P', cursive", fontSize:'11px' }}
              onClick={() => { sounds.menuSelect(); setPhase('game') }}
            >
              ▶ JUGAR
            </button>
          </div>
        )}

        {phase === 'game' && <MiniGame onDone={() => setPhase('form')} />}

        {phase === 'form' && (
          <div>
            <div className="text-center mb-5 py-3 rounded-xl" style={{ background:'rgba(250,204,21,0.08)', border:'2px solid rgba(250,204,21,0.25)' }}>
              <p style={{ fontFamily:"'Press Start 2P', cursive", fontSize:'10px', color:'#facc15' }}>★ MISIÓN CUMPLIDA ★</p>
              <p style={{ fontFamily:"'Press Start 2P', cursive", fontSize:'8px', color:'white', marginTop:'4px' }}>¡Ahora confirma tu asistencia!</p>
            </div>
            <RSVPForm />
          </div>
        )}

        <StarCounter />
      </div>
    </section>
  )
}