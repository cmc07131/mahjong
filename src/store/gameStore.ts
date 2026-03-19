import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Player,
  Wind,
  Round,
  GameSnapshot,
  CurrentRound,
  GameStatus,
  WIND_ORDER,
  MAX_SNAPSHOTS,
  ScoreChange,
} from '../types';
import { calculateScoreChanges, getFanUnits } from '../utils/scoring';

// Store 狀態介面
interface GameStore {
  // 遊戲基本狀態
  id: string | null;
  createdAt: Date | null;
  status: GameStatus;
  unitAmount: number;

  // 玩家狀態
  players: Player[];
  dealerIndex: number;
  prevailingWind: Wind;

  // 回合狀態
  rounds: Round[];
  currentRound: CurrentRound | null;
  roundCount: number;

  // 歷史記錄 (用於 Undo)
  history: GameSnapshot[];

  // Actions - 遊戲設定
  startGame: (players: Omit<Player, 'score' | 'isDealer' | 'position'>[], unitAmount: number) => void;
  resetGame: () => void;

  // Actions - 回合操作
  setCurrentRound: (round: CurrentRound | null) => void;
  confirmRound: () => void;
  processDraw: () => void;

  // Actions - Undo
  undo: () => void;
  canUndo: () => boolean;

  // Actions - 結算
  finishGame: () => void;

  // Helper - 取得當前玩家資訊
  getDealer: () => Player | undefined;
  getCurrentWind: () => Wind;
}

// 初始狀態
const initialState = {
  id: null,
  createdAt: null,
  status: 'SETUP' as GameStatus,
  unitAmount: 128,
  players: [] as Player[],
  dealerIndex: 0,
  prevailingWind: 'EAST' as Wind,
  rounds: [] as Round[],
  currentRound: null as CurrentRound | null,
  roundCount: 0,
  history: [] as GameSnapshot[],
};

