import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ViewStyle, TextStyle } from 'react-native';
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

  const containerStyle: ViewStyle = {
    marginTop: 8,
  };

  const labelStyle: TextStyle = {
    fontSize: 14,
    fontWeight: '500',
    color: currentTheme.colors.text.primary,
    marginBottom: 12,
  };

  const optionsContainerStyle: ViewStyle = {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  };

  const optionStyle = (isSelected: boolean): ViewStyle => ({
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: isSelected ? currentTheme.colors.button.primary : currentTheme.colors.panel.secondary,
    borderWidth: 1,
    borderColor: isSelected ? currentTheme.colors.button.primary : currentTheme.colors.panel.border,
  });

  const optionTextStyle = (isSelected: boolean): TextStyle => ({
    fontSize: 15,
    fontWeight: '600',
    color: isSelected ? currentTheme.colors.text.primary : currentTheme.colors.text.secondary,
  });

  const customContainerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  };

  const customInputContainerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: currentTheme.colors.panel.secondary,
    borderWidth: 1,
    borderColor: isCustom ? currentTheme.colors.button.primary : currentTheme.colors.panel.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  };

  const customInputTextStyle: TextStyle = {
    fontSize: 16,
    color: currentTheme.colors.text.primary,
  };

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
    <View style={containerStyle}>
      <Text style={labelStyle}>10番多少錢？</Text>
      
      <View style={optionsContainerStyle}>
        {PRESET_AMOUNTS.map((amount) => {
          const isSelected = !isCustom && value === amount;
          return (
            <TouchableOpacity
              key={amount}
              style={optionStyle(isSelected)}
              onPress={() => handlePresetSelect(amount)}
              activeOpacity={0.7}
            >
              <Text style={optionTextStyle(isSelected)}>${amount}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={customContainerStyle}>
        <Text style={{ fontSize: 14, color: currentTheme.colors.text.secondary, marginRight: 8 }}>或自訂：</Text>
        <TextInput
          style={[customInputContainerStyle, customInputTextStyle]}
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
