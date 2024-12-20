// @ts-check
const { fontFamily } = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');
const { default: flattenColorPalette } = require("tailwindcss/lib/util/flattenColorPalette");

/** @type {import("tailwindcss/types").Config } */
module.exports = {
    content: [
        './node_modules/pliny/**/*.js',
        './app/**/*.{js,ts,jsx,tsx}',
        './pages/**/*.{js,ts,tsx}',
        './components/**/*.{js,ts,tsx}',
        './layouts/**/*.{js,ts,tsx}',
        './data/**/*.mdx',
    ],
    darkMode: 'class',
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px',
            },
        },
        extend: {
            screens: {
                'bento-sm': '374px',
                xs: '475px',
                'bento-md': '799px',
                'bento-lg': '1199px',
            },
            lineHeight: {
                11: '2.75rem',
                12: '3rem',
                13: '3.25rem',
                14: '3.5rem',
            },
            fontFamily: {
                sans: ['var(--font-space-jetbrains-mono)', ...fontFamily.mono],
            },
            colors: {
                'custom-beige': '#E9D3B6',
                gray: colors.gray,
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                primary: {
                    DEFAULT: '#000000', // Black
                    400: '#000000',
                    500: '#000000',
                    600: '#000000',
                    foreground: '#FFFFFF', // White
                },
                secondary: {
                    DEFAULT: '#1A1A1A', // Dark Gray
                    foreground: '#FFFFFF', // White
                },
                tertiary: {
                    DEFAULT: '#333333', // Medium Gray
                    foreground: '#FFFFFF', // White
                },
                destructive: {
                    DEFAULT: '#FF0000', // Red
                    foreground: '#FFFFFF', // White
                },
                muted: {
                    DEFAULT: '#555555', // Light Gray
                    foreground: '#FFFFFF', // White
                },
                accent: {
                    DEFAULT: '#FFD700', // Gold
                    foreground: '#000000', // Black
                },
                popover: {
                    DEFAULT: '#222222', // Very Dark Gray
                    foreground: '#FFFFFF', // White
                },
                card: {
                    DEFAULT: '#111111', // Almost Black
                    foreground: '#FFFFFF', // White
                },
            },
            borderRadius: {
                lg: `var(--radius)`,
                md: `calc(var(--radius) - 2px)`,
                sm: 'calc(var(--radius) - 4px)',
            },
            keyframes: {
                'accordion-down': {
                    from: { height: 0 },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: 0 },
                },
                shimmer: {
                    '0%, 90%, 100%': {
                        'background-position': 'calc(-100% - var(--shimmer-width)) 0',
                    },
                    '30%, 60%': {
                        'background-position': 'calc(100% + var(--shimmer-width)) 0',
                    },
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                skeleton: 'skeleton 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                shimmer: 'shimmer 8s infinite',
            },
            typography: ({ theme }) => ({
                DEFAULT: {
                    css: {
                        a: {
                            color: theme('colors.primary.DEFAULT'),
                            '&:hover': {
                                filter: 'brightness(1.10)',
                            },
                            code: { color: theme('colors.primary.DEFAULT') },
                        },
                        p: {
                            fontSize: '14px',
                        },
                        'h1,h2': {
                            fontWeight: '700',
                            letterSpacing: theme('letterSpacing.tight'),
                        },
                        h3: {
                            fontWeight: '600',
                        },
                        pre: {
                            fontSize: '14px !important',
                        },
                        code: {
                            color: theme('colors.primary.DEFAULT'),
                            fontSize: 'inherit',
                            fontWeight: '400',
                            backgroundColor: theme('colors.primary.foreground'),
                            borderWidth: '1px',
                            borderColor: theme('colors.border'),
                            fontFamily: 'inherit',
                            borderRadius: '0.25rem',
                            padding: '0.25rem 0.5rem',
                        },
                        'code::before': {
                            display: 'none',
                        },
                        'code::after': {
                            display: 'none',
                        },
                        img: {
                            display: 'block',
                            borderRadius: '0.5rem',
                            borderWidth: '1px',
                            borderColor: theme('colors.border'),
                            margin: '1.5rem auto !important',
                        },
                        blockquote: {
                            color: theme('colors.muted.foreground'),
                            quotes: 'none',
                            fontStyle: 'normal',
                            borderLeftColor: theme('colors.border'),
                        },
                        hr: {
                            borderColor: theme('colors.border'),
                        },
                        tr: {
                            borderColor: theme('colors.border'),
                        },
                        thead: {
                            borderColor: theme('colors.border'),
                        },
                        'li::marker': {
                            color: theme('colors.muted.foreground'),
                        },
                    },
                },
                invert: {
                    css: {
                        a: {
                            color: theme('colors.primary.DEFAULT'),
                            '&:hover': {
                                filter: 'brightness(1.10)',
                            },
                            code: { color: theme('colors.primary.DEFAULT') },
                        },
                        p: {
                            fontSize: '14px',
                        },
                        'h1,h2,h3,h4,h5,h6': {
                            color: theme('colors.gray.100'),
                        },
                    },
                },
            }),
        },
    },
    plugins: [
        addVariablesForColors,
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
        require('tailwindcss-animate'),
    ],
}

function addVariablesForColors({ addBase, theme }) {
    let allColors = flattenColorPalette(theme("colors"));
    let newVars = Object.fromEntries(
      Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
    );

    addBase({
      ":root": newVars,
    });
}
