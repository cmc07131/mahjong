import { View, Text, TouchableOpacity } from 'react-native';
import { Player, Wind } from '../../types';

interface WinnerSelectorProps {
  players: Player[];
  selectedWinnerId: string | null;
  onSelectWinner: (playerId: string) => void;
  disabled?: boolean;
}

const WIND_LABELS: Record<Wind, string> = {
  EAST: '東',
  SOUTH: '南',
  WEST: '西',
  NORTH: '北',
};

export function WinnerSelector({ 
  players, 
  selectedWinnerId, 
  onSelectWinner, 
  disabled = false 
}: WinnerSelectorProps) {
  return (
    <View className="mb-4">
      <Text className="text-white text-lg font-bold mb-2">步驟二：誰食糊？</Text>
      <View className="flex-row gap-2 justify-center">
        {players.map((player) => (
          <TouchableOpacity
            key={player.id}
            onPress={() => !disabled && onSelectWinner(player.id)}
            disabled={disabled}
            className={`
              px-5 py-3 rounded-lg min-w-[70px] items-center justify-center
              ${selectedWinnerId === player.id 
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
                ${selectedWinnerId === player.id ? 'text-yellow-900' : 'text-white'}
              `}
            >
              {WIND_LABELS[player.position]}
            </Text>
            <Text 
              className={`
                text-xs
                ${selectedWinnerId === player.id ? 'text-yellow-800' : 'text-green-200'}
              `}
              numberOfLines={1}
            >
              {player.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
