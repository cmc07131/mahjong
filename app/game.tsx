import { useState, useMemo } from 'react';
import { View, ScrollView, Alert, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useGameStore } from '../src/store/gameStore';
import { MahjongTable, ActionPanel } from '../src/components/game';
import { Button } from '../src/components/common';
import { WinType, CurrentRound } from '../src/types';
import { calculatePreviewChanges } from '../src/utils/scoring';

export default function GameScreen() {
  const router = useRouter();
  
  // 從 store 取得狀態
  const {
    players,
    dealerIndex,
    prevailingWind,
    roundCount,
    unitAmount,
    status,
    currentRound,
    setCurrentRound,
    confirmRound,
    processDraw,
    undo,
    canUndo,
    finishGame,
  } = useGameStore();

  // 本地 UI 狀態
  const [selectedFan, setSelectedFan] = useState<number | null>(null);
  const [selectedWinnerId, setSelectedWinnerId] = useState<string | null>(null);
  const [selectedWinType, setSelectedWinType] = useState<WinType | null>(null);
  const [selectedLoserId, setSelectedLoserId] = useState<string | null>(null);

  // 計算預覽分數變動
  const previewChanges = useMemo(() => {
    if (!selectedFan || !selectedWinnerId || !selectedWinType) {
      return {};
    }
    
    // 出銃時需要選擇出銃者
    if (selectedWinType === 'RON' && !selectedLoserId) {
      return {};
    }

    return calculatePreviewChanges(
      selectedWinnerId,
      selectedWinType,
      selectedFan,
      unitAmount,
      players,
      selectedWinType === 'RON' ? selectedLoserId || undefined : undefined
    );
  }, [selectedFan, selectedWinnerId, selectedWinType, selectedLoserId, unitAmount, players]);

  // 重置操作區
  const resetSelections = () => {
    setSelectedFan(null);
    setSelectedWinnerId(null);
    setSelectedWinType(null);
    setSelectedLoserId(null);
  };

  // 處理番數選擇
  const handleSelectFan = (fan: number) => {
    setSelectedFan(fan);
  };

  // 處理贏家選擇
  const handleSelectWinner = (playerId: string) => {
    setSelectedWinnerId(playerId);
    // 如果選擇的贏家是原本的出銃者，清除出銃者選擇
    if (selectedLoserId === playerId) {
      setSelectedLoserId(null);
    }
  };

  // 處理食糊方式選擇
  const handleSelectWinType = (winType: WinType) => {
    setSelectedWinType(winType);
    // 切換到自摸時清除出銃者
    if (winType === 'SELF_DRAW') {
      setSelectedLoserId(null);
    }
  };

  // 處理出銃者選擇
  const handleSelectLoser = (playerId: string) => {
    setSelectedLoserId(playerId);
  };

  // 確認本局
  const handleConfirm = () => {
    if (!selectedFan || !selectedWinnerId || !selectedWinType) {
      return;
    }

    if (selectedWinType === 'RON' && !selectedLoserId) {
      return;
    }

    // 設定當前回合資料
    const roundData: CurrentRound = {
      winnerId: selectedWinnerId,
      winType: selectedWinType,
      fan: selectedFan,
      loserIds: selectedWinType === 'RON' && selectedLoserId ? [selectedLoserId] : [],
    };

    setCurrentRound(roundData);
    
    // 確認回合
    confirmRound();
    
    // 重置操作區
    resetSelections();
  };

  // 處理流局
  const handleDraw = () => {
    // Web 使用 confirm，原生使用 Alert
    if (typeof window !== 'undefined' && typeof window.confirm === 'function') {
      if (window.confirm('確定要宣告流局嗎？')) {
        processDraw();
        resetSelections();
      }
    } else {
      Alert.alert(
        '確認流局',
        '確定要宣告流局嗎？',
        [
          { text: '取消', style: 'cancel' },
          {
            text: '確定',
            onPress: () => {
              processDraw();
              resetSelections();
            }
          },
        ]
      );
    }
  };

  // 處理 Undo
  const handleUndo = () => {
    if (canUndo()) {
      undo();
      resetSelections();
    }
  };

  // 處理結束牌局
  const handleFinish = () => {
    // Web 使用 confirm，原生使用 Alert
    if (typeof window !== 'undefined' && typeof window.confirm === 'function') {
      if (window.confirm('確定要結束牌局並進入結算嗎？')) {
        finishGame();
        router.replace('/settlement');
      }
    } else {
      Alert.alert(
        '結束牌局',
        '確定要結束牌局並進入結算嗎？',
        [
          { text: '取消', style: 'cancel' },
          {
            text: '確定',
            onPress: () => {
              finishGame();
              router.replace('/settlement');
            }
          },
        ]
      );
    }
  };

  // 檢查遊戲狀態
  if (status !== 'PLAYING' || players.length !== 4) {
    return (
      <SafeAreaView className="flex-1 bg-green-800">
        <View className="flex-1 items-center justify-center p-4">
          <Text className="text-white text-xl font-bold mb-4">
            尚未開始遊戲
          </Text>
          <Text className="text-green-200 text-base mb-6 text-center">
            請先設定玩家資料開始新牌局
          </Text>
          <Button
            onPress={() => router.replace('/setup')}
            variant="primary"
            size="lg"
          >
            開始新遊戲
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-green-800" edges={['top']}>
      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ flexGrow: 1 }}
        bounces={false}
      >
        {/* 麻將桌區域 */}
        <View className="flex-1 min-h-[400px]">
          <MahjongTable
            players={players}
            roundScoreChanges={previewChanges}
            prevailingWind={prevailingWind}
            roundNumber={roundCount + 1}
          />
        </View>

        {/* 核心操作區 */}
        <ActionPanel
          players={players}
          selectedFan={selectedFan}
          onSelectFan={handleSelectFan}
          selectedWinnerId={selectedWinnerId}
          onSelectWinner={handleSelectWinner}
          selectedWinType={selectedWinType}
          onSelectWinType={handleSelectWinType}
          selectedLoserId={selectedLoserId}
          onSelectLoser={handleSelectLoser}
          onConfirm={handleConfirm}
          onDraw={handleDraw}
          onUndo={handleUndo}
          onFinish={handleFinish}
          canUndo={canUndo()}
          previewChanges={previewChanges}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
