import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-bg': '#F8F6F2',   
        'secondary-bg': '#E6E1DB', 
        'accent-brown': '#5D514C', 
        'brand-ink': '#201F1E',    
      },
      fontFamily: {
        'serif-title': ['var(--font-serif)', 'serif'],
        'sans-body': ['var(--font-sans)', 'sans-serif'],
      },
      // NEW: Add custom animation
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      }
    },
  },
  plugins: [],
};
export default config;