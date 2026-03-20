// Theme configuration for easy theme switching
// Supports multiple themes for user customization

export type ThemeName = 'retro-luxury' | 'ios-liquid-glass' | 'dark-gold' | 'retro-pixel' | 'midnight-ocean';

export interface Theme {
  name: ThemeName;
  displayName: string;
  description: string;
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

// Theme 1: Retro Luxury (Emerald/Gold) - Current Theme
export const retroLuxuryTheme: Theme = {
  name: 'retro-luxury',
  displayName: '翡翠金輝',
  description: '復古奢華風格，翡翠綠配金色點綴',
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
      secondary: '#a7f3d0',
      accent: '#fbbf24',
      muted: '#6ee7b7',
    },
    button: {
      primary: '#16a34a',
      secondary: '#22c55e',
      outline: 'transparent',
      danger: 'rgba(127, 29, 29, 0.5)',
    },
    score: {
      positive: '#4ade80',
      negative: '#f87171',
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

// Theme 2: iOS Liquid Glass Light Mode
export const iosLiquidGlassTheme: Theme = {
  name: 'ios-liquid-glass',
  displayName: '液態玻璃',
  description: 'iOS風格，半透明玻璃質感配柔和陰影',
  colors: {
    background: {
      primary: '#f2f2f7',
      gradient: 'linear-gradient(180deg, #f2f2f7 0%, #e5e5ea 100%)',
      overlay: 'rgba(255, 255, 255, 0.8)',
    },
    panel: {
      primary: 'rgba(255, 255, 255, 0.7)',
      secondary: 'rgba(255, 255, 255, 0.9)',
      border: 'rgba(0, 0, 0, 0.1)',
    },
    text: {
      primary: '#1c1c1e',
      secondary: '#3a3a3c',
      accent: '#007aff',
      muted: '#8e8e93',
    },
    button: {
      primary: '#007aff',
      secondary: '#5ac8fa',
      outline: 'transparent',
      danger: 'rgba(255, 59, 48, 0.1)',
    },
    score: {
      positive: '#34c759',
      negative: '#ff3b30',
      neutral: '#1c1c1e',
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
    panel: 'bg-white/70 backdrop-blur-lg',
    panelBorder: 'border-gray-200/50',
    textPrimary: 'text-gray-900',
    textSecondary: 'text-gray-600',
    textAccent: 'text-blue-500',
    buttonPrimary: 'bg-blue-500',
    buttonSecondary: 'bg-blue-400',
    buttonOutline: 'border-blue-500',
    buttonDanger: 'bg-red-50 border border-red-200',
    scorePositive: 'text-green-500',
    scoreNegative: 'text-red-500',
    scoreNeutral: 'text-gray-900',
  },
};

// Theme 3: Dark Mode with Gold Accent
export const darkGoldTheme: Theme = {
  name: 'dark-gold',
  displayName: '暗夜金輝',
  description: '深邃黑色背景配奢華金色點綴',
  colors: {
    background: {
      primary: '#000000',
      gradient: 'linear-gradient(180deg, #000000 0%, #1a1a1a 50%, #2d2d2d 100%)',
      overlay: 'rgba(0, 0, 0, 0.9)',
    },
    panel: {
      primary: 'rgba(26, 26, 26, 0.9)',
      secondary: 'rgba(45, 45, 45, 0.9)',
      border: 'rgba(212, 175, 55, 0.4)',
    },
    text: {
      primary: '#ffffff',
      secondary: '#d4d4d4',
      accent: '#ffd700',
      muted: '#888888',
    },
    button: {
      primary: '#ffd700',
      secondary: '#ffed4a',
      outline: 'transparent',
      danger: 'rgba(220, 38, 38, 0.8)',
    },
    score: {
      positive: '#22c55e',
      negative: '#ef4444',
      neutral: '#ffffff',
    },
    shadow: {
      color: '#ffd700',
      offset: { width: 0, height: 4 },
      opacity: 0.4,
      radius: 8,
      elevation: 8,
    },
  },
  classes: {
    background: 'bg-black',
    panel: 'bg-zinc-900/90',
    panelBorder: 'border-yellow-500/40',
    textPrimary: 'text-white',
    textSecondary: 'text-zinc-300',
    textAccent: 'text-yellow-400',
    buttonPrimary: 'bg-yellow-500 text-black',
    buttonSecondary: 'bg-yellow-400 text-black',
    buttonOutline: 'border-yellow-500',
    buttonDanger: 'bg-red-600',
    scorePositive: 'text-green-500',
    scoreNegative: 'text-red-500',
    scoreNeutral: 'text-white',
  },
};

// Theme 4: Colorful Retro Pixel Style
export const retroPixelTheme: Theme = {
  name: 'retro-pixel',
  displayName: '像素復古',
  description: '8-bit像素風格，鮮豔色彩配復古感',
  colors: {
    background: {
      primary: '#2d1b69',
      gradient: 'linear-gradient(180deg, #2d1b69 0%, #1a1a2e 50%, #16213e 100%)',
      overlay: 'rgba(45, 27, 105, 0.8)',
    },
    panel: {
      primary: 'rgba(45, 27, 105, 0.85)',
      secondary: 'rgba(26, 26, 46, 0.9)',
      border: 'rgba(0, 255, 255, 0.5)',
    },
    text: {
      primary: '#00ffff',
      secondary: '#ff00ff',
      accent: '#ffff00',
      muted: '#888888',
    },
    button: {
      primary: '#ff00ff',
      secondary: '#00ffff',
      outline: 'transparent',
      danger: 'rgba(255, 0, 0, 0.8)',
    },
    score: {
      positive: '#00ff00',
      negative: '#ff0000',
      neutral: '#ffffff',
    },
    shadow: {
      color: '#ff00ff',
      offset: { width: 0, height: 2 },
      opacity: 0.5,
      radius: 0,
      elevation: 4,
    },
  },
  classes: {
    background: 'bg-purple-900',
    panel: 'bg-purple-900/85',
    panelBorder: 'border-cyan-400/50',
    textPrimary: 'text-cyan-400',
    textSecondary: 'text-fuchsia-400',
    textAccent: 'text-yellow-400',
    buttonPrimary: 'bg-fuchsia-500',
    buttonSecondary: 'bg-cyan-500',
    buttonOutline: 'border-fuchsia-500',
    buttonDanger: 'bg-red-600',
    scorePositive: 'text-green-400',
    scoreNegative: 'text-red-400',
    scoreNeutral: 'text-white',
  },
};

// Theme 5: Midnight Ocean (My choice - calming deep blue)
export const midnightOceanTheme: Theme = {
  name: 'midnight-ocean',
  displayName: '深海夜光',
  description: '寧靜深海風格，深藍配珊瑚色點綴',
  colors: {
    background: {
      primary: '#0c1929',
      gradient: 'linear-gradient(180deg, #0c1929 0%, #1e3a5f 50%, #2d5a87 100%)',
      overlay: 'rgba(12, 25, 41, 0.85)',
    },
    panel: {
      primary: 'rgba(12, 25, 41, 0.85)',
      secondary: 'rgba(30, 58, 95, 0.9)',
      border: 'rgba(255, 127, 80, 0.4)',
    },
    text: {
      primary: '#e0f2fe',
      secondary: '#7dd3fc',
      accent: '#ff7f50',
      muted: '#94a3b8',
    },
    button: {
      primary: '#ff7f50',
      secondary: '#fb923c',
      outline: 'transparent',
      danger: 'rgba(239, 68, 68, 0.8)',
    },
    score: {
      positive: '#34d399',
      negative: '#f87171',
      neutral: '#e0f2fe',
    },
    shadow: {
      color: '#ff7f50',
      offset: { width: 0, height: 3 },
      opacity: 0.35,
      radius: 6,
      elevation: 6,
    },
  },
  classes: {
    background: 'bg-slate-900',
    panel: 'bg-slate-900/85',
    panelBorder: 'border-orange-400/40',
    textPrimary: 'text-sky-100',
    textSecondary: 'text-sky-300',
    textAccent: 'text-orange-400',
    buttonPrimary: 'bg-orange-500',
    buttonSecondary: 'bg-orange-400',
    buttonOutline: 'border-orange-500',
    buttonDanger: 'bg-red-600',
    scorePositive: 'text-emerald-400',
    scoreNegative: 'text-red-400',
    scoreNeutral: 'text-sky-100',
  },
};

// Theme registry
export const themes: Record<ThemeName, Theme> = {
  'retro-luxury': retroLuxuryTheme,
  'ios-liquid-glass': iosLiquidGlassTheme,
  'dark-gold': darkGoldTheme,
  'retro-pixel': retroPixelTheme,
  'midnight-ocean': midnightOceanTheme,
};

// Current active theme (default)
export const currentTheme: Theme = retroLuxuryTheme;

// Get theme by name
export function getTheme(name: ThemeName): Theme {
  return themes[name] || retroLuxuryTheme;
}

// Get all themes as array
export function getAllThemes(): Theme[] {
  return Object.values(themes);
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