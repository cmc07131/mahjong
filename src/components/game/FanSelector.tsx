import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useThemeStore } from '../../store/themeStore';

interface FanSelectorProps {
  selectedFan: number | null;
  onSelectFan: (fan: number) => void;
  disabled?: boolean;
}

// 香港麻將番數選項 (3-13番, minimum 3番 to eat woo/食糊)
const FAN_OPTIONS = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

export function FanSelector({ selectedFan, onSelectFan, disabled = false }: FanSelectorProps) {
  const { currentTheme } = useThemeStore();
  
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      className="flex-row"
      contentContainerStyle={{ paddingHorizontal: 4 }}
    >
      <View className="flex-row">
        {FAN_OPTIONS.map((fan) => {
          const isSelected = selectedFan === fan;
          return (
            <TouchableOpacity
              key={fan}
              onPress={() => !disabled && onSelectFan(fan)}
              disabled={disabled}
              className={`
                w-10 h-10 md:w-12 md:h-12 rounded-lg items-center justify-center mx-1
                transition-select button-press border-2
                ${isSelected
                  ? `${currentTheme.classes.buttonPrimary} ${currentTheme.classes.panelBorder}`
                  : disabled
                    ? `${currentTheme.classes.panel} opacity-50`
                    : `${currentTheme.classes.panel} ${currentTheme.classes.panelBorder} active:opacity-80`
                }
              `}
              activeOpacity={0.8}
            >
              <Text
                className={`
                  text-xs md:text-sm font-bold
                  ${isSelected
                    ? currentTheme.classes.textPrimary
                    : disabled
                      ? currentTheme.classes.textSecondary
                      : currentTheme.classes.textPrimary
                  }
                `}
              >
                {fan}番
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}
