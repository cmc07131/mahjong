import { View, Text, TouchableOpacity } from 'react-native';
import { Player, Wind, WIND_ORDER } from '../../types';
import { useThemeStore } from '../../store/themeStore';
import { useGameStore } from '../../store/gameStore';

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

// 根據座位和莊家計算門風
const getWindForSeat = (seatIndex: number, dealerIndex: number): Wind => {
  const offset = (seatIndex - dealerIndex + 4) % 4;
  return WIND_ORDER[offset];
};

export function WinnerSelector({ 
  players, 
  selectedWinnerId, 
  onSelectWinner, 
  disabled = false 
}: WinnerSelectorProps) {
  const { currentTheme } = useThemeStore();
  const dealerIndex = useGameStore((state) => state.dealerIndex);
  
  return (
    <View className="flex-row justify-center">
      {players.map((player) => {
        const isSelected = selectedWinnerId === player.id;
        const windLabel = WIND_LABELS[getWindForSeat(player.seatIndex, dealerIndex)];
        return (
          <TouchableOpacity
            key={player.id}
            onPress={() => !disabled && onSelectWinner(player.id)}
            disabled={disabled}
            className={`
              w-16 h-16 md:w-20 md:h-20 rounded-xl items-center justify-center mx-1.5 md:mx-2
              transition-select button-press border-2
              ${isSelected
                ? `${currentTheme.classes.buttonPrimary} ${currentTheme.classes.panelBorder}`
                : disabled
                  ? `${currentTheme.classes.panel} opacity-50 ${currentTheme.classes.panelBorder}`
                  : `${currentTheme.classes.panel} ${currentTheme.classes.panelBorder} active:opacity-80`
              }
            `}
            activeOpacity={0.8}
          >
            <Text
              className={`
                font-bold text-xl md:text-2xl
                ${isSelected
                  ? currentTheme.classes.textPrimary
                  : disabled
                    ? currentTheme.classes.textSecondary
                    : currentTheme.classes.textPrimary
                }
              `}
            >
              {windLabel}
            </Text>
            <Text
              className={`
                text-xs mt-0.5 md:mt-1
                ${isSelected
                  ? currentTheme.classes.textPrimary
                  : disabled
                    ? currentTheme.classes.textSecondary
                    : currentTheme.classes.textAccent
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