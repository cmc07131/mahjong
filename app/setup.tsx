import { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, ViewStyle, TextStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Card, Button } from '../src/components/common';
import { PlayerInput, UnitSelector } from '../src/components/setup';
import { useGameStore } from '../src/store/gameStore';
import { Wind } from '../src/types';

// 預設玩家名稱
const DEFAULT_PLAYERS: { wind: Wind; name: string }[] = [
  { wind: 'EAST', name: '阿明' },
  { wind: 'SOUTH', name: '阿強' },
  { wind: 'WEST', name: '阿華' },
  { wind: 'NORTH', name: '阿東' },
];

// 風位標籤
const WIND_LABELS: Record<Wind, string> = {
  EAST: '東家',
  SOUTH: '南家',
  WEST: '西家',
  NORTH: '北家',
};

export default function SetupScreen() {
  const startGame = useGameStore((state) => state.startGame);
  
  // 玩家名稱狀態
  const [players, setPlayers] = useState<{ wind: Wind; name: string }[]>(DEFAULT_PLAYERS);
  // 單位金額狀態
  const [unitAmount, setUnitAmount] = useState(1);
  // 載入狀態
  const [isLoading, setIsLoading] = useState(false);

  // 更新玩家名稱
  const handlePlayerChange = (wind: Wind, name: string) => {
    setPlayers((prev) =>
      prev.map((p) => (p.wind === wind ? { ...p, name } : p))
    );
  };

  // 開始遊戲
  const handleStartGame = async () => {
    // 檢查所有玩家都有名稱
    const allPlayersNamed = players.every((p) => p.name.trim().length > 0);
    if (!allPlayersNamed) {
      return;
    }

    setIsLoading(true);
    
    try {
      // 準備玩家資料
      const playerInputs = players.map((p) => ({
        id: p.wind.toLowerCase(),
        name: p.name.trim(),
      }));

      // 呼叫 store 的 startGame
      startGame(playerInputs, unitAmount);

      // 導航到遊戲主畫面
      router.replace('/game');
    } catch (error) {
      console.error('Failed to start game:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 檢查是否可以開始遊戲
  const canStart = players.every((p) => p.name.trim().length > 0);

  // 樣式定義
  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: '#f0fdf4',
  };

  const scrollViewContentStyle: ViewStyle = {
    flexGrow: 1,
    padding: 20,
  };

  const headerContainerStyle: ViewStyle = {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  };

  const titleStyle: TextStyle = {
    fontSize: 28,
    fontWeight: '700',
    color: '#166534',
    marginBottom: 8,
  };

  const subtitleStyle: TextStyle = {
    fontSize: 14,
    color: '#6b7280',
  };

  const cardStyle: ViewStyle = {
    marginBottom: 16,
  };

  const sectionTitleStyle: TextStyle = {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  };

  const buttonContainerStyle: ViewStyle = {
    marginTop: 24,
    marginBottom: 32,
  };

  return (
    <SafeAreaView style={containerStyle}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={scrollViewContentStyle}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* 標題區 */}
          <View style={headerContainerStyle}>
            <Text style={titleStyle}>香港麻將計分</Text>
            <Text style={subtitleStyle}>設定玩家與金額，開始牌局</Text>
          </View>

          {/* 玩家設定卡片 */}
          <Card style={cardStyle}>
            <Text style={sectionTitleStyle}>玩家設定</Text>
            {players.map((player) => (
              <PlayerInput
                key={player.wind}
                wind={player.wind}
                label={WIND_LABELS[player.wind]}
                value={player.name}
                onChange={(name) => handlePlayerChange(player.wind, name)}
                placeholder={`輸入${WIND_LABELS[player.wind]}名稱`}
              />
            ))}
          </Card>

          {/* 金額設定卡片 */}
          <Card style={cardStyle}>
            <Text style={sectionTitleStyle}>金額設定</Text>
            <UnitSelector value={unitAmount} onChange={setUnitAmount} />
          </Card>

          {/* 開始按鈕 */}
          <View style={buttonContainerStyle}>
            <Button
              onPress={handleStartGame}
              disabled={!canStart}
              loading={isLoading}
              size="lg"
            >
              開始牌局
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
