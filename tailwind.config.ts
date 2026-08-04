import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/mdx-components.tsx',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-bungee)', 'sans-serif'],
        body: ['var(--font-dm-sans)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      colors: {
        cork: {
          50: '#fdf8ed',
          100: '#f9edcf',
          200: '#f2d89e',
          300: '#e9be63',
          400: '#e2a838',
          500: '#d4921f',
          600: '#b87218',
          700: '#925316',
          800: '#784219',
          900: '#65371b',
        },
        paper: {
          white: '#ffffff',
          manila: '#f5e6c8',
          cream: '#fef7e8',
          red: '#dc2626',
          blue: '#2563eb',
          green: '#16a34a',
          yellow: '#eab308',
          orange: '#ea580c',
          purple: '#7c3aed',
          pink: '#ec4899',
          teal: '#0891b2',
        },
        charcoal: '#1e293b',
        pencil: '#64748b',
        tacker: {
          red: '#b91c1c',
          blue: '#1d4ed8',
          green: '#15803d',
          yellow: '#ca8a04',
        },
      },
      borderRadius: {
        'card': '0.625rem',
      },
      boxShadow: {
        'pin': '2px 3px 8px rgba(0,0,0,0.18), 0 1px 3px rgba(0,0,0,0.12)',
        'card': '1px 2px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)',
        'card-hover': '3px 6px 16px rgba(0,0,0,0.14), 0 2px 6px rgba(0,0,0,0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-left': 'slideInLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pop-in': 'popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'spin-slow': 'spin 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
}
export default config
