/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-poppins)", "sans-serif"],
      },
      colors: {
        primary: "#1C64F2",
        secondary: "#3B82F6",
        accent: "#9333EA",
        neutral: "#F3F4F6",
        base100: "#FFFFFF",
        info: "#2563EB",
        success: "#16A34A",
        warning: "#FBBF24",
        error: "#DC2626",
      },
    },
  },
  plugins: [],
};