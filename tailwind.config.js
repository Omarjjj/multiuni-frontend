/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	colors: {
  		// Enhanced warm color palette
  		primary: {
  			50: '#fdfbf8',
  			100: '#f8f2e6',
  			200: '#f0e1c1',
  			300: '#e5ca8e',
  			400: '#d4b270',
  			500: '#B08D57', // Original primary
  			600: '#9a7a4a',
  			700: '#7d633c',
  			800: '#644f30',
  			900: '#4d3e26',
  			950: '#2d241a',
  		},
  		accent: {
  			50: '#f7f9fb',
  			100: '#eef3f7',
  			200: '#d8e6ed',
  			300: '#b6d1de',
  			400: '#8eb7ca',
  			500: '#2dd4bf', // Original accent
  			600: '#29c2a9',
  			700: '#26b09a',
  			800: '#239e8b',
  			900: '#208c7c',
  		},
  		surface: '#ffffff0d',
  		stroke: '#ffffff29',
  		card: '#ffffff',
  		white: '#ffffff',
  		black: '#000000',
  		transparent: 'transparent',
  		// Enhanced gray scale with warmer tones
  		gray: {
  			'50': '#fdfbf8',
  			'100': '#f7f3ef',
  			'200': '#ede5dc',
  			'300': '#ddd0c0',
  			'400': '#c4b299',
  			'500': '#a89375',
  			'600': '#8a7659',
  			'700': '#6d5e47',
  			'800': '#574b39',
  			'900': '#3d342b',
  			'950': '#211d18'
  		},
  		// New warm gradients
  		warm: {
  			'light': '#fdfbf8',
  			'medium': '#f8f2e6',
  			'dark': '#e5ca8e',
  			'darker': '#B08D57',
  		},
  		// Glass morphism colors
  		glass: {
  			'light': 'rgba(253, 251, 248, 0.25)',
  			'medium': 'rgba(248, 242, 230, 0.4)',
  			'dark': 'rgba(176, 141, 87, 0.15)',
  		}
  	},
  	extend: {
  		fontFamily: {
  			display: [
  				'Poppins"',
  				'sans-serif'
  			],
  			body: [
  				'Inter"',
  				'sans-serif'
  			],
  			arabic: [
  				'Tajawal',
  				'sans-serif'
  			]
  		},
  		fontSize: {
  			'xxs': '0.625rem',
  			'3xl': '1.875rem',
  			'4xl': '2.25rem',
  			'5xl': '3rem',
  			'6xl': '3.75rem',
  			'7xl': '4.5rem',
  		},
  		borderRadius: {
  			'4xl': '2rem',
  			'5xl': '2.5rem',
  			xl: '1rem',
  			'2xl': '1.5rem',
  			pill: '9999px',
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		boxShadow: {
  			'soft': '0 2px 15px rgba(176, 141, 87, 0.1)',
  			'medium': '0 4px 25px rgba(176, 141, 87, 0.15)',
  			'strong': '0 8px 35px rgba(176, 141, 87, 0.2)',
  			'glow': '0 0 25px rgba(45, 212, 191, 0.4)',
  			'glow-warm': '0 0 30px rgba(176, 141, 87, 0.3)',
  			'inner-soft': 'inset 0 2px 8px rgba(176, 141, 87, 0.1)',
  			'glass': '0 8px 32px rgba(31, 38, 135, 0.37)',
  			card: '0 8px 30px rgba(0,0,0,0.12)',
  			glow: '0 0 15px #2dd4bf55'
  		},
  		backdropBlur: {
  			xs: '2px',
  			sm: '4px',
  			'3xl': '64px',
  		},
  		backdropFilter: {
  			'none': 'none',
  			'blur': 'blur(20px)',
  		},
  		animation: {
  			'spin-slow': 'spin 3s linear infinite',
  			'pulse-soft': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  			'bounce-soft': 'bounce 2s infinite',
  			'fade-in': 'fadeIn 0.5s ease-in-out',
  			'slide-up': 'slideUp 0.5s ease-out',
  			'scale-in': 'scaleIn 0.3s ease-out',
  			'glow': 'glow 2s ease-in-out infinite alternate',
  		},
  		keyframes: {
  			fadeIn: {
  				'0%': { opacity: '0' },
  				'100%': { opacity: '1' },
  			},
  			slideUp: {
  				'0%': { transform: 'translateY(20px)', opacity: '0' },
  				'100%': { transform: 'translateY(0)', opacity: '1' },
  			},
  			scaleIn: {
  				'0%': { transform: 'scale(0.95)', opacity: '0' },
  				'100%': { transform: 'scale(1)', opacity: '1' },
  			},
  			glow: {
  				'0%': { boxShadow: '0 0 20px rgba(176, 141, 87, 0.2)' },
  				'100%': { boxShadow: '0 0 30px rgba(176, 141, 87, 0.4)' },
  			},
  		},
  		gradientColorStops: {
  			'warm-light': '#fdfbf8',
  			'warm-medium': '#f8f2e6',
  			'warm-dark': '#e5ca8e',
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} 