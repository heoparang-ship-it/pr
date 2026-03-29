import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
        foreground: "#ededed",
        card: "#141414",
        "card-foreground": "#ededed",
        primary: "#6366f1",
        "primary-foreground": "#ffffff",
        muted: "#1a1a1a",
        "muted-foreground": "#a1a1aa",
        border: "#27272a",
        accent: "#6366f1",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Pretendard", "sans-serif"],
      },
    },
  },
  plugins: [],
}
export default config
