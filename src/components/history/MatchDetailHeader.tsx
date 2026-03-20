import React from 'react';
import { View, Text } from 'react-native';
import { MatchHistoryDetail } from '../../types';
import { useThemeStore } from '../../store/themeStore';

interface MatchDetailHeaderProps {
  history: MatchHistoryDetail;
}

export function MatchDetailHeader({ history }: MatchDetailHeaderProps) {
  const { currentTheme } = useThemeStore();
  
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
      className={`${currentTheme.classes.panel} p-4 ${currentTheme.classes.panelBorder}`}
      style={{
        shadowColor: currentTheme.colors.shadow.color,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: currentTheme.colors.shadow.opacity,
        shadowRadius: currentTheme.colors.shadow.radius,
        elevation: currentTheme.colors.shadow.elevation,
      }}
    >
      <Text className={`text-2xl font-bold ${currentTheme.classes.textAccent} mb-2`}>
        📋 比賽詳情
      </Text>
      <View className="flex-row justify-between">
        <Text className={currentTheme.classes.textSecondary}>
          開始: {formatDate(history.createdAt)}
        </Text>
        <Text className={currentTheme.classes.textAccent}>
          {history.totalRounds} 局
        </Text>
      </View>
      <Text className={`${currentTheme.classes.textSecondary} mt-1`}>
        結束: {formatDate(history.completedAt)}
      </Text>
    </View>
  );
}
