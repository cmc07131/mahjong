import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../src/components/common/Button';
import { MatchHistoryList } from '../src/components/history';
import { useHistoryStore } from '../src/store/historyStore';
import { useGameStore } from '../src/store/gameStore';
import { useThemeStore } from '../src/store/themeStore';

export default function HomeScreen() {
  const router = useRouter();
  const { histories, isLoading, loadHistories, deleteHistory } = useHistoryStore();
  const { players, resetGame } = useGameStore();
  const { currentTheme } = useThemeStore();
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    loadHistories();
  }, []);

  const handleNewGame = () => {
    resetGame();
    router.push('/setup');
  };

  const handleHistoryPress = (id: string) => {
    router.push(`/history/${id}`);
  };

  const handleDeleteHistory = (id: string) => {
    console.log('Delete button pressed for history:', id);
    
    // Use window.confirm for web, Alert.alert for native
    if (typeof window !== 'undefined' && typeof window.confirm === 'function') {
      if (window.confirm('確定要刪除這場比賽記錄嗎？此操作無法復原。')) {
        console.log('Deleting history:', id);
        deleteHistory(id);
      }
    } else {
      Alert.alert(
        '確認刪除',
        '確定要刪除這場比賽記錄嗎？此操作無法復原。',
        [
          { text: '取消', style: 'cancel' },
          {
            text: '刪除',
            style: 'destructive',
            onPress: () => {
              console.log('Deleting history:', id);
              deleteHistory(id);
            }
          }
        ]
      );
    }
  };

  const hasCurrentGame = players.length > 0;

  return (
    <View className={`flex-1 ${currentTheme.classes.background}`}>
      {/* Cloud pattern overlay */}
      <View className="absolute inset-0 cloud-pattern opacity-30" />
      
      <ScrollView className="flex-1 px-4 pt-6">
        {/* 標題 */}
        <View className="mb-6">
          <Text className={`text-3xl font-bold ${currentTheme.classes.textAccent} mb-2`}>
            麻將計分
          </Text>
          <Text className={`${currentTheme.classes.textSecondary} text-base`}>
            香港麻將計分系統
          </Text>
        </View>

        {/* 新遊戲按鈕 */}
        <Button
          onPress={handleNewGame}
          variant="primary"
          size="lg"
          className="mb-4"
        >
          開始新遊戲
        </Button>

        {/* 繼續遊戲（如果有進行中的遊戲） */}
        {hasCurrentGame && (
          <TouchableOpacity
            onPress={() => router.push('/game')}
            className={`${currentTheme.classes.panel} rounded-xl p-4 mb-4 ${currentTheme.classes.panelBorder}`}
            style={{
              shadowColor: currentTheme.colors.shadow.color,
              shadowOffset: currentTheme.colors.shadow.offset,
              shadowOpacity: currentTheme.colors.shadow.opacity,
              shadowRadius: currentTheme.colors.shadow.radius,
              elevation: currentTheme.colors.shadow.elevation,
            }}
          >
            <Text className={`${currentTheme.classes.textAccent} font-semibold text-lg`}>
              🎮 繼續遊戲
            </Text>
            <Text className={`${currentTheme.classes.textSecondary} text-sm mt-1`}>
              {players.length} 位玩家
            </Text>
          </TouchableOpacity>
        )}

        {/* 歷史記錄切換 */}
        <View className="flex-row justify-between items-center mt-6 mb-3">
          <Text className={`text-xl font-semibold ${currentTheme.classes.textAccent}`}>
            📜 比賽記錄
          </Text>
          <TouchableOpacity 
            onPress={() => setShowHistory(!showHistory)}
            className={`px-3 py-1 rounded-full ${currentTheme.classes.panel} ${currentTheme.classes.panelBorder}`}
          >
            <Text className={`${currentTheme.classes.textAccent} text-sm`}>
              {showHistory ? '收起' : '展開'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 歷史記錄列表 */}
        {showHistory && (
          <View className="h-80">
            <MatchHistoryList
              histories={histories}
              isLoading={isLoading}
              onItemPress={handleHistoryPress}
              onDelete={(id) => handleDeleteHistory(id)}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}
