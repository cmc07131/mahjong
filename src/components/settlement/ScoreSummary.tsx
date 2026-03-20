import { View, Text } from 'react-native';
import { Player } from '../../types';

interface ScoreSummaryProps {
  players: Player[];
  unitAmount: number;
}

export function ScoreSummary({ players, unitAmount }: ScoreSummaryProps) {
  // 依分數排序（由高到低）
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  // 格式化金額顯示
  const formatAmount = (score: number) => {
    // score 已經是金額，不需要再乘以 unitAmount
    const amount = score;
    if (amount > 0) {
      return `+$${amount}`;
    } else if (amount < 0) {
      return `-$${Math.abs(amount)}`;
    }
    return '$0';
  };

  return (
    <View 
      className="dark-panel rounded-xl p-4 border border-gold-500/30"
      style={{
        shadowColor: '#D4AF37',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
      }}
    >
      <Text className="text-xl font-bold text-gold-400 mb-4 text-center">
        🏆 總成績單
      </Text>
      
      <View className="space-y-3">
        {sortedPlayers.map((player, index) => {
          // player.score 已經是金額，不需要再乘以 unitAmount
          const amount = player.score;
          const isWinner = amount > 0;
          const isLoser = amount < 0;
          
          return (
            <View
              key={player.id}
              className={`flex-row justify-between items-center py-3 px-4 rounded-xl ${
                index === 0 ? 'bg-emerald-800/50 border border-gold-500/30' : 'bg-emerald-900/30'
              }`}
            >
              <View className="flex-row items-center">
                {index === 0 && <Text className="mr-2">👑</Text>}
                <Text className={`text-lg font-medium ${index === 0 ? 'text-gold-400 font-bold' : 'text-white'}`}>
                  {player.name}
                </Text>
              </View>
              <Text
                className={`text-lg font-bold ${
                  isWinner
                    ? 'text-green-400'
                    : isLoser
                    ? 'text-red-400'
                    : 'text-emerald-200'
                }`}
              >
                {formatAmount(player.score)}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
