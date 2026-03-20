// Theme configuration for easy theme switching in the future
// Currently using 'retro-luxury' theme (emerald/gold)

export type ThemeName = 'retro-luxury' | 'classic' | 'modern';

export interface Theme {
  name: ThemeName;
  colors: {
    // Background colors
    background: {
      primary: string;
      gradient: string;
      overlay: string;
    };
    // Panel colors
    panel: {
      primary: string;
      secondary: string;
      border: string;
    };
    // Text colors
    text: {
      primary: string;
      secondary: string;
      accent: string;
      muted: string;
    };
    // Button colors
    button: {
      primary: string;
      secondary: string;
      outline: string;
      danger: string;
    };
    // Score colors
    score: {
      positive: string;
      negative: string;
      neutral: string;
    };
    // Shadow
    shadow: {
      color: string;
      offset: { width: number; height: number };
      opacity: number;
      radius: number;
      elevation: number;
    };
  };
  // Tailwind class mappings
  classes: {
    background: string;
    panel: string;
    panelBorder: string;
    textPrimary: string;
    textSecondary: string;
    textAccent: string;
    buttonPrimary: string;
    buttonSecondary: string;
    buttonOutline: string;
    buttonDanger: string;
    scorePositive: string;
    scoreNegative: string;
    scoreNeutral: string;
  };
}

// Retro Luxury Theme (Emerald/Gold)
export const retroLuxuryTheme: Theme = {
  name: 'retro-luxury',
  colors: {
    background: {
      primary: '#0a1f1a',
      gradient: 'linear-gradient(180deg, #0a1f1a 0%, #134d3a 50%, #1a6b4f 100%)',
      overlay: 'rgba(255, 255, 255, 0.02)',
    },
    panel: {
      primary: 'rgba(10, 31, 26, 0.85)',
      secondary: 'rgba(13, 41, 32, 0.9)',
      border: 'rgba(212, 175, 55, 0.3)',
    },
    text: {
      primary: '#ffffff',
      secondary: '#a7f3d0', // emerald-200
      accent: '#fbbf24', // gold-400
      muted: '#6ee7b7', // emerald-300
    },
    button: {
      primary: '#16a34a', // green-600
      secondary: '#22c55e', // green-500
      outline: 'transparent',
      danger: 'rgba(127, 29, 29, 0.5)', // red-900/50
    },
    score: {
      positive: '#4ade80', // green-400
      negative: '#f87171', // red-400
      neutral: '#ffffff',
    },
    shadow: {
      color: '#D4AF37',
      offset: { width: 0, height: 2 },
      opacity: 0.3,
      radius: 4,
      elevation: 4,
    },
  },
  classes: {
    background: 'emerald-gradient',
    panel: 'dark-panel',
    panelBorder: 'border-gold-500/30',
    textPrimary: 'text-white',
    textSecondary: 'text-emerald-200',
    textAccent: 'text-gold-400',
    buttonPrimary: 'bg-green-600',
    buttonSecondary: 'bg-green-500',
    buttonOutline: 'border-green-600',
    buttonDanger: 'bg-red-900/50 border border-red-500/30',
    scorePositive: 'text-green-400',
    scoreNegative: 'text-red-400',
    scoreNeutral: 'text-white',
  },
};

// Classic Theme (for future use)
export const classicTheme: Theme = {
  name: 'classic',
  colors: {
    background: {
      primary: '#f3f4f6',
      gradient: 'none',
      overlay: 'none',
    },
    panel: {
      primary: '#ffffff',
      secondary: '#f9fafb',
      border: '#e5e7eb',
    },
    text: {
      primary: '#111827',
      secondary: '#6b7280',
      accent: '#2563eb',
      muted: '#9ca3af',
    },
    button: {
      primary: '#2563eb',
      secondary: '#3b82f6',
      outline: 'transparent',
      danger: '#fef2f2',
    },
    score: {
      positive: '#22c55e',
      negative: '#ef4444',
      neutral: '#6b7280',
    },
    shadow: {
      color: '#000000',
      offset: { width: 0, height: 2 },
      opacity: 0.1,
      radius: 8,
      elevation: 4,
    },
  },
  classes: {
    background: 'bg-gray-100',
    panel: 'bg-white',
    panelBorder: 'border-gray-200',
    textPrimary: 'text-gray-800',
    textSecondary: 'text-gray-500',
    textAccent: 'text-blue-600',
    buttonPrimary: 'bg-blue-600',
    buttonSecondary: 'bg-blue-500',
    buttonOutline: 'border-blue-600',
    buttonDanger: 'bg-red-50 border border-red-200',
    scorePositive: 'text-green-500',
    scoreNegative: 'text-red-500',
    scoreNeutral: 'text-gray-600',
  },
};

// Theme registry
export const themes: Record<ThemeName, Theme> = {
  'retro-luxury': retroLuxuryTheme,
  'classic': classicTheme,
  'modern': classicTheme, // Placeholder for future modern theme
};

// Current active theme
export const currentTheme: Theme = retroLuxuryTheme;

// Get theme by name
export function getTheme(name: ThemeName): Theme {
  return themes[name] || retroLuxuryTheme;
}

// Helper function to get shadow style for React Native
export function getShadowStyle(theme: Theme) {
  return {
    shadowColor: theme.colors.shadow.color,
    shadowOffset: theme.colors.shadow.offset,
    shadowOpacity: theme.colors.shadow.opacity,
    shadowRadius: theme.colors.shadow.radius,
    elevation: theme.colors.shadow.elevation,
  };
}