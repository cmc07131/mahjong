import { View, Text, TextStyle, ViewStyle } from 'react-native';
import { Input } from '../common/Input';
import { Wind } from '../../types';

interface PlayerInputProps {
  wind: Wind;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const WIND_COLORS: Record<Wind, string> = {
  EAST: '#dc2626',   // 紅色 - 東
  SOUTH: '#16a34a',  // 綠色 - 南
  WEST: '#2563eb',   // 藍色 - 西
  NORTH: '#1f2937',  // 黑色 - 北
};

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
  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  };

  const windBadgeStyle: ViewStyle = {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: WIND_COLORS[wind],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  };

  const windTextStyle: TextStyle = {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  };

  const inputContainerStyle: ViewStyle = {
    flex: 1,
  };

  return (
    <View style={containerStyle}>
      <View style={windBadgeStyle}>
        <Text style={windTextStyle}>{WIND_LABELS[wind]}</Text>
      </View>
      <View style={inputContainerStyle}>
        <Input
          value={value}
          onChangeText={onChange}
          placeholder={placeholder || `輸入${label}名稱`}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
    </View>
  );
}
