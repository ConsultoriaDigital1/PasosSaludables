import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Verde yerba: la marca de Pasos Saludables.
        brand: {
          50: '#f3f8eb',
          100: '#e7f2d6',
          200: '#d3e8b3',
          300: '#b8d986',
          400: '#a0cd60',
          500: '#8dc63f',
          600: '#71a52c',
          700: '#578124',
          800: '#466721',
          900: '#173b2d'
        },
        // Paleta "marca" que usa el diseño portado de la storefront (Farmacia
        // del Barrio). La alineamos al verde yerba de Pasos Saludables para que
        // el layout adopte nuestra identidad.
        marca: {
          50: '#f3f8eb',
          100: '#e7f2d6',
          200: '#d3e8b3',
          300: '#b8d986',
          400: '#a0cd60',
          500: '#8dc63f',
          600: '#71a52c',
          700: '#578124',
          800: '#466721',
          900: '#173b2d'
        },
        // Acento cálido para badges y detalles del diseño portado.
        acento: {
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c'
        },
        forest: {
          DEFAULT: '#173b2d',
          dark: '#0f2a1d',
          light: '#21503c'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', ...defaultTheme.fontFamily.sans],
        serif: ['Fraunces', 'Georgia', ...defaultTheme.fontFamily.serif]
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.06)',
        cardHover:
          '0 10px 25px rgba(20, 83, 45, 0.12), 0 4px 10px rgba(20, 83, 45, 0.08)',
        soft: '0 4px 24px rgba(20, 83, 45, 0.08)'
      },
      keyframes: {
        floatY: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' }
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }
        }
      },
      animation: {
        floatY: 'floatY 4s ease-in-out infinite',
        marquee: 'marquee 30s linear infinite'
      }
    },
  },
  plugins: [],
}
