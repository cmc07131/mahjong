import { MatchHistorySummary, MatchHistoryDetail, PlayerSummary } from '../types';

const STORAGE_KEYS = {
  HISTORY_LIST: 'mahjong-history-list',
  HISTORY_DETAIL: (id: string) => `mahjong-history-${id}`,
};

/**
 * 取得所有歷史記錄摘要
 */
export async function getHistoryList(): Promise<MatchHistorySummary[]> {
  const data = localStorage.getItem(STORAGE_KEYS.HISTORY_LIST);
  return data ? JSON.parse(data) : [];
}

/**
 * 取得單筆歷史記錄詳情
 */
export async function getHistoryDetail(id: string): Promise<MatchHistoryDetail | null> {
  const data = localStorage.getItem(STORAGE_KEYS.HISTORY_DETAIL(id));
  return data ? JSON.parse(data) : null;
}

/**
 * 儲存新歷史記錄
 */
export async function saveMatchHistory(match: MatchHistoryDetail): Promise<void> {
  // 儲存詳情
  localStorage.setItem(STORAGE_KEYS.HISTORY_DETAIL(match.id), JSON.stringify(match));
  
  // 更新摘要列表
  const list = await getHistoryList();
  const summary: MatchHistorySummary = {
    id: match.id,
    createdAt: match.createdAt,
    completedAt: match.completedAt,
    playerCount: match.playerCount,
    players: match.players.map((p): PlayerSummary => ({
      id: p.id,
      name: p.name,
      finalScore: p.finalScore,
      isWinner: p.isWinner,
    })),
    totalRounds: match.totalRounds,
    unit: match.unit,
  };
  
  // 檢查是否已存在，避免重複
  const existingIndex = list.findIndex(h => h.id === match.id);
  if (existingIndex >= 0) {
    list[existingIndex] = summary;
  } else {
    list.unshift(summary); // 新的記錄放在最前面
  }
  
  localStorage.setItem(STORAGE_KEYS.HISTORY_LIST, JSON.stringify(list));
}

/**
 * 更新歷史記錄
 */
export async function updateMatchHistory(match: MatchHistoryDetail): Promise<void> {
  return saveMatchHistory(match);
}

/**
 * 刪除歷史記錄
 */
export async function deleteMatchHistory(id: string): Promise<void> {
  // 刪除詳情
  localStorage.removeItem(STORAGE_KEYS.HISTORY_DETAIL(id));
  
  // 從列表中移除
  const list = await getHistoryList();
  const filtered = list.filter(h => h.id !== id);
  localStorage.setItem(STORAGE_KEYS.HISTORY_LIST, JSON.stringify(filtered));
}

/**
 * 清除所有歷史記錄
 */
export async function clearAllHistory(): Promise<void> {
  const list = await getHistoryList();
  list.forEach(h => localStorage.removeItem(STORAGE_KEYS.HISTORY_DETAIL(h.id)));
  localStorage.removeItem(STORAGE_KEYS.HISTORY_LIST);
}
