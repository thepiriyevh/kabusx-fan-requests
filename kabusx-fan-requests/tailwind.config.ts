import type { Config } from "tailwindcss";
export default { content: ["./app/**/*.{ts,tsx}","./components/**/*.{ts,tsx}"],
theme:{extend:{colors:{primary:"var(--color-primary)",secondary:"var(--color-secondary)",accent:"var(--color-accent)",bg:"var(--color-background)",surface:"var(--color-surface)",ink:"var(--color-text)",muted:"var(--color-muted)",line:"var(--color-border)"},
fontFamily:{display:["var(--font-display)","system-ui","sans-serif"],sans:["system-ui","-apple-system","Segoe UI","sans-serif"]}}},plugins:[]} satisfies Config;
