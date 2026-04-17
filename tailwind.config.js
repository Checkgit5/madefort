/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        body: ['Manrope', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 50px rgba(255, 143, 171, 0.35)',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-140%)' },
          '100%': { transform: 'translateX(140%)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2.8s linear infinite',
      },
    },
  },
  plugins: [],
}
