// Scoring utility functions for Hong Kong Mahjong

import { WinType, Player, ScoreChange } from '../types';

/**
 * 番數轉換表 (香港麻將)
 * 以10番為基準 (multiplier = 1)
 * 每番為前一番的2倍 (指數增長)
 */
export const FAN_MULTIPLIER: Record<number, number> = {
  1: 1/512,
  2: 1/256,
  3: 1/128,
  4: 1/64,
  5: 1/32,
  6: 1/16,
  7: 1/8,
  8: 1/4,
  9: 1/2,
  10: 1,
  11: 2,
  12: 4,
  13: 8,
};

/**
 * 取得番數對應的倍率
 */
export function getFanUnits(fan: number): number {
  return FAN_MULTIPLIER[fan] || FAN_MULTIPLIER[10]; // 超過範圍當10番計算
}

export interface ScoreResult {
  perPlayer: number;
  total: number;
  distribution: 'THREE_PLAYERS' | 'ONE_PLAYER';
}

/**
 * 計算分數
 * @param fan 番數
 * @param winType 食糊類型
 * @param unitAmount 10番的金額
 */
export function calculateScore(
  fan: number,
  winType: WinType,
  unitAmount: number
): ScoreResult {
  const multiplier = getFanUnits(fan);
  const baseAmount = Math.round(multiplier * unitAmount);

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
 * @param unitAmount 10番的金額
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
