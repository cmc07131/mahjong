// Scoring utility functions for Hong Kong Mahjong

import { WinType, Player, ScoreChange } from '../types';

/**
 * 支援的基準金額類型
 */
export type FanBaseType = 128 | 256 | 512;

/**
 * 生成番數金額表
 * @param baseAmount 10番的出銃金額基準
 * 規則：偶數番 = (n-2)番 * 2，奇數番 = (n-1)番 * 1.5
 */
export function generateFanAmounts(baseAmount: FanBaseType): Record<number, number> {
  // 計算3番的基準金額 (10番 / 16)
  const baseForThree = baseAmount / 16;
  
  const amounts: Record<number, number> = {};
  
  // 從3番開始遞推
  amounts[3] = baseForThree;
  amounts[4] = amounts[3] * 2;      // 偶數番 = (n-2)番 * 2
  amounts[5] = Math.round(amounts[4] * 1.5);  // 奇數番 = (n-1)番 * 1.5
  amounts[6] = amounts[4] * 2;      // 偶數番 = (n-2)番 * 2
  amounts[7] = Math.round(amounts[6] * 1.5);  // 奇數番 = (n-1)番 * 1.5
  amounts[8] = amounts[6] * 2;      // 偶數番 = (n-2)番 * 2
  amounts[9] = Math.round(amounts[8] * 1.5);  // 奇數番 = (n-1)番 * 1.5
  amounts[10] = amounts[8] * 2;     // 偶數番 = (n-2)番 * 2 (基準)
  amounts[11] = Math.round(amounts[10] * 1.5);
  amounts[12] = amounts[10] * 2;
  amounts[13] = Math.round(amounts[12] * 1.5);
  
  return amounts;
}

/**
 * 預設番數金額表 (以10番=256元出銃為基準)
 */
export const DEFAULT_FAN_AMOUNTS: Record<number, number> = generateFanAmounts(256);

export interface ScoreResult {
  perPlayer: number;
  total: number;
  distribution: 'THREE_PLAYERS' | 'ONE_PLAYER';
}

/**
 * 取得番數對應的金額
 * @param fan 番數
 * @param baseAmount 基準金額類型
 */
export function getFanAmount(fan: number, baseAmount: FanBaseType = 256): number {
  const fanAmounts = generateFanAmounts(baseAmount);
  return fanAmounts[fan] || fanAmounts[10]; // 超過範圍當10番計算
}

/**
 * 計算分數
 * @param fan 番數
 * @param winType 食糊類型
 * @param unitAmount 10番的金額（出銃總額）
 */
export function calculateScore(
  fan: number,
  winType: WinType,
  unitAmount: number
): ScoreResult {
  // 使用動態計算的金額
  const ronAmount = getFanAmount(fan, unitAmount as FanBaseType);

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
