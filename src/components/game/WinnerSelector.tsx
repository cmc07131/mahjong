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
    <View className="flex-row justify-center">
      {players.map((player) => {
        const isSelected = selectedWinnerId === player.id;
        return (
          <TouchableOpacity
            key={player.id}
            onPress={() => !disabled && onSelectWinner(player.id)}
            disabled={disabled}
            className={`
              w-16 h-16 md:w-20 md:h-20 rounded-xl items-center justify-center mx-1.5 md:mx-2
              transition-select button-press
              ${isSelected
                ? 'gold-gradient border-2 border-gold-300 selected-glow'
                : disabled
                  ? 'bg-emerald-900/50 border border-gold-500/20'
                  : 'bg-emerald-800/80 border border-gold-500/30 active:bg-emerald-700/80'
              }
            `}
            activeOpacity={0.8}
          >
            <Text
              className={`
                font-bold text-xl md:text-2xl
                ${isSelected
                  ? 'text-emerald-950'
                  : disabled
                    ? 'text-emerald-700'
                    : 'text-white'
                }
              `}
            >
              {WIND_LABELS[player.position]}
            </Text>
            <Text
              className={`
                text-xs mt-0.5 md:mt-1
                ${isSelected
                  ? 'text-emerald-900'
                  : disabled
                    ? 'text-emerald-700'
                    : 'text-gold-300'
                }
              `}
              numberOfLines={1}
            >
              {player.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
