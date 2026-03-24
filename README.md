# 🌟 Super Carlos Birthday — Web Galáctica

Una página web interactiva estilo **Super Mario Galaxy** para el cumpleaños de Carlos.

---

## 🚀 Setup Rápido

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar Supabase (para RSVP en tiempo real)

1. Crear cuenta gratis en [supabase.com](https://supabase.com)
2. Crear nuevo proyecto
3. En el **SQL Editor**, ejecutar:

```sql
create table rsvps (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  confirmed_at timestamp default now(),
  message text,
  bringing_swimsuit boolean default false
);

-- Habilitar realtime
alter publication supabase_realtime add table rsvps;
```

4. Copiar `.env.local.example` a `.env.local` y poner tus keys:

```bash
cp .env.local.example .env.local
```

Edita `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

### 3. Agregar imagen de Carlos

Pon la imagen del poster en:
```
public/images/carlos-hero.png
```

Luego en `src/components/Hero/HeroSection.tsx`, reemplaza el placeholder con:
```tsx
<Image src="/images/carlos-hero.png" alt="Carlos" fill className="object-contain" />
```

### 4. Correr en desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

---

## 🎮 Features

| Feature | Descripción |
|---------|-------------|
| 🌌 **Hero con Parallax** | Estrellas que se mueven con el cursor |
| ⏱ **Countdown HUD** | Cuenta regresiva estilo Mario |
| 💬 **Dialog Box** | Texto letra por letra estilo videojuego |
| 🗺️ **Mapa del Observatorio** | Navegación tipo hub de Mario Galaxy |
| 🌍 **Planetas Interactivos** | Click para ver detalles de la fiesta |
| ⭐ **Mini-juego** | Atrapa 3 estrellas para desbloquear RSVP |
| 📝 **RSVP en Tiempo Real** | Confirmaciones via Supabase Realtime |
| ★ **Counter de Estrellas** | Contador en vivo de invitados |
| 📸 **Galería** | Para fotos del evento (post-fiesta) |
| 📥 **Share Card** | Genera imagen personalizada para compartir |
| 🔊 **Sonidos** | SFX estilo Mario (Web Audio API) |

---

## 📁 Estructura

```
src/
├── app/              ← Layout y página principal
├── components/
│   ├── Hero/         ← Sección principal con parallax
│   ├── Countdown/    ← HUD countdown
│   ├── DialogBubble/ ← Cuadros de diálogo estilo juego
│   ├── Observatory/  ← Mapa de navegación
│   ├── Planets/      ← Planetas clicables
│   ├── MiniGame/     ← Atrapa estrellas
│   ├── PowerStars/   ← RSVP + Counter
│   ├── Gallery/      ← Galería de fotos
│   ├── ShareCard/    ← Generador de imagen
│   └── UI/           ← Componentes reutilizables
├── hooks/            ← useTypewriter, useCountdown, useParallax
├── lib/              ← Supabase, sounds
└── constants/        ← Datos del evento
```

---

## 🎨 Personalización

Edita `src/constants/event.ts` para cambiar fecha, lugar, etc.

---

## 🚢 Deploy

```bash
npm run build
```

Recomendado: **Vercel** (1 click deploy, gratis)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

---

**Made with ★ & Next.js** — ¡Feliz Cumpleaños Carlos! 🎂
