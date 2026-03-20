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
    <View 
      className="dark-panel p-4 border-b border-gold-500/30"
      style={{
        shadowColor: '#D4AF37',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
      }}
    >
      <Text className="text-2xl font-bold text-gold-400 mb-2">
        📋 比賽詳情
      </Text>
      <View className="flex-row justify-between">
        <Text className="text-emerald-200">
          開始: {formatDate(history.createdAt)}
        </Text>
        <Text className="text-gold-400">
          {history.totalRounds} 局
        </Text>
      </View>
      <Text className="text-emerald-200 mt-1">
        結束: {formatDate(history.completedAt)}
      </Text>
    </View>
  );
}
