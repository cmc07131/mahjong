import { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useGameStore } from '../src/store/gameStore';
import { useThemeStore } from '../src/store/themeStore';
import { Wind } from '../src/types';

// 預設玩家名稱
const DEFAULT_NAMES = ['阿明', '阿強', '阿華', '阿東'];

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

// 座位順序（逆時針）
const WIND_ORDER: Wind[] = ['EAST', 'SOUTH', 'WEST', 'NORTH'];

// 步驟類型
type SetupStep = 'names' | 'seating';

export default function SetupScreen() {
  const startGame = useGameStore((state) => state.startGame);
  const { currentTheme } = useThemeStore();
  
  // 步驟狀態
  const [step, setStep] = useState<SetupStep>('names');
  
  // 玩家名稱狀態
  const [playerNames, setPlayerNames] = useState<string[]>(DEFAULT_NAMES);
  
  // 座位分配狀態
  const [dealerIndex, setDealerIndex] = useState<number | null>(null);
  const [seatAssignments, setSeatAssignments] = useState<(number | null)[]>([null, null, null, null]);
  
  // 單位金額狀態
  const [unitAmount, setUnitAmount] = useState(128);
  
  // 載入狀態
  const [isLoading, setIsLoading] = useState(false);

  // 更新玩家名稱
  const handleNameChange = (index: number, name: string) => {
    setPlayerNames((prev) => {
      const newNames = [...prev];
      newNames[index] = name;
      return newNames;
    });
  };

  // 檢查是否可以進入下一步
  const canProceedToSeating = playerNames.every((name) => name.trim().length > 0);

  // 選擇莊家
  const handleSelectDealer = (playerIndex: number) => {
    setDealerIndex(playerIndex);
    // 重置座位分配
    setSeatAssignments([null, null, null, null]);
    // 自動分配莊家到東位
    const newAssignments: (number | null)[] = [null, null, null, null];
    newAssignments[0] = playerIndex; // 東位 = seat 0
    setSeatAssignments(newAssignments);
  };

  // 選擇其他座位
  const handleSelectSeat = (seatIndex: number, playerIndex: number) => {
    setSeatAssignments((prev) => {
      const newAssignments = [...prev];
      // 移除該玩家之前的位置
      const prevSeat = newAssignments.indexOf(playerIndex);
      if (prevSeat !== -1) {
        newAssignments[prevSeat] = null;
      }
      // 分配新位置
      newAssignments[seatIndex] = playerIndex;
      return newAssignments;
    });
  };

  // 隨機分配座位
  const handleRandomSeating = () => {
    // 隨機選擇莊家
    const randomDealer = Math.floor(Math.random() * 4);
    setDealerIndex(randomDealer);
    
    // 建立玩家索引陣列
    const playerIndices = [0, 1, 2, 3];
    
    // 隨機打亂
    for (let i = playerIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [playerIndices[i], playerIndices[j]] = [playerIndices[j], playerIndices[i]];
    }
    
    // 找到莊家在打亂後的位置
    const dealerPosition = playerIndices.indexOf(randomDealer);
    
    // 重新排列，使莊家在位置 0
    const rotatedIndices = [
      ...playerIndices.slice(dealerPosition),
      ...playerIndices.slice(0, dealerPosition),
    ];
    
    setSeatAssignments(rotatedIndices);
  };

  // 檢查座位分配是否完成
  const isSeatingComplete = dealerIndex !== null && seatAssignments.every((s) => s !== null);

  // 取得未分配的玩家
  const getUnassignedPlayers = () => {
    const assigned = seatAssignments.filter((s) => s !== null);
    return [0, 1, 2, 3].filter((i) => !assigned.includes(i));
  };

  // 開始遊戲
  const handleStartGame = async () => {
    if (!isSeatingComplete) return;

    setIsLoading(true);
    
    try {
      // 準備玩家資料
      const playerInputs = seatAssignments.map((playerIndex, seatIndex) => ({
        id: `player-${seatIndex}`,
        name: playerNames[playerIndex!].trim(),
        seatIndex: seatIndex,
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

  return (
    <SafeAreaView className={`flex-1 ${currentTheme.classes.background}`} edges={['top']}>
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
            <Text className={`text-2xl font-bold ${currentTheme.classes.textAccent} mb-2`}>
              香港麻將計分
            </Text>
            <Text className={`text-sm ${currentTheme.classes.textSecondary}`}>
              {step === 'names' ? '輸入玩家名稱' : '選擇座位分配'}
            </Text>
          </View>

          {/* Step 1: 輸入名稱 */}
          {step === 'names' && (
            <>
              {/* 玩家名稱卡片 */}
              <View className={`${currentTheme.classes.panel} rounded-2xl ${currentTheme.classes.panelBorder} p-4 mb-4`}>
                <Text className={`${currentTheme.classes.textPrimary} font-bold text-lg mb-4`}>玩家名稱</Text>
                {playerNames.map((name, index) => (
                  <View key={index} className="flex-row items-center mb-3">
                    {/* Player Number Badge */}
                    <View 
                      className="w-10 h-10 rounded-full items-center justify-center mr-3"
                      style={{
                        backgroundColor: currentTheme.colors.button.primary,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                        shadowRadius: 2,
                        elevation: 2,
                      }}
                    >
                      <Text className="text-white font-bold text-base">
                        {index + 1}
                      </Text>
                    </View>
                    
                    {/* Input */}
                    <View className="flex-1">
                      <View 
                        className={`${currentTheme.classes.panel} ${currentTheme.classes.panelBorder} rounded-xl px-4 py-3`}
                        style={{
                          shadowColor: '#000',
                          shadowOffset: { width: 0, height: 1 },
                          shadowOpacity: 0.2,
                          shadowRadius: 2,
                          elevation: 1,
                        }}
                      >
                        <TextInput
                          value={name}
                          onChangeText={(text) => handleNameChange(index, text)}
                          placeholder={`玩家 ${index + 1} 名稱`}
                          placeholderTextColor={currentTheme.colors.text.muted}
                          className={`${currentTheme.classes.textPrimary} text-base`}
                          style={{ color: currentTheme.colors.text.primary, fontSize: 16 }}
                        />
                      </View>
                    </View>
                  </View>
                ))}
              </View>

              {/* 金額設定卡片 */}
              <View className={`${currentTheme.classes.panel} rounded-2xl ${currentTheme.classes.panelBorder} p-4 mb-4`}>
                <Text className={`${currentTheme.classes.textPrimary} font-bold text-lg mb-4`}>金額設定</Text>
                <Text className={`${currentTheme.classes.textSecondary} text-sm mb-3`}>10番多少錢？</Text>
                
                {/* Preset amounts */}
                <View className="flex-row flex-wrap gap-2 mb-3">
                  {[128, 256, 512].map((amount) => {
                    const isSelected = unitAmount === amount;
                    return (
                      <TouchableOpacity
                        key={amount}
                        className={`
                          px-4 py-2.5 rounded-xl items-center justify-center
                          ${isSelected 
                            ? 'gold-gradient' 
                            : `${currentTheme.classes.panel} ${currentTheme.classes.panelBorder}`
                          }
                        `}
                        style={{ minWidth: 70 }}
                        onPress={() => setUnitAmount(amount)}
                        activeOpacity={0.8}
                      >
                        <Text 
                          className={`
                            font-bold text-base
                            ${isSelected ? 'text-emerald-950' : currentTheme.classes.textPrimary}
                          `}
                        >
                          ${amount}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                
                {/* Custom amount hint */}
                <Text className={`${currentTheme.classes.textSecondary} text-xs`}>
                  目前設定：10番 ${unitAmount}
                </Text>
              </View>

              {/* 下一步按鈕 */}
              <View className="mt-6 mb-8">
                <TouchableOpacity
                  className={`
                    rounded-xl py-4 items-center justify-center
                    ${canProceedToSeating 
                      ? 'gold-gradient' 
                      : `${currentTheme.classes.panel} ${currentTheme.classes.panelBorder}`
                    }
                  `}
                  style={{
                    shadowColor: canProceedToSeating ? '#D4AF37' : '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: canProceedToSeating ? 0.5 : 0.2,
                    shadowRadius: 4,
                    elevation: canProceedToSeating ? 4 : 1,
                  }}
                  onPress={canProceedToSeating ? () => setStep('seating') : undefined}
                  disabled={!canProceedToSeating}
                  activeOpacity={0.8}
                >
                  <Text 
                    className={`
                      font-bold text-lg
                      ${canProceedToSeating ? 'text-emerald-950' : currentTheme.classes.textSecondary}
                    `}
                  >
                    下一步：選擇座位
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* Step 2: 選擇座位 */}
          {step === 'seating' && (
            <>
              {/* 選擇莊家 */}
              <View className={`${currentTheme.classes.panel} rounded-2xl ${currentTheme.classes.panelBorder} p-4 mb-4`}>
                <Text className={`${currentTheme.classes.textPrimary} font-bold text-lg mb-2`}>選擇莊家（東位）</Text>
                <Text className={`${currentTheme.classes.textSecondary} text-sm mb-4`}>莊家坐在東位，是第一局的開始者</Text>
                
                <View className="flex-row flex-wrap gap-2">
                  {playerNames.map((name, index) => {
                    const isSelected = dealerIndex === index;
                    return (
                      <TouchableOpacity
                        key={index}
                        className={`
                          px-4 py-3 rounded-xl items-center justify-center
                          ${isSelected 
                            ? 'gold-gradient' 
                            : `${currentTheme.classes.panel} ${currentTheme.classes.panelBorder}`
                          }
                        `}
                        onPress={() => handleSelectDealer(index)}
                        activeOpacity={0.8}
                      >
                        <View 
                          className="w-8 h-8 rounded-full items-center justify-center mb-1"
                          style={{ backgroundColor: WIND_COLORS.EAST }}
                        >
                          <Text className="text-white font-bold text-sm">東</Text>
                        </View>
                        <Text 
                          className={`
                            font-bold text-sm
                            ${isSelected ? 'text-emerald-950' : currentTheme.classes.textPrimary}
                          `}
                        >
                          {name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* 選擇其他座位 */}
              {dealerIndex !== null && (
                <View className={`${currentTheme.classes.panel} rounded-2xl ${currentTheme.classes.panelBorder} p-4 mb-4`}>
                  <Text className={`${currentTheme.classes.textPrimary} font-bold text-lg mb-2`}>選擇其他座位</Text>
                  <Text className={`${currentTheme.classes.textSecondary} text-sm mb-4`}>
                    莊家的右手邊是南位，對面是西位，左手邊是北位
                  </Text>
                  
                  {WIND_ORDER.map((wind, seatIndex) => {
                    // 跳過東位（已分配給莊家）
                    if (seatIndex === 0) return null;
                    
                    const assignedPlayerIndex = seatAssignments[seatIndex];
                    const unassignedPlayers = getUnassignedPlayers();
                    
                    return (
                      <View key={wind} className="mb-4">
                        <View className="flex-row items-center mb-2">
                          <View 
                            className="w-8 h-8 rounded-full items-center justify-center mr-2"
                            style={{ backgroundColor: WIND_COLORS[wind] }}
                          >
                            <Text className="text-white font-bold text-sm">
                              {WIND_SYMBOLS[wind]}
                            </Text>
                          </View>
                          <Text className={`${currentTheme.classes.textPrimary} font-medium`}>
                            {WIND_LABELS[wind]}
                          </Text>
                        </View>
                        
                        <View className="flex-row flex-wrap gap-2">
                          {unassignedPlayers.map((playerIndex) => (
                            <TouchableOpacity
                              key={playerIndex}
                              className={`
                                px-3 py-2 rounded-lg
                                ${assignedPlayerIndex === playerIndex
                                  ? 'gold-gradient' 
                                  : `${currentTheme.classes.panel} ${currentTheme.classes.panelBorder}`
                                }
                              `}
                              onPress={() => handleSelectSeat(seatIndex, playerIndex)}
                              activeOpacity={0.8}
                            >
                              <Text 
                                className={`
                                  font-medium text-sm
                                  ${assignedPlayerIndex === playerIndex ? 'text-emerald-950' : currentTheme.classes.textPrimary}
                                `}
                              >
                                {playerNames[playerIndex]}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}

              {/* 隨機分配按鈕 */}
              <View className="mb-4">
                <TouchableOpacity
                  className={`${currentTheme.classes.panel} ${currentTheme.classes.panelBorder} rounded-xl py-3 items-center justify-center`}
                  onPress={handleRandomSeating}
                  activeOpacity={0.8}
                >
                  <Text className={`${currentTheme.classes.textPrimary} font-bold`}>
                    🎲 隨機分配座位
                  </Text>
                </TouchableOpacity>
              </View>

              {/* 座位分配預覽 */}
              {isSeatingComplete && (
                <View className={`${currentTheme.classes.panel} rounded-2xl ${currentTheme.classes.panelBorder} p-4 mb-4`}>
                  <Text className={`${currentTheme.classes.textPrimary} font-bold text-lg mb-3`}>座位分配預覽</Text>
                  
                  <View className="flex-row flex-wrap justify-center gap-3">
                    {WIND_ORDER.map((wind, seatIndex) => {
                      const playerIndex = seatAssignments[seatIndex];
                      if (playerIndex === null) return null;
                      
                      return (
                        <View key={wind} className="items-center">
                          <View 
                            className="w-12 h-12 rounded-full items-center justify-center mb-1"
                            style={{ backgroundColor: WIND_COLORS[wind] }}
                          >
                            <Text className="text-white font-bold text-base">
                              {WIND_SYMBOLS[wind]}
                            </Text>
                          </View>
                          <Text className={`${currentTheme.classes.textPrimary} text-xs font-medium`}>
                            {playerNames[playerIndex]}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* 操作按鈕 */}
              <View className="flex-row gap-3 mt-4 mb-8">
                <TouchableOpacity
                  className={`flex-1 ${currentTheme.classes.panel} ${currentTheme.classes.panelBorder} rounded-xl py-4 items-center justify-center`}
                  onPress={() => setStep('names')}
                  activeOpacity={0.8}
                >
                  <Text className={`${currentTheme.classes.textPrimary} font-bold`}>
                    ← 返回
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  className={`
                    flex-1 rounded-xl py-4 items-center justify-center
                    ${isSeatingComplete 
                      ? 'gold-gradient' 
                      : `${currentTheme.classes.panel} ${currentTheme.classes.panelBorder}`
                    }
                  `}
                  style={{
                    shadowColor: isSeatingComplete ? '#D4AF37' : '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: isSeatingComplete ? 0.5 : 0.2,
                    shadowRadius: 4,
                    elevation: isSeatingComplete ? 4 : 1,
                  }}
                  onPress={isSeatingComplete && !isLoading ? handleStartGame : undefined}
                  disabled={!isSeatingComplete || isLoading}
                  activeOpacity={0.8}
                >
                  <Text 
                    className={`
                      font-bold text-lg
                      ${isSeatingComplete ? 'text-emerald-950' : currentTheme.classes.textSecondary}
                    `}
                  >
                    {isLoading ? '載入中...' : '開始牌局'}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}