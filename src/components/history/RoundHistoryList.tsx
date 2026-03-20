import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Card } from '../common/Card';
import { RoundRecord, PlayerHistoryDetail } from '../../types';
import { useThemeStore } from '../../store/themeStore';

interface RoundHistoryListProps {
  rounds: RoundRecord[];
  players: PlayerHistoryDetail[];
}

export function RoundHistoryList({ rounds, players }: RoundHistoryListProps) {
  const { currentTheme } = useThemeStore();
  const [expandedRound, setExpandedRound] = useState<number | null>(null);

  const getPlayerName = (id: string) => {
    return players.find(p => p.id === id)?.name || '未知';
  };

  const getWinTypeText = (type: string) => {
    return type === 'self-drawn' ? '自摸' : '胡牌';
  };

  const toggleExpand = (roundNumber: number) => {
    setExpandedRound(expandedRound === roundNumber ? null : roundNumber);
  };

  if (rounds.length === 0) {
    return (
      <View 
        className={`mx-4 ${currentTheme.classes.panel} rounded-xl ${currentTheme.classes.panelBorder} p-4`}
        style={{
          shadowColor: currentTheme.colors.shadow.color,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: currentTheme.colors.shadow.opacity,
          shadowRadius: currentTheme.colors.shadow.radius,
          elevation: currentTheme.colors.shadow.elevation,
        }}
      >
        <Text className={`${currentTheme.classes.textSecondary} text-center py-4`}>
          無回合記錄
        </Text>
      </View>
    );
  }

  return (
    <View className="mx-4 mb-4">
      <Text className={`text-lg font-semibold ${currentTheme.classes.textAccent} mb-3`}>
        📊 回合記錄
      </Text>
      {rounds.map((round) => (
        <View 
          key={round.roundNumber} 
          className={`mb-2 ${currentTheme.classes.panel} rounded-xl ${currentTheme.classes.panelBorder} overflow-hidden`}
          style={{
            shadowColor: currentTheme.colors.shadow.color,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: currentTheme.colors.shadow.opacity,
            shadowRadius: currentTheme.colors.shadow.radius,
            elevation: currentTheme.colors.shadow.elevation,
          }}
        >
          <TouchableOpacity 
            onPress={() => toggleExpand(round.roundNumber)}
            className="p-3"
          >
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <Text className={`${currentTheme.classes.textSecondary} mr-3`}>第 {round.roundNumber} 局</Text>
                <Text className={`font-semibold ${currentTheme.classes.textAccent}`}>
                  {getPlayerName(round.winnerId)}
                </Text>
                <Text className={`${currentTheme.classes.textSecondary} ml-2`}>
                  {getWinTypeText(round.winType)} {round.fan}番
                </Text>
              </View>
              <Text className={currentTheme.classes.textAccent}>
                {expandedRound === round.roundNumber ? '▼' : '▶'}
              </Text>
            </View>
          </TouchableOpacity>
          
          {expandedRound === round.roundNumber && (
            <View className={`px-3 pb-3 ${currentTheme.classes.panelBorder} mt-2 pt-2`}>
              <Text className={`text-sm ${currentTheme.classes.textSecondary} mb-2`}>支付明細：</Text>
              {round.payments.map((payment, idx) => (
                <View key={idx} className="flex-row justify-between py-1">
                  <Text className={currentTheme.classes.textPrimary}>
                    {getPlayerName(payment.fromId)} → {getPlayerName(payment.toId)}
                  </Text>
                  <Text className={payment.amount >= 0 ? currentTheme.classes.scorePositive : currentTheme.classes.scoreNegative}>
                    {payment.amount >= 0 ? '+' : ''}{payment.amount}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      ))}
    </View>
  );
}
