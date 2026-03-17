import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../src/components/common/Button';
import { MatchHistoryList } from '../src/components/history';
import { useHistoryStore } from '../src/store/historyStore';
import { useGameStore } from '../src/store/gameStore';

export default function HomeScreen() {
  const router = useRouter();
  const { histories, isLoading, loadHistories, deleteHistory } = useHistoryStore();
  const { players, resetGame } = useGameStore();
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
    Alert.alert(
      '確認刪除',
      '確定要刪除這場比賽記錄嗎？此操作無法復原。',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '刪除', 
          style: 'destructive',
          onPress: () => deleteHistory(id)
        }
      ]
    );
  };

  const hasCurrentGame = players.length > 0;

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-4 pt-6">
        {/* 標題 */}
        <Text className="text-3xl font-bold text-gray-800 mb-6">
          麻將計分
        </Text>

        {/* 新遊戲按鈕 */}
        <Button
          onPress={handleNewGame}
          className="mb-4"
        >
          開始新遊戲
        </Button>

        {/* 繼續遊戲（如果有進行中的遊戲） */}
        {hasCurrentGame && (
          <TouchableOpacity
            onPress={() => router.push('/game')}
            className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4"
          >
            <Text className="text-blue-700 font-semibold text-lg">
              繼續遊戲
            </Text>
            <Text className="text-blue-500 text-sm mt-1">
              {players.length} 位玩家
            </Text>
          </TouchableOpacity>
        )}

        {/* 歷史記錄切換 */}
        <View className="flex-row justify-between items-center mt-4 mb-3">
          <Text className="text-xl font-semibold text-gray-700">
            比賽記錄
          </Text>
          <TouchableOpacity onPress={() => setShowHistory(!showHistory)}>
            <Text className="text-indigo-600">
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
              onDelete={handleDeleteHistory}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}
