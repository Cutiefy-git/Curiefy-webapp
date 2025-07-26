/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'cutie-pink': '#F8D4DC',
        'cutie-gold': '#D4AF37',
        'cutie-bg': '#ecd0d4',
        'cutie-charcoal': '#2C2C2C',
        'cutie-rose': '#EBA8A8',
        'cutie-peach': '#FAD6C4',
        'cutie-cream': '#FFF8F4',
      },
      fontFamily: {
        'elegant': ['var(--font-great-vibes)', 'var(--font-dancing-script)', 'cursive'],
        'cursive': ['var(--font-great-vibes)', 'cursive'],
        'sans': ['var(--font-dancing-script)', 'var(--font-poppins)', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}