import { create } from 'zustand';
import { MatchHistorySummary, MatchHistoryDetail } from '../types';
import * as historyService from '../services/historyService';

interface HistoryState {
  histories: MatchHistorySummary[];
  currentHistory: MatchHistoryDetail | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadHistories: () => Promise<void>;
  loadHistoryDetail: (id: string) => Promise<void>;
  saveHistory: (match: MatchHistoryDetail) => Promise<void>;
  updateHistory: (match: MatchHistoryDetail) => Promise<void>;
  deleteHistory: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  histories: [],
  currentHistory: null,
  isLoading: false,
  error: null,
  
  loadHistories: async () => {
    set({ isLoading: true, error: null });
    try {
      const histories = await historyService.getHistoryList();
      set({ histories, isLoading: false });
    } catch (error) {
      set({ error: '無法載入歷史記錄', isLoading: false });
    }
  },
  
  loadHistoryDetail: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const currentHistory = await historyService.getHistoryDetail(id);
      set({ currentHistory, isLoading: false });
    } catch (error) {
      set({ error: '無法載入比賽詳情', isLoading: false });
    }
  },
  
  saveHistory: async (match: MatchHistoryDetail) => {
    set({ isLoading: true, error: null });
    try {
      await historyService.saveMatchHistory(match);
      await get().loadHistories();
    } catch (error) {
      set({ error: '無法儲存歷史記錄', isLoading: false });
    }
  },
  
  updateHistory: async (match: MatchHistoryDetail) => {
    set({ isLoading: true, error: null });
    try {
      await historyService.updateMatchHistory(match);
      await get().loadHistories();
      if (get().currentHistory?.id === match.id) {
        set({ currentHistory: match, isLoading: false });
      }
    } catch (error) {
      set({ error: '無法更新歷史記錄', isLoading: false });
    }
  },
  
  deleteHistory: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await historyService.deleteMatchHistory(id);
      const histories = get().histories.filter(h => h.id !== id);
      set({ 
        histories, 
        currentHistory: get().currentHistory?.id === id ? null : get().currentHistory,
        isLoading: false 
      });
    } catch (error) {
      set({ error: '無法刪除歷史記錄', isLoading: false });
    }
  },
  
  clearError: () => set({ error: null }),
}));
