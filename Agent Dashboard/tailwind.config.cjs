/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        panel: "0 0 0 1px rgba(148,163,184,0.10) inset, 0 10px 30px rgba(0,0,0,0.35)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        destructive: "hsl(var(--destructive))",
        "destructive-foreground": "hsl(var(--destructive-foreground))",
        warning: "hsl(var(--warning))",
        "warning-foreground": "hsl(var(--warning-foreground))",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
