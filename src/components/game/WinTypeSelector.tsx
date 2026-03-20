import { View, Text, TouchableOpacity } from 'react-native';
import { Player, Wind, WinType } from '../../types';
import { useThemeStore } from '../../store/themeStore';

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
  const { currentTheme } = useThemeStore();
  
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
            transition-select button-press
            ${isSelfDrawSelected
              ? 'gold-gradient selected-glow'
              : disabled
                ? `${currentTheme.classes.panel} ${currentTheme.classes.panelBorder}`
                : `${currentTheme.classes.buttonPrimary} ${currentTheme.classes.panelBorder} active:opacity-80`
            }
          `}
          activeOpacity={0.8}
        >
          <Text
            className={`
              text-base md:text-lg font-bold
              ${isSelfDrawSelected
                ? 'text-emerald-950'
                : disabled
                  ? `${currentTheme.classes.textSecondary}`
                  : `${currentTheme.classes.textPrimary}`
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
            transition-select button-press
            ${isRonSelected
              ? 'gold-gradient selected-glow'
              : disabled
                ? `${currentTheme.classes.panel} ${currentTheme.classes.panelBorder}`
                : `${currentTheme.classes.buttonPrimary} ${currentTheme.classes.panelBorder} active:opacity-80`
            }
          `}
          activeOpacity={0.8}
        >
          <Text
            className={`
              text-base md:text-lg font-bold
              ${isRonSelected
                ? 'text-emerald-950'
                : disabled
                  ? `${currentTheme.classes.textSecondary}`
                  : `${currentTheme.classes.textPrimary}`
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
          <Text className="text-gold-300 text-sm md:text-base font-medium mb-2 md:mb-3 text-center">
            誰出銃？
          </Text>
          <View className="flex-row justify-center">
            {potentialLosers.map((player) => {
              const isSelected = selectedLoserId === player.id;
              return (
                <TouchableOpacity
                  key={player.id}
                  onPress={() => !disabled && onSelectLoser(player.id)}
                  disabled={disabled}
                  className={`
                    w-14 h-14 md:w-16 md:h-16 rounded-xl items-center justify-center mx-1.5 md:mx-2
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
                      font-bold text-lg md:text-xl
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
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
}
