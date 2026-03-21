import { useEffect, useMemo, useState, useRef } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useGameStore } from '../src/store/gameStore';
import { useHistoryStore } from '../src/store/historyStore';
import { useThemeStore } from '../src/store/themeStore';
import { calculateSettlement } from '../src/utils/settlement';
import { ScoreSummary, PaymentList } from '../src/components/settlement';
import { Button } from '../src/components/common';
import { MatchHistoryDetail, PlayerHistoryDetail, RoundRecord } from '../src/types';

export default function SettlementScreen() {
  const router = useRouter();
  const { currentTheme } = useThemeStore();
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const hasAutoSaved = useRef(false);
  
  // 從 Zustand store 取得遊戲狀態
  const players = useGameStore((state) => state.players);
  const unitAmount = useGameStore((state) => state.unitAmount);
  const status = useGameStore((state) => state.status);
  const finishGame = useGameStore((state) => state.finishGame);
  const resetGame = useGameStore((state) => state.resetGame);
  const gameId = useGameStore((state) => state.id);
  const createdAt = useGameStore((state) => state.createdAt);
  const rounds = useGameStore((state) => state.rounds);
  const roundCount = useGameStore((state) => state.roundCount);

  // History store
  const { saveHistory } = useHistoryStore();

  // 進入結算畫面時，呼叫 finishGame 更新狀態
  useEffect(() => {
    if (status === 'PLAYING') {
      finishGame();
    }
  }, [status, finishGame]);

  // 自動儲存歷史記錄
  useEffect(() => {
    if (!hasAutoSaved.current && !isSaving && !isSaved && players.length > 0) {
      hasAutoSaved.current = true;
      handleSaveHistory();
    }
  }, [players, isSaving, isSaved]);

  // 計算最簡化找數方案
  const settlements = useMemo(() => {
    return calculateSettlement(players);
  }, [players]);

  // 儲存歷史記錄
  const handleSaveHistory = async () => {
    if (isSaving || isSaved) return;
    
    setIsSaving(true);
    try {
      // 找出最高分玩家（贏家）
      const maxScore = Math.max(...players.map(p => p.score));
      const winners = players.filter(p => p.score === maxScore);

      // 建立玩家歷史資料
      const playerHistories: PlayerHistoryDetail[] = players.map(player => ({
        ...player,
        finalScore: player.score,
        isWinner: player.score === maxScore,
      }));

      // 建立回合記錄
      const roundRecords: RoundRecord[] = rounds.map(round => ({
        roundNumber: round.roundNumber,
        winnerId: round.winnerId,
        winType: round.winType === 'SELF_DRAW' ? 'self-drawn' : 'ron',
        fan: round.fan,
        payments: round.scoreChanges
          .filter(change => change.change !== 0)
          .map(change => ({
            fromId: change.change < 0 ? change.playerId : (round.winnerId === change.playerId ? '' : change.playerId),
            toId: change.change > 0 ? change.playerId : round.winnerId,
            amount: Math.abs(change.change),
          }))
          .filter(p => p.fromId && p.toId),
        timestamp: round.createdAt.toISOString(),
      }));

      // 建立歷史記錄
      const history: MatchHistoryDetail = {
        id: gameId || Date.now().toString(),
        createdAt: createdAt ? new Date(createdAt).toISOString() : new Date().toISOString(),
        completedAt: new Date().toISOString(),
        playerCount: players.length,
        players: playerHistories,
        totalRounds: roundCount,
        unit: unitAmount,
        rounds: roundRecords,
        settlements: settlements.map(s => ({
          from: s.from,
          to: s.to,
          amount: s.amount,
        })),
      };

      await saveHistory(history);
      setIsSaved(true);
    } catch (error) {
      console.error('儲存歷史記錄失敗:', error);
      Alert.alert('錯誤', '無法儲存比賽記錄');
    } finally {
      setIsSaving(false);
    }
  };

  // 返回主畫面
  const handleBackToGame = () => {
    router.replace('/');
  };

  // 開新牌局
  const handleNewGame = () => {
    resetGame();
    router.replace('/setup');
  };

  // 如果沒有玩家資料，顯示提示
  if (players.length === 0) {
    return (
      <SafeAreaView className={`flex-1 ${currentTheme.classes.background}`}>
        <View className="flex-1 items-center justify-center p-4">
          <Text className={`text-xl ${currentTheme.classes.textSecondary}`}>
            尚未開始遊戲
          </Text>
          <View className="mt-4">
            <Button onPress={() => router.replace('/setup')}>
              開始新遊戲
            </Button>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${currentTheme.classes.background}`}>
      {/* Cloud pattern overlay */}
      <View className="absolute inset-0 cloud-pattern opacity-30" />
      
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
        {/* 標題 */}
        <Text className={`text-2xl font-bold ${currentTheme.classes.textAccent} text-center mb-6`}>
          🎉 遊戲結算
        </Text>

        {/* 總成績單 */}
        <View className="mb-4">
          <ScoreSummary players={players} unitAmount={unitAmount} />
        </View>

        {/* 最簡化找數 */}
        <View className="mb-6">
          <PaymentList
            settlements={settlements}
            players={players}
            unitAmount={unitAmount}
          />
        </View>

        {/* 自動儲存狀態 */}
        <View className="mb-4 flex-row items-center justify-center">
          {isSaving ? (
            <>
              <View className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin mr-2" style={{ borderColor: currentTheme.colors.text.accent, borderTopColor: 'transparent' }} />
              <Text className={`${currentTheme.classes.textSecondary} text-sm`}>儲存中...</Text>
            </>
          ) : isSaved ? (
            <>
              <Text className={`${currentTheme.classes.scorePositive} text-sm font-medium`}>✓ 已自動儲存</Text>
            </>
          ) : null}
        </View>

        {/* 操作按鈕 */}
        <View className="space-y-3 pb-6">
          <Button
            onPress={handleBackToGame}
            variant="outline"
            size="lg"
          >
            返回主畫面
          </Button>
          
          <Button
            onPress={handleNewGame}
            variant="primary"
            size="lg"
          >
            開新牌局
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
