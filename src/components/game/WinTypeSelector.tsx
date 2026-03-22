import { View, Text, TouchableOpacity } from 'react-native';
import { Player, Wind, WinType, WIND_ORDER } from '../../types';
import { useThemeStore } from '../../store/themeStore';
import { useGameStore } from '../../store/gameStore';

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

// 根據座位和莊家計算門風
const getWindForSeat = (seatIndex: number, dealerIndex: number): Wind => {
  const offset = (seatIndex - dealerIndex + 4) % 4;
  return WIND_ORDER[offset];
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
  const { currentTheme } = useThemeStore();
  const dealerIndex = useGameStore((state) => state.dealerIndex);
  
  // 過濾掉贏家，只顯示可能的出銃者
  const potentialLosers = players.filter(p => p.id !== winnerId);

  const isSelfDrawSelected = selectedWinType === 'SELF_DRAW';
  const isRonSelected = selectedWinType === 'RON';

  return (
    <View>
      {/* 自摸 / 出銃 選擇 */}
      <View className="flex-row justify-center">
        <TouchableOpacity
          onPress={() => !disabled && onSelectWinType('SELF_DRAW')}
          disabled={disabled}
          className={`
            flex-1 py-3 md:py-4 rounded-xl mx-1.5 md:mx-2 items-center justify-center
            transition-select button-press border-2
            ${isSelfDrawSelected
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
              text-base md:text-lg font-bold
              ${isSelfDrawSelected
                ? currentTheme.classes.textPrimary
                : disabled
                  ? currentTheme.classes.textSecondary
                  : currentTheme.classes.textPrimary
              }
            `}
          >
            自摸
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => !disabled && onSelectWinType('RON')}
          disabled={disabled}
          className={`
            flex-1 py-3 md:py-4 rounded-xl mx-1.5 md:mx-2 items-center justify-center
            transition-select button-press border-2
            ${isRonSelected
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
              text-base md:text-lg font-bold
              ${isRonSelected
                ? currentTheme.classes.textPrimary
                : disabled
                  ? currentTheme.classes.textSecondary
                  : currentTheme.classes.textPrimary
              }
            `}
          >
            出銃
          </Text>
        </TouchableOpacity>
      </View>

      {/* 出銃者選擇 (只有選擇出銃時才顯示) */}
      {showLoserSelector && selectedWinType === 'RON' && (
        <View className="mt-3 md:mt-4">
          <Text className={`${currentTheme.classes.textAccent} text-sm md:text-base font-medium mb-2 md:mb-3 text-center`}>
            誰出銃？
          </Text>
          <View className="flex-row justify-center">
            {potentialLosers.map((player) => {
              const isSelected = selectedLoserId === player.id;
              const windLabel = WIND_LABELS[getWindForSeat(player.seatIndex, dealerIndex)];
              return (
                <TouchableOpacity
                  key={player.id}
                  onPress={() => !disabled && onSelectLoser(player.id)}
                  disabled={disabled}
                  className={`
                    w-14 h-14 md:w-16 md:h-16 rounded-xl items-center justify-center mx-1.5 md:mx-2
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
                      font-bold text-lg md:text-xl
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
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
}