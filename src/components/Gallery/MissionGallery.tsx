'use client'
import { useState } from 'react'
import { sounds } from '@/lib/sounds'

type Photo = {
  id: number
  src: string
  caption: string
  mission: string
  stars: number
}

const PLACEHOLDER_PHOTOS: Photo[] = [
  { id: 1, src: '', caption: 'Foto 1', mission: 'MISIÓN: Prefiesta', stars: 3 },
  { id: 2, src: '', caption: 'Foto 2', mission: 'MISIÓN: Parrillada', stars: 3 },
  { id: 3, src: '', caption: 'Foto 3', mission: 'MISIÓN: Piscina', stars: 3 },
  { id: 4, src: '', caption: 'Foto 4', mission: 'MISIÓN: Pastel', stars: 3 },
  { id: 5, src: '', caption: 'Foto 5', mission: 'MISIÓN: Celebración', stars: 3 },
  { id: 6, src: '', caption: 'Foto 6', mission: 'MISIÓN: Afterparty', stars: 3 },
]

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-1 justify-center">
      {Array.from({ length: 3 }).map((_, i) => (
        <span
          key={i}
          style={{
            fontSize: '14px',
            filter: i < count ? 'drop-shadow(0 0 4px rgba(250,204,21,0.8))' : 'grayscale(1) opacity(0.3)',
          }}
        >
          ★
        </span>
      ))}
    </div>
  )
}

export default function MissionGallery() {
  const [selected, setSelected] = useState<Photo | null>(null)

  const openPhoto = (photo: Photo) => {
    sounds.dialogOpen()
    setSelected(photo)
  }

  return (
    <section className="relative z-10 py-16 px-4" id="galeria">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '9px', color: '#facc15', letterSpacing: '0.2em' }}>
            ✦ ÁLBUM GALÁCTICO ✦
          </p>
          <h2 className="text-white mt-2" style={{ fontFamily: "'Press Start 2P', cursive", fontSize: 'clamp(12px, 3vw, 18px)' }}>
            MISIONES COMPLETADAS
          </h2>
          <p className="mt-3 text-white/40" style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '8px' }}>
            Agrega tus fotos en /public/images/gallery/
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {PLACEHOLDER_PHOTOS.map(photo => (
            <div
              key={photo.id}
              className="cursor-pointer group transition-all duration-300 hover:scale-105"
              onClick={() => openPhoto(photo)}
              onMouseEnter={() => sounds.menuSelect()}
            >
              <div
                className="relative rounded-xl overflow-hidden"
                style={{
                  paddingBottom: '100%',
                  background: 'rgba(0,0,0,0.5)',
                  border: '2px solid rgba(250,204,21,0.2)',
                  boxShadow: '0 0 0 transparent',
                  transition: 'all 0.3s',
                }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  {/* Lock icon for "future photos" */}
                  <div style={{ fontSize: '40px', marginBottom: '8px' }}>📷</div>
                  <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '7px', color: 'rgba(255,255,255,0.4)', textAlign: 'center', lineHeight: '1.8' }}>
                    {photo.mission}
                  </p>
                  <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '6px', color: 'rgba(255,255,255,0.2)', marginTop: '4px' }}>
                    PRÓXIMAMENTE
                  </p>
                </div>

                {/* Hover overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                  style={{ background: 'rgba(250,204,21,0.1)', backdropFilter: 'blur(2px)' }}
                >
                  <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '8px', color: '#facc15' }}>
                    VER ▶
                  </span>
                </div>
              </div>

              {/* Caption */}
              <div className="mt-2 text-center">
                <StarRating count={photo.stars} />
                <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '7px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
                  {photo.mission.replace('MISIÓN: ', '')}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Photo modal */}
        {selected && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(8px)' }}
            onClick={() => { sounds.menuBack(); setSelected(null) }}
          >
            <div
              className="dialog-box max-w-sm w-full p-6 text-center"
              onClick={e => e.stopPropagation()}
              style={{ animation: 'dialogAppear 0.3s ease-out' }}
            >
              <div className="text-5xl mb-4">📷</div>
              <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '10px', color: '#1a1a2e' }}>
                {selected.mission}
              </p>
              <StarRating count={selected.stars} />
              <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '8px', color: '#666', marginTop: '8px' }}>
                ¡Foto próximamente!
              </p>
              <button
                className="star-btn mt-6 px-6 py-2"
                style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '9px' }}
                onClick={() => { sounds.menuBack(); setSelected(null) }}
              >
                ← VOLVER
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
