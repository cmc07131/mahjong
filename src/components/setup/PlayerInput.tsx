import { View, Text } from 'react-native';
import { Input } from '../common/Input';
import { Wind } from '../../types';
import { useThemeStore } from '../../store/themeStore';

interface PlayerInputProps {
  wind: Wind;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const WIND_LABELS: Record<Wind, string> = {
  EAST: '東',
  SOUTH: '南',
  WEST: '西',
  NORTH: '北',
};

export function PlayerInput({
  wind,
  label,
  value,
  onChange,
  placeholder,
}: PlayerInputProps) {
  const { currentTheme } = useThemeStore();

  return (
    <View className="flex-row items-center mb-2">
      <View 
        className={`w-9 h-9 rounded-full items-center justify-center mr-3 border-2 ${currentTheme.classes.panelBorder}`}
        style={{ backgroundColor: currentTheme.colors.button.primary }}
      >
        <Text className={`${currentTheme.classes.textPrimary} text-base font-bold`}>
          {WIND_LABELS[wind]}
        </Text>
      </View>
      <View className="flex-1">
        <Input
          value={value}
          onChangeText={onChange}
          placeholder={placeholder || `輸入${label}名稱`}
          placeholderTextColor={currentTheme.colors.text.muted}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
    </View>
  );
}
