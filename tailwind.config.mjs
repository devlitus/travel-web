/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        // Uxintace Palette
        primary: {
          50: '#E8EEF3',
          100: '#D1DDE7',
          200: '#A3BBCF',
          300: '#7599B7',
          400: '#4777A0',
          500: '#2E4156',
          600: '#1F2D3A',
          700: '#1A2D42',
          800: '#0F1A28',
          900: '#050810',
        },
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D4D8DD',
          400: '#C0C8CA',
          500: '#AAB7B7',
          600: '#8B9898',
          700: '#6B7A7A',
          800: '#4B5C5C',
          900: '#2B3E3E',
        },
        accent: {
          light: '#C0C8CA',
          medium: '#AAB7B7',
          dark: '#2E4156',
        }
      },
    },
  },
  plugins: [],
}
