import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'mario-yellow': '#facc15',
        'mario-red': '#ef4444',
        'mario-blue': '#3b82f6',
        'mario-green': '#22c55e',
        'space-dark': '#030014',
        'space-purple': '#1a0a3e',
        'space-mid': '#0d1a3a',
        'luma-gold': '#fde68a',
        'luma-pink': '#f9a8d4',
        'luma-blue': '#93c5fd',
      },
      fontFamily: {
        mario: ['"Press Start 2P"', 'cursive'],
        game: ['"Press Start 2P"', 'cursive'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'float-slow': 'float 5s ease-in-out infinite',
        'twinkle': 'twinkle 2s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'bounce-slow': 'bounce 2s ease-in-out infinite',
        'star-collect': 'starCollect 0.5s ease-out forwards',
        'dialog-appear': 'dialogAppear 0.3s ease-out forwards',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'orbit': 'orbit 15s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(2deg)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.3', transform: 'scale(0.8)' },
        },
        starCollect: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.5)', opacity: '0.8' },
          '100%': { transform: 'scale(0) translateY(-50px)', opacity: '0' },
        },
        dialogAppear: {
          '0%': { transform: 'scaleY(0)', opacity: '0' },
          '100%': { transform: 'scaleY(1)', opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(250,204,21,0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(250,204,21,0.9), 0 0 80px rgba(250,204,21,0.4)' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(120px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(120px) rotate(-360deg)' },
        },
      },
      backgroundImage: {
        'space-gradient': 'radial-gradient(ellipse at top, #1a0a3e 0%, #030014 50%, #0d1a3a 100%)',
        'star-field': 'radial-gradient(2px 2px at 20px 30px, #fff, transparent), radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent)',
      },
    },
  },
  plugins: [],
}
export default config
