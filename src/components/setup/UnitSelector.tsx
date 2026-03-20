import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useThemeStore } from '../../store/themeStore';

interface UnitSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

const PRESET_AMOUNTS = [128, 256, 512];

export function UnitSelector({ value, onChange }: UnitSelectorProps) {
  const { currentTheme } = useThemeStore();
  const [isCustom, setIsCustom] = useState(!PRESET_AMOUNTS.includes(value));
  const [customValue, setCustomValue] = useState(value.toString());

  const handlePresetSelect = (amount: number) => {
    setIsCustom(false);
    onChange(amount);
  };

  const handleCustomChange = (text: string) => {
    setCustomValue(text);
    const numValue = parseInt(text, 10);
    if (!isNaN(numValue) && numValue > 0) {
      onChange(numValue);
    }
  };

  const handleCustomFocus = () => {
    setIsCustom(true);
  };

  return (
    <View className="mt-2">
      <Text className={`text-sm font-medium ${currentTheme.classes.textPrimary} mb-3`}>
        10番多少錢？
      </Text>
      
      <View className="flex-row flex-wrap gap-2">
        {PRESET_AMOUNTS.map((amount) => {
          const isSelected = !isCustom && value === amount;
          return (
            <TouchableOpacity
              key={amount}
              className={`
                py-2.5 px-4 rounded-lg border-2
                ${isSelected 
                  ? `${currentTheme.classes.buttonPrimary} ${currentTheme.classes.panelBorder}` 
                  : `${currentTheme.classes.panel} ${currentTheme.classes.panelBorder}`
                }
              `}
              onPress={() => handlePresetSelect(amount)}
              activeOpacity={0.7}
            >
              <Text 
                className={`text-base font-semibold ${
                  isSelected ? currentTheme.classes.textPrimary : currentTheme.classes.textSecondary
                }`}
              >
                ${amount}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View className="flex-row items-center mt-3">
        <Text className={`text-sm ${currentTheme.classes.textSecondary} mr-2`}>或自訂：</Text>
        <TextInput
          className={`
            flex-1 ${currentTheme.classes.panel} border-2 rounded-lg px-3 py-2.5
            ${isCustom ? currentTheme.classes.panelBorder : currentTheme.classes.panelBorder}
          `}
          style={{ color: currentTheme.colors.text.primary, fontSize: 16 }}
          value={isCustom ? customValue : ''}
          onChangeText={handleCustomChange}
          onFocus={handleCustomFocus}
          placeholder="輸入金額"
          placeholderTextColor={currentTheme.colors.text.muted}
          keyboardType="numeric"
        />
      </View>
    </View>
  );
}
