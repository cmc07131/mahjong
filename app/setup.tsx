import { useState, useRef } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, PanResponder, Animated } from 'react-native';
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

// 座位位置（桌上位置）
const SEAT_POSITIONS: Array<{
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  transform: Array<{ translateX?: number; translateY?: number }>;
}> = [
  { top: '15%', left: '50%', transform: [{ translateX: -30 }] },   // 0: 上 (東)
  { top: '50%', right: '15%', transform: [{ translateY: -15 }] },   // 1: 右 (南)
  { bottom: '15%', left: '50%', transform: [{ translateX: -30 }] }, // 2: 下 (西)
  { top: '50%', left: '15%', transform: [{ translateY: -15 }] },    // 3: 左 (北)
];

// 步驟類型
type SetupStep = 'names' | 'seating';

// 可拖拽的玩家組件
function DraggablePlayer({ 
  name, 
  index, 
  onDragStart,
  currentTheme 
}: { 
  name: string; 
  index: number; 
  onDragStart: (index: number) => void;
  currentTheme: any;
}) {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        onDragStart(index);
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        {
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
        },
      ]}
      className={`px-4 py-3 rounded-xl ${currentTheme.classes.panel} ${currentTheme.classes.panelBorder}`}
    >
      <Text className={`${currentTheme.classes.textPrimary} font-bold`}>
        {name}
      </Text>
    </Animated.View>
  );
}

