import React from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { MatchHistorySummary } from '../../types';
import { MatchHistoryCard } from './MatchHistoryCard';

interface MatchHistoryListProps {
  histories: MatchHistorySummary[];
  isLoading: boolean;
  onItemPress: (id: string) => void;
  onDelete: (id: string) => void;
}

export function MatchHistoryList({ 
  histories, 
  isLoading, 
  onItemPress, 
  onDelete 
}: MatchHistoryListProps) {
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center py-8">
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (histories.length === 0) {
    return (
      <View className="flex-1 justify-center items-center py-8">
        <Text className="text-gray-400 text-lg">尚無比賽記錄</Text>
        <Text className="text-gray-400 text-sm mt-1">開始新遊戲來建立記錄</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled={true}
    >
      {histories.map((item) => (
        <MatchHistoryCard
          key={item.id}
          history={item}
          onPress={() => onItemPress(item.id)}
          onDelete={() => onDelete(item.id)}
        />
      ))}
    </ScrollView>
  );
}
