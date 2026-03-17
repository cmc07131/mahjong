import React, { useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useHistoryStore } from '../../src/store/historyStore';
import { MatchDetailHeader } from '../../src/components/history/MatchDetailHeader';
import { FinalScoreCard } from '../../src/components/history/FinalScoreCard';
import { RoundHistoryList } from '../../src/components/history/RoundHistoryList';
import { Button } from '../../src/components/common/Button';

export default function HistoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { currentHistory, isLoading, loadHistoryDetail, deleteHistory } = useHistoryStore();

  useEffect(() => {
    if (id) {
      loadHistoryDetail(id);
    }
  }, [id]);

  const handleDelete = () => {
    Alert.alert(
      '確認刪除',
      '確定要刪除這場比賽記錄嗎？此操作無法復原。',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '刪除',
          style: 'destructive',
          onPress: async () => {
            await deleteHistory(id);
            router.back();
          }
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (!currentHistory) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-gray-500">找不到比賽記錄</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text className="text-indigo-600">返回首頁</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <MatchDetailHeader history={currentHistory} />
        <FinalScoreCard players={currentHistory.players} unit={currentHistory.unit} />
        <RoundHistoryList rounds={currentHistory.rounds} players={currentHistory.players} />
      </ScrollView>
      
      {/* 底部操作按鈕 */}
      <View className="flex-row p-4 bg-white border-t border-gray-200 gap-3">
        <Button
          onPress={handleDelete}
          variant="outline"
          size="md"
          className="flex-1"
        >
          刪除記錄
        </Button>
        <Button
          onPress={() => router.back()}
          variant="primary"
          size="md"
          className="flex-1"
        >
          返回
        </Button>
      </View>
    </View>
  );
}
