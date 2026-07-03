/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#C8102E',
          dark: '#9E0B24',
          light: '#E63950',
        },
        neutral: {
          bg: '#F5F5F5',
          text: '#4A4A4A',
          ink: '#1A1A1A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        '7xl': '80rem',
      },
    },
  },
  plugins: [],
};
