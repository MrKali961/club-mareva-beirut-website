import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        marquee: 'marquee 35s linear infinite',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-50% - 2rem))' },
        },
      },
      colors: {
        black: {
          DEFAULT: '#0A0A0A',
          900: '#000000',
          800: '#1A1A1A',
        },
        gold: {
          DEFAULT: '#C9A227',
          light: '#D4AF37',
          dark: '#B8941F',
        },
        green: {
          DEFAULT: '#004225',
          light: '#046A38',
          dark: '#003018',
        },
        cream: '#F5F5F0',
      },
      fontFamily: {
        playfair: ['var(--font-playfair)', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;
