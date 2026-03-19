import { View, Text, TouchableOpacity } from 'react-native';
import { Player, Wind, WinType } from '../../types';

interface WinTypeSelectorProps {
  selectedWinType: WinType | null;
  onSelectWinType: (winType: WinType) => void;
  // 出銃相關
  showLoserSelector?: boolean;
  players: Player[];
  winnerId: string | null;
  selectedLoserId: string | null;
  onSelectLoser: (playerId: string) => void;
  disabled?: boolean;
}

const WIND_LABELS: Record<Wind, string> = {
  EAST: '東',
  SOUTH: '南',
  WEST: '西',
  NORTH: '北',
};

export function WinTypeSelector({
  selectedWinType,
  onSelectWinType,
  showLoserSelector = false,
  players,
  winnerId,
  selectedLoserId,
  onSelectLoser,
  disabled = false,
}: WinTypeSelectorProps) {
  // 過濾掉贏家，只顯示可能的出銃者
  const potentialLosers = players.filter(p => p.id !== winnerId);

  return (
    <View className="mb-4">
      <Text className="text-white text-lg font-bold mb-2">步驟三：食糊方式</Text>
      
      {/* 自摸 / 出銃 選擇 */}
      <View className="flex-row gap-3 justify-center mb-2">
        <TouchableOpacity
          onPress={() => !disabled && onSelectWinType('SELF_DRAW')}
          disabled={disabled}
          className={`
            px-6 py-3 rounded-lg min-w-[100px] items-center justify-center
            ${selectedWinType === 'SELF_DRAW' 
              ? 'bg-yellow-500' 
              : disabled 
                ? 'bg-gray-600' 
                : 'bg-green-600 active:bg-green-500'
            }
          `}
        >
          <Text 
            className={`
              text-lg font-bold
              ${selectedWinType === 'SELF_DRAW' ? 'text-yellow-900' : 'text-white'}
            `}
          >
            自摸
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => !disabled && onSelectWinType('RON')}
          disabled={disabled}
          className={`
            px-6 py-3 rounded-lg min-w-[100px] items-center justify-center
            ${selectedWinType === 'RON' 
              ? 'bg-yellow-500' 
              : disabled 
                ? 'bg-gray-600' 
                : 'bg-green-600 active:bg-green-500'
            }
          `}
        >
          <Text 
            className={`
              text-lg font-bold
              ${selectedWinType === 'RON' ? 'text-yellow-900' : 'text-white'}
            `}
          >
            出銃
          </Text>
        </TouchableOpacity>
      </View>

      {/* 出銃者選擇 (只有選擇出銃時才顯示) */}
      {showLoserSelector && selectedWinType === 'RON' && (
        <View className="mt-3">
          <Text className="text-green-200 text-base font-medium mb-2 text-center">
            誰出銃？
          </Text>
          <View className="flex-row gap-2 justify-center">
            {potentialLosers.map((player) => (
              <TouchableOpacity
                key={player.id}
                onPress={() => !disabled && onSelectLoser(player.id)}
                disabled={disabled}
                className={`
                  px-4 py-2 rounded-lg min-w-[60px] items-center justify-center
                  ${selectedLoserId === player.id 
                    ? 'bg-red-500' 
                    : disabled 
                      ? 'bg-gray-600' 
                      : 'bg-green-700 active:bg-green-600'
                  }
                `}
              >
                <Text 
                  className={`
                    text-base font-bold
                    ${selectedLoserId === player.id ? 'text-white' : 'text-green-100'}
                  `}
                >
                  {WIND_LABELS[player.position]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}
