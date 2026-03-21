import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeName, Theme, getTheme, retroLuxuryTheme } from '../config/theme';

interface ThemeStore {
  currentThemeName: ThemeName;
  currentTheme: Theme;
  
  // Actions
  setTheme: (themeName: ThemeName) => void;
  getCurrentTheme: () => Theme;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      currentThemeName: 'retro-luxury',
      currentTheme: retroLuxuryTheme,
      
      setTheme: (themeName: ThemeName) => {
        const theme = getTheme(themeName);
        set({
          currentThemeName: themeName,
          currentTheme: theme,
        });
      },
      
      getCurrentTheme: () => {
        return get().currentTheme;
      },
    }),
    {
      name: 'mahjong-theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        currentThemeName: state.currentThemeName,
        currentTheme: state.currentTheme,
      }),
    }
  )
);

export default useThemeStore;