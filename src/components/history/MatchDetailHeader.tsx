import React from 'react';
import { View, Text } from 'react-native';
import { MatchHistoryDetail } from '../../types';

interface MatchDetailHeaderProps {
  history: MatchHistoryDetail;
}

export function MatchDetailHeader({ history }: MatchDetailHeaderProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View className="bg-white p-4 border-b border-gray-200">
      <Text className="text-2xl font-bold text-gray-800 mb-2">
        比賽詳情
      </Text>
      <View className="flex-row justify-between">
        <Text className="text-gray-500">
          開始: {formatDate(history.createdAt)}
        </Text>
        <Text className="text-gray-500">
          {history.totalRounds} 局
        </Text>
      </View>
      <Text className="text-gray-500 mt-1">
        結束: {formatDate(history.completedAt)}
      </Text>
    </View>
  );
}
