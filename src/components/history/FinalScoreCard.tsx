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
    <Card className="m-4">
      <Text className="text-lg font-semibold text-gray-800 mb-3">
        最終分數
      </Text>
      {sortedPlayers.map((player, index) => (
        <View 
          key={player.id} 
          className={`flex-row justify-between items-center py-2 ${
            index < sortedPlayers.length - 1 ? 'border-b border-gray-100' : ''
          }`}
        >
          <View className="flex-row items-center">
            {index === 0 && <Text className="mr-2">🏆</Text>}
            <Text className={`text-base ${index === 0 ? 'font-bold text-green-600' : 'text-gray-700'}`}>
              {player.name}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Text className={`text-lg font-semibold ${
              player.finalScore >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {player.finalScore >= 0 ? '+' : ''}{player.finalScore}
            </Text>
            <Text className="text-gray-400 text-sm ml-1">
              ({player.finalScore >= 0 ? '+' : ''}{player.finalScore * unit}元)
            </Text>
          </View>
        </View>
      ))}
    </Card>
  );
}
