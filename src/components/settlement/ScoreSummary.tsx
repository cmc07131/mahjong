import { View, Text } from 'react-native';
import { Player } from '../../types';
import { useThemeStore } from '../../store/themeStore';

interface ScoreSummaryProps {
  players: Player[];
  unitAmount: number;
}

export function ScoreSummary({ players, unitAmount }: ScoreSummaryProps) {
  const { currentTheme } = useThemeStore();
  
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
      className={`${currentTheme.classes.panel} rounded-xl p-4 ${currentTheme.classes.panelBorder}`}
      style={{
        shadowColor: currentTheme.colors.shadow.color,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: currentTheme.colors.shadow.opacity,
        shadowRadius: currentTheme.colors.shadow.radius,
        elevation: currentTheme.colors.shadow.elevation,
      }}
    >
      <Text className={`text-xl font-bold ${currentTheme.classes.textAccent} mb-4 text-center`}>
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
                index === 0 ? `${currentTheme.classes.panel} ${currentTheme.classes.panelBorder}` : currentTheme.classes.panel
              }`}
            >
              <View className="flex-row items-center">
                {index === 0 && <Text className="mr-2">👑</Text>}
                <Text className={`text-lg font-medium ${index === 0 ? `font-bold ${currentTheme.classes.textAccent}` : currentTheme.classes.textPrimary}`}>
                  {player.name}
                </Text>
              </View>
              <Text
                className={`text-lg font-bold ${
                  isWinner
                    ? currentTheme.classes.scorePositive
                    : isLoser
                    ? currentTheme.classes.scoreNegative
                    : currentTheme.classes.textSecondary
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
