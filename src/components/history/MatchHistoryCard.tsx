import React from 'react';
import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import { MatchHistorySummary } from '../../types';
import { Card } from '../common/Card';
import { useThemeStore } from '../../store/themeStore';

interface MatchHistoryCardProps {
  history: MatchHistorySummary;
  onPress: () => void;
  onDelete: () => void;
}

export function MatchHistoryCard({ history, onPress, onDelete }: MatchHistoryCardProps) {
  const { currentTheme } = useThemeStore();
  
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
      className={`mb-3 ${currentTheme.classes.panel} rounded-xl ${currentTheme.classes.panelBorder} overflow-hidden`}
      style={{
        shadowColor: currentTheme.colors.shadow.color,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: currentTheme.colors.shadow.opacity,
        shadowRadius: currentTheme.colors.shadow.radius,
        elevation: currentTheme.colors.shadow.elevation,
      }}
    >
      <Pressable onPress={onPress} className="p-4">
        <View className="flex-row justify-between items-start mb-2">
          <Text className={`text-sm ${currentTheme.classes.textSecondary}`}>
            {formatDate(history.completedAt)}
          </Text>
          <Text className={`text-xs ${currentTheme.classes.textAccent}`}>
            {history.totalRounds} 局
          </Text>
        </View>
        
        <View className="flex-row flex-wrap gap-2 mb-2">
          {history.players.map((player, index) => (
            <View key={player.id} className="flex-row items-center">
              <Text className={`text-base ${player.isWinner ? `font-bold ${currentTheme.classes.textAccent}` : currentTheme.classes.textPrimary}`}>
                {player.name}
              </Text>
              <Text className={`ml-1 ${player.finalScore >= 0 ? currentTheme.classes.scorePositive : currentTheme.classes.scoreNegative}`}>
                ({player.finalScore >= 0 ? '+' : ''}{player.finalScore})
              </Text>
              {index < history.players.length - 1 && (
                <Text className={`${currentTheme.classes.textSecondary} mx-1`}>|</Text>
              )}
            </View>
          ))}
        </View>

        {winner && (
          <Text className={`text-sm ${currentTheme.classes.textAccent}`}>
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
          className={`px-3 py-1 rounded-full ${currentTheme.classes.buttonDanger}`}
        >
          <Text className={`${currentTheme.classes.scoreNegative} text-sm`}>刪除</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
