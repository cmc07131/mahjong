// Scoring utility functions for Hong Kong Mahjong

import { WinType, Player, ScoreChange } from '../types';

/**
 * 番數轉換表 (香港麻將)
 * 1番 = 1單位, 2番 = 2單位, 3番 = 4單位, 4番 = 8單位, 5番及以上 = 16單位
 */
export const FAN_MULTIPLIER: Record<number, number> = {
  1: 1,
  2: 2,
  3: 4,
  4: 8,
  5: 16,
  6: 16, // 6番及以上當5番計算
  7: 16,
  8: 16,
};

/**
 * 取得番數對應的單位數
 */
export function getFanUnits(fan: number): number {
  return FAN_MULTIPLIER[fan] || FAN_MULTIPLIER[5]; // 超過5番當5番計算
}

export interface ScoreResult {
  perPlayer: number;
  total: number;
  distribution: 'THREE_PLAYERS' | 'ONE_PLAYER';
}

/**
 * 計算分數
 */
export function calculateScore(
  fan: number,
  winType: WinType,
  unitAmount: number
): ScoreResult {
  const baseUnit = getFanUnits(fan);
  const baseAmount = baseUnit * unitAmount;

  if (winType === 'SELF_DRAW') {
    // 自摸：三家各付基礎金額
    return {
      perPlayer: baseAmount,
      total: baseAmount * 3,
      distribution: 'THREE_PLAYERS',
    };
  } else {
    // 出銃：一人付三倍基礎金額
    return {
      perPlayer: baseAmount * 3,
      total: baseAmount * 3,
      distribution: 'ONE_PLAYER',
    };
  }
}

/**
 * 計算各玩家分數變動
 * @param winnerId 贏家 ID
 * @param winType 食糊類型
 * @param fan 番數
 * @param unitAmount 每單位金額
 * @param players 所有玩家
 * @param loserId 出銃者 ID (僅出銃時需要)
 * @returns 各玩家分數變動記錄
 */
export function calculateScoreChanges(
  winnerId: string,
  winType: WinType,
  fan: number,
  unitAmount: number,
  players: Player[],
  loserId?: string
): ScoreChange[] {
  const scoreResult = calculateScore(fan, winType, unitAmount);
  const changes: ScoreChange[] = [];

  if (winType === 'SELF_DRAW') {
    // 自摸：贏家收三家
    players.forEach((player) => {
      if (player.id === winnerId) {
        // 贏家獲得總金額
        changes.push({
          playerId: player.id,
          change: scoreResult.total,
        });
      } else {
        // 其他三家各付 perPlayer
        changes.push({
          playerId: player.id,
          change: -scoreResult.perPlayer,
        });
      }
    });
  } else {
    // 出銃：贏家收出銃者
    if (!loserId) {
      throw new Error('出銃必須指定出銃者');
    }
    players.forEach((player) => {
      if (player.id === winnerId) {
        // 贏家獲得總金額
        changes.push({
          playerId: player.id,
          change: scoreResult.total,
        });
      } else if (player.id === loserId) {
        // 出銃者付總金額
        changes.push({
          playerId: player.id,
          change: -scoreResult.total,
        });
      } else {
        // 其他玩家無變動
        changes.push({
          playerId: player.id,
          change: 0,
        });
      }
    });
  }

  return changes;
}

/**
 * 計算預覽分數變動 (用於 UI 顯示)
 */
export function calculatePreviewChanges(
  winnerId: string,
  winType: WinType,
  fan: number,
  unitAmount: number,
  players: Player[],
  loserId?: string
): Record<string, number> {
  const changes = calculateScoreChanges(winnerId, winType, fan, unitAmount, players, loserId);
  const result: Record<string, number> = {};
  changes.forEach((change) => {
    result[change.playerId] = change.change;
  });
  return result;
}
