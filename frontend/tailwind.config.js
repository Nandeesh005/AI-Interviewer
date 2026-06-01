/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#6c63ff', light: '#8b83ff', dark: '#4a42d4' },
        accent: { DEFAULT: '#00d4ff', light: '#33ddff', dark: '#00a8cc' },
        neon: { green: '#00ff88', pink: '#ff6b9d', orange: '#ffaa00' },
        dark: { 900: '#0a0a1a', 800: '#111133', 700: '#1a1a44', 600: '#252555' },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        glow: { '0%': { boxShadow: '0 0 5px #6c63ff, 0 0 10px #6c63ff' }, '100%': { boxShadow: '0 0 20px #6c63ff, 0 0 40px #00d4ff' } },
        float: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-20px)' } },
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
};
