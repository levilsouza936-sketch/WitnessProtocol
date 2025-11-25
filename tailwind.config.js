/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                'neon-red': '#ff003c',
                'blood-red': '#8a0000',
                'void-black': '#050505',
                'off-white': '#f0f0f0',
            },
            fontFamily: {
                mono: ['Courier New', 'Courier', 'monospace'],
                sans: ['Inter', 'sans-serif'],
            },
            animation: {
                'glitch': 'glitch 1s infinite',
                'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                glitch: {
                    '0%, 100%': { transform: 'translate(0)' },
                    '20%': { transform: 'translate(-2px, 2px)' },
                    '40%': { transform: 'translate(-2px, -2px)' },
                    '60%': { transform: 'translate(2px, 2px)' },
                    '80%': { transform: 'translate(2px, -2px)' },
                },
            },
        },
    },
    plugins: [],
}
