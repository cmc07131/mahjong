import { View, Text, TouchableOpacity } from 'react-native';
import { Player, Wind } from '../../types';
import { useThemeStore } from '../../store/themeStore';

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
  const { currentTheme } = useThemeStore();
  
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
                  ? `${currentTheme.classes.panel} ${currentTheme.classes.panelBorder}`
                  : `${currentTheme.classes.panel} ${currentTheme.classes.panelBorder} active:opacity-80`
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
                    ? `${currentTheme.classes.textSecondary}`
                    : `${currentTheme.classes.textPrimary}`
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
                    ? `${currentTheme.classes.textSecondary}`
                    : `${currentTheme.classes.textAccent}`
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
