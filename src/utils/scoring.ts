// Scoring utility functions for Hong Kong Mahjong

import { WinType, Player, ScoreChange } from '../types';

/**
 * 香港麻將番數金額表 (以10番=256元出銃為基準)
 * 規則：偶數番 = (n-2)番 * 2，奇數番 = (n-1)番 * 1.5
 * 基準：3番 = 16元出銃
 */
export const FAN_AMOUNTS: Record<number, number> = {
  3: 16,    // 基準出銃金額
  4: 32,    // 3番 * 2 (偶數番)
  5: 48,    // 4番 * 1.5 (奇數番)
  6: 64,    // 4番 * 2 (偶數番)
  7: 96,    // 6番 * 1.5 (奇數番)
  8: 128,   // 6番 * 2 (偶數番)
  9: 192,   // 8番 * 1.5 (奇數番)
  10: 256,  // 8番 * 2 (偶數番) - 基準單位
  11: 384,  // 10番 * 1.5 (奇數番)
  12: 512,  // 10番 * 2 (偶數番)
  13: 768,  // 12番 * 1.5 (奇數番)
};

export interface ScoreResult {
  perPlayer: number;
  total: number;
  distribution: 'THREE_PLAYERS' | 'ONE_PLAYER';
}

/**
 * 取得番數對應的金額 (10番基準為256元)
 */
export function getFanAmount(fan: number): number {
  return FAN_AMOUNTS[fan] || FAN_AMOUNTS[10]; // 超過範圍當10番計算
}

/**
 * 計算分數
 * @param fan 番數
 * @param winType 食糊類型
 * @param unitAmount 10番的金額（出銃總額）- 僅用於縮放基準表
 */
export function calculateScore(
  fan: number,
  winType: WinType,
  unitAmount: number
): ScoreResult {
  // 直接使用 FAN_AMOUNTS 表中的金額，unitAmount 參數僅用於未來擴展
  const ronAmount = getFanAmount(fan);

  if (winType === 'SELF_DRAW') {
    // 自摸：每家付出銃金額的一半
    const perPlayer = Math.round(ronAmount / 2);
    const totalAmount = perPlayer * 3;
    return {
      perPlayer: perPlayer,
      total: totalAmount,
      distribution: 'THREE_PLAYERS',
    };
  } else {
    // 出銃：一人付出銃金額
    return {
      perPlayer: ronAmount,
      total: ronAmount,
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
