import { View, Text } from 'react-native';
import { Settlement } from '../../utils/settlement';
import { Player } from '../../types';
import { useThemeStore } from '../../store/themeStore';

interface PaymentListProps {
  settlements: Settlement[];
  players: Player[];
  unitAmount: number;
}

export function PaymentList({ settlements, players, unitAmount }: PaymentListProps) {
  const { currentTheme } = useThemeStore();
  
  // 根據玩家 ID 取得玩家名稱
  const getPlayerName = (playerId: string) => {
    const player = players.find((p) => p.id === playerId);
    return player?.name || '未知';
  };

  // 格式化金額
  const formatAmount = (amount: number) => {
    return `$${amount}`;
  };

  if (settlements.length === 0) {
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
          💰 最簡化找數
        </Text>
        <Text className={`text-center ${currentTheme.classes.textSecondary} py-4`}>
          沒有需要結算的金額
        </Text>
      </View>
    );
  }

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
        💰 最簡化找數
      </Text>
      
      <View className="space-y-3">
        {settlements.map((settlement, index) => {
          const fromName = getPlayerName(settlement.from);
          const toName = getPlayerName(settlement.to);
          // settlement.amount 已經是金額，不需要再乘以 unitAmount
          const amount = settlement.amount;
          
          return (
            <View
              key={`${settlement.from}-${settlement.to}-${index}`}
              className={`flex-row items-center justify-between py-3 px-4 rounded-xl ${currentTheme.classes.panel}`}
            >
              <View className="flex-row items-center flex-1">
                <View className={`${currentTheme.classes.buttonDanger} rounded-lg px-3 py-1.5`}>
                  <Text className={`${currentTheme.classes.scoreNegative} font-medium`}>
                    {fromName}
                  </Text>
                </View>
                
                <View className="flex-row items-center mx-2">
                  <Text className={`${currentTheme.classes.textAccent} text-sm`}>➔</Text>
                  <Text className={`${currentTheme.classes.textSecondary} text-xs mx-1`}>轉給</Text>
                </View>
                
                <View className={`${currentTheme.classes.buttonPrimary} rounded-lg px-3 py-1.5`}>
                  <Text className={`${currentTheme.classes.scorePositive} font-medium`}>
                    {toName}
                  </Text>
                </View>
              </View>
              
              <Text className={`text-lg font-bold ${currentTheme.classes.textAccent} ml-2`}>
                {formatAmount(amount)}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
