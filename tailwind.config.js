/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          primary: 'var(--theme-primary)',
          'primary-hover': 'var(--theme-primary-hover)',
          'primary-light': 'var(--theme-primary-light)',
          'primary-subtle': 'var(--theme-primary-subtle)',
          'primary-border': 'var(--theme-primary-border)',
          'text-accent': 'var(--theme-text-accent)',
          ring: 'var(--theme-ring)',
          background: 'var(--theme-background)',
          surface: 'var(--theme-surface)',
          border: 'var(--theme-border)',
          'sidebar-active': 'var(--theme-sidebar-active)',
        },
        health: {
          50: '#F0F7FF',
          100: '#E0EFFE',
          200: '#BAE0FD',
          300: '#7DC4FA',
          400: '#38A4F4',
          500: '#0E87E3',
          600: '#026BC1',
          700: '#03559E',
          800: '#074881',
          900: '#0C3D6C',
          950: '#082748',
        },
        navy: {
          50: '#F4F6F9',
          100: '#E8ECF2',
          200: '#D2DBE6',
          300: '#AEC1D5',
          400: '#839FBF',
          500: '#6181AA',
          600: '#4B678E',
          700: '#3D5373',
          800: '#2A3A51',
          900: '#1B2737',
          950: '#0F1722',
        },
        gov: {
          gold: '#C59B27',
          saffron: '#FF9933',
          green: '#138808',
          navy: '#000080',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card': '0 1px 3px 0 rgba(15, 23, 42, 0.08), 0 1px 2px -1px rgba(15, 23, 42, 0.08)',
        'elevated': '0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.06)',
        'dropdown': '0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -4px rgba(15, 23, 42, 0.1)',
      }
    },
  },
  plugins: [],
}
