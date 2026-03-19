import { useState, useMemo } from 'react';
import { View, ScrollView, Alert, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useGameStore } from '../src/store/gameStore';
import { MahjongTable, ActionPanel, BottomNavigation } from '../src/components/game';
import { Button } from '../src/components/common';
import { WinType, CurrentRound } from '../src/types';
import { calculatePreviewChanges } from '../src/utils/scoring';

export default function GameScreen() {
  const router = useRouter();
  
  // Get state from store
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

  // Local UI state
  const [selectedFan, setSelectedFan] = useState<number | null>(null);
  const [selectedWinnerId, setSelectedWinnerId] = useState<string | null>(null);
  const [selectedWinType, setSelectedWinType] = useState<WinType | null>(null);
  const [selectedLoserId, setSelectedLoserId] = useState<string | null>(null);

  // Calculate preview score changes
  const previewChanges = useMemo(() => {
    if (!selectedFan || !selectedWinnerId || !selectedWinType) {
      return {};
    }
    
    // For RON, need to select loser
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

  // Reset action area
  const resetSelections = () => {
    setSelectedFan(null);
    setSelectedWinnerId(null);
    setSelectedWinType(null);
    setSelectedLoserId(null);
  };

  // Handle fan selection
  const handleSelectFan = (fan: number) => {
    setSelectedFan(fan);
  };

  // Handle winner selection
  const handleSelectWinner = (playerId: string) => {
    setSelectedWinnerId(playerId);
    // If selected winner was the loser, clear loser selection
    if (selectedLoserId === playerId) {
      setSelectedLoserId(null);
    }
  };

  // Handle win type selection
  const handleSelectWinType = (winType: WinType) => {
    setSelectedWinType(winType);
    // Clear loser when switching to self-draw
    if (winType === 'SELF_DRAW') {
      setSelectedLoserId(null);
    }
  };

  // Handle loser selection
  const handleSelectLoser = (playerId: string) => {
    setSelectedLoserId(playerId);
  };

  // Confirm round
  const handleConfirm = () => {
    if (!selectedFan || !selectedWinnerId || !selectedWinType) {
      return;
    }

    if (selectedWinType === 'RON' && !selectedLoserId) {
      return;
    }

    // Set current round data
    const roundData: CurrentRound = {
      winnerId: selectedWinnerId,
      winType: selectedWinType,
      fan: selectedFan,
      loserIds: selectedWinType === 'RON' && selectedLoserId ? [selectedLoserId] : [],
    };

    setCurrentRound(roundData);
    
    // Confirm round
    confirmRound();
    
    // Reset action area
    resetSelections();
  };

  // Handle draw
  const handleDraw = () => {
    // Web uses confirm, native uses Alert
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

  // Handle Undo
  const handleUndo = () => {
    if (canUndo()) {
      undo();
      resetSelections();
    }
  };

  // Handle finish game
  const handleFinish = () => {
    // Web uses confirm, native uses Alert
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

  // Handle history button press
  const handleHistoryPress = () => {
    router.push('/history');
  };

  // Handle settings button press
  const handleSettingsPress = () => {
    // Future: Navigate to settings
    Alert.alert('設定', '設定功能即將推出');
  };

  // Check game status
  if (status !== 'PLAYING' || players.length !== 4) {
    return (
      <SafeAreaView className="flex-1 emerald-gradient" edges={['top']}>
        <View className="flex-1 items-center justify-center p-4">
          <Text className="text-white text-xl font-bold mb-4">
            尚未開始遊戲
          </Text>
          <Text className="text-emerald-200 text-base mb-6 text-center">
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
    <SafeAreaView className="flex-1 emerald-gradient" edges={['top']}>
      {/* Cloud pattern overlay */}
      <View className="absolute inset-0 cloud-pattern opacity-30" />
      
      <View className="flex-1">
        {/* Mahjong Table Area - Fixed height */}
        <View className="h-[380px]">
          <MahjongTable
            players={players}
            roundScoreChanges={previewChanges}
            prevailingWind={prevailingWind}
            roundNumber={roundCount + 1}
          />
        </View>

        {/* Action Panel - Scrollable */}
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{ flexGrow: 1 }}
        >
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

        {/* Bottom Navigation - Fixed at bottom */}
        <BottomNavigation
          onHistoryPress={handleHistoryPress}
          onSettingsPress={handleSettingsPress}
        />
      </View>
    </SafeAreaView>
  );
}
