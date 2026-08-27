export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Adraca.io exact palette
        surface:      "#0B0E14",
        surfaceCard:  "#0f172a",
        surfaceRaised:"#161B22",
        surfaceBorder:"#1e293b",
        accent:       "#3b82f6",   // blue-500
        accentCyan:   "#06b6d4",   // cyan-500
        accentGreen:  "#10b981",   // emerald-500
        accentAmber:  "#f59e0b",   // amber-500
        accentRose:   "#f43f5e",   // rose-500
        accentSky:    "#0ea5e9",   // sky-500
        textPrimary:  "#f8fafc",   // slate-50
        textSecondary:"#e2e8f0",   // slate-200
        textMuted:    "#94a3b8",   // slate-400
        textFaint:    "#475569",   // slate-600
      },
      backgroundImage: {
        "adraca-grid":
          "linear-gradient(to right, #80808012 1px, transparent 1px), linear-gradient(to bottom, #80808012 1px, transparent 1px)",
        "adraca-gradient":
          "linear-gradient(45deg, #3b82f6, #06b6d4)",
        "adraca-gradient-dark":
          "linear-gradient(135deg, #1e3a5f 0%, #0B0E14 60%)",
        "gradient-card":
          "linear-gradient(135deg, rgba(59,130,246,0.06) 0%, rgba(6,182,212,0.03) 100%)",
      },
      animation: {
        "pulse-ring":  "pulseRing 2s cubic-bezier(0.4,0,0.6,1) infinite",
        "shimmer":     "shimmer 2.5s linear infinite",
        "fade-up":     "fadeUp 0.45s ease forwards",
        "glow-border": "glowBorder 3s ease-in-out infinite",
      },
      keyframes: {
        pulseRing: {
          "0%,100%": { opacity: "0.6", transform: "scale(1)" },
          "50%":     { opacity: "1",   transform: "scale(1.04)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glowBorder: {
          "0%,100%": { boxShadow: "0 0 0 rgba(59,130,246,0)" },
          "50%":     { boxShadow: "0 0 22px rgba(59,130,246,0.35)" },
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