export default function SetupScreen() {
  const startGame = useGameStore((state) => state.startGame);
  const { currentTheme } = useThemeStore();
  
  // 步驟狀態
  const [step, setStep] = useState<SetupStep>('names');
  
  // 玩家名稱狀態
  const [playerNames, setPlayerNames] = useState<string[]>(DEFAULT_NAMES);
  
  // 座位分配狀態
  const [seatAssignments, setSeatAssignments] = useState<(number | null)[]>([null, null, null, null]);
  
  // 單位金額狀態
  const [unitAmount, setUnitAmount] = useState(128);
  
  // 載入狀態
  const [isLoading, setIsLoading] = useState(false);
  
  // 拖拽狀態
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

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

  // 處理座位點擊（放置玩家）
  const handleSeatClick = (seatIndex: number) => {
    if (draggingIndex === null) return;
    
    setSeatAssignments((prev) => {
      const newAssignments = [...prev];
      // 移除該玩家之前的位置
      const prevSeat = newAssignments.indexOf(draggingIndex);
      if (prevSeat !== -1) {
        newAssignments[prevSeat] = null;
      }
      // 如果該座位已有其他玩家，先移除
      if (newAssignments[seatIndex] !== null) {
        newAssignments[seatIndex] = null;
      }
      // 分配新位置
      newAssignments[seatIndex] = draggingIndex;
      return newAssignments;
    });
    setDraggingIndex(null);
  };

  // 隨機分配座位
  const handleRandomSeating = () => {
    // 隨機選擇莊家
    const randomDealer = Math.floor(Math.random() * 4);
    
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
  const isSeatingComplete = seatAssignments.every((s) => s !== null);

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

  // 移除座位分配
  const handleRemoveSeat = (seatIndex: number) => {
    setSeatAssignments((prev) => {
      const newAssignments = [...prev];
      newAssignments[seatIndex] = null;
      return newAssignments;
    });
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
              {/* 說明文字 */}
              <View className="mb-4">
                <Text className={`${currentTheme.classes.textPrimary} font-bold text-lg mb-2`}>座位分配</Text>
                <Text className={`${currentTheme.classes.textSecondary} text-sm`}>
                  拖動玩家名稱到桌子上的位置，或點擊「隨機分配」
                </Text>
              </View>

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

              {/* 可拖拽的玩家列表 */}
              <View className={`${currentTheme.classes.panel} rounded-2xl ${currentTheme.classes.panelBorder} p-4 mb-4`}>
                <Text className={`${currentTheme.classes.textPrimary} font-bold mb-3`}>未分配的玩家</Text>
                <View className="flex-row flex-wrap gap-2">
                  {getUnassignedPlayers().map((playerIndex) => (
                    <DraggablePlayer
                      key={playerIndex}
                      name={playerNames[playerIndex]}
                      index={playerIndex}
                      onDragStart={setDraggingIndex}
                      currentTheme={currentTheme}
                    />
                  ))}
                </View>
                {getUnassignedPlayers().length === 0 && (
                  <Text className={`${currentTheme.classes.textSecondary} text-sm`}>
                    所有玩家已分配座位
                  </Text>
                )}
              </View>

              {/* 桌子和座位 */}
              <View className={`${currentTheme.classes.panel} rounded-2xl ${currentTheme.classes.panelBorder} p-4 mb-4`}>
                <Text className={`${currentTheme.classes.textPrimary} font-bold mb-3`}>麻將桌</Text>
                
                {/* 桌子 */}
                <View 
                  className="relative items-center justify-center"
                  style={{ height: 280 }}
                >
                  {/* 桌面背景 */}
                  <View 
                    className="absolute rounded-full"
                    style={{
                      width: 240,
                      height: 240,
                      backgroundColor: currentTheme.colors.mahjongTable.surface,
                      borderWidth: 8,
                      borderColor: currentTheme.colors.mahjongTable.frame,
                    }}
                  />
                  
                  {/* 中央文字 */}
                  <View className="absolute items-center justify-center">
                    <Text className={`${currentTheme.classes.textAccent} text-lg font-bold`}>
                      麻將桌
                    </Text>
                    <Text className={`${currentTheme.classes.textSecondary} text-xs`}>
                      點擊座位放置玩家
                    </Text>
                  </View>

                  {/* 四個座位 */}
                  {SEAT_POSITIONS.map((position, seatIndex) => {
                    const assignedPlayerIndex = seatAssignments[seatIndex];
                    const wind = WIND_ORDER[seatIndex];
                    const isEmpty = assignedPlayerIndex === null;
                    const isDraggingOver = draggingIndex !== null && isEmpty;
                    
                    return (
                      <TouchableOpacity
                        key={seatIndex}
                        className="absolute items-center justify-center"
                        style={{
                          ...position,
                          width: 60,
                          height: 60,
                        }}
                        onPress={() => handleSeatClick(seatIndex)}
                        activeOpacity={0.7}
                      >
                        {/* 座位背景 */}
                        <View 
                          className="absolute w-full h-full rounded-full"
                          style={{
                            backgroundColor: isEmpty 
                              ? (isDraggingOver ? currentTheme.colors.button.primary + '40' : currentTheme.colors.panel.secondary)
                              : WIND_COLORS[wind],
                            borderWidth: 2,
                            borderColor: isEmpty 
                              ? (isDraggingOver ? currentTheme.colors.button.primary : currentTheme.colors.panel.border)
                              : WIND_COLORS[wind],
                            opacity: isEmpty ? 0.8 : 1,
                          }}
                        />
                        
                        {/* 座位內容 */}
                        {isEmpty ? (
                          <View className="items-center">
                            <Text 
                              className="font-bold text-lg"
                              style={{ color: isDraggingOver ? currentTheme.colors.button.primary : currentTheme.colors.text.secondary }}
                            >
                              {WIND_SYMBOLS[wind]}
                            </Text>
                            <Text 
                              className="text-xs"
                              style={{ color: isDraggingOver ? currentTheme.colors.button.primary : currentTheme.colors.text.muted }}
                            >
                              {isDraggingOver ? '放置' : '空位'}
                            </Text>
                          </View>
                        ) : (
                          <TouchableOpacity
                            className="items-center"
                            onPress={() => handleRemoveSeat(seatIndex)}
                          >
                            <Text className="text-white font-bold text-sm">
                              {WIND_SYMBOLS[wind]}
                            </Text>
                            <Text className="text-white text-xs font-medium" numberOfLines={1}>
                              {playerNames[assignedPlayerIndex]}
                            </Text>
                          </TouchableOpacity>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* 座位分配列表（備用） */}
              {isSeatingComplete && (
                <View className={`${currentTheme.classes.panel} rounded-2xl ${currentTheme.classes.panelBorder} p-4 mb-4`}>
                  <Text className={`${currentTheme.classes.textPrimary} font-bold mb-3`}>座位分配確認</Text>
                  {WIND_ORDER.map((wind, seatIndex) => {
                    const playerIndex = seatAssignments[seatIndex];
                    if (playerIndex === null) return null;
                    
                    return (
                      <View key={wind} className="flex-row items-center mb-2">
                        <View 
                          className="w-8 h-8 rounded-full items-center justify-center mr-3"
                          style={{ backgroundColor: WIND_COLORS[wind] }}
                        >
                          <Text className="text-white font-bold text-sm">
                            {WIND_SYMBOLS[wind]}
                          </Text>
                        </View>
                        <Text className={`${currentTheme.classes.textPrimary} flex-1`}>
                          {playerNames[playerIndex]}
                        </Text>
                        <Text className={`${currentTheme.classes.textSecondary} text-sm`}>
                          {WIND_LABELS[wind]}
                        </Text>
                      </View>
                    );
                  })}
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