import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

interface FanSelectorProps {
  selectedFan: number | null;
  onSelectFan: (fan: number) => void;
  disabled?: boolean;
}

// 香港麻將番數選項 (1-13番)
const FAN_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

export function FanSelector({ selectedFan, onSelectFan, disabled = false }: FanSelectorProps) {
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
                transition-select button-press
                ${isSelected
                  ? 'gold-gradient selected-glow'
                  : disabled
                    ? 'bg-emerald-900/50'
                    : 'bg-emerald-600 active:bg-emerald-500'
                }
              `}
              activeOpacity={0.8}
            >
              <Text
                className={`
                  text-xs md:text-sm font-bold
                  ${isSelected
                    ? 'text-emerald-950'
                    : disabled
                      ? 'text-emerald-700'
                      : 'text-white'
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
