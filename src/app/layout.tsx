import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Super Carlos Birthday ★',
  description: 'A Galactic Celebration Awaits — 29 de marzo de 2026',
  openGraph: {
    title: 'Super Carlos Birthday ★',
    description: 'Una celebración galáctica te espera el 29 de marzo',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
      </head>
      <body className="nebula-bg min-h-screen">{children}</body>
    </html>
  )
}
