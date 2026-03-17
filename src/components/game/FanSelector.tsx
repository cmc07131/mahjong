import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

interface FanSelectorProps {
  selectedFan: number | null;
  onSelectFan: (fan: number) => void;
  disabled?: boolean;
}

// 香港麻將番數選項 (1-8番，但實際計算時 6,7,8番都當5番計算)
const FAN_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8];

export function FanSelector({ selectedFan, onSelectFan, disabled = false }: FanSelectorProps) {
  return (
    <View className="mb-4">
      <Text className="text-white text-lg font-bold mb-2">步驟一：選擇番數</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="flex-row"
      >
        <View className="flex-row gap-2">
          {FAN_OPTIONS.map((fan) => (
            <TouchableOpacity
              key={fan}
              onPress={() => !disabled && onSelectFan(fan)}
              disabled={disabled}
              className={`
                px-4 py-3 rounded-lg min-w-[56px] items-center justify-center
                ${selectedFan === fan 
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
                  ${selectedFan === fan ? 'text-yellow-900' : 'text-white'}
                `}
              >
                {fan}番
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
