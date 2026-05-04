/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Reddit orange brand (dark-mode optimized ramp).
        // Higher numbers = brighter (works well as accent text on dark surfaces).
        brand: {
          50: '#2a1610',
          100: '#3a1f15',
          200: '#5a2c1c',
          300: '#aa4929',
          400: '#d65f30',
          500: '#ff4500', // Reddit orange
          600: '#ff4500',
          700: '#ff6e40', // bright accent text on dark callouts
          800: '#ff8c61',
          900: '#ffb491',
        },
        // Inverted slate ramp for night mode.
        // 50  = darkest (page bg), 900 = brightest (primary text).
        slate: {
          50: '#0b1014',
          100: '#181c1f', // card surface — Reddit night card color
          200: '#232729', // border faint / chip bg
          300: '#343a3d', // border strong
          400: '#4d5256', // very subtle
          500: '#6b7075', // muted text
          600: '#9ea4ab', // secondary text
          700: '#b8bdc1', // body text
          800: '#cdd1d3', // strong text
          900: '#e7e9ea', // primary text (Reddit night text color)
        },
      },
      boxShadow: {
        card: '0 1px 0 rgba(0, 0, 0, 0.4), 0 1px 2px rgba(0, 0, 0, 0.6)',
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
