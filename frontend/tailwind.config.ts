import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          950: '#040d0a',
          900: '#0a1f18',
          800: '#0d2b21',
          700: '#134e3a',
          600: '#1a6b4f',
          500: '#22896a',
        },
        kelp: {
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
        },
        bio: {
          cyan: '#00ffd5',
          green: '#00e5a0',
          glow: '#00ffb3',
        },
        coral: {
          400: '#ff8a80',
          500: '#ff6b6b',
        },
        sand: {
          400: '#c4a962',
          500: '#b8972e',
        },
      },
      fontFamily: {
        display: ['Fredoka', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'kelp-sway': 'kelpSway 4s ease-in-out infinite',
        'kelp-sway-slow': 'kelpSway 6s ease-in-out infinite',
        'kelp-sway-fast': 'kelpSway 3s ease-in-out infinite',
        'bubble-rise': 'bubbleRise 8s linear infinite',
        'bubble-rise-slow': 'bubbleRise 12s linear infinite',
        'bubble-rise-fast': 'bubbleRise 5s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'counter-tick': 'counterTick 0.3s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        kelpSway: {
          '0%, 100%': { transform: 'rotate(-3deg) translateX(-2px)' },
          '50%': { transform: 'rotate(3deg) translateX(2px)' },
        },
        bubbleRise: {
          '0%': { transform: 'translateY(100vh) scale(0.5)', opacity: '0' },
          '10%': { opacity: '0.6' },
          '90%': { opacity: '0.3' },
          '100%': { transform: 'translateY(-10vh) scale(1.2)', opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.4', filter: 'blur(20px)' },
          '50%': { opacity: '0.8', filter: 'blur(30px)' },
        },
        counterTick: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'ocean-gradient': 'linear-gradient(180deg, #040d0a 0%, #0a1f18 30%, #0d2b21 60%, #134e3a 100%)',
        'glow-radial': 'radial-gradient(circle, rgba(0,255,213,0.15) 0%, transparent 70%)',
      },
    },
  },
  plugins: [],
};

export default config;
