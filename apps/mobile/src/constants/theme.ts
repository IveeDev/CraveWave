// constants/theme.ts

export const colors = {
  primary: {
    DEFAULT: "#FF5A36",
    dark: "#E04523",
    light: "#FFE0ED",
  },

  slate: {
    900: "#0F172A",
  },

  semantic: {
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
  },

  white: "#FFFFFF",

  text: {
    primary: "#0F172A",
    secondary: "#64748B",
    muted: "#94A3B8",
  },

  border: {
    DEFAULT: "#DCE4EF",
  },

  background: {
    DEFAULT: "#FFFFFF",
    subtle: "#F8FAFC",
  },
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 9999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
} as const;
