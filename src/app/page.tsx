'use client'
import { useState, useEffect } from 'react'
import IntroSlideshow from '@/components/Intro/IntroSlideshow'
import ParallaxStars from '@/components/Hero/ParallaxStars'
import HeroPoster from '@/components/Hero/HeroPoster'
import HUDCountdown from '@/components/Countdown/HUDCountdown'
import EventDetails from '@/components/DialogBubble/EventDetails'
import RSVPSection from '@/components/PowerStars/RSVPSection'
import SoundManager from '@/components/UI/SoundManager'
import AudioManager from '@/components/UI/AudioManager'
import MusicMuteButton from '@/components/UI/MusicMuteButton'

function Divider() {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'8px 24px' }}>
      <div style={{ flex:1, height:'1px', background:'linear-gradient(90deg, transparent, rgba(250,204,21,0.25), transparent)' }}/>
      <span style={{ margin:'0 12px', fontFamily:"'Press Start 2P', cursive", fontSize:'7px', color:'rgba(250,204,21,0.4)' }}>★</span>
      <div style={{ flex:1, height:'1px', background:'linear-gradient(90deg, transparent, rgba(250,204,21,0.25), transparent)' }}/>
    </div>
  )
}

export default function Home() {
  const [started, setStarted] = useState(false) 
  const [introComplete, setIntroComplete] = useState(false)
  const [mainVisible, setMainVisible] = useState(false)
  const [musicMuted, setMusicMuted] = useState(false)

  // 👇 NUEVO: Estado para controlar si la música está pausada por la pantalla de victoria
  const [victoryMute, setVictoryMute] = useState(false)

  // 👇 NUEVO: Escuchador de eventos (pausa la música al abrir el póster y la reanuda al cerrar)
  useEffect(() => {
    const handleVictoryStart = () => setVictoryMute(true)
    const handleVictoryEnd = () => setVictoryMute(false)

    window.addEventListener('victory-start', handleVictoryStart)
    window.addEventListener('victory-end', handleVictoryEnd)

    return () => {
      window.removeEventListener('victory-start', handleVictoryStart)
      window.removeEventListener('victory-end', handleVictoryEnd)
    }
  }, [])

  const handleIntroComplete = () => {
    setIntroComplete(true)
    setTimeout(() => setMainVisible(true), 100)
  }

  return (
    <main>
      {/* PANTALLA DE INICIO (Desaparece al hacer clic) */}
      {!started && (
        <div 
          onClick={() => setStarted(true)}
          className="fixed inset-0 z-[100] flex items-center justify-center cursor-pointer bg-[#000820]"
        >
          <div className="text-center animate-pulse">
            <p style={{ fontFamily:"'Press Start 2P', cursive", fontSize: '12px', color: '#facc15' }}>
              TOCA LA PANTALLA PARA EMPEZAR
            </p>
          </div>
        </div>
      )}

      {/* Todo tu contenido real solo se carga DESPUÉS del primer clic */}
      {started && (
        <>
          {/* 👇 ACTUALIZADO: La música se silencia si el usuario le dio al botón de mute, O si está en la pantalla de victoria */}
          <AudioManager 
            phase={introComplete ? 'main' : 'intro'} 
            musicMuted={musicMuted || victoryMute} 
          />
          <SoundManager />
          <MusicMuteButton musicMuted={musicMuted} onToggle={setMusicMuted} />

          {!introComplete && <IntroSlideshow onComplete={handleIntroComplete} />}

          <div style={{
            opacity: mainVisible ? 1 : 0,
            transition: 'opacity 0.8s ease',
            visibility: mainVisible ? 'visible' : 'hidden',
          }}>
            <ParallaxStars />
            <HeroPoster />
            <Divider />
            <HUDCountdown />
            <Divider />
            <EventDetails />
            <Divider />
            <RSVPSection />
            <Divider />

            <footer className="relative z-10 py-16 px-4 text-center">
              <div style={{
                fontFamily:"'Press Start 2P', cursive",
                fontSize:'clamp(14px, 3.5vw, 26px)',
                color:'#facc15',
                textShadow:'0 0 25px rgba(250,204,21,0.7)',
                animation:'floatAnimation 2s ease-in-out infinite',
                lineHeight: 1.7,
              }}>
                ★ FELIZ CUMPLEAÑOS<br/>CARLITOS ★
              </div>
              <p style={{ fontFamily:"'Press Start 2P', cursive", fontSize:'clamp(8px, 2vw, 12px)', color:'rgba(255,255,255,0.35)', marginTop:'16px' }}>
                29 · 03 · 2026
              </p>
              <div style={{ marginTop:'24px', fontSize:'clamp(20px,5vw,32px)' }}>
                🎂 ⭐ 🌌 ⭐ 🎂
              </div>
              <p style={{ fontFamily:"'Press Start 2P', cursive", fontSize:'7px', color:'rgba(255,255,255,0.15)', marginTop:'20px' }}>
              </p>
            </footer>
          </div>
        </>
      )}
    </main>
  )
}