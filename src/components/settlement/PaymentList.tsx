import { View, Text } from 'react-native';
import { Settlement } from '../../utils/settlement';
import { Player } from '../../types';

interface PaymentListProps {
  settlements: Settlement[];
  players: Player[];
  unitAmount: number;
}

export function PaymentList({ settlements, players, unitAmount }: PaymentListProps) {
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
      <View className="bg-white rounded-2xl p-4 shadow-lg">
        <Text className="text-xl font-bold text-gray-800 mb-4 text-center">
          最簡化找數
        </Text>
        <Text className="text-center text-gray-500 py-4">
          沒有需要結算的金額
        </Text>
      </View>
    );
  }

  return (
    <View className="bg-white rounded-2xl p-4 shadow-lg">
      <Text className="text-xl font-bold text-gray-800 mb-4 text-center">
        最簡化找數
      </Text>
      
      <View className="space-y-3">
        {settlements.map((settlement, index) => {
          const fromName = getPlayerName(settlement.from);
          const toName = getPlayerName(settlement.to);
          const amount = settlement.amount * unitAmount;
          
          return (
            <View
              key={`${settlement.from}-${settlement.to}-${index}`}
              className="flex-row items-center justify-between py-3 px-4 rounded-xl bg-gray-50"
            >
              <View className="flex-row items-center flex-1">
                <View className="bg-red-100 rounded-lg px-3 py-1.5">
                  <Text className="text-red-700 font-medium">
                    {fromName}
                  </Text>
                </View>
                
                <View className="flex-row items-center mx-2">
                  <Text className="text-gray-400 text-sm">➔</Text>
                  <Text className="text-gray-500 text-xs mx-1">轉給</Text>
                </View>
                
                <View className="bg-green-100 rounded-lg px-3 py-1.5">
                  <Text className="text-green-700 font-medium">
                    {toName}
                  </Text>
                </View>
              </View>
              
              <Text className="text-lg font-bold text-gray-800 ml-2">
                {formatAmount(amount)}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