// 生成唯一 ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// 建立 Zustand Store
export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Actions - 遊戲設定
      startGame: (playerInputs, unitAmount) => {
        const players: Player[] = playerInputs.map((input, index) => ({
          id: generateId(),
          name: input.name,
          position: WIND_ORDER[index],
          score: 0,
          isDealer: index === 0,
        }));

        set({
          id: generateId(),
          createdAt: new Date(),
          status: 'PLAYING',
          unitAmount,
          players,
          dealerIndex: 0,
          prevailingWind: 'EAST',
          rounds: [],
          currentRound: null,
          roundCount: 0,
          history: [],
        });
      },

      resetGame: () => {
        set(initialState);
      },

      // Actions - 回合操作
      setCurrentRound: (round) => {
        set({ currentRound: round });
      },

      confirmRound: () => {
        const state = get();
        const { currentRound, players, dealerIndex, prevailingWind, rounds, roundCount, history, unitAmount } = state;
        
        if (!currentRound || !currentRound.winnerId || !currentRound.winType || !currentRound.fan) {
          console.error('無法確認回合：缺少必要資料');
          return;
        }

        // 計算分數變動
        const scoreChanges = calculateScoreChanges(
          currentRound.winnerId,
          currentRound.winType,
          currentRound.fan,
          unitAmount,
          players,
          currentRound.loserIds[0] // 出銃者 ID (如果有)
        );

        // 建立新回合記錄
        const newRound: Round = {
          id: generateId(),
          roundNumber: roundCount + 1,
          winnerId: currentRound.winnerId,
          winType: currentRound.winType,
          fan: currentRound.fan,
          loserIds: currentRound.loserIds,
          baseAmount: getFanUnits(currentRound.fan) * unitAmount,
          totalAmount: scoreChanges.find(c => c.playerId === currentRound.winnerId)?.change || 0,
          dealerId: players[dealerIndex].id,
          isDealerWin: currentRound.winnerId === players[dealerIndex].id,
          isDraw: false,
          scoreChanges,
          createdAt: new Date(),
        };

        // 更新玩家分數
        const updatedPlayers = players.map((player) => {
          const change = scoreChanges.find(c => c.playerId === player.id);
          return {
            ...player,
            score: player.score + (change?.change || 0),
          };
        });

        // 判斷是否需要轉莊
        // 莊家沒有贏 -> 過莊
        const dealerPlayer = players[dealerIndex];
        const isDealerWin = currentRound.winnerId === dealerPlayer.id;
        let newDealerIndex = dealerIndex;
        let newPrevailingWind = prevailingWind;
        let newRoundCount = roundCount + 1;

        if (!isDealerWin) {
          // 過莊：莊家順時針移動
          newDealerIndex = (dealerIndex + 1) % 4;
          
          // 如果回到東家，圈風改變
          if (newDealerIndex === 0) {
            const windIndex = WIND_ORDER.indexOf(prevailingWind);
            newPrevailingWind = WIND_ORDER[(windIndex + 1) % 4];
          }
        }

        // 更新玩家的莊家標記
        const finalPlayers = updatedPlayers.map((player, index) => ({
          ...player,
          isDealer: index === newDealerIndex,
          position: WIND_ORDER[index], // 保持位置對應
        }));

        // 建立快照
        const snapshot: GameSnapshot = {
          id: generateId(),
          timestamp: new Date(),
          state: {
            players: [...players],
            dealerIndex,
            prevailingWind,
            rounds: [...rounds],
            roundCount,
          },
          action: { type: 'WIN', roundId: newRound.id },
        };

        // 更新狀態
        set({
          players: finalPlayers,
          dealerIndex: newDealerIndex,
          prevailingWind: newPrevailingWind,
          rounds: [...rounds, newRound],
          roundCount: newRoundCount,
          currentRound: null,
          history: history.length >= MAX_SNAPSHOTS
            ? [...history.slice(1), snapshot]
            : [...history, snapshot],
        });
      },

      processDraw: () => {
        const state = get();
        const { players, dealerIndex, prevailingWind, rounds, roundCount, history } = state;

        // 建立流局回合記錄
        const newRound: Round = {
          id: generateId(),
          roundNumber: roundCount + 1,
          winnerId: '',
          winType: 'RON',
          fan: 0,
          loserIds: [],
          baseAmount: 0,
          totalAmount: 0,
          dealerId: players[dealerIndex].id,
          isDealerWin: false,
          isDraw: true,
          scoreChanges: players.map(p => ({ playerId: p.id, change: 0 })),
          createdAt: new Date(),
        };

        // 流局過莊
        const newDealerIndex = (dealerIndex + 1) % 4;
        let newPrevailingWind = prevailingWind;
        
        if (newDealerIndex === 0) {
          const windIndex = WIND_ORDER.indexOf(prevailingWind);
          newPrevailingWind = WIND_ORDER[(windIndex + 1) % 4];
        }

        // 更新玩家的莊家標記
        const updatedPlayers = players.map((player, index) => ({
          ...player,
          isDealer: index === newDealerIndex,
        }));

        // 建立快照
        const snapshot: GameSnapshot = {
          id: generateId(),
          timestamp: new Date(),
          state: {
            players: [...players],
            dealerIndex,
            prevailingWind,
            rounds: [...rounds],
            roundCount,
          },
          action: { type: 'DRAW', roundId: newRound.id },
        };

        set({
          players: updatedPlayers,
          dealerIndex: newDealerIndex,
          prevailingWind: newPrevailingWind,
          rounds: [...rounds, newRound],
          roundCount: roundCount + 1,
          currentRound: null,
          history: history.length >= MAX_SNAPSHOTS
            ? [...history.slice(1), snapshot]
            : [...history, snapshot],
        });
      },

      // Actions - Undo
      undo: () => {
        const { history } = get();
        if (history.length === 0) return;

        const lastSnapshot = history[history.length - 1];
        set({
          players: lastSnapshot.state.players,
          dealerIndex: lastSnapshot.state.dealerIndex,
          prevailingWind: lastSnapshot.state.prevailingWind,
          rounds: lastSnapshot.state.rounds,
          roundCount: lastSnapshot.state.roundCount,
          history: history.slice(0, -1),
        });
      },

      canUndo: () => {
        return get().history.length > 0;
      },

      // Actions - 結算
      finishGame: () => {
        set({ status: 'SETTLED' });
      },

      // Helper
      getDealer: () => {
        const { players, dealerIndex } = get();
        return players[dealerIndex];
      },

      getCurrentWind: () => {
        return get().prevailingWind;
      },
    }),
    {
      name: 'mahjong-game-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        id: state.id,
        createdAt: state.createdAt,
        status: state.status,
        unitAmount: state.unitAmount,
        players: state.players,
        dealerIndex: state.dealerIndex,
        prevailingWind: state.prevailingWind,
        rounds: state.rounds,
        roundCount: state.roundCount,
        history: state.history,
      }),
    }
  )
);

export default useGameStore;
