// 風位類型
export type Wind = 'EAST' | 'SOUTH' | 'WEST' | 'NORTH';

// 座位位置類型 (相對於當前玩家的位置)
export type Position = 'SELF' | 'RIGHT' | 'OPPOSITE' | 'LEFT';

// 食糊類型
export type WinType = 'SELF_DRAW' | 'RON';

// 遊戲狀態
export type GameStatus = 'SETUP' | 'PLAYING' | 'SETTLED';

// 玩家介面
export interface Player {
  id: string;                    // 唯一識別碼
  name: string;                  // 玩家姓名
  position: Wind;                // 當前座位風位 (東南西北)
  score: number;                 // 累計分數 (正為贏，負為輸)
  isDealer: boolean;             // 是否為莊家
}

// 分數變動記錄
export interface ScoreChange {
  playerId: string;
  change: number;                // 正為獲得，負為失去
}

// 回合記錄介面
export interface Round {
  id: string;                    // 回合唯一識別碼
  roundNumber: number;           // 回合編號

  // 食糊資訊
  winnerId: string;              // 贏家 ID
  winType: WinType;              // 食糊類型
  fan: number;                   // 番數 (1-13)

  // 輸家資訊
  loserIds: string[];            // 輸家 ID 陣列 (自摸三家或出銃一人)

  // 金額計算
  baseAmount: number;            // 基礎金額 (番數轉換後)
  totalAmount: number;           // 總金額

  // 莊家資訊
  dealerId: string;              // 該回合莊家 ID
  isDealerWin: boolean;          // 莊家是否食糊
  isDraw: boolean;               // 是否流局

  // 分數變動記錄
  scoreChanges: ScoreChange[];   // 各玩家分數變動

  // 時間戳記
  createdAt: Date;
}

// 當前回合輸入 (暫存)
export interface CurrentRound {
  winnerId: string | null;
  winType: WinType | null;
  fan: number | null;
  loserIds: string[];
}

// 可還原的操作類型
export type UndoableAction =
  | { type: 'WIN'; roundId: string }
  | { type: 'DRAW'; roundId: string }
  | { type: 'START_GAME' };

// 遊戲快照 (用於 Undo)
export interface GameSnapshot {
  id: string;
  timestamp: Date;

  // 完整遊戲狀態快照
  state: {
    players: Player[];
    dealerIndex: number;
    prevailingWind: Wind;
    rounds: Round[];
    roundCount: number;
  };

  // 操作描述
  action: UndoableAction;
}

// 遊戲狀態介面
export interface GameState {
  // 遊戲設定
  id: string;                    // 遊戲唯一識別碼
  createdAt: Date;               // 建立時間
  unitAmount: number;            // 10番的金額

  // 玩家資訊
  players: Player[];             // 四位玩家 (依座位順序: 東南西北)
  dealerIndex: number;           // 當前莊家索引 (0-3)
  prevailingWind: Wind;          // 當前圈風

  // 回合記錄
  rounds: Round[];               // 所有已完成的回合
  currentRound: CurrentRound | null;  // 當前進行中的回合

  // 遊戲狀態
  status: GameStatus;            // 遊戲狀態
  roundCount: number;            // 總回合數

  // 歷史記錄 (用於 Undo)
  history: GameSnapshot[];
}

// 圈風順序常數
export const WIND_ORDER: Wind[] = ['EAST', 'SOUTH', 'WEST', 'NORTH'];

// 最大快照數量
export const MAX_SNAPSHOTS = 20;

// ============================================
// 歷史記錄相關類型
// ============================================

// 玩家摘要（用於歷史記錄）
export interface PlayerSummary {
  id: string;
  name: string;
  finalScore: number;
  isWinner: boolean;
}

// 歷史記錄摘要（用於列表顯示）
export interface MatchHistorySummary {
  id: string;
  createdAt: string;
  completedAt: string;
  playerCount: number;
  players: PlayerSummary[];
  totalRounds: number;
  unit: number;
}

// 回合記錄
export interface RoundRecord {
  roundNumber: number;
  winnerId: string;
  winType: 'self-drawn' | 'ron';
  fan: number;
  payments: {
    fromId: string;
    toId: string;
    amount: number;
  }[];
  timestamp: string;
}

// 歷史記錄詳情玩家資料
export interface PlayerHistoryDetail extends Player {
  finalScore: number;
  isWinner: boolean;
}

// 歷史記錄詳情（完整資料）
export interface MatchHistoryDetail extends Omit<MatchHistorySummary, 'players'> {
  players: PlayerHistoryDetail[];
  rounds: RoundRecord[];
  settlements: {
    from: string;
    to: string;
    amount: number;
  }[];
}
