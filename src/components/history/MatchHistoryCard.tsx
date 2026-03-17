import React from 'react';
import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import { MatchHistorySummary } from '../../types';
import { Card } from '../common/Card';

interface MatchHistoryCardProps {
  history: MatchHistorySummary;
  onPress: () => void;
  onDelete: () => void;
}

export function MatchHistoryCard({ history, onPress, onDelete }: MatchHistoryCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const winner = history.players.find(p => p.isWinner);

  return (
    <Card className="mb-3">
      <Pressable onPress={onPress} className="p-4">
        <View className="flex-row justify-between items-start mb-2">
          <Text className="text-sm text-gray-500">
            {formatDate(history.completedAt)}
          </Text>
          <Text className="text-xs text-gray-400">
            {history.totalRounds} 局
          </Text>
        </View>
        
        <View className="flex-row flex-wrap gap-2 mb-2">
          {history.players.map((player, index) => (
            <View key={player.id} className="flex-row items-center">
              <Text className={`text-base ${player.isWinner ? 'font-bold text-green-600' : 'text-gray-700'}`}>
                {player.name}
              </Text>
              <Text className={`ml-1 ${player.finalScore >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                ({player.finalScore >= 0 ? '+' : ''}{player.finalScore})
              </Text>
              {index < history.players.length - 1 && (
                <Text className="text-gray-300 mx-1">|</Text>
              )}
            </View>
          ))}
        </View>

        {winner && (
          <Text className="text-sm text-green-600">
            🏆 贏家: {winner.name}
          </Text>
        )}
      </Pressable>
      
      {/* 刪除按鈕 */}
      <View className="flex-row justify-end px-4 pb-3">
        <TouchableOpacity
          onPress={onDelete}
          className="px-3 py-1 rounded-full bg-red-50"
        >
          <Text className="text-red-500 text-sm">刪除</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}
