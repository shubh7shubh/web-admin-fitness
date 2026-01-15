export const COLORS = {
  // Light theme colors
  light: {
    primary: "#00E676",
    secondary: "#00BCD4",
    accent: "#FF6D00",
    background: "#FAFBFC",
    surface: "#FFFFFF",
    surfaceElevated: "#FFFFFF",
    border: "#E1E8ED",
    text: {
      primary: "#0F172A",
      secondary: "#475569",
      muted: "#94A3B8",
      inverse: "#FFFFFF",
    },
    status: {
      success: "#00E676",
      warning: "#FF9800",
      error: "#F44336",
      info: "#2196F3",
    },
  },
  // Dark theme colors
  dark: {
    primary: "#00FF87",
    secondary: "#00E5FF",
    accent: "#FF6D00",
    background: "#0A0A0B",
    surface: "#141517",
    surfaceElevated: "#1E1F23",
    border: "#2A2D31",
    text: {
      primary: "#FFFFFF",
      secondary: "#E0E0E0",
      muted: "#9E9E9E",
      inverse: "#0A0A0B",
    },
    status: {
      success: "#00FF87",
      warning: "#FFB300",
      error: "#FF5252",
      info: "#40C4FF",
    },
  },
} as const;

export const FITNESS_COLORS = {
  calories: "#FF5722",
  protein: "#2196F3",
  carbs: "#FF9800",
  fat: "#9C27B0",
  water: "#00BCD4",
  steps: "#4CAF50",
  workout: "#E91E63",
} as const;

export type Theme = keyof typeof COLORS;
