import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 桌面形狀類型
export type TableShape = 'round' | 'square';

// 自訂顏色類型
export interface CustomTableColors {
  surface?: string;
  frame?: string;
}

// Table Store 狀態介面
interface TableStore {
  // 桌面形狀
  shape: TableShape;
  // 自訂顏色（可選，覆蓋主題預設，null 表示使用主題預設）
  customColors: CustomTableColors | null;
  
  // Actions
  setShape: (shape: TableShape) => void;
  setCustomColors: (colors: CustomTableColors | null) => void;
  resetToThemeDefaults: () => void;
}

export const useTableStore = create<TableStore>()(
  persist(
    (set) => ({
      shape: 'round',
      customColors: null,
      
      setShape: (shape) => set({ shape }),
      
      setCustomColors: (colors) => set({ customColors: colors }),
      
      resetToThemeDefaults: () => set({ 
        customColors: null,
      }),
    }),
    {
      name: 'mahjong-table-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useTableStore;