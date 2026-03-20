import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Card } from '../common/Card';
import { RoundRecord, PlayerHistoryDetail } from '../../types';

interface RoundHistoryListProps {
  rounds: RoundRecord[];
  players: PlayerHistoryDetail[];
}

export function RoundHistoryList({ rounds, players }: RoundHistoryListProps) {
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
        className="mx-4 dark-panel rounded-xl border border-gold-500/30 p-4"
        style={{
          shadowColor: '#D4AF37',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 4,
        }}
      >
        <Text className="text-emerald-200 text-center py-4">
          無回合記錄
        </Text>
      </View>
    );
  }

  return (
    <View className="mx-4 mb-4">
      <Text className="text-lg font-semibold text-gold-400 mb-3">
        📊 回合記錄
      </Text>
      {rounds.map((round) => (
        <View 
          key={round.roundNumber} 
          className="mb-2 dark-panel rounded-xl border border-gold-500/30 overflow-hidden"
          style={{
            shadowColor: '#D4AF37',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 4,
          }}
        >
          <TouchableOpacity 
            onPress={() => toggleExpand(round.roundNumber)}
            className="p-3"
          >
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <Text className="text-emerald-300 mr-3">第 {round.roundNumber} 局</Text>
                <Text className="font-semibold text-gold-400">
                  {getPlayerName(round.winnerId)}
                </Text>
                <Text className="text-emerald-200 ml-2">
                  {getWinTypeText(round.winType)} {round.fan}番
                </Text>
              </View>
              <Text className="text-gold-400">
                {expandedRound === round.roundNumber ? '▼' : '▶'}
              </Text>
            </View>
          </TouchableOpacity>
          
          {expandedRound === round.roundNumber && (
            <View className="px-3 pb-3 border-t border-gold-500/30 mt-2 pt-2">
              <Text className="text-sm text-emerald-300 mb-2">支付明細：</Text>
              {round.payments.map((payment, idx) => (
                <View key={idx} className="flex-row justify-between py-1">
                  <Text className="text-white">
                    {getPlayerName(payment.fromId)} → {getPlayerName(payment.toId)}
                  </Text>
                  <Text className={payment.amount >= 0 ? 'text-green-400' : 'text-red-400'}>
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
