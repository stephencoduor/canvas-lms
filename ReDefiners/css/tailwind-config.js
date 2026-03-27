/**
 * ReDefiners — Tailwind CSS Configuration
 * Modern Dark Accent Theme
 * Loaded after the Tailwind CDN script on all pages.
 */
tailwind.config = {
  prefix: 'tw-',
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        primary: {
          900: '#0F2922',
          800: '#163B32',
          700: '#1E4D42',
          600: '#2A6355',
          400: '#4A8B7A',
          200: '#7CB5A4',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          50: '#F9FAFB',
          100: '#F3F4F6',
          150: '#E8F5F0',
          200: '#E5E7EB',
          250: '#D1D5DB',
          300: '#C4CDD5',
          400: '#9CA3AF',
          500: '#6B7280',
        },
        page: {
          DEFAULT: '#D4EFE6',
          alt: '#C2E6DA',
          light: '#E8F5F0',
        },
        accent: {
          cyan: '#16D2DD',
          blue: '#3B82F6',
          'blue-light': '#DBEAFE',
          purple: '#8B5CF6',
          'purple-light': '#A78BFA',
          'purple-track': '#EDE9FE',
          orange: '#FF6B35',
          'orange-light': '#FFF0EB',
          yellow: '#F5C542',
          'yellow-light': '#FEF3C7',
          green: '#2DB88A',
          'green-light': '#D1FAE5',
          teal: '#2DD4BF',
          red: '#EF4444',
          'red-muted': '#DC2626',
          'gold': '#FBBF24',
        },
      },
      fontFamily: {
        inter: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        poppins: ['Poppins', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'display': ['3.5rem', { lineHeight: '1.1', fontWeight: '800' }],
        'h1': ['28px', { lineHeight: '1.3' }],
        'h2': ['22px', { lineHeight: '1.3' }],
        'h3': ['18px', { lineHeight: '1.4' }],
        'h4': ['16px', { lineHeight: '1.4' }],
        'body-lg': ['16px', { lineHeight: '1.6' }],
        'body': ['14px', { lineHeight: '1.6' }],
        'body-sm': ['13px', { lineHeight: '1.5' }],
        'caption': ['12px', { lineHeight: '1.4' }],
        'caption-sm': ['11px', { lineHeight: '1.4' }],
        'overline': ['10px', { lineHeight: '1.3' }],
      },
      borderRadius: {
        'token-xs': '4px',
        'token-sm': '8px',
        'token-md': '12px',
        'token-lg': '16px',
        'token-xl': '20px',
        'token-2xl': '28px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0,0,0,0.06)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.10)',
        'elevated': '0 12px 32px rgba(0,0,0,0.12)',
        'glow-green': '0 4px 20px rgba(45,184,138,0.25)',
        'glow-orange': '0 4px 15px rgba(255,107,53,0.3)',
        'glow-blue': '0 4px 15px rgba(59,130,246,0.25)',
        'glow-purple': '0 4px 15px rgba(139,92,246,0.3)',
        'sidebar-active': '0 4px 20px rgba(45,184,138,0.3)',
        'inner-soft': 'inset 0 1px 2px rgba(0,0,0,0.06)',
        /* shadcn-inspired */
        'shadcn-xs': '0 1px 2px 0 rgba(0,0,0,0.05)',
        'shadcn-sm': '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)',
        'shadcn-md': '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',
        'shadcn-lg': '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
        'shadcn-xl': '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
        'ring-focus': '0 0 0 2px #FFFFFF, 0 0 0 4px #2DB88A',
      },
      spacing: {
        'sidebar': '240px',
        'topbar': '64px',
        '18': '4.5rem',
        '88': '22rem',
      },
      screens: {
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      animation: {
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-in-up': 'slideInUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'pulse-green': 'pulseGreen 2s ease-in-out infinite',
      },
      keyframes: {
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideInUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseGreen: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(0,196,140,0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(0,196,140,0)' },
        },
      },
    },
  },
};
