import { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
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

// 風位顏色
const WIND_COLORS: Record<Wind, string> = {
  EAST: '#dc2626',   // 紅色 - 東
  SOUTH: '#16a34a',  // 綠色 - 南
  WEST: '#2563eb',   // 藍色 - 西
  NORTH: '#1f2937',  // 黑色 - 北
};

const WIND_SYMBOLS: Record<Wind, string> = {
  EAST: '東',
  SOUTH: '南',
  WEST: '西',
  NORTH: '北',
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

  return (
    <SafeAreaView className="flex-1 emerald-gradient" edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, padding: 16 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* 標題區 */}
          <View className="items-center mb-6 mt-2">
            <Text className="text-2xl font-bold text-gold-400 mb-2">
              香港麻將計分
            </Text>
            <Text className="text-sm text-emerald-300">
              設定玩家與金額，開始牌局
            </Text>
          </View>

          {/* 玩家設定卡片 */}
          <View className="dark-panel rounded-2xl border border-gold-500/50 p-4 mb-4">
            <Text className="text-white font-bold text-lg mb-4">玩家設定</Text>
            {players.map((player) => (
              <View key={player.wind} className="flex-row items-center mb-3">
                {/* Wind Badge */}
                <View 
                  className="w-10 h-10 rounded-full items-center justify-center mr-3"
                  style={{
                    backgroundColor: WIND_COLORS[player.wind],
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 2,
                    elevation: 2,
                  }}
                >
                  <Text className="text-white font-bold text-base">
                    {WIND_SYMBOLS[player.wind]}
                  </Text>
                </View>
                
                {/* Input */}
                <View className="flex-1">
                  <View 
                    className="bg-emerald-900/50 border border-gold-500/30 rounded-xl px-4 py-3"
                    style={{
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.2,
                      shadowRadius: 2,
                      elevation: 1,
                    }}
                  >
                    <TextInput
                      value={player.name}
                      onChangeText={(text) => handlePlayerChange(player.wind, text)}
                      placeholder={`輸入${WIND_LABELS[player.wind]}名稱`}
                      placeholderTextColor="#6b7280"
                      className="text-white text-base"
                      style={{ color: 'white', fontSize: 16 }}
                    />
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* 金額設定卡片 */}
          <View className="dark-panel rounded-2xl border border-gold-500/50 p-4 mb-4">
            <Text className="text-white font-bold text-lg mb-4">金額設定</Text>
            <Text className="text-gold-300 text-sm mb-3">選擇每番金額（港幣）</Text>
            
            {/* Preset amounts */}
            <View className="flex-row flex-wrap gap-2 mb-3">
              {[1, 3, 5, 10].map((amount) => {
                const isSelected = unitAmount === amount;
                return (
                  <TouchableOpacity
                    key={amount}
                    className={`
                      px-4 py-2.5 rounded-xl items-center justify-center
                      ${isSelected 
                        ? 'gold-gradient' 
                        : 'bg-emerald-800 border border-gold-500/30'
                      }
                    `}
                    style={{ minWidth: 70 }}
                    onPress={() => setUnitAmount(amount)}
                    activeOpacity={0.8}
                  >
                    <Text 
                      className={`
                        font-bold text-base
                        ${isSelected ? 'text-emerald-950' : 'text-white'}
                      `}
                    >
                      ${amount}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            
            {/* Custom amount hint */}
            <Text className="text-emerald-400 text-xs">
              目前設定：每番 ${unitAmount} 港幣
            </Text>
          </View>

          {/* 開始按鈕 */}
          <View className="mt-6 mb-8">
            <TouchableOpacity
              className={`
                rounded-xl py-4 items-center justify-center
                ${canStart 
                  ? 'gold-gradient' 
                  : 'bg-emerald-900/50 border border-gold-500/20'
                }
              `}
              style={{
                shadowColor: canStart ? '#D4AF37' : '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: canStart ? 0.5 : 0.2,
                shadowRadius: 4,
                elevation: canStart ? 4 : 1,
              }}
              onPress={canStart && !isLoading ? handleStartGame : undefined}
              disabled={!canStart || isLoading}
              activeOpacity={0.8}
            >
              <Text 
                className={`
                  font-bold text-lg
                  ${canStart ? 'text-emerald-950' : 'text-emerald-700'}
                `}
              >
                {isLoading ? '載入中...' : '開始牌局'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
