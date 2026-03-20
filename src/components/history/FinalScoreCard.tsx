import React from 'react';
import { View, Text } from 'react-native';
import { Card } from '../common/Card';
import { PlayerHistoryDetail } from '../../types';

interface FinalScoreCardProps {
  players: PlayerHistoryDetail[];
  unit: number;
}

export function FinalScoreCard({ players, unit }: FinalScoreCardProps) {
  const sortedPlayers = [...players].sort((a, b) => b.finalScore - a.finalScore);

  return (
    <View 
      className="m-4 dark-panel rounded-xl border border-gold-500/30 p-4"
      style={{
        shadowColor: '#D4AF37',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
      }}
    >
      <Text className="text-lg font-semibold text-gold-400 mb-3">
        🏆 最終分數
      </Text>
      {sortedPlayers.map((player, index) => (
        <View 
          key={player.id} 
          className={`flex-row justify-between items-center py-2 ${
            index < sortedPlayers.length - 1 ? 'border-b border-emerald-700/30' : ''
          }`}
        >
          <View className="flex-row items-center">
            {index === 0 && <Text className="mr-2">👑</Text>}
            <Text className={`text-base ${index === 0 ? 'font-bold text-gold-400' : 'text-white'}`}>
              {player.name}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Text className={`text-lg font-semibold ${
              player.finalScore >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {player.finalScore >= 0 ? '+' : ''}{player.finalScore}
            </Text>
            <Text className="text-emerald-300 text-sm ml-1">
              ({player.finalScore >= 0 ? '+' : ''}{player.finalScore * unit}元)
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
