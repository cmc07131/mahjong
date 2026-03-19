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
    const amount = score * unitAmount;
    if (amount > 0) {
      return `+$${amount}`;
    } else if (amount < 0) {
      return `-$${Math.abs(amount)}`;
    }
    return '$0';
  };

  return (
    <View className="bg-white rounded-2xl p-4 shadow-lg">
      <Text className="text-xl font-bold text-gray-800 mb-4 text-center">
        總成績單
      </Text>
      
      <View className="space-y-3">
        {sortedPlayers.map((player) => {
          const amount = player.score * unitAmount;
          const isWinner = amount > 0;
          const isLoser = amount < 0;
          
          return (
            <View
              key={player.id}
              className="flex-row justify-between items-center py-3 px-4 rounded-xl bg-gray-50"
            >
              <Text className="text-lg font-medium text-gray-800">
                {player.name}
              </Text>
              <Text
                className={`text-lg font-bold ${
                  isWinner
                    ? 'text-green-600'
                    : isLoser
                    ? 'text-red-500'
                    : 'text-gray-600'
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
