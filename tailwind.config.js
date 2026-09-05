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
        clinical: {
          canvas: '#F8FAFC',
          card: '#FFFFFF',
          subtle: '#F1F5F9',
          border: '#E2E8F0',
          'border-subtle': '#F1F5F9',
          'border-strong': '#CBD5E1',
          text: '#0F172A',
          'text-secondary': '#475569',
          'text-muted': '#64748B',
          // Calibrated clinical status tokens
          optimal: '#047857',
          'optimal-bg': '#ECFDF5',
          'optimal-border': '#A7F3D0',
          warning: '#92400E',
          'warning-bg': '#FFFBEB',
          'warning-border': '#FDE68A',
          critical: '#BE123C',
          'critical-bg': '#FFF1F2',
          'critical-border': '#FECDD3',
          info: '#1D4ED8',
          'info-bg': '#EFF6FF',
          'info-border': '#BFDBFE',
          neutral: '#475569',
          'neutral-bg': '#F8FAFC',
          'neutral-border': '#E2E8F0',
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
      // Authoritative SwasthyaSync Border-Radius System
      borderRadius: {
        none: '0px',
        xs: '2px',
        sm: '4px',
        DEFAULT: '6px',
        md: '6px',      // 6px for inputs, buttons, and compact controls
        lg: '8px',      // 8px for data widgets and action surfaces
        xl: '12px',     // 12px for major cards, modals, and dialog panels
        '2xl': '12px',  // mapped to 12px to eliminate oversized bubble shapes
        '3xl': '12px',  // mapped to 12px
        full: '9999px', // compact status indicators, badges, and pill tags only
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
      fontSize: {
        'display-2xl': ['2rem', { lineHeight: '2.5rem', letterSpacing: '-0.025em', fontWeight: '700' }], // 32px
        'display-xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.02em', fontWeight: '700' }],    // 24px
        'title-lg': ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.015em', fontWeight: '600' }], // 20px
        'title-md': ['1.125rem', { lineHeight: '1.625rem', letterSpacing: '-0.01em', fontWeight: '600' }],// 18px
        'body-md': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '400' }],                            // 14px
        'caption-sm': ['0.75rem', { lineHeight: '1rem', fontWeight: '500' }],                             // 12px
        'micro': ['0.6875rem', { lineHeight: '0.875rem', fontWeight: '600' }],                            // 11px
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(15, 23, 42, 0.04)',
        'card': '0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.04)',
        'elevated': '0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.04)',
        'dropdown': '0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04)',
        'modal': '0 20px 25px -5px rgba(15, 23, 42, 0.10), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
      }
    },
  },
  plugins: [],
}
