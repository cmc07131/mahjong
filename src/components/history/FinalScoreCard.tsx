import React from 'react';
import { View, Text } from 'react-native';
import { Card } from '../common/Card';
import { PlayerHistoryDetail } from '../../types';
import { useThemeStore } from '../../store/themeStore';

interface FinalScoreCardProps {
  players: PlayerHistoryDetail[];
  unit: number;
}

export function FinalScoreCard({ players, unit }: FinalScoreCardProps) {
  const { currentTheme } = useThemeStore();
  const sortedPlayers = [...players].sort((a, b) => b.finalScore - a.finalScore);

  return (
    <View 
      className={`m-4 ${currentTheme.classes.panel} rounded-xl ${currentTheme.classes.panelBorder} p-4`}
      style={{
        shadowColor: currentTheme.colors.shadow.color,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: currentTheme.colors.shadow.opacity,
        shadowRadius: currentTheme.colors.shadow.radius,
        elevation: currentTheme.colors.shadow.elevation,
      }}
    >
      <Text className={`text-lg font-semibold ${currentTheme.classes.textAccent} mb-3`}>
        🏆 最終分數
      </Text>
      {sortedPlayers.map((player, index) => (
        <View 
          key={player.id} 
          className={`flex-row justify-between items-center py-2 ${
            index < sortedPlayers.length - 1 ? `${currentTheme.classes.panelBorder}` : ''
          }`}
        >
          <View className="flex-row items-center">
            {index === 0 && <Text className="mr-2">👑</Text>}
            <Text className={`text-base ${index === 0 ? `font-bold ${currentTheme.classes.textAccent}` : currentTheme.classes.textPrimary}`}>
              {player.name}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Text className={`text-lg font-semibold ${
              player.finalScore >= 0 ? currentTheme.classes.scorePositive : currentTheme.classes.scoreNegative
            }`}>
              {player.finalScore >= 0 ? '+' : ''}{player.finalScore}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
