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
          DEFAULT: '#C6B158',
          light: '#DCCC8E',
          dark: '#9C8A3D',
        },
        green: {
          DEFAULT: '#27533e',
          light: '#3a7a58',
          dark: '#1c3d2d',
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
