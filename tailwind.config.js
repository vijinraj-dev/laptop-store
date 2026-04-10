/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        body:    ['"DM Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#f0f4ff',
          100: '#e0e9ff',
          500: '#3d63dd',
          600: '#2f52c8',
          700: '#2441a8',
          900: '#162578',
        },
        surface: {
          50:  '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          800: '#18181b',
          900: '#09090b',
        },
      },
      animation: {
        'fade-in':    'fadeIn 0.3s ease both',
        'slide-up':   'slideUp 0.35s ease both',
        'slide-down': 'slideDown 0.3s ease both',
      },
      keyframes: {
        fadeIn:    { from: { opacity: 0 },                 to: { opacity: 1 } },
        slideUp:   { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'none' } },
        slideDown: { from: { opacity: 0, transform: 'translateY(-8px)' }, to: { opacity: 1, transform: 'none' } },
      },
    },
  },
  plugins: [],
};
