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
    <View 
      className="mb-3 dark-panel rounded-xl border border-gold-500/30 overflow-hidden"
      style={{
        shadowColor: '#D4AF37',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
      }}
    >
      <Pressable onPress={onPress} className="p-4">
        <View className="flex-row justify-between items-start mb-2">
          <Text className="text-sm text-emerald-200">
            {formatDate(history.completedAt)}
          </Text>
          <Text className="text-xs text-gold-400">
            {history.totalRounds} 局
          </Text>
        </View>
        
        <View className="flex-row flex-wrap gap-2 mb-2">
          {history.players.map((player, index) => (
            <View key={player.id} className="flex-row items-center">
              <Text className={`text-base ${player.isWinner ? 'font-bold text-gold-400' : 'text-white'}`}>
                {player.name}
              </Text>
              <Text className={`ml-1 ${player.finalScore >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ({player.finalScore >= 0 ? '+' : ''}{player.finalScore})
              </Text>
              {index < history.players.length - 1 && (
                <Text className="text-emerald-500 mx-1">|</Text>
              )}
            </View>
          ))}
        </View>

        {winner && (
          <Text className="text-sm text-gold-400">
            🏆 贏家: {winner.name}
          </Text>
        )}
      </Pressable>
      
      {/* 刪除按鈕 - 放在 Pressable 外面 */}
      <View className="flex-row justify-end px-4 pb-3">
        <TouchableOpacity
          onPress={() => {
            console.log('TouchableOpacity onPress called');
            onDelete();
          }}
          className="px-3 py-1 rounded-full bg-red-900/50 border border-red-500/30"
        >
          <Text className="text-red-400 text-sm">刪除</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
