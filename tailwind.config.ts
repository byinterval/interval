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
        // Your Specific Brand Palette
        'primary-bg': '#F8F6F2',   // Unbleached Paper (Primary)
        'secondary-bg': '#E6E1DB', // Warm Grey (Secondary)
        'accent-brown': '#5D514C', // Brown (Logo/Titles/Accents)
        'brand-ink': '#201F1E',    // Soft Black (Body Font)
      },
      fontFamily: {
        'serif-title': ['var(--font-serif)', 'serif'],
        'sans-body': ['var(--font-sans)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;